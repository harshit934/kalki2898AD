# Phase 5.5 performance investigation — investigation only

14 November 2026 (Asia/Calcutta). **No production optimization implemented. Approval required before changes.**

## Conclusion

Two expensive operations are established on the default Mission1 ending path: full skinned bounding-box scans during actor normalization and separate bounding-sphere scans during first render. Both recur for a new ending actor clone, including replay. These support one narrow reversible loading-time preparation/cache correction.

The other events must remain separate. Mission20 frame interruptions recur, but its historical442.1ms renderer invocation does not recur in these three trials. Clean desktop/portrait repeats also hitch, including new1104.8ms and1630.9ms gaps, predominantly outside the recorded render invocation at those boundaries. Browser trace evidence separates some wall delay from active thread CPU, but does not identify the OS/driver/browser dependency. No common root cause or global stabilization is claimed.

## Scope, budget and protections

The recorded baseline was taken11:52 UTC (17:22 India time). Captures ended about12:10 UTC; analysis/integrity/reporting finished afterward, within the60-minute hard limit. No investigation extension or further capture is requested automatically.

Captured three paired ending-operation trials with two playbacks per condition (12 isolated triggers total), two natural replay attempts, three actual Mission20 fights and two60-second repeats each of desktop idle and portrait guard-area scenarios. Only one streamed browser trace was taken, bounded to45seconds and64MiB output; actual output was19,834,681 bytes. No circular trace/recovery helper or old evidence path was reused.

No campaign expansion, Phase7/10 work, roadmap change, combat contract change, Kashi integration, driver/registry/BIOS adjustment or personal-save write occurred. Production source was not edited. A Vite diagnostic build transform exported read-only state and instrumented operations only in an isolated output directory. Assets and prior reports remain intact.

## Method and measurement boundaries

- Hardware/settings: existing GTX1650 4GB/Ryzen55600H system, balanced graphics; actual1920×1080 desktop buffer. Portrait is laptop Chrome emulation, CSS430×932/DPR2, buffer860×1864—not a physical phone. NVIDIA identities/endpoints remain in raw results.
- Ending pairs alternate order in the middle trial. Minimal condition records main-scene render intervals with no bounds/native-method wrappers. Detailed condition additionally times existing Box3/skinned-bound calls and selected GL entry points, without changing their arguments/results.
- Each isolated ending is started through the existing cinematic API after loading, at the spawn origin. These are operation/lifetime tests, **not natural mission completions or a matched arena/background rendering benchmark**. Two playbacks in the same context test replay behavior; new contexts test newly loaded scenes. Browser/driver caches were not deleted; “first playback” is not a guaranteed cold GPU-driver cache.
- Natural replay attempts use ordinary input and no screenshots. They also retain the prior harness's shared RAF/DOM observer; their labels minimal/detailed mean bounds/native wrappers off/on, not zero instrumentation. They are not substitutes for the lower-observer controls.
- Mission20 trials use the same boss/arena/settings and ordinary controls. First/third are minimal; middle adds method instrumentation and a browser trace, started before arena approach to exclude setup from fight timing. No CPU-profiler startup hole is counted as a clean gameplay reproduction.
- Clean windows use no bound/native wrappers, CPU profiler, browser trace, GPU elapsed query or timed screenshot. The renderer journal/native1Hz power-memory sampler remain. GPU endpoint queries occur outside measurement; background user apps were not closed. Scripted guard-area sampling is not sustained mobile boss combat; Bujji can defeat the nearby guard.
- Reported render duration is JavaScript-call **wall time**, not exclusive CPU time or GPU execution time. FPS is render-start cadence, not presentation FPS. Source vertex-loop evidence establishes synchronous work; it does not subtract OS descheduling from each measured millisecond.

## 1. Default-ending normalization: exact path and recurrence

Original observation:493.9ms normalization region inside the585.7ms frame interval ending11:22:57.799 UTC in the prior validation. That region included Box3 work plus alignment/traversal. The new instrumentation isolates Box3 and its nested mesh scans directly.

Affected path: [cinematics/CinematicStage.jsx](<C:/Users/Hp/Downloads/kalki 2898AD/src/game/cinematics/CinematicStage.jsx>) (`CinematicActor`, around lines65–80) → `clone(asset.scene)` → default `new Box3().setFromObject(object)` → `Box3.expandByObject` → `SkinnedMesh.computeBoundingBox` → per-vertex `getVertexPosition`/bone transform. Default preparation is excluded by [kashiRevision/endingBounds.js](<C:/Users/Hp/Downloads/kalki 2898AD/src/game/kashiRevision/endingBounds.js>) predicates.

