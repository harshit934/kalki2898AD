# Phase 5.1 — Hardware and existing-project audit

Audit date: 11 November 2026, Asia/Kolkata. Scope: inspection, isolated baseline measurements and planning only. Phase 4 remains accepted with its documented limitations. No graphics implementation or engine migration.

## Actual machine

Evidence: [Windows inventory](evidence/hardware.json), captured with Win32 CIM classes, NVIDIA-SMI and powercfg. Initial sandbox CIM access was denied; an approved read-only inventory succeeded. No specifications were inferred from the Victus product name.

- CPU: AMD Ryzen 5 5600H with Radeon Graphics; 6 cores, 12 logical processors.
- Discrete GPU: NVIDIA GeForce GTX 1650, **4096 MiB dedicated VRAM** from NVIDIA-SMI. WMI reports 4,293,918,720 bytes; NVIDIA's device-specific query is used for capacity.
- Integrated GPU: AMD Radeon(TM) Graphics; WMI adapter allocation 512 MiB. This is not a separate large dedicated VRAM pool and does not describe its maximum shared-memory usage.
- Installed RAM: **8 GiB**, one reported 8,589,934,592-byte module, configured at 3200 MT/s. OS-visible memory 7.34 GiB. Free physical memory varied from 349 MiB on the first probe to 953 MiB on the saved probe; these are workload snapshots, not capacity or leak measurements.
- Storage: C: total **475.8 GiB**, available **56.9 GiB** at the saved probe (61,079,879,680 bytes). No other fixed logical volume was returned. Physical SSD model, speed and endurance were not measured.
- Active display mode: **1920 × 1080 at 144 Hz**, reported on the AMD-connected display path. This is the active mode, not an EDID certification of every supported panel mode. The NVIDIA controller has no active display mode in WMI.
- NVIDIA driver: **592.82**, WMI 32.0.15.9282, driver date 3 June 2026. AMD driver: 31.0.21914.5002, date 12 July 2024. No driver was installed or changed.
- Windows: **Windows 11 Home Single Language**, version **10.0.26300**, build **26300**.
- Power plan: Balanced. NVIDIA temperature at saved inventory: 65°C. AC connection, sustained clocks and thermal throttling were not established.

## Current architecture

Installed versions verified from node_modules, matching the declared baseline: React 19.3.1, Vite 8.3.5, Three.js 0.187.0, React Three Fiber 9.8.2, Drei 10.7.9, React Three Rapier 2.2.0, Zustand 5.0.16. No dependency changes.

### Renderer and lighting

`src/App.jsx` lazily mounts `GameCanvas` behind Suspense. `src/game/GameCanvas.jsx` uses the default R3F WebGL renderer, antialiasing, high-performance power preference, DPR range 0.25–1.5, perspective camera (near 0.1, far 180), continuous frames during play and no render loop during pause. Installed R3F defaults and runtime inspection confirm sRGB output and ACES filmic tone mapping (enum 4), exposure 1. It is a forward raster pipeline; no postprocessing composer, temporal upscaler, ray-traced GI or production reflection pipeline was found in the inspected game source.

Lighting comprises hemisphere fill, two directional sources and a point source, plus mission-local pools. `PlayerSunlight.jsx` follows the player with texel-snapped movement and a 1024² shadow map over a 48-unit orthographic width, with bias/normal bias. `shadows="percentage"` resolves to PCF shadow enum 1. `CrystalLighting.jsx` retains four nearest lights, refreshed every 0.12 s; `TierCityLighting.jsx` retains four at 0.1 s. These are per-system pools, not a global limit of four lights. Fog is distance-based; ember/dust effects and emissive fixtures exist. Baked GI, environment reflection capture and shadow cascades are not established.

### Characters, materials and animation

[Parsed GLB inventory](evidence/asset-inventory.json) counts indexed triangles in mesh primitives; this is asset topology, not visible screen triangles or GPU memory.

- Active protected `public/models/bhairava-free-rig.glb`: 26,119,932 bytes; 409,614 triangles, 24 primitives, 25 material definitions, 27 images, 69 joints, seven clips. No compression extension declared.
- `soldier-source.glb`: 2,160,468 bytes; 11,376 triangles, two primitives, two images; Idle/Run/TPose/Walk clips.
- `human-base-candidate.glb`: 6,975,256 bytes; 58,285 triangles and many clips. It is an inventory candidate, not evidence it is active gameplay content.

