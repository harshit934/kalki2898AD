# Phase 6 Milestone 2 — Voice readiness audit

14 November 2026 (Asia/Calcutta). **Audit and preparation only. Milestone 1 behavior is unchanged.** Phase 5 remains CONDITIONAL ACCEPT. No campaign, soundtrack, world or later-phase implementation was undertaken.

**Readiness conclusion: NOT READY to enable recordings. Ready for fluent Telugu review and a documented original-performance/rights process.** No catalogue voice has verified distribution rights. Keep all current voice gates intact and the assistant text-only until the prerequisites below are approved.

## Evidence and limits

Fresh checks: read-only `ffprobe` metadata for the five local audio files; source inspection of catalogue/audio/cinematic/assistant paths; Node-only rights and text-response checks; SHA-256 preservation checks. No recording was played, enabled, generated, extracted, downloaded or linguistically approved. Metadata probing establishes format/duration, not identity, transcript accuracy, completeness, intelligibility or rights. No live browser, personal profile, network service, microphone or test server was launched. Existing Milestone 1 browser evidence is identified as historical rather than rerun.

## Recording inventory and usage

Measured durations, not filename assumptions:

- `public/audio/kalki/bhairava/overdrive-voice.ogg` — **Ogg Vorbis, 48,000 Hz, stereo, 28.458479 seconds, 438,839 bytes**. Catalogue ID `bhairava_overdrive_voice`; selected by the legacy specialAttack/Overdrive event and manual dialogue preview. Automatic-trigger metadata is true, but the rights gate rejects it. It is **not connected to the Milestone 1 assistant**. Source description says supplied recording; no verified performer, transcript, source licence or distribution permission is attached. **UNAPPROVED.** A 28-second file is not established as a suitable trimmed combat response; audition/edit approval would be future work.
- `public/audio/kalki/bujji/support-voice.ogg` — **Ogg Vorbis, 48,000 Hz, stereo, 3.839958 seconds, 60,615 bytes**. ID `bujji_support_voice`; Bujji assist event and manual preview. Automatic mapping exists but rights-blocked. Not an assistant response recording. Same provenance gap. **UNAPPROVED.**

Neither clip's content was listened to or assumed to be an original performance. Supplied possession does not establish redistribution permission; character names do not prove a particular speaker/actor identity.

The following catalogue paths are **missing research placeholders**, not recorded or approved responses; duration/codec are unavailable:

- `public/audio/kalki/bhairava/confident/undefeated-fighter.ogg`
- `public/audio/kalki/bhairava/comic/bounty-hunter-brag.ogg`
- `public/audio/kalki/ashwatthama/dramatic/guardian-warning.ogg`
- `public/audio/kalki/yaskin/menacing/complex-ruler.ogg`

All four have automatic triggers disabled and remain rights-unverified even for manual preview. The latter two are outside the bounded Bhairava assistant recording set. The old movie-line/transliteration research labels must not become an approved original recording script by inference.

Three additional files are **non-voice cinematic cues**, not Telugu response coverage:

- `public/audio/cinematics/kashi-step.wav` — WAV PCM signed16 little-endian, mono16kHz, **0.25s**, 8,044 bytes.
- `public/audio/cinematics/kashi-wind.wav` — same format, **5.00s**, 160,044 bytes.
- `public/audio/cinematics/phase41-chime.wav` — same format, **0.60s**, 19,244 bytes.

Existing Phase4 synthesis scripts/README document locally synthesized originals; this is provenance evidence for those effects, not a voice-rights grant. Current cinematic configurations reuse them. Nothing was added or changed. Full hashes and machine-readable probe output: `milestone2/recording-inventory.json`.

## Rights status and enforcement gaps

The operative catalogue is `src/audio/dialogueInventory.js`. `audioManager.js:181` requires `distributionRights.verified === true`; none of its six entries supplies verified rights. No separate approved voice-rights manifest was identified in the inspected live catalogue/asset documentation. **Verified catalogue voices: zero.** The existing `verification` prose and external research links are not distribution approval.

`missionVoiceRightsRequired` defaults true; `src/App.jsx` explicitly sets it true. `playDialogueById`, event selection and legacy `playGameSound` flow through the guard before mute/context/fetch/decode. Fresh checks rejected all six entries in both muted and unmuted settings, with zero fetches, AudioContexts or media objects created. Pause returned `paused`; resume returned to `rights-unverified`. The audit never set the rights requirement false.

Source-confirmed gaps, not implemented fixes:

