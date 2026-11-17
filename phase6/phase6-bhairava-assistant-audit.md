# Phase 6 — Bhairava AI Assistant and Voice: read-only audit

14 November 2026 (Asia/Calcutta).

## Authority, scope and evidence standard

**Phase 5 remains closed with CONDITIONAL ACCEPT.** Phase 6 follows the original approved roadmap: **Bhairava AI assistant and voice**. World construction, soundtrack/combat-SFX expansion, new cinematics, campaign authoring and final-game optimization are not implementation work packages in this report. The earlier `phase6-preparation-report.md` concerned the previously requested broader WORLD & AUDIO audit; it is preserved as historical documentation and does not define this corrected Phase 6 scope.

Original authority inspected: `C:/Users/Hp/.codex/attachments/bf50c31d-658e-4534-9c13-320146c20baf/Pasted text.txt`, sections 7 and 14. Requirements: contextual mission guidance; combat tips; story/event explanations; completion conversations; progress summaries; voice responses; animated subtitles; grounding in actual mission/player data; a special recap/briefing at every tenth mission. Original Phase 7 owns mission storyline/progression, Phase 8 audio/cinematic experience and Phase 10 final testing/optimization/campaign completion. The current assistant may explain existing content without creating those later-phase deliverables.

Evidence labels used below:

- **Source-confirmed:** a concrete implementation or guard exists; this does not certify present browser behavior.
- **Historical test:** retained execution evidence, not a new test run.
- **Partial:** useful pieces exist but the complete requirement is not satisfied.
- **Missing:** no dedicated implementation found in inspected live paths.
- **Unverified:** runtime, listening or usability behavior was not established by this audit.

This audit read source, manifests, assets and existing disposable-test evidence. It did not run the game, build/lint, audio playback, browser tests, dependency installation, asset generation/download or save-writing operations. No new functional PASS is asserted.

## Architecture and real data flow

There is no single Bhairava assistant service/component. Existing pieces are:

- `src/game/StoryJournal.jsx`: modal story/scouting interface. Reads `getStoryMission(missionId)` and `useStoryProgress.scouting`; offers two fixed scouting replies and an in-engine briefing. It is labelled BHAIRAVA + BUJJI but its active guidance speaker is Bujji. It displays arc outlines including planned chapters, not a completion-aware conversation.
- `src/game/storyProgress.js`: persists `seenBriefings` and scouting choices under `kalki-story-adaptation-v1`. Seen/skipped briefing status is not mission completion. `chooseFocus()` validates mission playability; stored scouting reads accept any known mission ID with valid focus, not exclusively playable IDs.
- `src/game/cinematics/storyBriefing.js`: selects fixed per-mission lines or a generic named arc-duel introduction from `arcBossFor()`, plus the selected scouting response. Mission 1 returns `kashiEntry` directly, so the selected scouting focus does not customize that opening. No live health, current remaining objectives, recorded rewards or completed-arc history are passed into the generated dialogue.
- `src/App.jsx:208` (`playStoryBriefing`) connects selected mission/scouting to the cinematic controller. Automatic openings are suppressed for completed missions/seen briefings; explicit replay sets `waitForSpawn=false` and an explicit-replay placement. `openStory()` holds gameplay and clears input. This is contextual routing, not a complete contextual answer engine.
- `src/game/narrativeCueSystem.js` and `CombatNarrative.jsx`: event-keyed, randomly selected fixed combat lines. They have cooldowns and timed dismissal. `combatSystem.js` and `bossSystem.js` emit enemy-down, phase/defeat events; the event is meaningful, but generic lines are not derived from the exact opponent, attack, remaining objectives or campaign history.
- `src/game/GameHud.jsx`, `MissionOneObjectives.jsx`, `missionOneStory.js`: actual objective/enemy/pylon/relay counts, nearby relay instructions and reward/continuation presentation. They contain useful live facts but are not a Bhairava conversation adapter.
- `src/game/BujjiCompanion.jsx`, `companionSystem.js`: physical following, assist cooldown/range, status and dialogue event hooks. Combat support AI is separate from Bhairava assistant intelligence; preserve it.

