# Roadmap

Order matters: each step keeps the previous one working.

1. **Neutralise the repo.** Move the engine into `art_pipeline/` (compat shim keeps `claude_spine` and the `claude-spine` command). Rename the FastMCP server to `art-pipeline`. Strip Claude-specific wording from docs and install steps.
2. **Keep every Spine algorithm untouched.** Heat weighting, meshes, 2.5D turn, character rigs, slot recipes, AE sequences, atlas generation and runtime QA are tested and verified frame-for-frame against the Spine CLI. No rewrites.
3. **Codex entry point.** Document `~/.codex/config.toml` MCP setup and add a one-command install. Codex speaks local MCP, so this is the first target.
4. **Streamable HTTP transport.** Keep stdio, add HTTP so the Responses API can call it remotely, and private machines can connect through Secure MCP Tunnel.
5. **Orchestrator tools.** `pipeline.*` tools that inspect, plan, execute, validate and retry: `prepare_symbol`, `rig_character`, `animate_symbol`, `make_win_animation`, `add_fx`, `optimize_mobile`, `export_game_ready`.
6. **Asset manifest.** JSON schema plus validation; tools take the manifest instead of free-form layer/bone names.
7. **Workflow state.** `.artmcp/project.json` checkpoints and resume.
8. **Curated default tool surface.** 10-15 high-level tools by default, low-level tools behind `spine.edit`.
9. **Live Photoshop/AE control.** PSD support today means reading `.psd` files, not driving Photoshop. `ae_template` currently emits a script that a separate AE MCP must execute; fold that executor in so `ae.create_fx` is one server.

## Client notes

- Codex: local MCP, first target.
- OpenAI Responses API: remote MCP; private servers via Secure MCP Tunnel.
- ChatGPT: full custom MCP with write actions is limited by plan; do not design the core around ChatGPT UI restrictions.
- Claude Code: keep working unchanged.
