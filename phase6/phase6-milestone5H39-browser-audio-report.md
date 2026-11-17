# Phase 6 5H.39 — real browser audio validation

15 November 2026. **CONDITIONAL validation: real native browser rendering passed; actual background music and full-game deployment remain unverified/blocked.** No mocked playback was used in this milestone's browser checks.

## Exact scope

New evaluation directory: `phase6/milestone5H39/`. A small isolated browser harness imports the unchanged `eventController.js`, `eventWebAudio.js` and slot definitions from 5H.38. It was built/minified with Vite in production mode and served through a localhost-only static server. It does not boot the entire game, access mission stores or load personal profiles. This isolates native playback validation without modifying 5H.38 or its rollback.

Browser: **Chrome 157.0.8103.51, headed**, new disposable context. Playwright's default `--mute-audio` argument was omitted; no autoplay-policy override was added. Initial context suspension was observed before any test interaction; an actual button click resumed it. The tests used real fetch, WAV decode, AudioContext, AudioBufferSourceNode and GainNode behavior. Native analysers inserted downstream of bus gains measured nonzero PCM signal. These are native rendering observations, not fake sources or mocked responses. They are not proof that a human heard the device speakers or approved pronunciation/mixing.

## Assets and permitted scope

No new audio generated, extracted or copied. The server referenced exactly four existing files read-only:

- `phase6/local-tts-evaluation/milestone5H7/BH6-5E-002-calm-assistance.wav`: original-text Indic Tiny Telugu prototype, 5.2013 seconds, mono 24 kHz.
- `phase6/local-tts-evaluation/milestone5H7/BH6-5E-037-boss-intensity.wav`: existing prototype, 3.6627 seconds, mono 24 kHz. Used as a higher-priority sample, not a verified warning or movie quote.
- `public/audio/cinematics/kashi-wind.wav`: original synthesized ambience, 5 seconds, mono 16 kHz. **Not background music.**
- `public/audio/cinematics/phase41-chime.wav`: existing original synthesized accent, 0.6 seconds, mono 16 kHz.

Provenance: Phase 4 Kashi-entry/cinematic records identify the wind/steps/chime as synthesized originals. Existing 5H.21 authorizes the selected stock voice for temporary prototype use; retained model LICENSE.md documents CC BY 4.0 acoustic weights and MIT code/vocoder declarations. 5H.13's unresolved dataset/speaker/output/commercial conditions remain open. No new commercial clearance was inferred. The evaluation-only manifest labels the evidence accordingly; it neither edits the production rights manifest nor enables the real movie slots.

The four exact hashes/technical metadata are in `milestone5H39/before.json`, and final hashes match. No suitable cleared standalone background-music recording was established. Therefore the music channel used wind to validate looping, simultaneous transport, gain control and ducking mechanics. This does **not** pass musical-content selection, soundtrack looping quality, music/dialogue intelligibility or Kalki theme playback.

## Results

The final main run passed **16/16 native-browser checks**, plus a targeted **B17 natural-completion/ramp check**. Raw JSON retains actual context times, sample rate, base/output latency fields where returned, source starts/stops/ends, offsets, gain values, analyser RMS and HTTP statuses. Reported latency properties are browser metadata, not measured trigger-to-speaker latency.

- Dialogue and the wind loop produced simultaneous nonzero downstream signal.
- Duplicate/cooldown requests did not start extra sources.
- Higher-priority boss sample stopped the current dialogue; exactly one dialogue source remained live.
- Important dialogue moved the music-channel gain from 0.35 toward 0.175. Skip restored it toward 0.35.
- Independent channel controls were validated while sources were active. Master mute cancelled dialogue, suppressed further requests and brought downstream signals to effectively zero.
- The controller paused the actual loop source and resumed from a nonzero stored offset with one active loop.
- Exit stopped all live sources. Actual HTTP 404 and invalid-media decoding returned safe errors and released ownership.
- All four allowlisted WAV URLs returned 200 with WAV content type; the intentional missing path returned 404.
- B17 allowed the existing boss sample to end naturally. Its actual ended event released dialogue, the loop continued without restart, and measured native gain samples showed attenuation and recovery progression.

This does not validate the complete staging game's pause manager, mission-exit UI or reward flow with live audio. Controller methods were invoked from a test UI; actual game handler behavior remains the separate 5H.38 mocked/Node evidence. No natural gameplay result is invented here.

## Preserved unsuccessful attempts

1. `milestone5H39/browser-results.json`: first run could not reach localhost (`ERR_NETWORK_ACCESS_DENIED`) inside execution restrictions. No page/audio tests ran. Browser/server were closed. A permitted retry outside that execution restriction succeeded; Chrome/firewall/autoplay settings were not weakened.
2. `browser-results-1794753301668.json`: 14 checks passed; two gain assertions failed because the test checked AudioParam values on inactive channels. This is not treated as proof of an audio-controller defect or hidden as a success.
3. `browser-results-1794753378205.json`: corrected checks test active-channel gains and actual downstream mute; 16 checks passed. The controller/backend were not edited. `natural-end-results.json` independently adds B17.

The first assertions assumed inactive-node parameter getters alone proved current effective output. Actual recorded state showed the settings changed while an inactive dialogue gain retained an old getter value. Retesting with live sources and downstream PCM established the relevant control behavior. No independent diagnosis of Chrome's internal optimization is claimed.

## Limits

- No direct listening feed or user hearing confirmation: perceived loudness, naturalness, pronunciation and speaker/device output remain UNVERIFIED.
- No actual soundtrack: background-music content/playback remains BLOCKED. Wind transport success is explicitly separate.
- No mobile/device test, physical phone requirement, new performance benchmark or complete game playthrough.
- Movie dialogue/theme remain BLOCKED; no source/rights changes, extraction, downloads or generation.
- The minified harness validates its own HTTP paths, not a self-contained deployable game package.

All owned AudioContexts/browsers/servers were closed; all attempts and screenshots preserved. See the deployment-readiness and summary reports for integrity and next steps.
