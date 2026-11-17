# Phase 5.4E — focused visual correction report

Date: 2026-11-13T21:40:10.220372+00:00

## Decision

**REJECT for production integration and final visual/performance acceptance.** The isolated correction is implemented and its focused validation is finished, but it does not yet meet the supplied cinematic reference. Successful gameplay tests do not override visible art limitations or unresolved frame gaps. Keep the original production environment as default. Do not begin Phase 5.4F.

The corrected environment remains available with `?environment54e=1`. The rejected first E city remains available with `?environment54e=1&cityVersion=first`. Existing C prototypes and rollback evidence are retained. No automatic integration, deletion or cleanup of project assets occurred.

## Reviewable evidence

- [Offline visual comparison gallery](phase54e-visual-correction-20261113/visual-review/index.html).
- [48-file screenshot/review ZIP](phase54e-visual-correction-20261113/phase54e-visual-correction-review.zip).
- [Final 13-view camera identity verification](phase54e-visual-correction-20261113/matched-final-latest/camera-identity-check.json): all view/projection matrix differences are zero, with 1920×1080 drawing buffers. Player positions and moving actors are separately recorded; animation/simulation time is not identical.
- [Final capture metadata](phase54e-visual-correction-20261113/matched-final-latest/results.json), [before capture metadata](phase54e-visual-correction-20261113/matched-final-v4/results.json).
- [Final production-bundle smoke results](phase54e-visual-correction-20261113/tests/production-bundle-smoke.json): default, corrected opt-in and first-prototype variants pass, with diagnostic globals absent.
- [Original raw artwork provenance](phase54e-visual-correction-20261113/rendered-card-provenance.json) and [latest Mission 1 / wide / Mission 10 update](phase54e-visual-correction-20261113/rendered-card-final-update.json). JPEGs were exported synchronously from actual WebGL scene renders, without HUD compositing or concept artwork.

The 13 strict comparisons are rejected first prototype versus corrected prototype: opening gameplay, forward street gameplay, diagnostic wide view and all ten arena environments. The wide view is a diagnostic overview, not the normal follow camera. Dormant arena screenshots demonstrate scenery only; separate ordinary-input fight tests support boss functionality. Additional final production-bundle menu, selection and gameplay captures show the production fallback alongside the opt-in variants. They are not claimed to be locked-camera pairs.

### Selected actual-game comparisons

Before street:
![Before street](phase54e-visual-correction-20261113/matched-final-v4/before-street-forward.png)

Corrected street:
![Corrected street](phase54e-visual-correction-20261113/matched-final-latest/after-street-forward.png)

Corrected wide view (diagnostic camera):
![Corrected wide view](phase54e-visual-correction-20261113/matched-final-latest/after-wide-city.png)

Final actual menu:
![Final opt-in menu](phase54e-visual-correction-20261113/tests/production-opt-in-menu.png)

Final actual mission selection:
![Final opt-in selection](phase54e-visual-correction-20261113/tests/production-opt-in-missions.png)

Actual boss combat, landscape emulation:
![Actual boss combat](phase54e-visual-correction-20261113/tests/ui-final-landscape-boss.png)

## Implemented corrections

