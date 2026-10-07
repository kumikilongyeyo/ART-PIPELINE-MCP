# FRONTEND Slots Agent — Presentation Playbook

Use this playbook for win choreography, bonus transitions, VFX, audio, anticipation, timing, attention direction and reward readability.

## Core grammar

Every important event should normally follow:

    CAUSE -> RECOGNITION -> FOCUS -> REWARD -> READ -> RELEASE

The purpose is comprehension first, impact second.

If every layer flashes simultaneously, the player sees noise rather than causality.

## Attention budget

At a given moment classify visible activity as:

- Primary — one focal event the player must notice.
- Secondary — supporting information that explains the primary event.
- Ambient — atmosphere that must never compete with the first two.

Normally allow one primary focal event. If two pieces of information are both essential, sequence them instead of making them fight.

Use four levers to direct attention:
1. motion,
2. contrast/brightness,
3. scale/position,
4. sound.

More VFX is not automatically more premium. Often the best way to make a prize readable is to quiet everything else.

## Win choreography

Small win:
- establish winning symbol/way,
- small response,
- update/read value,
- release.

Medium win:
- stronger symbol response,
- clearer value entry/count,
- short supporting VFX/audio,
- readable hold,
- release.

Large win:
- reduce competing ambient motion,
- visually connect winning source to value,
- use stronger sound hierarchy,
- allow longer hold.

Big/Mega/Epic:
- use a dedicated presentation layer only when the threshold warrants it,
- value is dominant,
- counter cadence escalates,
- tier change is obvious,
- background/reel activity is suppressed,
- final amount gets a clean stop and hold.

Jackpot:
- highest priority,
- normal UI/ambient FX must not compete with the jackpot value and reason for award.

Do not celebrate tiny outcomes with jackpot-scale treatment. Without contrast, spectacle becomes wallpaper.

## Winning-source explanation

Whenever a result is presented, visually explain what caused it:
- winning payline,
- winning ways,
- cluster,
- collected values,
- special symbol,
- multiplier source.

If multiple wins exist, group or sequence them intelligently. Do not make the player wait through dozens of slow, redundant line animations.

## Value transfer

When a value changes because of another object, show cause and destination.

Examples:
- coin value -> collector,
- multiplier -> total win,
- bonus prize -> feature total,
- jackpot token -> jackpot meter.

Movement should explain the data change, not exist as decoration.

## Symbol payout inspector

Global default:
- click/tap a symbol to inspect its payout or function,
- data comes from the live paytable/config,
- selected symbol owns focus,
- unrelated symbols may quiet slightly,
- popup uses safe placement around reel edges,
- mobile placement avoids the finger/gesture area,
- inspector disappears when gameplay resumes.

Special symbols describe behavior rather than fabricating a normal line payout.

## Anticipation

Anticipation should be conditional and informative.

Good anticipation tells the player why they should care:
- two scatters landed and a third is possible,
- a collector is one source away from triggering,
- a wheel/jackpot state is genuinely pending.

Avoid fake or constant anticipation that trains the player to ignore it.

The sequence is generally:
1. establish the near-trigger,
2. slow/quiet competing motion,
3. intensify the relevant reel/zone,
4. resolve,
5. immediately communicate success or failure.

## Bonus entry

A bonus transition is a state change, not a scene cut.

Recommended phases:
1. Recognition — triggering symbols/object become primary.
2. Confirmation — show the feature/award.
3. Anticipation — short authored pause.
4. Transformation — world/reels/HUD change.
5. Feature HUD — counters/meters become readable.
6. Ready — only now return control.

Possible transformation devices:
- camera push,
- reel frame transformation,
- environment color/light change,
- character reaction,
- portal/wipe,
- themed object expansion,
- foreground transition.

Keep the visual language related to the base game.

## Bonus exit

Recommended:
1. stop feature loop cleanly,
2. resolve final feature value,
3. hold it,
4. consolidate into total,
5. transition back,
6. restore base HUD/reels,
7. confirm final total,
8. return input.

Never let bonus audio/VFX leak indefinitely into the base state.

## Timing system

Do not scatter magic millisecond values across components.

Define semantic timing tokens in one place:
- instant,
- micro,
- fast,
- normal,
- emphasis,
- feature,
- cinematic.

Reasonable starting ranges, not laws:
- micro: about 80–160 ms,
- fast: about 160–280 ms,
- normal: about 250–450 ms,
- emphasis: about 400–750 ms,
- feature hold: about 650–1200 ms.

Tune by readability and game feel.

Preferred rhythm:

    anticipation -> impact -> readable hold -> release

Avoid evenly spaced robotic beats.

## Turbo

Turbo compresses presentation, not math.

Turbo may:
- shorten reel travel,
- reduce low-value holds,
- simplify low-priority FX,
- accelerate counters.

Turbo must preserve:
- trigger recognition,
- settlement correctness,
- important values,
- final state.

Use one timing profile multiplier/system rather than manually editing dozens of animations.

## Skip

Skip must converge to the same final presentation state:
- cancel active timelines safely,
- stop/duck associated audio,
- clear transient FX,
- apply final UI values once,
- mark sequence complete,
- continue queue.

Skip cannot duplicate awards or bypass settlement.

## VFX tiers

Use a consistent escalation ladder:
- Tier 0 idle,
- Tier 1 micro response,
- Tier 2 small win,
- Tier 3 medium win,
- Tier 4 feature/large win,
- Tier 5 jackpot/major event.

Reserve Tier 5.

Modular VFX layers are preferred:
- impact,
- trail,
- glow,
- flash,
- particles,
- aura,
- distortion,
- screen treatment,
- environmental reaction.

This makes style changes cheap.

## Sound hierarchy

Organize buses/layers such as:
- music,
- ambience,
- reels,
- symbols,
- UI,
- wins,
- features,
- voice.

Major reward audio may duck lower-priority layers.

Sound should reinforce the same focal point the visuals are directing toward.

## Reduced motion

Reduced-motion mode must preserve comprehension while removing unnecessary:
- camera moves,
- shakes,
- large parallax,
- long particle travel,
- repeated loops.

Replace motion with contrast, scale snap, static highlight and shorter transitions rather than deleting result communication.
