# Phase8.6 implementation

2026-11-16, Asia/Calcutta. **CONDITIONAL PASS for implementation and offline tests. Full gameplay, visual/balance and browser persistence acceptance BLOCKED.**

## Combat and enemy integration

Separate227-file source/rollback from8.5. Existing light/heavy actions retain J/K and mobile Attack/Heavy; a shared three-hit basic chain now cycles1→2→3 with1/1.15/1.4 damage multipliers,1100ms chain expiry and heavy/reset interruption. Existing420/900ms attack cooldowns, buffer, contact logic, hit reactions, defeat models and player health indicators remain. Dodge/roll stays Q/Shift and mobile Dodge with260ms active immunity/850ms cooldown. Block remains F/touch; first180ms of a newly raised guard parries one eligible enemy/boss hit, suppresses that damage and staggers the targeted ordinary enemy before a counter. Held block retains70% reduction. No automatic parry loop or new key replaces existing controls.

Existing meshes gain four role behaviors without new enemies/assets: approach/melee warrior, slower/harder-hitting heavy, ranged locked-target strike and elite alternating melee/ranged. Ranged attacks have a visible ground tell, locked target, distance/LOS check and recovery/cooldown; they are delayed ranged strikes, not newly animated projectile weapons. Existing warrior/Scout/heavy models retain their identities and visual assets. Role composition varies by difficulty while original IDs/counts/objective dependencies are unchanged. Actual appearance and readability are not browser-verified.

Five pre-mission settings adjust damage, detection/aggression, wind-up, recovery, reaction, attack interval and composition, without additional health scaling. Easy/Normal/Hard/Very Hard/Nightmare profiles are in combat86/rules.js. Minimum ordinary tell450ms, boss tell650ms and ordinary recovery180ms remain numerical safeguards, not proof every realtime attack is avoidable. Existing two/three-pattern boss system, three phases, health bar, relic/defeat/progression remain; difficulty adjusts pressure/tells/damage and harder Warden phase1 mixes existing melee/bolt patterns. Arc bosses retain their models/attacks with scaled tells/cooldowns. No boss/story replacement or Mission expansion.

## Healing

Three starting persistent charges,35 health per use, max-health clamp,700ms presentation and5s simulation-clock cooldown. H and the mobile Heal button queue exactly the same action. A health-HUD button/count and explicit rejection messages show full health, exhausted charges, cooldown or incompatible action. Existing guard/hand-raise animation plus a restrained700ms green ring presents healing; no new animation/audio asset. Healing rejects death, game hold, free roam, block, attack, dodge, stun and an active heal. It grants no invulnerability and damage interrupts the presentation. Supplies do not automatically refill on mission restart; no resupply mechanic was requested/added. Real animation quality and controller usability remain unverified.

## Save/Continue protection

Inspected existing campaignSystem/progressValidation, menu and exploration storage before changes. User explicitly approved backward-compatible optional fields in the existing record. The storage key remains kalki-campaign-progress; original completedMissionIds, unlockedMissionIds, rewards and selectedMissionId retain semantics. Added difficulty,healingCharges,checkpoint only. Unknown pre-existing root fields are merged back when saving; a disposable upgradeLevel field is verified preserved, not claimed to be an implemented upgrade system. Old valid saves default to Normal/3 charges/no run checkpoint; reading never writes. No personal profile/save was read, copied, hashed, cleared or modified.

Continue uses the saved selected mission, then restores validated attempt health/score, collected/objective IDs, enemy health/defeated IDs, pending drops, boss health/phase/relic/award flags, contract cursor, optional scans, player position and remaining healing cooldown. The player controller uses that resume position instead of always using mission spawn. Autosave is debounced600ms on relevant store changes, plus pagehide/blur/menu exit. Close/unmount removes listeners and flushes safely. UI transient actions, attacks/projectiles and interrupted hold timers restart safely rather than resuming half an attack.

The new launcher uses stable127.0.0.1:5286 by default, with no random-port fallback. Browser localStorage belongs to the exact origin: localhost and127.0.0.1, different ports or profiles have different saves. Existing personal saves on other origins are not imported or touched. To use a deliberately chosen existing origin later, the launcher supports KALKI_STAGING_PORT; no such personal-origin test was run.

