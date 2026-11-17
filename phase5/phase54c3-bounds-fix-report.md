# Phase 5.4C.3 — Targeted cinematic bounds fix

Date: 13 November 2026 (Asia/Calcutta). **Final decision: INCONCLUSIVE for overall phase/performance acceptance.** The narrowly scoped bounds optimization is implemented and verified, but an unexplained **4,051.2 ms ending-transition gap remains** in a successful fixed replay. Do not claim the historical 489 ms interruption fixed or stable 1080p/30 FPS established. Keep the code isolated/opt-in pending review; no environment integration or subsequent phase.

## Implementation and scope

Original Kashi remains the production default. Only ?kashiPrototype=revision, Mission 1, and the exact missionOneEnding config (kashi-contract-return) use the prepared ending bounds. Other missions/cinematics retain the original actor normalization path. Existing shader warm-up, audio, layout, combat, controls, progression and Bhairava presentation/animation functions are unchanged.

Affected existing source was backed up under source-before before editing. Final source changes:

- src/App.jsx: the opt-in scenery gate now includes ending-actor preparation before startMissionReady. The opening cannot advance behind preparation. Cancellation invalidates the request; readiness/error callbacks are scoped to the current request.
- src/game/cinematics/CinematicStage.jsx: only the opted-in ending clone receives prepared normalization and bounds. Other actors use the original Box3 path. Animation, appearance, costume, weapon, camera and shadow code is retained.
- New src/game/kashiRevision/endingBounds.js: private WeakMap metadata cache keyed by the existing useGLTF asset; exact normalization measurements, original sizing boxes and conservative animated culling spheres; small application traversal.
- New src/game/kashiRevision/EndingBoundsPreparation.jsx: uses the existing useGLTF loader/cache inside the loading gate. It suppresses callbacks after cancellation. Rejected preparation entries are removed; rejected GLTF loads are cleared for retry. Successful shared GLTFs are retained. Pending preparation may complete into cache after cancellation, but cannot launch a mission; a later start can reuse that record.

A successful record contains only numeric/bounds metadata, not a retained duplicate actor. Temporary clone appearance resources are restored/disposed after preparation. No new distributed model/texture asset, second asset loader, geometry reduction, resolution reduction, shader warm-up change or permanent hidden actor was introduced.

For clarity, two shared **source entry files** changed behind the approved opt-in guards; it would be inaccurate to claim every production-source byte is unchanged. The original environment/default execution path, its assets and existing production build outputs were not replaced. All other recorded source/configuration/assets and shader helpers match preflight. No deployment or default integration occurred.

## Animated culling safety and normalization

This is not a frozen bind-pose sphere. For every skinned mesh the helper bounds input vertex radius, all morph-position displacement radii for weights in [0,1], bind/inverse-bind transforms and the bone hierarchy. At each hierarchy edge, |T + RSv| <= |T| + max(abs(S))|v|. Any normalized quaternion rotation preserves length; linear/discrete position/scale extrema bound interpolation throughout the guard clip. The installed ending uses supported tracks. Unsupported non-bone translation/scale or cubic position/scale interpolation is rejected rather than silently approximated. Matrix norm bounds handle transform composition, with 1% numerical padding.

The Hips track processing in prepareCharacterClips was independently checked against the protected GLB: raw and processed translation maxima both equal 1.0192951422001288 (91 keys, first X/Z 0 and 0.0019954126328229904). Finger quaternion overrides and jaw rotation remain covered by the all-rotation envelope. This derivation is specific to the current ending asset/config; arbitrary future animations/assets must be revalidated.

The exact original bind sizing boxes are retained for normalization and costume's existing height query. **Frustum/shadow culling uses the separate animated-envelope spheres**, not those sizing boxes. Rigid costume and socket weapon meshes retain their existing individual geometry culling. No broad culling disable was applied.

Independent coverage result: **491 poses; 3,583,318 sampled vertex checks; zero sphere escapes**, including full facial extremes, animation key neighborhoods and 30 Hz times across the ending. The analytic envelope covers between those samples; the sampled checks independently validate the implementation. Maximum observed radius/envelope ratio was 0.26477, so the spheres are deliberately loose (roughly 7.06–7.11 model units). They may retain more offscreen/shadow work for this one actor. This tradeoff was measured rather than presented as free.

