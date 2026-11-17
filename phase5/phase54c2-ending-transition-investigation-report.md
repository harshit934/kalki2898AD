# Phase 5.4C.2 — Ending-transition performance investigation

Date: 13 November 2026, Asia/Calcutta. **Investigation complete; no production fix authorized or applied.** Original environment remains default; revised Kashi remains opt-in and rejected for production acceptance. All 47 protected hashes and recorded revision/runtime files remain unchanged. No Phase 5.4D work or integration.

## Finding and confidence

**A severe ending-transition delay was reproduced once, and two related CPU bottlenecks were identified directly:** (1) skinned-mesh bounding-box calculation during cinematic actor setup, followed by (2) skinned-mesh bounding-sphere calculation during its first render. Timed spans, Long Task entries, CPU samples and retained Chrome user-timing events agree. This is stronger than a temporal correlation with RAM or GPU activity.

The historical 489.0 ms gap and 362.4 ms render remain separate consecutive intervals. New evidence supports this actor-initialization/first-render mechanism as the strongest explanation of the historical pattern, but cannot retrospectively prove the exact operation in the old unsampled 489 ms interval. Current battery/profiler measurements are not directly comparable to the historical AC/passive run. No stabilization or acceptance is claimed.

## Existing evidence and ordering

Read phase54c1-acceptance-review-report.md, phase54c-revision-report.md, the original replay synchronized-browser-trace.json and passive harness, six comparison records and condition journal, completion/ending controller and actor source. The saved historical sequence is:

- Browser-relative 75,238.0 → 75,727.0 ms: 489.0 ms render-start gap, UTC 2026-11-13 08:01:16.944 → 08:01:17.433 (IST 13:31:16.944 → 13:31:17.433).
- Prior render wall time 5.6 ms; about 483.4 ms elapses after it returns before the next render starts. State changes from relic false/cinematic idle to relic true/cinematic playing inside this interval.
- The render beginning at 75,727.0 ms takes 362.4 ms, ending near 76,089.4 ms. Next render starts at 76,096.8 ms: adjacent gap 369.8 ms. The 362.4 ms call **follows, does not overlap and does not precede** the 489 ms gap. The two start-to-start gaps span 858.8 ms.
- Existing records did not time actor initialization, fetch/decode, React work, CPU stacks, paging or GPU waits at that instant. The old memory journal ends 81.691 seconds before the incident. Program count 46→46 and empty shader arrays did not establish a cause.

## Isolation, instrumentation and bounds

All new scripts/builds/logs/traces are under phase54c2-ending-20261113/. A Vite pre-transform instruments code only in the isolated after-build-v4 output; source modules are read, not edited. The default production dispatch, old/revised opt-in routes and rollback copies are preserved. Diagnostic browser contexts use copied completed-save fixtures, not the player's persistent profile.

Instrumentation covers synchronous collectRelic and startCinematic spans; boss/campaign/cinematic state subscriptions; actor clone, bounds, appearance, costume, mixer, clip/action and face setup; actor effect readiness; main renderer calls; GL shader/upload/buffer/synchronization calls above 2 ms; browser Long Tasks; image decode/createImageBitmap calls where invoked; successful resource timing and network events; sampled JS heap; 2-second native physical-RAM/commit/power journal. React state/mount-related milestones and sampled stacks are available; there is no complete React Profiler commit-duration stream. Async decoder paths not invoking the wrapped image APIs remain unmeasured.

Chrome renderer CPU sampling requested 1 ms intervals (actual samples are sparser and time-weighted), with process/thread IDs from trace metadata. User Timing bounds markers align browser-relative timestamps with Chrome monotonic trace timestamps. Native memory is correlated through wall-clock timestamps at 2-second resolution, not a full QPC scheduling trace.

