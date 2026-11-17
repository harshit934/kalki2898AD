# Phase 5.2 final closure review

Review completed 2026-11-12T03:13:11.185504+05:30 · Asia/Calcutta.

**Decision B — Accepted with documented limitations.** Close the Phase 5.2 development foundation: colorful graphics/UI/HUD work and evidenced M1/M2/chase behavior. This is not unconditional production acceptance, stable-1080p certification or final cinematic art approval. The known failures below remain open, visible release constraints. No diagnostic phase or Phase 5.3 implementation was started.

## Evidence and review method

Reviewed the visual design, HUD, UI, menu asset-quality, stabilization and visual-regression deliverables; Phases 5.2.2–5.2.6 reports/results; retained mission/chase records; latest build/lint logs; and fourteen existing screenshots. Checked image headers and current resolution-label source. Recomputed 47 protected hashes and 159 production/configuration reference hashes. No game runs, benchmarks, traces, build/lint reruns, settings/driver changes, app closures or production edits were performed.

Reports from different stages are not interchangeable: initial 720p/uncapped gameplay descriptions were superseded by the final desktop 1080p pixel budget and 30Hz submission cadence. Latest lint logs contain warnings despite earlier warning-free descriptions. Latest raw mission completion records take precedence over earlier score/duration examples. Existing diagnostic E decisions mean root cause inconclusive; they do not conflict with this separately scoped B milestone-closure decision.

## Functional regression supported by existing evidence

- **mission-1-keyboard: PASS_EXISTING_EVIDENCE.** Normal-input completion, boss defeat, relic, save reload and duplicate-reward checks; no fresh run in closure. Evidence: `phase5/phase521/regression/mission-playthroughs.json#runs[0]`.
- **mission-2-keyboard: PASS_EXISTING_EVIDENCE.** Normal-input completion, three pylons, boss/relic, rewards and M3 unlock; prerequisite M1 unlock fixture is separate. Evidence: `phase5/phase521/regression/mission-playthroughs.json#runs[1]`.
- **mission-2-touch-emulation: PASS_EXISTING_EVIDENCE.** 520x900 laptop-browser touch emulation, not a physical mobile GPU test. Evidence: `phase5/phase521/regression/mission-playthroughs.json#runs[2]`.
- **mission-1-touch-full-completion: NOT_TESTED.** M1 portrait HUD/control-binding evidence exists; no complete ordinary-input M1 touch run is claimed. Evidence: `phase5/phase52-ui-test-results.json`.
- **combat-and-controls: PASS_EXISTING_EVIDENCE.** Movement, sprint, dodge, jump input, light/heavy attack, interaction recorded. These are input coverage checks, not every animation/physics edge case. Evidence: `phase5/phase521/regression/mission-playthroughs.json`.
- **bujji-duel-chase: PASS_EXISTING_EVIDENCE.** Desktop and portrait normal-input duel, chase obstacles, pause/resume, handoff, replay, save and leave cleanup; later timing investigations do not supersede this with a no-stall claim. Evidence: `phase5/phase521/regression/contract-live-results.json`.
- **pause-navigation-audio: PASS_EXISTING_EVIDENCE.** Desktop/portrait settings, audio controls, pause freeze/resume, confirmations, Continue and scene cleanup; no new perceptual audio-quality evaluation. Evidence: `phase5/phase52-ui-test-results.json#productionUi`.
- **saves-rewards-progression: PASS_EXISTING_EVIDENCE.** Reload persistence and noRepeatReward true for all three completed runs. Tests used disposable contexts; Continue restarts a mission run, not a world-position checkpoint. Evidence: `phase5/phase521/regression/mission-playthroughs.json`.
- **hud-full-compact-minimal: PASS_EXISTING_EVIDENCE.** Mode selection and focused visibility/binding tests. Safe-exploration fixture suppresses enemies; boss-state fixture is not a boss defeat. Actual defeat is separately evidenced. Evidence: `phase5/phase52-hud-test-results.json`.
- **desktop-portrait-layout: PASS_WITH_LIMITATIONS.** 12 menu location/layout combinations; 1920x1080, 1366x768, 960x540 at DPR2, 390x844. Other portrait HUD/mission sizes also recorded. Not every device/notch. Evidence: `phase5/phase52-visual-regression-results.json`.
- **build: PASS_EXISTING_EVIDENCE.** Latest retained production build exit code 0; logs phase521/build.log. No new build was needed for report-only closure. Evidence: `phase5/phase52-final-performance-results.json#build`.
- **lint: PASS_WITH_WARNINGS_EXISTING_EVIDENCE.** Exit code 0; four React immutability warnings in MenuScene.jsx. Earlier warning-free descriptions do not describe this latest log. Evidence: `phase5/phase521/lint.log`.
- **physical-mobile-thermal-accessibility: NOT_CERTIFIED.** No physical-phone GPU/thermal run, long laptop thermal certification or measured accessibility/contrast certification. Evidence: `phase5/phase52-visual-design-report.md`.

Latest ordinary-input records show M1 keyboard 57.780s, M2 keyboard 86.082s and M2 touch emulation 92.742s, with boss/relic completion, reload persistence and no-repeat rewards. Desktop M1/M2 buffers are 1920×1080; M2 touch is 520×900. M2 prerequisite unlock is an explicit fixture, not an inferred full M1 touch completion. These are historical recorded passes, not fresh closure tests.