Exact normalization comparison error: **0**. Scale 0.9316687446796179; root foot offset approximately 1.26704e-9. Independent application check: **0.3 ms**. Coverage evidence: coverage/results.json. Cold first-check preparation took 3,847.7 ms; total observed loading gate 17,228 ms including environment/assets. Preparation is accounted as loading, not hidden inside gameplay FPS.

## Matched replay method and limitations

Original source copies supplied the baseline; fixed and baseline observer builds share the same assets, opt-in environment, quality, headless Chrome and ordinary-input completed-save replay driver. No health/reward/teleport shortcut was used in these mission replays. Frame journals begin after readiness and include traversal/combat, ending and post-mission capture. They are renderer-start timing, not GPU presentation timings. No CPU profiler or GL shader-call wrappers were active; endpoint-only skin-scan counters and cached-application timing were enabled equivalently.

Each valid replay independently records CSS canvas and WebGL drawing buffer **1920×1080, DPR 1, NVIDIA GTX 1650**. Active CPU/GPU clocks, OS scheduling and battery saver were not locked; native journals record AC/battery/RAM/commit at two-second intervals. Windows changed battery to AC during run4; mixed-power records are retained and excluded from the primary AC comparison. Extra runs were necessary to obtain three successful all-AC fixed replays, within the original twenty-minute replay bound. Functional follow-ups ran afterward, never concurrently with the benchmark series.

Primary AC baseline successes: runs5 and7. Primary fixed successes: **runs8,9,10**. Runs1–3 provide additional battery data. Runs4 and6 ended in player defeat before relic collection and are **failed tests**, not successful ending samples. No combat changes were made to force a pass. Outcome: eight successful and two failed full replay attempts, five successful fixed endings total, three of them all-AC. Save reload/repeat-reward invariants passed in all successful fixed endings.

## Verified optimization and remaining stalls

Successful baselines call **24 computeBoundingBox + 24 computeBoundingSphere** scans during the ending. All five successful fixed endings call **zero** of either skinned-vertex scan. The three primary fixed applications are **0.4, 0.3 and 0.1 ms**, meeting the <5 ms target. Repeated same-page presentation applications were 0.1 and 0.0 ms at available timing precision; this is not proof of literally zero CPU work.

AC baselines first ending render: **473.4 and 536.8 ms**. Fixed AC first ending renders: **12.8, 18.7 and 32.3 ms**. This is supported removal of the diagnosed scan cost, not attribution of every whole-frame difference.

First ending-boundary gaps were 722.9/2827.5 ms in the AC baselines versus **93.5/92.6/4051.2 ms** after the fix. The last result blocks any claim of fully repaired transition latency. Its cached bounds application was 0.1 ms and no skinned scans occurred. Other initialization, scheduling, paging, renderer/driver, audio or layout work remains unassigned here; no new stacks/wait-chain trace was captured. Previous audio/layout observations are hypotheses for this new gap, not its established cause. The known historical 489/362.4 ms pair, 533.6 ms ending and 5384.5 ms gameplay incidents are not silently marked fixed.

### Full replay distributions

These pooled measurements include cinematic and post-mission capture; they are not averages over clean combat only. Complete p01/p05/p25/p50/p75/p90/p95/p99/p99.9 distributions, first-frame details, every >100 ms gap, scan records and power/memory limits are in performance-results.json and original per-run files.

