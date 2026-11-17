# Phase 5.4E independent review

Review date: 14 November 2026, Asia/Kolkata. Recorded event timestamps remain UTC.

## Decision: REVISE

Do not accept the corrected Kashi environment for production integration. Preserve the passing combat implementation, longer health bars, Phase 5.4D behavior, original production default, opt-in separation and rollback assets. Do not start Phase 5.4F.

Real playable geometry has changed, but the screenshots still show a procedural prototype rather than the requested dystopian futuristic Kashi. Unexplained gameplay gaps remain. Build success does not resolve either problem.

## Method and evidence confidence

This is an independent re-evaluation of existing artifacts, not newly executed gameplay or external certification. No game, server, build, benchmark or optimization was launched. Only this requested document was created. No source, asset, campaign save, previous report or raw evidence was modified.

I opened every PNG in the supplied archive: 45 game screenshots plus one reference image. The archive contains 48 files because it also includes index.html and README.txt. ZIP CRC passed. Every archived PNG matches the corresponding existing visual-review file byte-for-byte. All desktop game screenshots are 1920x1080; the emulated landscape and portrait screenshots are 1688x780 and 860x1864. The reference is 960x535. These screenshot dimensions alone are not drawing-buffer proof.

I checked recorded test scripts and JSON, recalculated all 36 main comparison-window distributions and all ten successful boss distributions, checked camera matrices, and recalculated the 47 protected hashes against the initial/final/earlier Phase E manifests. Reported distribution arithmetic matches raw frames. This verifies records, not fresh playtesting.

Input SHA-256:

- phase54e-visual-correction-report.md: fad67e7c90a9b5a4d307e3a3eca682e6879b64dc1077a345b6c016c9fcfc4920
- phase54e-visual-correction-review.zip: fe35ebad0a5de70a977d2201fe26e10c9352d3740ba2932b72da915efb5bc92f

### Comparison limitations

All 13 before/after view and projection matrix differences recompute to zero, with recorded 1920x1080 drawing buffers. These compare the first rejected prototype with the correction, not 13 production-default views. Player positions and animation times differ. The overview and arena camera poses are diagnostic views, not proof of normal gameplay visibility.

Before-arena 20/30/50/70/80/90/100 are exact duplicate images; 40/60 are another duplicate pair. They mostly show empty floor/fog and peripheral frontage. The comparison demonstrates added scenery at those poses, not transformation of ten previously complete locations. After-menu and after-missions duplicate the final production-bundle opt-in captures. Duplication does not establish fabrication, but must not inflate coverage.

## Severity-ranked visual findings

P1 blocks requested production acceptance. P2 requires correction or explicit acceptance as a limitation. P3 is smaller polish. No save-corruption or destructive defect was found.

### P1-V1: Unfinished foreground dominates normal gameplay

Evidence: after-street-spawn, after-street-forward, production-opt-in-gameplay.

Large crossed grey drone bars, orange spheres, black dome-like bases, conical traps, flat barriers and faceted gold/teal pickups visibly retain placeholder-quality construction. They dominate the player view and conflict with the human characters and new shop architecture. The preservation of mechanics does not require acceptance of unfinished visual meshes.

Required correction: improve only the unprotected visible meshes/materials of the prominent drone/barrier/trap/pickup cluster. Preserve transforms, colliders, damage, IDs and behavior. Prioritize these exact normal-camera views before adding background objects. Any protected replacement needs separate approval.

### P1-V2: City architecture and composition remain repetitive and synthetic

Evidence: both street pairs, after-wide-city, opt-in menu.

Shop recesses and paving genuinely improve. Nevertheless, repeated shallow arch/window grids, uniform surface treatment, huge planar tower sides and oversized water-level foundations remain conspicuous. The clean straight corridor reads as a cleared combat lane rather than a dense lived-in Kashi district. The wide view emphasizes tower slabs over temples, stepped ghats and neighborhood hierarchy.

The reference has irregular fort/temple silhouettes, crowded lower terraces, dense service layers, monumental overhead infrastructure and dusty light. Warm brown color and arches alone do not meet that standard. This is an assessment of visual language, not a request to copy movie assets.

Required correction: finish one connected street-to-ghat slice with distinct functional building roles, believable floor/door scale, structural depth and coherent foundation/shore joins. Break repetition with authored modules and material logic, not random clutter. Preserve the combat corridor. The central replay does not prove every ghat route traversable; validate the side route separately.

