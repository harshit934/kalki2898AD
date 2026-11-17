# Phase 5.4A investigation report

12 Nov 2026 IST. **Investigation complete; exact severe-stall root cause remains unresolved. Stable 1920x1080/30 FPS is NOT established. No production changes or stabilization claim.**

Read the Phase 5.4 progress report and all seven audit deliverables; inspected accepted source/render configuration. Used the unchanged accepted Phase 5.3 immutable build. Completed12warm windows:3environment-menu +3M1combat windows without CPU/native profiling, repeated with profiling. Actual WebGL buffer and CSS1920x1080,DPRapproximately1,GTX1650 via ANGLE D3D11 asserted in each case. All 12measured; no page errors or missing responses, no hidden samples. Six traces report no lost data.

## Findings

- Control combat FPS29.93/29.11/17.27; p9539.3/42.8/73.9 ms; p9946.7/63.7/339.5 ms; maxima79.2/215.7/**3878.1 ms**. Last repeat has4gaps over 1s. This reproduces severe gameplay interruptions, not the exact original8249.3 ms renderer event.
- Profiled combat FPS29.64/28.40/29.57; p9539.4/40.3/42.2 ms; p9954.8/105.1/57.3 ms; maxima181.8/272.3/148.1 ms. No multi-second event in this cohort. This difference is not evidence of an improvement: no code changed, and profiling/cache/system workload perturb timing.
- A captured 181.8 ms gap overlaps164.771 ms minor GC with2.224 ms renderer-thread CPU. Captured 219.2 ms rendering occurs in 223.791 ms callback with18.219 ms CPU. Large wall-minus-CPU intervals establish waiting/descheduling within these scopes, not the specific kernel/driver/paging reason.
- Basic/depth program-info queries up to26.4 ms establish smaller first-use shader synchronization work. No captured native operation or GPU timer explains the historical8.25s event or new3.88s control event.
- High RAM pressure and system paging are measured. They are plausible contributors, not a proven complete blocking chain. GPU query maxima10.4–23.0 ms and global NVIDIA readings are limited samples, not proof all frames orGPU queues were fast. No new fetch events in the warm profiled windows.

## Deliverables

- [Reproduction results, every window and limitations](phase54a-reproduction-results.json)
- [CPU/GPU evidence](phase54a-cpu-gpu-profiling.md)
- [Rendering bottleneck analysis](phase54a-rendering-bottleneck-analysis.md)
- [Memory/loading analysis](phase54a-memory-loading-analysis.md)
- [Targeted proposal and expected benefit/risk bounds](phase54a-optimization-proposal.md)
- [Protected/source/config/public/report checks](phase54a-changes-and-hashes.json)
- [Raw profiles, traces, timings and instrumentation](phase54a-investigation-20261112/)

## Preservation and scope

Final47/47 protected,112/112 source,5/5configurations,52/52public assets,61/61earlier reports and7/7Phase 5.4audit reports match their recorded baselines. No assets, game saves, rollback evidence or production files edited/deleted. Temporary Chrome profiles are isolated from user saves. No new full campaign, physical-mobile, build or lint pass is claimed; source did not change and existing accepted functional evidence remains separate. Capture smoke shows actual attacks, enemy defeat/score updates and no player defeat, not full mission completion.

Owned browser/samplers stopped and port5364not listening; cleanup.json records free C:57,611,870,208 bytes (~53.65 GiB). Original traces, screenshots, reports and rollback files retained. No driver, OS service, registry, BIOS, quality or power setting changed.

## Handoff decision

Stop here for review, as requested. Keep performance acceptance open. Recommended next action is the single bounded owned-process wait/hard-fault capture described in the proposal before selecting a production repair. A small shader-warm-up follow-up may address measured first-use costs, but must not be presented as the fix for seconds-long stalls. No major modifications, Kashi redesign or Phase 5.5 started.

