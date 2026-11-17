# Milestone 5H.10 — Voice technical readiness audit

15 November 2026. **Overall: CONDITIONAL for continued isolated technical evaluation; NOT ready or approved for production integration.** Audio integrity PASS does not imply pronunciation, emotion, rights clearance or integration readiness.

## Scope and evidence

Read existing5G.7 quality/licence reports,5G.8 prototype report/inventory,5H.7 evaluation/inventory/results/resource logs/playback validation,5H.8 guide/scorecard and5H.9 decision/report. Inspected current prototype HTML and production `src/audio/audioManager.js`, `src/game/assistant/BhairavaAssistant.jsx`, and catalogue/assistant references. Fresh checks used only Python standard-library file hashing, PCM decoding, inventory validation and local link checks. No model import/inference, audio generation, browser launch, package/model download, game run or save access.

Evidence labels: **PASS** = specified technical property demonstrated; **FAIL** = required capability absent or check contradicted; **CONDITIONAL** = source-supported/preparatory capability with unresolved dependencies; **UNVERIFIED** = no adequate runtime/perceptual evidence. FAIL below refers to an integration-readiness criterion, not a defect requiring unauthorized changes to the passing text-only milestone.

## 1. File integrity and WAV validation — PASS

Freshly read **18/18 existing evaluation WAVs**, comprising original+two5G.7 variants, five5G.8 lines and ten5H.7 controls/variants. All match their recorded SHA-256 and duration, decode the full declared frame count, have nonzero signal and are uncompressed mono24,000Hz16-bit PCM. Zero full-scale samples. Total stored WAV bytes **5,210,200**, summed file durations **108.5293s**. Duplicated controls intentionally count as separate stored files; this is not unique dialogue duration. File validity cannot certify final-word completeness or linguistic correctness.

- `local-tts-evaluation\milestone5G8\BH6-5E-002.wav` — BH6-5E-002, 5G.8 baseline: **4.9287s**, 118,288 frames; SHA-256 matches; PCM24kHz/mono/16-bit; no full-scale samples.
- `local-tts-evaluation\milestone5G8\BH6-5E-004.wav` — BH6-5E-004, 5G.8 baseline: **7.4253s**, 178,208 frames; SHA-256 matches; PCM24kHz/mono/16-bit; no full-scale samples.
- `local-tts-evaluation\milestone5G8\BH6-5E-013.wav` — BH6-5E-013, 5G.8 baseline: **5.5793s**, 133,904 frames; SHA-256 matches; PCM24kHz/mono/16-bit; no full-scale samples.
- `local-tts-evaluation\milestone5G8\BH6-5E-037.wav` — BH6-5E-037, 5G.8 baseline: **4.0007s**, 96,016 frames; SHA-256 matches; PCM24kHz/mono/16-bit; no full-scale samples.
- `local-tts-evaluation\milestone5G8\BH6-5E-045.wav` — BH6-5E-045, 5G.8 baseline: **5.0567s**, 121,360 frames; SHA-256 matches; PCM24kHz/mono/16-bit; no full-scale samples.
- `local-tts-evaluation\milestone5H7\BH6-5E-002-matched-control.wav` — BH6-5E-002, matched-control: **4.9287s**, 118,288 frames; SHA-256 matches; PCM24kHz/mono/16-bit; no full-scale samples.
- `local-tts-evaluation\milestone5H7\BH6-5E-002-calm-assistance.wav` — BH6-5E-002, calm-assistance: **5.2013s**, 124,832 frames; SHA-256 matches; PCM24kHz/mono/16-bit; no full-scale samples.
- `local-tts-evaluation\milestone5H7\BH6-5E-004-matched-control.wav` — BH6-5E-004, matched-control: **7.4253s**, 178,208 frames; SHA-256 matches; PCM24kHz/mono/16-bit; no full-scale samples.
- `local-tts-evaluation\milestone5H7\BH6-5E-004-combat-urgency.wav` — BH6-5E-004, combat-urgency: **6.5173s**, 156,416 frames; SHA-256 matches; PCM24kHz/mono/16-bit; no full-scale samples.
- `local-tts-evaluation\milestone5H7\BH6-5E-013-matched-control.wav` — BH6-5E-013, matched-control: **5.5793s**, 133,904 frames; SHA-256 matches; PCM24kHz/mono/16-bit; no full-scale samples.
- `local-tts-evaluation\milestone5H7\BH6-5E-013-victory-confidence.wav` — BH6-5E-013, victory-confidence: **5.3360s**, 128,064 frames; SHA-256 matches; PCM24kHz/mono/16-bit; no full-scale samples.
- `local-tts-evaluation\milestone5H7\BH6-5E-037-matched-control.wav` — BH6-5E-037, matched-control: **4.0007s**, 96,016 frames; SHA-256 matches; PCM24kHz/mono/16-bit; no full-scale samples.
- `local-tts-evaluation\milestone5H7\BH6-5E-037-boss-intensity.wav` — BH6-5E-037, boss-intensity: **3.6627s**, 87,904 frames; SHA-256 matches; PCM24kHz/mono/16-bit; no full-scale samples.
- `local-tts-evaluation\milestone5H7\BH6-5E-045-matched-control.wav` — BH6-5E-045, matched-control: **5.0567s**, 121,360 frames; SHA-256 matches; PCM24kHz/mono/16-bit; no full-scale samples.
- `local-tts-evaluation\milestone5H7\BH6-5E-045-serious-delivery.wav` — BH6-5E-045, serious-delivery: **5.6133s**, 134,720 frames; SHA-256 matches; PCM24kHz/mono/16-bit; no full-scale samples.
- `local-tts-evaluation\indic-tiny-male-evaluation.wav` — BH6-5E-001, 5G.7 speed 1.0: **9.3667s**, 224,800 frames; SHA-256 matches; PCM24kHz/mono/16-bit; no full-scale samples.
- `local-tts-evaluation\indic-tiny-male-speed-092-5g7.wav` — BH6-5E-001, 5G.7 speed 0.92: **10.1560s**, 243,744 frames; SHA-256 matches; PCM24kHz/mono/16-bit; no full-scale samples.
- `local-tts-evaluation\indic-tiny-male-speed-108-5g7.wav` — BH6-5E-001, 5G.7 speed 1.08: **8.6947s**, 208,672 frames; SHA-256 matches; PCM24kHz/mono/16-bit; no full-scale samples.

