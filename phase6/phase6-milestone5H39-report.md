# Phase 6 5H.39 — summary

15 November 2026. **CONDITIONAL RESULT: real browser controller rendering validated; soundtrack and production acceptance remain blocked.**

## Delivered

- `phase6/phase6-milestone5H39-playback-test-results.csv`
- `phase6/phase6-milestone5H39-browser-audio-report.md`
- `phase6/phase6-milestone5H39-deployment-readiness.md`
- This report.

New evaluation location: `phase6/milestone5H39/`. **16/16 main native-browser checks passed**, plus the separate B17 natural-ending/ducking check. Playback was real WebAudio using actual decoded existing WAVs, not mocks. It was tested in headed Chrome 157.0.8103.51 with a disposable profile, no autoplay bypass and no personal save access.

Important qualification: the looping test used original wind ambience, not music. Actual background music and dialogue-plus-soundtrack acceptance are still BLOCKED/UNVERIFIED. Prototype dialogue has existing isolated-use acceptance only; commercial licensing and subjective voice quality were not approved. Native downstream signal does not establish that a human listened or heard speakers.

Two initial test assertions and one network-blocked attempt remain preserved and described; none were overwritten or reclassified as passes. The corrected test measures active-channel gain and downstream signal rather than relying only on inactive parameter getters. No 5H.38 controller or backend fix was needed or applied.

## Integrity

Fresh SHA-256 verification in `milestone5H39/integrity-results.json`:

- **47/47 protected files match.**
- **364/364 existing 5H.38 files unchanged**, including its staging, rollback, build and test evidence.
- **153/153 production source/config files unchanged.**
- **4/4 selected source audio hashes unchanged.** No new audio file created.
- **1,135/1,135 existing bounded evidence files unchanged.**

These checks do not claim independent personal-save content verification. No personal profile or save was accessed. No new campaign, combat, controls, reward or progression modifications.

## Changes and rollback

Only the four new deliverables and new `phase6/milestone5H39/` evaluation files were created: `before.json`, `harness/index.html`, `harness/app.js`, `browser.test.mjs`, `natural.test.mjs`, `build_report_csv.mjs`, minified `build/` output, raw browser-attempt JSONs, natural-end JSON, screenshots, integrity evidence and a created-file manifest. The harness instruments actual native nodes with analysers and source-event records; it is test instrumentation outside the accepted staging copy. Assets are served through four explicit read-only localhost mappings, not copied or packaged. The invalid-media response is test error text, not a generated recording.

No production or previous staging/rollback file overwritten. No movie extraction/copy/integration, audio generation, TTS install, model download, paid request, purchase, account/API-key access or rights-manifest change. The optional source build was not rerun; the new harness production-mode build is the compile/path evidence for this task. No full-game lint/build or gameplay PASS is implied.

Rollback is simply to stop/leave the evaluation and retain its evidence; all prior accepted paths remain untouched. No source restoration or deletion is required. Do not copy the evaluation-only rights labels/asset mappings into production.

## Cleanup and stop

Each browser attempt closed its own browser and HTTP server in finally; successful tests also closed the AudioContext. Both final real-browser runs record `processesStopped=true`. No development server was launched. Existing user apps were not stopped or modified. Validation is finished; **stop here, no production integration.**
