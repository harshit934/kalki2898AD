# Phase8.3 implementation

**CONDITIONAL PASS for representative implementation and offline validation. Visual/gameplay acceptance UNVERIFIED; browser testing BLOCKED.** 2026-11-16, Asia/Calcutta.

## Delivered

New isolated source `phase8/phase8.3/staging/`, compiled game `phase8/phase8.3/build/`, untouched205-file rollback. Implemented one detailed procedural Arc1 forecourt/passage extension, two inspectable environmental records, a lazy/fail-soft environment binding and25-record campaign location registry. Fifteen records document inherited prototype scene/arena bindings and nine remain planned; no new mission or full future world is counted as implemented.

Actual construction includes stepped stone paving/drainage, a bevelled pointed gateway and metal inlay, shrine/niche framing and tiered roof, screen lattice, sagged canopy, bench, wind-driven reed clumps and small utility inserts. PBR stone normal/roughness/albedo/AO uses existing files. Existing sun/fill/HDR/fog provides lighting; no extra dynamic lights or expensive weather/post effects. The65-effect registry is reused for discovery, not duplicated. Fixed geometry budgets are reported only for performance planning; no UE5/photorealistic or cinematic visual acceptance claim.

Exploration connects two side pockets to the existing street/hub within unchanged bounds. E/Interact/touch inspection is non-blocking, range/height/hold/pause checked and grants no rewards/unlocks. Existing world/characters, mission gameplay, controllers, cameras,19 prototype routes,100-mission definitions and saved progression are preserved. The extension is withheld from opt-in Kashi/legacy prototype modes and combat maps to avoid unreviewed layout collisions.

## Executed validation

**487 PASS;8 NOT APPLICABLE;0 FAIL across495 distinct checks.** This includes the8.2 regressions/per-mission Node fixtures,19 new world checks and one new actual collection-callback check for roaming with campaign playbackfalse. Every literal source import resolves, asset paths exist, location IDs/mission references/entry-exit links validate, planned loaders reject, and the production build includes the lazy WorldExtension chunk. Build PASS; lint PASS with12 inherited warnings/zero new warnings/errors. Existing large-chunk advisory remains.

Resource tests create actual CPU Three geometry/material/instance buffers, verify finite transforms and owned/borrowed texture identity, and replay20 disposal cycles. Incremental budgets:11 render objects,188/182 represented instances,3,320/3,308 triangles desktop/smaller; no new lights. These tests are not a browser/renderer GPU memory or frame-time measurement.

Real CPU Rapier character-controller fixtures traverse the eastern and western routes using the existing capsule/autostep/snap configuration, against the new collision set. They exclude the complete old world, real inputs/animations and camera collision. Full-world overlap/reachability remains unverified.

The only confirmed integration adjustment was the collection active guard: exploration can be active while campaign playback isfalse, so the old guard reset the collection. It now resets only when both are inactive. A callback test reproduces that state and confirms emission; pause/menu/resource cleanup tests pass. Discovery subscribes once to the same pool and detaches cleanly. No speculative optimization or repeated browser attempt.

## Browser/resource limit

Preflight: 749.37MiB available RAM/2708.85MiB commit headroom. Previous guarded rendering used about572MiB physical headroom; that would leave about178MiB now, below its previous192MiB safety stop. No arbitrary2GB gate. No browser/server/monitor launched. Actual material/lighting appearance, full-world/camera clipping, HUD overlap on desktop/mobile, shader initialization, natural walking/interaction and sustained frame pacing remain **UNVERIFIED**. No new screenshots or rendered quality proof are claimed.

Phase8.2 stays pending actual gameplay acceptance:0/10 fresh browser/full mission acceptance. Existing Phase7 cinematic interruptions,7.4 administrative completion without gameplay evidence and7.5 unverified runtime gains remain documented. No new audio, voice or commercial media clearance.

## Preservation incident

One command accidentally invoked the8.2 build launcher while targeting a log under8.3. It rebuilt earlier compiled output; it did not edit source. The immediate full8.2 snapshot comparison verified626/626 content hashes with zero added files, and final verification matches again. Compiled-file timestamps/cache may have changed; no content restoration/rollback overwrite was performed. Evidence: `prior-build-check.json` and `preflight-placeholder.log`. The actual8.3 build was then run correctly. This incident is disclosed rather than claiming the prior directory was never written.

## Changed files

- `phase8/phase8.3/staging/index.html`
- `phase8/phase8.3/staging/src/App.jsx`
- `phase8/phase8.3/staging/src/game/presentation/CollectionEffects.jsx`
- `phase8/phase8.3/staging/src/game/World.jsx`
- `phase8/phase8.3/staging/src/game/worldExpansion/EnvironmentBoundary.jsx`
- `phase8/phase8.3/staging/src/game/worldExpansion/environmentLoader.js`
- `phase8/phase8.3/staging/src/game/worldExpansion/locations.js`
- `phase8/phase8.3/staging/src/game/worldExpansion/passageLayout.js`
- `phase8/phase8.3/staging/src/game/worldExpansion/passageResources.js`
- `phase8/phase8.3/staging/src/game/worldExpansion/worldExpansion.css`
- `phase8/phase8.3/staging/src/game/worldExpansion/WorldExplorationHud.jsx`
- `phase8/phase8.3/staging/src/game/worldExpansion/WorldExtension.jsx`
- `phase8/phase8.3/staging/src/game/worldExpansion/worldInteraction.js`
- `phase8/phase8.3/staging/src/game/worldExpansion/worldState.js`

Other new files are isolated8.3 scripts, tests, build, rollback/manifests/evidence and the six requested deliverables. The two authorized overall trackers are updated with backups; no older report/map is overwritten.

## Integrity and launch

Protected47/47; production153/153; new rollback205/205; Phase7 5141/5141;8.1 559/559;8.2 626/626;12/12 earlier Phase8 report/map files match. Existing201/201 other staged files match. Personal save/profile data was not read, copied, hashed, launched or modified. Existing player/world/campaign/control/audio assets remain; the new texture clones borrow the existing images.

Only when resources safely permit, open PowerShell and run separately:

```powershell
Set-Location -LiteralPath 'C:\Users\Hp\Downloads\kalki 2898AD'
node .\phase8\phase8.3\serve.mjs
```

Use the printed loopback URL in a disposable profile, without Kashi opt-in query flags. New Game → Start Mission01 → complete/Skip opening → explore east through the gateway near(5.7,5.2), or west around the screen via(-5.2,12.6) toward the maintenance record(-5.2,2.5). The existing hub remains(3,-10). Physical added world/visual quality still needs that live review. No server is running. Stop after reporting; no production promotion or next milestone.