**Confirmed/high confidence:** every detailed ending mount executes24 skinned bounding-box computations. Across those meshes, each routine visits1,866,377 vertex positions (visits, not a claim of unique rendered vertices). The geometry/rig are already available; this is synchronous JavaScript skinning/bounds work, not evidence of an asset download delay.

The scans occur once per new actor clone in these captures, not every frame. Each replay creates a new clone and repeats all24 scans. Six detailed observations across three contexts reproduce them6/6; six minimal controls also hitch6/6, so the interruption does not require the detailed wrappers.

## 2. Following first-render cost: separate operation

The historical522.0ms render starts at11:22:57.799 UTC, **after** the585.7ms interval; it is followed by a524.2ms interval ending11:22:58.323 UTC. It must not be used to explain the already elapsed585.7ms.

New detailed captures show24 separate `SkinnedMesh.computeBoundingSphere` calls on first rendering of each ending clone. Runtime stacks include `Frustum.intersectsObject`/`intersectsFrustum` and renderer traversal. Local Three.js source confirms the null-sphere check in `node_modules/three/src/math/Frustum.js:150`, with the skinning loop in `node_modules/three/src/objects/SkinnedMesh.js`. The loop again visits1,866,377 positions. This adds a separate full scan, about3.73million vertex visits across the two routines per clone.

**Confirmed/high confidence for the current path:** first-render sphere construction is a major synchronous part of the new matched default-render cost and recurs6/6 detailed playbacks. **Historical-sample qualification:** the old522ms call was not instrumented at this granularity; the new evidence strongly identifies the corresponding path, not every millisecond or possible additional work in that old invocation. This finding does not attribute Mission20 to skinned bounds.

### All paired ending observations

Each entry gives maximum frame interval for the isolated playback. Detailed entries additionally show Box3 normalization and the sum of sphere-call wall durations. Nested Box3/box timings must not be added together as independent work.

- Pair1, minimal, playback1: max **790.0ms**, p9536.1/p99186.4ms.

- Pair1, minimal, playback2: max **535.6ms**, p9535.5/p9985.0ms.

- Pair1, detailed, playback1: max **564.3ms**, p9535.1/p9953.4ms; Box3 486.4ms; bounding boxes 24 calls; spheres 24 calls / 489.6ms.

- Pair1, detailed, playback2: max **361.5ms**, p9535.0/p9936.7ms; Box3 287.5ms; bounding boxes 24 calls; spheres 24 calls / 292.5ms.

- Pair2, detailed, playback1: max **743.0ms**, p9536.0/p9953.5ms; Box3 581.7ms; bounding boxes 24 calls; spheres 24 calls / 622.5ms.

- Pair2, detailed, playback2: max **554.1ms**, p9535.0/p9944.9ms; Box3 481.7ms; bounding boxes 24 calls; spheres 24 calls / 466.4ms.

- Pair2, minimal, playback1: max **661.9ms**, p9535.4/p9951.8ms.

- Pair2, minimal, playback2: max **612.8ms**, p9536.2/p9976.5ms.

- Pair3, minimal, playback1: max **629.2ms**, p9537.8/p99176.1ms.

- Pair3, minimal, playback2: max **392.9ms**, p9535.1/p99145.7ms.

- Pair3, detailed, playback1: max **1712.8ms**, p9535.2/p99331.9ms; Box3 506.5ms; bounding boxes 24 calls; spheres 24 calls / 466.6ms.

- Pair3, detailed, playback2: max **476.4ms**, p9535.0/p9941.4ms; Box3 419.4ms; bounding boxes 24 calls; spheres 24 calls / 454.4ms.

**Instrumentation effect:** minimal maxima392.9–790.0ms; detailed361.5–1712.8ms. Minimal controls reproduce the class of hitch without the method wrappers. The small unseeded, non-thermal-controlled sample does not establish zero instrumentation overhead, an overhead percentage or a performance improvement. The detailed1712.8ms outlier is preserved and not wholly attributed to the two bounded operations. No slow selected GL call explains that whole outlier.

## 3. Natural-ending attempts

- natural-minimal: **PASS**, relicPASS, final health66.79999999999998; save/replay-reward assertions True/True; avg28.17FPS, median34.6/p9535.4/p99102.3/max814.2ms.