## 2. Playback compatibility and initialization — CONDITIONAL / UNVERIFIED

PASS: all15 existing5H.7 native audio source links resolve locally; files have consistent PCM WAV format. Earlier page-validation JSON records simulated single-playback/stop/error PASS, with actual browser and speaker playback NOT TESTED. Current static page still uses user-operated native controls, preload=none and no autoplay. It uses no AudioContext; do not confuse native media playback with production Web Audio initialization.

CONDITIONAL: source format and user-triggered native controls are appropriate for a compatibility test, but no browser decoder/actual `play()` success, device audio output, mobile policy, background/resume, file-URL restrictions or shipping HTTP MIME/CORS/cache behavior was tested here. Desktop Chrome, target mobile browsers and physical device playback remain UNVERIFIED; no compatibility matrix PASS is claimed.

Production `initializeAudio` constructs AudioContext after interaction, connects master gain and attempts resume for suspended contexts, returning false on unsupported/error paths. This is source evidence, not executed integration. Future caller must respect failure and retain text fallback. Nothing connects Indic Tiny audio to that path today.

## 3. Loading and playback errors — CONDITIONAL

Prototype source: audio error handler updates visible status; single-player/stop handlers exist. Earlier simulated DOM tests exercise these callbacks, not real missing-file, decode failure or blocked-play rejection. No loading timeout, explicit retry controller, detailed ready-state UI, cancellation token or ended-status reset is implemented in the comparison page. Its status may remain Playing after natural completion; this is minor prototype UI behavior, not a game defect. The5G.8 page nests sources, whereas5H.7 uses direct audio src: real load-error propagation should be tested for both rather than assuming simulation covers it.

Production source: `loadClip` checks HTTP status and decodeAudioData, shares pending promises, removes failed cache promises and records failed URLs. `playDialogue` reports locked/missing/interrupted states. Failed URLs are remembered; a future recovery policy is needed if a transient error should become retryable without reload. An older diagnostic string asks for a feature-film recording: it is stale wording, not permission to use movie audio. No source correction performed.

## 4. Dialogue mapping — PASS isolated / FAIL production linkage

The15 inventory entries across5G.8+5H.7 map to five exact dialogue IDs002,004,013,037,045; each has original+fresh control+variant. Original+two5G.7 speed samples map to001. Thus six distinct source IDs are represented, not51 recorded lines. Five category variants preserve source wording; IDs are fixtures, not actual live state assertions.

PASS: paths, hashes, durations and unique file mappings match inventories;5H.7 playback page has three players per line. FAIL as a production integration gate: no approved assistant response-ID→asset mapping, dynamic state/placeholder policy, locale/fallback registration or production packaging entry for these prototype samples. `BhairavaAssistant.jsx` explicitly remains text-only and requests no audio. Do not mark this deliberate boundary as a regression.

