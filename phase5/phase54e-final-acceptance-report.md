# Phase 5.4E final acceptance report

**Final recommendation: REJECT for production visual/performance acceptance.** This final correction pass is stopped. The revised environment remains opt-in; the original environment remains the production default. Passing functionality is retained. No additional Phase 5.4E correction cycle is proposed. Remaining issues are a handoff backlog for Phase 5.4F only if the user approves that phase.

## Scope and time limit

Started 2026-11-13T23:00:56Z; hard stop 2026-11-14T02:00:56Z. Report prepared 2026-11-14T00:55:05.553013+00:00. Work finished within the three-hour limit. Source changes were frozen during the first hour. The bounded stall investigation ran approximately eight minutes and stopped without attribution; later frame samples were validation, not an extended root-cause investigation.

[Stage timestamps](phase54e-final-20261114/stage-limits.json). No driver, BIOS, registry, service, resolution or gameplay-quality reductions were applied.

## Corrections completed

- Portrait HUD: moved player vitals/status above the central character area, with a separate boss-mode offset. Long health bars, readable values, all three HUD modes and touch controls remain. Landscape boss-bar width now leaves a gap from player health. Sprint remains unlimited; no stamina was introduced.
- Playable opt-in streets: added architectural piers, shutter guides, masonry/soffit details, service pipes and transit undersides within existing footprints. Separated stone/plaster/basalt material treatment and improved ambient fill without adding shadow-casting lights.
- Foreground obstacles: replaced the opt-in barrier housing and rotor presentation; corrected the rotor base orientation that produced a dark upright obstruction. Collision, damage and movement logic remain unchanged.
- Civilians: retained the existing licensed models and animations, with restrained woven clothing texture and role color variation. This is not a new high-detail character replacement.
- All ten arena assets received targeted thematic gate, furnace, instrument, pipe, depot, tribunal, bastion, hangar or shrine framing outside combat bounds. They remain visibly related procedural spaces rather than ten fully finished bespoke environments.
- Added a final-only asset cache using existing loaded assets/loading preparation, with rejected-promise eviction for retry. Existing shader warm-up and cinematic bounds preparation are unchanged.

Six existing source files changed:

- `src/game/GameCanvas.jsx`
- `src/game/Gameplay.jsx`
- `src/game/MissionOneProp.jsx`
- `src/game/phase54e/cityAssets.js`
- `src/game/phase54e/CorrectedCity.jsx`
- `src/game/phase54e/phase54e.css`

New generator: `tools/phase54e/build-final.mjs`. Fourteen new GLBs are isolated in `public/environment/phase54e-final/`; old generators, rejected assets and rollback points are retained. Street-core geometry increased from 240,456 to 278,784 triangles; this count is an implementation cost, not proof of visual acceptance. Representative renders still report approximately 504-651 calls and 2.30-2.58 million triangles including the rest of the scene.

## Actual visual evidence

[Complete before/after gallery](phase54e-final-20261114/visual-review/index.html) | [Download screenshot ZIP](phase54e-final-20261114/final-visual-review.zip) | [Camera comparison](phase54e-final-20261114/camera-comparison.json). The ZIP contains 34 PNGs and its HTML index; archive CRC verification passed.

Before means the preceding corrected opt-in version, not the original production environment. After means the frozen final source. All 13 paired city/arena captures have identical camera matrices (maximum difference zero). Simulation animation phases can differ. Wide-city and empty-arena views are diagnostic compositions; ordinary-input boss-fight captures separately prove playable implementation. No concept image is presented as implementation evidence.

### Street before / after

![Before street](phase54e-final-20261114/visual-review/before-street-forward.png)

![After street](phase54e-final-20261114/visual-review/after-street-forward.png)

### Portrait HUD before / after

![Before portrait](phase54e-final-20261114/visual-review/before-portrait-hud.png)

![After portrait](phase54e-final-20261114/visual-review/after-portrait-hud.png)

### Arena example and natural ending

![Arena after](phase54e-final-20261114/visual-review/after-arena-10.png)

![Natural Mission 1 ending](phase54e-final-20261114/visual-review/natural-ending.png)

The gallery also includes all ten arena pairs, spawn/wide-city pairs, landscape HUD, current default menu, opt-in menu, mission selection and the supplied reference. Menus use actual rendered scenes/captures. Mission-card thumbnails were not refreshed in this bounded pass. The default production menu scene was visible after a 15-second wait in the final smoke capture; a shorter earlier capture was blank while loading. This observation does not establish or repair a loading-time root cause.

