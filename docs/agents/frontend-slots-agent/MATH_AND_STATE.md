# FRONTEND Slots Agent — Math, RTP and State Playbook

Use this playbook for result-provider integration, RTP-profile wiring, game state, settlement boundaries, retries, replay and recovery.

The supplied engines expose an important contrast:
- Showcase has the cleaner result-provider seam.
- Jeepney has a strong controller but couples its demo engine/session more tightly.

For future titles, preserve Showcase's provider idea and apply it consistently across both families.

## Hard boundary

    production math/server OR demo math engine
                    |
                    v
              Round Provider
                    |
                    v
          Normalized Round Result
                    |
                    v
           Session / Game State
                    |
                    v
          Presentation Director

Presentation never determines outcomes.

For production or real-money systems, default to authoritative server/service RNG, balance and settlement. Local SlotEngine/Session behavior is a demo/prototype implementation unless explicitly approved otherwise.

## Unified provider contract

The frontend should depend on an interface conceptually like:

    requestRound(request) -> normalized result

The provider may be:
- ServerResultProvider,
- MockResultProvider,
- ScenarioResultProvider,
- RecordedResultProvider.

Game presentation should not care which provider produced the result.

## Request identity

Every production request should carry enough identity for tracing and idempotency, for example:
- requestId,
- gameId/version,
- bet in integer credits/minor units,
- mode/base/free-spin context,
- selected approved feature-buy option,
- active math/RTP profile identifier when protocol requires it,
- previous round/session token where required.

Do not let UI components construct ad hoc math payloads.

## Normalized result contract

Use a versioned response.

Recommended common fields:
- schemaVersion,
- requestId,
- roundId,
- mathVersion,
- rtpProfileId,
- configChecksum or equivalent,
- betCredits,
- initialGrid/reels,
- ordered presentation steps,
- wins,
- totalWinCredits,
- special-symbol outcomes,
- multiplier/collector data,
- feature trigger/feature payload,
- next free-spin/feature state,
- authoritative settled balance where production architecture exposes it.

Mechanic-specific payloads may extend this contract.

Do not put:
- CSS classes,
- screen coordinates,
- animation clip names,
- particle names

inside the math result. Map semantic math facts to presentation in the frontend.

## Runtime validation

The Showcase server-provider template is intentionally minimal. Production integration should add runtime response validation.

Validate before presenting:
- supported schemaVersion,
- expected request/round identity,
- known symbol IDs,
- grid dimensions/topology,
- numeric bounds,
- recognized feature payload,
- result step ordering/shape,
- required settlement fields,
- internally sane totals where frontend can safely check.

Development should fail loudly. Production should enter a controlled recovery/error path rather than presenting corrupt data.

## Abort, timeout and retries

Network behavior is part of round correctness.

Use:
- AbortController or equivalent cancellation,
- explicit timeout,
- request-state UI,
- controlled retry policy,
- idempotency.

Never blindly replay a spin POST after an unknown network outcome unless the backend protocol guarantees the same requestId returns the same authoritative round.

On timeout after submission, prefer:
- status/recovery query by requestId/roundId,
- authoritative session sync,
- then resume/fast-forward presentation.

## RTP profile discipline

RTP is a RED-zone concern.

Treat an RTP profile as an approved versioned math artifact, not a visual setting.

Recommended identity:

    mathVersion + rtpProfileId + configChecksum

Frontend can:
- request/receive an allowed profile,
- display its identity in dev/debug tools,
- route the active paytable/function data to UI,
- present outcomes.

Frontend must not:
- tweak weights to "make the game feel better",
- change feature trigger probability from VFX logic,
- change RNG based on turbo/skip/device speed,
- claim an RTP is validated without the required simulation/approval.

Any changes to reel strips, paytable, feature odds, multiplier distribution or feature-buy return require math tests/simulation.

## Certification wording

The source pack contains mock/tuned math paths and simulation-oriented values. Treat them as development references.

Do not label a configuration "certified" unless it has actually completed the relevant certification/approval process.