Authoritative existing inputs for a future read-only adapter are `campaignSystem.js` (selected/completed/unlocked/rewards), `gameplayStore.js` (health, objective/crystal/pylon state and round), `combatSystem.js` (enemy state/defeats), `bossSystem.js` (encounter phase/relic/readiness), `missionOneStory.js` (relay state), and mission definitions. An adapter should read their existing state, never infer completion from chapter prose or change mission rewards/unlocks.

### Completed versus planned content

`storyCampaign.js` has 100 authored catalogue entries, but default playability is Missions 1–10 plus every tenth mission: **19 routes**. Missions 21–24 have preserved candidate activity logic behind `batch54f=20-24` (`chapters/batch20Content.js`); that opt-in flag is not acceptance or authorization to resume campaign work. Assistant eligibility must explicitly exclude paused candidates, not blindly trust a query-dependent `playable` flag.

`campaignSystem.js` separately stores `completedMissionIds`, `unlockedMissionIds` and rewards; mission start checks both playable and unlocked. `progressValidation.js` cleans IDs and checks playability for resume. However, normalized completion IDs are known catalogue IDs, not proof from independent gameplay receipts; unlock IDs can include the next unbuilt chapter. The assistant must distinguish **recorded completion**, **implemented availability**, **unlock state**, **briefing seen**, and **planned story**. Existing data makes those distinctions possible; the current journal does not present a reliable summary of them. Its “ten prototypes / ninety designs” sentence is stale relative to 19 default routes.

## Requirement status

**Completed implementation foundations, with runtime coverage limits:** mission-ID routing; separate recorded completion/unlock/reward state; modal briefing entry; pause/input holds; event cue cooldowns; speaker-labelled text; audio volume/mute and provenance guard. These are source-confirmed components, not completion of the overall assistant.

**Mission guidance — PARTIAL.** Fixed mission introductions and live HUD/relay instructions exist. A request such as “What remains?” cannot currently generate a Bhairava answer from remaining objective/enemy/relic state. Intro descriptions may also diverge from the current encounter: authored story titles/briefings are not authoritative live objectives. Test existing Mission 10's lines against its actual arc duel before approving them.

**Combat tips — PARTIAL.** Scouting threat advice (“watch the wind-up”) and generic phase cues exist. No contextual tip selection based on current enemy attack, repeated damage, guarding or health is established. Random event variants can be generic rather than useful. Do not add new combat mechanics to provide advice.

**Story/event explanations — PARTIAL.** Arc goals/conflicts/reference notes, fixed briefings and relay text exist. They include unbuilt future story content. No consistent spoiler/availability boundary, current-event grounding or original Telugu assistant coverage is established.

**Mission-completion conversations — PARTIAL.** `cinematics/missionOneEnding.js` contains original Telugu Bhairava/Bujji text at the natural Mission 1 ending; boss-defeat cues and HUD rewards exist. The ending's “check the account” line does not actually read rewards. A reusable completion conversation tied to the committed reward/unlock snapshot is missing for the existing routes.

**Player progress summaries — MISSING as assistant behavior.** Menus/HUD have actual progress information, but the inspected journal/briefing/cue paths do not generate a saved-completion/reward summary. No percentage based on 100 planned missions should be represented as completed playable campaign content.

**Every-tenth recap/briefing — MISSING as a dedicated requirement.** `arcBossFor()` provides names/subtitles for generic duel introductions; `StoryJournal` lists ten arcs. Neither proves a retrospective of actual completed events or an actual-progress next briefing. Missing intermediate chapters must be acknowledged, not narrated as cleared. Mission 100 must not imply a sequel or available Mission 101.

**Voice responses — PARTIAL infrastructure, no verified playable assistant voice coverage.** See rights findings below. A silent guarded file is not a voiced response.

**Animated subtitles — PARTIAL.** Combat cue panels have entrance/fade animations and reduced-motion handling in `compactHud.css`; cinematic subtitles have speaker labels, optional translations and responsive styling. There is no demonstrated unified assistant subtitle lifecycle synchronized to recorded audio, nor a completed animated conversation interface. No requirement for expensive lip-sync or network AI is inferred.

## Voice, Telugu and rights

`src/audio/audioManager.js` provides Web Audio gesture unlock, master gain/settings, decoded promise cache, priorities, interruption, clip/event cooldowns, playback listeners and game pause. `createCinematicAudio()` manages HTMLAudioElement cues and disposal through the same master settings. `cinematics/controller.js` advances timed dialogue and starts optional `line.voice`; `CinematicOverlay.jsx` renders the current timed text.

