# FRONTEND Slots Agent — Math, RTP and State Playbook

Use this playbook when wiring game results, RTP profiles, paytables, round state, settlement, replay or reconnect behavior.

## Hard boundary

    math / RNG / settlement
              |
              v
      normalized round result
              |
              v
          game state
              |
              v
         presentation

Presentation never determines outcomes.

For regulated/real-money production, the server or approved math service should normally be authoritative for RNG, outcome and settlement. A local math implementation is acceptable for a prototype/demo only when clearly isolated behind the same contract.

## Normalized round result

Use a versioned contract. A typical result carries:
- schemaVersion,
- roundId,
- mathVersion,
- rtpProfileId,
- betCredits,
- totalWinCredits,
- reels,
- wins,
- optional feature results,
- optional next state.

Extend it for the mechanic, but keep visual concerns out.

Do not put CSS classes, animation names, particle presets or screen coordinates inside the math result.

The presentation layer maps semantic results to visuals.

## Money/value precision

Prefer integer credits or integer minor currency units.

Do not use binary floating-point arithmetic for settled money.

Formatting is presentation:
- currency symbol,
- thousands separators,
- decimal places,
- locale.

Settlement is math/data.

## Paytable single source

The payout inspector, info screen and result validation should read from the same approved paytable source.

Do not maintain one paytable in math and another manually typed in UI.

If the active bet changes how values are displayed, compute display values from the authoritative paytable/bet model.

## RTP profiles

Treat RTP as an approved, versioned math profile.

Recommended identity:

    game math version + RTP profile ID + config checksum

Frontend responsibilities:
- receive/select an approved profile when architecture requires,
- display/report its identifier in dev/debug tools,
- never mutate probability tables ad hoc,
- never claim an RTP is validated without math simulation/approval.

Changing a reel weight or bonus probability is not just frontend configuration.

## State machine

Prefer explicit states over boolean soup.

Example:

    BOOT
    LOADING
    READY
    SPINNING
    STOPPING
    EVALUATING
    PRESENTING_WIN
    FEATURE_TRANSITION
    FEATURE_ACTIVE
    FEATURE_OUTRO
    ROUND_COMPLETE
    RECOVERING
    ERROR

Only permit transitions that make sense.

## Round identity and idempotency

Every async callback/event that can outlive a state should carry or close over the active round ID.

Long presentation sequences should also use a sequence ID or equivalent.

Before applying a delayed effect/state update:
- confirm the round is still active,
- confirm the expected state,
- confirm the sequence has not been cancelled.

The same settlement message received twice must not credit twice.

## Presentation queue

Use an explicit queue/timeline rather than unrelated timeouts.

Each step should know:
- what event it represents,
- whether it is skippable,
- cleanup behavior,
- final-state application,
- cancellation token/sequence ID.

This prevents stale animations from writing into the next round.

## Recorded replay

Make normalized results serializable.

A QA/development screen should be able to:
1. paste/load a recorded result,
2. reset presentation state,
3. replay it deterministically,
4. switch timing profile,
5. inspect logs.

This is one of the highest-value tools for art/VFX review.

## Force mode

Force mode can request scenarios such as:
- specific reels,
- wild,
- scatter,
- bonus,
- multiplier,
- collector,
- big win,
- jackpot test state,
- cascade,
- losing round.

Prefer forcing through the same result contract used by real rounds so the actual production presentation path is exercised.

Production builds must not accidentally expose force controls. Gate them at build/runtime configuration and verify the gate in release QA.

## Refresh/reconnect

For production settlement:
- frontend refresh must not create a new award for the same round,
- the app should query/recover authoritative round state,
- unresolved presentation may resume or fast-forward,
- final settled values must be restored deterministically.

Persist only what the architecture allows. Never trust client-only state as the sole source of financial truth.

## Hidden tab / suspended app

Mobile browsers may pause timers and audio.

On visibility resume:
- re-read current state,
- discard stale timers,
- re-sync timeline or fast-forward to a stable checkpoint,
- resume audio only when allowed by platform policy,
- never re-run settlement.

## Contract validation

Validate incoming results before presentation:
- schema version supported,
- known symbol IDs,
- non-negative values where expected,
- feature payload matches feature type,
- total values internally consistent enough for frontend sanity checks.

On invalid data, fail visibly in development and recover safely in production according to project policy.
