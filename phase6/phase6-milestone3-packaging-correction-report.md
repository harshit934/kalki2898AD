# Phase 6 Milestone 3 — Production voice-packaging correction

14 November 2026 (Asia/Calcutta).

**Result: PASS for the authorized packaging correction.** Both unapproved catalogue recordings are absent from the clean production package. Their original source files, runtime playback guards, Telugu text and Milestone1 behavior are unchanged. Phase5 remains CONDITIONAL ACCEPT. No voice integration or broader assistant work began.

## Root cause

`vite.config.js` previously left Vite's default `publicDir=public` and `build.copyPublicDir=true`. The installed Vite implementation (`node_modules/vite/dist/node/chunks/node.js`, public copying around34410) copied that directory directly to the build output. The catalogue's URL strings are runtime references, not an asset-packaging permission rule. `audioManager.js` rejects voices lacking `distributionRights.verified===true` when playback is requested; it cannot influence Vite's independent public-directory copying.

Consequently both OGG recordings were present in `dist` even though catalogue playback was blocked. Milestone2 documented that distinction. Its report and Telugu review sheet were read and preserved, not rewritten.

## Exact changes

Existing configuration modified: **`vite.config.js`** imports/registers the build-only policy and sets `build.copyPublicDir:false`.

New helper: **`tools/voice-build-policy.mjs`**:

- Reads the existing `DIALOGUE_INVENTORY`; entries without verified rights are denied. No catalogue or approval field is edited.
- Copies public assets through a filter, omitting denied catalogue paths and byte-identical aliases elsewhere in public. Missing research placeholders remain excluded.
- Preserves the normal bundle-over-public collision precedence; no unrelated asset conversion, compression or runtime loading change is introduced.
- Audits written output for the blocked recordings' full raw bytes and full base64 representations, regardless of filenames. Imported, renamed, embedded or stale matching copies fail the build rather than producing a reported successful package.
- Rejects unsafe output/source traversal and symlinks requiring explicit review. It performs no source-asset deletion or renaming. `apply:'build'` leaves development serving and runtime rights checks unchanged.

No files under `src/` or `public/` changed. No dependency, script command, save format, reward, unlock, control, combat, audio-manager or Telugu change was made. The helper adds build-time file-copy/fingerprint I/O only; the observed clean build took35.66 seconds, with26.8 seconds attributed by Vite to the policy hook. This is not gameplay frame cost or a promised future build duration.

## Clean-build and output evidence

A harmless marker was placed in generated `dist` before the final `npm run build`. Vite removed it through the normal clean-output lifecycle. No manual recursive project cleanup was used.

Independent verification after the clean build:

- **Absent:** `dist/audio/kalki/bhairava/overdrive-voice.ogg`.
- **Absent:** `dist/audio/kalki/bujji/support-voice.ogg`.
- **229 output files scanned:** zero complete raw-byte or base64 matches for either blocked recording, including differently named/hash-named or embedded copies.
- **200 other public files retained byte-identically**, including existing cinematic effects, models, environments and videos. No missing/changed unrelated public asset was found.
- The two source files remain at their original `public/audio/kalki/...` paths with the same hashes: Bhairava `2a4ea78e143410482583df694d6e0c64ff3762cd71dc8aac0ddf5ef5ad06ac96`; Bujji `8f81cf87b74aff66c041eaa992b40d6119d31b83fa710c3c05f14441328d4207`.

Evidence: `milestone3/build-output-verification.json` contains the full output hash manifest and source comparisons. `clean-build.log` records two excluded public files/two fingerprints. No renamed copy was substituted for either source recording.

## Validation results

- **PASS — Clean production build and lint:** clean-build-exit.txt and lint-exit.txt:0; nine existing lint warnings, no new source warnings.
- **PASS — Both original recording paths absent:** build-output-verification.json: both absent from dist.
- **PASS — No renamed/hashed/embedded exact-content copies:** Independent raw/base64 scan of all229 output files: zero hits; matching-copy guard unit cases pass.
- **PASS — Source assets and all other public files preserved:** Both source recordings retain paths and SHA256; all200 other public files copied byte-identically.
- **PASS — Existing runtime rights rejection:** All six unapproved catalogue entries rejected in both mute states, no audio requests/objects; runtime rights code unchanged.
- **PASS — Text-only assistant in production:** Uninstrumented clean dist: seven prompts, actual reward/replay facts, Telugu text, keyboard/touch activation, pause/dismissal and unchanged disposable campaign data at three viewport sizes.
- **PASS — Ending/replay regression:** Controlled pre-relic fixture drives normal relic-state effect, full ending without skip, victory and restart; campaign bytes unchanged. Not a fresh natural full-combat Mission1 clear.
- **PASS — Representative boss regression:** Actual Mission20 duel, three phases, both observed attacks, defeat/relic/rewards/reload; separate isolated test build applies same packaging policy.
- **PASS — Integrity:** 47 protected hashes,14 preserved campaign copies,11 personal-save baseline hashes match. All runtime source and public assets unchanged.
- **PASS — Process cleanup:** Successful Windows query: zero owned milestone Node processes/listeners on5558,5592,5594.
- **UNVERIFIED — General audio rights clearance and stable performance:** Not granted or tested by this packaging correction; other media/archived builds and historical performance limitations remain outside acceptance.

