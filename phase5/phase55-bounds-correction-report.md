# Phase 5.5 — Targeted bounds correction

## Decision

**PASS for the authorized bounds fix. Overall Phase 5.5 approval remains pending user review.** The confirmed ending-actor vertex scans are removed from ending initialization. Remaining brief portrait gameplay stutters and a transition gap are explicitly unresolved. This report does not declare the entire game accepted.

## Changes and rollback

Only two of 146 baseline source files changed: `src/App.jsx` and `src/game/kashiRevision/endingBounds.js`; the other 144 match. The original Mission 1 route now uses the existing loading gate to prepare the already-loaded ending actor's normalization and conservative animated culling bounds. The ending clone receives cached bounds instead of recomputing them. Existing animated-bound mathematics, height/ground normalization, animations, costume, weapon, camera, shadows and shader warm-up are unchanged.

Cancellation uses the existing request identity, retries retain the default-route preparation flag, and readiness verifies Mission 1. The default route does not wait for the opt-in revision's first-frame event. Original environment remains default; revised Kashi remains opt-in. No campaign expansion, save-format, combat, control or reward changes were made.

Backups are in `phase55-bounds-correction-20261114/source-before/`, with exact diff in `source-changes.patch`. To roll back, stop the game, check for subsequent edits, and restore only those two backed-up files. Do not restore the entire source tree or any personal-save files.

## Before / after evidence

The previous investigation established repeated `CinematicActor → Box3.setFromObject → SkinnedMesh.computeBoundingBox` work, followed by first-draw `Frustum.intersectsObject → computeBoundingSphere`. Each routine visited 1,866,377 vertices across 24 meshes on every new ending clone. Detailed baseline samples measured normalization at 287.5–581.7 ms and sphere scans at 292.5–622.5 ms; the original normalization incident was 493.9 ms. The separate historical 522 ms render followed that gap.

After correction, three direct ending playback checks measured bounds application at **0.3, 0.0 and 0.1 ms**. A complete natural Mission 1 ending measured **0.3 ms application**, **1.8 ms clone creation**, and **zero bounding-box/sphere scans on the 24 ending-actor meshes**. Ordinary NPC scans still occur and are not misrepresented as ending scans. All measured application times meet the below-5-ms target.

Preparation now occurs before gameplay: successful lifecycle samples took approximately **2.05–6.17 seconds**. An earlier diagnostic attempt recorded 8.08 seconds. Work is moved into loading and cached, not eliminated globally. These loading costs are excluded from active-gameplay statistics.

Natural ending playback completed approximately **10.43 seconds**, reached victory, retained rewards across reload and did not duplicate replay rewards. First ending frame gap was **183.6 ms**, with **27.9 ms renderer time**. This remaining transition gap is not attributed or claimed fixed. The historical and current render durations are not a controlled whole-game percentage comparison.

## Executed functional checks

- PASS: cancellation during delayed loading, no late mission entry, retry after deliberately failed GLB request, default-route readiness without revision-event deadlock.
- PASS: repeated ending playback, pause/resume, restart confirmation, disposable campaign state preservation.
- PASS: natural Mission 1 combat, Warden defeat, relic collection, full ending, victory and reload/reward persistence. First attempt ended in ordinary player defeat; it is retained as a failed run. Retry improved the test driver's telegraph response and used earned abilities; no health/boss/reward overrides were used.
- PASS: short Mission 20 duel, three phases, attacks, relic/reward and reload checks.
- PASS: portrait emulated touch joystick, sprint ownership, keyboard/touch actions, actual relay interaction, blur cleanup, Esc pause/resume, target hitability and no overflow.
- PASS: production build, route helper checks and lint with **zero errors and the same nine existing warnings**. Warnings concern existing menu/city immutability and paused campaign imports/immutability.

Earlier harness failures remain available: an undefined diagnostic-variable predicate, an animated menu button pointer-stability timeout, and an overly broad assertion counting unrelated NPC scans. Corrected checks use normal keyboard activation and exact ending-mesh identities. These failures are not reported as successful tests or evidence of a new production fix.

The natural ending screenshot confirms the retained actor presentation: [actual ending capture](phase55-bounds-correction-20261114/natural-retry/natural-ending-actor.png). No new art-quality claim is made.

