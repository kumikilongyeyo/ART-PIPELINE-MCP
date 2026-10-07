# FRONTEND Slots Agent — Plan Audit

This records the gaps found in the earlier monolithic plan and the smarter architecture used by the consolidated agent.

## 1. Too much always-on prompt

The earlier plan contained many good rules but loaded all of them at once.

Risk: important instructions become harder to prioritize and every task carries unnecessary context.

Fix: keep a compact core agent and move specialist detail into on-demand playbooks for presentation, math/state, art/layout and QA/performance.

## 2. UI kit scope was too broad

The ArtPrompter kit is explicitly a Chrome-extension side-panel design system.

Risk: applying its macOS/glass styling to the actual slot would fight the approved slot art.

Fix: external UI kits are scoped specifications. ArtPrompter may govern tooling/editor/debug/utility surfaces, not immersive reels unless explicitly requested.

## 3. RTP modification needed a safer boundary

The earlier plan separated math and visuals but still left room for casual configuration edits.

Risk: frontend changes accidentally alter odds or claim an unvalidated RTP.

Fix: versioned math profiles, explicit mathVersion plus rtpProfileId, single approved paytable source, simulation/approval outside presentation, and server-authoritative production math by default.

## 4. No hard protection against stale async work

Slot presentation is full of delayed animation callbacks.

Risk: a late callback from the previous round modifies the next one.

Fix: every round has a round ID; longer sequences have sequence identity/cancellation. State and identity are checked before delayed mutations.

## 5. No deterministic replay workflow

Force buttons alone are useful but still weak for art review.

Fix: normalized round results are serializable and replayable. A recorded result can reproduce the exact presentation at normal/turbo/reduced-motion timing.

## 6. Refresh/reconnect was underspecified

Mobile browsers suspend, reload and reconnect frequently.

Fix: separate authoritative settlement from presentation, restore settled state on reconnect, and never allow replay/recovery to duplicate credit.

## 7. Presentation rules were descriptive, not executable enough

"Lead the eye" is correct but can remain subjective.

Fix: use the reusable grammar:

    CAUSE -> RECOGNITION -> FOCUS -> REWARD -> READ -> RELEASE

and an attention budget of primary / secondary / ambient.

## 8. Timing values risk becoming scattered magic numbers

Fix: semantic timing tokens and centralized timing profiles for normal/turbo/reduced-motion.

## 9. Layout preservation needed a technical mechanism

"Follow concept art" is not enough.

Fix: establish a logical design-space coordinate system, explicit anchor/safe-area manifest and a named visual-layer contract.

## 10. Payout inspection needed single-source data

If the clickable symbol tooltip has its own values, it will drift from math.

Fix: symbol inspector reads the active paytable/feature config directly.

## 11. Currency precision/localization was missing

Fix: settlement uses integer credits/minor units where possible; formatting is localized at the presentation layer.

## 12. Hidden-tab/mobile lifecycle was missing

Fix: on resume, discard stale timers, re-sync state/timeline, respect platform audio policy and never replay settlement.

## 13. Force/debug tooling could leak into production

Fix: explicit release gate: force mode/debug surfaces must be impossible to enable accidentally in production.

## 14. Bonus transitions lacked recovery semantics

Fix: bonus entry and exit are explicit states with preloaded assets, stable checkpoints and skip/recovery convergence.

## 15. Visual hierarchy could become more effects = more premium

Fix: define attention budget and VFX tiers. Stillness and suppression are legitimate premium tools.

## 16. No distinction between mechanic correctness and presentation correctness

Fix: definition of done requires both final-state correctness and player comprehension.

## Final architecture

    Approved Concept + Asset Manifest
                  |
                  v
            Layout Contract
                  |
    Math Adapter -> Normalized Round Result
                  |
                  v
             State Machine
                  |
                  v
        Presentation Controller
           /      |       \
        Reels     UI   Spine/VFX/Audio
                  |
                  v
          QA Replay + Telemetry

The architecture is theme-agnostic. Different reskins can share the same behavioral backbone without becoming visually identical.