- Run1 before, PASS, AC=[0]: average 28.67 FPS; mean 34.89 ms; median 34.6 ms; p95 37.8 ms; p99 49.2 ms; worst 657.3 ms; >100 ms count 9.
- Run2 after, PASS, AC=[0]: average 29.63 FPS; mean 33.75 ms; median 34.5 ms; p95 37.2 ms; p99 45.6 ms; worst 366.0 ms; >100 ms count 5.
- Run3 after, PASS, AC=[0]: average 29.26 FPS; mean 34.18 ms; median 34.5 ms; p95 37.0 ms; p99 52.9 ms; worst 476.1 ms; >100 ms count 7.
- Run4 before, FAIL, AC=[0,1]: average 19.41 FPS; mean 51.52 ms; median 34.4 ms; p95 36.1 ms; p99 64.2 ms; worst 15629.3 ms; >100 ms count 7; Player defeated.
- Run5 before, PASS, AC=[1]: average 28.41 FPS; mean 35.20 ms; median 34.6 ms; p95 35.8 ms; p99 45.6 ms; worst 2079.8 ms; >100 ms count 8.
- Run6 after, FAIL, AC=[1]: average 24.74 FPS; mean 40.43 ms; median 34.5 ms; p95 38.6 ms; p99 115.3 ms; worst 2844.7 ms; >100 ms count 12; Player defeated.
- Run7 before, PASS, AC=[1]: average 25.03 FPS; mean 39.95 ms; median 34.6 ms; p95 35.8 ms; p99 68.5 ms; worst 8421.0 ms; >100 ms count 18.
- Run8 after, PASS, AC=[1]: average 28.36 FPS; mean 35.26 ms; median 34.6 ms; p95 35.6 ms; p99 82.0 ms; worst 654.4 ms; >100 ms count 17.
- Run9 after, PASS, AC=[1]: average 29.79 FPS; mean 33.57 ms; median 34.6 ms; p95 35.3 ms; p99 41.8 ms; worst 181.0 ms; >100 ms count 2.
- Run10 after, PASS, AC=[1]: average 26.82 FPS; mean 37.28 ms; median 34.6 ms; p95 35.5 ms; p99 57.5 ms; worst 4051.2 ms; >100 ms count 10.

The primary fixed replays still have p95 above the strict 33.3 ms frame budget, and worst gaps 654.4,181.0,4051.2 ms. All measurements are preserved, including the failed mixed-power baseline's 15,629.3 ms gap and AC baseline's 8,421.0 ms gap. Global low RAM is documented by the native journals but does not prove owned paging caused a specific event.

## Functional, recovery and presentation validation

- Cold preparation/opening check PASS. Loading occurs before startMissionReady; the opening is not intentionally skipped or advanced under the bounds gate.
- Three all-AC fixed ordinary-input replays PASS through boss/relic, natural ending, victory, reload and unchanged repeat rewards. No high-level game state was fabricated for these completion tests.
- Scene download failure/retry and delayed-load cancellation PASS in the saved loading checks. Post-gate replay keyboard movement was 2.908 m in the final combined attempt.
- Targeted actor GLTF503 recovery PASS: failed load leaves mission inactive, retry prepares bounds and enters the actual opening, which completes naturally. Initial observed opening time after gate release was 0.7161 s; this includes first scene/Playwright observation latency, not prep-time cinematic advancement.
- Cancellation during actual preparation PASS: no late mission start, subsequent start reuses the identical completed record and one actor request. Preparation completion after cancellation is intentional cache reuse, not an autonomous mission launch.
- Revised ending presentation PASS at timeline poses1,5,8: pause holds time, resume advances, skip returns correctly. Same-page repeated ending reused the identical cached record; progress fixture unchanged. Default presentation readiness retry PASS, with prepared=false, confirming the new path did not activate for the default environment.
- Presentation tests use explicitly labeled boss-state fixtures at the start area, **not genuine mission completion/reward tests**. Their origins/scene timing are not pixel-identical to boss-arena replays; numerical normalization and coverage tests establish alignment, while screenshots check visible costume, weapon, feet, camera and shadows at the sampled views. No pixel-identical image or complete long-session leak certification is claimed.
- Source animation/costume/weapon/camera/shadow logic, audio/layout and shader warm-up unchanged. Existing dark lighting/prototype scenery limitations remain outside scope. Missions2–10, Bujji chase and physical mobile performance were not freshly completed in this bounded fix; their unchanged source/hashes and earlier evidence are preserved, not relabeled as new tests.

