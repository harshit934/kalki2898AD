# Phase8.2 Arc1 implementation

2026-11-16, Asia/Calcutta. **Staging implementation/offline validation delivered. Full playable-mission acceptance BLOCKED; zero missions receive fresh browser/full acceptance.**

## Baseline and story

Separate `phase8/phase8.2/staging/` and untouched199-file rollback derive from8.1. Arc1 uses the same Kashi contracts, titles, mission IDs, Bhairava/Bujji partnership, existing environments, enemy/boss identities and next-mission links. The older Complex/Shambhala arc-location conflict concerns later arcs and does not require replacing Arc1; it remains documented in8.1. No Karna powers, new storyline, escort NPCs, new factions or replacement map.

## Sequential implementation

Mission1 was implemented first and its seven initial offline checks/build/lint passed before2 was installed. Each following mission was installed only after the previous offline gate passed; every1–N prefix was retested. Receipts: `sequential-installation.json` and per-mission `through-N` logs. These are offline gates, not fabricated browser acceptance. The approved Arc1 patterns are predominantly combat contracts; variety adds supported exploration/pylon work, ordered inspections, evidence choices, calibration defense and bout checkpoints. No unrelated escort/survival storyline is invented.

- **1. A BOUNTY IN THE DUST:** salvage / combat. Confirm the salvage contract with Bujji → Verify three recovered crystals at the salvage relay. 6/6 applicable checks pass; browser unverified; not accepted.
- **2. THE GLASS WASTES:** pylon exploration / grid combat. Inspect the first synchronized pylon → Verify the middle pylon connection → Confirm all three pylons before the Sovereign. 6/6 applicable checks pass; browser unverified; not accepted.
- **3. ONE MORE JOB:** contract survey / combat. Read the lower-tier contract beacon → Compare the market-edge beacon → Seal the contract route. 6/6 applicable checks pass; browser unverified; not accepted.
- **4. THE DRIVER’S DEBT:** parts recovery / calibration protection. Inspect the recovered ignition core → Verify the complete engine-parts set → Keep the repair calibration stable for six seconds. 7/7 applicable checks pass; browser unverified; not accepted.
- **5. A CITY OF TIERS:** relay exploration / district combat. Read the lower lift relay → Inspect the middle relay readout → Confirm the district route. 6/6 applicable checks pass; browser unverified; not accepted.
- **6. THE BOUNTY BOARD:** claim investigation / combat. Read the original bazaar notice → Compare the rival claim against the original notice → Verify the final posting. 6/6 applicable checks pass; browser unverified; not accepted.
- **7. THE MASKED PURSUIT:** trail investigation / pursuit combat. Check the alley trace after the interceptor → Read the rooftop-access trail marker → Verify the last sighting. 6/6 applicable checks pass; browser unverified; not accepted.
- **8. THE ARENA CIRCUIT:** sequential arena bouts. Confirm the first bout is cleared → Confirm the heavy-guard bout → Verify the circuit before the champion. 6/6 applicable checks pass; browser unverified; not accepted.
- **9. A DEBT COLLECTED:** bargain investigation / collection combat. Read the meeting account → Choose the evidence-backed account → Confirm the collection point. 6/6 applicable checks pass; browser unverified; not accepted.
- **10. THE ROAD OUT:** departure checks / gate defense / arc boss. Check the outer departure road → Inspect the faction barricade → Hold the departure signal for three seconds. 7/7 applicable checks pass; browser unverified; not accepted.

## Functioning integration

One current interaction marker uses the existing relay prop where a reused pylon/relay is not already present. The world and all old pickup/hazard/AI systems remain. Actual E/Interact handling routes to the current contract before falling back to prior interactions; the existing mobile Interact and a contextual touch button use the same action. Each action checks mission/round, range/height, pause/hold, death and authoritative requirements. Choice questions require reading evidence; wrong choices neither advance nor spend rewards. Only one step completes per action.

Mission4’s six-second calibration and Mission10’s three-second signal use active simulation time, not a new wall-clock interval. Movement/combat remain available. Leaving the ring or a new damage timestamp interrupts the hold; pause/cinematic hold freezes it. Progress display updates at approximately10Hz. No extra global listener, animation loop or persistent quest save is added. Completed contracts and non-Arc1 routes do no per-frame quest snapshot work.

The existing boss wrapper adds contract readiness to its existing prerequisites for1–9; the existing Mission10 marker adds the same check before the preserved boss introduction. Later bosses20…100 are unaffected. Exact normalized-source tests verify selected Scout/Warden visual/attack code is unchanged. No boss damage/health/AI/animation retuning, player controller rewrite or new invulnerability.

The compact contract HUD exposes tasks, choices, progress and dismissible original English Bhairava/Bujji text. Dialogue is non-blocking and no voice is generated. It disappears after boss defeat/player death, including victory/ending. Existing Mission1 ending/trigger, cinematic Skip/Replay, free-roam camera, mission-introduction camera, companion-vector reuse and65-effect collection remain unchanged. Mission1 briefing/HUD now say three salvage crystals are required; additional crystals/route scans remain optional. A small read-only assistant wrapper prevents the old all-crystals-optional advice from contradicting the new contract. It uses marked English fallback and preserves every existing Telugu draft.

