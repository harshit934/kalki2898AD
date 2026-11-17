# Phase 6 Milestone 5H.30 — Bhairava prototype closure assessment

15 November 2026. **Final decision: CONDITIONAL PROTOTYPE ACCEPTANCE.**

Desktop staging functionality is supported by real browser playback and natural Mission1 gameplay evidence. Physical Android, independently reviewed voice quality and commercial asset clearance remain unresolved. The prototype is **not ready for production integration or commercial distribution**. This closes the evidence consolidation task only; it does not silently promote a staging copy or authorize another milestone.

## Candidate and acceptance boundary

- Standalone prototype: `phase6/bhairava-voice-prototype5H22/`, five existing samples and isolated event fixture.
- Accepted one-event staging fallback: `phase6/milestone5H24/staging/`, including the5H.26 guidance-lifecycle fix, conditionally accepted by5H.27.
- Expanded experimental staging: `phase6/milestone5H28/staging/`, calm/low-health/Warden/saved-completion bindings.5H.29 naturally completed Mission1 in this copy unchanged. This evidence does not replace the separate accepted fallback or copy any code into production.

The stock Indic Tiny te_M selection remains temporary prototype use under [5H.21](phase6-milestone5H21-voice-decision.md). User selection is not a completed listening scorecard, commercial licence or independent pronunciation certification.

## Consolidated findings

The companion [requirements checklist](phase6-milestone5H30-requirements-checklist.md) classifies all eleven requested areas and cites exact reports/raw evidence. Top-level results:6PASS,2CONDITIONAL PASS,2UNVERIFIED,1BLOCKED.

1. **PASS — implementation:** five-sample isolated controller and fallback work within the prototype.17contract tests cover cancellation, duplicate events, failure and timeout paths. [5H.22 implementation](phase6-milestone5H22-implementation-report.md).
2. **PASS — desktop controls:** actual Chrome playback, Skip/replay, mute/volume, first-gesture initialization and404fallback; standalone30-trigger test observed peak1 active player. Gameplay controls were also exercised during the natural run. [5H.23 acceptance](phase6-milestone5H23-acceptance-results.md), [5H.29 results](phase6-milestone5H29-playthrough-results.md).
3. **CONDITIONAL PASS — Mission1 integration:** lifecycle and actual gameplay are supported for bounded staging contexts. Not all timing races, mobile policies or production ownership/packaging are verified. [5H.24 integration](phase6-milestone5H24-integration-report.md), [5H.26 fix](phase6-milestone5H26-bugfix-report.md), [5H.27 audit](phase6-milestone5H27-report.md), [5H.29 results](phase6-milestone5H29-playthrough-results.md).
4. **PASS — four contextual categories:** calm/movement, combat, Warden and victory naturally triggered with factual state. The serious missing-history sample is not a valid ordinary emotional Mission1 event and remains unmapped. [5H.28 assessment](phase6-milestone5H28-gap-assessment.md), [5H.29 results](phase6-milestone5H29-playthrough-results.md).
5. **PASS — natural completion:** Warden defeat, relic, unskipped ending and victory demonstrated without setters/fixture/seeded completion. Single expanded-copy natural run; not soak/repeatability certification. [5H.29 results](phase6-milestone5H29-playthrough-results.md).
6. **PASS — rewards/unlock/persistence:** naturally earned2500boss+750relic and Mission2unlock survived reload. Separate one-event browser-restart evidence is bounded to its initially seeded disposable profile and no reseeding after relaunch. [5H.27 audit](phase6-milestone5H27-report.md), [5H.29 results](phase6-milestone5H29-playthrough-results.md).
7. **CONDITIONAL PASS — Mission2:** actual isolated desktop runtime smoke and voice exclusion passed. Not full mission/boss/chase/mobile regression, and no voice enabled there. [5H.28 assessment](phase6-milestone5H28-gap-assessment.md).
8. **UNVERIFIED — physical Android:** no accessible device/test evidence. Emulation is separate. [5H.23 acceptance](phase6-milestone5H23-acceptance-results.md), [5H.28 assessment](phase6-milestone5H28-gap-assessment.md).
9. **UNVERIFIED — pronunciation/quality:** original scorecard remains0/50ratings and0/10listenedYES; temporary user preference is preserved without inventing verification. [5H.21 decision](phase6-milestone5H21-voice-decision.md), [5H.28 assessment](phase6-milestone5H28-gap-assessment.md).
10. **BLOCKED — commercial clearance:** outstanding output/voice-use, applicable data conditions and shipping obligations remain documented, not resolved. [5H.28 assessment](phase6-milestone5H28-gap-assessment.md), underlying [5H.13 rights resolution](phase6-milestone5H13-rights-resolution.md).
11. **PASS — protection:** staging, prototype and rollback preserved; no production or personal-save changes. Fresh47protected hashes and1135existing snapshot hashes match. [5H.27 rollback](phase6-milestone5H27-rollback-verification.md), [5H.29 summary](phase6-milestone5H29-report.md), `milestone5H30/verification.json`.

