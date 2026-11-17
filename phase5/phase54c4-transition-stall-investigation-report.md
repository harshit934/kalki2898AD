# Phase 5.4C.4 — Severe transition stall investigation

Date: 13 November 2026, Asia/Calcutta. **Result: INCONCLUSIVE. The historical 4,051.2 ms transition interruption was not reproduced in three successful comparable AC-powered endings; its cause remains unresolved.** A smaller 509.2 ms ending-boundary gap was captured with evidence of time not executing on the main thread, but no native blocking dependency was established. No fix or production change was implemented. Keep the original environment default, revised Kashi opt-in, and the verified bounds optimization retained.

## 1. Evidence and exact historical timeline

Reviewed phase54c3-bounds-fix-report.md, the preceding acceptance/investigation evidence (including phases54c1 and54c2), raw C3 matched-10-after frame/state journals, bounds probe, replay harness and conditions-last.jsonl; current cinematic, appearance, audio, render-cadence and bounds code. New derived history and capture analysis are in phase54c4-transition-20261113/diagnostic-results.json. Existing reports/raw evidence were not overwritten.

Affected historical replay: **phase54c3-bounds-20261113/matched-10-after**, completed-save Mission1 keyboard replay, ?kashiPrototype=revision, 1920×1080 actual buffer/CSS, GTX1650, AC verified. Browser time origin1794564970503.6 ms.

- Render begins at browser-relative **59,989.5 ms**, takes **2.7 ms**, returns near59,992.2 ms.
- Cinematic state becomes playing, ID **kashi-contract-return**, at **59,993.4 ms**. Relic collection had triggered the ending, but its exact mutation timestamp was not separately recorded. Do not invent campaign/relic micro-timestamps.
- Next render begins at **64,040.7 ms**: start-to-start gap **4,051.2 ms**, about4,048.5 ms after the preceding render returned.
- Wall-clock mapping: **2026-11-13 10:17:10.493–10:17:14.544 UTC**, or **15:47:10.493–15:47:14.544 IST**. These are browser-origin mappings, not independently synchronized kernel events.
- The next render takes **32.3 ms** and therefore follows the interruption; it does not account for the preceding four seconds. Programs remain46. The tab is visible in available samples, boss defeated, relic collected, no HTML mission video; location is the boss arena near (2.485,-0.190,-68.393).
- Cached ending bounds application is **0.1 ms**, with **zero skinned bounding-box/sphere scans**. Its precise position inside the interval is not logged, but its measured duration cannot account for the whole gap.
- Cinematic returns at74,443.0 ms and becomes idle at75,247.6 ms; it did not permanently deadlock. Historical native samples overlap the event with AC1, roughly635–713 MiB free physical RAM and about5.9 GiB available commit. They lack owned hard faults, main-thread stacks or a GPU wait chain.

**Classification:** transition into the ending, before its first recorded render; not initial mission loading, chase or ordinary boss AI execution. The historical record cannot identify the precise actor/React/native initialization substage responsible. An empty document-level media journal does not exclude off-DOM Audio-element work.

The earlier 489.0 ms gap and subsequent362.4 ms render remain distinct older observations; no result here retroactively proves their complete cause. The bounds fix remains verified and unchanged.

## 2. Controlled instrumentation and reproduction

Only the new phase54c4-transition-20261113 directory was written. A source-read-only Vite pre-transform creates an isolated diagnostic build; runtime production files are unchanged. Temporary spans cover relic collection, cinematic start/state, actor render/asset-ready, clone, model setup, cached bounds, appearance, costume, clips/actions/face and effect readiness. Added observations include Long Tasks, resource timing, image initialization where invoked, native WebGL call wall durations, Audio construction/play/load/pause/volume synchronous boundaries, media events and renderer durations. Original behavior/return values are preserved; this instrumentation itself adds overhead.

Chrome captures use a32 MiB **recordUntilFull** buffer, never circular overwrite; stop at70% occupancy or35 seconds; stream export capped64 MiB/file. CPU sampling requests1 ms intervals. Capture arms after boss defeat to avoid sampling the entire fight and reduce the earlier profiler-setup interference. Host screenshot/CDP command intervals and owned browser process mappings are retained. Trace markers align performance.now with Chrome monotonic timestamps; native logs record wall time/QPC at1-second intervals.

