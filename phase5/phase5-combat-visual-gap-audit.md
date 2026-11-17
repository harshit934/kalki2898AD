# Phase 5 combat visual gap audit

15 November 2026. **Target-quality assessment: substantial gap; targeted improvement required.** This audit does not reopen Phase 5's CONDITIONAL ACCEPT closure. No implementation, browser gameplay run, package installation or source/asset replacement was performed.

## Evidence and limits

Current source was inspected together with historical gameplay screenshots and raw results. “PASS” means the stated quality is demonstrated, PARTIAL means support exists but quality is incomplete, FAIL means substantially below the reference target, and NOT VERIFIED means evidence is insufficient. Historical functional PASS does not imply current fresh testing or cinematic visual acceptance. No category is certified AAA-quality. The status CSV evaluates the combined target, so a working subsystem may remain PARTIAL.

The three supplied references were found in the montage at `C:/Users/Hp/OneDrive/Pictures/Screenshots/Screenshot 2026-11-15 021531.png`. They show readable behind-player combat silhouettes, detailed opponents/architecture, deliberate foreground-to-background separation, localized impact lighting and restrained health overlays. Their thumbnail resolution cannot establish animation, hit detection, AI sophistication, texture resolution or frame rate. They are visual direction, not a gameplay specification inferred from another game.

Inspected source: `src/game/Gameplay.jsx`, `player/Player.jsx`, `player/PlayerInput.jsx`, `CombatEnemies.jsx`, `BossEncounter.jsx`, `GameHud.jsx`, `World.jsx`, `GameCanvas.jsx`, `GraphicsFoundation.jsx`, `RiggedEnemy.jsx`, `EnemyArmor.jsx`, `player/RiggedBhairava.jsx`, `player/characterAnimation.js`, `player/combatTiming.js`, `phase54e/arcBosses.js`, `phase54e/ArcBossFight.jsx`, `phase54e/cityAssets.js`, `src/audio/audioManager.js` and `player/playerAudio.js`. Source findings are not substitutes for live quality tests.

Historical reports: [latest bounds correction](phase55-bounds-correction-report.md), [bounded visual rejection and tests](phase54e-final-acceptance-report.md), [production art inventory](phase54f-production-art-inventory.md), [encoding recovery and paused campaign scope](phase54f-minimal-encoding-recovery-report.md). Earlier rejected art remains rejected/opt-in; later bounds repair supersedes earlier default-ending scan findings, not every historical hitch.

## Actual gameplay evidence

These are existing gameplay captures, not new screenshots, concept artwork or renders made for this audit. The gallery represents selected Mission 1/Mission 20 views, not independent visual verification of every mission or boss. Historical captures cannot establish the exact appearance of all subsequent source revisions.

### Mission 1 active Warden: readable combat layout, unfinished boss presentation

![Mission 1 Warden gameplay](phase54e-final-20261114/mission1-regression/mission-1-keyboard-warden-active.png)

The human player silhouette and sword are readable. The boss uses large box/cylinder forms with little surface breakup; its broad illuminated core does not replace anatomical/mechanical detailing. The empty circular floor, plain boundary wall, pale background and long dark shadow lack the reference's layered environmental depth. A screenshot cannot prove a camera freeze or collision defect.

### Latest reviewed Mission 20 introduction

![Chain Collector introduction](phase55-bounds-correction-20261114/boss20/boss-20-intro.png)

Chains distinguish the theme, but the opponent remains a simplified geometric assembly. The repeating wall bays and tiled ground provide a functional court rather than finished cinematic staging. The player is relatively small; test moving fight readability before changing camera distance.

### Opt-in street and portrait combat

![Opt-in playable street](phase54e-final-20261114/visual-review/after-street-forward.png)

Architecture, civilians and infrastructure are genuinely present in this capture. Repeated arches, similarly dressed facades, conspicuous low-detail props and sparse civilian activity remain visible. Foreground obstacles compete with combat silhouettes. This is not evidence that the production fallback has received the same revision.

![Portrait boss gameplay](phase54e-final-20261114/visual-review/after-portrait-hud.png)

The player remains visible in this historical image; it does not justify calling portrait totally broken. Boss/player/status panels consume much of the upper region and touch controls occupy the lower region. Readability must be tested in motion with every HUD mode. Current later assistant overlays were not exercised here.

### Production menu presentation is not combat proof

![Default menu](phase54e-final-20261114/visual-review/default-menu.png)

The warm palette and hierarchy are established, but repeated architecture and limited character/material finish remain evident. A polished menu does not demonstrate finished playable combat.

## Fourteen-category assessment

01. **Third-person camera — PARTIAL.** Warden and Chain Collector captures show usable behind-player framing; portrait framing is crowded. Source-supported limitation: Follow smoothing, clearance rays and arena staging exist; responsiveness and moving-camera clipping not freshly tested. Next validation: Validate moving combat and obstacle clearance at identical desktop/portrait/landscape positions.

02. **Player character materials and model — PARTIAL.** Rigged human silhouette exists; dark torso, modest surface definition and costume detail fall below reference. Source-supported limitation: Protected /models/bhairava-free-rig.glb with appearance/costume adapters; not a wholly primitive player. Next validation: Improve approved material/lighting adapters first; protected mesh edits need separate approval.

