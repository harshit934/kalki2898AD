# Phase6 Milestone5H.25 — Full Mission1 staging playthrough

15November2026 (Asia/Calcutta). **Natural Mission1 playthrough completed successfully. One confirmed staging presentation defect remains; prototype acceptance requires review.** No commercial/production approval or integration expansion.

## Inspected baseline and scope

Read5H24 integration/test/rollback reports and exact staging adapter/server,5H22 README and source,5H23 acceptance evidence, Mission1 boss/relic/cinematic and reward/save code, and historical natural-playthrough procedures. Reused the existing5H24 staging copy unchanged:

`C:/Users/Hp/Downloads/kalki 2898AD/phase6/milestone5H24/staging/`

Only the first-movement patrol-guidance event and existing BH6-5E-002 sample remain integrated. No Mission2/boss/victory/emotional events were added. Earlier standalone categories are not evidence those events exist in Mission1.

## Method and conditions

Chrome157.0.8103.51, desktop1920x1080, staging Vite loopback server, fresh disposable context with default new-player progression. Original environment and default visual settings retained. No personal profile or existing player save imported. Opening `kashi-riverfront-arrival` played naturally; the initial voice-control checks then used actual controls. After the intentional restart test, the complete run began at100HP with **no completed missions or saved rewards**.

Playthrough automation read actual positions/enemy/boss/state for navigation and used ordinary keyboard movement, J/K attacks, F block, Q dodge and B Overdrive. No teleport, damage/health setters, boss-state edits, encounter forcing or campaign-completion/reward calls. Normal game actions alone earned completion. The robot navigation is automated ordinary-input play, not a human manual play claim.

The bounded follow-up used a separate disposable profile seeded only with the **genuinely earned save exported from this run**, for patrol-damage-during-voice and UI exit. That seed is not claimed as browser-restart persistence. No original saves accessed or modified.

## Natural completion evidence

The post-restart run took **57.97 seconds to relic collection**, excluding prior opening/control setup and the ending.47 attack inputs were issued. Three patrols reached0HP; Warden720HP reached0, its natural defeat sequence became ready, and the player approached/collected the relic through normal movement. Final player health **22.6/100**, final score **4350**,3 collected crystals.

Relic state at15:54:56.326 IST: boss defeated, health0, victoryReady=true, relicCollected=true, `kashi-contract-return` already playing. Ending observed through time10.5 seconds and returned to idle; victory UI captured at15:55:09.965 IST. No ending Skip was used. Voice was inactive at relic and ending. These are single-run results, not a stability/performance benchmark.

Saved progression:

- completedMissionIds: `["mission-1"]`.
- unlockedMissionIds: `["mission-1","mission-2"]`.
- rewards.mission-1: **boss2500, relic750**.
- selectedMissionId remained mission-1; Mission2 was not launched/integrated.

Matches unchanged baseline constants and natural reward calls in `bossSystem.js`/`campaignSystem.js`. Run score reconciles: scout150 + warrior250 + heavy400 +3 crystals*100 +boss2500 +relic750 = **4350**. Crystal-drop/collection variation can change total run score; it is not a fixed3250 mission payout. Saved boss/relic rewards match the expected unique values. Page reload preserved exact campaign JSON. No direct completion-store calls fabricated these results.

Primary evidence: [raw run state/history](milestone5H25/raw-results.json), [natural ending](milestone5H25/ending-natural.png), [victory/rewards screenshot](milestone5H25/mission-completion.png), [boss encounter](milestone5H25/boss-active.png), [patrol voice](milestone5H25/patrol-voice.png).

## Results by requested area

