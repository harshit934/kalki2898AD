# Phase 5.2.1 — final performance investigation

11 November 2026. **Approval: CONDITIONAL. Phase 5.3 has not started.** Valid final repeats: **12/12**. No passing target or permanent cure is claimed from an incomplete set.

## Native output and retained optimization

Balanced desktop gameplay now budgets 2,073,600 pixels and supports display scaling up to DPR 2 within that budget; the existing portrait and explicitly selected performance tier are preserved. The actual drawing buffer, CSS dimensions and DPR are measured separately. Desktop GPU submissions now target 30 Hz instead of the approximately 100 submissions/sec measured at native 1080p. All existing input, AI, physics, animation, camera and simulation frame subscribers continue at their original cadence. A positive-priority R3F subscriber only owns the final renderer call. No shadows, particles, materials, textures, character detail or resolution were reduced to inflate FPS. The new geometry is more detailed.

The submission budget reduces unnecessary render work for the requested 30-FPS target. **It is not called a causal cure for the intermittent waits.** Repeated final metrics below are required for acceptance. Raw rAF timing remains separate, so simulation stalls cannot be hidden behind averaged render FPS.

## Before — actual 1920×1080

Original Phase 5.2 assets, with a test-only numeric pixel-budget override from 720p to 1080p; all other gameplay source unchanged. Three 90-second warm combat and three 90-second warm Kashi runs. NVIDIA and both AC endpoints verified. No CPU/GC trace or PerformanceObserver runs in these counted windows.

Combat:
- Run 1: **103.86 FPS**, mean **9.63 ms**, p95 **14.40 ms**, p99 **18.40 ms**, maximum **81.00 ms**; >100 ms frames **0**.
- Run 2: **104.90 FPS**, mean **9.53 ms**, p95 **13.60 ms**, p99 **15.90 ms**, maximum **328.60 ms**; >100 ms frames **6**.
- Run 3: **103.03 FPS**, mean **9.71 ms**, p95 **14.10 ms**, p99 **16.80 ms**, maximum **270.60 ms**; >100 ms frames **4**.

Menu:
- Run 1: **30.00 FPS**, mean **33.33 ms**, p95 **35.00 ms**, p99 **35.60 ms**, maximum **36.70 ms**; >100 ms frames **0**.
- Run 2: **27.70 FPS**, mean **36.10 ms**, p95 **36.60 ms**, p99 **149.80 ms**, maximum **481.50 ms**; >100 ms frames **43**.
- Run 3: **29.95 FPS**, mean **33.39 ms**, p95 **35.00 ms**, p99 **35.60 ms**, maximum **215.10 ms**; >100 ms frames **1**.

## After — final source, actual 1920×1080 required

Three 90-second combat repeats and three 45-second repeats per menu environment, after a 12-second warm-up, are required. Windows reported AC offline during attempted final testing; those attempts are excluded. They are not replaced by previous-asset timings. Source/asset complexity and the deliberate target cadence differ from baseline, so FPS must not be advertised as a like-for-like speedup.

Combat:
- Run 1: **29.81 FPS**, mean **33.54 ms**, p95 **35.50 ms**, p99 **38.20 ms**, maximum **215.00 ms**; >100 ms frames **3**.
- Run 2: **29.23 FPS**, mean **34.21 ms**, p95 **35.60 ms**, p99 **42.50 ms**, maximum **1820.50 ms**; >100 ms frames **5**.
- Run 3: **30.00 FPS**, mean **33.33 ms**, p95 **35.50 ms**, p99 **38.50 ms**, maximum **43.20 ms**; >100 ms frames **0**.

kashi:
- Run 1: **30.00 FPS**, mean **33.33 ms**, p95 **35.00 ms**, p99 **35.30 ms**, maximum **41.90 ms**; >100 ms frames **0**.
- Run 2: **30.00 FPS**, mean **33.33 ms**, p95 **41.60 ms**, p99 **41.70 ms**, maximum **44.00 ms**; >100 ms frames **0**.
- Run 3: **29.99 FPS**, mean **33.34 ms**, p95 **35.00 ms**, p99 **41.50 ms**, maximum **55.40 ms**; >100 ms frames **0**.

shambhala:
- Run 1: **29.98 FPS**, mean **33.35 ms**, p95 **41.50 ms**, p99 **41.80 ms**, maximum **83.80 ms**; >100 ms frames **0**.
- Run 2: **30.00 FPS**, mean **33.34 ms**, p95 **41.60 ms**, p99 **41.80 ms**, maximum **48.50 ms**; >100 ms frames **0**.
- Run 3: **30.04 FPS**, mean **33.29 ms**, p95 **35.10 ms**, p99 **36.30 ms**, maximum **62.50 ms**; >100 ms frames **0**.

