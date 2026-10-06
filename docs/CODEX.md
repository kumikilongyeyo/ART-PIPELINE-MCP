# Using ART-PIPELINE-MCP from Codex

The server speaks plain MCP over stdio, so Codex runs it as a local MCP server.

## 1. Requirements

| Needed for | What |
|---|---|
| everything | `uv` (https://docs.astral.sh/uv/) |
| runtime validation, previews | Node 18+ (`NODE_BIN`) |
| `.spine` export, `make_editable` | Spine 4.2 editor (`SPINE_BIN`) |
| After Effects FX | After Effects + `aerender` (only for the `ae_*` tools) |

## 2. Add the server

Put this in `~/.codex/config.toml` (adjust the paths):

```toml
[mcp_servers.art-pipeline]
command = "/Users/YOU/.local/bin/uvx"
args = ["--from", "git+https://github.com/kumikilongyeyo/ART-PIPELINE-MCP", "art-pipeline"]
startup_timeout_sec = 180

[mcp_servers.art-pipeline.env]
SPINE_BIN = "/Applications/Spine.app/Contents/MacOS/Spine"
NODE_BIN = "/Users/YOU/.local/node/bin/node"
PATH = "/Users/YOU/.local/node/bin:/Users/YOU/.local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
```

Pin a commit for stability: `git+https://github.com/kumikilongyeyo/ART-PIPELINE-MCP@<sha>`.
`startup_timeout_sec` is generous because the first `uvx` run builds the environment; the runtime
validator also runs `npm install` once on first use.

Local checkout instead of GitHub:

```toml
[mcp_servers.art-pipeline]
command = "/Users/YOU/Downloads/ART-PIPELINE-MCP/.venv/bin/art-pipeline"
```

## 3. Check it

Restart Codex and ask: *"call the art-pipeline `doctor` tool"*. Expected: `spine_cli_found: true`,
`spine_core_runtime: "ready"`, all python deps `true`.

Then a first real job (no PSD needed):

> Use art-pipeline: `make_sample`, rig it, `juice_apply` a win, `qa_budget` for `mobile_symbol`, then `preview` it.

## Migrating from CLAUDE-SPINE

Nothing breaks: `claude_spine` still imports and the `claude-spine` command still exists. The MCP server
name inside the protocol is now `art-pipeline`; tool names are unchanged.