Bound: at most three live replay attempts, original ten-minute series deadline, 35-second per-trace cap, 32 MiB recordUntilFull trace buffer, stop at 70% occupancy, ReturnAsStream export with 64 MiB per-file cap. This does not use overwriting circular tracing. The live series including failed setup ran 09:25:34–09:31:06 UTC, about 5m32s; offline build/analysis/report time is separate. Trace/profile output remained below the 256 MiB diagnostic ceiling. Source maps from string-based transforms are not trusted for attribution; compiled source around profile function positions and original source were inspected directly.

Retention: captures in retry-1 and retry-3 parsed successfully, exported to EOF, dataLossOccurred=false, maximum reported occupancy approximately 11.7% and 28.3%, respectively. Both retain before/after data; retry-3 retains both actor-bounds markers and the following render. No native Windows scheduling, owned hard-fault/disk trace, VRAM telemetry or driver GPU-fence wait chain was captured. Chrome gpu-category events are not a substitute for that missing evidence. No driver, registry, service or BIOS changes were attempted.

## Attempts, conditions and failures

The first diagnostic build failed because a CRLF-sensitive text-instrumentation anchor did not close the temporary wrapper. Its log/partial build are preserved. Normalizing only the diagnostic transform fixed the build; production source was never changed. Diagnostic build v2 succeeded.

Initial run-1/2/3 were **setup failures**: a diagnostic client/server port mismatch caused fetch failure before a game loaded. They are not benchmark windows. Their logs remain. One harness correction produced retry-1/2/3 under the original deadline; there were no unlimited retries.

- retry-1: player defeated, boss defeated but relic uncollected/not ready. **Target reproduction failed.** CPU/Chrome trace captured late combat only; loss-free trace does not turn this into a valid ending test.
- retry-2: player defeated before capture threshold. **Target reproduction failed.** Browser diagnostics exist; no CPU profile/Chrome trace was started. Its absent capture status is not zero event loss.
- retry-3: relic collected, ending kashi-contract-return played, victory reached, save survived reload and replay rewards unchanged. **Functional endpoint PASS**, but severe stalls remain. Only **one successful ending reproduction**, so repeatability is not established.

All were run at requested 1920×1080 viewport. retry-1 and retry-3 independently verified actual WebGL buffer and CSS canvas 1920×1080, DPR 1, ANGLE NVIDIA GTX 1650. retry-2 died before the capture-stage check; its early CSS sample is not sufficient independent render validation. Its metrics are retained as failed-attempt diagnostics, not a validated 1080p acceptance window.

Native power remained battery throughout these replays, unlike the historical AC-powered run. Battery fell from 76% to approximately 68%; no power mode, charger setting, application closure or rendering quality was changed to manufacture results. Successful replay available RAM reached about 373 MiB and available commit stayed above about 8,149 MiB. These conditions and profiler/GL-wrapper/screenshot overhead materially limit direct timing comparison.

## Successful reproduction: stage-by-stage evidence

Run retry-3 uses browser time origin 1794562171503.9 ms. Renderer trace PID 5636, TID 15920. UTC conversions are browser wall-clock mappings; all precise stage measurements are browser-relative.

- 65,794.8 ms: campaign completion state update; 65,795.2 ms boss defeated. Completion was registered about three seconds **before** relic collection; it is not an assumed single event at the ending start.
- 67,896.7 ms: victoryReady true.
- 68,815.4–68,815.8 ms: collectRelic span **0.4 ms**; relic state becomes true at 68,815.6 ms. The fixture already owned the replay reward, so this does not benchmark a fresh unique-reward persistence write.
- 68,822.5–68,823.5 ms: startCinematic **1.0 ms**, playing/session event at 68,823.4 ms, exact ID kashi-contract-return.
- 68,824.3–68,826.2 ms: actor clone **1.9 ms**.
- **68,826.3–70,113.7 ms: actor.bounds, Box3.setFromObject, 1,287.4 ms**, UTC 09:30:40.330–09:30:41.617 (IST 15:00:40.330–15:00:41.617). It lies inside the 68,815.8→70,233.6 ms transition render-start gap of **1,417.8 ms** and a 1,408 ms Long Task.
- Appearance **37.2 ms**, costume **42.4 ms**, clip preparation **14.2 ms**; effect ready at 70,213.9 ms. These are measured additional setup costs, not the dominant bounds interval.
- **70,233.6–71,021.4 ms: ending render 787.8 ms**, UTC 09:30:41.737–09:30:42.525. It follows actor bounds; the intervals do not overlap. Program count remains 46. The next render start is delayed until 72,130.4 ms, a **1,896.8 ms** start-to-start gap containing this render and additional later work, not just the render call.