## Visual acceptance

The main-menu band, title/logo overlap and inaccessible-menu concerns are resolved in the retained twelve-state layout evidence. The UI, pause/settings and three HUD modes support a usable foundation. [Visual review](phase52-final-visual-review.md) documents what the actual captures still show: stale 720p settings label, repeated facade/paving motifs, simple Shambhala foliage/mountains, underdeveloped Complex lower city and structural presentation, primitive gameplay/chase assets, tiny HUD text and a portrait card-contrast concern. No “all visuals finished” or Last Caretaker reference-match claim is supported. Shambhala/Complex remain location studies; ninety chapters remain planned, disabled content.

## Performance — maxima remain acceptance limitations

The final native-1080p counted set has 12/12 valid records. Combat averages 29.23–30.00 FPS, but its three maxima are **215.0 / 1820.5 / 43.2ms**; p95 35.5–35.6ms and p99 38.2–42.5ms. Complex menu maxima are **521.3 / 42.3 / 146.5ms**. The no-repeated->100ms gate failed. Typical pacing near 30 FPS does not erase multi-second freezes. See [final performance](phase52-final-performance-results.json).

Phase 5.2.5 retained twenty matched 720p windows, including a **2475.9ms** chase render interval. Phase 5.2.6 recorded ten visible-Chrome 720p windows with **58.7ms maximum completed interval**, but also a **286.1ms censored chase tail without another main render call while rAF continued**. The latter is a lower-bound observation drought, not a complete GPU/display stall measurement or a passing sample. These measurements use different headless/visible and observer conditions; no speedup or stabilization claim follows.

The 3479.729ms historical Chrome GPU-main fence registration-to-completion is identified on an AMD-associated device with real thread blocking. The renderer dependency, delayed producer and complete cross-adapter chain are still unresolved. NVIDIA performs game WebGL rendering; AMD display/composition ownership is not automatically the cause. Generic UserRequest waits and adjacent queue delays are not causal diagnoses.

System RAM pressure is a demonstrated contributor to specific faults/waits, including approximately 222.69ms main-thread hard-fault overlap within a 323.5ms combat gap. The 2475.9ms gap had zero overlapping owned-browser hard faults. Reduced-background comparison lowered commit and some browser faults without materially increasing available physical RAM or consistently improving combat. Neither 8GB RAM nor GTX VRAM exhaustion is established as the primary universal cause; no hardware upgrade cure is claimed.

**Realistic target:** approximately 30 FPS at 1280×720 is a conservative development target on the GTX1650/4GB, Ryzen5600H/8GB laptop, with rare stalls still possible. Keep 1920×1080 as an output ambition/optional measured mode, not a stable guarantee. No quality/resolution change is made by this review. Mobile approximately-30-FPS aims require physical-device evidence; laptop portrait emulation is functional/layout coverage only. Sustained thermal behavior and physical frame presentation are unverified.

Trace quality is not universally perfect: Phase 5.2.4 combat sync2 lost 252891 events; later zero-loss records do not repair it. Phase 5.2.5 selected comparisons and Phase 5.2.6 captures have zero-loss evidence, with stated clock/observer limitations. Historical 1820.5/521.3ms causes cannot be retroactively inferred from newer captures.

## Protection and changes

Fresh verification: **47/47 protected checks and 159/159 production/configuration reference checks match**. Bhairava, Groom17 and rollback assets were not modified. User browser saves were not opened or reset. Historical immutable 4014-file passes remain prior evidence; closure does not claim a new full 4014-file scan.

This review only creates the requested reports/results, a reproducible review script and a byte-preserving archive of the old hash manifest. The requested `phase52-final-changes-and-hashes.json` previously held the 5.2.1 implementation manifest; its original bytes are retained at [archived manifest](phase52-closure-evidence/phase521-final-changes-and-hashes.original.json). The new manifest records this review and points to that baseline, so prior source-change evidence is not lost.

## Closure and Phase 5.3 handoff

Close Phase 5.2 as an accepted development foundation with the listed performance/art limitations. Freeze this evidence and carry the numbered issues into a separately authorized Phase 5.3 scope; do not start implementation now. Prioritize one bounded playable-mission art-quality milestone with existing HUD/save contracts and explicit frame-tail limits, rather than an automatic new diagnostic phase. Stable 1080p, final cinematic art and physical-mobile claims remain release gates, not achievements of this closure.

Carry-forward priorities: (1) severe-stall and censored-tail risk, (2) production geometry/material/dressing quality for a bounded mission and location previews, (3) settings-label accuracy and typography/contrast polish, (4) physical-mobile/thermal acceptance coverage. Do not automatically create Phase 5.2.7 or another diagnostic phase. A later production repair requires verified evidence; no speculative optimization is approved here.

Acceptance B acknowledges these limitations for the development milestone now. Stable-performance and cinematic-quality gates are explicitly not passed. Phase 5.3 requires its own user-authorized scope; this report is a handoff, not an implementation start.

## Deliverables

- [Acceptance results](phase52-final-acceptance-results.json): evidence-backed statuses, per-run 1080p metrics, 720p aggregates, screenshots/hashes and all limitations.
- [Visual review](phase52-final-visual-review.md): observed art/UI quality and unresolved issues.
- [Changes and hashes](phase52-final-changes-and-hashes.json): fresh protected/reference checks and archived historical manifest.
