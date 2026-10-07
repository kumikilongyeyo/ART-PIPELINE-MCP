# FRONTEND Slots Agent — Art, Layout and Responsive Playbook

Use this playbook when porting approved concept art, reskinning a supplied engine, integrating Spine/assets or adapting a title to mobile/desktop.

## First rule: choose the engine before rebuilding layout

Consult SOURCE_ENGINE_MAP.md.

If the approved concept maps to an existing Showcase or Jeepney topology, use that engine and its layout/config system first.

Do not recreate reels/HUD from scratch just because the final art direction is different.

## Approved concept is authority

The runtime should feel like the approved concept became interactive.

Before implementation measure:
- logical reference canvas,
- reel box and row/column topology,
- special reel/wheel position,
- logo,
- character,
- jackpot/header zones,
- win/prize zone,
- feature counters/meters,
- bottom controls,
- foreground overlaps,
- safe crop background,
- key negative space.

Lock those relationships into a layout/config manifest.

## Design-space coordinates

Jeepney's fixed logical design-space approach is a strong base.

Use a stable logical canvas based on the approved concept, often 1080x1920 for portrait titles when that matches the source art.

Map to viewport predictably:
- gameplay plane: contain/fit inside safe area,
- background: cover/crop,
- decorative bleed: may crop,
- critical UI: stays inside safe area,
- touch controls: respect device insets.

Do not solve responsiveness with dozens of random pixel breakpoints.

## Showcase config path

For Showcase-family titles, keep reskin/config changes concentrated in the existing configuration surfaces such as:
- skin_config,
- engine_config,
- feature_config,
- stable asset IDs and imported layout data.

Preserve the existing provider/gameflow boundary.

If PSD/import tooling already captures placement/font/blend information, use that data rather than eyeballing all positions again.

## Jeepney theme path

For Jeepney-family titles, use the theme/layout configuration and logical coordinate system as the first customization surface.

Preserve:
- reel/wheel topology,
- declared layout anchors,
- decorative z/layer intent,
- semantic Spine states,
- timing config separation.

Do not hardcode a theme reskin deep into GameController if theme/config can express it.

## Layer contract

Use named layers instead of random z-index escalation.

Typical ordering:
1. background,
2. environment back,
3. rear atmospheric VFX,
4. reel/wheel backplates,
5. symbols/reels,
6. symbol/win VFX,
7. foreground/character art,
8. gameplay HUD,
9. reward/feature overlay,
10. modal/help/debug.

A title can add layers, but their responsibilities should remain clear.

## Stable asset IDs

Keep gameplay references stable while art changes.

Example principle:
- code asks for HIGH_01 or SCATTER semantic asset,
- theme/skin config points that ID to the title artwork.

Do not rename gameplay IDs every time an artist changes a filename.

## Spine states

Prefer semantic states:
- idle,
- land,
- win,
- anticipation,
- trigger,
- loop,
- exit.

Map those semantic states to actual Spine animation names in config/adapter code.

This allows the animation asset to evolve without rewriting gameplay controllers.

## ART-PIPELINE-MCP

When connected, ART-PIPELINE-MCP can handle:
- PSD inspection/preparation,
- crop/export,
- Spine rig/mesh/weights,
- animation,
- procedural VFX,
- AE-assisted effects where justified,
- runtime/mobile budget QA.

The FRONTEND Slots Agent remains responsible for where and when those assets are used in gameplay.

Asset tooling never becomes the math authority.

## Reel readability

Test symbols at actual mobile play size.

Require:
- distinct silhouettes,
- strong high/low separation,
- readable special-symbol text/value,
- no frame ornament stealing the symbol area,
- controlled glow that preserves edges,
- no tiny detail that vanishes at game scale.

A hi-res source image is not automatically a readable reel symbol.

## Symbol interaction hit areas

The new payout inspector requires reliable hit testing.

Rules:
- stop/idle state only by default,
- hit area can be larger than visible symbol art,
- do not overlap neighboring symbol hit zones,
- mobile tap target should be forgiving,
- do not hijack host-page scrolling outside the actual game canvas,
- popup placement accounts for finger occlusion.

## Safe areas and mobile browser behavior

Handle:
- safe-area insets/notches,
- dynamic viewport height,
- browser bars,
- orientation changes,
- landscape cutouts,
- page resize during resume,
- virtual keyboard if any text field exists.

Critical spin/bet/win/feature information must not live under device chrome.

## Portrait and landscape

Showcase already demonstrates portrait/landscape support; preserve that idea.

Responsive behavior may change:
- crop,
- scale,
- horizontal spacing,
- decorative placement.

It must not change:
- reel topology,
- meaning of controls,
- visibility of critical values,
- causal readability.

If one orientation is preferred, make the other graceful rather than broken.

## Background vs gameplay crop

Background can cover and crop.

Gameplay should not.

Characters/decorations may have controlled crop zones when concept allows.

Never solve a difficult aspect ratio by chopping off the spin button, multiplier reel or win value.

## Controls

Primary controls should remain visually obvious against theme art.

Theme can alter materials and shape language, but usability wins:
- spin remains dominant,
- utility controls remain subordinate,
- disabled states are clear,
- turbo/auto states are legible,
- feature-buy/bet controls are not confused with decorative art.

## Live text vs baked text

Use live text for:
- balances,
- bets,
- wins,
- dynamic multipliers,
- jackpot amounts,
- localized feature messages where practical.

Do not bake dynamic financial values into images.

For localization plan:
- longer labels,
- different decimal/group separators,
- currency placement,
- large jackpot digits,
- fallback fonts/glyph coverage.

## Concept fidelity review

Before signoff compare runtime to approved concept:
- reel size and placement,
- logo scale,
- character silhouette,
- major material/color blocks,
- negative space,
- feature prominence,
- control hierarchy,
- background crop,
- focal sequence.

Do not approve solely from code correctness.

## Reskin safety check

A normal art reskin should not require edits to:
- outcome generation,
- paytable,
- reel weights,
- feature odds.

If changing art appears to require RED-zone code edits, stop and inspect the architecture before proceeding.
