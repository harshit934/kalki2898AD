# Phase 7.1 resource-aware browser acceptance

15 November 2026. **Final decision: BLOCKED.** Actual browser testing established partial functional and visual results. Critical Skip/Replay/returning-session and camera-handoff checks remain incomplete; no full visual approval.

## Method and actual runs

Existing Phase 7.1 staging, one disposable Chrome 157 context/tab and one loopback static server at a time; 960×540/DPR1, existing graphics settings. No personal profile, seeded campaign completion, gameplay-state setters or production edits. Browser build adds read-only observations without changing staging source. No arbitrary 2 GB RAM launch requirement.

Preflight: 659,140,608 bytes available physical RAM and 4,710,699,008 bytes commit headroom. No leftover owned test processes found; no unrelated user applications closed. Windows memory monitored throughout each run. Only two sequential sessions: initial acceptance and one focused instrumentation-fix retest.

**First run — `phase7.1/browser-evaluation/attempt-1794766452475/`:**

- PASS: fresh launch automatically opened the cinematic without a completion fixture.
- PASS: full 28-second authored sequence reached idle/free-roam state; cinematic hold released; completion marker recorded. Campaign remained uncompleted with no rewards fabricated.
- PASS: establishing, reveal, close-up and rear/handoff-stage screenshots captured and inspected.
- Historical test FAIL: camera handoff assertion could not execute because `openingProof` was absent. It was a missing diagnostic observer, not proof of an in-game camera failure. Subsequent test scenarios were not executed.

**Focused correction and retest — `phase7.1/browser-evaluation/attempt-1794766555230/`:**

Root cause of the diagnostic failure: the observation plugin attempted to replace a JSX element after React had already transformed it. Added `enforce: 'pre'` to the test-build plugin, preserved its previous script/log, and rebuilt successfully. No gameplay/camera source correction was needed or made.

Retest verified that the observer was mounted: 42 real camera samples, 36 distinct positions, finite positions/quaternions through cinematic time 9.8899 seconds. The monitor then stopped execution after physical RAM stayed below 128 MiB for three consecutive samples. Minimum recorded RAM was 54,341,632 bytes (51.8 MiB); minimum commit headroom was 2,965,450,752 bytes (2.76 GiB). The Target closed exception followed intentional cleanup, not an independent browser crash. No further attempt made.

## Scenario status

- **PASS:** new-campaign automatic opening.
- **PASS, bounded:** environmental/reveal/close-up shot progression and visible character composition in four inspected landscape frames; actual camera motion observed in the retest's first ~10 seconds.
- **PASS:** natural sequence completion into the existing free-roam state, with the cinematic hold cleared.
- **BLOCKED:** continuous handoff/snap measurement, normal post-cinematic movement/follow/orbit controls, Skip, Replay, refresh/returning-session behavior and portrait rendering. These assertions were not reached.
- **BLOCKED:** full-path no-clipping/no-freezing/no-visual-glitch acceptance. No obvious camera/character intersections appear in the four inspected frames, but still captures and partial telemetry cannot prove the whole path safe.
- **PASS, scoped observation:** no uncaught page errors recorded before each run stopped. This is not an error-free complete-playthrough pass.

One focused fix-and-retest was used for instrumentation. The original failing assertion and resource-aborted retest remain preserved; no untested interaction promoted to PASS.

## Visual evidence and limitations

Actual first-run screenshots:

- [Establishing](<C:/Users/Hp/Downloads/kalki 2898AD/phase7/phase7.1/browser-evaluation/attempt-1794766452475/establishing.png>)
- [Character reveal](<C:/Users/Hp/Downloads/kalki 2898AD/phase7/phase7.1/browser-evaluation/attempt-1794766452475/reveal.png>)
- [Character close-up](<C:/Users/Hp/Downloads/kalki 2898AD/phase7/phase7.1/browser-evaluation/attempt-1794766452475/closeup.png>)
- [Rear/handoff-stage framing](<C:/Users/Hp/Downloads/kalki 2898AD/phase7/phase7.1/browser-evaluation/attempt-1794766452475/handoff.png>)

The establishing image differs substantially from the reveal and close-up; the sequence is not merely a stationary gameplay view. The close-up preserves readable face, torso and weapon framing. The existing world has a sparse horizon and repetitive buildings, and the mission-hub label remains visible in cinematic compositions. These are visible presentation limitations; no world/UI redesign attempted. Overall polished visual quality is not approved.

## Performance observations

First run recorded 123 cinematic-state samples and reached authored time 28 seconds. Available RAM stayed at or above 291,147,776 bytes (278 MiB); minimum commit headroom was 2,676,269,056 bytes (2.49 GiB). Second run's sustained physical-memory pressure caused the safe stop despite higher commit headroom. This shows why a fixed available-RAM admission threshold was not used and why ongoing pressure monitoring remains necessary.

Continuous render-frame timing was not captured. No average FPS, p95/p99 frame time, stable-30-FPS, latency or no-stall claim is made. Snapshot intervals are not frame-time measurements.

## Build, tests, integrity and stop

Focused instrumented build PASS; existing large-chunk warning. Fresh staging lint PASS: zero errors, nine existing warnings. Prior 68 automated passes remain valid historical checks; not unnecessarily rerun because no staging implementation changed.

Fresh SHA-256: **47/47 protected, 153/153 production source/config, 171/171 Phase 6 baseline, 171/171 rollback and 173/173 Phase 7.1 source files unchanged**. Personal saves not accessed or modified. No audio-event changes, new assets/models, installations, purchases or copyrighted media. Updated CSV retains historical instrumentation FAIL separately from fixed observer PASS and remaining BLOCKED checks.

Evidence manifest and fresh hashes are under the acceptance directory identified by `phase7.1/acceptance-current.json`. Browser/server/monitor cleanup recorded in both raw results; both exact owned Chrome PIDs were verified absent and owned test-runner count was zero. No Phase 7.2 started.

**Stop with BLOCKED acceptance.** No additional test or implementation cycle started. Remaining runtime criteria must be explicitly completed before this can receive full browser/visual acceptance.