1. Replaced the first opt-in city's building layout with an authored street/riverfront composition: varied footprints and heights, open recessed shop fronts, balconies, arches, service pipes, paving, curbs, drains, connected ghats and additional skyline layers. Shop openings are real geometric voids rather than dark panels over solid lower walls. Counter and vendor placement was corrected after screenshots exposed clipping.
2. Added visible transit decks, overhead cables, a moving elevated vehicle, a cargo cart, original Telugu/English advertising panels, water and a cargo barge. These are restrained ambient set pieces, not a transport or commerce simulation.
3. Reused two existing licensed MakeHuman-derived civilian models as 24 restrained vendor/customer/walking instances, with original Idle/Walk clips, clothing tints and limited head/arm gestures. Existing license and motion attribution remain in `public/environment/phase54c-revision/ASSET-CREDITS.md`. No movie recordings, footage, protected characters or new external models were used.
4. Added original procedural surface maps and reused existing stone normal/roughness detail. Warm directional backlighting, hemi contribution and opt-in sky/fog settings were adjusted. Shadow resolution was not reduced. These changes are confined to the corrected opt-in Mission 1 / arc scenes.
5. Added separate selected-mission arena scenery: 10 fort checkpoint, 20 chain foundry, 30 solar court, 40 panel court, 50 waterworks, 60 transit depot, 70 tribunal, 80 bastion, 90 siege hangar and 100 sanctuary. Arena dressing remains outside existing combat bounds; boss logic and arena collision were not rewritten.
6. Menu preview now renders the corrected live scene for the corrected opt-in variant. Mission cards/loading artwork use real game captures. Unimplemented chapters are labelled story/archive plans instead of showing concept art as playable evidence. Navigation and unlock checks remain intact.
7. Scenery preparation uses the existing loading lifecycle, selected arena caching, request/cancellation guards and actual mesh presentation before releasing the loading hold. Corrected opening preparation does not download unused high-detail street geometry. Failed selected-arena fetches can retry.

New assets reside in `public/environment/phase54e-correction/`; the generated geometry manifest is [here](phase54e-visual-correction-20261113/geometry-manifest.json). The street core is 13.62 MB / 240,456 triangles; arena files are roughly 3.0–5.4 MB each and only the selected arena is loaded. These counts describe cost, not proof of quality.

## Comparison with the supplied reference and remaining visual gaps

The reference presents a dense, weathered, layered Indian city with massive infrastructure, dusty shafts of light, irregular detail and convincing street activity. The correction has recognizable Indian architectural motifs, connected street/shop composition and visible infrastructure, but falls short in the following ways:

- **Architecture:** repeated arch/window modules remain obvious. Skyline towers still read as large simple masses; surface detail does not provide the irregular sculptural richness of the reference. Arena themes are distinguishable but retain a common modular precinct and procedural appearance.
- **Foreground:** preserved combat props, pickups, barriers, drones and some vehicles visibly retain basic geometry/materials. Their contrast with the updated façades is conspicuous. They were not silently replaced as part of unrelated combat work.
- **Activity:** only two civilian base models are reused. Vendors have ambient gestures, not trading interactions, dialogue or rich behavioral variety. Crowd density and face/costume presentation remain below the reference.
- **Riverfront:** connected stairs and water are present, but the water, shoreline, large foundations and sparse river activity still look synthetic. The diagnostic wide view exposes simple outer surfaces and large empty regions.
- **Lighting/materials:** warm light and normals improve legibility, but foreground shadows remain dark in places, stone/patina response is too uniform and the dusty atmospheric composition is less convincing than the reference. Fog/post-processing is not used as evidence of missing geometry being solved.
- **Infrastructure/signage:** more visible than the first prototype, but signage is still repeated and the elevated system is not a fully detailed megastructure. Small advertising copy is not legible from all normal gameplay positions.
- **Menu/selection:** backgrounds are now real game views, but inherit those art limitations. A real screenshot is evidence of implementation, not automatic visual approval.
- **Boss presentation:** passing boss attacks/phases are preserved. Boss models and some effects remain procedural; detailed arena dressing does not turn them into finished cinematic characters.
- **Responsive limitations:** landscape selection requires scrolling to its first action. At 844×390, health-panel borders are nearly touching/slightly overlapping at the left boss-panel edge; gameplay controls remain hit-testable. Physical mobile hardware and mobile frame-rate stability were not validated.

No claim of AAA or Kalki-reference-quality acceptance is made. The production fallback remains necessary.

## Performance method and limitations

