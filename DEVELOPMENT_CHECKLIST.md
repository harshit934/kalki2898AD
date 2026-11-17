# Kalki Game Development Checklist

Current focus: Phase 2 remains OPEN. Cycle 3 improved the rigged character candidate, weapon socket alignment, animation handling, camera escape routes and decorative-light cost. Mission 5 production victory, restart and the 2,500-point saved reward were verified again on 2026-11-07. The current save retains seven completed chapters and Mission 8 available. Reference likeness, comprehensive camera/collision coverage and consistent 60 FPS remain unaccepted. The original permanent freeze remains unexplained. See phase2_cycle3_report.json for measured evidence and limitations; older verification notes below are historical.

## Permanent campaign requirement: distinct arc environments

Recorded 2026-11-07. Before implementing any new arc environment, read **campaign-environment-requirements.json** and inspect the current campaign, mission and environment files again. That file records the inspected architecture, separate concepts for Arcs 2–5, directions for the remaining arcs, and implementation/acceptance gates.

- Every arc must be recognizable from an unlabelled gameplay screenshot through geography, architecture, terrain and atmosphere. Recoloring or redecorating a reused map does not pass.
- Arcs 2–5 require independent terrain, building kits, route topology, landmarks, sky/weather/lighting, hazards and mission-appropriate encounters. Preserve all existing mission purposes, IDs, order and saved progression.
- Current concepts: Arc 2 suspended Complex logistics and enclosed lift infrastructure; Arc 3 peripheral drainage basin and frontier pursuit routes; Arc 4 concealed Shambhala river valley and cliff sanctuaries; Arc 5 exposed outer defenses, basalt ravines and siege frontier. These are design directions, not implemented maps.
- Arc 5 must preserve story-required Shambhala defense continuity without replaying Arc 4's valley map. Ashwatthama remains a principal, gradually revealed Arc 4 character in Missions 31–40.
- Apply the same uniqueness requirement to the remaining arcs in the 100-mission campaign. Stream active environments, batch within each unique architecture kit, and measure integrated-GPU performance; do not assume 60 FPS.
- Only Missions 1–10 are currently playable. Do not present later archive entries or these concepts as completed environments. Do not rewrite completed missions to implement this requirement.

## Permanent campaign requirement: distinct arc enemies

Recorded 2026-11-07. Read **campaign-enemy-requirements.json** before future enemy implementation. It records inspection of the current campaign, roster, rigged models, boss model/phase systems and mission spawns, plus faction concepts for all ten arcs.

- Every arc must introduce genuinely distinct faction lore, silhouettes, body/armor/clothing/helmet/face designs, weapons, basic/elite/heavy/ranged/special roles, combat behaviors, bosses and appropriate animations. Recoloring, renaming or scaling an existing guard or boss does not pass.
- Arcs 2–5 concepts respectively: Custodial Directorate logistics security; Trailbound Compact trackers; Veilbreak Survey sanctuary hunters; Obsidian Breach Corps siege troops. These are original design proposals, not implemented content or film canon.
- Preserve all existing missions, story choices, progression and saves. Arc 5's new corps remains part of the established Complex threat; Arc 4 enemies support Ashwatthama's existing protective storyline in Missions 31–40.
- Reuse technical AI/navigation/damage systems where practical, not defining models or identical movesets. Introduce units and counterplay gradually through existing mission purposes.
- Current shared soldier bodies and shared expansion-boss infrastructure do not satisfy the future-arc requirement. Later arcs require explicit rosters and authored encounters, not the Mission 1 fallback.
- Apply this requirement across all 100 missions. Use streaming, LOD, bounded encounters/effects and measured integrated-GPU budgets. Keep future campaign implementation deferred while Phase 2 acceptance remains open.

## Phase 2 target schedule and acceptance

User target recorded 2026-11-07: **2–4 days of focused development and testing**, an estimate rather than a completion promise. Priorities remain reference likeness, camera obstruction/stability, collision coverage across available environments, the unexplained shadow anomaly, measured progress toward 60 FPS, investigation of the original unexplained permanent freeze, and final production regression including Mission 5 victory/rewards/restart/saves. Do not close the phase or rush acceptance to meet the estimate. Keep future campaign implementation separate. Provide a final acceptance report with actual evidence and unresolved issues.

## Permanent campaign requirement: Ashwatthama

User requirement recorded 2026-11-07. Keep this requirement through future development cycles. It is future narrative work, not a reason to rewrite completed missions or interrupt the current Phase 2 reliability work.