`RiggedBhairava.jsx` clones the skeleton, normalizes height, owns an AnimationMixer, crossfades locomotion, evaluates sword pose from combat timing, attaches the weapon to WeaponR and applies facial/recoil responses. `characterAnimation.js` removes horizontal root displacement so the gameplay controller remains authoritative. `bhairavaAppearance.js` clones/restores owned materials and adds procedural wear/detail; `characterSurfaces.js` creates 256² relief maps. These are useful PBR foundations, not evidence of scan-quality skin, hair or clothing. `RiggedEnemy.jsx` separately clones skeleton/materials and drives locomotion; other enemies and bosses use procedural meshes. No general character LOD system was found. Embedded image count alone cannot establish decoded texture residency.

### World, physics, assets and cinematics

`World.jsx` builds mission environments from reusable primitives, ruins, rocks, tier-city structures and a 200 × 200 ground plane. Debris uses 220 instances; other atmospheric elements are also instanced. Tier surfaces use generated textures. This is authored prototype geometry rather than a streamed production terrain/landscape pipeline; a general terrain LOD or occlusion-streaming system was not found.

Rapier runs gravity -9.81; the installed wrapper defaults to a 1/60-second physics step. Player movement uses a kinematic body and capsule, explicit character-controller movement and pending-target accumulation. World collision uses fixed cuboids; collision groups distinguish camera/gameplay queries. `cameraCollision.js` performs volume sweeps and `Player.jsx` rechecks smoothed camera clearance. Dense future dressing must remain separate from simple collision proxies.

GLBs load through cached `useGLTF`, Suspense and SkeletonUtils cloning. Character materials are cleaned up without disposing cached originals. Shader warm-up uses `compileAsync`; first-use effect materials remain mounted. Vite splits Three and physics and lazily loads the canvas/Kashi set. No active KTX2 texture-transcoding, meshopt/Draco production asset path, comprehensive streaming budget or device-tier graphics selector was found. Protected files must not be converted to add these in this phase.

Cinematics use a custom Zustand controller, camera position/quaternion/FOV tracks, actor mixers, dialogue/audio and pause ownership. Mission 2 has a separate duel/chase sequence with state handoff. Campaign IDs, reward ledgers, story progress, control preferences and browser saves are persistent contracts. Graphics work must preserve these and the existing simulation clock and presentation policy.

## Fresh measured baseline

Reproducible harness: [runtime-audit.mjs](evidence/runtime-audit.mjs). Raw evidence: [runtime-results.json](evidence/runtime-results.json). Chrome headless, fresh nonpersistent contexts, Vite development build, M1 ordinary start and skip, 8-second warm-up, 15 seconds idle, 2 seconds sprint input, one mouse click and 8 seconds settling. The mouse click does not prove an attack: the UI maps melee to J. No teleport, health change, unlock or mission-completion fixture. Portrait uses a desktop GPU with touch emulation and keyboard movement; it is not a touch playthrough.

Each case produced five completed ~5-second FrameMetrics windows (~25 measured seconds). All three selected **AMD Radeon integrated graphics through ANGLE D3D11**, not GTX 1650. DPR was 1. Reported means below are total frames / total sampled duration, not means of FPS values:

- 1920 × 1080: **48.58 FPS**, mean **20.58 ms**; per-window p95 **16.7–39.8 ms**, worst **80.5 ms**. 220–238 reported draw calls; 875,062–885,706 triangles. End-snapshot JS heap **145.5 MiB**.
- 1280 × 720: **49.74 FPS**, mean **20.10 ms**; per-window p95 **19.1–39.9 ms**, worst **173.7 ms**. 232–238 draw calls; 875,062–885,696 triangles. End-snapshot JS heap **147.7 MiB**.
- 520 × 900 portrait emulation: **50.29 FPS**, mean **19.88 ms**; per-window p95 **22.3–37.5 ms**, worst **89.5 ms**. 214–229 draw calls; 873,910–884,760 triangles. End-snapshot JS heap **139.2 MiB**.

All had 60 tracked textures; portrait snapshot had 153 geometries and 22 programs. JS heap is not browser process RSS, WASM/native allocation, total system RAM or VRAM. Renderer counters are sampled last-render values and may reflect shadow/transmission passes; they are not unique scene topology. GPU timings in raw JSON sample only instrumented render calls, not the full frame. Per-window percentiles cannot be combined into a valid run-wide p95.

