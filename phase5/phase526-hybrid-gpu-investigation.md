# Phase 5.2.6 — Chrome and hybrid-GPU investigation

Date: 2026-11-11T21:30:04.413645+00:00. **Decision E: evidence remains inconclusive for the severe game-frame stalls. Phase 5.2 approval remains conditional.** No production optimization or Phase 5.3 work was performed.

## What changed in the evidence

The retained 2,475.9ms chase event now has an identified Chrome GPU-process fence wait: registration-to-matching-unwait **3,479.729ms**, GPU PID 17920, CrGpuMain TID 20576, AMD-associated device. The renderer was off CPU 2,448.124ms of the game gap, with zero overlapping owned-browser hard faults. This identifies a blocked GPU-process endpoint; it does not establish the renderer-to-fence dependency or the upstream reason the fence completed late.

Ten new visible-Chrome windows did not reproduce a completed inter-render interval above 100ms; the maximum completed interval was 58.7ms. **However, chase round 1 ends with 286.1ms without another observed main render call while rAF continues. This censored boundary interval is unresolved and is excluded from completed-interval percentiles, not hidden as a successful sample.** This is non-reproduction, not evidence of a repair. Phase 5.2.5 used headless Chrome; that presentation difference and observer differences prevent a causal before/after comparison.

## Controlled capture

Chrome 157.0.8103.40; same retained production diagnostic build; one visible browser/context/page; same scenario order repeated twice; 30 seconds per window. Actual drawing-buffer and CSS canvas dimensions were 1280×720 before/after every window, DPR 1, with ANGLE D3D11 NVIDIA GTX 1650 rendering. Shadows and graphics settings were unchanged. No window was hidden or unfocused during counted frames. No page errors, missing assets or lost WebGL contexts were recorded.

All timed counter samples reported AC online / Battery Saver off. Power scheme remained Balanced. No power-mode or charger intervention was made by this phase. This is the measured condition, irrespective of previous battery authorizations. Temporary menu/game pausing occurred only outside counted windows. Menu used The Complex preview; Mission 1 exploration/combat, Mission 2 combat and actual Bujji chase systems were exercised. Chase entry and Mission 2 prerequisites used existing diagnostic fixtures in disposable storage.

## Measured render cadence

Values below are **FPS / p50 / p95 / p99 / maximum**, with all frame-time values in milliseconds. Percentiles are nearest-rank on individual intervals; pooled results use raw intervals, not averages of percentiles. These are CPU-side render-call cadence measurements, not proof of physical scanout or GPU execution latency.

- **menu**, two windows: 30.000 FPS / 34.7 / 34.9 / 35.2 / **41.7**.
  - menu-1: 29.999 / 34.7 / 34.9 / 35.2 / **36.1**; 30.124s counted.
  - menu-2: 30.001 / 34.7 / 34.9 / 35.2 / **41.7**; 30.075s counted.
- **m1-exploration**, two windows: 30.002 FPS / 34.6 / 35.0 / 35.4 / **54.2**.
  - m1-exploration-1: 30.001 / 34.6 / 35.0 / 35.4 / **54.2**; 30.094s counted.
  - m1-exploration-2: 30.003 / 34.6 / 35.0 / 35.4 / **36.0**; 30.047s counted.
- **m1-combat**, two windows: 30.016 FPS / 34.6 / 35.2 / 36.1 / **58.7**.
  - m1-combat-1: 30.030 / 34.6 / 35.1 / 35.8 / **58.2**; 30.031s counted.
  - m1-combat-2: 30.002 / 34.6 / 35.2 / 36.3 / **58.7**; 30.039s counted.
- **m2-combat**, two windows: 29.988 FPS / 34.6 / 35.1 / 36.4 / **48.1**.
  - m2-combat-1: 29.980 / 34.6 / 35.1 / 37.2 / **48.1**; 30.093s counted.
  - m2-combat-2: 29.996 / 34.6 / 35.2 / 36.1 / **47.1**; 30.061s counted.
- **bujji-chase**, two windows: 30.002 FPS / 34.6 / 34.9 / 35.3 / **47.1**.
  - bujji-chase-1: 30.000 / 34.6 / 34.9 / 35.2 / **35.7**; 30.043s counted.
  - bujji-chase-2: 30.003 / 34.6 / 34.9 / 35.3 / **47.1**; 30.029s counted.

**Boundary audit:** chase round 1 has a censored 286.1ms trailing render-observation drought. There is no next render inside the capture, so its eventual duration and cause are unknown. The largest completed interval is 58.7ms; do not interpret that as the maximum possible display stall. Whole-window call rate for this sample is 29.724 calls/sec, compared with its 30.000 FPS completed-interval rate. The other leading/trailing boundary lengths are included in the JSON. The historical 2,475.9ms, 1,820.5ms and 521.3ms events remain visible in the report and are not replaced by the new averages.

