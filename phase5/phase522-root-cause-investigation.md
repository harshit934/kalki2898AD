# Phase 5.2.2 — performance root-cause investigation

12 November 2026, local time. **Investigation complete; stabilization NOT established. Phase 5.2 approval remains conditional. Phase 5.3 has not started.**

## Conclusion

The exact operations responsible for the historical **1,820.5 ms combat** and **521.3 ms menu** production gaps cannot be established from the recordings available. Neither event has a simultaneous browser/kernel/GPU trace. This investigation narrows where time was spent and identifies specific diagnostic artifacts and separate paging/wait events; it does not turn those correlations into a universal root cause.

No production code, protected assets, rollback files, graphics settings or gameplay systems were changed. All changes are diagnostic scripts, evidence and reports. User browser profiles/saves were not opened or reset; combat uses disposable contexts and a prerequisite completion fixture to unlock Mission 2.

## Evidence for the headline stalls

The Complex menu interval at index 893 was **521.3 ms**. Its preceding renderer.render call took **1.8 ms**, the following call **14.8 ms**, and the whole run's maximum render call **17.3 ms**. Thus about **519.5 ms of that start-to-start interval was outside the preceding render call**. It could include browser scheduling, OS waits or other callbacks; these numbers do not identify which. A separate 146.5 ms menu gap had adjacent render calls of 2.6 and 4.1 ms. [Per-interval evidence](phase522/extracted-evidence.json).

The worst combat run records **1,820.5 ms between actual render submissions** and **1,824.4 ms in the independent browser rAF trace**, at browser timestamp 51,074.3 ms. Hidden-frame count is zero. This confirms a real callback-delivery gap, not merely the 30 Hz submission counter. The retained model/GLB requests finished before this warm gap, and the first state samples retain 63 programs/70 textures. These observations do not rule out later driver residency work, GC or other browser activity. The exact blocking operation is **unknown**.

Every retained >100 ms historical interval and fresh gap is enumerated in [bottleneck evidence](phase522-bottleneck-evidence.json), with file/ordinal/timestamp where available. Historical combat sorted render intervals lack exact chronological CPU spans; rAF gaps are retained separately. Render and rAF maxima/counts must not be combined as though they were the same event series.

## CPU, GPU, memory, disk and browser separation

The previous approved 150-second ETW capture parsed **9,345 owned-Chrome hard faults**, **1,503,677 relevant context switches** and **zero lost events**. Counts include startup. At a **367.4 ms** diagnostic renderer gap, the active renderer-main thread spent about **361.6 ms off CPU** in UserRequest waits with no overlapping owned hard fault. At another **358.6 ms** gap it spent **348.2 ms waiting**, while GPU-main hard faults overlapped part of the interval. No direct active-renderer-main hard fault explained that gap. UserRequest is a wait classification, not a proven browser/driver dependency. This trace does **not** overlap the later 1,820.5 or 521.3 ms production events. [Kernel evidence](phase521/kernel-correlation.json), [parser counts](phase521/kernel-parser-results.json).

An earlier CPU trace captured an animation callback lasting **1,976.432 ms wall time but only 26.621 ms thread CPU**. Therefore that callback's wall duration must not be advertised as 1.98 seconds of AI, physics or rendering computation. Its remaining wall time requires a scheduling/wait dependency explanation. Thread CPU time alone cannot identify the owner. [Thread-time evidence](phase521/thread-time-evidence.json).

