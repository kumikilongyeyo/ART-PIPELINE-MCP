# FRONTEND Slots Agent — QA, Replay, Recovery and Performance

Use this playbook when validating a title, debugging rare states, reviewing art/VFX or preparing a web/mobile release.

The strongest QA system combines:
- Showcase-style full valid scenario results and final-board/balance checks,
- Jeepney-style presentation-only replay tools,
- recorded normalized-result replay,
- deterministic cosmetic randomness,
- visual regression.

## Random spinning is not QA

Every important state should be directly reproducible.

Use three layers.

### 1. Full-result fixtures

A fixture is a valid normalized game result.

Use it to verify:
- result contract,
- grid/reel state,
- feature state,
- final board,
- settlement/balance behavior in the appropriate environment,
- complete real presentation path.

### 2. Presentation-only replay

Use for rapid art/VFX work:
- wheel spin/settle,
- anticipation,
- wild/scatter animation,
- EX NUDGE,
- paylines,
- banners,
- big-win treatment,
- bonus transition.

Presentation replay must never credit/debit balance or pretend to be a payable spin.

### 3. Recorded round replay

Capture normalized real/mock result JSON and replay it deterministically.

This is the preferred way to reproduce bugs and compare visual changes.

## Required scenario library

At minimum cover:
- loss,
- small win,
- medium win,
- large/big win,
- wild,
- scatter,
- anticipation failure,
- anticipation success,
- feature trigger,
- feature active,
- feature exit,
- multiplier,
- collector,
- wheel result,
- EX NUDGE if applicable,
- cascade/tumble chain if applicable,
- jackpot test state if applicable,
- free-spin retrigger if supported,
- turbo,
- slam,
- skip,
- reduced motion.

Mechanic-specific titles add their own edge cases.

## Source-pack QA invariants

Preserve the spirit of Showcase QA:
- a requested scenario actually occurs,
- presented final board matches normalized finalGrid/result,
- round ends in an allowed stable state,
- balance reconciliation is correct for the active demo/production authority.

Add:
- no stale presentation writes after round change,
- no duplicate settlement,
- symbol inspector matches active paytable,
- feature entry/exit reaches a stable state,
- normal/turbo/skip produce the same final logical result.

## Capturing fleeting beats