- Introduce Ashwatthama in the existing Campaign 1 Arc 4, **Shambhala & Ashwatthama (Missions 31–40)**. Preserve all current mission IDs, titles, sequence, unlocks and saves. Do not insert him into Mission 5.
- Treat him as a principal character whose protective duty and connection to the larger Kalki mythology affect the campaign's objectives, alliances and later stakes. He must not be a disposable quest giver or simple side character.
- Character direction for later scripts: an ancient, disciplined warrior carrying the weight of past violence and an enduring oath. His restraint, guarded compassion and resolve should emerge through decisions and conduct. Develop the cost and purpose of his continued struggle gradually rather than delivering his full backstory in one exposition scene.
- Bhairava relationship: build tension between Bhairava's immediate self-interest and Ashwatthama's duty, then earn respect through shared danger and consequential cooperation. Preserve already-established Bhairava decisions and the existing later revelation sequence.
- Use the existing Arc 4 missions for a staged introduction: environmental traces and testimony first, a dedicated cinematic first encounter, missions that demonstrate his protective purpose, then the existing **Ashwatthama’s Oath** chapter for a partial disclosure. Subsequent defense missions must show the consequences of his involvement.
- Include dedicated mission roles, original dialogue, cinematics and significant interactions with Bhairava and the existing cast. Spoken game dialogue should follow the established Telugu-audio/English-letter subtitle convention.
- Carry unresolved motivations and relationship consequences into the existing following arc. Do not reveal or resolve his entire story at introduction, or move the established later revelations earlier.
- Acceptance remains pending until these missions and interactions are implemented and played. This note records a binding design requirement; it does not claim those future missions are playable.

## Phase checklist

- [x] Touchscreen and laptop controls — mobile arrow pad uses press-and-hold movement; directions combine diagonally and stop on release. Existing WASD and arrow-key controls remain available. Build, lint, and browser gameplay checks passed.
- [x] Mission 2 — all three pylons, all five sentinels, the three Prism Sovereign phases, boss reward, victory, replay, and saved campaign progression verified through gameplay.
- [x] Improve Bhairava's movement, combat, and animations — camera-relative acceleration, attack lunge, and damage reaction. The reference-guided avatar has a dark sleeveless vest, tan straps, bare arms, forearm guards, hair, beard, cargo trousers, and boots.
- [x] Improve enemy AI and boss battles — glass-stalker circling, enemy spacing, and phase-three Warden circling. Mission 2 combat, all three boss phases, and victory were verified in gameplay.
- [ ] Character and opponent visual pass — added facial features, layered hair, stitched costume and armor details to Bhairava; role-specific silhouettes and armor to all five enemy types; and distinct visual accents for the Mission 3–5 bosses. Desktop gameplay checks covered Missions 1–4, Mission 2 combat defeated three sentinels, and the Mission 3 boss encounter was triggered and rendered. Keep this goal open until every enemy type and all expansion boss variants receive focused gameplay checks and mobile performance is profiled on a physical device.
- [x] Implement Bujji AI companion — hover-follow, enemy and boss target selection, and support pulse. Bujji was visible following Bhairava and assisted during the Mission 2 boss fight.
- [ ] Campaign Missions 3–5 — original Kashi contract, vehicle salvage, and tier-lift missions implemented with three objectives, distinct enemy groups, mission-specific bosses, and themed set dressing. Mission 3's full encounter and victory are verified; Mission 4 entry works through the Continue Exploring action. Complete gameplay verification for Missions 4–5.
- [x] Mission-entry clip (reprioritized from the cinematic phase) — play the supplied video at every playable mission entry; Enter or any tap/click skips it.
- [ ] Add story dialogue and cinematic cutscenes — user requested randomized in-mission cinematic moments and combat dialogue. Use original in-game inserts and dialogue or short clips the user provides for the game; the full feature film remains story and visual reference.
- [ ] Improve environments and graphics — the new Mission 3–5 sets now distinguish Kashi market stalls, salvage wrecks, and stacked city tiers; continue the world art pass across the campaign.
- [ ] Add music and sound effects.
- [ ] Add character and control customization.
- [ ] Develop the remaining missions of Campaign 1 (Missions 6–50; preserve the film chronology and label original expansions clearly).
- [ ] Develop Campaign 2 (50 original sequel-style missions).

## Verification notes