Earlier GPU-worker hard faults name NVIDIA **DXCache .nvph** backing files. Some GPU-main hard faults in the 358.6 ms gap have empty filenames. A hard fault can read a file-backed page; it is not automatically a read from pagefile.sys. Elapsed fault time includes waiting and is not isolated disk-transfer latency. The available correlation does not prove whether a particular read woke the active renderer. Field semantics follow [Microsoft's kernel parser](https://github.com/microsoft/perfview/blob/main/src/TraceEvent/Parsers/KernelTraceEventParser.cs).

Historical host pressure was substantial, including a snapshot with about 589 MiB free RAM and a later development-test episode with only about 267 MiB WMI FreeVirtualMemory plus allocation failures/context loss. Those failures are real but do not retrospectively explain every production stall. Fresh endpoint snapshots retain OS-visible/free RAM, free virtual memory and pagefile usage. They are not synchronized to individual gaps and are not equivalent to process working-set residency. [Current host snapshots](phase522/run-manifest.json), [endpoint GPU/system memory](phase522/endpoint-memory-snapshot.json).

The initial GPU-counter/CIM failure was a sandbox access limitation; counters were readable outside it. An ad-hoc NVIDIA query during the menu sequence showed **407 MiB used of 4,096 MiB**, so there is no measured basis to assert that the headline stall exhausted 4 GB VRAM. That single snapshot also cannot exclude a transient residency/budget problem. No time-aligned WDDM allocation/budget trace exists for the headline gaps. No settings, drivers, caches, pagefile configuration or unrelated processes were changed.

Fresh asynchronous GPU samples:

- menu on1: 139 sampled GPU queries; p95 10.46 ms; maximum 11.03 ms; disjoint batches 0.
- menu on2: 138 sampled GPU queries; p95 10.36 ms; maximum 10.73 ms; disjoint batches 0.
- combat on1: 120 sampled GPU queries; p95 11.74 ms; maximum 19.97 ms; disjoint batches 0.
- combat on2: 120 sampled GPU queries; p95 15.02 ms; maximum 18.21 ms; disjoint batches 0.

These samples characterize ordinary submitted work, not the rare waiting interval, full residency history or physical display latency. Menu queries include a short diagnostic warm-up/extraction period; combat queries stop with capture. Low sampled GPU times cannot rule out a driver fence, GPU scheduling delay or an unsampled long frame.

## Shader, asset, GC and application work

GL compile/link/upload/draw wrappers and resource timing were examined in old and fresh diagnostics. Existing warm-combat diagnostics did not identify a compile/link or newly requested asset matching the largest wait. Resource timing says when a transfer occurred, not when every decode/upload completed. Cached driver shader data can still fault independently of a new JavaScript compileShader call.

Earlier main-thread MinorGC reached **76.494 ms wall / 7.859 ms CPU**; MajorGC reached **17.804 / 9.894 ms**. Large worker-GC spans are not main-thread pauses. Fresh per-run GC and animation callback spans, CPU samples and overlapping gap events are retained in the trace summaries linked by the evidence JSON. Nested spans must not be summed. No measured GC span establishes the historical 1,820.5 ms cause.

Source inspection confirms desktop render submissions target 30 Hz while AI, input, physics and other R3F subscribers continue at their original cadence. The menu uses demand invalidation and caches sun shadows after four frames. Existing older component/physics timers and shadow profiles identify ordinary workload costs, not the owner of a later clean severe wait. The observer build's source maps contain **zero mappings**, limiting reliable attribution of minified CPU samples to React, AI, animation, physics and particle callbacks. No new React profiling build or per-subsystem transform was introduced. Accordingly no expensive React commit, particle burst, AI operation or physics step is claimed as the exact cause.

One exact diagnostic artifact is established: an earlier **CpuProfiler::StartProfiling** took **109.115 ms** within a roughly 132 ms menu spike. Earlier PerformanceObserver serialization also created long tasks. New measurements omit those observers, start profiling before the window, settle for five seconds, and keep profiling-disabled controls. Severe unprofiled production/control gaps show that profiling artifacts are **not the sole problem**.

## Newly traced events

Combat profiling ON1 captured **241.0 ms between rendered frames** and a **222.0 ms rAF gap** ending at browser timestamp 35,548.3 ms (renderer PID 29276, main TID 31032). The corresponding window includes keydown EventDispatch **23.929 ms wall / 1.762 ms CPU**, UpdateLayoutTree **16.827 / 0.318 ms**, and an animation callback **13.545 / 13.228 ms**. These events do not account for the entire gap. The run's longest renderer submission was **31.6 ms**; individual wrapped GL calls stayed below 1 ms. There is no matching major-GC span explaining the large gap. Its waiting/scheduling owner remains **unknown**; no simultaneous kernel trace was made.

A separate **62.4 ms rAF gap** ending at timestamp 88,723.7 ms overlaps approximately **53.558 ms of main-thread MajorGC finalization**. The full GC span is **57.759 ms wall / 7.617 ms CPU**. Its nested V8.GC_MC_CLEAR_JOIN_JOB spans **52.673 / 2.872 ms**. Thus main-thread GC finalization occupies most of this smaller gap, while the reason for the long GC job-join wall time remains unresolved. Nested times must not be added. A preceding separate 55.5 ms gap overlaps a 55.732 ms animation callback with 14.240 ms CPU, also requiring wait/scheduling evidence. These smaller events must not be presented as the cause of the historical 1.8-second stall.

This run also measured **374.310 ms wall / 340.826 ms CPU** for CpuProfiler::StartProfiling. The user-timing start marker occurs more than five seconds later, so startup is explicitly excluded from the measured FPS and gap statistics. [Timestamped event attribution](phase522-bottleneck-evidence.json), [trace summary](phase522/phase521-final-on1-summary.json).

## Fresh profiling comparison

Same existing packaged build, fresh Chrome contexts, actual NVIDIA ANGLE renderer, actual **1920×1080 WebGL drawing buffers**, DPR 1, AC connected/Battery Saver off at both endpoints. No resolution or graphics changes. Each scene follows OFF1 → ON1 → ON2 → OFF2, with 60-second windows after world readiness/warm-up and five-second settling. Combat uses ordinary keyboard movement, attack and guard. Headless rendering does not certify physical-display presentation or thermal endurance.

These are **render-start intervals**, not high-frequency browser rAF rates. The original capped production baseline remains combat 29.23–30.00 FPS with maxima 215.0 / 1,820.5 / 43.2 ms, and Complex menu maxima 521.3 / 42.3 / 146.5 ms. There is no optimization before/after claim in this phase.

- **menu off1 (profiling OFF)**: VALID hardware/output/power checks; 29.87 FPS; mean 33.48 ms; p95 35.60 ms; p99 36.30 ms; maximum **305.50 ms**; >100 ms intervals 1. [Raw record](phase522/after-off1-results.json).
- **menu on1 (profiling ON)**: VALID hardware/output/power checks; 30.00 FPS; mean 33.33 ms; p95 35.20 ms; p99 36.00 ms; maximum **41.90 ms**; >100 ms intervals 0. [Raw record](phase522/after-on1-results.json).
- **menu on2 (profiling ON)**: VALID hardware/output/power checks; 30.00 FPS; mean 33.34 ms; p95 35.10 ms; p99 35.30 ms; maximum **42.70 ms**; >100 ms intervals 0. [Raw record](phase522/after-on2-results.json).
- **menu off2 (profiling OFF)**: VALID hardware/output/power checks; 30.00 FPS; mean 33.33 ms; p95 35.70 ms; p99 36.30 ms; maximum **63.60 ms**; >100 ms intervals 0. [Raw record](phase522/after-off2-results.json).
- **combat off1 (profiling OFF)**: VALID hardware/output/power checks; 30.00 FPS; mean 33.33 ms; p95 35.10 ms; p99 35.80 ms; maximum **48.90 ms**; >100 ms intervals 0. [Raw record](phase522/phase521-final-off1-performance.json).
- **combat on1 (profiling ON)**: VALID hardware/output/power checks; 29.87 FPS; mean 33.48 ms; p95 35.30 ms; p99 36.30 ms; maximum **241.00 ms**; >100 ms intervals 1. [Raw record](phase522/phase521-final-on1-performance.json).
- **combat on2 (profiling ON)**: VALID hardware/output/power checks; 29.98 FPS; mean 33.35 ms; p95 35.50 ms; p99 36.20 ms; maximum **69.50 ms**; >100 ms intervals 0. [Raw record](phase522/phase521-final-on2-performance.json).
- **combat off2 (profiling OFF)**: EXCLUDED; n/a FPS; mean n/a ms; p95 n/a ms; p99 n/a ms; maximum **n/a ms**; >100 ms intervals n/a. [Raw record](phase522/phase521-final-off2-performance.json).

**Seven measured windows passed GPU/output/endpoint-power checks. The eighth attempt, combat OFF2, was excluded before measurement because AC was disconnected.** No second fresh combat OFF window or complete balanced combat comparison is claimed. Tests stopped at that point; previous repeats are not substituted for this missing window.

The small sample and rare-event variability do not establish a profiling speedup, slowdown percentage or permanent cure. One ad-hoc telemetry query occurred around menu OFF1, with exact overlap unlogged; offline trace-summary processing occurred around menu OFF2. Those are observational controls with possible host contention, not isolated laboratory trials. Other user apps and the existing development server were preserved. All confounds, initial excluded sandbox failure, raw traces, interval arrays and endpoint power readings are retained in [diagnostic results](phase522-diagnostic-results.json).

## Preservation and stopping point

Phase-start source/config/asset/protected hashes checked: **159**; mismatches **0**. Protected reference checks: **47**, matches **47**. Original immutable checks: **4014**, failures **0**. Preservation: **PASS**. [Updated changes and hashes](phase522-changes-and-hashes.json). No new production build/lint or full gameplay acceptance pass is claimed; production files did not change and prior Phase 5.2 checks remain historical evidence.

**Recommendation:** keep Phase 5.2 approval conditional. The next targeted diagnostic should synchronize browser interval markers and renderer/GPU PIDs/TIDs with a bounded **WPR GPU/ReadyThread trace**, hard-fault backing files, disk latency and WDDM budget/residency events. Inspect the renderer's switch-out/ready/wakeup stack and GPU/driver dependency in WPA/GPUView. Run an otherwise identical clean control to quantify recording disturbance. First repair diagnostic source mapping or add narrow test-only spans where CPU identity is genuinely needed. Change production code only when this identifies an actionable owner. Do not reduce graphics or start Phase 5.3. Investigation stops here; exact headline causes remain unknown.