03. **Enemy and boss visual assets — FAIL.** Warden and Chain Collector have conspicuous geometric limbs, flat broad surfaces and simplified silhouettes. Source-supported limitation: Shared soldier rig for several enemy classes; procedural alternatives; boss functionality is separate from finished art. Next validation: Prioritize one finished enemy and one boss vertical slice; preserve all ten behavior contracts.

04. **Animation quality and fluidity — PARTIAL.** Attack pose visible; stills cannot establish fluidity. Source-supported limitation: Basic/heavy variants select Sword slash with timing and procedural tilt; enemy adapter exposes Idle/Walk/Run. Next validation: Distinct authored attack/recovery/hit/dodge animation coverage and timed gameplay contact tests.

05. **Enemy AI and combat behavior — PARTIAL.** Historical boss tests exercise authored attacks and phases, not tactical quality. Source-supported limitation: Enemy windup/strike/recovery and cooldowns; ten boss profiles with different hazard/movement rules. Next validation: Measure challenge, fairness and multi-enemy coordination; do not replace passing AI speculatively.

06. **Player and enemy health; stamina — PARTIAL.** Player label/value/bar visible; enemy target/damaged bars implemented. Source-supported limitation: Unlimited sprint is intentional: missing stamina is not a defect; no stamina mechanic authorized. Next validation: Keep unlimited sprint; validate world-space enemy bar orientation, occlusion and readable damage feedback.

07. **Boss health presentation — PARTIAL.** Wide named boss bar with numeric health and phase; portrait panel consumes considerable upper area. Source-supported limitation: Shown for intro/active states; health functionality historically tested. Next validation: Keep prominence while reducing portrait information footprint; test long names, low health and phases.

08. **Hit detection and responsiveness — PARTIAL.** Historical damage/defeat tests pass; contact precision cannot be certified from stills. Source-supported limitation: Attack input handling selects range/facing/LOS target and applies damage in same branch; not a swept blade-contact simulation. Next validation: Instrument input-to-contact timeline and occluded/moving targets before any timing change.

09. **Light/heavy/combo/dodge/block — PARTIAL.** Historical keyboard/touch coverage; visually distinct combo choreography unverified. Source-supported limitation: J/K attacks, Q/Shift dodge, F block; 100ms input buffer; attack variants share slash clip. Next validation: Preserve timings until tested; authored multi-hit combo/roll presentation is not established.

10. **Trails sparks explosions impacts — PARTIAL.** Some emissive cores and hazard effects visible; no screenshot establishes reference-level impact effects. Source-supported limitation: Small particle bursts, sparkles, blade hit flash and recoil exist; full trail/explosion coverage not established. Next validation: One readable contact effect set with bounded lifetime/pooling; avoid screen-obscuring particle escalation.

11. **Arena environment lighting shadows — FAIL.** Repeated arch/tile/court geometry, sparse arena staging, flat broad surfaces and weak depth versus references. Source-supported limitation: Opt-in Kashi differs from production fallback; lights/shadows exist but do not supply missing asset detail. Next validation: One coherent arena with dressed foreground, believable materials and controlled key/fill/shadow contrast.

12. **HUD visual consistency — PARTIAL.** Warm gold/teal hierarchy and open center on desktop; portrait text/status occupies substantial area. Source-supported limitation: Full/compact/minimal behavior historically tested; current dynamic layout not freshly run. Next validation: Maintain existing modes; test all combat states with controls and assistant visible.

13. **Audio and combat feedback — NOT VERIFIED.** No synchronized combat audio audition performed in this audit. Source-supported limitation: Event routing exists; legacy playGameSound routes through dialogue pools or no-match, not proof of layered Foley coverage. Next validation: Audit audible attack/contact/block/damage cues with licensed/original assets; preserve rights blocking.

14. **Desktop and mobile performance — PARTIAL.** Short historical 1080p exploration near 30FPS; recurring portrait-emulation hitches; no physical-device proof. Source-supported limitation: Historical render-start timing is not GPU presentation latency; current DPR budget differs from old portrait sample. Next validation: Matched production-like active fights; record buffer dimensions, all >100ms gaps, p95/p99/max and visible interruption.

## Confirmed implementation causes versus hypotheses