- Mobile controls were exercised in a 390 × 844 browser viewport during gameplay. Holding Forward collected a crystal; holding Left changed the gameplay view; the Forward control returned to its released state after input ended.
- Laptop keyboard input remains wired through `PlayerInput.jsx`; ArrowRight was also exercised in gameplay.
- `npm run lint` passed.
- `npm run build` passed. Vite reports that the JavaScript bundle exceeds 500 kB after minification.
- Simultaneous multi-touch diagonal input is implemented in the input aggregation but has not been exercised on a physical touchscreen.
- Mission 2 replay was restored for completed playable missions, and its campaign entry now matches the Glass Wastes gameplay. The third pylon was moved within activation range of the sealed boss gate. Gameplay verified all three pylons, all five sentinels, all three boss phases, the victory screen, the 3,200 score reward, and the replay option with saved progress.
- Mission 2 boss targeting now locks onto the Sovereign within a wider attack range; its attacks deal reduced damage so the fight can be completed with responsive play. `npm run lint` and `npm run build` passed. Vite continues to report the JavaScript bundle is over 500 kB after minification.
- The supplied 6.4-second H.264/AAC clip is stored at `public/videos/mission-entry.mp4`. Mission start displayed the entry overlay and clicking its skip control returned to the gameplay HUD. Earlier mobile tap-to-skip and Enter-key skip checks were verified at a 390 × 844 viewport. Natural playback completion for this replacement clip still needs verification. The remaining cinematic work is queued for its phase; post-mission movie clips are not part of this entry clip.
- Live gameplay verification on 2026-11-05: Bhairava was visibly rendered with the reference-guided outfit, and Bujji followed at shoulder height without covering him. Holding W moved through Mission 2, collected crystals, activated a pylon, and cleared all five Glass Sentinels; the on-screen attack control was also used during the encounter. Bujji's support damage was observed against the Mission 2 boss in the preceding boss run. All three boss phases, victory, saved progress, and replay were verified in the Mission 2 run.
- `npm run lint` passed. `npm run build` passed; Vite reports a 3.51 MB minified JavaScript bundle, above its 500 kB advisory threshold.
- Campaign progression check: the current save has Missions 1–2 complete; Mission 3 is marked AVAILABLE, while Missions 4–5 are playable chapters but remain sequentially locked until the earlier mission is completed. Live gameplay reached Mission 3 and displayed its objective HUD (three contract beacons and four pursuers); movement and a crystal pickup registered. The full Mission 3 encounter and Missions 4–5 still need in-game completion checks.
- Latest `npm run lint` and `npm run build` passed after adding Missions 3–5. Vite reports a 3.52 MB minified JavaScript bundle above its 500 kB advisory threshold.
- Live avatar check: Bhairava rendered in third-person during Mission 1 after the player animation state began with finite attack values. Moving forward still collected crystals. The character is stylized low-poly; matching outfit and silhouette are present, while opponent art still needs its planned visual pass.
- Goal 5 visual pass: added procedural character and enemy details while preserving the existing animation refs, combat data, and colliders. Desktop smoke tests reached Mission 1–4; Mission 2 combat defeated three glass sentinels and registered incoming damage, Mission 3 objectives unlocked the Contract Enforcer after a reactive boss-trigger fix, and Mission 4 combat defeated two pursuers. A 390 × 844 emulated viewport showed working hold/release movement controls. Browser animation-frame callbacks measured about 135–144 fps in the test environment; this is not a physical-device performance certification. Mission 4–5 boss variants and focused per-type combat checks remain outstanding.

### Goal 5 live verification

- Mission 4: recovered all three engine parts, defeated four pursuers, entered the arena, defeated the Convoy Breaker, and observed the victory screen at 4,650 points. Continued to Mission 5 from the victory screen.
- Mission 5: activated all three tier-lift relays, defeated four guards, entered the arena, observed the Tier Sentinel in phases 1 and 3, and reached the victory screen at 4,790 points. Both victory screens were captured during play.
- The in-app game responded to keyboard movement, sprint, heavy attacks and boost during campaign play. In the later joystick build, pointer input moved Bhairava and collected a crystal. Keyboard Space and the on-screen Jump button both produced an airborne pose. The mute toggle and dialogue panel responded to input.
- Direct game-state checks covered patrol, chase and attack decisions, damage and defeat for Warrior, Scout, Heavy, Glass Stalker and Glass Brute. They also covered objective bookkeeping and all three boss phases for Missions 4 and 5.
- Still open: focused live attack, collision and damage checks for every enemy type, remaining animation checks, complete touch controls and physical mobile performance, and the full set of character and enemy screenshots. The current procedural visuals still fall short of the realistic reference.
