# Phase 6 Milestone 5H.29 — failure investigation

15 November 2026. **Best-supported classification: ordinary accumulated gameplay damage during the previous automated attempt, with insufficient defensive input. No gameplay-source regression or voice-caused defeat is demonstrated. Exact attribution of the historical fatal hit remains UNVERIFIED.**

## Evidence inspected

5H.27 report/checklist and preserved acceptance/rollback records; 5H.28 gap assessment, report and 44-row result CSV; `milestone5H28/raw-results.json`, `attempt-final.png`, natural-run harness and expanded staging adapter. Compared accepted staging at `milestone5H24/staging/` with expanded staging at `milestone5H28/staging/`. Inspected player input, player attack/block resolution, gameplay health, patrol strike, world hazard, boss/projectile, relic and campaign/cinematic code.

Fresh derived evidence: `milestone5H29/prior-defeat-analysis.json`. Previous raw evidence was not rewritten.

## What the failed attempt establishes

- Began at100HP with no completion or rewards.
- Lost80.4HP before the arena; entered active Warden encounter at19.6HP.
- Observed boss-stage health progression: **19.6 →16.6 →6.6 →0**. Warden remained at46/720HP when the player died. The final6.6 loss is remaining health clamped to zero, not proof of a6.6-damage attack.
- Three patrols had been defeated, so patrol clearance and arena entry worked. Boss health continued falling, demonstrating ongoing combat rather than an AI or progression deadlock.
- At fatal observation: no game-clock holds, narration inactive with status ended, no page exception; the screenshot shows the ordinary defeat screen, not a stuck voice panel. No relic or completion was fabricated.
- The old harness issued67 attack inputs during78.394seconds. These are input counts, not67 confirmed successful attacks.

The approximately1second old snapshots do not retain exact damage sources or blocking state at each hit. Observed14HP pre-arena losses may include baseline hazards or grouped hits; they cannot all be labelled patrol strikes. There is no timestamp-correlated proof that audio caused a loss of control.

## Actual health and attack paths

Paths below are in the preserved `phase6/milestone5H28/staging/src/` tree:

- `game/gameplayStore.js:99`, `takeDamage`: respects game holds and immunity; applies normal incoming amount or **30% while blocking**; subtracts health and sets gameOver when zero.
- `game/CombatEnemies.jsx:633`: ordinary patrol strike calls the existing health method after its wind-up, range and line-of-sight checks.
- `game/Gameplay.jsx:70`, `:121`, `:182`: existing environmental contacts call takeDamage(14). This is a separate possible source for pre-arena14HP observations.
- `game/BossEncounter.jsx:524` and projectile path at`:495`: existing boss melee/area/projectile damage. Telegraph completion clears the warning before a projectile necessarily reaches the player.
- `game/player/PlayerInput.jsx:56`: keyboard input queues normal attacks/dodge and controls blocking. No voice-specific input suppression exists there.
- `game/player/Player.jsx:702`: normal attack buffering permits attacks only when active, not blocking and not dodging; heavy damage48/cooldown900ms remain baseline.

Accepted versus expanded existing source differs only in the staging voice adapter. Health, damage, patrol AI, player controls, boss rules, reward and completion source files match. The adapter reads state and owns narration; it contains no mission reward/completion callbacks or health setters.

## Likely contributing input strategy, not a proven exact old-hit explanation

The old navigation harness guarded while a boss warning existed or briefly after an attack, using wall-clock intervals. It could stop guarding once a warning cleared even with a bolt still travelling. The historical unblocked-sized loss is consistent with that exposure, but the missing old per-hit/projectile/input journal prevents identifying the exact fatal operation with certainty. Route hazards, facing/missed attacks and defensive timing also affect an automated attempt.

The retest therefore changed **only the test's ordinary keyboard strategy**: keep F guard between heavy counters, wait for the queued attack to be consumed before restoring guard, account for active projectiles as well as telegraphs, and time attack spacing using game time. These are playing decisions, not a gameplay fix. No stats, AI, damage values, physics, mission state or audio source was modified.

## Fresh evidence from the unchanged expanded copy

The new run intentionally accepted normal enemy/contact hits until the existing low-health advice was eligible, rather than assigning health. The warning triggered at31HP; the Warden began at22playerHP. New read-only journals record11 actual health changes and199 key events. Boss-stage losses were **3,3,3.9**, each with blocking=true at the health update; one of those records also shows a live projectile. Final health12.1.

The player naturally defeated the Warden, collected the relic, played the ending without a skip and earned completion. This supports the ordinary-defeat/input-strategy assessment and demonstrates that expanded narration does not necessarily prevent completion. It is not an A/B experiment proving the cause of every historical hit or proving absence of all possible integration bugs.

## Conclusions by confidence

- **PASS / confirmed:** historical health depletion and ordinary defeat state; unchanged gameplay source; successful natural completion with the same expanded voice implementation and baseline rules.
- **PASS / evidence-supported assessment:** ordinary damage and less effective defensive control are the strongest explanation for the previous failed attempt. No gameplay repair was justified or made.
- **UNVERIFIED:** exact historical fatal damage call, exact old blocking state and any small timing contribution from audio/instrumentation. Do not attribute a decoder, AI, input-lock or driver root cause without evidence.

No production, accepted staging or expanded staging source was edited. See the playthrough report for the actual successful result and limits.