1. **Packaging gap:** both unapproved OGG files exist in current `dist/audio/kalki/...` and match their public-source hashes. Vite's public copying is independent of the application playback gate. A blocked UI does not exclude a recording from a distributed package or prevent direct file access. This is an existing condition, not material added by this audit. Before any redistribution, resolve rights or separately approve an exclusion/quarantine procedure; do not delete files or change the build here.
2. **Cinematic cue bypass:** `createCinematicAudio().play(cue)` creates `new Audio(cue.src)` without catalogue rights verification. `cinematics/controller.js` sends configured audio cues and `line.voice` directly there. No currently configured assistant voice is connected, but this route cannot be treated as protected by the dialogue gate when future voice assets are introduced.
3. **Video audio path:** `MissionEntryClip.jsx` plays its video element separately, without a voice-catalogue check or linkage to audioManager master gain in that component. Existing video/soundtrack rights must be assessed independently before reuse; this is not authorization for a Phase8 redesign or a claim about every video's actual audio content.
4. **Mutable policy switch:** the exported `requireVerifiedMissionVoices(value)` can disable checking if a future caller passes false. No such production caller was identified; current App enables it. Preserve current behavior and treat future approval as a controlled manifest process, not toggling the guard for previews.

Stale `public/audio/kalki/README.md` statements about no bundled movie audio/current triggers, and movie-oriented missing-clip/no-match wording, are not reliable release provenance. This audit does not determine whether the actual OGG content is movie-derived and does not certify it as free of imitation.

## Telugu review inventory

Prepared [fluent-review sheet](phase6-milestone2-telugu-review-sheet.md) and `milestone2/telugu-review-inventory.json`. They copy existing source unchanged, give the exact current English UI wording and context, and leave reviewer/date/approved wording/evidence blank. **Every line is marked UNVERIFIED — FLUENT REVIEW REQUIRED.** Fixture rewards are test values, not personal data.

`src/game/assistant/responses.js` currently has **five unique Telugu strings across fifteen English/context variants**: boundary notice; initial guidance; three combat states; three completion/replay states; seven objective/boss/relic states. The seven UI prompts reuse those responses. No response has a linked approved recording.

Important review concerns, based on source differences rather than a claim of fluent linguistic authority:

- Initial English explicitly says crystals/relay scans are optional; that detail is absent from the shared Telugu wording.
- Combat English varies for low health, active Warden and patrols. The one generic Telugu line does not convey the low-health/distance warning or all opponent-specific advice.
- Completion/replay English distinguishes no saved completion, recorded completion and no promised new payout. The single Telugu sentence does not express those distinctions explicitly.
- Seven objective states share a generic Telugu relic instruction, while English can say attempt ended/restart, relic already collected/ending underway, wait for readiness, boss intro or arena next. These must not be recorded as equivalent state-specific translations without review.
- Dynamic fact labels, health/phase/enemy counts, boss/relic state, reward keys/amounts and recorded/replay status are **English-only**. There is no reviewed Telugu slot grammar, pronunciation or number/currency policy.
- `tenthRecap()` is an **English-only test fixture**, not a player-facing recorded recap. No voice or new campaign content should be created from planned-history prose.

Adjacent legacy text is not part of the new recording-ready set: `narrativeCueSystem.js` contains transliterated combat barks; `dialogueInventory.js` has one unverified transliterated research caption and five empty captions; `missionOneStory.js` and `cinematics/missionOneEnding.js` contain Telugu-script relay/ending lines without voice links; most `storyBriefing.js` guidance is English. Those sources have no newly established fluent approval. Do not silently substitute legacy/movie research for original assistant dialogue.

Reviewer should approve each factual context separately, including terminology for Warden/relic, natural Telugu register, reading time, translation equivalence and pronunciation. An English back-translation and approval evidence are prerequisites before recording. No linguistic approval is asserted here.

## Existing playback and subtitle architecture

`audioManager.js` uses one Web Audio dialogue source, decoded-promise cache, priority preemption, 5-second clip and1.8-second event cooldowns, settings subscribers and master gain. `setGameAudioPaused()` suspends/resumes AudioContext and globally holds registered cinematic media. `stopDialogue()` stops the current dialogue source. Cinematic media have their own local pause/channel replacement/dispose lifecycle through HTMLAudioElement, sharing master settings.

`DialogueControls.jsx` is a settings preview interface. It displays captions only while status is playing and `subtitleTe` is nonempty. Its caption toggle is local, not a persisted whole-game assistant preference. The two existing actual recordings have empty captions. Guard returns do not automatically publish a fallback subtitle; preview callers translate promise results into their own status.

`cinematics/controller.js` advances dialogue using authored timeline `at/duration` and separately starts optional voice; `CinematicOverlay.jsx` renders speaker and optional translation. Fetch/play delay is not tied to that clock. Combat captions use a separate3.2-second timer. Milestone1's `BhairavaAssistant.jsx` deliberately has **no audio import or voice dependency**: its readable, animated response remains until refreshed/dismissed and is labelled a state snapshot. This behavior is unchanged.