The native helper records AC/battery-saver/physical RAM/commit and owned Chrome process CPU time, working set/private commit, total page faults and I/O counters. Process creation identities prevent interpreting a reused PID as the old process. **Total page faults include soft faults. I/O includes IPC/non-disk activity. Neither is a hard-page-fault or disk-latency trace.** Chrome trace tts/tdur provides main-thread CPU time; CPU profile sample weights alone are elapsed-time estimates, not proof of continuous CPU execution.

Limit: at most5 attempts/15 minutes/256 MiB diagnostic admission ceiling, stopping when three successful endings are captured. Four attempts took about8m01s including capture/export, from10:45:39 to10:53:40 UTC. Run1 PASS, run2 **FAIL: player defeated before relic/ending**, run3 PASS, run4 PASS; no fifth attempt was launched. All used ordinary controls and copied completed-save fixtures in ephemeral browser contexts, not the player's persistent profile. Successful endings completed naturally into victory and preserved reload/repeat rewards.

All four records verify **1920×1080 drawing buffer and CSS canvas, DPR1, GTX1650**, with AC1 and battery saver0 throughout the sampled replay intervals. No power, quality, resolution, driver or background-application changes were made. Available RAM was low/variable; per-run minima are retained. Diagnostic setup, polling, GL wrappers and screenshots mean these are not clean production acceptance benchmarks.

Retention checks: successful runs1/3/4 have parsed trace streams to EOF, dataLossOccurred=false, both ending actor model markers retained and no diagnostic event-array overflow. Peak buffer occupancy was17.4%,19.3%,19.0%. Trace JSON totals approximately63.40 MiB, plus profiles/journals below the256 MiB admission ceiling. Run2 has no ending capture; absent CPU/trace data is not a zero-loss pass. No prior ETL/trace was recreated or overwritten.

## 3. Reproduction findings and attribution limits

Successful runs' initial ending-boundary gaps: **93.4,173.9,509.2 ms**; first ending renders **23.9,32.2,16.8 ms**. Their ending-wide worst gaps are146.4,187.3,509.2 ms. **The 4,051.2 ms ending gap did not reproduce.** Run2 had a4,847.8 ms gap during its failed non-ending replay; this is separately recorded and is not substituted as a successful reproduction of the requested event.

### Largest new ending boundary: run4

Renderer PID23972/main TID27380. The boundary starts at browser-relative96,362.5 ms and ends96,871.7 ms. The contained large animation-frame task lasts **468.838 ms wall time but71.588 ms thread CPU**: approximately **397.250 ms elapsed time was not charged to main-thread CPU**. Without Windows ready/running/wait events this cannot be separated into descheduling, page service, synchronization or another wait.

The actor effect lasts **354.8 ms**. Its applyBhairavaAppearance subspan lasts **262.9 ms wall /27.870 ms main-thread CPU**, so about235 ms is not explained as CPU execution. Sampled stacks locate the active call chain at:

CinematicActor effect → applyBhairavaAppearance → BufferGeometry.clone/copy → BufferAttribute.clone/copy → new source.array.constructor(source.array).

The sampled compiled Three.js location was inspected directly (three-BKgP55LH.js, line0/column92047), confirming typed-array allocation/copy. Source-map positions from string transforms are not trusted. **This establishes the observed call site; it does not establish why that call was delayed.** A weighted249 ms profile entry under copy is not249 ms of proven CPU work. The missing distinction is essential.

Around this boundary, two native renderer snapshots span2,179 ms and show **8,443 total faults**, working set245,997,568→272,814,080 bytes, private commit1,058,553,856→1,077,964,800 bytes, process CPU421.875 ms across all threads, and37,880 read bytes. These encompass more than the precise subspan. Allocation/demand-zero faults, hard page-ins and other activity are not distinguished. Memory pressure/page service is a plausible contributor, **not a confirmed cause**. Process CPU is not main-thread scheduling evidence.

Near-start MinorGC is about1.8 ms; no GC event overlaps the appearance subspan. This captured262.9 ms interval is not explained by an observed long V8 GC pause. A concurrent GPU DXGI Present event of about26 ms is not a main-thread wait dependency and cannot explain the four-second historical gap. There is no captured native GPU fence/wait chain.