Focused policy tests use synthetic text sentinels, not generated voice/audio. Nine cases passed: path/alias filtering and source retention, approved synthetic metadata, rejection of renamed/embedded/base64/stale output, collision precedence, unsafe output/config rejection and source traversal rejection. Runtime guard checks cover six entries in both mute states plus pause/resume; thirteen pure text/context/recap checks pass.

Production browser tests used **the actual clean uninstrumented `dist`**, not only a diagnostic substitute:1920×1080 desktop,430×932 portrait and932×430 landscape. All had zero page errors/audio requests, working factual text while recordings were absent, working activation/dismissal/pause, contained scrollable panels and unchanged disposable campaign storage. Fresh captures: [desktop](milestone3/production-desktop.png), [portrait](milestone3/production-portrait.png), [landscape](milestone3/production-landscape.png).

The separate minimal diagnostic build also uses the packaging policy; it supplies read-only test exports for the existing fixture-based ending/replay and real-input boss drivers. The controlled Mission1 ending played to victory without skipping and restarted correctly. This is explicitly not a fresh full natural Mission1 combat clear; the Milestone1 natural clear evidence remains valid historical evidence against unchanged runtime source. Actual Mission20 covered phases1–3 and chain-hook/debt-circles, then defeat/relic/reward and reload persistence. No personal profile was used.

The boss test is a functional regression, not a stable-FPS certificate. Its journal recorded two >100ms gaps, maximum454.2ms; timestamps and renderer measurements are preserved in `observed-frame-summary.json`. Cause was not established, and no optimization was attempted. Existing portrait stutters and historical interruptions remain documented limitations of the conditionally accepted baseline. Packaging acceptance does not silently mark them fixed.

## Integrity, preservation and remaining limits

`milestone3/final-integrity.json`: of357 pre-change source/public/config baseline files,356 are unchanged and only `vite.config.js` changed; the new helper's hash is recorded separately. All runtime source, rights-enforcement code, source recordings and other public assets are unchanged. **47/47 protected hashes,14/14 independent preserved campaign copies and11/11 personal-save baseline hashes match.** Personal storage was only checksum-read, never launched or written; whole-directory/pre-update historical integrity is not asserted for the previously unbaselined LOCK file.

Milestones1/2 reports, screenshots, tests and review content were preserved. Only new evidence/scripts/fixtures under `phase6/milestone3/`, this report, the helper and build configuration were authored; generated `dist` was regenerated as authorized.

Remaining limits:

- Runtime guards still do not prove licensing; zero catalogue voices have verified distribution rights. No recording was enabled or newly approved.
- This policy covers the current voice catalogue, not every media file or a general copyright audit. Unchanged cinematic cue/video paths identified in Milestone2 still require their separate rights/ownership review before future reuse. Their runtime architecture was not changed.
- Source/dev public URLs and **historical archived/diagnostic builds may still contain the preserved recordings**. Do not distribute the whole workspace or old evidence builds as a release. Use only the verified current production package; preservation requirements deliberately prevent purging previous evidence.
- Raw/base64 checks prove absence of matching current recording data; they are not perceptual audio fingerprinting for arbitrary transcoded/obfuscated derivatives or protection against files manually added after validation.
- No fluent Telugu approval, physical-device/audio-output test, voice synchronization test or new broad performance certification is claimed.

## Rollback and stop status

Backup: `milestone3/rollback/vite.config.js`; exact config diff: `config-changes.patch`; hashes: `initial-integrity.json` / `final-integrity.json`. To roll back, stop any build/server, check for subsequent edits, restore only that config backup and rebuild if needed. The helper can remain unused; do not delete source recordings or restore a whole project/save tree. **Rolling back restores the old packaging gap**, so such output must not be distributed without separate rights/packaging approval.

Final cleanup query succeeded: no owned milestone Node driver or listener on ports5558,5592,5594 remained. All browser contexts and owned preview servers were closed normally; no unrelated process was stopped. `cleanup-verification.json` records the check.

Machine-readable acceptance: `milestone3/acceptance-results.json`. Additional evidence: policy-unit, rights-check, text-assistant, production-browser, transition and boss results/logs, plus build/lint exits. All test evidence and rollback files are preserved. **Stopped after this correction; awaiting approval. No voice integration or assistant expansion started.**
