# Phase 5.4E — Combat, environment and interface review

## Decision

**NOT ACCEPTED for full Phase 5.4E visual/performance closure or Kashi production integration.** This report records implemented functionality and a tested opt-in environment prototype, rather than claiming the complete reference-quality target has been met. No Phase 5.4F work was started.

The original environment remains the default. The new city requires `?environment54e=1`. Earlier `?kashiPrototype=54c` and `?kashiPrototype=revision` variants and their rollback files remain available. No protected asset was replaced.

Three blockers remain: the actual 3D environment and procedural boss presentation fall short of the supplied reference; unexplained menu render interruptions remain; and existing unimplemented intermediate chapters prevent natural campaign access to later arc bosses. This work does not manufacture missions or bypass real campaign locks to conceal that gap.

## Scope and evidence

Evidence is under `phase5/phase54e-20261113/`. The primary direction was the user's attached futuristic Kashi brief and screenshot: a dense, decaying Indian future civilization, monumental infrastructure overhead, weathered architecture, dusty light, narrow serviced streets and selective neon. The screenshot was studied as a reference; it was not stretched into a game background or distributed as footage.

Read `primary-reference.json`, `artwork-v2-provenance.json`, `city-geometry-manifest.json`, the raw `frames-*.json`, `performance-results.json`, browser test results and the integrity manifests alongside this report. Original AI-generated concept artwork is explicitly separate from real-time gameplay evidence.

## Implemented functionality

### Ten arc-final encounters

Missions 10, 20, 30, 40, 50, 60, 70, 80, 90 and 100 now select original arc boss profiles. Each has two different attack patterns, three health phases, its own movement policy, visual equipment/silhouette and defeat pose. They share a bounded encounter engine, existing player attacks, damage/rewards/save systems and the existing relic/completion handoff.

- 10 Exit Warden: gate ram and shield fan; pursuit; kneeling defeat. Mission 10's four guards and three existing objectives remain before its 1v1.
- 20 Chain Collector: chain hook and debt circles; retreat; unravelling defeat.
- 30 Solar Architect: rotating solar spokes and sunfall; orbit; eclipse defeat.
- 40 Mirror Duelist: mirror cross and echo lunge; sidestep; shatter defeat.
- 50 Monsoon Drummer: jumpable drum rings and thunder grid; anchor; collapse defeat.
- 60 Dune Courier: returning ring and sand cut; strafe; skid defeat.
- 70 Bronze Adjudicator: judgment marks and verdict beams; retreat; bow defeat.
- 80 Bastion Ram: charge and fault lines; pursuit; buckle defeat.
- 90 Siege Astrolabe: siege grid and orbital mortar; anchor; disarm defeat.
- 100 Horizon Keeper: lotus blades and horizon reversal; orbit; lotus defeat.

Bujji's offensive boss assistance is disabled only for these arc duels to preserve genuine 1v1 combat. Companion escort and ordinary enemy assistance remain. Boss health ranges from 650 to 1,100. Hazard counts are bounded; warning line rotation and ring safe-zone geometry were corrected to match collision mathematics, with deterministic endpoint tests.

**Presentation limitation:** these are original procedural mechanical characters with shared structural elements, not finished production character assets. Distinct defeat poses are implemented; ten separately authored cinematic defeat movies/sequences are not. Human playtesting and difficulty balancing remain necessary: the automated counter strategy can win with little damage and does not establish an appropriate challenge for every player.

### Progressive ordinary-enemy difficulty

Existing enemy statistics scale by mission: health up to +50%, damage +35%, movement speed +18% and cooldown reduction up to 18%. Mission 1 remains at its original multiplier. Statistics are cached by mission/type and are used for actual enemy health and AI damage, not just UI labels. Existing attack/control logic was retained.

### Health bars and interface

Player health is 300 CSS pixels wide on desktop; the boss bar is up to 680 pixels. Both show real health values, clear labels and smooth width updates, with a brief player damage pulse and a reduced-motion alternative. There is no invented stamina resource; sprint remains unlimited.

Boss name, phase and attack guidance are visible during encounters. Mobile portrait/landscape sizing is separate. A verified landscape overlap between the status stack and joystick rim was corrected by placing the status toggle alongside the secondary status area. The follow-up recorded zero overlap in Full, Compact and Minimal modes while all touch-control centres remained hittable.