## Visual limitations and skipped work

- The city remains visibly modular/procedural, with repeated facade language, insufficient authored foreground storytelling and less convincing weathering, density and scale than the supplied dystopian Kashi reference.
- Civilian silhouettes, close-up quality and activity remain limited. More color/cloth detail does not make them reference-quality crowds.
- Shoreline/ghat transitions, connected street life, skyline depth and elevated infrastructure still require art review. No complete riverfront redesign was attempted.
- Arena themes are clearer but retain shared court geometry and incomplete bespoke composition. Boss models/presentation were preserved rather than resculpted.
- Main-menu imagery benefits from the live opt-in scene, but mission cards still contain previous in-game captures. No broad menu redesign was authorized for this final pass.
- Portrait central-player obstruction is corrected in captured/tested layouts; crowded boss information can still occupy substantial upper-screen space. Landscape mission selection needs scrolling before the first launch action.
- Full environment replacement, new crowd models, cinematic restaging, new missions and physical-device mobile benchmarking were skipped. Original production art remains unchanged.

These are genuine remaining visual gaps. The report does not claim AAA quality or parity with the reference.

## Bounded 239.1 ms investigation

The historical 239.1 ms boss gap was **not reproduced** in the bounded profiled Mission 80 run. Its exact cause remains **unresolved**. Historical renderer durations (38.4 ms preceding, 26.6 ms current) do not account for the entire interval and do not identify the dependency responsible.

The new approximately 42.47-second profiled run completed with maximum gap 55.9 ms, average 29.98 render-start FPS, p95 35.2 ms and p99 39.1 ms. Retained evidence includes a renderer CPU profile, Windows process/system telemetry, resource/long-task observations, CDP metrics, NVIDIA snapshots and GPU elapsed queries. GPU elapsed queries: 1,256 valid samples, zero disjoint results, median 7.82 ms, p95 11.05 ms, maximum 27.10 ms. These measure GPU work duration, not queue waits or presentation latency.

**Diagnostic limitation:** browser trace completion/export did not arrive within the bounded export wait. `traceIncomplete=true`; there is no usable complete browser trace. Peak reported buffer use stayed below the guard, but this does not establish zero event loss. CPU profile and other independently saved telemetry remain valid. No lost or incomplete trace was recreated.

RAM pressure was observed, including about 104.6 MB available RAM in a diagnostic sample and elevated paging counters. PageFaultsPersec includes soft faults; it is not an owned-browser hard-fault count. Because this run had no >100 ms interruption, pressure alone cannot explain the historical stall. Kernel scheduling stacks and cross-adapter GPU queue attribution were unavailable. No root cause or successful stall repair is claimed.

[Diagnostic metadata](phase54e-final-20261114/diagnostics/diagnostic-metadata.json), [CPU profile](phase54e-final-20261114/diagnostics/renderer-cpu-profile.json), [Windows telemetry](phase54e-final-20261114/diagnostics/windows-telemetry.ndjson).

## Functional verification

- **PASS: all ten existing arc bosses**, Missions 10,20,30,40,50,60,70,80,90,100, using ordinary keyboard input. Observed all three phases, both authored attack families, defeat, relic/reward flow and reload persistence. Boss completion videos were skipped in these tests; they are not evidence of full natural video playback.
- **PASS: focused Mission 1 replay and natural ending.** The real-time `kashi-contract-return` cinematic advanced naturally to 10.5 seconds, completed into victory/idle, and save/reward checks survived reload without a duplicate replay reward. This is the existing 3D ending, not a claim that a separate MP4 played naturally.
- **UNVERIFIED initial Mission 1 attempt:** an earlier 244.8-second automated attempt remained near x=-3.23,z=-29.86 with movement input recorded and the boss dormant. It did not reach the relic. The script exit code was zero but the gameplay objective did not pass. A focused repeat with additional physics/clock diagnostics and normal held-key repeat completed; the first stationary observation remains unattributed. No teleport/reload workaround or speculative movement fix was applied.
- **PASS: Bujji contract/chase regression**, including actual touch steering/brake/acceleration, duel, active pause/resume, obstacle course, outro handoff and saved replay intro naturally entering the duel.
- **PASS: all three HUD modes**, portrait/landscape touch hit testing, joystick/release cleanup, pause/Esc, settings navigation, graphics toggle and save preservation in disposable browser contexts. Completion/game-over UI fixture checks prove layout/navigation, not natural gameplay victory.
- **PASS: production bundle smoke**, default environment, final opt-in and preserved prior correction; no observer globals or browser errors. Desktop rendering buffer was verified at 1920x1080 on the GTX 1650.
- Existing valid unaffected desktop/laptop UI and boss-unit evidence was reused. This pass did not independently retest every campaign mission or physical phone. Real campaign browser storage was not used as a fixture.

