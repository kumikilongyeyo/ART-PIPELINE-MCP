# FRONTEND Slots Agent — Source Engine Map

This playbook summarizes the supplied Slot Engines Source Pack and prevents unnecessary rewrites.

## 01_slot-showcase

Best reference for:
- IResultProvider-style result boundary,
- swappable mock/server/scenario providers,
- normalized SpinResult presentation data,
- configurable cascade and reel-multiplier families,
- valid forced scenarios,
- QA that compares presented board with final result,
- balance reconciliation in demo flow,
- portrait/landscape support,
- stable asset/config-driven reskins.

Use it first for:
- Super Ace-style ways/cascade games,
- Piñata-style line/cascade games,
- Bonanza/Olympus-style tumble games,
- 3x3 collector games,
- 3x3 plus multiplier-reel games.

Primary weakness to improve:
- presentation timing is less structured and still contains hard-coded waits,
- state phases are broad,
- symbol-level payout inspection is absent,
- bare server provider needs production hardening.

## 02_jeepney-4x3-wheel-engine

Best reference for:
- 4x3 plus 1 multiplier/wheel topology,
- wheel presentation,
- EX NUDGE collection presentation,
- anticipation,
- authored paylines,
- free-spin and big-win sequencing,
- normal/turbo1/turbo2 timing profiles,
- centralized skip token/clock behavior,
- Spine and VFX integration,
- presentation-only art/debug replay controls,
- fixed logical mobile design space.

Use it first for:
- 4x3 plus wheel games,
- EX NUDGE-like mechanics,
- wheel-heavy bonus presentation,
- titles that need stronger cinematic sequencing.

Primary weakness to improve:
- production math/result-provider seam is weaker than Showcase,
- demo Session handles local balance/settlement,
- presentation uses unseeded Math.random in some cosmetic paths,
- no per-symbol payout inspector,
- production recovery/idempotency is not fully generalized.

## Recommended fusion

    Showcase provider/result boundary
                    +
       Jeepney presentation timing
                    +
      explicit state/recovery layer
                    +
       deterministic QA/replay

Do not choose one codebase as universally superior.

## Engine selection

1. If config/reskin can express the title, use the existing engine.
2. If one contained YELLOW extension can express it, extend.
3. Create a new engine only when topology/state truly differs.

## Protected change zones

GREEN: presentation and art.
YELLOW: frontend/gameplay architecture.
RED: math/RTP/odds.

RED changes require math validation and simulation.

## Source-master rule

Create a title copy/branch/project. Keep the source reference intact. Preserve stable asset IDs and document engine extensions.

## Production math rule

The pack includes demo/local math paths. Production should plug an authoritative result/settlement provider into the same normalized contract, preserve round identity, and recover without double settlement.