### P1-V3: Ten boss arenas still share a prototype courtyard

All corrected arena screenshots add enclosure, but the shared arch-grid wall, brown palette and floor dominate the theme. Individual observations:

- 10: large arch and repeated facade; little checkpoint-specific service machinery or storytelling.
- 20: chains and grilles suggest confinement; little convincing foundry function/material detail.
- 30: concentric rings and tapered tower give an astronomy motif, but simple surfaces and unclear support.
- 40: four dark panels beneath an arch read as props in the same court, not a developed reflective location.
- 50: vats/outlets over a plain retaining wall; waterworks routing and surface response are weak in this view.
- 60: simple crates and shutters hint at a depot without convincing transit functions.
- 70: canopy/columns/large roof differentiate the center; the tribunal remains sparse and materially uniform.
- 80: square towers and a narrow opening still read strongly as blockout massing.
- 90: blank hangar-like wall, frame and slotted blocks lack mechanism, surface and service detail.
- 100: nested arches and tapered shrine are recognizable, but the same court and material repetition remain.

Required correction: keep combat bounds and attack logic. Give each arena a distinct hero structure, floor/material identity and functional environmental story visible from an active fight. One thematic prop on the shared wall grid is insufficient.

The active Chain Collector screenshot also shows visibly primitive/disconnected head, arm and body forms. Functional attack variety does not establish finished character presentation. Improve only unprotected boss presentation within an approved art scope; preserve the coded attack and defeat-pose behavior.

### P1-V4: Portrait Full HUD obscures the player

Evidence: ui-final-portrait-boss.png.

The left health/score/Overdrive/companion stack overlaps the player's upper-body region. Landscape touch buttons occupy a large lower-right area. Existing hit tests check button access and vitals-versus-joystick overlap, not player/attack visibility. Boss health is readable and prominent, a positive to preserve.

Required correction: define a projected player/telegraph safe area, then reflow portrait secondary status around it. Keep long health bars, all information and usable controls. Contextual disclosure may help; removing information or inventing stamina is not required. Validate all HUD modes with actual gameplay silhouettes, not DOM rectangles alone.

### P1-E1: Default-production menu screenshot is visibly unready despite PASS

Evidence: production-production-menu.png shows an essentially blank brown/green background behind menu controls. No city is visible.

The production smoke script waits for PLAY and a fixed 2.5 seconds before the image; it does not assert background geometry has rendered. Later gameplay is visible. Therefore a persistent renderer defect is NOT established, but the claimed smoke PASS is NOT evidence of menu visual readiness.

Required correction: distinguish slow loading from a hidden/failed scene. Verify the first actual background frame and a truthful loading/fallback presentation. Do not merely increase an unexplained sleep or substitute concept artwork. Preserve the current failed visual observation.

### P2-V1: Civilians and environmental activity remain limited

The two detailed civilian bases improve on primitive people, but sparse repeated dark outfits and restrained roles do not convey the reference's diverse street life. Twenty-four instances are not twenty-four distinct characters. Static images cannot certify gait quality, foot contact or sustained interactions. Source confirms ambient vendor/customer/walk behavior, not commerce simulation.

Correction: improve a few foreground role silhouettes, clothing and grounded interactions before increasing count. Crowd rendering is already a measured cost. Preserve license provenance and measure the visible actor budget.

### P2-V2: Lighting, materials and riverfront are below target

Corrected shadows and paving improve readability, but left facades and player remain dark, surfaces broadly share a brown response, and tiling/edge uniformity remain visible. The reference has stronger dusty backlight, localized highlights and depth separation. Wide-view water is flat-looking with abrupt foundation contact and sparse river life.

Correction: local roughness/normal/color variation tied to use, age and water contact; credible ghat joins/contact detail; controlled fill that preserves actor/telegraph readability. Do not hide missing structure with fog, blur or bloom. Compare costs without lowering resolution/shadows.

### P2-V3: Infrastructure is clearer in the menu than normal play

The menu shows bridge decks, cables and repeated KASHI signs. Street views primarily show cables/small banners; they do not demonstrate the reference's dominant overhead infrastructure. A diagnostic wide camera cannot substitute for normal-play visibility.

Correction: compose one coherent transit/service structure and an advertising hierarchy within existing normal gameplay sightlines, preserving combat visibility. Adding signs everywhere is not the solution.