## Short gameplay performance checks

Four 45-second windows used a production-derived minimal diagnostic build without CPU profiling, browser tracing, GPU timing queries or screenshots during timed windows. A passive animation-frame heartbeat and native power/memory sampler remained enabled. Rendering was on the GTX 1650. Desktop drawing buffer/CSS were **1920×1080**, DPR 1; portrait buffer was **860×1864**, CSS **430×932**, DPR 2. Portrait results are desktop Chrome emulation, not physical-phone performance. All windows ended without player death or a permanent gameplay lock.

Frame times below are milliseconds; FPS is an average and does not conceal the outliers:

- **desktop1080-r1**: 29.94 FPS; median 34.6, p95 35.1, p99 36.1, maximum 120.0; 1 gaps above 100 ms / 45 seconds.
- **portrait-r1**: 91.06 FPS; median 7.1, p95 25.7, p99 41.7, maximum 174.1; 27 gaps above 100 ms / 45 seconds.
- **desktop1080-r2**: 30.00 FPS; median 34.6, p95 35.2, p99 35.6, maximum 38.1; 0 gaps above 100 ms / 45 seconds.
- **portrait-r2**: 92.50 FPS; median 7.1, p95 25.8, p99 33.3, maximum 142.8; 20 gaps above 100 ms / 45 seconds.

Desktop idle exploration had one 120 ms hitch across 90 seconds. Portrait near-guard blocking had **47 gaps above 100 ms across 90 seconds**, maximum 174.1 ms: this is recurring brief gameplay stutter, not a transition-only limitation. Matching heartbeat pauses while the document was visible support interrupted frame delivery; physical display latency and human-perceived disruption were not measured. Controls recovered and no persistent movement lock was observed. High portrait average FPS does not establish smoothness.

The separate short Mission 20 fight lasted approximately 23.98 seconds, maximum **36.9 ms**, with no gaps above 100 ms. The historical 442.1 ms renderer call / 455.6 ms interval did not recur in this sample. Prior investigation reproduced other Mission 20 gaps in three fights; their causes remain unresolved. This patch does not touch Mission 20 and cannot be credited with fixing those incidents. No multi-second freeze was reproduced in this cycle; historical severe episodes are not declared resolved.

Every >100-ms gap in the four short windows, with timestamps and renderer duration, is retained in `performance/results.json` and raw frame journals. Full natural-playthrough journal is in `natural-retry/mission1-natural-diagnostic-frame-journal.json`. Earlier investigation evidence remains unchanged. No additional broad performance investigation was started.

## Integrity, limitations and cleanup

`final-integrity.json` verifies **47/47 protected hashes**, **14/14 preserved campaign copies**, and **11/11 baselined personal LevelDB file hashes**. Personal profile was not launched or written by this cycle; destructive checks used disposable profiles. A `LOCK` file exists but was not in the original hash dictionary, so whole-directory identity is not asserted. Current hash preservation does not prove save history before the baseline.

The existing cinematic implementation, shader warm-up, combat, input, mission and persistence source files match their baseline hashes. Generated diagnostic builds, drivers, logs, raw journals and backups are retained under `phase55-bounds-correction-20261114/`; production diagnostic hooks were not added.

Cleanup verification successfully queried processes and ports: no owned diagnostic processes or listeners remained on the five test ports. No unrelated processes were stopped.

**Recommendation:** retain this narrowly verified correction. Judge overall Phase 5.5 acceptance with the documented recurring portrait stutter, remaining 183.6 ms ending transition and unresolved historical hitches explicitly visible. Perfect 30 FPS or zero isolated outliers was not imposed. No overall acceptance, further correction cycle or next phase is authorized by this report. Stop here for user review.

Evidence index: `initial-integrity.json`, `final-integrity.json`, `source-changes.patch`, `build.log`, `lint.log`, `route-unit.log`, `harness-pointer-stability-attempt/lifecycle-results.json`, `retry-lifecycle-results.json`, `natural/mission-natural-diagnostic-results.json`, `natural-retry/mission-natural-diagnostic-results.json`, `tests/input-browser-results.json`, `boss20/boss-browser-strict-results.json`, `performance/results.json`, `cleanup-verification.json` — all inside `phase55-bounds-correction-20261114/`.
