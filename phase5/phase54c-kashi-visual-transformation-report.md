# Phase 5.4C — Kashi visual prototype review

13 November 2026, IST. **Stopped at the first reviewable opt-in prototype. NOT READY for default integration or visual/performance acceptance. Phase 5.4C remains open. No Phase 5.5 work.**

The audit, original geometry prototype, scoped UI design samples and bounded validation are complete. The city study adds real geometry and activity, but it does not meet the requested cinematic realism or stable 1080p/30 standard. A **5,384.5 msactive-gameplay gap** was recorded with the prototype enabled. Keep the accepted environment as the default and review the evidence before approving further art work.

## Audit and reference basis

Inspected MissionOneDistrict, KashiEnvironment, WorldArchitecture, GameCanvas, PlayerSunlight, the Kashi cinematic set/camera path, App/main entry and the Phase 5.4 visual/performance reports. Existing Kashi uses a682,468-triangle riverfront GLB, 153,912-triangle riverbank, local 1K stone PBR surfaces and existing sun/shadow/fog setup. Renderer counters include characters, other world geometry and shadow passes; asset triangle counts are not frame totals.

Inspected the supplied skyline image, ENV-01 and P43-01 contact sheets, all20 reference-only PNGs from the Phase 5.3 movie study, and current gameplay captures. These suggest terraced construction, inhabited courtyards, weathered masonry and infrastructure with a practical purpose. The earlier LastCaretaker upload was not available as a readable local image for fresh inspection; no match/parity claim is made. No movie image, mesh, recording or footage was added to public assets. The private montage remains outside public. See [audit/reference inventory](phase54c-20261113-prototype/audit-and-reference-index.json) and [asset inventory](phase54c-20261113-prototype/asset-inventory.json).

Preflight matched47 protected files,112 source entries,52 existing public assets, 5 configuration entries,61 earlier reports and 7 audit reports against the retained Phase 5.4B state. Its conditional shader improvement is unchanged.

## Reversible implementation

Only two existing production files changed:

- **src/game/MissionOneDistrict.jsx**: lazy-load additive scenery only when the URL contains kashiPrototype=54c. The original environment, colliders and mission route are retained.
- **src/main.jsx**: a separate kashiPrototype=review entry renders the art/UI gallery. Normal entry still renders the existing App.

New files:

- src/game/kashi54c/KashiGhatPrototype.jsx — scene cloning/material ownership, native ThreeLOD groups, instanced scenic figures, ambient ferry and two mounted civic-display panels.
- src/game/kashi54c/KashiPrototypeReview.jsx — isolated orbit/viewpoint gallery, contextual ground and component samples; not a playable mission or promotional substitute.
- src/ui/kashi54c/WorldComponents.jsx and worldTokens.css — scoped panel/button/meter/mission-tile components; ink/sand/gold/teal/coral tokens and readable desktop/portrait treatments.
- public/environment/phase54c/ghat-prototype-v2-draco.glb and ASSET-CREDITS.txt — new original geometry and provenance.

No mission registration, combat/AI, input, reward/save schema, camera script, audio or cinematic controller was edited. No protected asset was opened for authoring. No tool installation, driver, service, registry or BIOS change was made.

### Geometry and cost controls

The study adds six terraced residential/workshop masses, two temple groups, stepped river infrastructure, three cloth-covered stalls, rooftop water/solar/conduit details,12 instanced scenic figures and one ambient river-transit model. Carved arch openings, recessed frames, cornices, balconies, colonnades, domed pavilions and tiered temple profiles are actual mesh geometry. The electronic notices serve the water/transit district; futuristic props were not scattered across the combat corridor.

Nine architectural cells use three geometry levels at 0/55/95 world-unit thresholds, with merged material batches and normal frustum/depth rejection. There is **no new dedicated occlusion-query system**. Only the near market adds shadow casters under the existing sun; no new gameplay light, shadow map, particle system, SSAO, planar reflection or blur pass was added. Existing1Kmaps are reused; the new notice atlas is 1024×512. All LODs are downloaded together, so this is not streamed-memory optimization.

Offline authoring v2 is86.79 MB; the shipped prototype is **18.93 MB**. All155 compressed primitives decoded with matching face counts; no faces were dropped in the selected sequential codec. Position/normal/UV/color quantization is14/10/12/8bits. This is technical validation, not proof of lossless visual quality. The source generators, authoring GLBs and rejected v1 captures are preserved in the evidence directory. Missing foundation support and blank rear elevations identified in v1 were corrected geometrically in v2; the earlier files were not deleted.

A matched start-area capture reported renderer counters **303→343calls** and **2,686,204→3,058,300triangles**, including shadow passes. Program count49→58. These are sampled positions, not fixed costs everywhere. The first version's raw48MBfile was assessed before use and replaced by a versioned compressed candidate; no performance gain is claimed solely from compressed download size.

