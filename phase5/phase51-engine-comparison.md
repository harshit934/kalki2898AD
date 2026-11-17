# Phase 5.1 — Engine feasibility

11 November 2026. Decision study only; no engine installation, migration or replacement. Hardware and current measurements: [audit](phase51-hardware-audit.md).

## Continue Three.js / React Three Fiber

**Graphics potential:** a focused realistic mission is technically plausible with disciplined art direction, PBR materials, authored normal/roughness detail, baked lighting/light probes, controlled shadowing, reflection assets, LOD and selective postprocessing. These are proposed capabilities, not quality already achieved. The existing WebGL renderer is not an Unreal-style integrated GI, virtualized geometry, terrain streaming, cinematic-authoring and asset-production suite. Achieving comparable selected shots requires custom pipeline work and art; engine choice cannot supply missing production assets.

**Hardware/performance:** small web builds and incremental Vite development fit this machine better than a large native editor. The current M1 sample on integrated graphics averages ~49 FPS with spikes; it does not establish a realistic mission at 60 FPS. GTX 1650 has only 4 GiB VRAM and system RAM is 8 GiB. Plan a stable 30 FPS visual tier first and a separate 60 FPS performance tier, subject to measured acceptance. Avoid a WebGPU rewrite during this phase.

**Development cost:** preserve React HUD, Zustand state, Rapier controller, saves, progression, missions, audio and cinematics. Lowest immediate regression exposure. Costs remain substantial for environment art, animation cleanup, material authoring, asset validation, compression, tier controls and profiling. Three.js uses the MIT license; asset licenses remain independent. No vendor quote, staffing rate or reliable completion date has been established.

**Asset compatibility:** current glTF/GLB skeletons, materials and clips already run. GLTFLoader supports optional decoders/transcoders, but compressed assets require explicit pipeline setup; no automatic speedup is assumed. See [official GLTFLoader documentation](https://threejs.org/docs/pages/GLTFLoader.html). Keep protected originals immutable; any future derivative requires separately reviewed authorization.

## Unreal Engine 5

**Graphics potential:** stronger integrated production tools for lighting, cinematic authoring, animation/retargeting, terrain and content scalability. This could reduce bespoke graphics-tool development on a suitably equipped workstation. It does not make existing art photorealistic or guarantee performance.

**Machine fit:** Epic currently recommends 32 GB RAM and at least 8 GB graphics RAM for development. Its current Lumen feature requirements list RTX 2000-series/RX 6000-series/Intel Arc or newer; the GTX 1650 is outside that list. Nanite/Virtual Shadow Maps separately require compatible DX12/SM6.6 atomics or Vulkan functionality; those capabilities were not tested here. Starting the editor is distinct from supporting these rendering features. This laptop is below the recommended memory configuration. Source: [Epic hardware and feature requirements](https://dev.epicgames.com/documentation/en-us/unreal-engine/hardware-and-software-specifications-for-unreal-engine), accessed 11 November 2026. No UE benchmark was run; no UE FPS estimate is defensible.

**Expected performance:** a carefully scaled native raster project may run, but a Lumen/Nanite-heavy AAA target on this machine is not an acceptable assumption. Shader compilation, editor residency, caches and content builds would compete for 8 GB system RAM and 56.9 GiB free storage. A conservative planning allowance of 150–250 GB free project/tool/cache space is an internal reserve proposal, not a measured installer requirement. UE installation and cache sizes depend on version, platforms and content.

**Migration complexity:** high. React DOM and Zustand do not transfer as playable Unreal systems; Rapier movement/camera collision must be reimplemented and tuned against Unreal physics. Mission IDs, reward idempotency, completion predicates and existing localStorage schema need a versioned export/import bridge. Camera tracks, pause ownership, simulation deadlines, contracts, chase handoff, audio, touch controls and browser navigation must be recreated and regression-tested. Existing cinematic videos/audio can be imported subject to format/licensing checks; runtime JS controllers cannot.

**Asset compatibility:** geometry/textures may transfer through supported import workflows, but verify glTF import, skeleton naming, scale, units, axes, root motion, morphs, material color spaces, transparency, weapon sockets and clip retargeting. Procedural CanvasTexture/DataTexture surfaces and JS-built architecture need baking or reauthoring. Groom 17's presence does not establish an Unreal groom-ready asset. Original protected files remain immutable. Asset provenance must travel with exports.

**Development cost:** migration adds gameplay reimplementation, engine learning, native packaging and full acceptance work before visual production gains can be judged. Planning estimate, not a quote: recreating current behavior could consume several person-months, with wide uncertainty; scope inventory and a permitted isolated port trial would be needed to refine it. A bounded current-engine slice is a materially smaller commitment. UE game licensing currently describes a standard 5% royalty on qualifying product revenue above the first $1 million, with exceptions/programs governed by its terms; review the actual agreement before commercial release. Source: [Epic licensing](https://www.unrealengine.com/license), accessed 11 November 2026.

## Recommendation

Continue the existing engine for one measured production-oriented mission after review. Use authored/baked lighting and tightly budgeted raster effects. Preserve the working gameplay contracts. Reconsider UE only if the browser delivery requirement changes, a suitable authoring workstation is available, the team can fund a full port and a separate comparison build proves a meaningful benefit. No migration is approved or initiated by this document.
