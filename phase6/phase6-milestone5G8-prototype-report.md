# Milestone 5G.8 — Controlled five-line Bhairava voice prototype

15 November 2026. **PASS — isolated generation and technical checks. Voice quality and production approval remain UNVERIFIED.**

## Candidate and settings

Read all three 5G.7 reports and inspected the three preserved WAVs/recorded measurements. Selected **1.00× `male / te_M`** as the documented baseline: original 9.3667-second sample decodes correctly, has no full-scale clipping, and does not introduce a speed change. Neither faster nor slower delivery had been perceptually validated, so no subjective preference was inferred. Original and variant hashes were checked and remain unchanged.

All five new samples use exactly the same settings:

- Existing local model `sulabhkatiyar/indic-tiny-tts-telugu`, revision `fb552545f06d76d7b5d6365827b69c0bda465767`.
- Stock preset `male`, `te_M`, speaker ID 13; configured `read` style.
- CPUExecutionProvider, two CPU threads, seed 42 reset for each line, speed 1.00.
- 24-kHz mono 16-bit PCM WAV; PCM conversion only, no gain normalization, pitch shifting, effects or actor reference.

Texts differ as requested for category coverage; voice/settings are identical. Different text length/prosody means durations and level differences are not direct voice-quality rankings. No additional emotional style is claimed.

## Five original source drafts and results

Exact wording comes from the unchanged 51-entry Milestone 5E CSV. These are existing original project drafts, not movie dialogue or newly invented story. No placeholders or personal data were substituted. Each remains PENDING/UNVERIFIED.

1. **BH6-5E-002 — Mission guidance.** “Clear the remaining patrols, then approach the arena.” Output `BH6-5E-002.wav`: **4.9287 s**, generation **0.3869 s**, peak **−6.90 dBFS**.
2. **BH6-5E-004 — Combat tips.** “Health is low. Create distance and read the wind-up before countering.” Output `BH6-5E-004.wav`: **7.4253 s**, generation **0.3661 s**, peak **−7.36 dBFS**.
3. **BH6-5E-013 — Mission completion conversations.** “A completion is recorded. The facts list shows actual saved rewards.” Output `BH6-5E-013.wav`: **5.5793 s**, generation **0.2974 s**, peak **−9.61 dBFS**.
4. **BH6-5E-037 — Boss encounter guidance.** “Face the Warden; watch its attack wind-up.” Output `BH6-5E-037.wav`: **4.0007 s**, generation **0.2455 s**, peak **−3.23 dBFS**.
5. **BH6-5E-045 — Missing-information fallback.** “Completion history is missing; no completed mission is inferred.” Output `BH6-5E-045.wav`: **5.0567 s**, generation **0.2985 s**, peak **−9.45 dBFS**.

All five files are under `phase6/local-tts-evaluation/milestone5G8/`. Exact Telugu text, English source, ID, category, settings, errors and SHA-256 are in the inventory CSV and `results.json`. Total audio **26.9907 seconds**; model load **0.3576 seconds**. All five requests succeeded locally; error fields are empty. These are isolated context fixtures, not assertions about the user's current health, completion or saved rewards.

## Technical verification

- **PASS:** 5/5 nonempty finite generated waveforms; full PCM readback, expected byte/frame counts, mono/24-kHz/16-bit format.
- **PASS:** zero full-scale samples in all five files; levels vary and were deliberately not normalized.
- **PASS:** five distinct IDs and five categories; identical generation settings; no unresolved template placeholders.
- **PASS:** graph/text-table hashes match the existing pinned download manifest before inference. No new model/dependency download or installation.
- **PASS:** local folder supplied; offline environment flags set and socket networking blocked by Python audit hook during generation. No cloud/paid synthesis.
- **UNVERIFIED:** audible pronunciation, omissions, natural pauses, maturity, authority, five-line identity consistency and gameplay intelligibility. No listening, ASR transcript, human certification or subjective score claimed.
- **UNVERIFIED:** real-time integration performance or phone playback; no game/device test undertaken or implied.

## Local playback page

Open `phase6/local-tts-evaluation/milestone5G8/playback.html` directly in a browser. Keep the five WAVs beside it. No server, account, network or game launch is required by this page.

The page shows line IDs, categories, exact Telugu, English source, duration and pending language status. Native audio controls allow seeking/volume. Starting one sample pauses the others; “Stop all samples” pauses and resets them. There is no autoplay, campaign connection, telemetry or browser-storage access. A persistent notice identifies the text as fixtures and the voice as evaluation-only.

**Executed page checks:** five source files and the attribution-report link resolve; no autoplay/external script/network/storage calls; single-player, stop-all and error feedback logic pass simulated DOM-event tests. Evidence: `page-validation.json`, reproduced by `test_page.mjs`. **Actual browser rendering and speaker playback NOT TESTED**; no desktop/mobile listening approval implied. The page uses responsive CSS, but its appearance across viewports remains unverified.

## Preservation and licences

**85/85** previous evaluation files match the pre-run snapshot, including the original three WAVs. **357/357** recorded production/source/configuration hashes and **3/3** Milestone 5E input hashes match their baseline. Original 51 drafts unchanged; no personal saves accessed. This is not a new independent 47-file/14-copy/11-save audit.

Existing licence findings and attribution requirements in `phase6-milestone5G7-license-attribution.md` remain applicable. Evaluation is supported; no final commercial-output clearance, rights-manifest approval or production voice approval was made. No protected/source asset, production audio, gameplay, settings or save changes.

**Stopped after the isolated prototype.** Review the samples/page before any broader generation, rights-status change or integration.
