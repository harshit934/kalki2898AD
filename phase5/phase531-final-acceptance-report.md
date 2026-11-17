# Phase 5.3.1 final acceptance recommendation

**FAIL — do not close Phase 5.3.** Recorded 2026-11-12T13:19:52.177Z. Stop for user review; no Phase 5.4 implementation. This concludes the planned bounded validation/reporting pass, not milestone acceptance.

## Acceptance criteria

1. Major Mission 1 entry-camera obstruction: corrected in normal encounter/replay evidence; interrupted-intro fixture STRESS PASS (6.5 m). Close-range partial boss occlusion remains a limitation.
2. Visual corrections: rubble, weathering and riverbank improved. Repetitive architecture, simplified props, shading and animation limitations remain and have not been explicitly accepted.
3. Missions 3–10: eight individual basic smoke passes. Full prototype completion/reward/endings are not claimed.
4. Mission 1/2 regression: completed Mission 1 replay and touch encounter; three Mission 2 keyboard natural endings passed. Corrected Mission 2 touch route passed; original failed bot result remains retained. Bujji first chase handoffs passed, portrait contract replay timeout remains documented.
5. Performance: **FAIL**. True-720p screenshot-free combat recorded a 3381.1 ms frame gap; three combat averages were 28.9, 15.8 and 22.0 FPS. The separate 1080p test is not a stability certification. A 3049.1 ms diagnostic ending render also remains unresolved. Failed screenshot-free replay cannot certify an ending it did not reach.
6. Preservation: 47/47 protected hashes match. 112/112 saved source/config hashes unchanged since handoff. All five old Phase 5.3 deliverables unchanged: true. Real user saves were not used.
7. Build/lint: **PASS**, both exit 0. Four MenuScene.jsx react(immutability) warnings are byte-identical to the preserved lint baseline. The build also retains a large-chunk warning; see the saved logs and manifest.

## Blocking issues and recommendation

Do not sign off stable 30 FPS or Phase 5.3 closure. The exact remaining ending resource-upload blocking chain is not established. The original portrait post-chase replay timeout is not fully cleared by the narrower replay-start fixture; corrected Mission 2 touch evidence is recorded below. Visual limitations require explicit acceptance.

Keep Phase 5.3 open and request approval for only a short, scoped main-frame stage-span/resource-owner capture around the remaining >100 ms gaps. Current clean traces separate render-call duration from render-to-render gaps but do not name the operation filling the gap. Do not choose a speculative repair. Inspect ending upload ownership separately only if that stall is reproduced. This is a recommendation, not an automatically launched investigation or new phase. Preserve current evidence and rollback.

## Evidence and handoff

- [Corrective report](phase531-corrective-development-report.md)
- [Camera/visual review and screenshots](phase531-camera-visual-review.md)
- [Individual regression results](phase531-mission-regression-results.json)
- [Performance windows, percentiles and maxima](phase531-performance-results.json)
- [Changes, build/lint and all protected hashes](phase531-changes-and-hashes.json)

Free workspace-volume space at verification: 61.00 GB (60999901184 bytes). Missing portable Blender was investigated separately; no replacement installed, and existing assets supported testing. Saved source/evidence is resumable. Owned validation-process cleanup is recorded in the manifest; unrelated user development servers must remain untouched.

## Clean-capture stall distinction

The screenshot-free controlled windows recorded a worst render-to-render gap of 3381.1 ms. See `controlledGapEvidence` in the performance JSON for each gap and the preceding/following synchronous render duration. A long gap outside the synchronous render call is not proof of shader compilation, GPU execution, collision lock or AI deadlock. The unmeasured interval remains unattributed. Multiple-attacker and boss/transition matched performance coverage is incomplete; no complete performance acceptance is claimed.

## Targeted follow-up disposition

Corrected missing-pylon touch route: mission-2-mobile PASS. See the closure runner for any timeout. Completed-contract replay UI fixture: INCOMPLETE/FAIL; inspect per-layout evidence. Original failed runs remain retained. These follow-ups do not clear the performance blocker.

Phase 5.4 readiness: **NOT READY under the existing acceptance criteria**. Wait for explicit user review/approval; no Phase 5.4 work or further diagnostic batch is scheduled.

## Contract-intro timeout evidence

The isolated completed-contract replay fixture timed out after 20 seconds in both layouts: sequence `intro`, cinematic `playing`, desktop cinematic time approximately 0.2664 s and portrait approximately 0.1 s. `readyActors` contained Bhairava; the config requires exactly that one actor. Therefore an actor-readiness deadlock is **not established**. No synchronized frame/GL-stage trace was recorded in this fixture, so the operation delaying advancement is unknown. The first full duel/chase/handoff passed both layouts; the replay-intro timeout remains a separate failed test. Manual intro skip was not exercised after these timeouts, so this evidence does not prove an unrecoverable lock. No speculative cinematic source change was made.