## Requirements for a future separately authorized integration

- Keep factual text available immediately regardless of mute, missing recording, rights rejection, offline failure or autoplay denial. Never delay objectives, rewards, movement or ending on audio success.
- All assistant recording entry points must use a verified immutable asset ID/hash and documented approval. No generic cue URL may silently bypass it. Preserve the current gate; do not enable the two unapproved recordings to test a new route.
- Define priority/arbitration: cinematic starts cancel assistant speech and pending requests; assistant cannot interrupt ending/story audio. A newer answer, close, mission/round change, restart or exit invalidates pending load/play completion. No stale audio/subtitles should appear afterwards.
- Global pause freezes speech and its caption clock; resume continues only the still-valid response. Cinematic-local pause must not leave another voice talking over a paused scene. Dismissal must not change existing gameplay pause behavior.
- Master mute and zero volume silence every future assistant path, including a response still decoding. Define unmute behavior explicitly (recommended: do not unexpectedly restart discarded speech). Keep existing saved audio settings format.
- Voice captions follow actual media readiness/start/position rather than request time. Proposed validation: voiced caption onset within150ms of audible start, no stale caption after stop, pause/resume retains position; also retain a readable text-only mode independent of audio. This target has not been tested with any approved recording.
- Bound decoded cache/concurrency and release listeners/media. A clip failure must have a controlled retry lifecycle, not a permanent silent blockage. Test cancellation during fetch/decode and ensure late failures cannot overwrite a newer response's status.
- Existing code risks to test: unbounded decoded cache; page-lifetime failed URL set; asynchronous failure/status updates and pause-during-load races; separate Web Audio/cinematic clocks and different priority mechanisms. These are source-derived risks, not freshly reproduced bugs or permission to rewrite them.

At48kHz stereo Float32, the28.46-second clip would represent approximately10.42MiB of decoded samples before overhead/resampling, versus0.42MiB encoded. Current rights blocking avoids that decode on the catalogue path. Future small approved clips need measured loading/decoding budgets given the documented8GB RAM/portrait stutters; this is not evidence that audio caused those stalls. No new performance investigation was run.

## Missing prerequisites and implementation order

1. **Resolve rights and package readiness first:** verified original performer/source and written distribution permission with scope/term/attribution, approved asset hashes and an explicit decision on currently packaged unapproved material. Do not infer rights from a supplied recording.
2. **Complete fluent Telugu review:** approve the fifteen state variants and dynamic-fact policy; keep all current wording labelled draft until then. No changes to Milestone1 in this audit.
3. **Approve a minimal original recording brief:** performer must not imitate an actor; original script only. Define cue IDs, text mapping and acceptable clip durations. No recording, generation, download or service is authorized by this report.
4. **Approve a small playback design:** reuse current manager and rights enforcement, define the interruption/clock/cache ownership above, preserving text fallback and all gameplay contracts. Keep soundtrack, broad cinematics and campaign work out of this milestone.
5. **Only after separate authorization:** integrate a small approved response set and test valid playback plus rights rejection, missing assets, pause, mute, volume, cancellation, repeated replay and cinematic handoff in disposable profiles. Physical-device/audio-output tests remain required for claims about those devices.

## Validation and preservation

- **PASS, fresh:** metadata read for five files; all six catalogue entries unapproved and blocked in both mute states; pause/resume does not bypass rights; zero audio requests/objects. Evidence: `milestone2/rights-check-results.json`, `recording-inventory.json`.
- **PASS, fresh:** thirteen pure assistant state/recap/text-fallback/no-input-mutation cases. Evidence: `milestone2/text-assistant-results.json`, `text-check.log`. These are not new browser or audible playback tests.
- **PASS, integrity:** all357 source/public/config baseline files byte-identical across this audit; **47/47 protected hashes**, **14/14 preserved campaign copies**, **11/11 personal-save baseline files** match. Personal profile was not launched; raw save values were not loaded. The unbaselined LOCK file and pre-baseline history remain outside the hash claim. Evidence: `milestone2/final-integrity.json`.
- **Historical, not rerun:** Milestone1's final production build/lint passed with nine existing warnings, and desktop/portrait/landscape UI checks passed. Current unchanged source/config hashes support reusing those results for this audit; no fresh build or lint is claimed. Actual voice playback, synchronization, listening quality, fluent review and physical-device behavior are **UNVERIFIED**.

Changed files: only this report, the companion Telugu review sheet and audit scripts/JSON/logs under `phase6/milestone2/`. No production code, assets, config, saves, rewards, unlocks, controls, rights checks or Milestone1 behavior changed. Existing evidence was not overwritten. Focused Node/ffprobe checks exited; no browser/test server or long-running test process was started. **Stop here and await approval. No voice integration has begun.**
