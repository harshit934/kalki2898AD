# Milestone5H.24 — Test results

15November2026. **PASS for one-event staging scope.** Every status below is bounded to actual evidence; unexecuted mission/device/perceptual checks remain UNVERIFIED.

## Executed desktop checks

1. **PASS — Mission1 launches; no prototype audio before movement.**

2. **PASS — Actual PlayerInput keyboard listener installed before movement test.**

3. **PASS — One real movement event starts sample; movement continues during voice.**

4. **PASS — Skip dismisses voice without game hold.**

5. **PASS — Keyboard attack/jump input and clock remain available during playback.**

6. **PASS — 40 rapid movement publications do not duplicate the once-per-round clip.**

7. **PASS — Mute/unmute and existing master volume propagate safely.**

8. **PASS — Pause cancels; resume does not autoplay stale audio.**

9. **PASS — 404 fallback does not change campaign or hold gameplay.**

10. **PASS — Restart disposes old controller; new round may trigger once.**

11. **PASS — Existing reward-store idempotence contract.** Evidence: controlled disposable-store calls, not natural mission completion.

12. **PASS — Exit releases voice and preserves disposable saved progression.**

Chrome157.0.8103.51,1920x1080, new disposable browser context on an ephemeral127.0.0.1 origin. Original environment/default quality unchanged. Browser page errors:0. Deliberate404 produced expected resource error; deprecation warnings observed. Browser timing/performance target not benchmarked. No physical-mobile pass inferred.

The keyboard attack/jump checkpoint sent actual J/K/Space input and verified gameplay clock was not held; **damage/hit outcome was not asserted**. Movement and audio were directly observed. The reward checkpoint intentionally calls existing campaign-store completion methods on disposable data; it is not natural completion. Missing audio never changed campaign bytes or game hold state. Restart/exit checks use real pause-menu actions.

## Automated checks

- **PASS:**9/9 eligibility and event identity tests (`milestone5H24/gate-results.json`).
- **PASS:**17/17 controller tests (`milestone5H24/unit-results.json`), including mocked rejection, constructor/media failure, watchdog, stale completion, mute/volume and rapid-trigger cases.
- **PASS:** final focused lint for new staging adapter; initial ref warning corrected only there.
- **PASS:**405 existing snapshot hashes,151 source rollback matches,26 standalone rollback matches and selected sample hash.
- **UNVERIFIED:** runtime Mission2 exclusion beyond pure gate/source mounting checks; no Mission2 launched or integrated.
- **UNVERIFIED:** full natural Mission1 completion, ending/reward path and actual enemy-hit/boss-defeat regression; no such pass claimed.
- **UNVERIFIED:** naturally occurring spoken-dialogue/cinematic preemption, physical Android/iOS, actual speaker listening, pronunciation, emotion, commercial clearance and sustained performance.

## Prior failed/interrupted attempts

**FAIL:**120s first event wait; **FAIL:**60s event-history wait. Diagnostic capture recorded no event after early input; not a proven playback decoder failure. **UNVERIFIED:** first no-result interruption and one harness-edit/aborted run. All retained separately. Final readiness-aware browser run passed; no production/gameplay change applied to overcome test timing.

Evidence: `milestone5H24/browser-results.json`, `mission1-voice.png`, attempt JSON/PNG, `gate-results.json`, `unit-results.json`, `integrity-results.json`, `cleanup-results.json`. Existing5H22/23 evidence untouched.

**PASS:** test server/browser closed and0 matching staging node processes at final check. Stop after this one-event validation; no production integration or commercial approval.