## Screenshots and visual review

Actual Mission 1, prototype OFF, full1920×1080 capture:

![Actual Mission 1 baseline](phase54c-20261113-prototype/prototype-review-v2/game-before-playable.png)

Actual Mission 1, prototype ON, same input sequence; actor/AI timing varies:

![Actual Mission 1 prototype](phase54c-20261113-prototype/prototype-review-v2/game-after-playable.png)

Actual opening cinematic with the prototype, exposing the new flank/crowd limitations:

![Actual opening prototype](phase54c-20261113-prototype/prototype-review-v2/game-after-opening.png)

Separate art viewer — useful for geometry inspection, **not gameplay acceptance**:

![Opt-in riverfront study](phase54c-20261113-prototype/prototype-review-v2/viewer-ghat.png)

Scoped reusable UI samples — not a replacement for the game's screens:

![UI token study](phase54c-20261113-prototype/prototype-review-v2/ui-tokens-desktop.png)

### Improvements and remaining defects

Added skyline height, river stairs/landings, more building layers and architectural detail, scenic vendor/crowd/transit presence, rooftop infrastructure and coherent civic signage. Existing warm stone/teal/gold identity and clear playable corridor remain.

**Visual acceptance is NOT passed.** Large blank/repetitive flank surfaces and regular building rhythms still read procedural. The new riverhouse occupies much of the opening shot's left side, weakening its composition. The scenic figures have visibly simple robed geometry and limited looping motion; they are not finished realistic NPCs. Ferry silhouette/turns, material wear and façade variation require art work. The broad river horizon/shore joins and sparse connections between masses still need refinement. The normal gameplay camera is dominated by the accepted foreground, so the strongest new density reads in the river/skyline views rather than uniformly throughout play. Lighting is inherited in gameplay; cinematic reference-quality shadows, AO and reflections were not established. No blur or resolution change was used to conceal these issues.

The UI gallery supplies sample treatments for panels/navigation, loading/health/progression, mission tiles and caution/game-over messages. It has not redesigned the real main menu, loading, selection, pause, HUD or game-over screens. Existing game UI stays intact. The gallery and its token panel were tested at 1920×1080and 430×932without horizontal overflow.

## Performance — actual target dimensions

All six gameplay comparison samples assert **1920×1080WebGL drawing buffer and CSS canvas**, approximately DPR 1 and **GTX 1650 ANGLE/D3D11**. These establish rendering dimensions, not1080pvisual-quality acceptance. Same candidate build, prototype OFF/ON, interleaved B/A/A/B/B/A; no quality reduction or cache deletion. Ordinary keyboard combat is followed by a retreat toward the start after enemies are defeated. These are mixed combat/movement windows, not60 seconds of continuous boss combat.

Frame times are consecutive main-render start intervals with nearest-rank percentiles. They measure browser submission cadence, not GPU completion/presentation/input latency. No CPU/GPU profiler, native GL wrapper or GPU timer polling was enabled during these windows. Generated zero native-shader counters in raw files mean **not collected**, not measured zero.

| Window | State | Duration s | FPS | Mean ms | Median ms | p95 ms | p99 ms | Max ms | >100 ms | >1000 ms |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| before-1 | OFF | 60.04 | 29.44 | 33.97 | 34.4 | 36.0 | 46.6 | 409.6 | 5 | 0 |
| after-2 | ON | 60.11 | 29.14 | 34.32 | 34.4 | 36.3 | 62.4 | 367.3 | 9 | 0 |
| after-3 | ON | 60.19 | 25.58 | 39.09 | 34.4 | 36.6 | 48.8 | 5384.5 | 6 | 2 |
| before-4 | OFF | 60.19 | 29.53 | 33.86 | 34.4 | 36.2 | 43.6 | 407.2 | 5 | 0 |
| before-5 | OFF | 60.10 | 29.92 | 33.43 | 34.4 | 35.7 | 39.3 | 209.7 | 1 | 0 |
| after-6 | ON | 63.88 | 29.25 | 34.19 | 34.5 | 38.5 | 58.3 | 410.7 | 6 | 0 |

**Stable1080p/30 acceptance: FAIL.** Target remains 33.33 msnominal, average≥29.5 FPS,p95≤40 ms,p99≤50 ms,max≤100 ms. Baseline also misses the tail gate. The prototype's5,384.5 msactive gap cannot be assigned to an exact operation from these measurements. It is not reclassified as loading or hidden by an aggregate average. The last requested60 swindow actually lasted63.88sbecause controller completion was delayed; its recorded duration/boundary gaps are retained. Leading/trailing gaps and all >33.33/50/100/250/1000 mscounts are in the [measurement summary](phase54c-20261113-prototype/performance-summary.json).

