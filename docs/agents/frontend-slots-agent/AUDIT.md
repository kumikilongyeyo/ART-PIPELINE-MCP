# FRONTEND Slots Agent — Source-Pack Audit

This audit was rebuilt from the actual Slot Engines Source Pack and supersedes the earlier wrong-file pass.

## 1. The two engines should be fused, not ranked

### Showcase strength
The Showcase project has the cleaner math/presentation seam:
- IResultProvider-style abstraction,
- mock/server/scenario providers,
- normalized spin results,
- scenario forcing,
- QA that can compare presented board/final state.

### Jeepney strength
The Jeepney project has the stronger presentation discipline:
- controller explicitly owns HOW/WHEN results are shown,
- normal/turbo timing profiles,
- skip token/clock,
- wheel and EX NUDGE sequencing,
- presentation-only debug replays,
- strong Spine/VFX integration.

### Smarter solution
Use Showcase's provider/result architecture and Jeepney's timing/presentation architecture as the common target.

## 2. Jeepney needs a production provider seam

Jeepney directly creates its local SlotEngine and its Session handles demo balance/settlement.

That is fine for a demo but too coupled for production integration.

### Solution
Put Jeepney behind the same RoundProvider concept:
- server provider for production,
- local/mock provider for demo,
- scenario/recorded provider for QA.

Keep GameController focused on presentation.

## 3. Symbol tap/click payout is missing in both engines

Neither supplied SymbolView implementation provides the requested per-reel-symbol payout inspector.

### Solution
Add a board-level SymbolInspectorController:
- stopped/settled reels only,
- click/tap a symbol,
- derive payout/function from active paytable/config,
- safe tooltip placement,
- dismiss on gameplay start/transition,
- optional matching-symbol soft highlight.

Never duplicate payout values in tooltip code.

## 4. Bonus transitions exist but are not generalized

The pack has useful feature intros and mode changes, but no single reusable transition contract.

### Solution
Create explicit feature transition states:

    TRIGGER_RECOGNITION
    FEATURE_CONFIRMATION
    FEATURE_TRANSITION_IN
    FEATURE_READY
    FEATURE_COMPLETE
    FEATURE_TRANSITION_OUT

Preload required feature assets before entry.

## 5. Eye-leading needed an executable grammar

"Make it immersive" is too vague for an agent.

### Solution
Use:

    CAUSE -> RECOGNITION -> FOCUS -> REWARD -> READ -> RELEASE

And an attention budget:
- primary,
- secondary,
- ambient.

This makes prize presentation reviewable instead of subjective hand-waving.

## 6. Showcase timing is too dependent on magic waits

Showcase has several literal presentation waits while Jeepney centralizes timing profiles more effectively.

### Solution
Move presentation durations into semantic config/timing profiles:
- normal,
- turbo1,
- turbo2 where supported,
- reducedMotion.

Use cancellable timelines/tokens rather than unrelated timers.

## 7. Jeepney's cosmetic randomness hurts exact replay

Some Jeepney presentation/VFX paths use Math.random.

This does not decide payouts, but it makes exact screenshots/video replay non-deterministic.

### Solution
Introduce seeded VisualRng:
- seed from round/sequence/event identity,
- use only for visual randomness,
- keep completely separate from outcome RNG.

## 8. ServerResultProvider needs production hardening

The Showcase server provider is a useful seam but is intentionally minimal.

Missing production concerns include:
- runtime schema validation,
- schemaVersion,
- requestId/roundId discipline,
- mathVersion/rtpProfileId,
- timeout/abort,
- idempotent retry/recovery,
- reconnect and session sync.

### Solution
Harden the provider contract without leaking network logic into presentation.

Never blindly retry an unknown-outcome spin request unless the backend supports idempotency.

## 9. State models are too coarse for recovery

Existing phases are enough for demos but not enough to reason cleanly about request-in-flight, feature transitions and recovery.

### Solution
Use explicit/high-level states such as:

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

Use roundId and sequenceId to reject stale callbacks.

## 10. QA is split across two good ideas

Showcase has stronger valid full-round scenarios.

Jeepney has stronger cheap presentation-only replays.

### Solution
Keep both:
1. rule-valid full-result fixtures,
2. presentation-only replay,
3. recorded normalized-result replay,
4. visual regression,
5. deterministic VisualRng.

Do not confuse a presentation replay with a payable round.

## 11. RTP modification must stay a RED-zone workflow

The user needs a clean RTP modification space, but that cannot become casual frontend tuning.

### Solution
Track:

    mathVersion + rtpProfileId + configChecksum

Any reel weight, paytable, feature probability, multiplier distribution or return-affecting buy-price change requires math validation/simulation.

Presentation receives approved math results. It does not manipulate return.

## 12. Mobile lifecycle needs stronger recovery

The engines account for responsive presentation and some audio visibility behavior, but full presentation recovery is not generalized.

### Solution
Handle:
- visibility suspend/resume,
- pagehide/pageshow,
- orientation change,
- dynamic mobile viewport,
- reconnect,
- refresh after settled result.

On resume, revalidate round/state and resume or fast-forward presentation without double settlement.

## 13. Engine selection should happen before coding

The source pack already contains multiple useful topologies.

### Solution
Select the closest family first:
- Showcase cascade: Super Ace/Piñata/Bonanza/Olympus-like,
- Showcase reelmult: 3x3 collector and 3x3+1 multiplier,
- Jeepney: 4x3+1 wheel/EX NUDGE.

Create a new engine only if config/contained extension cannot express the title.

## 14. Source pack master should stay protected

A reskin should not silently become an engine rewrite.

### Solution
Create a title copy/branch/project first, preserve stable asset IDs, and classify changes GREEN/YELLOW/RED before edits.

## 15. The previous agent restricted its Claude tools

The earlier agent frontmatter declared only common file/shell tools.

That can prevent a subagent from seeing connected MCP tools such as ART-PIPELINE-MCP.

### Solution
The rebuilt agent omits a restricted tools list and inherits available session tools.

## 16. Art production and game presentation need a clear boundary

ART-PIPELINE-MCP can produce/validate PSD, Spine and VFX assets.

The frontend agent decides:
- where assets appear,
- which gameplay event calls them,
- timing,
- focus hierarchy,
- performance budget.

Neither asset tooling nor presentation should become the math authority.

## Final target architecture

    Approved concept + title manifest
                 |
                 v
          Layout / asset contract
                 |
                 v
    authoritative server OR demo math
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
        /       |        \
     Reels    Focus     Bonus/Reward
       |        |         |
     Spine     UI      VFX / Audio
                 |
                 v
       Fixtures / Replay / QA

The target is not one visual template. It is one reliable behavioral and technical backbone that can carry many different slot art directions.