The mission archive has stronger hierarchy, compact metadata, rewards/actions before the long description, scrolling cues and original regional artwork. Three regional concept images are reused across cards; these are not 100 unique mission illustrations. Existing 100-slot/10-arc navigation, settings, save semantics and Phase 5.4D refinements remain.

The new live 3D main-menu city is opt-in with the new environment. The production default preview was not replaced. Existing loading, pause, completion and game-over interfaces were regression checked rather than redesigned again.

## Environment prototype and honest visual assessment

The new scene is a contiguous replacement composition behind an opt-in branch, not merely additional ornaments over the old district. It includes connected street/ghat geometry, multi-layer façades, temples, arcades, balconies, jali details, industrial overhead transit structures, cables, service equipment, advertisements, restrained cargo motion, water treatment and four licensed foreground civilians using existing licensed character sources.

The core is 20,986,296 bytes, 256,176 triangles and six merged material batches. Separate north, market and temple detail chunks are requested by camera proximity instead of fetching all fine geometry up front. Their manifest records sizes and triangles. Existing stone maps are reused without changing the originals. Material instances and texture ownership are managed per clone. Building footprints, stair colliders and river-edge safety geometry follow the new composition while preserving the combat route.

The existing loading lifecycle now waits for the real player model, city core, near detail and civilian readiness before releasing the city gate. The procedural player-loading fallback is not treated as the final actor. A menu render-loop priority bug was found and corrected: the preview no longer takes over rendering without making a render call. The opening preview camera was moved out of a building to the river side.

**Remaining visual limitations:**

- Actual screenshots still show simplified, repeated façade modules, large flat surfaces and obvious procedural architecture. Industrial scale and overhead infrastructure are closer to the direction, but the environment is not reference-quality.
- Four foreground civilians are not a dense living city. Vendor behaviour, crowds and environmental storytelling remain sparse.
- Water/shoreline and distant skyline detail remain below the target; full art review of all traversable ghat stairs is outstanding.
- The street is intentionally kept navigable for existing encounters; its broad open combat route does not reproduce the reference's narrow, crowded composition.
- Shared stone maps and lighting do not replace authored weathering, custom material variation and detailed hero architecture.
- Distance-loaded chunks are not a complete multi-resolution LOD/occlusion system. The merged core has coarse culling and a roughly 20 MiB geometry transfer; further art/asset work needs explicit performance review.
- Mobile Full HUD is denser than Compact/Minimal. Short landscape mission selection requires scrolling to launch; it is not claimed that every card/action fits above the fold.

No AAA or Kalki-quality acceptance is claimed from canvas size, concept artwork, fog or screenshots.

## Actual screenshots

These are browser captures of the implemented scene/interface, not generated promotional renders. Desktop comparisons were captured with CSS canvas and WebGL buffer both verified at 1920×1080.

- Before menu: [baseline-menu.png](phase54e-20261113/baseline-menu.png)
- After opt-in 3D menu: [opt-in-city-menu.png](phase54e-20261113/opt-in-city-menu.png)
- Before gameplay: [baseline-gameplay.png](phase54e-20261113/baseline-gameplay.png)
- After actual gameplay: [opt-in-city-gameplay.png](phase54e-20261113/opt-in-city-gameplay.png)
- Actual city combat: [opt-in-city-combat.png](phase54e-20261113/opt-in-city-combat.png)
- Mission archive: [ui-final-desktop-missions.png](phase54e-20261113/ui-final-desktop-missions.png)
- Desktop boss health/framing: [ui-final-desktop-boss.png](phase54e-20261113/ui-final-desktop-boss.png)
- Portrait boss/HUD: [ui-final-portrait-boss.png](phase54e-20261113/ui-final-portrait-boss.png)
- Corrected landscape Full HUD: [ui-landscape-final-landscape-hud-full.png](phase54e-20261113/ui-landscape-final-landscape-hud-full.png)
- Mission 1 natural relic/ending handoff: [mission-1-keyboard-relic-collected.png](phase54e-20261113/mission1-regression/mission-1-keyboard-relic-collected.png)
- Mission 1 completion: [mission-1-keyboard-victory.png](phase54e-20261113/mission1-regression/mission-1-keyboard-victory.png)
- Mobile Bujji chase: [portrait-ground-chase.png](phase54e-20261113/chase/portrait-ground-chase.png)