- natural-detailed: **FAIL**, relicUNVERIFIED, final health0; save/replay-reward assertions True/True; avg27.86FPS, median34.6/p9535.7/p9952.3/max3101.9ms.

The minimal-wrapper natural replay reached the actual ending without skip. The detailed-wrapper attempt ended with player health0 and boss health152 before relic/ending; no browser error was recorded. It is a failed gameplay attempt, **not an ending failure or a valid ending-timing comparison**. No health injection, teleport, forced reload or replacement passing run was used. It does not prove instrumentation caused defeat: input/battle/drop variance was not fully controlled. Thus a matched natural-ending latency comparison remains incomplete, while isolated operation recurrence is well established.

## 4. Mission20: historical render versus new frame interruptions

Historical evidence confirms a442.1ms renderer call at10:56:49.086 UTC inside the following455.6ms interval ending10:56:49.542 UTC. That places substantial work/wait inside that call, but no old per-operation trace identifies its dependency. Exact historical magnitudes and responsible operation cannot be reconstructed from duration alone.

Three fresh actual fights all complete3 phases/both attacks, defeat/relic, rewards/reload. Each has>100ms frame intervals, but **0/3 reproduce a renderer invocation≥400ms**. The recurring gap class is reproduced3/3; the exact old renderer event is not reproduced.

- Trial1 (minimal): PASS; avg29.04FPS, median34.6/p9535.1/p9955.2/max **384.8ms**; maximum render call **105.7ms**; 7 gaps>100ms. Browser metric interval29.18s; script4.60s, thread CPU5.94s; JS heap32.7→31.0MB.

- Trial2 (detailed/trace): PASS; avg29.26FPS, median34.6/p9535.2/p9957.5/max **312.2ms**; maximum render call **57.6ms**; 4 gaps>100ms. Browser metric interval28.88s; script5.19s, thread CPU6.83s; JS heap37.9→49.1MB.

- Trial3 (minimal): PASS; avg29.71FPS, median34.6/p9535.0/p9935.6/max **299.7ms**; maximum render call **8.2ms**; 1 gaps>100ms. Browser metric interval28.25s; script3.75s, thread CPU5.21s; JS heap34.8→31.3MB.

New maxima are not simply repeated slow render calls. For example, trial3's299.7ms gap has preceding/current render calls about2.4/2.9ms. Trial1's384.8ms gap precedes its105.7ms call; that105.7ms call helps explain the **next109.3ms interval**, not the earlier384.8ms. Correct event ordering matters.

### Browser trace, CPU and waits

The one streamed trace contains96,427 events,19.83MB, max reported buffer usage3.49%, and `dataLossOccurred:false`. It covers the middle trial with no circular overwrite. Correlation uses each page's timeOrigin and CDP NavigationStart monotonic clock; the derivation/offset and overlap data are retained in `analysis.json`. This is browser-event correlation, not Windows-kernel wait-chain attribution.

- Around the195.1ms interval, a RAF callback takes157.495ms wall time but10.024ms thread CPU; an inner callback154.882ms wall/7.440ms CPU. That demonstrates most elapsed time is **not active thread CPU execution** in that event. It permits a blocked/descheduled/waiting category, not selection of OS, driver or browser synchronization as the exact cause.
- For the312.2ms gap, only about3.6ms of overlapping recorded callback work appears; the corresponding callback is4.386ms wall/4.205ms CPU. The trace does not reveal the dependency delaying the next callback.
- One `getProgramInfoLog` call lasts9.2ms later in the detailed trial. It does not explain the whole195.1ms or312.2ms preceding interval and does not reproduce the historical442.1ms call. No>100ms selected native GL call was logged in this trial.
- Whole-window script/thread metrics do not substitute for per-stall attribution. GC or compilation events near an interval are not causal merely by proximity. No matched expensive AI/physics/GC routine has been established as the cause.

**Confidence:** high that many new delays lie mostly outside the recorded render call / active callback CPU; **unresolved** exact blocked operation, dependency and subsystem. No kernel scheduling, hard-fault or GPU-queue evidence was captured, so driver waits, Windows scheduling and paging cannot be separated conclusively here. No speculative change is justified for these intervals.

## 5. Clean-window desktop and portrait repeats

The same default environment/settings/scenario classes as the earlier167.6ms desktop and243.0ms portrait measurements were repeated twice. All windows are60seconds, without screenshots/traces/profilers/native-call wrappers inside them. Original historical event timestamps are not replayable; recurrence means the>100ms interruption class, not identical millisecond values.

