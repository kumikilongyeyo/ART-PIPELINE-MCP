# FRONTEND Slots Agent — Presentation Playbook

Use this playbook for win choreography, bonus transitions, anticipation, reel timing, VFX, audio, skip/slam behavior and player eye direction.

The supplied source pack gives two useful references:
- Showcase proves the result should already be decided before GameFlow presents it.
- Jeepney is the stronger reference for HOW and WHEN that decided result is revealed.

## Core presentation grammar

For important events use:

    CAUSE -> RECOGNITION -> FOCUS -> REWARD -> READ -> RELEASE

This is the default grammar, not a rigid animation template.

### Cause
Show or preserve enough context for the player to understand what generated the event.

### Recognition
Make the relevant symbol, payline, collector, multiplier, trigger or wheel state identifiable.

### Focus
Reduce competition and deliberately direct attention.

### Reward
Present the value or feature.

### Read
Give the player enough time to understand the result.

### Release
Clear temporary emphasis and return attention/control to the next gameplay state.

## Attention budget

Classify visible activity as:
- Primary — one thing the player must notice now.
- Secondary — context that explains the primary event.
- Ambient — atmosphere only.

Normally allow one primary focus at a time.

Use four main attention tools:
1. motion,
2. contrast/brightness,
3. scale/position,
4. audio.

Premium presentation is not maximum effects. Suppression and stillness are often stronger.

## Prize-value eye leading

When a prize or total appears, do not just spawn text.

Recommended sequence:
1. identify winning source,
2. quiet unrelated symbol/VFX motion,
3. keep or create a visual path from source to reward,
4. bring the value into primary focus,
5. count/resolve it,
6. hold the final number,
7. use proportional celebration,
8. return focus to reels or next event.

Useful techniques:
- winning symbols remain bright while unrelated reels lower contrast,
- collected coins travel toward the collector/value,
- multiplier energy travels toward the total,
- camera/light direction supports the reward location,
- lower-priority audio ducks under the reward cue.

Do not hide the value inside particles.

## Win tiers

### Small
Fast:
- identify win,
- brief response,
- value update,
- release.

### Medium
- clearer symbol response,
- short value animation,
- supporting VFX/audio,
- readable hold.

### Large
- reduce competing activity,
- connect cause to total,
- stronger sound hierarchy,
- longer clean hold.

### Big / Mega / Epic
Use a dedicated reward layer only when the threshold warrants it.
- value is dominant,
- counter can escalate through tiers,
- reels/background become subordinate,
- final value gets a clean stop,
- exit returns smoothly to game state.

### Jackpot
Highest presentation priority. Do not let normal reel/UI animation compete.

## Winning-source explanation

The player should be able to answer: "Why did I win that?"

Highlight the actual source:
- payline,
- ways,
- tumble/cluster,
- wild substitution,
- collect event,
- multiplier,
- feature award.

For many simultaneous wins, group them when individual cycling adds no useful clarity. Do not trap the player in a slow parade of redundant lines.

## Global symbol payout/function inspector

The supplied source engines do not currently provide per-symbol reel inspection. Add it as a standard layer.

Default rules:
- active only on stopped/settled reels,
- desktop click or mobile tap selects a symbol,
- normal symbol shows payouts applicable to the current mechanic,
- special symbol explains function/trigger conditions,
- values come from the active paytable/config,
- no duplicate hard-coded paytable copy,
- tooltip/card avoids screen edges and finger occlusion,
- tap another symbol to replace,
- outside tap closes,
- spin/feature transition closes immediately.

Prefer a board-level SymbolInspectorController instead of attaching bespoke popup logic to every SymbolView.

If the same symbol appears elsewhere, optional soft matching highlights may be used, but keep the selected symbol primary.

## Anticipation

Anticipation must be justified by the already-decided result or an allowed known trigger state. It must never change the result.

Good anticipation:
- two scatters have landed and later reels may resolve the feature,
- a known collector/feature condition is pending,
- a wheel or bonus state is genuinely being entered.

Sequence:
1. establish why attention should shift,
2. slow/quiet irrelevant activity,
3. intensify the relevant reel/zone,
4. resolve,
5. clearly communicate success/failure,
6. release.

Avoid constant fake anticipation. If it fires all the time, it becomes wallpaper.

## Bonus / free-spin entry

The source pack has useful feature intros but no single reusable transition director. Standardize one.

Recommended states:

    TRIGGER_RECOGNITION
    FEATURE_CONFIRMATION
    FEATURE_TRANSITION_IN
    FEATURE_READY

Presentation sequence:
1. trigger lands,
2. trigger symbols/object own focus,
3. nonessential activity quiets,
4. feature name/award is confirmed,
5. short anticipation beat,
6. environment/reels/HUD transform,
7. feature counters/meters enter,
8. feature HUD becomes readable,
9. feature becomes READY,
10. return input according to the mechanic.

Transformation can use:
- camera push,
- frame transformation,
- background/light shift,
- character reaction,
- themed wipe/portal,
- foreground transition,
- reel material/state change.

Keep the same product identity. Bonus mode should feel elevated, not like a different game accidentally opened.

Preload critical feature assets before transition.

## Feature exit

Use a mirrored authored sequence:

    FEATURE_COMPLETE
    FINAL_FEATURE_REWARD
    FEATURE_TRANSITION_OUT
    BASE_RESTORE
    ROUND_CONFIRM