The final comparison used three repetitions per variant, with separate 20-second menu, exploration and combat windows after warm-up. Both variants used the same balanced setting, CSS 1920×1080, **actual WebGL drawing buffer 1920×1080**, DPR 1, and the GTX 1650 ANGLE renderer. Loading duration is recorded separately. Before is the preserved pre-correction build; after is validation build v12. No geometry/quality/resolution reduction was applied to manufacture the final desktop measurements. The UI graphics-setting test deliberately checks performance mode separately; its smaller buffer is not used for the native-1080 comparison.

The measurement journals time successive actual scene-render starts and synchronous render-call duration. They are not GPU completion timestamps. Long-task, JS heap, available-RAM and GPU snapshots are retained. The test bundle adds observer exports; the final uninstrumented production bundle was separately built and smoke-tested, but no separate uninstrumented frame-time distribution was collected.

**Power condition limitation:** AC was verified during the final comparison, but final cleanup reports battery/discharging. Power was not logged continuously, so its change timestamp and constant power across every window cannot be certified. Corrected-sample available RAM was only about 97–378 MB. GPU snapshots showed roughly 400–597 MiB dedicated usage; these are snapshots, not peak residency or WDDM-budget measurements. Do not infer a paging, driver or GPU cause from these observations.

### Final native-1080 comparison

| Variant / repeat / scenario | Average FPS | Median ms | p95 ms | p99 ms | Maximum ms |
|---|---:|---:|---:|---:|---:|
| before / 1 / menu | 29.90 | 34.6 | 35.0 | 35.6 | 98.0 |
| before / 1 / exploration | 30.02 | 34.5 | 35.4 | 36.2 | 37.0 |
| before / 1 / combat | 29.94 | 34.5 | 35.5 | 36.4 | 77.1 |
| after / 1 / menu | 30.00 | 34.5 | 35.2 | 35.6 | 36.0 |
| after / 1 / exploration | 29.50 | 34.3 | 40.3 | 48.1 | 63.8 |
| after / 1 / combat | 29.94 | 34.4 | 36.4 | 41.4 | 43.8 |
| before / 2 / menu | 29.84 | 34.7 | 37.0 | 43.1 | 125.0 |
| before / 2 / exploration | 29.90 | 34.6 | 35.5 | 36.5 | 82.4 |
| before / 2 / combat | 29.95 | 34.5 | 35.8 | 38.7 | 76.0 |
| after / 2 / menu | 29.95 | 34.5 | 38.9 | 41.6 | 56.7 |
| after / 2 / exploration | 29.99 | 34.5 | 36.0 | 40.9 | 42.4 |
| after / 2 / combat | 29.90 | 34.4 | 38.0 | 45.0 | 50.3 |
| before / 3 / menu | 29.85 | 34.7 | 34.9 | 35.2 | 132.4 |
| before / 3 / exploration | 29.90 | 34.6 | 35.5 | 42.5 | 71.6 |
| before / 3 / combat | 30.00 | 34.5 | 35.4 | 37.5 | 41.2 |
| after / 3 / menu | 30.00 | 34.6 | 35.2 | 35.6 | 36.6 |
| after / 3 / exploration | 30.00 | 34.4 | 35.5 | 36.6 | 39.2 |
| after / 3 / combat | 29.35 | 34.2 | 40.1 | 53.4 | 76.3 |

Corrected final exploration/combat averages are 29.35–30.00 FPS, p95 35.5–40.3 ms, p99 36.6–53.4 ms and maxima 39.2–76.3 ms. None of those six windows exceeded 100 ms. This does **not** establish stable gameplay throughout the campaign.

An earlier correction cohort failed the target: exploration averaged 22.39–25.39 FPS and combat 25.10–26.57 FPS, with corrected gaps up to 327.9 ms. The baseline also produced a 620.3 ms exploration gap. The differing cohorts are retained; the improvement cannot be attributed solely to the final market/layout changes because system conditions and memory were not fully controlled. [Both complete comparison cohorts](phase54e-visual-correction-20261113/performance-summary.md), [final raw results](phase54e-visual-correction-20261113/performance-final/performance-results.json), [earlier raw results](phase54e-visual-correction-20261113/performance/performance-results.json).