- **desktop1080-r1 / exploration**: avg **29.83FPS**; median **34.6**, p95 **35.7**, p99 **42.8**, max **202.6ms**; 2 gaps>100ms; buffer[1920, 1080], CSS[1920, 1080], DPR1; loading4.08s. GPU endpoints `7, 253, 59`→`37, 452, 63` (utilization%, used VRAM MiB, °C).

- **portrait-r1 / near-street-guard**: avg **140.18FPS**; median **7.0**, p95 **8.2**, p99 **10.0**, max **221.7ms**; 2 gaps>100ms; buffer[860, 1864], CSS[430, 932], DPR2; loading3.08s. GPU endpoints `55, 418, 71`→`35, 418, 75` (utilization%, used VRAM MiB, °C).

- **desktop1080-r2 / exploration**: avg **27.73FPS**; median **34.5**, p95 **35.7**, p99 **88.6**, max **1104.8ms**; 16 gaps>100ms; buffer[1920, 1080], CSS[1920, 1080], DPR1; loading8.70s. GPU endpoints `3, 431, 64`→`38, 455, 62` (utilization%, used VRAM MiB, °C).

- **portrait-r2 / near-street-guard**: avg **122.17FPS**; median **7.2**, p95 **10.4**, p99 **13.3**, max **1630.9ms**; 5 gaps>100ms; buffer[860, 1864], CSS[430, 932], DPR2; loading2.48s. GPU endpoints `47, 435, 70`→`39, 419, 76` (utilization%, used VRAM MiB, °C).

**Reproduction:** desktop>100ms in2/2 windows; portrait>100ms in2/2. Both second repeats exceed1second. At desktop1104.8ms / portrait1630.9ms boundaries, current render calls are3.7/6.4ms, respectively; no exact responsible operation is established. **Stable30 FPS is not supported.**

Native clean-window telemetry: 319 samples, AC states[1] (1=online), available physical RAM90.2–1254.3MiB, load83–98%. GPU endpoints are snapshots, not continuous queue occupancy or GPU execution timings. Native samples are about1Hz, not hard-fault records.

For the two>1second maxima, nearest RAM readings are approximately90% load/744.5MiB available within about0.4s; the worst98% memory sample is not the value at every largest stall. This is pressure/coincidence evidence, **not proof that paging caused either gap**. Commit-limit/headroom and raw samples are preserved. Background processes and thermals were not controlled. Nothing was closed or changed to make the numbers look better.

## 6. Findings and proposed corrections, separated by confidence

**Confirmed source-level target:** default ending clone normalization and first-render skinned sphere construction. Proposed correction, requiring approval: prepare normalization plus conservative animated culling bounds once in an existing default-Mission1 loading lifecycle, reusing the loaded asset/cache and applying both to each ending clone. The existing opt-in helper demonstrates the approach; previous opt-in normalization0.8ms is historical operation evidence, not a new matched speedup experiment. No correction or prepared-vs-unprepared intervention was applied in this investigation.

Affected production entry points: [cinematics/CinematicStage.jsx](<C:/Users/Hp/Downloads/kalki 2898AD/src/game/cinematics/CinematicStage.jsx>), [kashiRevision/endingBounds.js](<C:/Users/Hp/Downloads/kalki 2898AD/src/game/kashiRevision/endingBounds.js>), [kashiRevision/EndingBoundsPreparation.jsx](<C:/Users/Hp/Downloads/kalki 2898AD/src/game/kashiRevision/EndingBoundsPreparation.jsx>) and [App.jsx](<C:/Users/Hp/Downloads/kalki 2898AD/src/App.jsx>). Local library call path: `node_modules/three/src/math/Box3.js`, `objects/SkinnedMesh.js`, `math/Frustum.js`, `renderers/WebGLRenderer.js`. Do not patch the Three.js library globally.

**Minimality/lifecycle requirement:** simply enabling the predicate is unsafe if the default route has not prepared its cache. Couple readiness, cancellation/retry and failure handling correctly. Restrict it to this ending, preserve actor height/ground alignment/animation/costume/weapon/camera/shadows and the shader warm-up, and keep Kashi opt-in. Reuse conservative full-animation bounds; do not freeze bind-pose culling, disable all culling or replace assets to avoid the scan.