Each boss has `boss-N-intro.png`, `boss-N-defeat.png` and `boss-N-victory.png` in the evidence directory. Completion/game-over screenshots from the UI suite are labelled UI fixtures, not natural-completion evidence; separate combat tests provide actual completion evidence.

## Performance conditions and results

Matched baseline versus opt-in city: three 20-second windows per menu/exploration/combat scenario, with five seconds of warm-up, Balanced quality, headless Chrome, requested high-performance GPU and verified 1920×1080 WebGL drawing buffer, 1920×1080 CSS canvas, DPR 1. WebGL identified the NVIDIA GTX 1650. Loading waits were recorded separately. AC was reported online before the matched benchmark and again after validation; no power setting was changed.

The baseline was built from the pre-E source backup without overwriting the working tree. Individual runs, system RAM/GPU snapshots, long tasks and raw frame records remain available. One auxiliary Node unit-test run occurred during part of the benchmark and is a background-load confound. The before/after comparison does not prove causation or guarantee a general performance improvement.

Combined results across the three windows per scenario (FPS; median/p95/p99/worst milliseconds; count above 100 ms):

- baseline / menu: **28.53 FPS**; 34.6 / 35.0 / 48.5 / **886.1 ms**; 13 gaps above 100 ms.
- baseline / exploration: **28.63 FPS**; 34.6 / 35.4 / 53.6 / **1577.4 ms**; 8 gaps above 100 ms.
- baseline / combat: **28.38 FPS**; 34.6 / 35.3 / 42.3 / **688.9 ms**; 11 gaps above 100 ms.
- opt-in-city / menu: **29.92 FPS**; 34.7 / 35.0 / 36.0 / **131.7 ms**; 2 gaps above 100 ms.
- opt-in-city / exploration: **29.99 FPS**; 34.6 / 35.3 / 37.8 / **42.3 ms**; 0 gaps above 100 ms.
- opt-in-city / combat: **29.98 FPS**; 34.6 / 35.4 / 37.7 / **94.8 ms**; 0 gaps above 100 ms.

`performance-results.json` retains every repetition separately; `performance-summary-and-gaps.json` and `all-gaps-over-100ms.md` contain all 34 measured gaps above 100 ms, exact UTC timestamps, preceding render calls and overlapping long tasks. No averages-only acceptance is used.

The new city exploration/combat windows had no gaps over 100 ms, but menu gaps of 131.7 and 124.6 ms remain. They overlapped preceding measured renderer calls of 128.2 and 121.5 ms, respectively, and browser long tasks of 129 and 122 ms. This localizes the occupied API interval; it does not identify the underlying WebGL/GPU/driver dependency.

The baseline's 1,577.4 ms exploration gap overlapped a 1,563.5 ms render call. Other baseline interruptions, such as the 496.8 ms combat gap, did not spend most of the interval inside the measured render call. These are not one established common root cause.

### One bounded follow-up capture

`bounded-menu-results.json`, `bounded-menu.cpuprofile`, `bounded-menu-trace.json` and `bounded-diagnostic-assessment.json` preserve two 30-second menu windows. Without profiling: 29.97 FPS, median 34.6, p95 35.0, p99 41.5, worst 97.2 ms. With CPU profiling/trace: 29.97 FPS, median 34.6, p95 35.0, p99 41.7, worst 48.6 ms. No severe event reproduced; no root cause was established.

The trace requested a 32 MiB browser memory ring and produced 32,379,889 serialized bytes / 175,506 events, with approximately 30.25 seconds of timestamp coverage; CPU profile duration was 30.41 seconds. Output transfer was capped at 100 MiB and was not truncated. No explicit overflow markers were found. This is not a kernel trace, and absence of those markers does not prove zero system event loss. Paging, GPU queue waits, kernel renderer-thread blocking stacks and a complete cross-adapter wait chain were not obtained. No circular ETL recovery helper was used or old evidence overwritten. The capture stopped at the documented bound rather than opening another driver investigation.

**1080p/30 FPS remains a target, not a global acceptance result.** The short city gameplay windows are encouraging, but p95 is around 35 ms rather than strictly 33.3 ms, menu interruptions remain, and long-session/hardware-mobile certification is absent. The historical 533.6 ms ending gap, 4,051.2 ms transition gap and prior severe stalls remain documented, not silently marked fixed. The existing bounds optimization was preserved, not expanded or retuned by this phase.