### P2-V4: Real menu/card imagery is honest but not cinematic

Warm UI colors and hierarchy remain coherent; Continue is primary and text is readable. However, the corrected menu presents an empty-looking straight street and broad flat bridge slab. Mission cards now show actual gameplay but emphasize pavement, rear-facing player and simple pickups more than distinctive locations. Authentic captures improve honesty, not automatically art quality.

Correction: curate real rendered viewpoints and crops around recognizable mission environments, retaining truthful planned/prototype labels and all navigation. Compose usable negative space without abandoning street activity.

### P2/P3 responsive and semantic issues

- Landscape first launch action ends at 670.84 CSS px in a 390 px-high viewport. Scrolling is required; broken scrolling is not established. Retain clear cues and reduce overhead or expose a compact launch path.
- Landscape boss/player panel rectangles overlap at an edge by about 1.77x13 CSS px. Small, but not a zero-overlap result.
- Expanded boss objectives show ARC-FINAL DUEL 0/0, PURSUERS 0/0 and an instruction to advance to the arena while the boss is already active. Correct contextual copy/visibility without changing mission logic.
- Pause/completion have a coherent warm system and clear action hierarchy. Completion is an explicit fixture, not victory evidence.
- Settings has navigation/scroll cues, with lower instructions partly behind/below its footer at the captured position. Verify last-row access; do not assume inaccessibility from this frame.
- The ZIP does not include every mobile menu, every HUD mode, loading or game-over screenshot. Some separate logs/screens cover them, but archive coverage should not be overstated.

## Performance: observations are valid, root causes remain bounded

### The 239.1 ms Mission 80 gap

Exact interval: 2026-11-13 21:16:07.571 to 21:16:07.810 UTC, or 14 November 02:46:07.571 to .810 IST. The journal starts after boss activation and is restored before relic/ending handling, so this is an active fight gap, not loading or cinematic playback.

The previous synchronous render call is 38.4 ms. The gap to the next render START is 239.1 ms, leaving about 200.7 ms outside that previous measured call. The next render takes 26.6 ms AFTER the gap endpoint. This is about 7.2 nominal 33.3 ms budgets. Mission 80 records average 28.52 FPS, p95 35.2 ms, p99 182.2 ms, max 239.1 ms. Its p95 masks clustered interruptions.

Confirmed: a long active-combat render-start interval. Unresolved: the responsible operation/subsystem. Simulation/React/GC, scheduling, driver/compositor/GPU synchronization and measurement effects are hypotheses. Missing correlated stacks, hard faults and GPU-completion events prevent attribution. Short synchronous render calls do not exclude GPU waits elsewhere.

Mission 80 has ten >100 ms gaps in two clusters. Mission 60 adds one 175.8 ms gap. Eventual victories do not satisfy a no-unexplained-interruptions gate.

### Other stalls and rendering-path localization

Raw-frame recalculation agrees with both cohort summaries:

- Earlier main comparison: 23 gaps >100 ms, including 620.3 ms baseline exploration and 327.9 ms corrected combat.
- Final main comparison: two gaps >100 ms, both baseline menu (125.0/132.4 ms); no >100 ms corrected final windows.
- Successful boss journals: eleven gaps >100 ms.

239.1 ms is the worst BOSS gap, not the worst measurement anywhere.

Some earlier gaps have stronger localization: the 327.9 ms corrected combat interval includes a 238.0 ms PRECEDING render call and overlapping long tasks with unknown window attribution. Earlier 270.6/301.7 ms intervals also include long render calls. Baseline menu gaps largely coincide with long render calls. This establishes elapsed time inside the rendering API path, not a specific shader/mesh/GPU cause. The 620.3 ms baseline gap has preceding/current renders of only 7.2/13.5 ms and no overlapping recorded long task; that absence does not prove a Windows/driver cause.

### Contributor versus unshipped experiments

Visible/hidden/restored crowd comparison gives about 25.48/30.00/25.78 FPS and roughly 30-to-9 ms mean render-call reduction when hidden. This supports crowd rendering as a contributor in THAT scene/session. It does not attribute the Mission 80 arena interruption to civilians. Hiding is diagnostic-only, not shipped.