### Verified CPU operation

Bounds-span CPU samples account for approximately 1,283 ms inclusive in setFromObject → expandByObject → SkinnedMesh.computeBoundingBox. Descendants include getVertexPosition, applyBoneTransform, matrix multiplication and typed attribute access. The trace's overlapping main-thread MinorGC is only about 1.8 ms; this captured bounds interval is not explained by a long GC pause or observed shader call.

The first slow ending render has approximately **686 ms time-weighted inclusive samples in computeBoundingSphere**, with bone transforms and matrix operations, and about **72 ms in computeBoneTexture**. Inclusive ancestry values are not additive to their descendants. This provides direct evidence of CPU skinning/bounds work inside the render call, rather than identifying a shader or driver wait from its wall time alone.

Source cross-checks: CinematicStage.jsx clones the actor, then uses new Box3().setFromObject(object) for height normalization. Installed Three.js SkinnedMesh.computeBoundingBox and computeBoundingSphere each iterate vertex positions, applying bone transforms. Frustum.intersectsObject computes a missing object bounding sphere lazily. Both expensive stages therefore belong to initialization/first use of the cinematic skinned actor. No protected geometry was edited to test this.

### Additional captured interruptions and limits

The later 71,022.9 ms Long Task lasts 1,115 ms; CPU samples point to createCinematicAudio's play path, its Audio.play helper and volume-setting helper. Compiled code at the sampled function position matches audioManager.js. This identifies a media-initialization call path, **not the exact native decode/IPC/wait below it**. It adds to the gap after the first ending render. The chime resource request appears at 72,458.4–72,596.0 ms, after the bounds/render intervals; it cannot explain their earlier CPU work.

A 700 ms later task contains about 623.6 ms Layout and 74.4 ms UpdateLayoutTree. A separate 319 ms task is mostly sampled as '(program)' and remains unattributed. A 621.8 ms gap just before the measured relic call also remains unexplained; the 0.4 ms relic span does not account for it. Screenshots/CDP setup and polling remain confounds: Profiler.start itself took about 447 ms in retry-1 during combat. We did not assign player defeat or every extra gap to that overhead without proof.

No new actor GLB/image resource request was observed during the primary bounds/first-render interval; sampled CPU work operates on resident geometry. That supports initialization cost rather than a measured model fetch stall. It does not certify all asynchronous decodes, owned paging or GPU waits absent. Concurrent memory samples around bounds report roughly 630–663 MiB free physical RAM and about 8.1 GiB available commit; no owned hard faults were captured. Paging/VRAM cannot be promoted to a cause from these counters.

## Frame-time results — diagnostic, not optimization before/after

Full distributions, phase labels, every >100 ms gap, stage markers and CPU attribution are in diagnostic-results.json; original raw arrays, profiles, Chrome traces, network/protocol logs and memory journals are retained. These pooled render-start distributions include traversal/combat/transition (and ending only where reached). Profiling and battery conditions prevent comparison as a controlled improvement over the earlier passive AC run.

- retry-1: 27.00 FPS; mean 37.04 ms; median 34.5 ms; p95 41.0 ms; p99 148.0 ms; worst 897.8 ms; >100 ms count 23. Ending not reached; failed reproduction.
- retry-2: 29.48 FPS; mean 33.92 ms; median 34.5 ms; p95 39.9 ms; p99 59.8 ms; worst 274.7 ms; >100 ms count 3. Ending not reached; failed reproduction.
- retry-3: 25.40 FPS; mean 39.37 ms; median 34.6 ms; p95 38.6 ms; p99 161.4 ms; worst 1896.8 ms; >100 ms count 28. Ending reached.