## 5. Interruption, overlap and lifecycle — CONDITIONAL

Prototype play event pauses other players on the same page; Stop all pauses and resets all15. Prior DOM simulation PASS; not a real acoustic no-overlap test. It does not arbitrate other tabs or game/cinematic channels, reset paused competitors on new play, handle mission changes or automatically dispose audio on assistant dismissal.

Production dialogue playback uses active identity checks after async load, priority/cooldown checks and source.stop interruption. CinematicAudio manages same-channel replacement within each player and has pause/resume/dispose plus global hold. These are separate owners: no verified global assistant-versus-cinematic voice arbitration or ducking exists. Generic cinematic cue creation is not itself a catalogue-rights verification layer. Any future voice route must retain rights gating before playback; this audit does not enable or clear a route.

Future integration needs latest-response cancellation, stale-load suppression, dismissal/mission/unmount cleanup, clear cinematic precedence and tested pause/resume behavior. No evidence proves a current integrated overlap bug because the assistant is not voiced.

## 6. Volume and mute — CONDITIONAL

Native audio controls provide per-player controls, but the prototype has no shared master volume/mute, persistence or settings subscription. Values can differ between samples, biasing comparison. No new loudness processing was applied. Production audio manager clamps shared volume, applies master gain, stops dialogue on mute and propagates settings to cinematic media; those source-supported facilities are not wired to isolated WAVs. Tests needed: mute during load/playing/paused, volume0, unmute, interruption and scene changes. Browser-specific native volume behavior remains UNVERIFIED.

## 7. Existing resource evidence — CONDITIONAL, not live gameplay cost

Historical5G.6 supervisor:3.2188s whole test, peak worker208,322,560 bytes (~198.7MiB), minimum available RAM1,175,875,584 bytes (~1121.4MiB), exit0/no guard trigger. Historical5H.7:12.6792s whole test, peak262,316,032 bytes (~250.2MiB), minimum available271,003,648 bytes (~258.4MiB), exit0/no guard trigger.5H.7 model load0.6061s; requests0.2445–0.9698s, two CPU threads and CPUExecutionProvider. Timings are sequential single samples with warm-up/scheduling effects. These are synthesis-worker measurements, not browser audio playback CPU, decode latency or game frame-time measurements. No measured CPU utilization percentage, GPU inference load or phone-resource claim is supported.

Static footprint: all18 files contain2,604,704 sample frames. If all were decoded as mono float32, raw sample buffers alone would be approximately **9.94MiB**, excluding decoding intermediates, metadata and engine overhead. This is a calculation, not measured browser RSS. Production decodedClips has no observed eviction/cap in inspected source, so expanded catalogues need a bounded cache/lifecycle policy; do not extrapolate these small samples to a full campaign or recommend shipping a Python inference runtime.

## 8. Remaining integration dependencies

1. **UNVERIFIED listening:** current scorecard has0/50 rating fields filled; pronunciation, naturalness and emotional suitability are unverified. Duration changes are not emotion proof. No final voice selected.
2. **CONDITIONAL rights/distribution:**5G.7 separates model/code/dataset notices from generated-output and speaker/personality clearance. Distribution format and applicable permissions/notices must be resolved independently. No rights manifest changed and no production approval implied.
3. **FAIL production-ready linkage:** authoritative assistant response mapping, dynamic factual text versus fixed recording policy, approved packaging, global settings integration, lifecycle cancellation and cinematic priority remain unimplemented for this voice.
4. **UNVERIFIED browser/platform tests:** real user activation, decoding/play/rejection, missing/corrupt file, retry, backgrounding, pause, mute, cross-owner overlap and physical-device compatibility.
5. **UNVERIFIED audio/subtitle synchronization:** no verified timing cues, phoneme/word alignment or linked subtitle lifecycle. Keep existing English/text fallback.
6. **CONDITIONAL performance:** measure actual browser fetch/decode/memory and representative gameplay frame times before integration approval; do not load a synthesis model into gameplay without a separately approved design.

Smallest next step is user listening review plus a separately authorized isolated browser lifecycle test. No production integration is recommended now; Ninada remains on hold. No new generation is required by this recommendation.

## Preservation and stop

Before/after hashes were taken for existing evaluation artifacts, original5E drafts,5H.8 inputs and current src/public files. Report generation creates only the two requested Markdown documents; final checked counts are in the companion report. No production, audio, dialogue, personal save, rollback, dependency or environment changes. No browser/server/worker was started; only foreground audit commands ran and completed. Build/lint unnecessary for this documentation-only task; no new build/lint PASS claimed.

**Stop after audit. Indic Tiny is NOT production-approved.**