**Risks:** loading becomes longer; stale asset/cache mismatch; canceled requests entering gameplay; overly tight animated bounds clipping body/weapon/costume; overly loose bounds increasing rendering. Preserve a timestamped active-source rollback before an approved patch, plus all14 independent campaign files. Do not restore an old entire tree or personal save. No protected file change is needed or approved.

**Unresolved event classes:** Mission20 non-render gaps, exact historical442.1ms render dependency, clean-window desktop/portrait stalls and outlier time not covered by measured bounds. No software optimization is proposed for them without attribution. The present capture budget is closed. A later OS/GPU wait-chain capture would require a separately approved bounded plan; it is not started automatically.

## 7. Acceptance criteria for any approved bounds correction

1. At least3 matched natural default1080p endings and3 repeated/replay endings, plus720p sanity. This investigation's failed detailed natural attempt must remain recorded; do not substitute API-trigger trials as natural passes.
2. Demonstrate zero repeated full skinned bounding-box/sphere scans during ending mount/first render once preparation is ready. Bounds application/normalization target below5ms; measure actor clone and subsequent renderer calls separately. Preserve every>100ms event.
3. Confirm full animation/costume/weapon/feet/camera/shadow visibility and exact original height/ground alignment, not just one bind pose. Pause/resume/skip, cold load, cancellation/retry, scene exit and repeated playback must preserve readiness/cache lifecycle.
4. Retain real relic→ending→victory flow and exact-once rewards/reload, keyboard/touch controls, ten bosses and existing gameplay. Use disposable profiles, never personal saves.
5. Record loading delay separately; do not claim elimination of the CPU work merely because it moves into a loading gate. Cache reuse should prevent recurring work on each replay.
6. Actual1080p buffers, same quality and recorded power/hardware, with minimal observers and a separate detailed attribution run. No profiling setup or screenshot interval disguised as gameplay, no resolution/visual reduction.
7. Build/lint and protected/source-diff checks after any future implementation. A fast bounds result does not establish stable gameplay while the separate clean-window1.1–1.6second gaps remain unexplained. Any limitation needs explicit acceptance.

## 8. Integrity, cleanup and decision

**47/47 protected hashes match. All146 production source files are unchanged. All14 preserved campaign copies match. Personal database content hashes remain unchanged and the personal profile was never launched.** No production assets or campaign/save formats were changed. Only diagnostic scripts/builds, raw data, analysis and this report were created under Phase5 evidence paths. Previous reports and rollback assets were not overwritten.

Read-only Windows cleanup checks succeeded: zero remaining project-tagged diagnostic processes and zero listeners on owned test ports5558/5560/5561/5570. Browsers/servers/sampler closed; no unrelated process was terminated. No Phase6 or campaign work began.

**Decision: investigation complete; Phase5.5 acceptance remains REJECT.** Recommend approval only for the proven default-ending preparation/cache correction, followed by its targeted regression. Do not claim that it solves the other stalls. Stop here and await approval.

## Evidence index and all>100ms events

- [initial-integrity.json](<C:/Users/Hp/Downloads/kalki 2898AD/phase5/phase55-performance-investigation-20261114/initial-integrity.json>)

- [final-integrity.json](<C:/Users/Hp/Downloads/kalki 2898AD/phase5/phase55-performance-investigation-20261114/final-integrity.json>)

- [analysis.json](<C:/Users/Hp/Downloads/kalki 2898AD/phase5/phase55-performance-investigation-20261114/analysis.json>)

- [ending-operations.json](<C:/Users/Hp/Downloads/kalki 2898AD/phase5/phase55-performance-investigation-20261114/ending-operations.json>)

- [natural-minimal/mission-natural-diagnostic-results.json](<C:/Users/Hp/Downloads/kalki 2898AD/phase5/phase55-performance-investigation-20261114/natural-minimal/mission-natural-diagnostic-results.json>)

- [natural-detailed/mission-natural-diagnostic-results.json](<C:/Users/Hp/Downloads/kalki 2898AD/phase5/phase55-performance-investigation-20261114/natural-detailed/mission-natural-diagnostic-results.json>)

- [boss20/results.json](<C:/Users/Hp/Downloads/kalki 2898AD/phase5/phase55-performance-investigation-20261114/boss20/results.json>)

- [boss20/trace-2.json](<C:/Users/Hp/Downloads/kalki 2898AD/phase5/phase55-performance-investigation-20261114/boss20/trace-2.json>)

- [clean-windows/results.json](<C:/Users/Hp/Downloads/kalki 2898AD/phase5/phase55-performance-investigation-20261114/clean-windows/results.json>)

