#!/usr/bin/env node
// pages-site: edit a Cloudflare Pages site from just its link, from any device.
//
// A Pages deploy replaces the WHOLE site, so every deploy must start from exactly what is live.
// The complete file list (path -> sha256) lives privately in the account's Workers KV
// (namespace "pages-site-manifests", key "pages:<project>"), so hidden folders are never published
// in a public list. Files are downloaded from the live site and checked against that list.
//
//   node site.mjs pull   <link> [--dir <folder>] [--force]   live site -> local folder
//   node site.mjs status [<folder>]                          what you changed since the pull
//   node site.mjs deploy [<folder>]                          preview -> verify -> live -> verify -> save list
//   node site.mjs init   <link> --dir <folder>               one-time: register a folder that equals live
//
// Needs Node 18+ and a Wrangler login for the account (npx wrangler login). No other dependencies.
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const NS_TITLE = 'pages-site-manifests';
const PULL_FILE = '.site-pull.json';
const UA = { 'user-agent': 'curl/8.7.1' }; // the site blocks some default script user agents
const PREVIEW_BRANCH = 'claude-preview';

// ---------- small helpers ----------
const die = (msg) => { console.error('\n✘ ' + msg); process.exit(1); };
const sha = (buf) => createHash('sha256').update(buf).digest('hex');
const argv = process.argv.slice(2);
const flag = (name) => { const i = argv.indexOf(name); if (i < 0) return null; const v = argv[i + 1]; argv.splice(i, 2); return v ?? ''; };
const bool = (name) => { const i = argv.indexOf(name); if (i < 0) return false; argv.splice(i, 1); return true; };

function parseLink(link) {
  if (!link) die('Give the site link, e.g. https://my-site.pages.dev/');
  if (!/^https?:\/\//.test(link)) link = 'https://' + link;
  const u = new URL(link);
  const labels = u.hostname.split('.');
  if (labels.slice(-2).join('.') !== 'pages.dev' || labels.length < 3) die(`${u.hostname} is not a *.pages.dev address.`);
  const project = labels[labels.length - 3]; // preview aliases look like <branch>.<project>.pages.dev
  return { project, origin: `https://${project}.pages.dev`, sub: u.pathname.replace(/^\/+|\/+$/g, '') };
}

// files in a folder, as posix paths, skipping dotfiles/dotfolders (the pull record, .DS_Store, .git...)
function walk(dir, base = dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.') || e.name === 'node_modules') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, base, out);
    else if (e.isFile()) out.push(path.relative(base, p).split(path.sep).join('/'));
  }
  return out.sort();
}
const listOf = (dir) => Object.fromEntries(walk(dir).map((f) => [f, sha(fs.readFileSync(path.join(dir, f)))]));
const listHash = (files) => sha(Object.entries(files).sort().map(([p, h]) => `${h}  ${p}`).join('\n'));

// fetch that never throws: network failures come back as status 0
async function get(url) {
  try { const r = await fetch(url, { headers: UA }); return { ok: r.ok, status: r.status, buf: Buffer.from(await r.arrayBuffer()) }; }
  catch (e) { return { ok: false, status: `network error: ${e.cause?.code || e.message}`, buf: Buffer.alloc(0) }; }
}

// index.html is served at its folder URL (the site redirects /index.html)
const urlFor = (origin, p) => `${origin}/${p.replace(/(^|\/)index\.html$/, '$1')}`.replace(/ /g, '%20');

async function download(origin, p, want) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    const r = await get(urlFor(origin, p));
    const buf = r.buf;
    if (r.ok && sha(buf) === want) return buf;
    if (attempt === 3) die(`${p} on ${origin} doesn't match the saved file list (HTTP ${r.status}).\n` +
      `Either a deploy is still finishing (try again in a minute), or someone deployed WITHOUT this tool, so the list is stale.\n` +
      `In that case get the folder that was deployed and run: node site.mjs init ${origin}/ --dir <that folder>`);
    await new Promise((res) => setTimeout(res, 1500 * attempt));
  }
}

// check every file on the site; mismatches get re-checked (a fresh deploy can take a few seconds to settle)
async function verifyRemote(origin, files, label) {
  let todo = Object.entries(files), bad = [];
  for (let round = 1; round <= 4 && todo.length; round++) {
    if (round > 1) await new Promise((r) => setTimeout(r, 5000 * (round - 1)));
    bad = [];
    for (let i = 0; i < todo.length; i += 12) {
      const res = await Promise.all(todo.slice(i, i + 12).map(async ([p, h]) => {
        const r = await get(urlFor(origin, p));
        return r.ok && sha(r.buf) === h ? null : [p, h, r.status];
      }));
      bad.push(...res.filter(Boolean));
    }
    todo = bad.map(([p, h]) => [p, h]);
  }
  if (bad.length) die(`${label}: ${bad.length} file(s) don't match, e.g. ${bad.slice(0, 5).map(([p, , st]) => `${p} (${st})`).join(', ')}`);
  console.log(`  ${label}: all ${Object.keys(files).length} files match`);
}

