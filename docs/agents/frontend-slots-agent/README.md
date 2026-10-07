# FRONTEND Slots Agent

A Claude Code specialist for art-first web/mobile slot implementation.

## Agent

Project subagent:

    .claude/agents/frontend-slots-agent.md

The agent is intentionally concise and loads deeper playbooks only when relevant.

## What it specializes in

- preserving approved slot concept/layout,
- web/mobile front-end porting,
- reel/HUD composition,
- symbol tap/click payout inspection,
- win and prize eye-leading,
- bonus entry/exit choreography,
- PG Soft / FA CHAI / OMNIPLAY / GameZone-style interaction discipline without cloning,
- Spine/VFX/audio integration,
- normalized math/RTP adapter boundaries,
- state machines and presentation queues,
- deterministic forced states and replay,
- mobile safe areas and performance,
- debugging/recovery.

## Playbooks

- ART_AND_LAYOUT.md
- PRESENTATION.md
- MATH_AND_STATE.md
- QA_AND_PERFORMANCE.md
- AUDIT.md
- slot-manifest.example.json

## Recommended project bootstrap

For a new slot implementation:

1. Put the approved concept/art spec in the project.
2. Copy/adapt slot-manifest.example.json.
3. Identify the real math authority and active paytable.
4. Ask Claude to use the frontend-slots-agent for the implementation/audit.
5. Require a first-pass architecture/layout report before large rewrites.
6. Add deterministic round fixtures before polishing rare features.
7. Validate portrait and landscape mobile early.

## Key design decision

The agent does not hard-wire a visual style.

It standardizes behavior and technical boundaries while allowing each slot to retain its own art direction.

The same agent can work on an action/fighting slot, diner reskin, Greek temple game, horror theme, or another layout without forcing them to look alike.