### Cross-run stage evidence

- Run1: actor model 1.3 ms; effect 66.6 ms; appearance 24.9 ms wall /24.1 ms CPU; cached bounds 0.2 ms, zero scans; largest observed media API subspan 1.9 ms.
- Run3: actor model 2.0 ms; effect 139.4 ms; appearance 76.1 ms wall /20.4 ms CPU; cached bounds 0.2 ms, zero scans; largest observed media API subspan 1.7 ms.
- Run4: actor model 99.7 ms; effect 354.8 ms; appearance 262.9 ms wall /27.9 ms CPU; cached bounds 0.2 ms, zero scans; largest observed media API subspan 37.2 ms.

Relic/cinematic-state initiation and cached bounds are small in these captures; actor asset-ready markers show the cached GLTF is available. No renewed actor GLB/image fetch or observed decode explains the initial ending delays. Small later chime/media requests are separate from actor readiness. Audio/play/volume calls are timed directly in this phase, including off-DOM elements, but their short current durations do not disprove a historical audio/browser wait. React state/model/effect milestones and sampled stacks are available; a complete production React commit-phase profiler is not.

**Root-cause assessment:** the original four-second operation is **UNRESOLVED / NOT REPRODUCED**. For the smaller current boundary, allocation/copy within actor appearance is the strongest localized observation, with substantial non-CPU elapsed time. A pure long JavaScript loop, confirmed hard paging, GPU driver fault or audio fault is not established. Native kernel scheduling/ready/wait stacks, per-event hard page faults, disk service and GPU fence dependencies were not captured. Existing counts/timing correlation cannot replace them.

## 4. Frame-time distributions

Intervals below are renderer-start gaps. Full replay windows start after readiness and include traversal/combat, capture setup/export, cinematic and post-mission UI; **they are not clean active-combat FPS**. Ending-only values include its start boundary and end at cinematic idle. Every >100 ms gap is listed in the appendix and diagnostic-results.json. Raw frames, stages, Long Tasks, CPU profiles, Chrome trace CPU clocks, network, host actions and native journals are retained.

- Run1 PASS: average 28.52 FPS; mean 35.06 ms; median 34.6 ms; p95 35.4 ms; p99 51.6 ms; worst 1089.1 ms; >100 ms gaps 10.
  Ending-only: average 29.56 FPS; median 34.6 ms; p95 35.5 ms; p99 41.7 ms; worst 146.4 ms.
- Run2 FAIL: average 26.77 FPS; mean 37.35 ms; median 34.6 ms; p95 35.5 ms; p99 50.9 ms; worst 4847.8 ms; >100 ms gaps 24; Player defeated.
- Run3 PASS: average 28.73 FPS; mean 34.80 ms; median 34.6 ms; p95 35.6 ms; p99 48.7 ms; worst 1339.4 ms; >100 ms gaps 9.
  Ending-only: average 28.90 FPS; median 34.6 ms; p95 35.1 ms; p99 99.4 ms; worst 187.3 ms.
- Run4 PASS: average 28.49 FPS; mean 35.09 ms; median 34.6 ms; p95 35.3 ms; p99 71.7 ms; worst 656.8 ms; >100 ms gaps 21.
  Ending-only: average 27.91 FPS; median 34.6 ms; p95 35.4 ms; p99 102.8 ms; worst 509.2 ms.

Full p01/p05/p25/p50/p75/p90/p95/p99/p99.9 distributions are in diagnostic-results.json. Loading/preparation occurred before the replay windows; bounds preparation timings from the unchanged cache are separately recorded as preparedMs. No loading interval was relabeled as combat. Profiling setup and screenshot command intervals are journaled so overlapping diagnostic overhead can be distinguished; their existence is not proof that they caused a gap. No stable30 FPS or elimination of rare stalls is claimed from these samples.

## 5. Recommended minimal action

**No production fix is justified for the historical4,051.2 ms event by this evidence.** Retain the verified bounds optimization and make no audio/layout/geometry/shadow/AI changes. Preparing appearance resources earlier could be a separate optimization candidate for the measured call site, but it is not a proven repair for the four-second interruption and is not recommended as an automatic change.