`dialogueInventory.js` has six entries. Four are missing research-target recordings. Two real files exist:

- `public/audio/kalki/bhairava/overdrive-voice.ogg`: 438,839 bytes, described as supplied recording; empty Telugu caption and no verified distribution-rights record.
- `public/audio/kalki/bujji/support-voice.ogg`: 60,615 bytes; same provenance gap and empty caption.

Neither description establishes an original performance, permission to redistribute, or absence of actor imitation. No listening/forensic provenance assessment was performed. The default `missionVoiceRightsRequired=true` and App's explicit `requireVerifiedMissionVoices(true)` reject catalogue playback unless `distributionRights.verified===true`; none of these six entries supplies that approval. Two automatic trigger mappings therefore do not establish audible voice coverage. Missing/unverified lines must remain unvoiced.

Telugu-script original text/English translation exists in the Mission 1 ending and selected cue paths; other combat lines are Telugu transliteration, while most briefings/scouting responses are English. The sole populated catalogue caption is an unverified movie-line research lead. Full Telugu guidance/tips/summaries/recaps is missing and requires fluent-speaker editorial review. Do not reuse that research lead as an original script.

`public/audio/kalki/README.md` and missing-clip/no-match UI text contain stale movie-oriented guidance. They do not authorize extraction. Existing `kashi-step.wav`, `kashi-wind.wav`, `phase41-chime.wav` have local synthesis evidence in Phase 4, but are not voices or a licensed voice library. No movie audio, cloned voice, generated asset or download was introduced by this audit.

**Enforcement limitation:** cinematic `line.voice` and general cue playback bypass the catalogue rights check inside `createCinematicAudio().play()`. Before new voices are connected, all assistant voice entry points need a common verified manifest; do not weaken the current catalogue gate. The exported boolean setter is not a security boundary. Require creator/performer, original source, written game-distribution rights, permitted uses/territories/term, attribution, file hash, language and approval evidence. A user-supplied recording alone is insufficient. Record original performances without imitating a real actor. No new cloud AI/TTS dependency is required for the smallest milestone.

## Playback, subtitle and UX risks

Source-confirmed voice interruption stops a lower-priority Web Audio clip; equal/higher priority returns busy. Cinematic media have separate per-channel replacement and dispose semantics. There is no single assistant queue or dialogue/audio/subtitle arbitration across both systems.

`DialogueControls.jsx` is reached through `SettingsPanel → AudioControls → DIALOGUES`, not a player-facing contextual Bhairava question interface. Captions show only inside that preview panel while playback status is playing, with `subtitleTe` present; its caption checkbox is local state rather than a global persisted subtitle preference. Gameplay narrative text and cinematic text are separate and do not use that checkbox. Mute/unverified results return before playback-status notification; automatic callers cannot rely on these events to create a text fallback.

The gameplay entry is OBJECTIVES → “Bujji · mission briefing” → journal → “Play in-engine briefing.” No dedicated “Ask Bhairava” shortcut/conversation is present. E/R/Interact near a relay scans it; it is not a general assistant invocation. Existing controls must not be rebound.

Cinematic subtitles use explicit timeline `at/duration` and audio can start after network load/autoplay delay; no media-clock alignment is established. The independent combat caption expires after 3.2 seconds. Global game pause suspends AudioContext and holds game time; cinematic-local pause controls only cinematic media. Priority, paused-fetch completion, skip, interruption and resume interaction with all caption systems needs browser validation. A verified voice playback test is unavailable; blocking an unverified voice does not prove successful playback/resume.

CSS provides 44px journal/cinematic buttons, scrollable modal, narrow-screen rules, labelled speaker and high-contrast subtitle panel. Combat text rules can be 10–11px on small screens, and source CSS cannot prove rendered contrast/overlap after all later overrides. Cinematic controls/long bilingual text, focus return, screen-reader repetition and landscape safe-area collisions remain **UNVERIFIED**. No screenshots or real-device usability tests were captured in this audit. Text fallback exists in fixed briefings/ending/cues even without recordings, but a universal voice-independent assistant answer is missing.