- **Asset/presentation limitation, confirmed by source and images:** shared soldier assets, primitive/procedural boss body forms, repeated arena architecture and limited foreground surface detail. More objects, resolution or glow will not alone produce finished character/arena art.
- **Animation limitation, confirmed source:** basic/heavy attack presentations select the same `Sword slash` clip; timing, alternating tilt, recoil and dodge offsets add variation. Enemy rig adapter selects Idle/Walk/Run. These are real adaptations, but not a complete authored combat animation set. Still images do not establish blend defects or foot sliding.
- **Combat contact model, confirmed source:** accepted attack input starts the attack and resolves range/facing/line-of-sight damage in the same Player branch. This is not continuous weapon sweep contact. A visual/contact mismatch is a risk to measure, not a proven broken hit from these images. Buffering, cooldowns and obstruction checks already exist.
- **AI limitation, qualified:** deterministic windup/strike/recovery and distinct authored boss hazards exist. Sophisticated group tactics, challenge balance and reaction fairness are unverified; deterministic AI is not inherently broken.
- **Rendering/presentation limitation:** lights, shadows, sky/fog and quality-dependent pixel budgets exist. Flat material response, repetition and weak compositional layering are visible. No captured profile establishes that missing AO or a specific shadow setting causes the quality gap. Do not prescribe a rendering rewrite or expensive post-processing as a guessed repair.
- **Performance:** recurring historical portrait hitches are measured. Paging, browser scheduling and GPU/driver waits remain possible contributors, not established causes for every gap. The corrected ending bounds scans are a separate confirmed operation; do not attribute all old stalls to them.
- **Audio:** event hooks are implemented. Their existence does not prove audible, distinct, licensed contact Foley. No listening test occurred, so audio quality stays NOT VERIFIED.

## Reuse and replacement

Keep the protected player rig, costume/grooming/rollback assets, collision contracts, authoritative health/damage/progression stores, passing boss behavior profiles, HUD modes and rights enforcement. First improve non-protected material adapters, animation blending/timing and arena composition in isolated copies. Detailed enemy/boss art and authored animations are genuine missing production work; new approved original/licensed assets may be necessary if existing topology/rig cannot support required close-up detail. This is a future approval gate, not authorization to replace protected files. Asset licence and deformation tests must precede integration. Civilians can remain distant LODs; do not promote low-detail foreground figures as finished art. Unreferenced authored assets are not playable implementation evidence.

## Performance evidence, not a new benchmark

Raw source: [four minimal-observer windows](phase55-bounds-correction-20261114/performance/results.json). GTX 1650; each 45s; two desktop exploration/idle and two portrait near-guard windows; no CPU profiler or GPU elapsed queries in these windows. Values are render-start intervals, not presentation latency. Desktop CSS and drawing buffer were both 1920×1080 at DPR1.

- Desktop r1: 29.94 FPS; median 34.6ms, p95 35.1ms, p99 36.1ms, maximum 120.0ms; one gap >100ms.
- Desktop r2: 30.00 FPS; median 34.6ms, p95 35.2ms, p99 35.6ms, maximum 38.1ms; no gap >100ms.
- Portrait r1: 91.06 FPS; median 7.1ms, p95 25.7ms, p99 41.7ms, maximum 174.1ms; 27 gaps >100ms.
- Portrait r2: 92.50 FPS; median 7.1ms, p95 25.8ms, p99 33.3ms, maximum 142.8ms; 20 gaps >100ms.

Portrait was desktop Chrome emulation, CSS430×932, buffer860×1864, DPR2. Current `GameCanvas` has a width<900 pixel budget/DPR cap, so these historical conditions must not be represented as a matched measurement of today's mobile rendering configuration. Physical-device performance remains NOT VERIFIED. High averages mask 47 >100ms intervals across 90s. Short desktop exploration is not sustained multi-enemy combat certification.

Latest short Mission20 duel was 23.98s, maximum36.9ms, no >100ms gap; historical 442.1ms renderer/455.6ms interval was not reproduced in that sample. Historical239.1ms boss gap remains unattributed. The later natural-ending transition still recorded183.6ms while renderer27.9ms did not account for the whole interval. Earlier multi-second reports cannot be declared fixed by this audit.

Default ending bounds correction is supported separately: cached bounds application0–0.3ms, natural clone1.8ms, no ending mesh full vertex scans, versus historical normalization493.9ms. Preparation cost moved to loading, approximately2.05–6.17s in measured runs. Preserve this verified fix; it is not proof of zero transition stalls.

## Historical functional evidence and verification boundary

The raw [bosses20–100 results](phase54e-final-20261114/tests/boss-browser-strict-results.json) and [boss10 results](phase54e-final-20261114/tests/mission10-browser-results.json) record phases, authored attack families, defeat/relic/reward/reload. Boss videos were skipped: no natural video playback claim follows. The later [Mission20 result](phase55-bounds-correction-20261114/boss20/boss-browser-strict-results.json) is one representative regression. These tests do not imply that all100 missions are implemented.

Mission1 natural real-time ending/replay, Bujji chase/touch, HUD modes and pause/navigation have historical passing evidence linked from the acceptance reports. The earlier stationary Mission1 automated attempt was unverified and unattributed; a later focused repeat passed. This audit did not reproduce or repair it. Source inventory and historical tests cannot establish current input latency, animation quality, balance or physical-phone compatibility.

Build/lint were not rerun: no implementation was changed and a new build would unnecessarily regenerate dist. Latest reviewed historical correction reports passed build/lint with nine existing warnings, zero errors. This is explicitly historical, not a fresh PASS.

## Integrity and stop

See `combat-gap-audit-20261115/final-integrity.json` for current protected hashes and before/after production snapshot checks. Personal browser profiles, saves, localStorage and save payloads were not accessed. No server or test process was launched. No implementation, asset download, campaign expansion or roadmap change is authorized by this audit. Remaining verification and prioritized effort are in the companion roadmap.