Test-harness failures were retained: (1) stopped waiters left partial recovery output; exclusive EEXIST prevented overwrite, so a fresh output directory was used; (2) the combined recovery attempt timed out waiting for the animated LEVEL SELECTION button to become stable before the actor fault test; the targeted retry used native keyboard activation; (3) a default presentation assertion referenced __52gl before canvas creation; a default-only readiness retry corrected the test. These were not production fixes, nor were failed attempts erased. The final targeted recovery and readiness files identify exactly which missing checks passed.

### Screenshots

Actual normal completion replay, fixed AC run10 (not a promotional render):

![Actual fixed ending/relic capture](phase54c3-bounds-20261113/matched-10-after/mission-1-keyboard-relic-collected.png)

Controlled presentation fixture at pose5, revised:

![Revised ending presentation fixture](phase54c3-bounds-20261113/presentation/revision-ending-5.png)

Default presentation fixture, unprepared path:

![Default presentation fixture](phase54c3-bounds-20261113/presentation-default-ready/default-ending-5.png)

## Build, integrity and rollback

Production build PASS; lint exit0 with the same four pre-existing MenuScene immutability warnings. Production output was written to this phase's new production-build folder. Observer/validation exports exist only in dedicated diagnostic builds, not production source. No shader warm-up change. Final changes-and-hashes record: **47/47 protected checks match**, zero unexpected recorded changes. Exactly App.jsx and CinematicStage.jsx changed among previously recorded files; the two new helper files are hashed separately. Original environment/world/asset files, all protected Bhairava/Groom/rollback files, controls/combat/campaign/save code and earlier reports match preflight. No actual player profile/save was opened; tests used ephemeral browser contexts and copied fixtures.

Owned preview ports5491,5493,5494,5495,5496,5497 were verified closed and native loggers exited. Approximately 40.03 GiB C: free remained at closure. Failed/intermediate builds and logs, all measurements and backups are retained; no cleanup deletion was performed.

Rollback: stop owned servers, restore only src/App.jsx and src/game/cinematics/CinematicStage.jsx from this phase's source-before copies, then build/lint and recheck hashes. New helper modules may remain dormant; deletion is unnecessary. Do not touch saves/assets/shader helpers or restore unrelated old files. Using the default URL continues to select the original environment; the opt-in revision was never integrated.

## Decision

**INCONCLUSIVE for full Phase5.4C.3/performance acceptance.** Bounds preparation/application, animated-envelope checks and three matched AC replay endpoints are verified, but a severe 4051.2 ms ending-boundary gap persists. Retain the isolated fix for review; do not call the historical interruption solved or expand the scope into audio/layout/driver changes. No further phase or production integration begins without approval.

## Appendix — every recorded render-start gap above100 ms

UTC starts below; end timestamp and render-before/after durations are in performance-results.json. Loading preparation timings are separate from these post-readiness replay gaps.

### Run1 before (PASS)

- 2026-11-13T10:01:16.446Z: 209.1 ms — OTHER_POST_READINESS.
- 2026-11-13T10:01:16.655Z: 235.2 ms — OTHER_POST_READINESS.
- 2026-11-13T10:01:16.891Z: 231.5 ms — OTHER_POST_READINESS.
- 2026-11-13T10:01:17.122Z: 230.9 ms — OTHER_POST_READINESS.
- 2026-11-13T10:01:17.353Z: 113.7 ms — OTHER_POST_READINESS.
- 2026-11-13T10:01:19.677Z: 657.3 ms — ENDING_BOUNDARY.
- 2026-11-13T10:01:20.334Z: 629.3 ms — ENDING.
- 2026-11-13T10:01:21.307Z: 189.2 ms — ENDING.
- 2026-11-13T10:01:32.130Z: 188.3 ms — OTHER_POST_READINESS.
### Run2 after (PASS)

- 2026-11-13T10:02:23.214Z: 139.7 ms — OTHER_POST_READINESS.
- 2026-11-13T10:02:23.354Z: 126.3 ms — OTHER_POST_READINESS.
- 2026-11-13T10:03:12.507Z: 165.1 ms — ENDING_BOUNDARY.
- 2026-11-13T10:03:13.873Z: 134.2 ms — ENDING.
- 2026-11-13T10:03:23.971Z: 366.0 ms — OTHER_POST_READINESS.
### Run3 after (PASS)