## Completion, rewards and saves

Existing authoritative objectives, enemy defeat, boss, relic and completion actions remain. Fixed completion rewards stay2,500+750, except Mission2 at3,200+900; pickup/enemy score is separate. Campaign completion/unlock historically records at boss defeat, followed by relic/ending presentation; this timing is preserved, not relabeled as proof of finished story playback.

Node tests drive actual contract/interaction and combat/boss/relic store actions using disposable memory. A sequential actual campaign-module fixture verifies Missions1→10, reward total33,350, per-reward deduplication and persistence across store recreation. Mission11 unlocks as a planned slot and cannot launch; no later content is enabled. This is not natural player-input/LOS/physics combat or browser-restart evidence.

No save-schema change, migration, reward reset or personal-save access. Existing selected/unlocked/completed history remains. Contract steps are run-local, like existing objective state; replay/restart/refresh starts their run again without duplicating saved reward keys. No resume-mid-contract persistence is claimed. All19 prototype routes remain; no new route is counted among the81 planned missions.

## Tests, fixes and limits

**467 PASS;8 NOT APPLICABLE;0 FAIL**, across475 distinct checks.395 inherited foundation/integration checks rerun against8.2, ten new shared integration checks and70 per-mission checks (eight hold checks are correctly not applicable). Repeated prefix runs are not counted as extra unique passes. Final build/lint pass with12 inherited warnings, zero new warnings/errors. Existing large-chunk advisory remains.

Mission4’s first assertion assumed successive steps always have different positions. Its parts verification and calibration deliberately share a console and need separate actions. The harness now verifies one-step advancement and unique completion without rejecting the next valid interaction; the failed result is preserved. The actual guidance inconsistency was fixed once by updating the readiness text and an English-only assistant wrapper; focused guidance/source tests and all mission regressions then passed. An extracted-effect test’s slice index and inherited exact-file checks were adjusted to the intentional new wrapper/HUD changes, with strict normalized-diff replacements. No repeated visual optimization or browser retry.

Browser preflight: 700.26MiB available physical RAM, 2331.56MiB commit headroom. Prior rendering used roughly572MiB physical headroom, which would leave about128MiB now, below its previous safety stop. No arbitrary2GB gate. No browser/server/monitor was launched. Actual collision reachability, input combat, UI overlap, timed-defense difficulty, natural endings, ten-mission playthrough, responsive layouts and frame pacing are **UNVERIFIED**. No screenshots or visual-quality approval are invented. Full Arc1 acceptance is blocked, not complete.

## Files and integrity

- `phase8/phase8.2/staging/index.html`
- `phase8/phase8.2/staging/src/App.jsx`
- `phase8/phase8.2/staging/src/game/assistant/BhairavaAssistant.jsx`
- `phase8/phase8.2/staging/src/game/BossEncounter.jsx`
- `phase8/phase8.2/staging/src/game/cinematics/BossIntroductionMarker.jsx`
- `phase8/phase8.2/staging/src/game/GameHud.jsx`
- `phase8/phase8.2/staging/src/game/Gameplay.jsx`
- `phase8/phase8.2/staging/src/game/MissionOneObjectives.jsx`
- `phase8/phase8.2/staging/src/game/arcOne/arcOne.css`
- `phase8/phase8.2/staging/src/game/arcOne/ArcOneObjectives.jsx`
- `phase8/phase8.2/staging/src/game/arcOne/assistantGuidance.js`
- `phase8/phase8.2/staging/src/game/arcOne/contracts.js`
- `phase8/phase8.2/staging/src/game/arcOne/contractState.js`
- `phase8/phase8.2/staging/src/game/arcOne/runtime.js`

Other new files are confined to8.2 tests, scripts, rollback, build and evidence plus requested reports/current map and the two authorized overall trackers. Phase8.1’s campaign CSV stays intact; updated map is `phase8/phase8.2-100-mission-campaign.csv`.

SHA-256:47/47 protected;153/153 production;5141/5141 recorded Phase7 files;559/559 Phase8.1 files;6/6 older Phase8 reports;199/199 new rollback match. Personal profiles/saves were not read, copied, hashed or modified. No packages, downloads, new audio, paid services or copyrighted movie media.

When resources safely permit, from PowerShell in the project folder run `node .\phase8\phase8.2\serve.mjs`, then open its printed loopback URL in a disposable profile. Banner: **Phase8.2 ARC1 STAGING**. New Game → Start Mission01 → opening/free roam → hub interaction → Mission1 contract. Approach the ring, read the contract HUD and use E/Interact; continue through existing unlocks. No test fixture is exposed by this launcher. All owned tests/builds exited; no browser/server remains. Stop for review, no next arc or production merge.