- [clean-windows/power-memory.ndjson](<C:/Users/Hp/Downloads/kalki 2898AD/phase5/phase55-performance-investigation-20261114/clean-windows/power-memory.ndjson>)

- [execution.json](<C:/Users/Hp/Downloads/kalki 2898AD/phase5/phase55-performance-investigation-20261114/execution.json>)

- [cleanup-verification.json](<C:/Users/Hp/Downloads/kalki 2898AD/phase5/phase55-performance-investigation-20261114/cleanup-verification.json>)

- [build-diagnostic.mjs](<C:/Users/Hp/Downloads/kalki 2898AD/phase5/phase55-performance-investigation-20261114/build-diagnostic.mjs>)

- [diagnostics.js](<C:/Users/Hp/Downloads/kalki 2898AD/phase5/phase55-performance-investigation-20261114/diagnostics.js>)

The following97 intervals retain their scenario/instrumentation labels. They must not be pooled into a single production distribution. All timestamps below are UTC.

- 2026-11-14T11:55:32.257Z | ending-operation-1-minimal-1 | gap **585.3ms** | current render 428.8ms.

- 2026-11-14T11:55:33.047Z | ending-operation-1-minimal-1 | gap **790.0ms** | current render 6.0ms.

- 2026-11-14T11:55:33.343Z | ending-operation-1-minimal-1 | gap **296.0ms** | current render 4.5ms.

- 2026-11-14T11:55:33.641Z | ending-operation-1-minimal-1 | gap **104.7ms** | current render 4.6ms.

- 2026-11-14T11:55:44.524Z | ending-operation-1-minimal-1 | gap **186.4ms** | current render 6.8ms.

- 2026-11-14T11:55:45.637Z | ending-operation-1-minimal-2 | gap **535.6ms** | current render 452.8ms.

- 2026-11-14T11:55:46.094Z | ending-operation-1-minimal-2 | gap **456.4ms** | current render 7.7ms.

- 2026-11-14T11:55:47.281Z | ending-operation-1-minimal-2 | gap **112.7ms** | current render 3.4ms.

- 2026-11-14T11:56:13.458Z | ending-operation-1-detailed-1 | gap **564.3ms** | current render 515.1ms.

- 2026-11-14T11:56:13.983Z | ending-operation-1-detailed-1 | gap **525.1ms** | current render 9.9ms.

- 2026-11-14T11:56:26.227Z | ending-operation-1-detailed-2 | gap **361.5ms** | current render 304.0ms.

- 2026-11-14T11:56:26.534Z | ending-operation-1-detailed-2 | gap **306.2ms** | current render 5.2ms.

- 2026-11-14T11:56:50.980Z | ending-operation-2-detailed-1 | gap **706.8ms** | current render 656.6ms.

- 2026-11-14T11:56:51.723Z | ending-operation-2-detailed-1 | gap **743.0ms** | current render 15.4ms.

- 2026-11-14T11:56:52.917Z | ending-operation-2-detailed-1 | gap **141.9ms** | current render 10.2ms.

- 2026-11-14T11:57:03.862Z | ending-operation-2-detailed-2 | gap **554.1ms** | current render 487.0ms.

- 2026-11-14T11:57:04.353Z | ending-operation-2-detailed-2 | gap **491.0ms** | current render 12.2ms.

- 2026-11-14T11:57:36.484Z | ending-operation-2-minimal-1 | gap **661.9ms** | current render 490.3ms.

- 2026-11-14T11:57:36.984Z | ending-operation-2-minimal-1 | gap **500.1ms** | current render 7.2ms.

- 2026-11-14T11:57:38.212Z | ending-operation-2-minimal-1 | gap **155.6ms** | current render 8.0ms.

- 2026-11-14T11:57:49.236Z | ending-operation-2-minimal-2 | gap **612.8ms** | current render 538.4ms.

- 2026-11-14T11:57:49.778Z | ending-operation-2-minimal-2 | gap **541.8ms** | current render 9.5ms.

- 2026-11-14T11:58:21.445Z | ending-operation-3-minimal-1 | gap **494.3ms** | current render 376.1ms.

- 2026-11-14T11:58:22.074Z | ending-operation-3-minimal-1 | gap **629.2ms** | current render 33.4ms.

- 2026-11-14T11:58:22.323Z | ending-operation-3-minimal-1 | gap **248.4ms** | current render 7.0ms.