- 2026-11-13T10:04:10.681Z: 106.7 ms — OTHER_POST_READINESS.
- 2026-11-13T10:04:18.079Z: 101.1 ms — OTHER_POST_READINESS.
- 2026-11-13T10:04:59.281Z: 192.8 ms — ENDING_BOUNDARY.
- 2026-11-13T10:05:00.678Z: 152.6 ms — ENDING.
- 2026-11-13T10:05:04.712Z: 476.1 ms — ENDING.
- 2026-11-13T10:05:06.384Z: 102.7 ms — ENDING.
- 2026-11-13T10:05:11.161Z: 453.0 ms — OTHER_POST_READINESS.
### Run4 before (FAIL)

- 2026-11-13T10:05:51.493Z: 160.9 ms — OTHER_POST_READINESS.
- 2026-11-13T10:05:51.777Z: 103.6 ms — OTHER_POST_READINESS.
- 2026-11-13T10:05:51.881Z: 206.4 ms — OTHER_POST_READINESS.
- 2026-11-13T10:05:52.087Z: 1341.5 ms — OTHER_POST_READINESS.
- 2026-11-13T10:05:53.461Z: 15629.3 ms — OTHER_POST_READINESS.
- 2026-11-13T10:06:09.091Z: 2039.9 ms — OTHER_POST_READINESS.
- 2026-11-13T10:06:44.910Z: 128.4 ms — OTHER_POST_READINESS.
### Run5 before (PASS)

- 2026-11-13T10:07:13.820Z: 136.7 ms — OTHER_POST_READINESS.
- 2026-11-13T10:07:48.851Z: 257.7 ms — OTHER_POST_READINESS.
- 2026-11-13T10:07:51.716Z: 195.0 ms — OTHER_POST_READINESS.
- 2026-11-13T10:08:12.320Z: 722.9 ms — ENDING_BOUNDARY.
- 2026-11-13T10:08:13.043Z: 477.7 ms — ENDING.
- 2026-11-13T10:08:14.616Z: 2079.8 ms — ENDING.
- 2026-11-13T10:08:17.859Z: 117.7 ms — ENDING.
- 2026-11-13T10:08:26.649Z: 227.7 ms — OTHER_POST_READINESS.
### Run6 after (FAIL)

- 2026-11-13T10:09:12.876Z: 138.6 ms — OTHER_POST_READINESS.
- 2026-11-13T10:09:13.015Z: 1047.0 ms — OTHER_POST_READINESS.
- 2026-11-13T10:09:14.062Z: 393.8 ms — OTHER_POST_READINESS.
- 2026-11-13T10:09:15.547Z: 2387.8 ms — OTHER_POST_READINESS.
- 2026-11-13T10:09:18.746Z: 118.0 ms — OTHER_POST_READINESS.
- 2026-11-13T10:09:19.347Z: 116.9 ms — OTHER_POST_READINESS.
- 2026-11-13T10:09:20.017Z: 109.5 ms — OTHER_POST_READINESS.
- 2026-11-13T10:09:23.048Z: 119.0 ms — OTHER_POST_READINESS.
- 2026-11-13T10:09:29.698Z: 156.9 ms — OTHER_POST_READINESS.
- 2026-11-13T10:09:29.855Z: 2844.7 ms — OTHER_POST_READINESS.
- 2026-11-13T10:09:32.934Z: 115.3 ms — OTHER_POST_READINESS.
- 2026-11-13T10:09:39.697Z: 198.9 ms — OTHER_POST_READINESS.
### Run7 before (PASS)