## CPU, GPU, memory and queue evidence

GPU utilization is the busiest NVIDIA physical engine after summing processes on that same engine, capped at 100%; it is not the sum of unrelated engines. CPU utilization is whole-machine PDH usage. Queue delay is enqueue-to-DMA-start on positively owned classic AMD-context packets. It is not GTX 1650 render duration. Per-process browser/GPU/renderer memory and CPU, DWM CPU, sampled RAM/commit/paging/VRAM and all individual windows are retained in the JSON.

- menu-1: CPU mean 26.8%; NVIDIA busiest engine mean/max 19.9/33.2%; paired AMD queue p95/max 23.20/25.85ms; available RAM mean 790MiB; commit mean 20.76GiB; owned hard-fault completions 82; 23 counter samples; DWM CPU mean 0.63% of machine.
- m1-exploration-1: CPU mean 21.2%; NVIDIA busiest engine mean/max 19.7/30.1%; paired AMD queue p95/max 22.90/28.97ms; available RAM mean 761MiB; commit mean 20.51GiB; owned hard-fault completions 163; 22 counter samples; DWM CPU mean 0.57% of machine.
- m1-combat-1: CPU mean 26.8%; NVIDIA busiest engine mean/max 18.6/30.2%; paired AMD queue p95/max 11.31/76.98ms; available RAM mean 733MiB; commit mean 20.81GiB; owned hard-fault completions 71; 22 counter samples; DWM CPU mean 1.08% of machine.
- m2-combat-1: CPU mean 44.0%; NVIDIA busiest engine mean/max 27.0/32.9%; paired AMD queue p95/max 10.51/66.31ms; available RAM mean 1238MiB; commit mean 21.03GiB; owned hard-fault completions 161; 20 counter samples; DWM CPU mean 1.34% of machine.
- bujji-chase-1: CPU mean 25.6%; NVIDIA busiest engine mean/max 18.6/23.2%; paired AMD queue p95/max 12.49/21.79ms; available RAM mean 798MiB; commit mean 20.89GiB; owned hard-fault completions 115; 23 counter samples; DWM CPU mean 0.71% of machine.
- menu-2: CPU mean 24.6%; NVIDIA busiest engine mean/max 20.1/32.8%; paired AMD queue p95/max 21.41/26.36ms; available RAM mean 833MiB; commit mean 20.87GiB; owned hard-fault completions 23; 23 counter samples; DWM CPU mean 0.62% of machine.
- m1-exploration-2: CPU mean 19.7%; NVIDIA busiest engine mean/max 21.4/36.8%; paired AMD queue p95/max 23.13/29.27ms; available RAM mean 762MiB; commit mean 20.80GiB; owned hard-fault completions 5; 23 counter samples; DWM CPU mean 0.63% of machine.
- m1-combat-2: CPU mean 35.2%; NVIDIA busiest engine mean/max 17.0/30.1%; paired AMD queue p95/max 11.02/66.41ms; available RAM mean 771MiB; commit mean 20.91GiB; owned hard-fault completions 129; 21 counter samples; DWM CPU mean 1.40% of machine.
- m2-combat-2: CPU mean 32.8%; NVIDIA busiest engine mean/max 28.4/49.3%; paired AMD queue p95/max 10.78/72.90ms; available RAM mean 732MiB; commit mean 20.96GiB; owned hard-fault completions 141; 21 counter samples; DWM CPU mean 1.04% of machine.
- bujji-chase-2: CPU mean 30.2%; NVIDIA busiest engine mean/max 18.2/21.7%; paired AMD queue p95/max 12.05/49.27ms; available RAM mean 885MiB; commit mean 21.02GiB; owned hard-fault completions 13; 22 counter samples; DWM CPU mean 0.72% of machine.

ETW: **0 lost events**; 7,312,906 DxgKrnl events, 2,325,731 DWM events. All ten Chrome traces report dataLossOccurred=false; maximum observed buffer fill 75.3%. Raw synchronization decoding: 379,225 new events and 347,350 historical events, **zero decode errors and zero lost events** for both passes.

## Blocking-chain findings

See [the blocking-chain analysis](phase526-blocking-chain-analysis.md) for the named operation, exact fence IDs, thread switches and the unproven links. Hardware acceleration remained enabled. Both physical adapters had browser-owned contexts, while the WebGL renderer was NVIDIA. AMD display/composition participation alone is not a defect.

