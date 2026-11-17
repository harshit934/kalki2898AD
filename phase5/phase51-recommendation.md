# Phase 5.1 — Recommendation and review gate

11 November 2026. **Continue Three.js / React Three Fiber for a bounded Mission 2 graphics-and-gameplay slice, subject to review. Do not migrate to UE5 on this machine now.** Phase 5.1 is an audit, not approval to begin Phase 5.2.

## Why

The actual machine is a Ryzen 5 5600H, GTX 1650 **4 GiB**, **8 GiB RAM**, with **56.9 GiB free storage**, and a 1080p/144 Hz active display. The CPU is usable for the current development workflow; system memory, GPU memory and remaining storage constrain an AAA-scale authoring ambition. The default browser selected AMD integrated graphics despite the app's high-performance preference. A separate process-local launch with `--force-high-performance-gpu` selected and verified the GTX 1650; no Windows settings changed.

The fresh M1 development-mode baseline measured ~48.6 FPS at 1080p, ~49.7 FPS at 720p and ~50.3 FPS at emulated 520 × 900 on AMD, with frame spikes up to 173.7 ms. Short mean FPS is not stable gameplay certification. No realistic production assets were introduced and no UE performance was measured.

The [separate verified NVIDIA 720p sample](evidence/runtime-high-gpu-results.json) averaged **81.93 FPS**, but its per-window p95 ranged from 16.2 to 23.6 ms and its worst frame was 431.5 ms. Fixed warm-up did not establish full steady-state readiness; loading can contaminate the first window. It therefore does not pass the proposed stable-60 gate. It does demonstrate that the discrete adapter can be selected for further controlled testing. Preserve both adapters' evidence rather than combining them.

UE offers an integrated high-end production toolset, but current Epic guidance exceeds this machine's memory configuration and its listed Lumen GPUs exclude this GTX. Migration would also reimplement the accepted mission, physics, UI, save and cinematic behavior. Art production remains necessary under either engine. Full AAA photorealism across large worlds at 60 FPS on this laptop is not established by any evidence in this phase.

## Proposed next-phase priorities, only after review

1. Establish a controlled packaged-build baseline and verify the active GPU. Resolve available-memory headroom before comparing visual changes. No user system settings were changed by this audit.
2. Select existing M2 as the slice, retain its complete playable objective route and accepted duel/chase, and improve permitted environment/supporting-character art alongside regression-tested gameplay.
3. Start with raster PBR, authored indirect light/reflections, one controlled shadowed sun, bounded local lights, LOD/instancing and capped effects. Do not start by adding expensive postprocessing to an unprofiled scene.
4. Target stable **720p/30** desktop first; validate **720p/60** separately. Keep 1080p as an experiment until sustained measurements pass. Mobile has an independent provisional **30 FPS** target requiring physical devices and a permitted character-detail strategy.
5. Treat a RAM upgrade as the first hardware option to investigate: 16 GB for more breathing room in the current workflow; 32 GB if future native-editor work is intended. Verify exact HP product/service information, slot configuration and supported modules before purchase; upgrade compatibility was not audited. A future UE workstation should meet the chosen engine's requirements, with ≥8 GB graphics RAM and sufficient measured SSD/cache space. No purchase or upgrade is required/authorized by this report.

## Risks and unresolved evidence

- **Protected-asset constraint:** the runtime Bhairava is ~410k triangles with 24 primitives. Its cost cannot be addressed by overwriting/decimating the protected model. Groom 17, production rollback and all existing source/assets remain intact. Mobile's proposed triangle cap is lower than this hero alone; a separately authorized derivative approach is a review dependency.
- **Measurement scope:** this is a short M1 development/headless sample, not a production M2 mission or thermal benchmark. A concurrent build contaminated part of the comparison; no pure GPU scaling claim. FrameMetrics omits >1-second deltas and reports window p95 values, so full-frame traces are needed for acceptance. JS heap is only one memory component.
- **Mobile:** portrait emulation on laptop AMD graphics proves viewport rendering only; no Android/iPhone or sustained thermal/memory test. Existing Phase 4 mobile limitations remain disclosed.
- **Visual quality:** current screenshots show prototype scenery and uneven dark foreground lighting. Cinematic-quality realism has not been demonstrated. Detailed materials/models and animation work need artistic review, not only counters.
- **Delivery/content:** large physics JS and hero assets, no general texture-transcoding/LOD pipeline, and 8 GB shared system capacity create startup and stutter risks. Existing source includes deprecation warnings. No unrelated fix was attempted.
- **Regression:** prior Phase 4 acceptance remains the gameplay evidence. Its two disclosed legacy-test failures remain documented there. Phase 5.1 build/lint success and preservation hashes do not recertify every mission.

## Deliverables and evidence

- [Hardware and architecture audit](phase51-hardware-audit.md): actual inventory, source inspection, current baseline and screenshots.
- [Engine comparison](phase51-engine-comparison.md): graphics potential, machine fit, development cost, migration/asset compatibility and primary sources.
- [Graphics benchmark plan](phase51-graphics-benchmark-plan.md): paired gameplay/art milestones, measurement protocol, desktop/mobile budgets and acceptance criteria.
- This recommendation: decision, constraints and stop point.

Raw Windows inventory, GLB inventory, reproducible runtime harness/results, screenshots, production build log and preservation manifest are in [evidence](evidence/). Test contexts used fresh in-memory browser profiles; user saves were not opened or reset. No engine migration, dependency change, production asset replacement or mission/system deletion occurred.

Final verification: production compilation **PASS** (655 modules; large-chunk warning retained), lint **PASS**. Preservation **PASS**: all **4,105** baseline source/public/phase3/phase4/archive/config files unchanged, none missing; **47** prior recorded protected/non-source checks match Phase 4 hashes. Exact paths, hashes and scope: [preservation-results.json](evidence/preservation-results.json). The Phase 5 scripts and reports are new audit outputs, not product changes.

## Required review before Phase 5.2

Review the engine decision, M2 slice scope, stable-30-first targets, mobile limitations and protected-asset derivative question. Approve or revise that scope in a subsequent instruction. **Stop here: no Phase 5.2 implementation is authorized or started.**