Start-click-to-idle-cinematic timings were 16.9 s / 13.9 s / 12.1 s, including script waits, shader/asset startup and skip handling. They are not network cold-load benchmarks. Local GLB transfer is not WAN performance. Fresh contexts do not flush the OS disk cache.

No recorded page errors or failed requests in these completed runs. Deprecation warnings for Three.Clock and Rapier initialization remain. The first sandbox attempt failed localhost access; its evidence is retained separately and is not counted. A production compilation and lint completed successfully; [build log](evidence/build.log) retains the large-chunk warning. Physics JS is ~2.24 MB uncompressed, Three ~748 KB; build excludes copying public media. Build/lint success is not full mission regression certification.

### Observed bottlenecks and limits

1. **Adapter selection:** browser power preference did not select the discrete GPU. Desktop GTX performance cannot be inferred from AMD results. A separate launch below explicitly requested and verified NVIDIA selection.
2. **Memory pressure:** 8 GiB RAM leaves little authoring/runtime headroom; paging can cause irregular stalls. Paging causality was not traced.
3. **Frame stability:** spikes and variable windows occur even in this short scene. Reducing resolution barely changed the pooled means; this suggests CPU/submission, scheduling or contention contributions, not proof of a single cause. A build ran during part of these tests, so contention is a confounder. No thermal or isolated A/B attribution is claimed.
4. **Rendering cost:** the protected hero alone has high topology/material complexity; skinned shadow passes, cloned enemies, local lights and physical transmission deserve controlled profiling. Do not resolve this by editing protected assets.
5. **Delivery:** large physics/renderer chunks and ~26 MB hero transfer increase startup cost. Compression/decode memory and first-use compilation require production measurements.

## Compatibility and visual evidence

### Separate verified GTX 1650 check

[Raw NVIDIA run](evidence/runtime-high-gpu-results.json) uses `KALKI_AUDIT_HIGH=1` with the same harness, 1280 × 720/DPR 1 and Chrome `--force-high-performance-gpu`. ANGLE actually reported **NVIDIA GeForce GTX 1650, D3D11**. This is a process-local launch option, not a persistent Windows setting change. Five ~5-second windows recorded **81.93 FPS** overall (2,052 frames /25.0471 seconds), mean **12.21 ms**, window p95 **16.2–23.6 ms**, and worst **431.5 ms**. Several windows miss the proposed 16.7 ms p95 target despite mean FPS exceeding 60. No page errors or failed requests; the same deprecation warnings remain. Textures: 60; 234–238 reported calls; 875,062–885,726 triangles. Heap ~143.9 MiB at the end, not total resident memory. GPU sampled render means ~2.9–4.6 ms do not include the complete simulation/compositor frame.

The fixed warm-up yielded zero complete telemetry windows in this run and the hero transfer alone took ~7.5 seconds locally. Consequently loading/compilation can contaminate the first retained window; the 431.5 ms spike remains disclosed and is not silently removed. This test is a short development-mode baseline, not a sustained 60 FPS pass or evidence of realistic production-scene performance. NVIDIA/AMD runs were not randomized or workload-controlled, so do not calculate an adapter speedup from them.

Desktop keyboard/gameplay/pause/saves have Phase 4 acceptance evidence; Phase 5.1 only adds this limited M1 runtime sample. Mobile controls use pointer events and configurable visibility; responsive UI exists. The current DPR cap still permits 2.25 times CSS pixel count on high-DPR devices. Physical Android/iOS GPU, browser memory eviction, Safari audio and thermal stability remain untested. No mobile FPS certification.

![Current M1 desktop baseline, AMD GPU, 1920 × 1080](evidence/desktop-1080.png)

Visual inspection: recognizable rigged actors, strong emissive markers, simple geometric ground/ruins and dark foreground shading. This screenshot does not meet a claim of production realism. It is current gameplay evidence, not the proposed visual target.

![Current portrait viewport on the same laptop GPU](evidence/portrait-emulated.png)

Preservation evidence is finalized in [preservation-results.json](evidence/preservation-results.json). All authored outputs are confined to phase5; original source, missions, public assets, protected Bhairava, Groom 17, archives and rollback files remain unchanged.