## Historical evidence and its limits

- `phase5/phase55-validation-20261114/audio-unit-results.json`: three PASS checks — unverified clip rejected before AudioContext creation, mute/volume state, and pause/resume not bypassing rights. Inspected `audio-unit.mjs`: Node assertions, no browser AudioContext created, no audible clip or synchronization tested. These are not real voice playback certification.
- `phase55-final-acceptance-report.md`: historical disposable restart/controls/intro and persistence evidence. It does not establish a full assistant, Telugu voice or tenth recap.
- `phase55-bounds-correction-20261114/natural-retry/mission-natural-diagnostic-results.json` and correction report: natural Mission 1 ending reached victory and reload with reward preservation, confirming that existing text/cinematic route in that test. Does not prove voiced ending or all assistant replies.
- Latest short desktop: 29.94/30.00 FPS, maxima 120.0/38.1 ms. Portrait emulation: 47 gaps >100 ms over 90 seconds, maximum 174.1 ms despite high average FPS. Natural ending gap 183.6 ms persists; historical Mission 20 / severe scheduling-render episodes remain unresolved. No new measurements were run. Physical mobile remains unavailable; emulation is not phone performance.

## Technical risks and boundaries

Read existing stores through a small snapshot adapter; never call completion/reward/select actions to answer a question. Avoid misleading next-mission advice where the next unlocked ID is unbuilt. Keep assistant preferences/seen state separate from campaign truth and handle replay/round identity so stale async voice cannot speak into the next mission.

Decoded buffers have no eviction budget; failed URLs persist for the page lifetime. Large response libraries, on-demand decoding and listener/media leaks could worsen memory pressure and portrait stutters. Bound caches/requests, reuse current audio lifecycle, and measure before introducing a new dependency. Do not reopen broad GPU/driver investigations as part of assistant implementation.

HTMLMediaElement/Web Audio autoplay, background tab resume, output failure and late fetch/decode need testable fallbacks. Do not block gameplay on a missing voice. No network credentials, server speech/model service or privacy architecture exists as a necessary dependency here; do not introduce microphone recording or open-ended generation without separate approval. Protect pause, keyboard/touch and unlimited sprint contracts.

## Prioritized work packages and effort

Proposed work only; no implementation in this audit. Hours are engineering/content estimates, not a wall-clock promise. Existing functionality should be reused.

1. **Read-only context adapter and eligibility rules: 8–14 hours.** Normalize actual selected/implemented/completed/unlocked/objective/combat/reward snapshots for existing default routes. Reject paused candidates and label planned content honestly. No save schema changes.
2. **Deterministic Bhairava answer layer: 12–20 hours.** Mission 1 initial guidance, remaining-objective answer, relevant combat tip, completion/replay-safe reward summary; add completion-derived Mission 10 recap as a fixture-backed example. Separate facts from authored wording. No network model required.
3. **Compact activation and shared text/subtitle lifecycle: 10–16 hours.** Reuse current UI/modal patterns, optional read-only prompts, clear speaker, manual dismissal, interrupt/pause policies, reduced motion and mobile layouts. Do not redesign Phase 5 UI or controls.
4. **Original Telugu content and review: 12–24 hours.** Translate/edit initial response set with fluent review; fill text fallback first, verify no implied unbuilt events. Estimate assumes existing script/context approval.
5. **Verified voice hookup and lifecycle: 12–20 hours.** Apply a common manifest check at assistant playback entry points, connect original recordings, subtitle/media timing, bounded retry/cache and stale-request cancellation. This is assistant voice integration, not a soundtrack/whole-game audio rewrite.
6. **Focused verification and integrity: 10–18 hours.** Unit fixtures plus disposable desktop/portrait/landscape integration, performance comparison, failure injection, replay/restart and protected checks.

Initial milestone total **64–112 work hours**, approximately **8–14 working days at eight hours/day**, plus performer/editor availability and rights approval. Original recording/editing/casting adds an estimated **8–20 content hours** and potentially **1–3 calendar weeks** of external turnaround; availability is not assumed. Extending approved patterns across the other 18 existing routes/ten arc recaps needs a later inventory-driven estimate (rough planning allowance 20–40 additional hours, excluding recordings), not 81 new missions. These estimates exclude worlds, music, new cinematic direction and Phase 10 optimization.