Skeleton sharing/batching did not establish reliable benefit; leaving them unshipped was appropriate. Their assessment records contain 19 additional >100 ms gaps: seven sharing-sample events (max 295.8 ms) and twelve batching-assessment events (max 312.2 ms). Disclose them separately; do not treat unshipped modes as the corrected default. Optional LOD reduces triangles but shows no demonstrated FPS gain; its four short samples have no >100 ms gaps. Its reused JSON toggle name batch should be read with the assessment script, not mistaken for shipped batching.

### Final near-30 FPS cohort is not full acceptance

Final corrected exploration/combat averages are 29.35-30.00 FPS, p95 35.5-40.3 ms, p99 36.6-53.4 ms, max 39.2-76.3 ms. Actual WebGL buffers are 1920x1080, DPR1, GTX 1650. Each stage is only 20 seconds. The near-street combat scenario mainly approaches and guards; it does not replace full encounters.

The observer-enabled builds have timing distributions; the final uninstrumented bundle has smoke evidence only. Available RAM is very low (about 97-378 MB). Power is AC during one recorded check and battery at cleanup; the change time is unknown. Dedicated GPU snapshots around 400-597 MiB do not establish peak residency or WDDM pressure. Neither paging nor VRAM pressure is established as the cause. Improved later windows cannot be credited solely to the small layout changes under these uncontrolled conditions.

Historical 533.6 ms and 4051.2 ms ending-transition incidents remain inherited limitations, not newly reproduced or fixed results in this package. Stable campaign-wide 1080p/30 FPS is not established.

## Functional claim verification

PASS below means supported by ARCHIVED execution evidence, not tests rerun in this review.

### Boss encounters: bounded support, with important qualifications

Mission 10 has a separate successful guard/objective/fight record. Strict suite 20/30 passes before Mission 40 times out at spawn. Remaining suite 40-100 records successful fights. Each successful run records phases 1/2/3, both attack names, boss health zero, relic/ending handoff, 2500/750 boss/relic rewards and equal reloaded saves. Initial boss buffers are 1920x1080. Scripts use ordinary movement/attack/guard/dodge/jump events, not teleports or forced wins; isolated unlocks are setup fixtures.

Source has ten attack-pair profiles and ten distinct coded defeat-pose branches. Deterministic results support bounded hazards and telegraph alignment. This supports functional variety, not cinematic models, human balance or touch victory for every boss.

Qualifications requiring accurate reporting:

- Remaining approachEvidence contains THREE ordinary key re-press recoveries, not just the one timeout emphasized in the summary. Entries lack per-entry mission IDs and UTC timestamps. Do not confidently assign each recovery from the unlabelled list. Zero movement input with running clock/no pause/no cinematic supports an input/activation/automation issue rather than a proven collision lock; exact origin remains unknown. The original failed Mission 40 entry stays RUNNING under an outer failure, not PASS.
- Boss scripts press Enter soon after video initialization. readyState is 4, but playback time is zero for 10/20/100 and only about 0.021-0.045 seconds for the others. Supported: initialization and skip-to-reward flow. NOT supported: uninterrupted natural ending playback. Zero time alone also does not prove a production video defect.
- All ten wins are keyboard-driven. Mobile UI approach also uses keyboard; its real touch-stick check is separate.
- The campaign discloses 10 original prototypes, 9 extra arc duels and 81 planned chapters. Fixture unlocks do not establish a normal route through all later bosses. One hundred archive entries are not one hundred completed missions.
- Generic enemy difficultyFor caps its health/damage/speed/cooldown increases by roughly Missions 13-16; boss stats keep scaling. A nondecreasing-health unit assertion allows plateaus, so it does not prove ordinary-enemy difficulty rises throughout 100 missions. Clarify intended scope before unrelated balancing changes.

### Mission 1 replay

Recorded completed-save replay supports movement/unlimited sprint/dodge/jump/attacks, enemy and boss defeat, relic/completion, save reload and no repeated reward. Ending is skipped/continued. The early renderBuffer sample is 300x150, captured before scene readiness: it cannot certify 1080p throughout this playthrough. Separate native-1080 samples are valid for their own scopes. It also does not establish that the whole mission rendered at 300x150.

### Bujji / Mission 2 contract

Portrait result supports duel (four counters, three patterns), real touch steering/brake/acceleration, chase completion at z=180 with integrity 56 and two collisions, pause freeze, outro/camera restoration and baseline main-state/save equality. Bounty completion persists; saved contract replay reaches duel through an unskipped intro. This is useful tested preservation. It is not a new full Mission 2 campaign boss/pylon-completion run or physical-mobile FPS result.