- 2026-11-14T11:58:22.680Z | ending-operation-3-minimal-1 | gap **130.6ms** | current render 5.4ms.

- 2026-11-14T11:58:22.856Z | ending-operation-3-minimal-1 | gap **176.1ms** | current render 7.1ms.

- 2026-11-14T11:58:34.266Z | ending-operation-3-minimal-2 | gap **342.3ms** | current render 389.1ms.

- 2026-11-14T11:58:34.659Z | ending-operation-3-minimal-2 | gap **392.9ms** | current render 9.3ms.

- 2026-11-14T11:58:38.268Z | ending-operation-3-minimal-2 | gap **182.6ms** | current render 3.6ms.

- 2026-11-14T11:58:38.414Z | ending-operation-3-minimal-2 | gap **145.7ms** | current render 4.9ms.

- 2026-11-14T11:58:40.464Z | ending-operation-3-minimal-2 | gap **145.2ms** | current render 4.5ms.

- 2026-11-14T11:58:40.609Z | ending-operation-3-minimal-2 | gap **144.3ms** | current render 4.5ms.

- 2026-11-14T11:58:57.569Z | ending-operation-3-detailed-1 | gap **592.0ms** | current render 508.5ms.

- 2026-11-14T11:58:58.087Z | ending-operation-3-detailed-1 | gap **517.9ms** | current render 9.0ms.

- 2026-11-14T11:59:00.888Z | ending-operation-3-detailed-1 | gap **1712.8ms** | current render 5.5ms.

- 2026-11-14T11:59:11.106Z | ending-operation-3-detailed-1 | gap **331.9ms** | current render 4.4ms.

- 2026-11-14T11:59:11.953Z | ending-operation-3-detailed-2 | gap **476.4ms** | current render 466.9ms.

- 2026-11-14T11:59:12.422Z | ending-operation-3-detailed-2 | gap **469.5ms** | current render 4.9ms.

- 2026-11-14T12:02:36.395Z | boss20-trial1 | gap **153.8ms** | current render 2.5ms.

- 2026-11-14T12:02:37.090Z | boss20-trial1 | gap **384.8ms** | current render 105.7ms.

- 2026-11-14T12:02:37.200Z | boss20-trial1 | gap **109.3ms** | current render 3.9ms.

- 2026-11-14T12:02:42.784Z | boss20-trial1 | gap **113.4ms** | current render 2.5ms.

- 2026-11-14T12:03:01.638Z | boss20-trial1 | gap **132.0ms** | current render 2.8ms.

- 2026-11-14T12:03:01.900Z | boss20-trial1 | gap **192.7ms** | current render 6.7ms.

- 2026-11-14T12:03:04.261Z | boss20-trial1 | gap **153.0ms** | current render 1.5ms.

- 2026-11-14T12:03:42.160Z | boss20-trial2 | gap **104.1ms** | current render 1.7ms.

- 2026-11-14T12:03:50.436Z | boss20-trial2 | gap **312.2ms** | current render 2.6ms.

- 2026-11-14T12:04:00.787Z | boss20-trial2 | gap **195.1ms** | current render 57.6ms.

- 2026-11-14T12:04:02.822Z | boss20-trial2 | gap **100.2ms** | current render 2.5ms.

- 2026-11-14T12:04:58.451Z | boss20-trial3 | gap **299.7ms** | current render 2.9ms.

- 2026-11-14T12:05:20.952Z | desktop1080-r1 | gap **202.6ms** | current render 8.8ms.

- 2026-11-14T12:06:11.807Z | desktop1080-r1 | gap **125.4ms** | current render 3.8ms.

- 2026-11-14T12:07:22.464Z | portrait-r1 | gap **130.3ms** | current render 3.3ms.

- 2026-11-14T12:07:34.432Z | portrait-r1 | gap **221.7ms** | current render 3.3ms.

- 2026-11-14T12:08:23.072Z | desktop1080-r2 | gap **119.6ms** | current render 3.7ms.

- 2026-11-14T12:08:31.160Z | desktop1080-r2 | gap **105.7ms** | current render 4.2ms.

- 2026-11-14T12:08:31.298Z | desktop1080-r2 | gap **137.3ms** | current render 4.4ms.

- 2026-11-14T12:08:31.439Z | desktop1080-r2 | gap **141.5ms** | current render 4.6ms.

- 2026-11-14T12:08:31.578Z | desktop1080-r2 | gap **116.6ms** | current render 4.8ms.

- 2026-11-14T12:08:32.118Z | desktop1080-r2 | gap **466.5ms** | current render 5.3ms.