## Measurable acceptance tests for approval

- **Grounding fixtures:** for existing Mission 1 initial/mid-objective/boss/relic/completed/replay states, answers match actual counters and saved reward values; no completion/unlock/reward mutation. Planned Mission 11, paused 21–24 and locked later bosses never become playable or described as completed through the assistant.
- **Recap fixtures:** Mission 10 completed with Missions 1–9 absent must explicitly avoid claiming those events occurred; incomplete/locked tenth mission must not trigger a completion recap. Verify generic eligibility across actual ten boss IDs without inventing intervening chapters. Mission 100 has no fabricated next chapter.
- **Persistence:** byte-identical personal baseline files; all destructive tests disposable. Read-only summaries leave campaign storage unchanged. Completion/replay gives existing exactly-once rewards; assistant dismissal/reload never awards or marks missions complete. Assistant seen flags are not used as campaign completion.
- **Voice rights/fallback:** missing, unverified, muted, zero-volume, offline, 404 and autoplay-denied cases always show the same factual text without blocking gameplay. Only original/verified records play. Test actual valid playback, higher-priority interruption, equal-priority arbitration, late fetch after cancel, pause/resume, skip, scene exit and repeated replay.
- **Synchronization:** captions appear with each response, speaker and Telugu text verified; for voiced responses target start drift ≤150 ms from audible media start and no stale captions after stop. Pausing freezes media/caption progress; subtitles stay available with voice disabled. Reduced motion removes nonessential animation.
- **Usability:** keyboard-only activation/dismissal and focus return; 1920×1080 and 1280×720, emulated 430×932 portrait and 932×430 landscape. No clipping, player/control obstruction or accidental gameplay input; ≥44px interactive targets and proposed ≥16px response text with measured contrast ≥4.5:1 for normal text. Real phone/audio-output tests remain NOT TESTED until available.
- **Performance/lifecycle:** three matched short windows with assistant idle/answer/voice-enabled versus disabled, same buffer/settings/observer. Publish average, median/p95/p99/max and every >100-ms gap separately from loading. Target answer selection <5 ms CPU on this machine and no new repeatable >100-ms assistant-attributed active-play delay. Report inherited portrait stutters separately. Twenty open/close/play/cancel cycles leave no owned voice/media/listener count growth; no new unbounded decoded-cache growth after the finite warmed response set.
- **Preservation:** production build/lint with pre-existing warnings separated; existing input, pause, Mission 1 ending/replay and representative boss regression. All 47 protected hashes and 14 campaign copies match; retain rollback of touched unprotected files. Keep Kashi opt-in; no world/campaign/audio-music expansion.

## Smallest sensible milestone and open questions

**Recommendation: approve a bounded, text-first Mission 1 Bhairava assistant slice with one Mission 10 progress-grounded recap fixture, followed by optional original voice integration only when recordings and rights are available.** This establishes context, completion truth, subtitles and nonblocking fallback before recording a large library. It is a milestone, not full Phase 6 completion. Keep generic recap eligibility scoped to existing encounters, and do not implement missing chapters for demonstrations.

Open decisions: precise assistant activation label/location without control conflicts; bilingual/subtitle preference policy; approved original Telugu wording; performer and distribution permission; whether tenth recaps are automatic or player-requested; which existing route coverage is required before final Phase 6 acceptance. No answer is assumed to authorize implementation.

## Integrity and stop record

Fresh read-only comparisons against the bounds-correction baseline: **47/47 protected hashes match; all 14/14 preserved campaign copies match** under `phase5/phase54f-batch20-24/encoding-recovery/paused-campaign-source/`. All **11/11 baselined personal LevelDB files** still match their recorded hashes. Only checksums were read; the personal browser/profile was not launched, and no gameplay/save writes occurred. The previously unbaselined `LOCK` file and absence of a pre-update historical save baseline limit any whole-directory/historical preservation claim.

No production source, asset, configuration or save changes were made; no dependencies installed, voice generated/downloaded or test processes launched. Existing reports and the 14 paused files were preserved. Only `phase6/phase6-bhairava-assistant-audit.md` was created. Phase 5 conditional closure remains intact. **Stop for approval; no implementation or later phase started.**
