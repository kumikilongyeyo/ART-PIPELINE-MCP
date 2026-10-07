# FRONTEND Slots Agent — QA, Debugging, Recovery and Performance

Use this playbook when validating a build, hunting bugs, optimizing or preparing release.

## QA philosophy

Random spinning is not a QA strategy.

Every important state should be reproducible through:
- force mode,
- recorded round replay,
- deterministic fixture,
- direct state harness.

## Required test states

At minimum:
- boot/loading,
- idle/ready,
- losing spin,
- small win,
- medium win,
- large/big win,
- wild,
- scatter,
- anticipation success/failure,
- bonus trigger,
- bonus active,
- bonus exit,
- multiplier/collector,
- jackpot test state if present,
- turbo,
- skip,
- reduced motion,
- orientation change,
- hidden/resume tab,
- asset failure,
- reconnect/recovery.

## Debug overlay

Development builds should be able to show:
- FPS/frame time,
- current game state,
- active round ID,
- presentation sequence ID,
- current event,
- bet,
- total win,
- feature state,
- RTP profile ID,
- math version,
- force/replay status,
- asset-load state,
- active Spine animation,
- viewport and safe-area values,
- timing profile.

Keep this removable and disabled in production.

## Structured logs

Prefer domain tags:

    [MATH]
    [STATE]
    [PRESENTATION]
    [SPINE]
    [VFX]
    [AUDIO]
    [ASSET]
    [NETWORK]
    [RECOVERY]

Include round/sequence IDs where useful.

A good log tells a developer what failed and in what state.

## Visual regression

Capture reference screenshots/videos for:
- base screen,
- spin,
- standard win,
- special symbols,
- trigger anticipation,
- bonus entry,
- bonus mode,
- big win,
- bonus exit,
- portrait,
- landscape,
- desktop.

Compare after major frontend/layout changes.

## Performance budget

Track at least:
- JS bundle size,
- startup asset bytes,
- texture memory estimate,
- atlas count,
- Spine skeleton count,
- particle count,
- draw calls or renderer batches where available,
- DOM node count if DOM-heavy,
- long tasks,
- frame time/FPS,
- audio memory.

Do not fix tiny aesthetic issues with permanently expensive effects.

## Loading strategy

Split assets:
- core — required to start base game,
- feature — loaded before likely feature entry,
- optional — rare/large assets.

Critical bonus assets must be ready before transition begins.

## Runtime discipline

Avoid:
- layout thrash in the animation loop,
- repeated DOM queries on every frame,
- unbounded particle creation,
- orphaned timers/listeners,
- duplicate Spine instances,
- loading giant full-resolution textures for tiny UI.

Use a shared animation clock/timeline where practical.

## Mobile resilience

Test actual device behavior:
- low-power mode,
- background/foreground,
- audio interruption,
- orientation rotation,
- dynamic browser chrome,
- touch latency,
- memory pressure.

Desktop emulation alone is insufficient.

## Recovery tests

Verify:
- refresh after settled round,
- reconnect with same round,
- duplicate result message,
- stale delayed callback,
- skip midway through big win,
- turbo toggle between rounds,
- bonus assets delayed,
- one optional visual asset missing.

The final balance/win/state must remain correct.

## Release gates

Before release:
- force mode unavailable,
- debug overlay unavailable by default,
- dev endpoints removed/locked,
- no console spam of sensitive production payloads,
- no unsupported RTP profile can be selected,
- all symbol payout inspectors match active paytable,
- all feature entry/exit states recover correctly,
- reduced-motion path remains understandable,
- mobile safe areas verified,
- no known stale-event race remains.

## Definition of performance success

Optimization is successful only if it preserves:
- readability,
- cause/effect communication,
- approved art hierarchy,
- final-state correctness.

A fast game that visually lies or loses the concept is not optimized; it is broken differently.