## Regression evidence

- `boss-final-unit-tests.json`: ten profiles, twenty unique attacks, all three phases, bounded runtime/hazards, progressive scaling and warning/collision transform checks passed.
- `boss-browser-strict-results.json`: actual ordinary-input duels for Missions 20–100 passed; all phases, both attack patterns, defeat, relic, actual rewards and save/reload were recorded. Disposable unlocked-chapter fixtures were used solely to reach each chapter; no real campaign unlocks were bypassed, and health/boss victory was not forced.
- `mission10-browser-results.json`: original guards/objectives, new Exit Warden duel, relic, cinematic readiness and saved rewards passed using ordinary inputs.
- `mission1-regression/mission-playthroughs-guarded.json`: full opt-in city Mission 1 replay, movement/sprint/dodge/attacks, arena/boss, relic and ending/completion passed. Existing saved rewards and progress survived reload without duplication.
- `chase/contract-live-results.json`: Mission 2 contract intro/pause, actual touch duel, finish, touch chase, chase pause/resume, outro, restored main-game state, persistent completion and natural replay intro passed. Duel ended at 87 health; chase integrity 78 with one collision. This is browser touch emulation, not a physical-device claim.
- `ui-regression-corrected-results.json`: desktop 1920×1080, laptop 1280×720, portrait 430×932 and landscape 844×390 checks completed without page errors. Actual joystick movement/release, all HUD modes, settings/navigation, graphics changes, pause/Esc and existing saved rewards were checked. Mobile DPR/buffers are recorded separately and are not presented as 1080p tests.
- `ui-regression-landscape-final-results.json`: corrected landscape Full/Compact/Minimal HUD recorded zero joystick overlap and preserved touch targets, navigation and completion/game-over UI fixtures.
- `validation-command-results.json`: production build and lint exited 0. Four pre-existing MenuScene React immutability warnings and large bundle/build timing warnings remain; none were suppressed.

Test versions: all-boss mechanics ran on strict-duel v5 and Mission 10 on v7; later v9 added tested warning-geometry alignment and presentation changes. Matched performance used v8; its Mission 1 scene/quality is the same as the later presentation-only builds. Final UI, Mission 1 and chase regressions used v11, including the landscape CSS correction. The final production build contains no test-observer injection.

### Failed and limited attempts retained

The first assisted boss run was not accepted as strict 1v1 evidence; Bujji's boss damage was observed, isolated to an arc-only exclusion and the full strict set was rerun. An early relic-approach harness waited for a closer distance than the real auto-pickup threshold and was corrected without changing gameplay.

The first UI suite failed because a role locator could not find an intentionally CSS-hidden pause button on the completion screen. The corrected suite used the element ID and passed. The first Mission 1 harness referenced the scene before canvas mount; a corrected observer fixed that test error. The next ordinary-input Mission 1 attempt genuinely lost to the boss after entering with only eight health; that failed run is retained, not converted into a pass. A subsequent guarded ordinary-input strategy passed without game changes or health manipulation.

The first extra mission smoke attempt passed Mission 3 but asserted movement in Mission 4 before fully waiting for loading holds to release. The follow-up records its readiness condition and individual results separately. Full completion of Missions 3–9 was not repeated in this phase.

Cold empty-browser asset loads occurred in the UI/combat tests. Explicit HTTP-failure injection, all cancellation/retry combinations, exhaustive riverfront collision exploration, every boss on physical mobile, long-session memory testing and ten-boss human balancing are **not tested**. They are not covered by a blanket pass.

### Individual extra mission smoke outcomes

- Mission 3: **PASS** — launch, ordinary keyboard movement/attack input, pause/resume and unchanged save after reload. Full completion not repeated.
- Mission 4: **PASS** — launch, ordinary keyboard movement/attack input, pause/resume and unchanged save after reload. Full completion not repeated.
- Mission 5: **PASS** — launch, ordinary keyboard movement/attack input, pause/resume and unchanged save after reload. Full completion not repeated.
- Mission 6: **PASS** — launch, ordinary keyboard movement/attack input, pause/resume and unchanged save after reload. Full completion not repeated.
- Mission 7: **PASS** — launch, ordinary keyboard movement/attack input, pause/resume and unchanged save after reload. Full completion not repeated.
- Mission 8: **PASS** — launch, ordinary keyboard movement/attack input, pause/resume and unchanged save after reload. Full completion not repeated.
- Mission 9: **PASS** — launch, ordinary keyboard movement/attack input, pause/resume and unchanged save after reload. Full completion not repeated.

