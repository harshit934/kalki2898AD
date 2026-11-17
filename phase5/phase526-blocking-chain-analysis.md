# Phase 5.2.6 — Blocking-chain analysis

**Decision E: source of the severe game-frame stalls remains inconclusive.** An identified GPU-process fence wait is stronger evidence than an unattributed queue delay; the renderer dependency and late-fence producer remain unproven.

## Historical 2,475.9ms chase stall

Game interval: UTC 2026-11-11 20:31:56.8318–20:31:59.3077. Headless Chrome renderer PID 29640 / main TID 30872: off CPU 2448.124ms, known blocked 2447.597ms, ready delay 0.523ms, no overlapping owned-browser hard faults. Repeated UserRequest waits alone do not name a browser operation.

Chrome GPU PID 17920 / CrGpuMain TID 20576 registered a CPU synchronization request at **20:31:55.8316967 UTC** on device `18446612158840905744`. Object `18446698512430305552`, fence value **15418**, async event handle **2604**. Matching UnwaitCpuWaiter at **20:31:59.3114253 UTC** names the same object/value, kernel event `18446698512542438240`, DxgSyncObject `18446698512016389104`: **3479.729ms** from registration to completion.

The device metadata maps to vendor 4098 / device 5688 (AMD when 4098/5688). GPU-main context switches separately show 501.213ms, 499.664ms, **2006.678ms**, and 465.141ms UserRequest off-CPU intervals during this registration's lifetime. Thus this is not merely a long-lived asynchronous registration: GPU-main was actually blocked for substantial periods. Other background worker idle waits are not treated as frame dependencies.

Historical owned AMD queue packets include 3506.576ms and 3479.856ms enqueue-to-start delays. Similar timing does not prove which packet/fence produced the renderer drought. The game render-call interval ends approximately 3.7ms before the matching fence completion in the retained epoch mappings. Prior clock uncertainty and CPU-side command enqueueing prevent using that near-coincidence as proof of a dependent frame or physical present.

**Established:** named Chrome GPU thread, exact fence registration/completion identity, real blocked intervals, AMD-associated device, no owned-browser hard-fault overlap with the game drought.

**Missing:** historical GPU-process Chrome task/function, renderer request/BeginFrame dependency, complete producer-signal chain across adapters, and the reason the signal arrived late. The historical Chrome capture recorded user timing, not the current GPU/viz/IPC categories. No function-level driver wait stack was collected. Therefore this does not justify A/B/C as a causal classification of the severe game stall.

## New longest completed interval: 58.7ms, Mission 1 combat round 2

Chrome GPU PID 3764 / CrGpuMain TID 29712; renderer 26532 / 31572. Browser task nesting identifies `Scheduler::RunTask` → `SkiaOutputSurfaceImplOnGpu::SwapBuffers` → `DXGISwapChainImageBacking::Present`. Present wall time **49.025ms**, measured thread duration **0.933ms**. It is a blocked/waiting presentation operation, not 49ms of JavaScript or GPU shader execution.

At **21:07:37.7620734 UTC**, GPU-main registered object `18446698512608587536`, fence **14108**, AMD device `18446612158696728608`. At **21:07:37.8099192 UTC**, UnwaitCpuWaiter reports the same object/value, event `18446698512451524832`, DxgSyncObject `18446698511999888640`. GPU-main switched out at 37.762079 and back at 37.809921; ReadyThread is marked ReadiedFromDPC. Device and fence rundown both identify AMD adapter `18446698511751421952`, LUID 67112.

This proves a smaller Chrome presentation-path synchronization wait. It does **not** establish that a cross-adapter dependency was late, that AMD hardware malfunctioned, or that it caused the older multi-second stalls. The page/Chrome-to-ETW mapping differs by up to 2.34ms; a conservative 4ms allowance is applied, so microsecond cross-source ordering is not claimed.

## NVIDIA, AMD, browser IPC and DWM

NVIDIA render adapter: PCI 10DE:1F9D / GTX 1650, LUID 72024. AMD display/composition adapter: PCI 1002:1638, LUID 67112. WebGL reports NVIDIA in every new window; browser GPU contexts on both adapters are expected on this topology. Hardware acceleration remained enabled. The Chrome flags amdSwitchable/optimus=false are not treated as proof of a single-adapter physical display path.

DWM PID 28176, scheduling/composition/present events and CPU samples were captured. Their activity is desktop-wide; internal Chrome window IDs are not HWND ownership evidence. Slow composition/presentation and a frame gap can overlap without a proven causal browser-surface chain. Raw synchronization handles are preserved as decimal strings or exact Python integers; process-local Chrome flow IDs are excluded from cross-process claims.

The historical multi-second event did not reproduce as a completed interval. **A 286.1ms censored trailing render-observation drought occurred in chase round 1 while rAF continued; its cause is unresolved.** It is retained separately from the 58.7ms completed-interval maximum and disqualifies an unqualified no-stalls conclusion. New normal periods contain ordinary BeginFrame/command-buffer/presentation work and short fence waits; detailed event counts, flow limitations, GPU-main waits and DWM spans are retained per window. GPU task wall time is distinguished from thread CPU. CPU/runnable delays, hard faults and queue intervals are separately recorded; a combined average is not used to explain a stall.

## Decoder validation and evidence files

Generic decoding of complex ObjectArray fields failed. `RawSync.cs` uses installed version-specific schemas (IDs 294/295/297/300), pointer size, checked array counts and exact payload-length validation. New pass: 379225 events, zero errors/loss. Historical pass: 347350 events, zero errors/loss. The original generic CSV remains unchanged; corrected arrays are in raw-sync.csv and historical-B-raw-sync.csv.

- `phase526-synchronized-traces/historical-blocking-evidence.json`: historical registration/completion and scheduling evidence.
- `phase526-synchronized-traces/system-supplement.json`: new exact handles, context/device/adapter mappings, DWM and clock checks.
- `phase526-synchronized-traces/session/*-browser-analysis.json`: named Chrome operations, marks, frame distributions and permitted global-flow examples.
- `phase526-synchronized-traces/session/parsed/`: kernel scheduling, ready threads, faults, GPU/DWM events, raw synchronization and loss counts.

## Optimization and acceptance decision

No production optimization is authorized by a proven severe-stall cause. Phase 5.2 remains conditional; no 1080p acceptance or stabilization claim. **One next action:** Before any production optimization, approve one controlled visible-versus-headless Chrome presentation comparison using the same build, scene, trace configuration and power state. Use the identified fence as the trigger. This separates a benchmark/presentation-path effect from a player-visible defect; it is recommended, not started.

## Boundary check

See `phase526-synchronized-traces/boundary-evidence.json`. No next main render exists inside the counted window; 286.1ms is a lower bound on an observation drought, not a measured completed GPU/display stall. Neither the rAF continuation nor the later handoff state establishes why rendering was unobserved. No production change was attempted.
