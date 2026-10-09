# FRONTEND Slots Agent

A Claude Code specialist for porting and polishing slot games on web/mobile while preserving approved art direction and maintaining a clean math/RTP boundary.

This version was rebuilt from the actual Slot Engines Source Pack rather than from a generic UI kit.

## Agent

Project subagent:

    .claude/agents/frontend-slots-agent.md

The agent does not restrict its tool list, so it can inherit connected MCP tools such as ART-PIPELINE-MCP when available.

## Install or update (any project, macOS or Windows)

Installs the agent for your user, so it shows up in every project, not only this repo. Run the same command again to update.

macOS / Linux (Terminal):

    curl -fsSL https://raw.githubusercontent.com/kumikilongyeyo/ART-PIPELINE-MCP/main/scripts/install-frontend-slots-agent.sh | bash

Windows (PowerShell):

    irm https://raw.githubusercontent.com/kumikilongyeyo/ART-PIPELINE-MCP/main/scripts/install-frontend-slots-agent.ps1 | iex

From a clone: double-click `scripts/install-frontend-slots-agent.command` (macOS) or `scripts\install-frontend-slots-agent.cmd` (Windows). It pulls the latest commit, then installs. Add `--uninstall` / `-Uninstall` to remove it.

It writes `~/.claude/agents/frontend-slots-agent.md` plus the playbooks in `~/.claude/agent-docs/frontend-slots-agent/` (with a `VERSION` file), and points the agent's playbook links there, so they resolve from any project. Open a **new** Claude Code session afterwards: agents are only read at startup.

## Source-pack intelligence

The agent deliberately combines the strongest patterns from both supplied engines:

- 01_slot-showcase — cleaner result-provider boundary, normalized spin results, configurable game families, forced valid scenarios and one-click QA.
- 02_jeepney-4x3-wheel-engine — stronger authored timing, skip/slam behavior, wheel/EX NUDGE presentation, Spine/VFX integration and presentation-only replay tools.

The target architecture uses the Showcase-style provider seam with the Jeepney-style presentation discipline.

## Core behavior

The agent enforces:
- approved concept/layout as visual authority,
- engine selection before rebuilding,
- GREEN / YELLOW / RED change classification,
- tap/click stopped symbols for payout/function inspection,
- cause-to-effect win explanation,
- deliberate eye-leading when prize values appear,
- authored bonus entry and exit,
- config-driven normal/turbo/reduced-motion timing,
- cancellable presentation sequences,
- server-authoritative production settlement by default,
- versioned RTP/math identity,
- deterministic full-result and presentation replay,
- responsive/mobile-safe layout,
- release gates for dev/force tooling.

## Playbooks

- SOURCE_ENGINE_MAP.md — which supplied engine to use and protected zones.
- ART_AND_LAYOUT.md — concept fidelity, design-space layout, assets, responsive behavior.
- PRESENTATION.md — eye-leading, wins, VFX, audio, timing, bonus transitions.
- MATH_AND_STATE.md — result providers, RTP, settlement, state, idempotency/recovery.
- QA_AND_PERFORMANCE.md — fixtures, replay, visual regression, performance, lifecycle.
- AUDIT.md — gaps found by scrutinizing the real source pack.
- slot-manifest.example.json — project bootstrap contract.

## Recommended use

For a new title or port:
1. copy the title/engine instead of modifying the source-pack master,
2. adapt slot-manifest.example.json,
3. give Claude the approved concept and source art,
4. ask it to use frontend-slots-agent,
5. let the agent choose the closest source engine,
6. review its GREEN/YELLOW/RED change classification before deep edits,
7. keep rare-state fixtures/replays working while presentation is polished.

The agent standardizes behavioral quality, not visual style. Different themes should share strong interaction grammar without being forced into the same look.