### Every comparison gap above 100 ms

[Machine-readable timestamps and render-call timings](phase54e-visual-correction-20261113/all-comparison-gaps-above100.json).

- performance / before / repeat 1 / menu: **167.2 ms**, 2026-11-13T19:18:05.063Z.
- performance / after / repeat 1 / combat: **270.6 ms**, 2026-11-13T19:21:47.762Z.
- performance / after / repeat 1 / combat: **327.9 ms**, 2026-11-13T19:21:48.090Z.
- performance / after / repeat 1 / combat: **301.7 ms**, 2026-11-13T19:21:48.392Z.
- performance / after / repeat 1 / combat: **119.1 ms**, 2026-11-13T19:21:48.511Z.
- performance / before / repeat 2 / menu: **138.7 ms**, 2026-11-13T19:22:06.942Z.
- performance / before / repeat 2 / exploration: **620.3 ms**, 2026-11-13T19:23:06.628Z.
- performance / after / repeat 2 / exploration: **104.7 ms**, 2026-11-13T19:24:48.659Z.
- performance / before / repeat 3 / menu: **132.0 ms**, 2026-11-13T19:25:46.144Z.
- performance / after / repeat 3 / exploration: **105.4 ms**, 2026-11-13T19:28:26.501Z.
- performance / after / repeat 3 / exploration: **203.9 ms**, 2026-11-13T19:28:27.860Z.
- performance / after / repeat 3 / exploration: **198.2 ms**, 2026-11-13T19:28:28.058Z.
- performance / after / repeat 3 / exploration: **208.7 ms**, 2026-11-13T19:28:28.267Z.
- performance / after / repeat 3 / exploration: **183.7 ms**, 2026-11-13T19:28:28.451Z.
- performance / after / repeat 3 / exploration: **277.2 ms**, 2026-11-13T19:28:28.728Z.
- performance / after / repeat 3 / combat: **173.2 ms**, 2026-11-13T19:28:57.584Z.
- performance / after / repeat 3 / combat: **171.2 ms**, 2026-11-13T19:28:57.755Z.
- performance / after / repeat 3 / combat: **172.1 ms**, 2026-11-13T19:28:57.927Z.
- performance / after / repeat 3 / combat: **150.6 ms**, 2026-11-13T19:28:58.078Z.
- performance / after / repeat 3 / combat: **200.2 ms**, 2026-11-13T19:28:58.278Z.
- performance / after / repeat 3 / combat: **228.1 ms**, 2026-11-13T19:28:58.506Z.
- performance / after / repeat 3 / combat: **115.9 ms**, 2026-11-13T19:29:08.127Z.
- performance / after / repeat 3 / combat: **107.2 ms**, 2026-11-13T19:29:08.558Z.
- performance-final / before / repeat 2 / menu: **125.0 ms**, 2026-11-13T20:48:03.924Z.
- performance-final / before / repeat 3 / menu: **132.4 ms**, 2026-11-13T20:51:37.431Z.

### Boss-combat frame journals

These are natural ordinary-input regression fights, not matched performance A/B tests. Loading and ending playback are outside their fight-only journal scope.

