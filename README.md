# ART-PIPELINE-MCP

One neutral production toolchain that takes a layered **PSD** to a game-ready **Spine** package, with **After Effects** used only where raster FX genuinely earn it. Any MCP client can drive it: Codex, the OpenAI Responses API, ChatGPT (where custom MCP is available) and Claude Code.

> One server. Multiple brains. The model reasons; the MCP does deterministic production work.

Status: **v0.2.0, roadmap steps 1-3 done.** The full tested engine (Spine 4.2 meshes, heat weights, IK, physics, turn rigs, slot juice, ~28 FX recipes, AE bridge, budget QA; 49 tools, 1169 tests) now lives here as the `art_pipeline` package, ported from [CLAUDE-SPINE](https://github.com/kumikilongyeyo/CLAUDE-SPINE) with no algorithm changes. `claude_spine` and the `claude-spine` command remain as aliases. Orchestration (`pipeline.*`), manifests and HTTP transport are next, see [docs/ROADMAP.md](docs/ROADMAP.md).

## Quick start

```bash
uvx --from git+https://github.com/kumikilongyeyo/ART-PIPELINE-MCP art-pipeline
```

- **Codex:** [docs/CODEX.md](docs/CODEX.md)
- **Claude Code:** `claude mcp add -s user art-pipeline -- uvx --from git+https://github.com/kumikilongyeyo/ART-PIPELINE-MCP art-pipeline`

Engine reference: [docs/RIGS.md](docs/RIGS.md), [docs/FX_RECIPES.md](docs/FX_RECIPES.md).

## Why not `GPT-SPINE`?

GPT is a client, not part of the architecture. The Spine/PSD/AE logic never depended on a model; only naming, install instructions and transport did. Making a per-vendor fork means maintaining two Spine backends. This repo is the single backend.

```text
                    ┌─ Codex
                    │
ART-PIPELINE-MCP ───┼─ OpenAI Responses API
                    │
                    ├─ ChatGPT MCP (where available)
                    │
                    └─ Claude Code
```

## Pipeline

```text
PSD ─ inspect layers ─ classify artwork ─ crop/export
                         │
                         ▼
                       SPINE
        mesh · bones · weights · IK · physics · animation · procedural FX
                         │
              ┌──────────┴──────────┐
              ▼                     ▼
          native FX              AE FX  (glow/bloom, fire, lightning,
                                  │      fluid, distortion, shockwave)
                              aerender
                                  │
                           frame sequence ──► back into SPINE
                                  │
                     runtime validation (spine-core)
                     mobile budget check
                     preview GIF
                                  │
                                  ▼
                       .spine / JSON / atlas
```

**Rule of thumb for AE:** Spine's procedural FX are far cheaper at runtime, so use Spine for motion, scale, squash, trails, particles, coins, sparkles, UI and win feedback. Use AE only for glow/bloom, fire, lightning, fluids, distortion, complex shockwaves, caustics and optical flare. `ae_fx_to_spine` brings the result back as a sequence attachment.

## Tool surface

Raw tools stay internal. By default the server exposes a small set of high-level tools so the agent does not burn context choosing between 50-100 low-level calls. Low-level tools are reachable through `spine.edit` for corrections.

| Namespace | Default tools |
|---|---|
| `asset` | `asset.inspect`, `asset.prepare` |
| `spine` | `spine.rig`, `spine.animate`, `spine.edit` |
| `fx` | `fx.create`, `fx.import_ae` |
| `pipeline` | `pipeline.symbol`, `pipeline.character`, `pipeline.slot_screen` |
| `qa` | `qa.check`, `qa.preview` |
| `export` | `export.spine`, `export.runtime` |

Target example:

> Import `bomb.psd`, identify the bomb, liquid splash and droplets. Rig the bomb, give the liquid secondary deformation, create anticipation, explosion and win_loop. Use AE for the flash and bloom only. Keep it under the `mobile_symbol` budget. Give me the Spine file and a preview GIF.

## Asset manifest

The model edits a manifest; the tools consume predictable structured data, so bone and layer names are never hallucinated per run. See [examples/bomb_candy.asset.json](examples/bomb_candy.asset.json).

## Project state

`.artmcp/project.json` records which PSD produced which Spine project, the AE source comp, animation list, atlas settings and validation status, so jobs resume instead of being rediscovered each session.

## Transports

- **stdio** (local): Codex, Claude Code.
- **Streamable HTTP** (planned): OpenAI Responses API remote MCP, and private servers via Secure MCP Tunnel.

## FRONTEND Slots Agent

This repo includes a Claude Code specialist rebuilt from the actual **Slot Engines Source Pack**:

- Agent: [.claude/agents/frontend-slots-agent.md](.claude/agents/frontend-slots-agent.md)
- Agent docs: [docs/agents/frontend-slots-agent/](docs/agents/frontend-slots-agent/README.md)
- Source-engine selection map: [SOURCE_ENGINE_MAP.md](docs/agents/frontend-slots-agent/SOURCE_ENGINE_MAP.md)
- Source-pack audit: [AUDIT.md](docs/agents/frontend-slots-agent/AUDIT.md)

### Install or update (any project, macOS or Windows)

Installs the agent for your user, so it shows up in every project, not only this repo. Run the same command again to update.

macOS / Linux (Terminal):

    curl -fsSL https://raw.githubusercontent.com/kumikilongyeyo/ART-PIPELINE-MCP/main/scripts/install-frontend-slots-agent.sh | bash

Windows (PowerShell):

    irm https://raw.githubusercontent.com/kumikilongyeyo/ART-PIPELINE-MCP/main/scripts/install-frontend-slots-agent.ps1 | iex

From a clone: double-click `scripts/install-frontend-slots-agent.command` (macOS) or `scripts\install-frontend-slots-agent.cmd` (Windows). It pulls the latest commit, then installs. Add `--uninstall` / `-Uninstall` to remove it.

It writes `~/.claude/agents/frontend-slots-agent.md` plus the playbooks in `~/.claude/agent-docs/frontend-slots-agent/` (with a `VERSION` file), and points the agent's playbook links there, so they resolve from any project. Open a **new** Claude Code session afterwards: agents are only read at startup.

The agent combines the Showcase engine's clean result-provider/QA boundary with the Jeepney 4x3+1 engine's stronger timing, skip/slam, wheel, Spine and VFX presentation patterns. It also standardizes reel-symbol payout inspection, reward eye-leading, bonus transitions, RTP/math version boundaries, deterministic replay and mobile recovery.

## License

MIT. Spine engine derived from [egorfedorov/spine-mcp](https://github.com/egorfedorov/spine-mcp) via CLAUDE-SPINE; see LICENSE.