If a further capture is approved, target a single ending event with bounded native main-thread context-switch/ready/wait stacks and owned hard-page-fault/service evidence aligned to the existing markers; include GPU wait/fence evidence only where supported. Validate non-overwriting retention first and stop on timeout/loss. This would distinguish allocator/page-service waits from CPU scheduling or browser/GPU synchronization. Do not automatically launch another phase or a broad driver investigation. The current investigation ends here.

## 6. Integrity and cleanup

Fresh preflight and final checks: **47/47 protected hashes match; every recorded current source/configuration/asset/report hash and bounds-fix file matches preflight.** No production file was modified in this phase. New files are limited to this phase's diagnostic/report directory and this report. Original environment default, rejected opt-in revisions, rollback points, shader warm-up, missions, controls, Bhairava/audio/UI code and save formats remain unchanged. Actual player profiles/progress were not opened; successful fixture replays preserved saved completion and reward invariants.

The isolated diagnostic builds compiled successfully. Production build/lint were not redundantly rerun because production source is unchanged; the existing C3 results are not represented as new tests. Owned browser contexts/servers closed, port5504 verified not listening, native sampler exited0 and no SystemJournal process remained. Approximately39.47 GiB C: free at closure. No project cleanup/deletion, driver/registry/service change or environment integration occurred.

## 7. Decision

**INCONCLUSIVE:** three successful AC1080p captures completed, but the4,051.2 ms ending interruption did not reproduce and its root cause remains unresolved. Smaller transition delays were localized without establishing their native blocking chain. No fix implemented; retain the current opt-in state and stop for approval.

## Appendix — every render-start gap above100 ms

UTC start and duration below. End times, prior/following render durations and phase labels are in diagnostic-results.json. OTHER_POST_READINESS can include combat, intentional capture setup/export or post-mission UI; it does not mean every such gap is active gameplay. Profiler/screenshot intervals remain separately available.

### Run1 (PASS)

- 2026-11-13T10:46:07.620Z: 1089.1 ms — OTHER_POST_READINESS.
- 2026-11-13T10:46:08.751Z: 238.0 ms — OTHER_POST_READINESS.
- 2026-11-13T10:46:38.277Z: 105.2 ms — OTHER_POST_READINESS.
- 2026-11-13T10:46:50.347Z: 476.6 ms — OTHER_POST_READINESS.
- 2026-11-13T10:46:56.447Z: 303.5 ms — OTHER_POST_READINESS.
- 2026-11-13T10:46:58.611Z: 171.0 ms — OTHER_POST_READINESS.
- 2026-11-13T10:47:07.423Z: 133.1 ms — OTHER_POST_READINESS.
- 2026-11-13T10:47:07.580Z: 978.1 ms — OTHER_POST_READINESS.
- 2026-11-13T10:47:10.847Z: 146.4 ms — ENDING.
- 2026-11-13T10:47:20.951Z: 222.9 ms — OTHER_POST_READINESS.
### Run2 (FAIL)

- 2026-11-13T10:47:56.427Z: 176.0 ms — OTHER_POST_READINESS.
- 2026-11-13T10:48:12.318Z: 538.8 ms — OTHER_POST_READINESS.
- 2026-11-13T10:48:12.856Z: 1472.7 ms — OTHER_POST_READINESS.
- 2026-11-13T10:48:14.329Z: 168.1 ms — OTHER_POST_READINESS.
- 2026-11-13T10:48:16.524Z: 111.4 ms — OTHER_POST_READINESS.
- 2026-11-13T10:48:16.760Z: 349.2 ms — OTHER_POST_READINESS.
- 2026-11-13T10:48:17.109Z: 398.2 ms — OTHER_POST_READINESS.
- 2026-11-13T10:48:17.507Z: 165.8 ms — OTHER_POST_READINESS.
- 2026-11-13T10:48:17.673Z: 115.6 ms — OTHER_POST_READINESS.
- 2026-11-13T10:48:18.092Z: 358.3 ms — OTHER_POST_READINESS.
- 2026-11-13T10:48:18.456Z: 170.4 ms — OTHER_POST_READINESS.
- 2026-11-13T10:48:18.960Z: 202.2 ms — OTHER_POST_READINESS.
- 2026-11-13T10:48:19.660Z: 131.5 ms — OTHER_POST_READINESS.
- 2026-11-13T10:48:20.022Z: 156.2 ms — OTHER_POST_READINESS.
- 2026-11-13T10:48:20.659Z: 136.6 ms — OTHER_POST_READINESS.
- 2026-11-13T10:49:08.791Z: 510.4 ms — OTHER_POST_READINESS.
- 2026-11-13T10:49:09.301Z: 210.4 ms — OTHER_POST_READINESS.
- 2026-11-13T10:49:50.158Z: 202.1 ms — OTHER_POST_READINESS.
- 2026-11-13T10:49:51.691Z: 145.7 ms — OTHER_POST_READINESS.
- 2026-11-13T10:49:51.927Z: 4847.8 ms — OTHER_POST_READINESS.
- 2026-11-13T10:49:56.775Z: 367.1 ms — OTHER_POST_READINESS.
- 2026-11-13T10:49:57.142Z: 2981.7 ms — OTHER_POST_READINESS.
- 2026-11-13T10:50:00.157Z: 293.8 ms — OTHER_POST_READINESS.
- 2026-11-13T10:50:00.454Z: 173.6 ms — OTHER_POST_READINESS.
### Run3 (PASS)