## Strongest natural gameplay evidence

`milestone5H29/attempt-1/raw-results.json` and `natural-completion-summary.json` establish:

- New disposable profile/context, starting100HP and no completion/rewards. State reads assisted automated ordinary keyboard play; no health/damage/teleport/completion setter or victory fixture used.
- Combat warning at31HP, Warden warning at22HP, natural completion at12.1HP. Four automatic category identities occurred once in the round; explicit replay did not duplicate rewards.
- `kashi-contract-return` returned with reason completed at12:30:24.213UTC and became idle12:30:25.059UTC. Victory event12:30:25.388UTC,329ms later, with cinematic=false and actual recorded completion/rewards.
- Final4650score/six crystals includes variable combat/collection points; saved fixed rewards remain2500+750. Mission2unlocked, exact progress preserved on page reload. No Mission2 launch in5H.29.

Screenshots are genuine gameplay captures: [natural ending](milestone5H29/attempt-1/ending-natural.png) and [natural victory/voice](milestone5H29/attempt-1/victory-natural.png). They are not the5H.28 injected victory fixture. Media currentTime/status verifies technical playback, not speaker output, language quality or performance stability.

## Historical failures and their disposition

- **5H.25 stale patrol guidance — historical FAIL, corrected and verified.** Last clip survived completion visually because rendering checked only active/clip.5H.26 added current-context cleanup in one staging adapter. Actual natural victory screenshot and regressions verified the fix. The legitimate new victory line in5H.29 is not the obsolete patrol instruction. [5H.25](phase6-milestone5H25-playthrough-results.md), [5H.26](phase6-milestone5H26-bugfix-report.md).
- **5H.28 defeat — historical FAIL retained, recovery demonstrated by5H.29.** Previous player entered the boss at19.6HP and died with Warden46HP. Strongest explanation is ordinary accumulated damage/less effective defensive input. Exact old final-hit attribution remains unverified. The successful retest changed the test's keyboard strategy, not game health, difficulty or source. [5H.29 investigation](phase6-milestone5H29-failure-investigation.md).
- **Test-harness limitations are not erased.**5H.28 initially used a non-zero-padded Mission2locator and sent early fixture input; corrected follow-ups supplied actual evidence. Its raw no-stale-calm assertion had an invalid time predicate and is not acceptance proof. A fixture PASS never became natural completion evidence;5H.29 separately supplied the latter. [5H.28 assessment](phase6-milestone5H28-gap-assessment.md).

These milestones are evolving, overlapping tests; adding their PASS totals would double-count evidence. No pooled reliability percentage is asserted.

## Remaining gates before any production integration

1. Resolve applicable commercial output/voice-use and distribution conditions with supporting evidence. Approve exact audio hashes, dialogue mappings and required notices. Existing model/code declarations alone do not grant every missing right. Keep production playback/packaging blocked until cleared.
2. Keep independent pronunciation/emotional quality UNVERIFIED until actual recorded listening/content evidence supports it. Do not fill blank ratings automatically or treat the user's prototype choice as certification.
3. Obtain physical Android playback/lifecycle evidence when a device is available. Do not substitute browser emulation.
4. If a future integration is authorized, define one shared audio ownership/priority lifecycle and exact permitted event scope, retain Skip/nonblocking text fallback, and validate active-clip cinematic preemption. In the natural5H.29 run, boss speech had already ended; that specific forced-preemption situation remains unverified in actual gameplay despite unit/simulation coverage.
5. Validate future production packaging and affected gameplay/build/lint/performance on the actual production candidate after any separately approved changes. Current prototype tests did not establish sustained30FPS, full mobile gameplay, complete dialogue coverage or a release-ready build. Prior performance limitations remain documented; no broad investigation reopened here.

These are unresolved acceptance gates, not authorization to implement them. No extra campaign or voice features are proposed as completed. The serious/missing-history sample must not be forced into an unrelated emotional scene.

## Fresh review verification and preservation

Read original5H.21–29 reports and supporting raw records; `milestone5H30/verification.json` lists21reviewed Markdown documents plus selected raw evidence with SHA-256 values. This milestone reused valid tests and launched **no new browser/gameplay/unit test**.

Fresh read-only checks: **47/47 protected expected hashes match;1135/1135 files in the5H.29 existing snapshot remain unchanged.** This bounded coverage includes both staging copies and prior protected rollback/evidence sets; no claim every drive file or personal-save contents was audited. Personal profiles were not accessed. No source/audio/draft/save/configuration/package was changed, and no synthesis/download/purchase occurred.

Only this closure report, the companion requirements checklist and `phase6/milestone5H30/` read-only verification records were created. No rollback restore, deletion or production copy-back. New gameplay tests were unnecessary for this documentary closure. No production build/lint rerun or new performance pass is claimed.

Final read-only process check found0matching staging/test Node processes; historical browser cleanup remains recorded. No user process was terminated. **Stopped after assessment. Await review; production integration has not begun.**