1. **PASS — launch and initial dialogue:** natural opening observed; first movement started the existing voice sample.
2. **PASS — movement/exploration:** ordinary navigation progressed from spawn through patrols/arena to relic; voice did not set a gameplay hold.
3. **PASS — patrol encounters:** all three AI patrols engaged and were defeated through ordinary attacks. Detailed every-state AI correctness not asserted.
4. **PASS — combat and damage with dialogue:** natural run records attack input during active voice and actual enemy defeats/player damage. Bounded follow-up observed **86→79HP while voice.status=playing**, confirming natural patrol damage was not blocked by narration. Counterattack input remained available; follow-up did not separately assert its hit outcome.
5. **PASS — Skip/replay:** real buttons cancel/restart speech during gameplay without completing an objective or duplicating rewards.
6. **PASS — mute/volume:** mute stopped speech; unmute did not auto-replay; explicit replay used volume0.4.
7. **PASS — bounded rapid-trigger suppression:** eight rapid ordinary movement key taps left one event before bounded journal pruning;5H24/23 stress evidence additionally retained. No new event mappings or queue introduced.
8. **PASS — pause/resume/restart/exit:** audio cancelled on pause; restart created a clean round; follow-up actual pause-menu exit removed the voice adapter and retained naturally earned completion/rewards.
9. **PASS — actual404 fallback:** intercepted missing sample produced text fallback with no voice/game hold and no progression change. Other rejection/constructor/timeout faults are historical5H22/24 automated tests, not spontaneously observed in this run.
10. **PASS — natural completion, ending, reward values, unlock and reload persistence:** as evidenced above. Browser-restart persistence without reseeding remains UNVERIFIED.

[22-row result CSV](phase6-milestone5H25-gameplay-test-results.csv): **17 PASS,1 FAIL,4 UNVERIFIED**. Counts include subchecks and integrity, not22 different missions or independent playthroughs. No failed natural-completion attempt occurred in this milestone. Browser page exceptions0 in full run. Expected404 is deliberate; known Three/Rapier deprecation warnings appeared. No FPS/frame-time or output-device-quality pass claimed.

## Confirmed defect: stale guidance after completion — FAIL

`mission-completion.png` shows the old “Clear the remaining patrols, then approach the arena” staging panel beneath the victory screen, with Replay visually enabled, despite all patrols/boss defeated and relic collected. No audio remained active; progression was not blocked.

Source-supported cause in unchanged `staging/src/stagingVoice/StagingVoice.jsx`: rendering only requires active and state.clip; controller retains its last clip after ending. Post-ending App gameplayActive is true again, so completed-context text returns. Replay's handler rechecks eligibility and refuses the ineligible context, but the button itself is not disabled. **The visible stale text/button is verified; no post-victory Replay click was executed, so the no-play behavior is source inference rather than an extra runtime test.**

Recommended smallest correction, **not implemented**: derive displayed/Replay eligibility from current patrol/boss/completion context; hide/dismiss obsolete guidance or label it clearly as history, and disable unavailable Replay. Do not change mission completion, audio assets or add events. Recheck patrol-clear→boss→ending→victory and pause/restart/exit afterward under separate approval. This defect is a prototype presentation/clarity issue, not a failed natural mission or a rights clearance.

Diagnostic note: `voice.eventCount` in late snapshots filters a bounded200-entry journal. Duplicate-input logs can evict its original event, making that diagnostic count0 later even though voice played; do not interpret it as an authoritative cumulative count. Early trigger assertion, actual audio playback and once-per-round controller seen-key behavior are the relevant evidence. No controller logging change made.

## Limitations

**UNVERIFIED:** physical Android/iOS, subjective pronunciation/emotional acting/output speakers and commercial rights; browser-process restart persistence without reseeding; runtime boss/victory/emotional voice events (not connected by scope). Full ending frame-by-frame visual quality and severe-stall stability were not profiled. No claim this one-event prototype covers every gameplay situation.

The follow-up completed only a short patrol replay/exit, not a second full mission. Full run and follow-up are recorded separately. Nothing expanded beyond Mission1 or copied to production.

## Integrity, rollback and stop

**734/734** pre-existing production/source/public, standalone prototype,5H24 staging and rollback, original WAV/scorecard snapshot files unchanged by SHA256. No staging implementation edits. Personal saves not accessed; only new disposable test storage used.5H24 rollback point and standalone remain intact. This is not a new independent47/14/11 historical-manifest audit.

New files: requested two reports/CSV plus `phase6/milestone5H25/` test scripts, JSON evidence, screenshots, CSV builder and integrity/cleanup records. No model/package downloads, installation, synthesis, production build or rights-enforcement change. Public game assets served read-only as before.

Both test browsers and staging servers stopped in finally. Read-only process check found0 matching owned playthrough/follow-up/staging-server node processes. **Stopped after validation. Natural playthrough PASS; stale completion-panel defect FAIL and retained for review. No production readiness or commercial approval.**
