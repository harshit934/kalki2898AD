# Phase 5.2 — Kashi menu asset-quality upgrade

11 November 2026. **Actual 3D asset replacement and material/lighting work, not a UI or resolution-only change.** UI styling, protected characters and gameplay are preserved. These are authored game-original architectural studies, not a scan of Kashi or a claim of final AAA photorealism.

## Geometry and materials

The default Kashi menu's repeating cylinders, boxes and semicircle arches are replaced with an authored courtyard GLB: scalloped torana/archivolts, geometric jali screens, balcony balusters/corbels, carved cornices, turned/fluted columns, chhatri pavilions, stepped shikhara towers/amalaka crowns, stone paving/ghat steps, folded fabric and fewer detailed diya fixtures. The scene is asymmetrically composed rather than a repeated colonnade.

The new asset has **182,753 triangles**, **95,723 Blender source vertices**, nine material groups, authored world-scaled UVs and baked geometric AO. Exported attribute vertices are higher because normals, UVs and per-corner AO require splits. Six local ray tests per polygon bake occlusion into COLOR_0; every exported material primitive carries UVs and AO colors. Bevelled stone edges provide actual silhouette/highlight detail. Material batching and Draco compression produce a **2,531,824-byte GLB**. Editable Blender source, generator, statistics and hashes are in [evidence](phase52-menu-quality/).

Stone uses local 1K scanned color, OpenGL normal, roughness and AO maps. Brass, ceramic, patina and cloth retain differentiated material responses. Closed architecture uses front-face culling; cloth remains double-sided. The HDRI supplies environment reflections and a softly blurred sky backdrop. It is a Poly Haven Venice sunset lighting asset, **not a photograph of Kashi**. All visible courtyard architecture is real geometry. Source/license records: [credits](../public/environment/kashi/ASSET-CREDITS.txt), [Poly Haven CC0 license](https://polyhaven.com/license). Draco decoder files and their Apache license are local; runtime CDN loading is unnecessary.

## Lighting and depth

Warm directional sunlight and a restrained teal fill replace the flat heavy fill. A 1024² filtered PCF sun shadow is baked after initial contact-shadow passes, and a 512² contact shadow grounds the static menu character. Fine scanned AO and geometric vertex AO complement those shadows. Static shadow work is reused while only the camera moves. Distance fog, layered courtyards, towers and a local HDR environment add depth. This uses baked/local AO, not an unmeasured SSAO effect or ray tracing. The protected Bhairava model and its appearance system remain unchanged; no likeness/final-character-quality claim is made.

## Actual 1080p measurements

All cases use the verified GTX 1650, 1920×1080 viewport, device DPR 1 and a measured **1920×1080 drawing buffer**. Desktop DPR handling now respects display scaling up to a 2,073,600-pixel budget; portrait uses a lower DPR budget. Actual main-render submission intervals are measured after asset readiness and a 12-second warm-up, excluding offscreen contact-shadow renders. No screenshot is taken during the timed window. The menu requests 30 Hz, with rAF-aligned pacing instead of an independent interval timer.

Before: one 30-second sample; **30.30 FPS**, mean **33.00 ms**, p95 **46.40 ms**, p99 **47.70 ms**, max **52.70 ms**. Scene topology **414,786 triangles**, **115 sampled draws**.

Final: three 60-second samples each; scene topology **592,781 triangles**, **43 sampled draws**:

- Run 1: mean **33.33 ms / 30.00 FPS**, p95 **34.90 ms**, p99 **35.40 ms**, max **58.30 ms**; >100 ms frames **0**.
- Run 2: mean **33.39 ms / 29.95 FPS**, p95 **34.90 ms**, p99 **35.00 ms**, max **159.50 ms**; >100 ms frames **1**.
- Run 3: mean **33.33 ms / 30.00 FPS**, p95 **34.80 ms**, p99 **35.00 ms**, max **36.10 ms**; >100 ms frames **0**.

The higher geometry count reflects actual architectural detail; fewer draws reflect material batching. The before/after windows differ in duration, so their maxima are not a statistically controlled speedup claim. **The 159.5 ms final-menu outlier remains disclosed.** Real 1080p output does not itself certify realism: inspect the native-size images, geometric details, surface maps and AO/lighting, not only the buffer size. JS heap/renderer counts are in [results](phase52-menu-quality-results.json); they are not total RAM or VRAM measurements.

## Before and after evidence

![Before, actual 1920×1080](phase52-menu-quality/before-1080p-1.png)
![After, actual 1920×1080](phase52-menu-quality/after-1080p-final1.png)
![Environment without UI overlay](phase52-menu-quality/after-environment-1080p.png)
![Native-pixel architectural detail crop](phase52-menu-quality/after-detail-final2.png)

The UI-hidden view and native crop are separate screenshots of the real scene, not generated concept art or upscaled images. Original character limitations remain visible and preserved. Shambhala/Complex previews remain the earlier explicitly labeled studies; no new playable mission or location is claimed. Menu navigation, settings, all HUD modes, mission completion and chase regressions are recorded in [final regression results](phase52-stabilization/final-regression-results.json). Preservation checks are in [final hashes](phase52-final-changes-and-hashes.json).

No Phase 5.3 work was started. Review the assets and the separate [performance investigation](phase52-performance-stabilization-report.md); the remaining intermittent stalls are not claimed fixed.