### UI, loading, build and lint

Four-layout logs support menu/settings, basic lock rules, all HUD modes, hit-testable touch controls, pause/Esc/navigation and reward preservation. Completion/game-over use explicit UI-state fixtures. Tests check ten arc tabs, ten cards on the selected arc and one locked arc, not every mission unlock rule individually. Touch accessibility does not override the visible portrait occlusion.

Initial emulated buffers of 860x1864/1688x780 do not establish the intended mobile pixel budget. Graphics toggles change actual buffers, but sustained physical-mobile performance is untested.

The final injected-503 test supports recoverable arena error, retry, actual arena/player readiness, clock release and semantic save preservation on exit. Retained failures are harness errors (observer reference, wrong button label, JSON property-order equality). No production repair should be credited for those. All ghat routes, cancellation cases and natural endings are not comprehensively covered.

Build log shows success plus chunk/timing advisories. Lint records four existing MenuScene warnings and one new CorrectedCity mixer immutability warning; these are correctly disclosed. No warning-free claim is justified. No build/lint was rerun here.

## Integrity finding

Initial, final and earlier Phase E manifests each contain 47 UNIQUE protected paths. Expected values agree across all three. Current SHA-256 recalculation matches every expected and recorded actual value: 47/47. No duplicate/missing paths were found in that defined set.

The recorded changed/new source and correction-asset hashes still match disk. The 120 files reported as unchanged still match their initial source hashes. This supports the preserved baseline, not art quality or arbitrary future safety. Personal browser save storage was not accessed during this review.

## Exactly what blocks production acceptance

1. Normal-play foreground, architectural composition, riverfront, civilians and ten arena identities fall below the explicit visual standard.
2. Portrait Full HUD covers the player despite passing control hit tests.
3. Unexplained 175.8-239.1 ms active-boss gaps violate the stability gate.
4. Short instrumented windows, very low RAM and unlogged power changes limit repeatability claims.
5. Blank default-menu capture and near-zero video-time snapshots leave visual readiness/natural playback unproved.
6. Three input re-press interventions remain unclassified; later wins must not erase them.

Physical-device validation and normal campaign reachability remain scope limitations. If full original Phase E acceptance requires a normal route to every boss, that gate is open. Do not silently expand a focused correction into 81 new missions; explicitly distinguish prototype availability from campaign completion.

## Targeted remaining-work order (proposal only)

1. Keep mechanics/fallback intact; approve one normal-camera street-to-ghat slice and foreground prop set before expanding the city.
2. Replace the unprotected placeholder-looking visual treatment and author the visible functional facades, shoreline joins and infrastructure sightline. Preserve collision/attack rules.
3. Finish arena identity and a few foreground civilian roles within measured rendering budgets, retaining the verified attack/defeat systems.
4. Correct portrait visibility, active-boss objective copy and cold-menu readiness; keep prior failed screenshots.
5. Perform a bounded diagnosis of Mission 60/80 intervals, input activation and natural ending playback before any optimization. No speculative resolution/shadow/AI cuts or broad driver/BIOS/registry investigation.
6. Revalidate only affected paths and submit real-game evidence for user acceptance. No automatic integration.

## Proposed acceptance gates (not results already achieved)

### Visual

- User approves normal-camera spawn/forward street, connected ghat route, menu/selection and all ten active boss arenas. Keep locked before/after matrices and actual buffer metadata; include an uncut traversal/fight clip to assess animation/readiness.
- No dominant foreground object reads as an unfinished cross/dome/cone/blockout assembly. No protected replacement without separate approval.
- Reviewed block has clearly distinct temple, occupied shop/house and service/industrial structure roles, credible scale and foundation/shore interfaces. Verify street-to-water access and back without invisible walls or teleports.
- Infrastructure is prominent from normal play; each arena differs by composition/function/materials, not only a prop against the same wall grid.
- Player head/torso and critical telegraphs remain unobscured in Full/Compact/Minimal HUD at desktop, portrait and landscape sizes. Keep long readable health bars and all information/controls. Sprint remains unlimited.
- Show the first real menu-background frame or truthful loading/fallback state; no blank view presented as ready. Mission artwork stays actual playable content with deliberate crops.

### Performance