See `mission-smoke-results.json` and `mission-smoke-settled-results.json`; the initial failed readiness assertion remains retained.

## Campaign and scope limitations

The archive is honest: 19 currently combat-backed chapters (1–10 plus 20,30,…100) and 81 story plans. Existing unlock prerequisites are preserved. Because intermediate Missions 11–19 and other gaps are not implemented, a normal campaign cannot yet reach the later bosses through a continuous 100-mission journey. Those chapters were not created as placeholders to claim completion. Boss test fixtures do not resolve this product limitation.

The city is an opt-in prototype, not accepted production environment art. Mission artwork is three regional original concepts, not detailed bespoke art for all 100 slots. Boss AI/attacks/defeat poses are implemented; final character production and fully authored unique cinematic finishes remain partial. These distinctions are part of the acceptance decision.

## Integrity, files and rollback

All **47/47 protected hashes match** the pre-E/accepted baseline in `final-changes-and-hashes.json`. `preservation-checks.json` records **165/165** unchanged pre-existing public assets, previous reports, rejected/revised Kashi files, warm-up and bounds-fix records. Existing source changes made during the stopped Phase 5.4D refinement were included in `source-before`, not discarded.

Production source was changed for authorized UI/combat features; it would be inaccurate to claim all production source is unchanged. The original environment's default branch and asset files remain intact. No real user browser profile or saved game was used by testing; test progression lived in disposable contexts.

Modified pre-existing source:

- `src/App.jsx`
- `src/game/BossEncounter.jsx`
- `src/game/bossSystem.js`
- `src/game/BujjiCompanion.jsx`
- `src/game/CombatEnemies.jsx`
- `src/game/combatSystem.js`
- `src/game/GameHud.jsx`
- `src/game/MainMenu.jsx`
- `src/game/MenuScene.jsx`
- `src/game/MissionArtwork.jsx`
- `src/game/missionExpansionContent.js`
- `src/game/MissionOneDistrict.jsx`
- `src/game/MissionSelect.jsx`
- `src/game/player/Player.jsx`
- `src/game/storyCampaign.js`
- `src/game/World.jsx`

New source:

- `src/game/phase54e/arcBosses.js`
- `src/game/phase54e/ArcBossFight.jsx`
- `src/game/phase54e/cityAssets.js`
- `src/game/phase54e/CityEnvironment.jsx`
- `src/game/phase54e/CityMenuScene.jsx`
- `src/game/phase54e/phase54e.css`

New assets are under `public/environment/phase54e/`; generator/tests are under `tools/phase54e/`; diagnostic scripts/builds/raw records stay in the dated evidence folder. Exact hashes, sizes and file paths are in the manifest.

Rollback must be deliberate: stop the server, compare the recorded current hashes to detect subsequent user work, then restore only the listed modified source files from `phase54e-20261113/source-before/`. Leave new evidence/assets intact; they can remain unreferenced. Rebuild and recheck the 47 hashes, save/navigation, Mission 1/2 and one affected boss. Do not copy an entire stale tree over newer work. Removing `environment54e=1` selects the existing production environment immediately and does not change campaign saves. Earlier prototypes remain available.

## Handoff recommendation

Review the actual gameplay screenshots first. Approve the functional combat/UI subset only if desired, while keeping environment visual acceptance and overall Phase 5.4E closure open. The smallest next art step is one authored, varied riverfront/industrial hero block and finished boss presentation, rather than more repetition or post-processing. Separately approve any future stall investigation; this bounded pass did not justify a speculative performance fix.

Do not integrate the city, claim stable 1080p across the game, manufacture missing campaign missions, or start Phase 5.4F from this report. Await user review.

## Final cleanup and storage

All owned Vite preview servers and disposable browser contexts closed through test cleanup. The final check found no listeners on test ports 5530–5541. No unrelated browser or Windows process was terminated. No project files were deleted for storage. C: free space at this check: 31.57 GiB. The 47 hashes were rechecked after the final tests and still match. Source backups, generated assets, raw failed attempts, screenshots and previous reports are preserved.