complex:
- Run 1: **29.67 FPS**, mean **33.70 ms**, p95 **35.20 ms**, p99 **41.70 ms**, maximum **521.30 ms**; >100 ms frames **1**.
- Run 2: **30.00 FPS**, mean **33.33 ms**, p95 **41.60 ms**, p99 **41.80 ms**, maximum **42.30 ms**; >100 ms frames **0**.
- Run 3: **29.94 FPS**, mean **33.40 ms**, p95 **41.60 ms**, p99 **41.70 ms**, maximum **146.50 ms**; >100 ms frames **1**.

Final maximum among valid records: **1820.50 ms**. Final no->100-ms requirement: **NOT ACCEPTED**. Every valid severe frame is counted. Incomplete power conditions are a limitation, not a performance pass.

## Separate profiling and Windows evidence

The approved 150-second administrator WPR recording succeeded. Microsoft's diagnostic-only TraceEvent parser decoded **9,345 hard faults across the owned Chrome processes** and **1,503,677 relevant context switches**, with **zero lost events**. These counts cover the entire capture, including startup; they are not all combat stalls. No system setting, cache, driver, power plan or unrelated application was changed. [Kernel correlation](phase521/kernel-correlation.json), [raw ETL](phase521/system-etw.etl). Parser field semantics follow [Microsoft's kernel parser](https://github.com/microsoft/perfview/blob/main/src/TraceEvent/Parsers/KernelTraceEventParser.cs).

At a **367.4 ms** renderer gap, the active CrRendererMain thread spent about **361.6 ms** off CPU in UserRequest waits. No matching main-thread hard fault was present. At another **358.6 ms** gap it spent about **348.2 ms** waiting, while Chrome GPU-main hard page faults overlapped the gap. Earlier smaller gaps overlap GPU-process reads of NVIDIA DXCache files. This establishes real residency/wait behavior and rules out describing all gap time as expensive AI, physics or shader execution. It does **not** prove the exact browser/driver wakeup dependency for every interval. The remaining UserRequest wait mechanism is unresolved.

A separate CPU/GC diagnostic captured a 1,976.432-ms animation callback with only 26.621 ms of thread CPU time. Main-thread GC in that perturbed trace peaked at 76.494 ms wall / 7.859 ms CPU. No warm-combat shader compile/link or new asset request explained the largest wait. Native draws peaked at 6.5 ms; texture sub-upload at 32 ms. Those instrumented maxima are diagnostic, not clean final FPS. Profiler startup and PerformanceObserver callbacks themselves produced large tasks, so all such trials are excluded from counted performance.

Separate pre-rebuild asynchronous GPU probes measured combat p95 **10.41 ms**, max **11.20 ms** (199 samples), and menu p95 **12.96 ms**, max **13.14 ms** (59 samples), with no disjoint batches. They show normal workload headroom on GTX 1650, not a final-asset guarantee or an explanation of an uncaptured rare spike. Final GPU/display-presentation/thermal certification is not claimed.

The host snapshot recorded about 589 MiB free physical RAM, 4,736 MiB pagefile usage and substantial memory compression. Later WMI FreeVirtualMemory fell to 273,964 KiB (about 267 MiB) while development-mode test runs suffered allocation failures and WebGL context loss. Those runs are failures, not passing production evidence. They are retained in the regression evidence folders. Test tooling contributed to host pressure: the owned development test server used about 1,311 MiB private memory, versus 143 MiB for the successful production-preview server. That is a measured reduction in test-server allocation, not proof that every game stall came from Vite. No unrelated application was terminated.

The workspace has 66 HTML files, including archived test builds. Vite's [documented default](https://v8.vite.dev/config/dep-optimization-options) crawls HTML for dependencies. The project now explicitly selects index.html and excludes artifact/archive folders from development watching; test caches are isolated. Full functional regressions run against packaged production previews to avoid the development optimizer's large allocation. The existing user development process was not killed; its retained heap was not claimed as cured. Host-memory numbers and these tooling changes cannot alone assign each frame's exact cause. Protected assets were not reduced or replaced on speculation.

## Verification and remaining acceptance

UI/navigation/audio/three HUD modes: **PASS**. Mission 1/2 keyboard and Mission 2 touch completion/save checks: **PASS**. Bujji duel/chase/hand-off/replay/save checks: **PASS**. These are fresh isolated test contexts; real user browser saves were never reset or opened. Portrait/touch is browser emulation, not physical mobile performance.

Production build and lint: **PASS**. Warnings remain visible in [lint log](phase521/lint.log) and [build log](phase521/build.log). Protected preservation: **PASS**, including 47 protected records, 4014 original immutable files and the entire previous Kashi environment asset set. [Changes/hashes](phase52-final-changes-and-hashes.json).

Full acceptance remains conditional until final counted repeats are complete under consistent verified power and the outstanding severe-wait mechanism is resolved or explicitly accepted. See the separate [visual regression report](phase52-visual-regression-report.md) for visual limits. No Phase 5.3 implementation has begun.