- Same accepted quality, GTX 1650 and actual 1920x1080 buffer; record CSS/DPR/adapter/build plus continuous power and memory conditions. Do not lower resolution to pass.
- Proposed approximately-30 FPS tolerances per accepted active-play window: average >=29.5 FPS, median <=35 ms, p95 <=40 ms, p99 <=50 ms, maximum <=100 ms. Nominal budget remains 33.3 ms. These are proposed review thresholds, not exact-30 proof or current passes.
- Three comparable >=60-second exploration/combat samples where duration permits, full natural encounters, and at least three successful repeats of the problematic Mission 60/80 scenarios. Do not pad completed fights artificially. Record every >100 ms gap; replace invalid samples only with explicit timestamped reasons, never silently discard slow runs.
- No unexplained >100 ms active-gameplay interval in acceptance evidence. If limits remain, obtain explicit acceptance rather than hiding them behind averages. Include a bounded final-bundle/observer-disabled distribution, not just smoke checks.
- Separate cold loading, preparation, intro, active play, relic handoff and ending. Demonstrate advancing video time and natural completion; keep 533.6/4051.2 ms historical limitations open until matched evidence closes them.
- Mobile needs its own measured profile/device criteria; emulation alone cannot certify physical performance. Explicitly scope any unavailable-device limitation.

### Functional and preservation

- Affected-path regression: Mission 1 replay/relic/natural ending, Mission 2 contract/chase, all ten existing boss attack/defeat/reward flows and touched keyboard/touch/UI paths. Retain prior completed work.
- Input logs identify mission/round/build/UTC and distinguish gate activation from lost held keys. No unreported recovery intervention in a claimed clean pass.
- Label fixtures, seeded unlocks, ordinary wins, skips and full playback separately. Keep the 19-prototype/81-planned disclosure unless content is actually completed.
- Build/lint pass with warnings separately identified; expected 47/47 protected hashes match before/after; saves and rewards persist without duplication/reset. Maintain rollback and default environment until explicit integration approval.

## Evidence index

- [Original correction report](phase54e-visual-correction-report.md).
- [Gallery](phase54e-visual-correction-20261113/visual-review/index.html).
- [Final comparison](phase54e-visual-correction-20261113/performance-final/performance-results.json).
- [Earlier comparison](phase54e-visual-correction-20261113/performance/performance-results.json).
- [Boss frame summary](phase54e-visual-correction-20261113/tests/boss-frame-summary.json).
- [Strict bosses](phase54e-visual-correction-20261113/tests/boss-browser-strict-results.json).
- [Remaining bosses](phase54e-visual-correction-20261113/tests/boss-browser-remaining-results.json).
- [Mission 10](phase54e-visual-correction-20261113/tests/mission10-browser-results.json).
- [Mission 1 replay](phase54e-visual-correction-20261113/mission1-regression/mission-playthroughs-guarded.json).
- [Bujji chase](phase54e-visual-correction-20261113/chase/contract-live-results.json).
- [UI tests](phase54e-visual-correction-20261113/tests/ui-regression-ready-results.json).
- [Loading recovery](phase54e-visual-correction-20261113/tests/loading-recovery-semantic-results.json).
- [Production smoke](phase54e-visual-correction-20261113/tests/production-bundle-smoke.json).
- [Final hashes](phase54e-visual-correction-20261113/final-changes-and-hashes.json).
- [Build log](phase54e-visual-correction-20261113/production-build.log).
- [Lint log](phase54e-visual-correction-20261113/lint.log).

## All screenshots inspected

- `after-arena-10.png`.
- `after-arena-100.png`.
- `after-arena-20.png`.
- `after-arena-30.png`.
- `after-arena-40.png`.
- `after-arena-50.png`.
- `after-arena-60.png`.
- `after-arena-70.png`.
- `after-arena-80.png`.
- `after-arena-90.png`.
- `after-menu.png`.
- `after-missions.png`.
- `after-street-forward.png`.
- `after-street-spawn.png`.
- `after-wide-city.png`.
- `before-arena-10.png`.
- `before-arena-100.png`.
- `before-arena-20.png`.
- `before-arena-30.png`.
- `before-arena-40.png`.
- `before-arena-50.png`.
- `before-arena-60.png`.
- `before-arena-70.png`.
- `before-arena-80.png`.
- `before-arena-90.png`.
- `before-menu.png`.
- `before-missions.png`.
- `before-street-forward.png`.
- `before-street-spawn.png`.
- `before-wide-city.png`.
- `production-first-gameplay.png`.
- `production-first-menu.png`.
- `production-first-missions.png`.
- `production-opt-in-gameplay.png`.
- `production-opt-in-menu.png`.
- `production-opt-in-missions.png`.
- `production-production-gameplay.png`.
- `production-production-menu.png`.
- `production-production-missions.png`.
- `ui-final-desktop-completion.png`.
- `ui-final-desktop-hud-full.png`.
- `ui-final-desktop-pause.png`.
- `ui-final-desktop-settings.png`.
- `ui-final-landscape-boss.png`.
- `ui-final-portrait-boss.png`.
- `user-reference.png`.

