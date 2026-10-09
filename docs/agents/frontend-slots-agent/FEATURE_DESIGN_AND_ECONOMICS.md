# FRONTEND Slots Agent — Feature Design, Excitement and Economics

Use this playbook when asked to make a slot more exciting, improve retention, add or review features
(special Wilds, multipliers, Extra Bet, Buy Bonus, max win), or judge whether a mechanic is working.

It was written from a real review-and-build pass on a Megaways-style tumble prototype
("Mayan Wild Throw"): the measurements below are from that game's own simulator, not guesses.

## 1. Declare the build intent first

Ask, or infer from the request, which of these the work is:

| Intent | What matters | Math stance |
|---|---|---|
| **SHOWCASE** (pitch, art/animation demo, concept prototype) | Feel, readability, the feature's wow moment, art hooks | Demo math is a design tool. Tune it freely, still measure it, keep it "not silly". No certification or legal wording. |
| **PRODUCTION** | Everything in MATH_AND_STATE.md and QA_AND_PERFORMANCE.md | RED-zone rules apply in full. |

In SHOWCASE work the local demo engine *is* the design surface: changing weights, feature odds
and buy prices is expected. Do it through the simulator, label it placeholder, and never call it
certified. When the user says payback precision isn't the priority, stop leading with RTP fixes:
mention a broken economy once, then spend the effort on the feature.

"Not silly" still matters in SHOWCASE: a buy that pays back 3x its price, or a feature that pays
big every time, kills tension and makes the demo feel fake. Keep every option's average return
roughly at or below its price.

## 2. Audit before suggesting: does the headline feature change outcomes?

Trace the signature mechanic through the math code, not the presenter. Ask:
- Is the feature's object evaluated **before** or **after** the win it belongs to?
- Does it survive into the next evaluation, or is it destroyed with the win?
- What does a player actually gain when it fires?

Field case: the game's namesake "Wild Throw" placed the thrown Wild **after** the win was counted
and then detonated it with the win. It could never pay. The headline feature was cosmetic: one
extra cleared tile. Animation alone hid this; reading the step order found it in minutes.

## 3. The economics lab: measure, don't eyeball

Before proposing changes, run the project's simulator (or write one against the pure math module).
Play every bonus **in full**: sampling bonuses (the source sim ran 1 in 4) hides retrigger and tail
behaviour. Measure at least:

- total return, split base vs bonus (share of return from the bonus),
- trigger frequency and the 2-Scatter tease frequency,
- return of **each** bet mode separately (Extra Bet on/off),
- return of **each** buy option against its price, plus median, p10/p90/p99, max,
  and the share of buys returning less than half their price,
- free spins that win nothing (%), retriggers per bonus, final bonus multiplier spread,
- spins between "meaningful" wins (e.g. 5x+), longest dead streak,
- 10x / 25x / 50x / 100x frequencies, biggest win seen,
- frequency of each special event (Golden Wild, multiplier paid, max win).

Use 200k+ base spins and 20k+ buys. Multiplier features are tail-heavy: averages swing by several x
between runs, so price from big samples and say so in the config comment.

Keep the measuring script outside the game folder (scratch space) unless the user wants it shipped;
update the game's own sim tool so the next person sees the new features too.

## 4. Known traps (each one was hit for real)

### Extra Bet that boosts per-cell Scatter weight
A per-cell weight boost compounds: triggers need 3+ Scatters, so ×1.5 per cell gave ×2.5 triggers
(1 in 62 → 1 in 25) for ×1.25 cost = **153% return**. Balancing it back (×1.15) left a change players
can't feel (1 in 62 → 1 in 45). Prefer an Extra Bet with a **visible** benefit (guaranteed Wild on a
reel, lowered feature threshold, extra feature symbol) and balance that.

### Buy price set to the bonus average
Price = average value gives ~100% return, above the base game, so buying always wins.
Price = measured mean ÷ target return (≈ base-game return). Re-price after every feature change.