| Mission | Average FPS | Median ms | p95 ms | p99 ms | Maximum ms | >100 ms |
|---|---:|---:|---:|---:|---:|---:|
| 10 | 30.00 | 34.6 | 35.0 | 35.4 | 38.3 | 0 |
| 20 | 30.00 | 34.6 | 35.5 | 36.5 | 42.9 | 0 |
| 30 | 29.96 | 34.7 | 35.4 | 35.6 | 86.5 | 0 |
| 40 | 30.00 | 34.6 | 35.0 | 35.5 | 37.8 | 0 |
| 50 | 29.97 | 34.6 | 35.3 | 37.6 | 78.8 | 0 |
| 60 | 29.83 | 34.6 | 35.2 | 39.1 | 175.8 | 1 |
| 70 | 30.00 | 34.6 | 35.1 | 35.9 | 36.8 | 0 |
| 80 | 28.52 | 34.6 | 35.2 | 182.2 | 239.1 | 10 |
| 90 | 29.97 | 34.6 | 35.3 | 37.9 | 71.1 | 0 |
| 100 | 30.00 | 34.6 | 35.1 | 35.7 | 39.1 | 0 |

Every boss-journal gap above 100 ms:

- Mission 60: **175.8 ms**, 2026-11-13T21:13:56.199Z; current render call 30.9 ms.
- Mission 80: **201.2 ms**, 2026-11-13T21:16:07.571Z; current render call 38.4 ms.
- Mission 80: **239.1 ms**, 2026-11-13T21:16:07.810Z; current render call 26.6 ms.
- Mission 80: **182.2 ms**, 2026-11-13T21:16:07.992Z; current render call 29.8 ms.
- Mission 80: **215.1 ms**, 2026-11-13T21:16:08.207Z; current render call 44.0 ms.
- Mission 80: **195.0 ms**, 2026-11-13T21:16:08.402Z; current render call 9.0 ms.
- Mission 80: **188.9 ms**, 2026-11-13T21:16:21.192Z; current render call 26.8 ms.
- Mission 80: **211.9 ms**, 2026-11-13T21:16:21.404Z; current render call 24.9 ms.
- Mission 80: **209.4 ms**, 2026-11-13T21:16:21.614Z; current render call 29.9 ms.
- Mission 80: **212.3 ms**, 2026-11-13T21:16:21.826Z; current render call 31.3 ms.
- Mission 80: **213.0 ms**, 2026-11-13T21:16:22.039Z; current render call 5.8 ms.

Mission 60's preceding/current render calls were 26.3/30.9 ms around its 175.8 ms gap. Mission 80's 10 gaps occur in clusters at 21:16:07.571–08.402 UTC and 21:16:21.192–22.039 UTC; preceding/current synchronous render calls are much shorter than the full gaps. The journal does not contain scheduler stacks, hard-fault events, GPU-completion waits or attack-stage timestamps needed for exact attribution. **Cause unresolved; no speculative fix applied.** These events prevent a no-unexplained-interruptions acceptance claim. [Full boss frame summary and timestamps](phase54e-visual-correction-20261113/tests/boss-frame-summary.json).

Historical 533.6 ms and 4,051.2 ms ending-transition observations remain unresolved historical limitations. The verified shader warm-up and bounds-preparation code were preserved; this task did not prove those historical gaps fixed.

### Bounded rendering investigations and non-shipped experiments

- [Crowd isolation](phase54e-visual-correction-20261113/crowd-isolation-results.json): visible crowd about 25.5 FPS / 30 ms mean synchronous render call, diagnostic-hidden crowd about 30 FPS / 9.2 ms, restored crowd about 25.8 FPS / 28.6 ms. This supports **crowd rendering as a contributor in that session**, not an exact CPU/GPU/driver root cause for every gap. Hiding the crowd was diagnostic-only and is not shipped.
- Skeleton sharing preserved sampled vertex positions and produced pixel-identical test images, but did not show a meaningful FPS benefit; it was not applied.
- [Material-batching experiment](phase54e-visual-correction-20261113/batch-assessment-results.json) did not establish a reliable FPS benefit. Active imports/calls were removed; experimental source is retained under `experimental-source/`, not active game source.
- [Optional index-only crowd LOD assessment](phase54e-visual-correction-20261113/lod-assessment-results.json) reduced scene triangles by about 15% but did not demonstrate an FPS benefit. It remains **off by default**, available only with `crowdLOD=1`; no LOD performance repair is claimed. Near geometry/UVs/skinning/materials remain original. Estimated LOD error is not a guarantee for every animated pose.