## Paytable single source

The global info screen and reel symbol inspector must use the same active math/paytable source.

Never maintain:
- one paytable in math,
- a second manually typed paytable in the tooltip.

If payout display depends on bet, ways or mode, derive it from the same authoritative configuration used for the active round rules.

## Money/value precision

Prefer:
- integer credits,
- or integer minor currency units.

Avoid binary floating-point settlement arithmetic.

Formatting belongs to presentation:
- separators,
- currency symbol,
- locale,
- decimal display.

Authoritative value belongs to settlement/math.

## State machine

The supplied engines have broad phases. Production-minded flow should make network and transition states explicit enough to reason about.

A useful high-level model:

    BOOT
    LOADING
    READY
    REQUESTING_RESULT
    SPINNING
    STOPPING
    PRESENTING
    FEATURE_TRANSITION_IN
    FEATURE_ACTIVE
    FEATURE_TRANSITION_OUT
    ROUND_COMPLETE
    RECOVERING
    ERROR

A hierarchical state machine is fine. Avoid boolean soup.

The state should answer:
- may the player spin?
- may they slam?
- may they skip?
- may they inspect a symbol?
- is a round request in flight?
- is settlement authoritative?
- is a feature transition active?

## Round and sequence identity

Every round gets a roundId.

Every long presentation sequence should also have a sequenceId/cancellation identity.

Any callback that can fire later must verify:
- correct active round,
- correct active sequence,
- expected state,
- token not cancelled.

This is especially important around:
- big-win counters,
- feature intros,
- reel stop timers,
- delayed VFX,
- wheel settle callbacks.

## Idempotency

Receiving or replaying the same authoritative result twice must not:
- deduct bet twice,
- credit win twice,
- consume free spin twice,
- increment feature state twice.

Separate permanent/session state changes from replayable visual presentation.

## Full-result fixture vs presentation replay

Keep these concepts distinct.

### Full-result fixture
Uses a rule-valid normalized result.
Use it to test:
- game logic,
- grid/final result,
- feature state,
- balance reconciliation,
- real presentation path.

### Presentation-only replay
Replays an animation/VFX state without pretending a new payable round occurred.
Use it for:
- art review,
- wheel motion,
- anticipation,
- wild/scatter animation,
- big-win treatment,
- banner/payline timing.

Never let a presentation-only replay touch settlement.

## Recorded result replay

Normalized results should be serializable.

QA should be able to:
1. load a saved result JSON,
2. reset visual state,
3. replay presentation,
4. select normal/turbo/reduced-motion,
5. compare expected final board/state.

This is critical for reproducible bugs.

## Refresh and reconnect

For an authoritative production round:
- refresh must not create another award,
- reconnect should recover the current/last authoritative round,
- final balance/state comes from the authority,
- unfinished presentation can resume or fast-forward,
- permanent settlement must not be replayed.

Use stable checkpoints such as:
- result acquired,
- settlement known,
- base presentation complete,
- feature entered,
- feature complete.

## Hidden/suspended browser

Mobile browsers can pause timers.

On visibility resume:
1. re-check state,
2. discard/rebase stale timers,
3. verify active round/sequence,
4. fast-forward to a stable checkpoint when necessary,
5. resume audio according to browser policy,
6. never rerun settlement.

## Force mode

Development force controls should request a real fixture/result contract where possible.

Useful scenarios:
- loss,
- small/medium/large win,
- wild,
- scatter,
- anticipation fail/success,
- feature trigger,
- collector,
- multiplier,
- wheel result,
- EX NUDGE,
- jackpot test,
- free spins.

Release builds must not expose forced math/scenario providers accidentally.

## Math-change gate

Before merging a RED change:
- identify exact changed math inputs,
- run unit/rule tests,
- run required simulation,
- record target and observed RTP/volatility metrics,
- compare confidence/statistical error as appropriate,
- update mathVersion/profile/checksum,
- rerun critical forced scenarios.

Presentation-only changes should not require RTP re-simulation unless they crossed into RED behavior.
