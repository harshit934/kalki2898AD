# Phase6 Milestone5H.26 — Mission1 guidance lifecycle fix

15November2026, Asia/Calcutta. **PASS for the staging-only bugfix and executed regressions.** No production voice approval, commercial clearance or integration expansion. Four prior UNVERIFIED areas remain unchanged; Mission2 runtime is additionally untested.

## Inspection and confirmed cause

Read all three5H25 deliverables, staging guidance/HUD/victory code and5H25 recorded source hashes/rollback procedures.5H25 captured the early “Clear the remaining patrols, then approach the arena” panel on the victory screen.

Exact source: `phase6/milestone5H24/staging/src/stagingVoice/StagingVoice.jsx`. Previously its render guard was `if (!active || !state.clip) return null`. The controller retains the last selected clip after playback ends. After the ending returns, App gameplayActive can be true while the mission is already victorious; therefore the obsolete clip was rendered again. Replay rechecked eligibility but its button looked usable. This was a verified presentation-lifecycle defect, not a failed reward/ending or audible overlap.

## Smallest staging-only correction

Changed **one existing staging file**, StagingVoice.jsx. It now subscribes to current mission ID, gameOver, boss status and enemy-health state and reuses the existing `guidanceEligible` helper to derive current context. `canPresent = active && contextCurrent` gates this panel; a layout effect updates playback eligibility and interrupts its controller when obsolete.

Consequences:

- Guidance appears at the existing first-movement event while patrols remain.
- Clearing all patrols, entering boss state or game-over retires that early guidance and cancels any remaining speech. It stays absent at relic, ending and victory.
- Obsolete Replay is absent with the panel. Pausing/cinematics still cancel, and valid context may return after resume; restart starts a clean round.
- Saved completion history is not used for this gate: a completed-save replay with new patrols still receives legitimate guidance. The follow-up confirms this.
- No CSS/global-message suppression. GameHud, CombatNarrative, objectives, boss/relic/ending, reward/save code and every Mission2 file remain unchanged. Other contextual messages are not routed through this staging-only guard.

No dialogue rewriting, new event, controller change or audio alteration. Only the existing calm patrol-guidance event remains connected.

## Before/after evidence

- [Before:5H25 stale guidance at victory](milestone5H25/mission-completion.png).
- [After:5H26 clean victory](milestone5H26/mission-completion.png).
- [After:valid initial patrol guidance](milestone5H26/patrol-guidance-after.png).
- [Natural ending after fix](milestone5H26/ending-natural.png).

Images are genuine screenshots from separate natural staging runs, not identical-camera pixel comparisons or concept images. After screenshot retains the victory title,4350 score, relic/completion/unlock information and Continue/Mission Selection/Restart actions; the staging guidance panel is absent.

## Natural gameplay and reward regression

Fresh disposable Chrome157.0.8103.51 context,1920x1080, unchanged staging game/world. Natural opening observed. Voice Skip/replay, mute/volume, rapid ordinary movement, pause/resume, actual404 fallback and restart exercised. The post-restart complete run began at100HP with no completed missions/rewards and used ordinary movement/J/K attacks/F block/Q dodge/B Overdrive. No damage/health/position setters or completion/reward calls.

Run to relic: **58.788s** (excludes opening/setup and ending). Three patrols and Warden defeated naturally; relic collected. Final health **56.1/100**, score **4350**. The natural ending `kashi-contract-return` played without Skip and returned to idle; victory appeared with no stale panel/Replay and inactive voice. Page exceptions0. Snapshot checks show health HUD remains in active combat and retired guidance stays absent after patrol clearance/boss context.

Naturally saved rewards: **boss2500 + relic750**. Mission1 completion recorded; Mission2 unlocked, never launched. Exact campaign JSON survived reload. This matches5H25 and baseline reward constants; variable combat timing/damage is not evidence the combat rules changed. Source/reward files match baseline.

Fresh bounded follow-up used only this run's actual earned test save in another disposable profile. Valid replay guidance remained eligible. Normal movement into ghat-relay radius plus R produced the existing BUJJI Telugu/English message. Natural patrol damage **100→93HP** occurred while narration played. Real pause-menu exit disposed the adapter and preserved earned rewards.

Initial relay interaction in the full run did not reach the message and remains **UNVERIFIED in its original raw record**. A targeted, correctly positioned follow-up supplied new PASS evidence; the consolidated CSV links that result rather than overwriting history. No second full playthrough or application change was needed to obtain it.

## Test classifications

[30-row regression CSV](phase6-milestone5H26-regression-results.csv): **25 PASS,0 FAIL,5 UNVERIFIED**. Counts include subchecks/grouped unit results, not30 independent missions.

- PASS: initial guidance at correct event; voice controls and failure fallback; patrol-clear/boss retirement; natural boss/relic/ending/victory; legitimate victory content;2500+750 rewards/Mission2 unlock/reload persistence; pause/restart/exit; health HUD and real unrelated Bujji relay message.
- PASS:9/9 existing eligibility gates and17/17 audio-controller tests freshly rerun. Final focused Oxlint on staging adapter exits0/no output.
- UNVERIFIED, unchanged from5H25: physical Android/iOS; pronunciation/emotional quality/commercial rights; complete browser restart persistence without reseeding; broader boss/victory/emotional voice-event coverage. No new evidence promoted any of these.
- UNVERIFIED: Mission2 runtime regression, intentionally not launched. Source is unchanged, App mounts this adapter only for Mission1, and pure eligibility tests reject Mission2; that is source/unit assurance, not a runtime pass.

No production build/lint or performance-stability benchmark claimed. Existing Three/Rapier deprecation warnings observed;404 is a deliberate playback-error test. This milestone does not assert all possible unrelated messages/device situations were exhaustively tested.

## Rollback and integrity

Created `phase6/milestone5H26/rollback-staging/` **before editing**. All159 files match `staging-before.json` and the previously recorded5H25 hashes. This preserves the actual accepted5H25 implementation state, including the old bug, without overwriting the older5H24 rollback.

**588/588 protected-snapshot files unchanged**, including production src/public, standalone5H22, prior rollback copies,5H25 evidence, original WAVs and listening scorecard. Only expected difference in current staging is `src/stagingVoice/StagingVoice.jsx`. See `milestone5H26/integrity-results.json`. This is a focused fresh baseline check, not a new independent47/14/11 historical-manifest audit. Personal saves were not opened; only disposable staging storage was created/used.

Rollback if authorized: stop staging and restore **only** that staging adapter from `milestone5H26/rollback-staging/src/stagingVoice/StagingVoice.jsx`; compare recorded SHA256 and restart staging. No production restore/copy-back, old evidence deletion or save restoration is needed/authorized. Keep all rollback points and samples.

## Files and cleanup

Modified existing: only the copied staging StagingVoice.jsx. New: three requested deliverables and `milestone5H26/` rollback, test scripts, raw JSON, screenshots, CSV builder and integrity/cleanup evidence. No model/audio downloads, synthesis, package changes, rights-check weakening or production audio packaging.

Both disposable browsers and staging servers closed in finally. Read-only process check found0 matching task playthrough/follow-up/staging-server node processes. `cleanup-results.json` records status. **Stopped after fix and regression testing; no production/commercial approval or next scope started.**