Raw results: [bosses 20-100](phase54e-final-20261114/tests/boss-browser-strict-results.json), [boss 10](phase54e-final-20261114/tests/mission10-browser-results.json), [natural replay](phase54e-final-20261114/mission1-regression/mission-natural-diagnostic-results.json), [initial unverified attempt](phase54e-final-20261114/mission1-regression/mission-playthroughs-guarded.json), [chase](phase54e-final-20261114/chase/contract-live-results.json), [HUD/UI](phase54e-final-20261114/tests/ui-visual-stage-results.json), [production smoke](phase54e-final-20261114/tests/production-bundle-smoke.json).

## Measured performance

Frame times below are render-start intervals from a light observer build, not GPU-present FPS. Percentiles are nearest-rank; loading gates are excluded from representative active windows. Mobile values are Chrome touch/viewport emulation on the GTX 1650, **not handset performance**. Desktop cadence targets 30 FPS; mobile render cadence differs.

Four separate 60-second representative samples used unchanged settings. Buffers: desktop 1920x1080/DPR1, portrait 860x1864/DPR2 (CSS430x932), landscape1688x780/DPR2 (CSS844x390). No resolution reduction was used. Loading gates took about15.5-17.3 seconds, separately recorded. All sampled power readings during these windows reported AC online. Available physical RAM ranged approximately8.38-551.05 MiB, with memory load97-98% at some points. This confirms pressure, not a blocking-chain diagnosis.

- **desktop / exploration**: average 29.24 FPS; median 34.6, p95 35.8, p99 40.0, maximum 515.4 ms.
- **desktop / near-street-guard**: average 29.95 FPS; median 34.5, p95 35.3, p99 36.0, maximum 77.6 ms.
- **portrait / near-street-guard**: average 73.16 FPS; median 12.7, p95 20.8, p99 25.1, maximum 121.4 ms.
- **landscape / near-street-guard**: average 61.79 FPS; median 15.2, p95 23.1, p99 27.7, maximum 232.3 ms.

Near-street-guard samples include ordinary approach and held block, not a full boss fight. Each ended alive with health100.

Fresh boss gameplay results (average FPS; median / p95 / p99 / maximum milliseconds):

- Mission 10: 30.01; 34.6 / 35.2 / 38.7 / 42.2.
- Mission 20: 30.00; 34.6 / 35.0 / 36.4 / 39.7.
- Mission 30: 30.00; 34.6 / 34.9 / 35.2 / 53.9.
- Mission 40: 29.97; 34.6 / 35.0 / 37.7 / 64.3.
- Mission 50: 30.00; 34.6 / 35.0 / 35.2 / 42.0.
- Mission 60: 29.66; 34.6 / 35.1 / 38.7 / 445.4.
- Mission 70: 30.00; 34.6 / 35.0 / 35.2 / 44.2.
- Mission 80: 30.00; 34.6 / 35.0 / 37.2 / 40.0.
- Mission 90: 30.00; 34.6 / 35.0 / 35.6 / 39.6.
- Mission 100: 30.00; 34.6 / 35.0 / 38.8 / 60.9.

Natural Mission 1 replay: 2032 frames, 29.57 FPS; median 34.5, p95 35.6, p99 40.2, maximum 464.1 ms. Ending-state samples include three >100 ms intervals. A frame ending in cinematic state may straddle the transition; the journal does not independently resolve every interval's internal work.

### Every final recorded gap above100 ms