## Functional validation

- **PASS:** unit/simulation preservation tests for ten boss profiles, attacks, phases and progressive difficulty. [Simulation results](phase54e-visual-correction-20261113/tests/boss-simulation-tests.json).
- **PASS:** actual Mission 10 guard/objective encounter, all boss phases, relic, ending transition, rewards and reload. [Results](phase54e-visual-correction-20261113/tests/mission10-browser-results.json).
- **PASS with recorded failed attempt:** Missions 20/30 passed the first strict browser suite. Mission 40 then timed out at spawn. A focused repeat logged zero movement input, running clock, no cinematic and no pause; ordinary key release/re-press restored movement. Missions 40–100 subsequently passed all phases, relic/video/reward/reload checks. This does not establish the exact origin of the earlier lost input. The repeat uses ordinary keyboard events, not teleports, HP edits, forced wins or reload recovery. [First strict results](phase54e-visual-correction-20261113/tests/boss-browser-strict-results.json), [remaining/diagnostic results](phase54e-visual-correction-20261113/tests/boss-browser-remaining-results.json).
- **PASS:** full Mission 1 replay: movement, unlimited sprint, dodge, jump, light/heavy attack, interaction, boss/relic, ending, save reload and no duplicate replay reward. [Results](phase54e-visual-correction-20261113/mission1-regression/mission-playthroughs-guarded.json).
- **PASS:** Mission 2 portrait touch contract, duel, Bujji chase with obstacles, pause/resume, outro handoff, contract replay, and preserved main gameplay/save. [Results](phase54e-visual-correction-20261113/chase/contract-live-results.json).
- **PASS:** desktop 1920×1080, laptop 1280×720, portrait 430×932 and landscape 844×390 UI tests. Main menu, selection/locked actions, settings, all HUD modes, touch hit targets, boss/player bars, pause/Esc, exit/navigation and reward preservation checked. Completion/game-over screens use explicitly labelled UI state fixtures, not fake combat passes. [Final results](phase54e-visual-correction-20261113/tests/ui-regression-ready-results.json).
- **FAILED initial UI attempt:** issued approach inputs without an explicit scenery-gate prerequisite and timed out. The final test explicitly waits for the gate, then uses ordinary held-key repeat events. Failed evidence is retained in `tests/ui-regression-corrected-results.json`.
- **PASS:** selected arena fetch deliberately returns 503; recovery error appears; retry loads actual architecture/player, renders and releases the clock; pause/exit preserves the semantic save and rewards. [Final recovery results](phase54e-visual-correction-20261113/tests/loading-recovery-semantic-results.json). Earlier harness failures are retained: undefined observer reference, wrong pause-button label and JSON property-order-sensitive equality. Production code was not changed to accommodate those mistakes.
- **PASS:** final uninstrumented production bundle default/opt-in/first-prototype loading and pause smoke, no diagnostic globals or browser errors. The default loads no corrected-city GLBs. Each records native 1920×1080 buffer and GTX renderer.
- **NOT REPEATED:** unchanged Missions 3–9 full playthroughs; prior Phase E evidence remains applicable only to that earlier run. No current full 100-mission campaign completion claim is made. The previous implementation still has 19 launchable mission/boss prototypes and 81 planned chapters; later bosses were tested with isolated fixture unlocks, not proof of a complete campaign path.
- **NOT TESTED:** physical phones/tablets and sustained mobile FPS. Initial emulated DPR2 buffers were 860×1864 portrait and 1688×780 landscape; graphics toggles changed the actual buffer. Do not describe the mobile pixel budget as fully verified or infer mobile performance from desktop.
- **PASS with warnings:** production build exit 0, [build log](phase54e-visual-correction-20261113/production-build.log). Lint exit 0, [lint log](phase54e-visual-correction-20261113/lint.log): four existing `MenuScene.jsx` immutability warnings and one **new** `CorrectedCity.jsx` animation-mixer immutability warning remain. Build also reports bundle-size/plugin timing advisories. These are disclosed, not counted as zero-warning lint.