## Complete >100 ms event inventory from reviewed journals

No new measurements were collected. Summary copies are not double-counted. Historical incidents without current raw rows remain inherited observations above.

### Main comparisons: 25 events

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

### Successful boss journals: 11 events

- Mission 60: **175.8 ms**, 2026-11-13T21:13:56.199Z.
- Mission 80: **201.2 ms**, 2026-11-13T21:16:07.571Z.
- Mission 80: **239.1 ms**, 2026-11-13T21:16:07.810Z.
- Mission 80: **182.2 ms**, 2026-11-13T21:16:07.992Z.
- Mission 80: **215.1 ms**, 2026-11-13T21:16:08.207Z.
- Mission 80: **195.0 ms**, 2026-11-13T21:16:08.402Z.
- Mission 80: **188.9 ms**, 2026-11-13T21:16:21.192Z.
- Mission 80: **211.9 ms**, 2026-11-13T21:16:21.404Z.
- Mission 80: **209.4 ms**, 2026-11-13T21:16:21.614Z.
- Mission 80: **212.3 ms**, 2026-11-13T21:16:21.826Z.
- Mission 80: **213.0 ms**, 2026-11-13T21:16:22.039Z.

### Assessment experiments: 19 events (page-relative timestamps)

- crowd-isolation-results.json / shared-skeletons: **100.3 ms**, page time 72010.9 ms.
- crowd-isolation-results.json / shared-skeletons-repeat: **160.7 ms**, page time 87308.6 ms.
- crowd-isolation-results.json / shared-skeletons-repeat: **184.4 ms**, page time 87493.0 ms.
- crowd-isolation-results.json / shared-skeletons-repeat: **164.5 ms**, page time 87657.5 ms.
- crowd-isolation-results.json / shared-skeletons-repeat: **175.6 ms**, page time 87833.1 ms.
- crowd-isolation-results.json / shared-skeletons-repeat: **295.8 ms**, page time 88128.9 ms.
- crowd-isolation-results.json / shared-skeletons-repeat: **173.8 ms**, page time 88302.7 ms.
- batch-assessment-results.json / repeat 1, toggle True: **115.7 ms**, page time 25826.0 ms.
- batch-assessment-results.json / repeat 2, toggle False: **110.6 ms**, page time 20675.9 ms.
- batch-assessment-results.json / repeat 2, toggle False: **237.1 ms**, page time 24808.3 ms.
- batch-assessment-results.json / repeat 2, toggle False: **250.8 ms**, page time 25059.1 ms.
- batch-assessment-results.json / repeat 2, toggle False: **266.8 ms**, page time 25325.9 ms.
- batch-assessment-results.json / repeat 2, toggle False: **252.6 ms**, page time 25578.5 ms.
- batch-assessment-results.json / repeat 2, toggle False: **135.6 ms**, page time 25714.1 ms.
- batch-assessment-results.json / repeat 2, toggle True: **148.4 ms**, page time 25346.4 ms.
- batch-assessment-results.json / repeat 2, toggle True: **128.2 ms**, page time 25474.6 ms.
- batch-assessment-results.json / repeat 2, toggle True: **154.9 ms**, page time 25629.5 ms.
- batch-assessment-results.json / repeat 2, toggle True: **287.7 ms**, page time 25917.2 ms.
- batch-assessment-results.json / repeat 2, toggle True: **312.2 ms**, page time 26229.4 ms.

**Final recommendation: REVISE Phase 5.4E.** Keep the passing work, address the visible blockers and specific evidence gaps, then seek explicit review. This document authorizes no implementation, integration or Phase 5.4F.