Recommended:
1. stop feature loops,
2. resolve final feature amount,
3. hold it,
4. consolidate to total,
5. transition world/HUD,
6. restore base reels and music,
7. confirm total/final state,
8. return control.

Kill or fade feature-only audio/VFX cleanly.

## Wheel presentation

For Jeepney-style wheel mechanics:
- the mathematical landing result must already be known,
- visual spin is a presentation of that result,
- start with readable acceleration,
- use controlled deceleration,
- final pointer/segment must settle unambiguously,
- hold final value before applying downstream reward presentation.

Do not use visual randomness to choose the outcome.

If cosmetic wobble/jitter exists, use seeded VisualRng for deterministic replay.

## EX NUDGE / collector presentation

Make the relationship obvious:
1. identify contributing values/symbols,
2. animate or route them toward the collector,
3. show collector response,
4. update the destination value,
5. hold final state.

Do not make values disappear on one side and magically change a number elsewhere.

## Cascade/tumble rhythm

Typical loop:

    WIN -> HIGHLIGHT -> AWARD -> REMOVE -> DROP/REFILL -> EVALUATE -> NEXT

Do not begin the next cascade before the previous cause/result can be understood.

Multipliers that persist/escalate should receive a visible update beat before the next evaluation.

## Charge-and-release beat (rare super-symbol)

For a rare special (e.g. a Golden Wild that throws several Wilds), one loud, readable moment beats
many small ones. Sequence that tested well:
1. **Charge (~0.9 s):** the symbol scales up and shivers, the rest of the board dims, rings converge
   on it, and a rising growl/scream builds.
2. **Release:** a flash, a heavy shake and a drum hit.
3. **Staggered hits (~150-170 ms apart):** each thrown object lands as its own beat with its own
   sound; don't fire them all on one frame.
4. **Persistent result:** anything that stays on the board (multiplier Wilds) keeps a badge that sits
   **outside** the symbol element, so art swaps and symbol re-renders don't drop it.

## Combining multipliers on screen

- Show the parts small and the total big: a `x2 + x3 + x5` line above a large `x10`.
  A single-line label overflowed the board at 7 parts; cap the label width to the board.
- Pulse the contributing badges while the total shows.
- In a bonus where the multiplier jumps off its normal +step ladder, rebuild the wheel/ladder around
  the old value and roll one position to the new one, rather than computing a ladder index.

## Presentation timing

The Jeepney engine's config-driven normal/turbo profiles are the preferred direction. The Showcase hard-coded waits should be refactored when touching those paths.

Do not scatter raw waits throughout controllers.

Central timing profiles should support at least:
- normal,
- turbo1,
- turbo2 when applicable,
- reducedMotion.

Use semantic values such as:
- reelStartStagger,
- reelStopGap,
- anticipationHold,
- winHighlight,
- rewardCount,
- rewardHold,
- featureIntro,
- featureExit,
- bigWinTierHold.

Timing should feel:

    anticipation -> impact -> readable hold -> release

Avoid evenly spaced robotic beats.

## Slam and skip semantics

Borrow Jeepney's strong input idea and make it consistent.

When reels move:
- primary action may slam/fast-stop if mechanic permits.

When skippable presentation is playing:
- primary action requests skip.

Skip must:
- cancel current cancellable timeline,
- clean up temporary VFX/audio,
- apply final display state exactly once,
- keep settlement untouched,
- continue from the correct next presentation step.

Do not treat skip as "set speed to 1000 and hope callbacks finish."

## Cancellation

Long sequences need a sequence/cancellation token.

Before any delayed callback mutates visible state, verify:
- active round ID,
- active sequence ID,
- expected game state,
- token not cancelled.

This prevents a previous win animation from corrupting the next round.

## Cosmetic randomness

The Jeepney source uses Math.random in some visual-only paths. Replace those paths when exact replay matters.

Use a separate seeded VisualRng:
- derived from roundId + sequence/event key,
- used for particles, small shake offsets, harmless decorative filler,
- never used for outcome generation.

Outcome RNG and visual RNG must remain separate.

## VFX escalation

Use tiers:
- Tier 0: idle ambience,
- Tier 1: micro response,
- Tier 2: small win,
- Tier 3: medium win,
- Tier 4: large win / feature,
- Tier 5: jackpot / major event.

Reserve the top tier.

Prefer modular effects:
- impact,
- trail,
- glow,
- flash,
- particles,
- aura,
- distortion,
- environment reaction,
- screen treatment.

This makes stylized/realistic/premium-soft looks easy to swap without rewriting event logic.

## Audio hierarchy

Keep useful groups such as:
- music,
- ambience,
- reels,
- symbols,
- UI,
- win,
- feature,
- voice.

Audio should reinforce the same focal point as the visuals.

Major reward/feature cues may duck lower-priority layers.

## Reduced motion

Reduced-motion presentation must remain understandable.

Reduce:
- camera travel,
- heavy shake,
- long particle travel,
- parallax,
- repeated decorative loops.

Replace them with:
- static contrast,
- short scale response,
- clear highlight,
- simpler fades,
- shorter authored holds.

Do not remove the cause/result communication.

## Commercial benchmark use

PG Soft, FA CHAI, OMNIPLAY and GameZone are interaction-quality references, not templates to clone.

Extract:
- predictable controls,
- readable reward values,
- consistent feature language,
- mobile-first hierarchy,
- clear event staging.

Do not reproduce their exact artwork, proprietary animation sequences, screen layouts or branded trade dress.