Short beats (a charge, a multiplier sum, a max-win screen) are easy to miss with fixed sleeps.
In a browser harness, wait on a DOM condition (the beat's element or class appearing), then
screenshot. Record `lastResult` per spin while a feature runs, to check invariants such as
"every Wild Throw Spin had a Wild" or "the ladder reset each spin".

## Feature audit## Hidden preview panes freeze animations

A hidden browser pane can stop Web Animations and slow timers, so a spin looks frozen even though the code
is fine, and real bugs hide behind that. Run headless Chromium (Playwright) for sequence tests: record the
event log in order, screenshot each beat, and add a soak (autoplay on turbo + each buy + forced max win)
that checks raw x multiplier = total, balance reconciliation and zero page errors. That soak caught a crash
(a base-game multiplier boost writing free-spin state) that the hidden pane had disguised as a freeze.



For every headline mechanic, confirm from the math step order that it changes the outcome
(see FEATURE_DESIGN_AND_ECONOMICS.md §2). A beautiful animation over a no-op is a shipped bug.

## Deterministic VisualRng

Presentation randomness should be reproducible for screenshot/video comparison.

Use a dedicated seeded visual RNG for:
- particles,
- harmless shake offsets,
- decorative reel filler,
- cosmetic wheel wobble,
- ambient sparkle placement.

Seed from stable identity such as:

    roundId + sequenceId + eventKey

Never share this RNG with outcome generation.

## Visual regression

Capture key screenshots or short clips for:
- base idle,
- spin,
- stopped board,
- symbol payout inspector,
- standard win,
- major special symbol,
- anticipation,
- bonus trigger,
- bonus mode,
- wheel,
- collector/multiplier,
- big win,
- bonus exit,
- portrait phone,
- landscape phone,
- representative desktop/tablet.

Use the same fixture and visual seed for comparisons.

## Debug overlay

Development builds should optionally display:
- FPS/frame time,
- game state,
- provider type,
- request ID,
- round ID,
- presentation sequence ID,
- active event,
- bet,
- total win,
- feature/free-spin state,
- mathVersion,
- rtpProfileId,
- config checksum if available,
- timing profile,
- visual seed,
- active Spine animation,
- asset load state,
- viewport/safe-area values.

Disable/remove it for production.

## Structured logging

Prefer tagged logs:
- MATH,
- NETWORK,
- STATE,
- PRESENTATION,
- REELS,
- SPINE,
- VFX,
- AUDIO,
- ASSET,
- RECOVERY.

Include request/round/sequence identity where useful.

A useful log explains what failed and in which state.

## Network fault tests

Production/provider integration should test:
- timeout before result,
- connection drop after request submission,
- duplicate response,
- stale response after a later state,
- invalid schema,
- mismatched request ID,
- reconnect and authoritative status recovery.

Do not verify network behavior only on happy-path localhost.

## Browser lifecycle tests

Test:
- visibility hidden/resume,
- pagehide/pageshow,
- orientation change during spin/presentation,
- dynamic mobile browser bars,
- audio interruption,
- refresh after authoritative settlement,
- reconnect during feature,
- screen lock/resume where practical.

On resume, the game must not replay settlement or allow stale timers to mutate current state.

## Performance budget

Track at minimum:
- JS bundle/startup bytes,
- core asset download,
- feature asset download,
- texture memory estimate,
- atlas count,
- Spine skeleton count,
- particle count,
- renderer batches/draw calls where available,
- DOM nodes if DOM-heavy,
- long tasks,
- frame time/FPS,
- audio memory.

The exact budget is title/platform specific. Measure rather than guessing.

## Asset loading

Split:
- core — required for base-game readiness,
- feature — preloaded before likely feature entry,
- optional — rare/heavy sequences.

Never enter a cinematic bonus transition and then stall because its first critical asset is still downloading.

## Runtime discipline

Avoid:
- layout thrash in render loop,
- repeated DOM lookup every frame,
- unbounded particles,
- orphaned listeners/timers,
- duplicate Spine instances,
- full-resolution textures for tiny UI,
- permanent expensive blur/filter stacks for subtle effects.

Use a central clock/ticker and lifecycle-managed subscriptions.

## Low-end mobile

Do not optimize only on a desktop GPU.

Test:
- real phone viewport,
- reduced memory conditions where available,
- thermal/low-power behavior,
- portrait and landscape,
- touch latency,
- background/resume,
- sustained feature VFX.

Provide graceful VFX quality reduction when needed without destroying result readability.

## RED-change test gate

Any RED math change must trigger:
- math unit/rule tests,
- simulations required by the project,
- scenario regression,
- result-contract tests.

Record the changed math version/profile.

Do not hide a math change inside a frontend PR.

## Release gates

Before shipping:
- production provider selected correctly,
- mock/scenario provider cannot be accidentally enabled,
- force panel unavailable,
- presentation replay unavailable to ordinary players,
- debug overlay disabled,
- no sensitive result payload spam,
- no unsupported RTP profile selectable,
- payout inspector matches active configuration,
- skip/slam cannot duplicate round actions,
- duplicate/stale responses are safe,
- refresh/reconnect cannot double settle,
- feature entry/exit recovers,
- reduced-motion path still communicates results,
- portrait/landscape safe areas verified,
- performance checked on representative mobile hardware.

## Definition of QA success

A feature passes only when:
- logical final state is correct,
- the player can understand the result,
- the same fixture can be reproduced,
- art/VFX can be reviewed without random grinding,
- interruption/recovery is safe,
- mobile performance is acceptable.

A pretty animation that cannot be reliably reproduced or recovered is not production-ready.
