# Phase 5.3 combat investigation

12 Nov 2026, 7:25:03 pm IST. **BLOCKED: exact historical cause unresolved; no source fix applied.** Stop under the user's explicit blocker rule.

## Historical event

The old third combat window recorded a 3381.1 ms render-to-render gap. Adjacent synchronous render calls were 5.2 and 4.5 ms; only one independent animation-frame stamp occurred in the gap. That excludes neither a game callback outside rendering nor a blocked/unscheduled browser thread. The old capture has no coincident CPU timeline, so assigning that event to physics, AI, shaders or memory would be guessing. Original evidence remains intact.

## Focused measurements

Three diagnostic windows instrumented all source useFrame/gameplay callbacks, Rapier World.step, renderer compile calls and selected native upload/query calls; Chrome CPU samples and timeline traces are retained. Non-minified observer build, actual GTX 1650 and 1280×720 buffer asserted.

- Combat 1: 30.0 FPS; p50 34.6, p95 35.2, p99 35.9, maximum 63.2 ms. Leading/trailing boundary 25.7/21.5 ms.
- Combat 2: 29.4 FPS; p50 34.6, p95 35.3, p99 36.4, maximum 277.9 ms. Leading/trailing boundary 17.8/22.5 ms.
- Combat 3: 30.0 FPS; p50 34.6, p95 35.3, p99 36.1, maximum 42.2 ms. Leading/trailing boundary 25.3/32.8 ms.

The largest new diagnostic gap was 277.9 ms. Its keydown callback occupied 250.0 ms wall time but only 2.6 ms of thread CPU (247.4 ms difference). The long GC span occupied 115.6 ms wall but 2.5 ms thread CPU. These are mostly non-executing/waiting intervals; they do not establish expensive input logic or GC computation as the bottleneck. Nesting spans must not be summed. No sampled player/AI/physics callback explains the historical multi-second delay. This does not rule those systems out for an unobserved historical event.

Ordinary minified source, no CPU/timeline/stage/GL-call profiling (passive frame timestamps remain):

- Combat 1: 30.0 FPS; p50 34.6, p95 35.2, p99 35.6, maximum 48.6 ms. Leading/trailing boundary 15.9/6.3 ms.
- Combat 2: 30.0 FPS; p50 34.6, p95 35.2, p99 35.5, maximum 37.1 ms. Leading/trailing boundary 5.7/7.8 ms.
- Combat 3: 30.0 FPS; p50 34.5, p95 35.2, p99 36.1, maximum 46.7 ms. Leading/trailing boundary 19.5/26.3 ms.

One replay of the historical alternating sequence, retaining its reloads, control policy, resolution and outside-window screenshots:

- m1-exploration-1: 29.7 FPS; p50 34.6, p95 35.3, p99 36.8, maximum 317.0 ms. Leading/trailing boundary 6.3/8.4 ms.
- m1-combat-1: 30.0 FPS; p50 34.6, p95 35.6, p99 39.8, maximum 69.3 ms. Leading/trailing boundary 21.9/21.6 ms.
- m1-exploration-2: 29.9 FPS; p50 34.6, p95 35.4, p99 39.3, maximum 102.5 ms. Leading/trailing boundary 4.9/13.4 ms.
- m1-combat-2: 30.0 FPS; p50 34.6, p95 35.6, p99 39.5, maximum 42.1 ms. Leading/trailing boundary 25.7/29.8 ms.
- m1-exploration-3: 30.0 FPS; p50 34.6, p95 35.2, p99 35.8, maximum 41.6 ms. Leading/trailing boundary 9.5/25.1 ms.
- m1-combat-3: 30.0 FPS; p50 34.6, p95 35.2, p99 36.0, maximum 41.7 ms. Leading/trailing boundary 453.9/18.6 ms — CPU/timeline profiling enabled.

Only the final combat window has CPU/timeline profiling; its leading boundary is retained separately, not folded into the interval maximum. Earlier exploration still showed a 317 ms hitch. The 3381.1 ms event did not reproduce. CPU sampling can change timing; the diagnostic/minified captures are not a pure identical-build profiler-only A/B. Historical background/thermal conditions are unknown. Current six-case sequence recorded AC online throughout its recorded power checks. No quality/resolution change.

## Decision and before/after

**No verified smallest safe code fix was found.** Production source is unchanged. There is no after-fix measurement: calling the new ~30 FPS runs an optimization success would be false. The intermittent historical stall remains an unresolved acceptance risk. No Windows/driver/registry/BIOS modification, memory-pressure workaround, cap change or asset replacement was attempted.

[Measurements and correlated spans](phase53-remediation-20261112/combat-measurements.json), [diagnostic analysis](phase53-remediation-20261112/diagnostic/analysis.json), [historical-sequence analysis](phase53-remediation-20261112/historic-sequence/analysis.json). Gzipped Chrome traces and CPU profiles sit alongside the raw frame files.

The safe next decision is user review of the documented residual risk. If attribution is still required, collect a short coincident OS scheduling/hard-fault/native-wait record only when a >1 s event is observed; do not restart broad platform diagnostics or change source based on the current evidence. No such extra capture or new phase is scheduled.