- 2026-11-13T10:50:58.888Z: 188.3 ms — OTHER_POST_READINESS.
- 2026-11-13T10:51:01.280Z: 115.2 ms — OTHER_POST_READINESS.
- 2026-11-13T10:51:02.159Z: 139.4 ms — OTHER_POST_READINESS.
- 2026-11-13T10:51:03.549Z: 160.8 ms — OTHER_POST_READINESS.
- 2026-11-13T10:51:19.047Z: 318.5 ms — OTHER_POST_READINESS.
- 2026-11-13T10:51:21.149Z: 173.9 ms — ENDING_BOUNDARY.
- 2026-11-13T10:51:22.516Z: 104.5 ms — ENDING.
- 2026-11-13T10:51:32.519Z: 187.3 ms — ENDING.
- 2026-11-13T10:51:32.706Z: 1339.4 ms — OTHER_POST_READINESS.
### Run4 (PASS)

- 2026-11-13T10:52:05.320Z: 156.6 ms — OTHER_POST_READINESS.
- 2026-11-13T10:52:05.549Z: 290.1 ms — OTHER_POST_READINESS.
- 2026-11-13T10:52:05.839Z: 133.2 ms — OTHER_POST_READINESS.
- 2026-11-13T10:52:06.416Z: 106.5 ms — OTHER_POST_READINESS.
- 2026-11-13T10:52:06.522Z: 320.0 ms — OTHER_POST_READINESS.
- 2026-11-13T10:52:07.380Z: 656.8 ms — OTHER_POST_READINESS.
- 2026-11-13T10:52:08.037Z: 183.9 ms — OTHER_POST_READINESS.
- 2026-11-13T10:52:10.315Z: 160.2 ms — OTHER_POST_READINESS.
- 2026-11-13T10:52:10.500Z: 159.0 ms — OTHER_POST_READINESS.
- 2026-11-13T10:52:35.747Z: 313.2 ms — OTHER_POST_READINESS.
- 2026-11-13T10:52:38.814Z: 190.3 ms — OTHER_POST_READINESS.
- 2026-11-13T10:52:39.583Z: 167.2 ms — OTHER_POST_READINESS.
- 2026-11-13T10:53:16.581Z: 278.6 ms — OTHER_POST_READINESS.
- 2026-11-13T10:53:18.585Z: 117.9 ms — OTHER_POST_READINESS.
- 2026-11-13T10:53:18.703Z: 302.6 ms — OTHER_POST_READINESS.
- 2026-11-13T10:53:19.006Z: 462.5 ms — OTHER_POST_READINESS.
- 2026-11-13T10:53:19.468Z: 509.2 ms — ENDING_BOUNDARY.
- 2026-11-13T10:53:20.148Z: 116.7 ms — ENDING.
- 2026-11-13T10:53:20.548Z: 102.8 ms — ENDING.
- 2026-11-13T10:53:25.252Z: 215.8 ms — ENDING.
- 2026-11-13T10:53:31.399Z: 158.3 ms — OTHER_POST_READINESS.

**Final status: INCONCLUSIVE. No implementation or integration.**