## Files and preservation

12 existing source files changed; 6 new source files. [Complete SHA-256 change/asset manifest](phase54e-visual-correction-20261113/final-changes-and-hashes.json). 120 pre-existing source files remain byte-identical, including combat/boss profiles, player controls, save/progression systems, health HUD, Bhairava functionality and verified shader/bounds helpers. All 47/47 protected hashes match before and after. All ten previous Phase E public assets also match their earlier manifest.

Modified existing source:

- `src/App.jsx`
- `src/game/GameCanvas.jsx`
- `src/game/LoadingScreen.jsx`
- `src/game/MainMenu.jsx`
- `src/game/MissionArtwork.jsx`
- `src/game/MissionSelect.jsx`
- `src/game/PlayerSunlight.jsx`
- `src/game/WorldArchitecture.jsx`
- `src/game/phase54e/cityAssets.js`
- `src/game/phase54e/CityEnvironment.jsx`
- `src/game/phase54e/CityMenuScene.jsx`
- `src/game/phase54e/phase54e.css`

New source:

- `src/game/phase54e/citySurfaces.js`
- `src/game/phase54e/CorrectedCity.jsx`
- `src/game/phase54e/crowdLod.js`
- `src/game/phase54e/environmentViews.js`
- `src/game/phase54e/FirstCityEnvironment.jsx`
- `src/game/phase54e/FirstCityMenuScene.jsx`

New generator/diagnostic tools are `tools/phase54e/build-correction.mjs`, `build-crowd-lod.mjs` and `test-correction-preservation.mjs`. Source backups are under `phase54e-visual-correction-20261113/source-before/src/`; previous source/assets/evidence were not overwritten. The final build is isolated at `phase54e-visual-correction-20261113/production-build/`. No Git repository is present, so no commit-based rollback is claimed.

All browser tests used disposable contexts/localStorage fixtures. Existing personal campaign saves were not opened, cleared or rewritten. Sprint remains unlimited; no stamina was fabricated. No protected assets, rollback assets, character models, existing audio recordings, mission logic or save formats were replaced.

## Rollback and cleanup

1. For immediate fallback, remove `environment54e=1` from the game URL. For the retained first E comparison, use `environment54e=1&cityVersion=first`.
2. For source rollback, first compare current hashes against the final manifest to avoid overwriting newer user changes. Restore only the 12 changed existing files from `source-before/src/`; the new files can remain unreferenced. Do not blindly replace the complete source tree or delete assets/evidence. Rebuild to a separate directory, then verify protected hashes and mission/save smoke checks.
3. Preserve the new asset directory, all earlier builds, experimental evidence and reports for review. No storage cleanup or project deletion is part of rollback.
4. All owned browser contexts and preview servers were closed. Final elevated queries found no listeners on test ports 5550–5565 and no matching phase-specific Node/Chrome processes. [Cleanup record](phase54e-visual-correction-20261113/cleanup-summary.json). No unrelated applications were terminated.
5. Final recorded free C: space before the screenshot ZIP: 29.80 GB (27.75 GiB); ZIP adds about 72.45 MB. [Disk snapshot](phase54e-visual-correction-20261113/final-disk-space.json).

## Handoff recommendation

Keep this as an isolated comparison; **do not integrate it into production**. The next approval decision should be based on the actual gallery, not counts or claims. Prioritize a small professionally detailed street/ghat slice with stronger silhouettes, materially distinct foreground props and credible civilian presentation before expanding the city. Separately resolve or explicitly accept the retained frame-time limitations with controlled power/memory conditions. No new phase or further implementation has been started.