- 2026-11-14T12:08:32.328Z | desktop1080-r2 | gap **210.7ms** | current render 3.9ms.

- 2026-11-14T12:08:33.008Z | desktop1080-r2 | gap **523.7ms** | current render 3.3ms.

- 2026-11-14T12:08:33.724Z | desktop1080-r2 | gap **715.7ms** | current render 4.3ms.

- 2026-11-14T12:08:34.013Z | desktop1080-r2 | gap **289.0ms** | current render 3.4ms.

- 2026-11-14T12:08:34.520Z | desktop1080-r2 | gap **496.1ms** | current render 3.4ms.

- 2026-11-14T12:08:35.625Z | desktop1080-r2 | gap **1104.8ms** | current render 3.7ms.

- 2026-11-14T12:08:37.883Z | desktop1080-r2 | gap **160.7ms** | current render 5.8ms.

- 2026-11-14T12:08:49.534Z | desktop1080-r2 | gap **213.5ms** | current render 4.3ms.

- 2026-11-14T12:08:50.643Z | desktop1080-r2 | gap **219.6ms** | current render 4.2ms.

- 2026-11-14T12:09:04.862Z | desktop1080-r2 | gap **139.0ms** | current render 4.7ms.

- 2026-11-14T12:10:15.416Z | portrait-r2 | gap **287.5ms** | current render 3.2ms.

- 2026-11-14T12:10:16.511Z | portrait-r2 | gap **1095.1ms** | current render 4.9ms.

- 2026-11-14T12:10:19.203Z | portrait-r2 | gap **1630.9ms** | current render 6.4ms.

- 2026-11-14T12:10:21.081Z | portrait-r2 | gap **202.2ms** | current render 28.1ms.

- 2026-11-14T12:10:25.613Z | portrait-r2 | gap **132.7ms** | current render 3.1ms.

- 2026-11-14T11:59:54.878Z | natural-minimal | gap **286.1ms** | current render 6.9ms.

- 2026-11-14T12:00:25.665Z | natural-minimal | gap **139.3ms** | current render 3.2ms.

- 2026-11-14T12:00:26.839Z | natural-minimal | gap **147.8ms** | current render 3.0ms.

- 2026-11-14T12:00:27.618Z | natural-minimal | gap **122.5ms** | current render 2.6ms.

- 2026-11-14T12:00:27.905Z | natural-minimal | gap **286.8ms** | current render 3.1ms.

- 2026-11-14T12:00:28.074Z | natural-minimal | gap **169.5ms** | current render 2.5ms.

- 2026-11-14T12:00:28.441Z | natural-minimal | gap **182.2ms** | current render 3.3ms.

- 2026-11-14T12:00:29.567Z | natural-minimal | gap **142.7ms** | current render 3.3ms.

- 2026-11-14T12:00:30.050Z | natural-minimal | gap **125.8ms** | current render 3.6ms.

- 2026-11-14T12:00:30.242Z | natural-minimal | gap **117.0ms** | current render 2.1ms.

- 2026-11-14T12:00:30.563Z | natural-minimal | gap **104.4ms** | current render 2.9ms.

- 2026-11-14T12:00:37.518Z | natural-minimal | gap **158.5ms** | current render 3.1ms.

- 2026-11-14T12:00:38.347Z | natural-minimal | gap **814.2ms** | current render 642.5ms.

- 2026-11-14T12:00:38.997Z | natural-minimal | gap **649.4ms** | current render 5.2ms.

- 2026-11-14T12:00:40.099Z | natural-minimal | gap **102.3ms** | current render 4.5ms.

- 2026-11-14T12:00:40.389Z | natural-minimal | gap **290.0ms** | current render 7.8ms.

- 2026-11-14T12:00:42.658Z | natural-minimal | gap **164.0ms** | current render 3.4ms.

- 2026-11-14T12:00:43.017Z | natural-minimal | gap **190.1ms** | current render 2.7ms.

- 2026-11-14T12:01:37.103Z | natural-detailed | gap **198.1ms** | current render 4.2ms.

- 2026-11-14T12:01:40.205Z | natural-detailed | gap **3101.9ms** | current render 4.8ms.

- 2026-11-14T12:01:52.899Z | natural-detailed | gap **163.5ms** | current render 4.2ms.

Final free C: space:24.07GB decimal. No project files were deleted. All remaining uncertainty is preserved rather than converted into a claimed fix.
