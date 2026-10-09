---
name: pages-site
description: Change and redeploy a Cloudflare Pages website from just its link, on any device. Use whenever the user gives a *.pages.dev link (a site, or a game or folder on one) and asks to update, change, fix, add to, push to or deploy that site, or to put a build on it. Pulls the exact live site, edits it locally, deploys to a preview, verifies, then deploys live. Never deploy a Pages site from any other local copy or with a bare wrangler pages deploy.
---

# Pages site: edit from a link

A Cloudflare Pages deploy **replaces the whole site**. The user deploys from more than one device, so
any local copy can be out of date, and deploying it would silently undo the other device's work.
This skill always starts from exactly what is live and refuses to deploy over newer work.

The site's complete file list (path → sha256) is stored **privately** in the user's Cloudflare
account (Workers KV namespace `pages-site-manifests`, key `pages:<project>`). Hidden folders such as
unlisted demo links are never published in a public list.

Tool: `scripts/site.mjs` next to this file (Node 18+, no dependencies, uses `npx wrangler@4`).
Below, `SITE` means `node <this skill folder>/scripts/site.mjs`.

## Workflow

1. **Pull** the live site (project = the `<project>` in `<project>.pages.dev`; a preview alias
   `<branch>.<project>.pages.dev` works too):

       SITE pull <link>

   It goes to `~/sites/<project>/` by default (`--dir` to choose). It downloads only what differs,
   checks every file against the saved list, and refuses to overwrite undeployed local edits
   (`--force` throws them away; ask the user first).

2. **Edit** inside that folder. The link's path tells you which part of the site the user means
   (e.g. `/mwt-5eb90827e29c/` is a game folder). For a build the user hands you (a zip, another
   folder), copy only its deployable files into that path: no dev tools, `package.json`, sources,
   notes, or dotfiles, unless they were already part of the site.

3. **Review** with `SITE status <folder>`: it lists changed / added / removed files. Anything
   outside the part the user asked about should not be in that list.

4. **Test** locally if the change is visible (serve the folder, open the page, check the console).

5. **Deploy**:

       SITE deploy <folder>

   preview deploy (branch `claude-preview`) → every file verified on the preview URL → live deploy →
   every file verified live → the private list is updated. If the live site changed since the pull it
   **stops**: pull again, re-apply the edits, deploy again. Don't work around this.

6. Tell the user the live link, what changed, and that rollback is in Cloudflare dashboard >
   Pages > `<project>` > Deployments.

## First time for a site

If `pull` says there is no saved list, the site has never been registered. Find the folder that
was last deployed (or rebuild one that equals live) and run `SITE init <link> --dir <folder>`: it
checks every file against the live site before saving the list. `init` cannot see live files that
are missing from the folder, so confirm with the user that the folder is complete.

If a `pull` fails with "doesn't match the saved file list", someone deployed without this tool.
Ask the user which device did it, and re-`init` from that deployment's folder.

## Rules

- Never `wrangler pages deploy` a site directly, and never deploy from a folder that wasn't pulled.
- Don't print or publish the site's file list; unlisted paths are meant to stay unlisted.
- Needs a Wrangler login on the device (`npx wrangler login`), the same one used for deploying.
- A site on a custom domain: ask for its `*.pages.dev` address (Pages dashboard) and use that.