A low-cost native sampler recorded **458 power/RAM samples**, AC online in every recorded sample, no missing sequence numbers, maximum polling interval2156 ms. This is2-second-resolution evidence, not proof against every unobserved transient. RAM/commit headroom was low and variable; owned paging/GPU pressure and the stall's cause were not established. Existing background apps were not closed. No broad Windows/GPU investigation was reopened.

Cold-entry journals and full setup duration are retained separately, including intended cinematics and a fixed 7ssettling interval. They are not pure asset-decode timings or zero-cost loading claims. The19MBasset can appear late during saved replay; the corrected replay test waited7,063 msfor optional scenery after its early physics-ready check. Production loading/error handling and resource pressure need review before default integration.

Observer-bearing headless functional route measurements, including ending boundaries:

| Route | FPS | Median ms | p95 ms | p99 ms | Maximum ms |
| --- | --- | --- | --- | --- | --- |
| m1-replay-ready | 28.09 | 34.5 | 36.4 | 52.3 | 979.5 |
| m2-keyboard | 29.04 | 34.5 | 40.4 | 69.8 | 393.8 |

These are not the controlled comparison windows. **The historical533.6 msending-transition issue remains UNRESOLVED**; no ending fix was implemented and a lower individual sample would not establish a repair. Physical-mobile FPS/thermal performance was not tested.

## Regression and preservation

- **PASS:** corrected Mission 1completed-save keyboard replay, prototype active, ordinary movement/attacks/boss/relic/ending navigation; save reload and existing replay rewards unchanged.
- **PASS:** Mission 1emulated-touch playthrough with prototype active, movement/sprint/dodge/jump/attacks, boss/relic and save reload.
- **PASS:** Mission 2default keyboard playthrough and save reload.
- **PASS:** default Bujji duel/chase/replay on desktop and portrait touch, pause/resume and handoff.
- **PASS:** prototype Full/Compact/Minimal HUD, relay/objective updates, desktop/portrait control visibility and audio settings controls.
- **INCOMPLETE initial attempt:** replay harness checked optional geometry synchronously before loading and stopped before controls. It is preserved. Only that unexercised replay was repeated with an explicit asset-readiness wait; the passing touch test was not repeated. The prepared touch-ready harness was not run.
- **NOT RETESTED:** Missions 3–10 individually in 54C. Their54B smokes remain prior evidence; unchanged registrations/gameplay are hash-verified, not a new runtime pass.

All saves are disposable browser-context fixtures. No real player profile or save was overwritten. [Regression summary](phase54c-20261113-prototype/regression-summary.json) and raw per-test files retain actual verdicts; zero process exit codes were not used as passing evidence by themselves.

Production build passed into a new isolated output; lint passed with only the four pre-existing MenuScene immutability warnings. No new warnings remain. See [build log](phase54c-20261113-prototype/build-production.log) and [lint](phase54c-20261113-prototype/lint-final.log). Decoder validation covered 155 new primitives; browser scene loading, viewpoint controls and the UI gallery completed with no recorded page errors or missing assets in the capture run.

**Protected hashes: 47/47 match.** Existing source 110/112 matches, with only the two permitted hooks changed. All 52 old public assets, 5 configs, 61 previous reports and 7 audit reports match; the Phase 5.4B report and shader source remain unchanged. New file hashes and rollback-copy checks are in [changes/hashes](phase54c-20261113-prototype/changes-and-hashes.json).

## Rollback, review and stop

Immediate disable: remove the kashiPrototype query and reload. This does not change saves or progression. To remove both entry hooks, restore only main.jsx and MissionOneDistrict.jsx from [source-before](phase54c-20261113-prototype/source-before/), verify their recorded hashes and rebuild. Do not reset the project, restore old saves or delete prototype/rollback evidence. New assets and modules may remain archived/unreferenced. Earlier iterations, reports and all protected files are preserved.

Shutdown verification: 0 listeners on owned test ports and 0 matching test/sampler processes. C: free 45.32 GiB. All current source and evidence are saved; no project file was deleted to gain space.

To inspect later using the usual dev server: open **/?kashiPrototype=review** for the art/UI gallery, or **/?kashiPrototype=54c** and select Mission 1 through the existing menu for gameplay. These flags do not auto-start missions or alter saved selection/progression.

**Recommendation: review the architecture/composition direction, but do not approve a default environment replacement or performance acceptance.** Priorities for a separately approved continuation are architectural flank/ground integration and opening framing, production-quality population/vehicle art, and a bounded cost/loading plan supported by these failing measurements. Do not start another diagnostic phase or expand the UI across every screen automatically. Await user review. No Phase 5.5 was started.