A new 58.7ms game gap overlaps Chrome GPU DXGISwapChainImageBacking::Present: 49.025ms wall time, 0.933ms thread CPU. A matching AMD fence registration/completion and GPU-main context switch establish a real presentation-path wait on this smaller event. They do not explain why the historical fence was late or prove cross-adapter synchronization caused that historical frame drought. Browser IPC flows are not promoted to a blocking chain without verified global identity and a dependent reply/wakeup.

## Measurement limitations

- Only two 30-second windows per scenario: approximately five minutes of counted gameplay/menu time, excluding setup and trace flush. Rare stalls can remain unreproduced.
- Visible Chrome differs from Phase 5.2.5 headless Chrome. These are not before/after optimization measurements; no fix was made.
- All ten windows had actual WebGL drawing buffers 1280x720, CSS canvas 1280x720, DPR 1 and NVIDIA renderer. This does not validate 1920x1080 performance or physical presentation/scanout cadence.
- Frame metrics are consecutive top-level Three.js render-call intervals, not GPU timestamps or displayed-frame counts. The nominal 30 FPS cap and approximately 144 Hz requestAnimationFrame stream are reported separately.
- Broad Chrome GPU/cc/viz/IPC/GC tracing and WPR/PDH have observer cost. No profiling-disabled matched run was performed in this phase; absence of a stall under profiling is not stabilization.
- Counters sampled at approximately 1.3-1.5 second cadence, not every frame; short utilization peaks may be missed. Counter process enumeration also adds work. Missing samples are not zero.
- Cross-source timestamp allowance is 4ms; Chrome/performance-origin mapping drifted by up to 2.34ms against ETW QPC. Durations within one clock are retained; sub-millisecond causal order across sources is not claimed.
- Raw synchronization arrays initially produced InvalidCastException in the generic decoder. A schema/version-specific raw-byte decoder validated every payload length with zero errors. Generic CSV payloads remain unchanged as evidence; raw-sync.csv is authoritative for these arrays.
- No stack capture, symbolized driver functions, kernel wait-object handle mapping to a named browser IPC reply, or complete Chrome task trace exists for the historical severe stall. ReadyThread waker PID/TID are often -1.
- GPU packet intervals are host ETW enqueue-to-DMA-start/completion spans, not GPU timestamp-query execution times. Classic paired packets here are AMD contexts; NVIDIA HAGS/unpaired queues are not silently assigned to AMD or treated as zero.
- Async CPU fence registration is not automatically a CPU block. The historical registration is supported separately by GPU-main context switches; the renderer dependency remains unproven.
- DWM events describe desktop-wide composition. Window IDs from Browser.getWindowForTarget are not HWNDs, and DWM surface ownership is not inferred from them.
- Mission 2 prerequisites and chase entry were set through the existing diagnostic observer in a disposable browser context. Counted windows use actual controls/game systems; these are not full mission completion or save-migration acceptance tests.
- Historical 1820.5ms combat and 521.3ms menu events do not have the new detailed Chrome capture; causes cannot be retroactively assigned from temporal similarity.

## Acceptance and next action

**Decision E. Do not approve Phase 5.2 as stabilized from this evidence.** No speculative graphics reduction, driver change, memory recommendation as a guaranteed fix, or production repair is supported. Successful 720p samples do not satisfy the 1080p acceptance target.

Before any production optimization, approve one controlled visible-versus-headless Chrome presentation comparison using the same build, scene, trace configuration and power state. Use the identified fence as the trigger. This separates a benchmark/presentation-path effect from a player-visible defect; it is recommended, not started.

## Preservation and evidence

**47/47 protected checks passed; 159/159 production/configuration reference checks passed.** Bhairava, Groom 17 and rollback references match. No production sources, assets, settings, saves, progression or Windows services were changed. Production saves were not used by the disposable test context. Build/lint were not rerun because this phase changed diagnostic scripts/reports only.

Raw ETL, Chrome traces, frame arrays, host/process snapshots, scripts, counter JSONL, schemas and decoded CSVs are in [phase526-synchronized-traces](phase526-synchronized-traces/). [Diagnostic JSON](phase526-diagnostic-results.json) contains every measured sample; [changes and hashes](phase526-changes-and-hashes.json) contains preservation checks and evidence hashes.

## Censored boundary evidence

[Boundary evidence](phase526-synchronized-traces/boundary-evidence.json) preserves Chrome activity in the final 286.1ms of chase round 1. rAF continued to within 2.1ms of capture end, so this is not established as a browser-main-thread freeze. It could reflect a render scheduling/state/instrumentation issue; no exact cause is claimed. The last sampled state remained chase; final state was read after trace flushing and cannot establish the precise in-window transition time. This boundary defect independently prevents a clean gameplay-stability acceptance claim.