Every recorded render-start gap >100 ms (UTC start, duration; these are not GPU presentation timings):

### retry-1

- 2026-11-13T09:26:56.975Z: 148.0 ms; idle → idle.
- 2026-11-13T09:26:57.203Z: 121.7 ms; idle → idle.
- 2026-11-13T09:27:00.199Z: 146.3 ms; idle → idle.
- 2026-11-13T09:27:00.345Z: 119.0 ms; idle → idle.
- 2026-11-13T09:27:00.735Z: 681.8 ms; idle → idle.
- 2026-11-13T09:27:01.697Z: 278.3 ms; idle → idle.
- 2026-11-13T09:27:03.432Z: 270.7 ms; idle → idle.
- 2026-11-13T09:27:03.904Z: 140.1 ms; idle → idle.
- 2026-11-13T09:27:05.264Z: 116.4 ms; idle → idle.
- 2026-11-13T09:27:05.797Z: 181.8 ms; idle → idle.
- 2026-11-13T09:27:09.634Z: 428.5 ms; idle → idle.
- 2026-11-13T09:27:29.855Z: 190.6 ms; idle → idle.
- 2026-11-13T09:27:30.046Z: 246.4 ms; idle → idle.
- 2026-11-13T09:27:30.292Z: 214.2 ms; idle → idle.
- 2026-11-13T09:27:36.673Z: 459.3 ms; idle → idle.
- 2026-11-13T09:27:37.936Z: 103.9 ms; idle → idle.
- 2026-11-13T09:27:42.935Z: 120.3 ms; idle → idle.
- 2026-11-13T09:27:43.055Z: 169.9 ms; idle → idle.
- 2026-11-13T09:27:43.236Z: 344.0 ms; idle → idle.
- 2026-11-13T09:27:43.580Z: 897.8 ms; idle → idle.
- 2026-11-13T09:27:44.478Z: 277.2 ms; idle → idle.
- 2026-11-13T09:27:45.764Z: 171.1 ms; idle → idle.
- 2026-11-13T09:27:46.035Z: 105.0 ms; idle → idle.
### retry-2

- 2026-11-13T09:28:57.546Z: 121.0 ms; idle → idle.
- 2026-11-13T09:28:57.677Z: 105.1 ms; idle → idle.
- 2026-11-13T09:29:24.814Z: 274.7 ms; idle → idle.
### retry-3

- 2026-11-13T09:29:51.866Z: 115.3 ms; idle → idle.
- 2026-11-13T09:29:52.226Z: 104.9 ms; idle → idle.
- 2026-11-13T09:29:53.391Z: 290.5 ms; idle → idle.
- 2026-11-13T09:29:55.396Z: 131.0 ms; idle → idle.
- 2026-11-13T09:29:55.527Z: 452.2 ms; idle → idle.
- 2026-11-13T09:29:55.980Z: 144.0 ms; idle → idle.
- 2026-11-13T09:29:58.165Z: 419.1 ms; idle → idle.
- 2026-11-13T09:29:59.059Z: 278.5 ms; idle → idle.
- 2026-11-13T09:29:59.392Z: 363.2 ms; idle → idle.
- 2026-11-13T09:30:27.461Z: 135.4 ms; idle → idle.
- 2026-11-13T09:30:29.442Z: 1462.7 ms; idle → idle.
- 2026-11-13T09:30:31.392Z: 107.0 ms; idle → idle.
- 2026-11-13T09:30:32.499Z: 114.9 ms; idle → idle.
- 2026-11-13T09:30:33.628Z: 430.1 ms; idle → idle.
- 2026-11-13T09:30:36.457Z: 355.7 ms; idle → idle.
- 2026-11-13T09:30:37.328Z: 280.6 ms; idle → idle.
- 2026-11-13T09:30:37.624Z: 119.2 ms; idle → idle.
- 2026-11-13T09:30:37.743Z: 215.0 ms; idle → idle.
- 2026-11-13T09:30:37.958Z: 307.1 ms; idle → idle.
- 2026-11-13T09:30:38.963Z: 115.9 ms; idle → idle.
- 2026-11-13T09:30:39.393Z: 161.4 ms; idle → idle.
- 2026-11-13T09:30:39.570Z: 127.3 ms; idle → idle.
- 2026-11-13T09:30:39.697Z: 621.8 ms; idle → idle.
- 2026-11-13T09:30:40.319Z: 1417.8 ms; idle → playing / kashi-contract-return.
- 2026-11-13T09:30:41.737Z: 1896.8 ms; playing → playing / kashi-contract-return.
- 2026-11-13T09:30:43.634Z: 329.3 ms; playing → playing / kashi-contract-return.
- 2026-11-13T09:30:44.957Z: 711.0 ms; playing → playing / kashi-contract-return.
- 2026-11-13T09:30:55.614Z: 255.9 ms; idle → idle.