- 2026-11-13T10:11:28.080Z: 166.9 ms — OTHER_POST_READINESS.
- 2026-11-13T10:11:28.483Z: 126.1 ms — OTHER_POST_READINESS.
- 2026-11-13T10:11:28.947Z: 191.4 ms — OTHER_POST_READINESS.
- 2026-11-13T10:11:29.280Z: 152.3 ms — OTHER_POST_READINESS.
- 2026-11-13T10:11:29.432Z: 807.6 ms — OTHER_POST_READINESS.
- 2026-11-13T10:11:30.248Z: 134.6 ms — OTHER_POST_READINESS.
- 2026-11-13T10:11:30.746Z: 101.7 ms — OTHER_POST_READINESS.
- 2026-11-13T10:11:31.444Z: 101.6 ms — OTHER_POST_READINESS.
- 2026-11-13T10:11:32.715Z: 8421.0 ms — OTHER_POST_READINESS.
- 2026-11-13T10:11:41.218Z: 103.1 ms — OTHER_POST_READINESS.
- 2026-11-13T10:12:24.849Z: 105.0 ms — OTHER_POST_READINESS.
- 2026-11-13T10:12:24.954Z: 149.0 ms — OTHER_POST_READINESS.
- 2026-11-13T10:12:39.015Z: 2827.5 ms — ENDING_BOUNDARY.
- 2026-11-13T10:12:41.842Z: 928.3 ms — ENDING.
- 2026-11-13T10:12:43.781Z: 151.4 ms — ENDING.
- 2026-11-13T10:12:53.014Z: 218.9 ms — ENDING.
- 2026-11-13T10:12:53.916Z: 176.1 ms — ENDING.
- 2026-11-13T10:12:54.092Z: 207.8 ms — OTHER_POST_READINESS.
### Run8 after (PASS)

- 2026-11-13T10:13:31.366Z: 121.8 ms — OTHER_POST_READINESS.
- 2026-11-13T10:13:31.559Z: 199.1 ms — OTHER_POST_READINESS.
- 2026-11-13T10:13:31.758Z: 107.3 ms — OTHER_POST_READINESS.
- 2026-11-13T10:13:32.022Z: 219.6 ms — OTHER_POST_READINESS.
- 2026-11-13T10:14:27.259Z: 199.2 ms — OTHER_POST_READINESS.
- 2026-11-13T10:14:27.495Z: 182.3 ms — OTHER_POST_READINESS.
- 2026-11-13T10:14:31.768Z: 195.7 ms — ENDING.
- 2026-11-13T10:14:32.554Z: 187.0 ms — ENDING.
- 2026-11-13T10:14:33.890Z: 251.4 ms — ENDING.
- 2026-11-13T10:14:34.827Z: 116.9 ms — ENDING.
- 2026-11-13T10:14:36.790Z: 437.7 ms — ENDING.
- 2026-11-13T10:14:37.228Z: 353.8 ms — ENDING.
- 2026-11-13T10:14:37.582Z: 390.0 ms — ENDING.
- 2026-11-13T10:14:37.972Z: 654.4 ms — ENDING.
- 2026-11-13T10:14:38.626Z: 191.2 ms — ENDING.
- 2026-11-13T10:14:38.817Z: 433.2 ms — ENDING.
- 2026-11-13T10:14:44.677Z: 151.3 ms — OTHER_POST_READINESS.
### Run9 after (PASS)

- 2026-11-13T10:15:29.149Z: 103.5 ms — OTHER_POST_READINESS.
- 2026-11-13T10:16:00.582Z: 181.0 ms — OTHER_POST_READINESS.
### Run10 after (PASS)

- 2026-11-13T10:16:33.603Z: 112.7 ms — OTHER_POST_READINESS.
- 2026-11-13T10:17:05.543Z: 118.9 ms — OTHER_POST_READINESS.
- 2026-11-13T10:17:07.409Z: 656.2 ms — OTHER_POST_READINESS.
- 2026-11-13T10:17:09.504Z: 175.5 ms — OTHER_POST_READINESS.
- 2026-11-13T10:17:09.679Z: 274.7 ms — OTHER_POST_READINESS.
- 2026-11-13T10:17:09.954Z: 538.8 ms — OTHER_POST_READINESS.
- 2026-11-13T10:17:10.493Z: 4051.2 ms — ENDING_BOUNDARY.
- 2026-11-13T10:17:14.578Z: 104.1 ms — ENDING.
- 2026-11-13T10:17:25.737Z: 187.5 ms — ENDING.
- 2026-11-13T10:17:25.924Z: 187.3 ms — OTHER_POST_READINESS.

**Final decision: INCONCLUSIVE. Stop for approval.**
