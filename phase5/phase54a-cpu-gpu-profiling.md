# Phase 5.4A CPU/GPU profiling evidence

12 Nov 2026 IST. Accepted production bundle unchanged. This is a diagnostic comparison, not a before/after optimization claim.

- control / desktop-menu-kashi-1: 30.0 FPS; p50 34.6, p95 35.5, p99 41.9, maximum **61.8 ms**; largest renderer call 33.0 ms; actual window 30163.1 ms.
- control / desktop-menu-shambhala-1: 30.0 FPS; p50 34.6, p95 37.4, p99 41.8, maximum **45.7 ms**; largest renderer call 15.9 ms; actual window 30163.2 ms.
- control / desktop-menu-complex-1: 30.0 FPS; p50 34.6, p95 35.2, p99 41.8, maximum **62.1 ms**; largest renderer call 17.0 ms; actual window 30126.4 ms.
- control / desktop-m1-combat-1: 29.9 FPS; p50 34.4, p95 39.3, p99 46.7, maximum **79.2 ms**; largest renderer call 66.4 ms; actual window 30031.7 ms.
- control / desktop-m1-combat-2: 29.1 FPS; p50 34.3, p95 42.8, p99 63.7, maximum **215.7 ms**; largest renderer call 42.2 ms; actual window 30093.0 ms.
- control / desktop-m1-combat-3: 17.3 FPS; p50 34.3, p95 73.9, p99 339.5, maximum **3878.1 ms**; largest renderer call 339.7 ms; actual window 30106.5 ms.
- profiled / desktop-menu-kashi-1: 30.0 FPS; p50 34.6, p95 35.6, p99 41.9, maximum **61.3 ms**; largest renderer call 36.5 ms; actual window 31825.2 ms.
- profiled / desktop-menu-shambhala-1: 30.0 FPS; p50 34.6, p95 35.5, p99 41.8, maximum **69.9 ms**; largest renderer call 25.5 ms; actual window 30112.7 ms.
- profiled / desktop-menu-complex-1: 29.9 FPS; p50 34.6, p95 35.3, p99 41.7, maximum **180.2 ms**; largest renderer call 83.1 ms; actual window 30356.7 ms.
- profiled / desktop-m1-combat-1: 29.6 FPS; p50 34.4, p95 39.4, p99 54.8, maximum **181.8 ms**; largest renderer call 73.1 ms; actual window 30903.0 ms.
- profiled / desktop-m1-combat-2: 28.4 FPS; p50 34.4, p95 40.3, p99 105.1, maximum **272.3 ms**; largest renderer call 219.2 ms; actual window 30091.1 ms.
- profiled / desktop-m1-combat-3: 29.6 FPS; p50 34.2, p95 42.2, p99 57.3, maximum **148.1 ms**; largest renderer call 65.7 ms; actual window 30151.5 ms.

## Correlated examples

Profiled combat1: gap181.8 ms at104020.8–104202.6 ms relative to browser origin. V8 MinorGC at104035.827 ms lasts164.771 ms wall /2.224 ms renderer-thread CPU. Its nested parallel-scavenge phase accounts for most wall time. This is a verified GC-pause contribution to this particular gap, not164 ms of CPU computation, an allocation-source identification, or an explanation of historical seconds-long stalls.

Profiled combat2: maximum gap272.3 ms at56000.6–56272.9 ms is largely between completed ~10 ms rAF callbacks; no single captured slow native call accounts for it. Later, the219.2 ms renderer call at57830.8 ms falls inside a223.791 ms FireAnimationFrame (18.219 ms thread CPU), within RunTask224.548 ms /18.897 ms CPU. A separate219.988 ms RunTask at57168.322 ms uses9.853 ms thread CPU. Large non-executing intervals dominate these callbacks. This does not distinguish hard faults, scheduler delay, synchronization or an uninstrumented native call.

Profiled combat3: maximum 148.1 ms overlaps RunTask146.613 ms /30.665 ms CPU. The nested application callback88.782 ms /2.598 ms CPU and layout29.094 ms /2.517 ms CPU again show substantial non-CPU elapsed time; their nested durations must not be summed.

Sampled non-disjoint GPU elapsed maxima: menus13.181/10.498/10.402 ms; combat17.360/12.546/22.954 ms,42–46 results/window. These are sparse elapsed intervals, not per-frame GPU busy time or a full queue/driver trace. They do not explain a multi-second event, which did not recur under profiling. All 6 Chrome traces explicitly report dataLossOccurred=false.

## Raw evidence

CPU profiles, gzipped Chrome JSON traces, native-call journals, frame/rAF/long-task journals, precise Windows memory/CPU/paging records and NVIDIA CSV are in [profiled](phase54a-investigation-20261112/profiled/) and [control](phase54a-investigation-20261112/control/). Per-gap correlations and CPU leaf samples are in each analysis.json. Timeline clocks use CDP NavigationStart and browser timeOrigin; Windows records include precise epoch milliseconds and QPC. CPU sample attribution is wall-weighted and cannot substitute for trace thread-CPU duration.

Instrumentation source: [capture.mjs](phase54a-investigation-20261112/capture.mjs); read-only sampler: [Telemetry.cs](phase54a-investigation-20261112/Telemetry.cs). No production code was rebuilt, instrumented or edited. These runtime wrappers exist only in temporary test profiles.