- 2026-11-13T23:57:21.337Z | boss-60 | **445.4 ms** | current render call 3.4 ms.
- 2026-11-14T00:21:12.990Z | mission1-natural | **464.1 ms** | current render call 418.6 ms.
- 2026-11-14T00:21:13.419Z | mission1-natural | **429.5 ms** | current render call 5.9 ms.
- 2026-11-14T00:21:14.694Z | mission1-natural | **198.4 ms** | current render call 9.6 ms.
- 2026-11-14T00:26:32.348Z | desktop/exploration | **134.6 ms** | current render call 8.5 ms.
- 2026-11-14T00:26:32.690Z | desktop/exploration | **342.2 ms** | current render call 8.0 ms.
- 2026-11-14T00:26:32.792Z | desktop/exploration | **101.2 ms** | current render call 8.5 ms.
- 2026-11-14T00:26:33.565Z | desktop/exploration | **515.4 ms** | current render call 7.6 ms.
- 2026-11-14T00:26:34.072Z | desktop/exploration | **506.4 ms** | current render call 10.9 ms.
- 2026-11-14T00:29:08.520Z | portrait/near-street-guard | **121.4 ms** | current render call 7.6 ms.
- 2026-11-14T00:30:56.477Z | landscape/near-street-guard | **232.3 ms** | current render call 21.1 ms.

Mission60 had a445.4 ms gap with only1.7 ms preceding /3.4 ms current render calls. Its cause is unresolved. The natural-ending464.1 ms interval included a418.6 ms renderer call, followed by429.5 and198.4 ms gaps; this overlap is evidence of location, not exact-operation attribution. Desktop exploration later reached515.4 ms. These fresh interruptions prevent a stable1080p/30 FPS claim even though most samples cluster near30 FPS.

The historical239.1 ms observation remains unresolved; it is not silently replaced by a passing short sample. Historical533.6 ms and4,051.2 ms ending-transition issues also remain documented, not declared fixed. The verified shader warm-up and isolated bounds optimization are retained unchanged.

Previous performance records used different durations, camera paths and system conditions. They provide context, not a controlled causal before/after experiment. No performance improvement percentage is claimed for these visual changes. [Full distributions and >100 ms list](phase54e-final-20261114/performance-summary.json), [representative raw results](phase54e-final-20261114/performance/results.json), [power/memory series](phase54e-final-20261114/performance/power-memory.ndjson).

## Build, integrity and cleanup

- Production build: PASS. Existing bundle-size/plugin advisories remain in the build log.
- Lint: PASS exit status, with **five immutability warnings** (four in MenuScene, one in CorrectedCity optional-LOD geometry assignment). Warnings are not presented as a warning-free lint run.
- **47/47 protected hashes match before and after.** Six existing source files changed and132 source files are unchanged against the saved initial snapshot. Save, boss AI, input, cinematic, shader warm-up and bounds-helper source hashes are unchanged. The original environment remains the default.
- No Git repository was assumed or created. Source backups, logs, images, prior assets and reports were retained.
- Final process check: zero matching test/diagnostic processes and zero listeners on test ports5550-5570. No unrelated application was terminated.

- C: free space at cleanup: 26.99 GB decimal (25.13 GiB). No project files were deleted to obtain space.

[Build log](phase54e-final-20261114/build.log), [lint log](phase54e-final-20261114/lint.log), [full hashes and changes](phase54e-final-20261114/final-integrity.json), [initial snapshot](phase54e-final-20261114/initial-integrity.json), [cleanup verification](phase54e-final-20261114/cleanup-verification.json).

## Rollback and next action

Immediate visual fallback: omit `environment54e=1` to use the unchanged production environment. Final isolated version: `?environment54e=1`; preserved preceding correction: `?environment54e=1&cityVersion=correction1`; first prototype: `?environment54e=1&cityVersion=first`.

If source rollback is later approved, compare current files with the final manifest to avoid overwriting newer user edits, then restore only the six listed source files from `phase54e-final-20261114/source-before/src/`. Keep the new assets, generator, evidence and prior versions for comparison. Do not delete rollback assets.

**Decision: REJECT production integration/visual-performance acceptance.** Functional preservation and the HUD correction pass; reference-level art and sustained stall-free performance do not. This final Phase5.4E pass ends here within the time limit. No further E cycle or speculative fix is requested. The smallest handoff is to retain the opt-in/fallback separation, carry the eleven measured gaps and first unverified movement attempt as explicit defects, and prioritize those together with authored foreground/arena composition in Phase5.4F only after user approval. No Phase5.4F work has begun.
