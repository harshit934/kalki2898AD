# Phase 5.4 initial performance audit

12 Nov 2026, 11:05:33 pm IST. **Initial audit complete; desktop stability gate FAIL. No production optimization applied.** Phase 5.3 acceptance is preserved; this does not revoke its functional acceptance or certify Phase 5.4.

## Method and verified conditions

Accepted immutable Phase 5.3 validation build, visible Chrome 157.0.8103.51, actual GTX 1650 renderer asserted per window. Desktop WebGL/CSS 1920×1080, DPR approximately 1; portrait 430×932/DPR 1 on the same laptop with virtual-stick/action touches. Three 30-second combat repeats each; menu one window per location plus portrait Kashi. No lowered quality/resolution, CPU profiler or per-GL-call wrappers. Screenshots outside counted windows. Raw render/rAF/long-task timing, boundaries and CDP metrics retained. The first unmeasured scene-name harness failure is preserved separately.

## Menus

- desktop-menu-kashi-1: 30.0 FPS; p50 34.6, p95 39.6, p99 42.0, maximum **43.6 ms**. Max synchronous renderer call 13.5 ms. >100 ms: 0; >1 s: 0. Leading/trailing boundaries 1.9/21.1 ms.
- desktop-menu-shambhala-1: 30.0 FPS; p50 34.6, p95 35.9, p99 41.8, maximum **44.3 ms**. Max synchronous renderer call 8.3 ms. >100 ms: 0; >1 s: 0. Leading/trailing boundaries 10.0/3.1 ms.
- desktop-menu-complex-1: 30.0 FPS; p50 34.6, p95 36.8, p99 41.9, maximum **48.5 ms**. Max synchronous renderer call 5.7 ms. >100 ms: 0; >1 s: 0. Leading/trailing boundaries 24.3/10.8 ms.
- portrait-menu-kashi-1: 30.0 FPS; p50 34.6, p95 41.0, p99 42.3, maximum **50.3 ms**. Max synchronous renderer call 17.7 ms. >100 ms: 0; >1 s: 0. Leading/trailing boundaries 21.5/18.9 ms.

## Desktop 1080p combat

- desktop-m1-combat-1: 29.4 FPS; p50 34.2, p95 41.6, p99 63.9, maximum **177.0 ms**. Max synchronous renderer call 77.5 ms. >100 ms: 2; >1 s: 0. Leading/trailing boundaries 71.2/22.8 ms.
- desktop-m1-combat-2: 24.9 FPS; p50 34.3, p95 44.3, p99 94.0, maximum **1718.0 ms**. Max synchronous renderer call 112.4 ms. >100 ms: 7; >1 s: 3. Leading/trailing boundaries 8.5/12.8 ms.
- desktop-m1-combat-3: 11.4 FPS; p50 34.2, p95 46.5, p99 601.4, maximum **8249.3 ms**. Max synchronous renderer call 8237.6 ms. >100 ms: 10; >1 s: 2. Leading/trailing boundaries 7.8/13.0 ms.

## Portrait touch emulation — laptop GPU, not a phone result

- portrait-m1-combat-1: 73.3 FPS; p50 13.2, p95 18.3, p99 25.1, maximum **86.4 ms**. Max synchronous renderer call 82.0 ms. >100 ms: 0; >1 s: 0. Leading/trailing boundaries 3.3/10.9 ms.
- portrait-m1-combat-2: 53.6 FPS; p50 17.4, p95 28.7, p99 39.1, maximum **100.7 ms**. Max synchronous renderer call 90.5 ms. >100 ms: 1; >1 s: 0. Leading/trailing boundaries 6.6/14.9 ms.
- portrait-m1-combat-3: 55.1 FPS; p50 16.7, p95 27.8, p99 39.5, maximum **196.0 ms**. Max synchronous renderer call 81.0 ms. >100 ms: 1; >1 s: 0. Leading/trailing boundaries 4.2/15.6 ms.

## Largest stall: what is actually established

desktop-m1-combat-3 recorded an 8249.3 ms render-to-render gap. Its preceding renderer call lasted 8237.6 ms; an overlapping long task lasted about 8239 ms. This localizes most of that particular delay inside the synchronous renderer call. Another gap of about 7559.8 ms has only 1239.6 ms in its preceding renderer call; one cause must not be assigned to every gap. The exact native operation, GPU wait, shader event or OS fault is NOT identified by this capture. Ordinary command submission time is not GPU execution time.

These are fresh events on the accepted baseline, distinct from the historical 3381.1 ms event (still unattributed and not retroactively explained). No screenshot occurred inside these windows. Task/render/long-task overlap is not a complete CPU/GPU blocking chain.

## Source/context audit

- Desktop render submission intentionally capped at 30 Hz; simulation/input/useFrame subscribers remain at R3F cadence. Portrait width <900 is uncapped. More portrait FPS at fewer pixels on the laptop does not establish a better phone experience.
- Renderer uses R3F's installed sRGB/ACES defaults, PBR materials, a dynamic player-following 1024² directional shadow map, HDR environment and local lights. Menu shadows/contact shadows are deliberately cached. No full-screen post-processing AO/reflection stack was found in the inspected entry pipeline; stone AO maps are not SSAO.
- Combat effects allocate 8 or 14 individual icosahedron meshes/materials per effect and use game-clock callbacks. This is a candidate allocation/draw-cost hotspot, not a measured cause of an eight-second wait. Prior source-stage evidence found small ordinary AI/physics/animation callbacks; it does not rule out a new event.
- System snapshot at 2026-11-12T22:53:15.3638619+05:30: about **96.2 MiB available physical RAM** out of about 7.34 GiB visible RAM; AC online. The snapshot itself has observer overhead and is not aligned hard-fault evidence. Phase 5.2.4 established paging contribution to one different 323.5 ms event, not to these new stalls.
- Protected Bhairava asset: 26.12 MB, 409,614 unique triangles, 25 materials, 69-joint skin and seven clips. Rendered scene triangle counts include all scene/passes and differ from unique asset geometry. Texture counts are not VRAM byte measurements.

## Bottleneck status and next measurement

Confirmed: desktop pacing is not stable; one severe delay is inside rendering, another has a large outside-render portion; RAM headroom was very low; cold entry/first-use loading is an accepted limitation. **Unconfirmed:** precise shader/upload/driver call, current paging overlap, GPU saturation/VRAM exhaustion, physics/AI as a spike cause, a game memory leak.

Before optimizing, capture one timestamp-correlated new >1-second event with narrow renderer/native-call stages plus lightweight available-RAM/commit/hard-fault telemetry. Distinguish thread CPU from wall time and include a profiling-disabled control. Do not reopen broad driver changes or change graphics quality to conceal the event. No speculative particle batching, model LOD replacement or shadow reduction is justified yet.

[Full measurements](phase54-before-after-measurements.json), [gap evidence](phase54-audit-20261112/frame-gap-analysis.json), [machine context](phase54-audit-20261112/system-context.json), [source asset inventory](phase54-audit-20261112/asset-inventory.json).