// ---------- wrangler / KV ----------
function wrangler(args, { input, quiet = false } = {}) {
  const isWin = process.platform === 'win32';
  const q = (a) => (/[\s"&|<>^]/.test(a) ? `"${a.replace(/"/g, '\\"')}"` : a);
  const r = spawnSync(isWin ? 'npx.cmd' : 'npx', ['--yes', 'wrangler@4', ...args].map(isWin ? q : (a) => a),
    { encoding: 'utf8', input, shell: isWin, maxBuffer: 64 * 1024 * 1024 });
  if (r.status !== 0) die(`wrangler ${args.slice(0, 3).join(' ')} failed:\n${(r.stderr || r.stdout || '').trim().split('\n').slice(-8).join('\n')}\n(Not logged in on this device? Run: npx wrangler login)`);
  if (!quiet) process.stdout.write('');
  return r.stdout;
}
let nsId = null;
function namespace() {
  if (nsId) return nsId;
  const out = wrangler(['kv', 'namespace', 'list'], { quiet: true });
  const list = JSON.parse(out.slice(out.indexOf('[')));
  let ns = list.find((n) => n.title === NS_TITLE);
  if (!ns) {
    wrangler(['kv', 'namespace', 'create', NS_TITLE], { quiet: true });
    const again = wrangler(['kv', 'namespace', 'list'], { quiet: true });
    ns = JSON.parse(again.slice(again.indexOf('['))).find((n) => n.title === NS_TITLE);
  }
  return (nsId = ns.id);
}
function readList(project) {
  const isWin = process.platform === 'win32';
  const r = spawnSync(isWin ? 'npx.cmd' : 'npx', ['--yes', 'wrangler@4', 'kv', 'key', 'get', `pages:${project}`, '--namespace-id', namespace(), '--remote', '--text'],
    { encoding: 'utf8', shell: isWin, maxBuffer: 64 * 1024 * 1024 });
  const out = (r.stdout || '').trim();
  if (r.status !== 0 || !out.startsWith('{')) return null;
  return JSON.parse(out);
}
function saveList(project, files, note) {
  const doc = { project, updated: new Date().toISOString(), by: `${os.userInfo().username}@${os.hostname()}`, note, files };
  const tmp = path.join(os.tmpdir(), `pages-site-${project}-${process.pid}.json`);
  fs.writeFileSync(tmp, JSON.stringify(doc));
  wrangler(['kv', 'key', 'put', `pages:${project}`, '--path', tmp, '--namespace-id', namespace(), '--remote'], { quiet: true });
  fs.rmSync(tmp, { force: true });
  return doc;
}

// ---------- commands ----------
async function pull() {
  const link = argv.shift();
  const { project, origin } = parseLink(link);
  const dir = path.resolve(flag('--dir') || path.join(os.homedir(), 'sites', project));
  const force = bool('--force');
  const live = readList(project);
  if (!live) die(`No saved file list for ${project} yet. Run "init" once from a folder that equals the live site.`);

  const record = path.join(dir, PULL_FILE);
  if (fs.existsSync(record) && !force) {
    const base = JSON.parse(fs.readFileSync(record, 'utf8'));
    const mine = listOf(dir);
    if (listHash(mine) !== listHash(base.files)) die(`${dir} has changes that aren't deployed yet. Deploy them, or pull with --force to throw them away.`);
  }
  fs.mkdirSync(dir, { recursive: true });
  const local = fs.existsSync(dir) ? listOf(dir) : {};
  let got = 0, kept = 0, removed = 0;
  const entries = Object.entries(live.files);
  for (let i = 0; i < entries.length; i += 12) {
    await Promise.all(entries.slice(i, i + 12).map(async ([p, h]) => {
      if (local[p] === h) { kept++; return; }
      const buf = await download(origin, p, h);
      const f = path.join(dir, ...p.split('/'));
      fs.mkdirSync(path.dirname(f), { recursive: true });
      fs.writeFileSync(f, buf);
      got++;
    }));
  }
  for (const p of Object.keys(local)) if (!(p in live.files)) { fs.rmSync(path.join(dir, ...p.split('/'))); removed++; }
  fs.writeFileSync(record, JSON.stringify({ project, origin, pulledAt: new Date().toISOString(), listUpdated: live.updated, files: live.files }, null, 1));
  console.log(`Pulled ${project}: ${entries.length} files (${got} downloaded, ${kept} already here, ${removed} removed).`);
  console.log(`Folder: ${dir}`);
  console.log(`Live list last saved ${live.updated} by ${live.by}${live.note ? ` (${live.note})` : ''}.`);
}

function diff(dir) {
  const record = path.join(dir, PULL_FILE);
  if (!fs.existsSync(record)) die(`${dir} wasn't pulled with this tool (no ${PULL_FILE}). Run pull first.`);
  const base = JSON.parse(fs.readFileSync(record, 'utf8'));
  const mine = listOf(dir);
  const changed = [], added = [], removed = [];
  for (const [p, h] of Object.entries(mine)) if (!(p in base.files)) added.push(p); else if (base.files[p] !== h) changed.push(p);
  for (const p of Object.keys(base.files)) if (!(p in mine)) removed.push(p);
  return { base, mine, changed, added, removed };
}

function status() {
  const dir = path.resolve(argv.shift() || '.');
  const { base, changed, added, removed } = diff(dir);
  console.log(`${base.project}: pulled ${base.pulledAt}`);
  if (!changed.length && !added.length && !removed.length) return console.log('No local changes.');
  for (const p of changed) console.log('  changed ' + p);
  for (const p of added) console.log('  added   ' + p);
  for (const p of removed) console.log('  removed ' + p);
}

async function deploy() {
  const dir = path.resolve(argv.shift() || '.');
  const { base, mine, changed, added, removed } = diff(dir);
  const { project, origin } = base;
  if (!changed.length && !added.length && !removed.length) die('Nothing to deploy: no changes since the pull.');
  console.log(`Deploying ${project}: ${changed.length} changed, ${added.length} added, ${removed.length} removed.`);

  const live = readList(project);
  if (!live || listHash(live.files) !== listHash(base.files)) {
    die(`The live site changed since you pulled (saved ${live?.updated} by ${live?.by}). Deploying now would undo that.\n` +
      `Copy your edits aside, pull again, re-apply them, then deploy.`);
  }

  // stage exactly the tracked files (no dotfiles) and deploy to a preview first
  const stage = fs.mkdtempSync(path.join(os.tmpdir(), `pages-site-${project}-`));
  for (const p of Object.keys(mine)) {
    const f = path.join(stage, ...p.split('/'));
    fs.mkdirSync(path.dirname(f), { recursive: true });
    fs.copyFileSync(path.join(dir, ...p.split('/')), f);
  }
  try {
    console.log('1/4 preview deploy...');
    wrangler(['pages', 'deploy', stage, '--project-name', project, '--branch', PREVIEW_BRANCH, '--commit-dirty=true'], { quiet: true });
    console.log('2/4 checking preview...');
    await verifyRemote(`https://${PREVIEW_BRANCH}.${project}.pages.dev`, mine, 'preview');
    console.log('3/4 live deploy...');
    wrangler(['pages', 'deploy', stage, '--project-name', project, '--branch', 'main', '--commit-dirty=true'], { quiet: true });
    await new Promise((r) => setTimeout(r, 4000));
    console.log('4/4 checking live...');
    await verifyRemote(origin, mine, 'live');
  } finally {
    fs.rmSync(stage, { recursive: true, force: true });
  }
  const doc = saveList(project, mine, [...changed, ...added].slice(0, 6).join(', ') + (removed.length ? ` (-${removed.length})` : ''));
  fs.writeFileSync(path.join(dir, PULL_FILE), JSON.stringify({ ...base, pulledAt: doc.updated, listUpdated: doc.updated, files: mine }, null, 1));
  console.log(`\nLive: ${origin}/  (rollback: Cloudflare dashboard > Pages > ${project} > Deployments)`);
}

async function init() {
  const link = argv.shift();
  const { project, origin } = parseLink(link);
  const dirArg = flag('--dir');
  if (!dirArg) die('init needs --dir <folder that is identical to the live site>');
  const dir = path.resolve(dirArg);
  const files = listOf(dir);
  console.log(`Checking all ${Object.keys(files).length} files in ${dir} against ${origin} ...`);
  await verifyRemote(origin, files, 'live vs folder');
  const doc = saveList(project, files, 'init');
  fs.writeFileSync(path.join(dir, PULL_FILE), JSON.stringify({ project, origin, pulledAt: doc.updated, listUpdated: doc.updated, files }, null, 1));
  console.log(`Saved the file list for ${project}. Any device can now: node site.mjs pull ${origin}/`);
}

const cmd = argv.shift();
const run = { pull, status, deploy, init }[cmd];
if (!run) {
  console.log('usage: node site.mjs pull <link> [--dir <folder>] [--force] | status [<folder>] | deploy [<folder>] | init <link> --dir <folder>');
  process.exit(cmd ? 1 : 0);
}
await run();
