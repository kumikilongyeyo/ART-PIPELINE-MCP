# FRONTEND Slots Agent — Art, Layout and Responsive Playbook

Use this playbook when porting approved concept art, arranging reels/HUD, integrating assets or adapting to devices.

## Art-first implementation

The approved concept is the composition authority.

Do not begin with a generic slot shell and squeeze the art into it.

Start by measuring:
- reference canvas,
- reel bounding box,
- logo/character anchors,
- control zone,
- win-message zone,
- special feature zones,
- safe crop background,
- foreground overlaps.

Create a layout manifest or equivalent data structure instead of scattering positions across components.

## Design-space coordinates

Use a stable logical design space based on the approved concept, normally its source dimensions.

Map that design space to the viewport with a predictable transform.

Typical policy:
- gameplay plane: fit/contain within safe region,
- background: cover and crop,
- decorative bleed: allowed outside safe region,
- critical UI: anchored to gameplay/safe area,
- touch controls: respect device insets.

This preserves art relationships better than arbitrary breakpoint nudging.

## Layer contract

Define named visual layers, for example:
1. background,
2. environment back,
3. rear VFX,
4. reel frame/backplate,
5. reel symbols,
6. symbol/front VFX,
7. character/foreground art,
8. gameplay HUD,
9. transient reward layer,
10. modal/info/debug.

Do not solve z-order bugs with random escalating z-index values.

## Reel readability

At gameplay scale:
- symbol silhouettes must remain distinct,
- important text/numbers must survive mobile size,
- frame ornament cannot eat symbol area,
- glow cannot destroy edges,
- high/low symbols should separate clearly.

Test at the actual target viewport, not just browser zoom on desktop.

## Safe areas and mobile browser behavior

Account for:
- safe-area insets,
- iOS dynamic viewport behavior,
- address bar changes,
- orientation change,
- landscape notches/cutouts,
- virtual keyboard if any text input exists.

Do not anchor critical controls to a hard-coded physical screen edge without safe-area compensation.

## Touch

Visible icon size and touch hitbox may differ.

Prefer touch targets around 44 by 44 CSS pixels where practical, especially for utility controls.

Reel-symbol inspection must remain reliable without stealing normal swipe/scroll gestures from a host page.

## Asset ingestion

Before implementation inspect:
- dimensions,
- transparency,
- alpha fringes,
- extra whitespace,
- pivots/origins,
- naming,
- duplicate variants,
- texture/atlas opportunities,
- color-space assumptions,
- Spine atlas/runtime compatibility.

Flag bad source assets instead of burying permanent hacks in layout code.

## SVG/live text preference

For utility UI:
- prefer SVG/currentColor where appropriate,
- prefer live text over raster labels,
- keep icons themeable,
- avoid rasterizing simple controls.

For immersive slot art, follow the supplied production asset format and performance budget.

## External UI kits

A supplied UI kit governs only the surface it was designed for.

For the uploaded ArtPrompter Studio kit specifically:
- its macOS-inspired geometry, tokens and glass actions are appropriate for tool/editor surfaces,
- currentColor SVG masters are implementation-friendly,
- normal controls are intentionally calm,
- special glass treatment is intentionally limited,
- its 40/44 px interaction target and reduced-motion guidance are useful.

Do not automatically apply ArtPrompter's macOS/glass visual language to the reel game itself. The slot screen remains governed by its approved theme/concept.

## Responsive strategy

Support at least:
- desktop,
- tablet,
- portrait phone,
- landscape phone.

Avoid dozens of breakpoint-specific pixel patches.

Prefer:
- anchors,
- proportional regions,
- min/max scale constraints,
- safe-area variables,
- aspect-ratio modes.

If the game has a preferred orientation, still handle the non-preferred orientation gracefully.

## Text and localization

Do not bake text into art if it needs localization, dynamic values or accessibility.

Plan for:
- longer localized labels,
- comma/decimal differences,
- currency symbol placement,
- compact jackpot formatting,
- dynamic font sizing within bounded limits.

Numbers should never overlap decorative frames at common extremes.

## Concept fidelity review

Before signoff compare runtime against approved concept:
- reel placement,
- logo scale,
- character silhouette,
- negative space,
- control hierarchy,
- background crop,
- feature prominence,
- visual balance.

A responsive implementation can change crop and spacing without losing the original visual story.