Historical comparison is descriptive only: old broad replay 29.37 FPS, median 34.6 ms, p95 35.4 ms, p99 39.9 ms, worst 489.0 ms and seven >100 ms gaps; its long render was 362.4 ms. New successful diagnostic replay is slower and contains multi-second gaps. No fix was tested, so there is **no after-fix result** and no claim of stable 1080p/30 FPS. The exact 489 ms magnitude was not reproduced; the same completion/ending lifecycle produced a stronger, attributable interruption.

## Preservation, rollback and recommendation

Fresh final verification: **47/47 protected hashes match**, all recorded source/configuration/revision/rejected-prototype/warm-up files unchanged. Ports 5313 and 5482 are closed, native journal stop flags written and owned browser tests ended. The old original/revision rollback remains intact. The diagnostic build can remain dormant; restoring production files is unnecessary because none were modified. No files were deleted. Build failure, setup failures, unsuccessful combat attempts and successful-but-slow transition evidence were retained separately.

No broad mission/chase/HUD/loading regression suite was rerun: no production behavior changed. Their previous evidence remains valid only within its documented scope; the two diagnostic deaths are failed attempts, not passing tests. Diagnostic build success is not a new production acceptance pass. Physical mobile, driver wait-chain and hardware performance acceptance remain untested here.

**Recommendation: request narrowly scoped approval for a targeted cinematic actor bounds/lifecycle repair**, rather than further speculative shadow, geometry, AI or resolution changes. Evaluate reuse/preparation of verified actor sizing and conservative skinned culling bounds during the existing loading lifecycle, with explicit invalidation for different assets/poses/costumes; do not simply disable all culling or freeze animated bounds. Do not edit protected assets, remove the ending or bypass its animation. Media-initialization and layout delays should remain separate measured issues; the captured 319/621.8 ms intervals must remain unresolved until attributable.

If repair is approved, preserve rollback copies and compare the same completed-save transition at verified 1080p under matched power/settings, with instrumented and uninstrumented measurements. Validate actor scale, animation/costume/weapon, camera/frustum/shadows, natural ending, replay rewards/save reload and cancellation/loading paths; enumerate all >100 ms gaps. Revert a repair if actor visibility/culling/pose, controls or progression changes. Until then, no implementation and no integration. Historical 533.6 ms ending and 5,384.5 ms gameplay incidents are not silently marked fixed by this reproduction.

**Conclusion:** CPU-skinned actor bounds are verified bottlenecks in one current ending reproduction. Their relationship is consecutive actor setup then first-render culling work. Exact retrospective attribution of the original pair, full transition repeatability and native media/GPU/paging blocking remain limited. Stop after this investigation/report; await approval.