Existing New Game remains an explicit confirmed fresh Mission1 run that keeps campaign records; this milestone does not add destructive campaign erasure. Continue is used for saved data; first-time flow remains available when no valid record exists. Legacy saves have no recoverable historical health/attempt snapshot, so only their recorded campaign state can be resumed. Live AI positions/patrol clocks, camera orientation and Mission2's auxiliary chase/sequence timeline are not fully checkpointed. Browser refresh/server-restart behavior and resumed ending transitions require actual playtesting; do not claim full-session persistence certification.

## Validation and corrections

277 PASS,8 NOT APPLICABLE across285 automated checks, plus2 successful fresh-process save/load checks:279 PASS/8 not applicable total. Full15 inherited regression programs, ten Arc1 contract/mission programs,16 character checks,24 assistant checks and20 new combat checks execute against8.6. Initial focused results17/20 exposed Mission1 default boss cooldown not scaled, invalid checkpoint version acceptance and missing bridge mount. Corrected those together, including safe missing-enemy-health fallback;20/20 pass. Two new lint warnings were removed. Original failures/logs are preserved.

Inherited byte-identity assertions initially failed because they prohibited the now-authorized combat/input/save edits. Only those path expectations in the new test copies were adapted; unchanged visual/camera/companion/audio/effect source still compares to rollback, and new functionality is covered separately. Pre-adaptation results are retained; previous phase tests/reports were not overwritten. No failed test is silently counted as pass.

Build PASS, lint PASS with12 inherited warnings/zero new errors or warnings; large-chunk advisory remains. No browser/server launched:377.24MiB initial and274.88MiB final available physical memory were below measured prior rendering overhead. No fixed2GB rule or unsafe retries. Node tests are not actual gameplay, visual quality, enjoyable balance, FPS, mobile device or browser persistence proof. Phase8.2 remains0/10 newly browser-accepted. Commercial voice/movie clearance remains unchanged/blocked; no new media/services/packages.

## Modified inherited staged files

- `phase8/phase8.6/staging/index.html`
- `phase8/phase8.6/staging/src/App.jsx`
- `phase8/phase8.6/staging/src/game/assistant/campaignAnswers.js`
- `phase8/phase8.6/staging/src/game/assistant/campaignContext.js`
- `phase8/phase8.6/staging/src/game/BossEncounter.jsx`
- `phase8/phase8.6/staging/src/game/bossSystem.js`
- `phase8/phase8.6/staging/src/game/campaignSystem.js`
- `phase8/phase8.6/staging/src/game/CombatEnemies.jsx`
- `phase8/phase8.6/staging/src/game/GameHud.jsx`
- `phase8/phase8.6/staging/src/game/gameplayStore.js`
- `phase8/phase8.6/staging/src/game/MainMenu.jsx`
- `phase8/phase8.6/staging/src/game/phase54e/arcBosses.js`
- `phase8/phase8.6/staging/src/game/phase54e/ArcBossFight.jsx`
- `phase8/phase8.6/staging/src/game/player/MobileControls.jsx`
- `phase8/phase8.6/staging/src/game/player/Player.jsx`
- `phase8/phase8.6/staging/src/game/player/PlayerInput.jsx`
- `phase8/phase8.6/staging/src/game/player/playerInputStore.js`
- `phase8/phase8.6/staging/src/game/player/RiggedBhairava.jsx`
- `phase8/phase8.6/staging/src/game/SettingsPanel.jsx`
- `phase8/phase8.6/staging/src/game/World.jsx`

## New staged files

- `phase8/phase8.6/staging/src/game/combat86/actionState.js`
- `phase8/phase8.6/staging/src/game/combat86/checkpoint.js`
- `phase8/phase8.6/staging/src/game/combat86/CombatStatus.jsx`
- `phase8/phase8.6/staging/src/game/combat86/HealingPulse.jsx`
- `phase8/phase8.6/staging/src/game/combat86/rules.js`

Other new files are isolated tests/scripts/build/manifests/evidence and six requested reports. Overall/Phase8 tracking is updated with backups. Protected47/47,production153/153,new rollback227/227 and all previous staging/rollback content hashes match. No promotion to production. All owned test/build commands exited; no browser/server remains.