### Multipliers multiplied by multipliers
Wild multipliers (x2-x10) multiplying wins that already carry a x18-x40 bonus multiplier sent total
return to 356%. Patterns that stay bounded and still feel huge:
- **Base game:** multipliers on Wilds in the same win add together, then multiply that win.
- **Free spins:** they are **added to the bonus multiplier for good** (x38 + x7 = x45). This gives the
  bonus the progression it usually lacks.
- Multiplier Wilds pay and burst; they don't trigger further throws (runaway chains).
Tune in this order: event frequency → multiplier distribution → mechanic rules. Re-run the sim after each step.

### A frequent super-version multiplies everything
A 60% chance for every winning Wild to upgrade and throw 3-7 multiplier Wilds took the demo to ~4,000%
(Golden throw every 8 spins), and still ~1,300% after making Wild multipliers add instead of multiply,
because several sticky Wilds across reels explode the ways count. Keep the user's rule (60%, 3-7) and
move the levers they didn't set: Wild frequency (Golden ~1 in 25 spins), then paytable scale, then buy
prices and package sizes. Say which agreed numbers changed (e.g. a 10-spin buy became 4 spins to stay cheap).

### Collect-then-multiply changes the economy
Switching from "each tumble pays at its multiplier" to "collect, multiply once at the end" means every
win gets at least the first step (x2 here). Payback nearly doubled; rescale the paytable and re-price buys.

### A bonus multiplier that starts high and steps small
Starting at x18 and adding +1 per win reads as nothing (+5%). Measured: median bonus ended at x25.
Either step proportionally, or feed the multiplier from a visible event (see above).

### Only buyers can reach the enhanced feature
If the x36/enhanced bonus can only be bought, natural players have nothing to chase.
Give a natural route (4+ Scatters, special trigger) even if rare.

## 5. Retention and excitement levers (ranked by what landed)

1. **Make the signature feature pay**, and give it a rare super-version. The user's favourite: a
   Golden Wild that **screeches, charges and throws several Wilds at once**, each landing with a
   multiplier that stays on the board until it pays. One rare, loud, multi-hit moment beats many small ones.
2. **Cheap feature-buy tier** (~10x): 10 spins showcasing the core feature (a Wild on every spin,
   the super-version more often, no Scatters). It lets non-buyers sample the best part.
3. **Raise the ceiling, then cap it**: rare top-end event + a published max win (e.g. 5,000x).
4. **Progression inside the bonus**: things that accumulate for the rest of the bonus
   (multiplier boosts, collected Scatters → extra spins / bigger steps).
5. **A path to the top feature for natural play.**
6. **Persistent meters** (collect across spins) only with per-bet-level server state in production.

Always offer suggestions as a short ranked list with a recommendation, then let the user pick.
Build only what they pick.

## 6. Max win cap mechanics

- Cap per **round**: a base spin, or the trigger spin plus its whole feature (buys included).
- Pass "money left before the cap" into each result request; the math truncates the step that crosses
  it, sets `maxWin`, stops tumbling, and awards no trigger.
- Presenter: end the feature immediately (cancel remaining spins), show a dedicated MAX WIN screen
  with "N× bet · round complete", then return to base.
- Add a **forced max-win scenario** in the mode where it's reachable (usually the enhanced bonus);
  natural max wins are too rare to QA by spinning.

## 7. Forced scenarios must stay on purpose

Bound each force to what it demonstrates. A "two Golden Wilds" force without an upper win bound
happily returned a 5,000x max win: right mechanic, wrong demo. Add `totalWin < N × bet` and
similar guards, and score fallbacks so the search degrades gracefully.

## 8. Deliverable shape for a feature pass

- Work in a **copy** next to the user's original (never edit the source zip); name the folder for
  what it is and ship a zip built with forward-slash paths. (Zips made on Windows can carry
  backslash paths; macOS `unzip` warns and converts them.) Verify the zip from a fresh unzip.
- `CHANGES.md` in the build: what's new, tuning knobs, measured numbers, and **art hooks**
  (CSS classes, events, sound names) so the art/animation pass can swap placeholders without code changes.
- Event names for each new beat (e.g. GOLDEN_WILD, GOLDEN_THROW, WILD_MULTIPLIER, MAX_WIN) in the
  event log, so Spine timelines can key off them later.
