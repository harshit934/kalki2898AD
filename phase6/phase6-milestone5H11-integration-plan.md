# Milestone 5H.11 — Production integration plan

**PLAN ONLY — no implementation or voice approval.** The existing text-first assistant and Phase5 CONDITIONAL ACCEPT remain preserved. Ninada is on hold. No campaign expansion, new game events, controls, save formats, rewards or unlock changes.

## Architecture and smallest sensible milestone

Reuse `src/game/assistant/context.js`, `responses.js`, `progress.js`, `BhairavaAssistant.jsx` and the authoritative campaign/game/combat/boss/story stores. Keep context read-only and gameplay unchanged. Propose a small opt-in assistant-voice adapter for approved static response IDs, shared with `src/audio/audioManager.js` rather than a second independent AudioContext. No model inference, Python runtime, cloud service or new package needed for prerecorded WAV playback.

This is not permission to implement. Begin, after approval, with existing001/002/004/013/037/045 evaluation candidates only if their exact text and rights are approved; all other lines stay text-only. Some approved draft wording differs from production Telugu wording: bind by explicit reviewed response ID/semantic condition and text hash, never fuzzy string matching. Dynamic facts must remain visible and accurate even when only a static lead-in is voiced. Do not speak fixed fixture rewards or mission states as live facts.

## Shared lifecycle design

Proposed states: disabled/text-only → awaiting-user-activation → idle → loading → playing; paused, interrupted, failed and disposed are explicit outcomes. Any failure immediately retains current text and readable status; no forced audio or delayed gameplay. Keep one app-owned AudioContext/master settings facility.

- Every user request gets a generation token containing response ID, mission/round identity, state fingerprint and text revision. Resolve an approved asset/hash only after rights and exact text/branch guards pass. Recheck token/context after fetch/decode and before source.start. A newer question, mission switch, dismissal or unmount invalidates stale work. Shared decoded assets may be retained but stale callbacks cannot play or overwrite current text.
- One assistant voice at a time. Proposed priorities: existing cinematic/story voice wins; explicit assistant request supersedes older assistant; no automatic combat bark added. If story voice starts, cancel assistant and keep its text; do not resume stale guidance. Stop/cleanup on menu exit and mission changes. No queue beyond the latest valid explicit request. Priorities must cover both Web Audio dialogue and HTMLMedia cinematic owners, rather than merely within one manager.
- Shared master volume/mute only; no independent native-player settings in production. Mute/volume0 cancels pending and playing assistant speech. Unmute never autoplays prior responses; require a new explicit request. Existing sound controls remain unchanged. No mandatory ducking or mix redesign; optional gain changes need separate approval/testing.
- Existing game pause suspends/resumes the shared context. Track token/current context; resume assistant only if the same utterance remains valid. Dismissal/scene change/cinematic preemption while paused cancels it permanently. Distinguish temporary pause from stop. Release source nodes/listeners on ended/error/dispose; do not destroy an app-shared context on component unmount.
- Gesture initialization must follow actual existing audio initialization API; handle suspended/closed/unavailable contexts and rejected promises. Fetch HTTP/decode failures, abort, timeout and missing assets resolve to text-only, not exceptions or repeated retries. Proposed8s fetch/decode deadline; cancel on navigation. Retry only by explicit request with bounded backoff; do not reuse permanently failed cache entries blindly.
- Small lazy decoded cache, proposed8MiB PCM budget plus at most one in-flight clip. LRU eviction of idle entries; pinned playing buffer excluded until released. Budget is provisional and measured before approval. No eager51-line download, base64 bundle or inference model. Do not modify existing general cache until a targeted change is justified.
- Whole-utterance subtitles use exact selected English/Telugu text, remain visible during pause/failure and survive missing audio. Start/ended cues are lifecycle events, not guessed phoneme timings. No karaoke/word-sync claim without alignment evidence. Existing animated text accessibility/reduced-motion behavior is preserved.

## Files and dependencies — proposed, not created

- Existing `assistant/{context,responses,progress}.js`: stable response identifiers/branch metadata if required; no store mutation or altered answer meaning.
- Existing `assistant/BhairavaAssistant.jsx`: adapter request/cancel lifecycle, maintaining activation, keyboard/mobile dismissal and text fallback; no menu/control redesign.
- Proposed `assistant/voiceManifest.js` and `assistant/voiceController.js`: immutable asset provenance/text hashes and orchestration. Names are design suggestions, not current implementation.
- Existing `src/audio/audioManager.js` and actual catalogue/rights/build exclusion logic: reuse master settings and verify every route, including cinematic callers. No weakening `requireVerifiedMissionVoices`, packaging exclusions or existing blocked clips.
- Future approved WAV/public path and third-party notices: only exact approved content hashes may enter production. Current phase6 samples remain outside production.
- Tests: disposable fixtures, mocked AudioContext/fetch for race tests; real browser lifecycle tests in disposable profiles. No new dependency is currently necessary; inspect installed tools before authorizing any test tooling.

## Browser and mobile validation matrix

Desktop Chrome at1920×1080 and1280×720; emulated portrait430×932 and landscape932×430 for interaction/layout only. Real Android Chrome and iOS Safari require actual device evidence; absent devices remain UNVERIFIED, not emulation-based passes. Record browser/OS versions, output device, URL/origin, power condition and actual buffer/DPR where gameplay is measured.

Test first gesture/cold load, warm request, missing/corrupt/404 clip, blocked activation, slow timeout, offline cache behavior, play rejection, rapid three-question replacement, duplicate request, dismiss during load/play, mission/round changes, cinematic preemption, pause→mute→resume, volume0/unmute, tab background/foreground and page disposal. Use no personal save profile. Mute/readiness tests must also assert zero fetch/start for unapproved assets.

## Proposed measurable acceptance gates — not current results

1.51/51 mapped IDs with unique guards, all slots grounded in authoritative stores; tests distinguish planned/unavailable, replay, actual rewards and incomplete history. No save/store mutation. Dynamic/helper facts are explicitly text-only unless separately approved.
2.100% shipping assets have exact content hashes, provenance, applicable notices and explicit rights approval;0 unapproved recordings/models in clean dist, including renamed/hash copies. Existing excluded voices stay excluded.
3.Listening/content approval is recorded for each proposed voiced line; pronunciation and expressive suitability remain UNVERIFIED until supported. No human-certification inference from reviewer scores or technical WAV validation.
4.Twenty scripted race/interrupt cycles: zero stale starts, zero duplicate source starts, zero simultaneous assistant voices; cinematic preemption and user cancel stop assistant within100ms on an active foreground test. Correctness assertions come from event logs, not listening alone.
5.Mute/volume0 causes zero audible-source continuation and no stale resume; shared setting update target≤100ms foreground.0 unhandled promise rejections. Every failure retains factual text and allows a later explicit retry.
6.Warm user-request→source.start p95≤250ms; cold request→source.start p95≤2s on documented local production-serving conditions.8s timeout always falls back. Three repeated10-request runs, record full latency distribution; no internet/mobile performance extrapolation.
7.In at least three matched60s active-game windows, report median/p95/p99/max and every>100ms gap, separate loading/decode. Proposed audio-on versus text-only p95 regression≤2ms and no recurring new audible/visible interruptions attributable to audio. Existing historical hitches are not silently marked fixed; no perfect30FPS claim.
8.Cache stays within approved budget plus active/in-flight allowance. After50 open/request/dismiss cycles, no retained source/listener growth; memory reaches a documented bounded plateau. Raw browser RSS alone is insufficient for leak attribution.
9.Existing Mission1 ending/replay, representative boss/chase, pause/settings, keyboard/touch/HUD and progression regressions pass using disposable profiles. Build/lint pass with historical warnings identified.47 protected,14 preserved campaign and applicable save baselines checked without launching personal profile. Physical mobile playback remains a separate gate if unavailable.

## Rollback and risk controls

Before any separately authorized edit, snapshot exact affected source/config/notices and hashes to a new rollback directory. Default disabled flag keeps text-only behavior and original environment; Kashi stays opt-in. Revert only reviewed changed source/manifest and remove no original samples; never reset storage, save schemas or rewards. On regression disable voice first, preserve logs/assets and restore affected files from their exact backup. Recheck integrity and text regressions. No existing rollback file may be overwritten.

Main risks: stale state narration, mismatch between reviewed draft and actual UI text, subtitle/audio drift, priority conflicts, browser activation differences, shared-context lifetime bugs, decode/cache pressure, rights bypass via a generic cinematic cue and accidental packaging of unapproved audio. The design mitigates these but has not executed the required tests. No package installation, generation or integration follows automatically.

## Complete51-entry proposed event mapping

All entries below are extracted from unchanged5E drafts and compared with current source hashes. Mapping to an existing assistant request is not new automatic gameplay speech. Source line numbers are historical draft anchors; use current exact branch code when implementing. Slot labels are planning bindings, not new store keys. The exact Telugu drafts remain in the original CSV; no new translations are authored.

### BH6-5E-001 — 1. Mission guidance

- Proposed event: existing explicit assistant request → `BH6-5E-001` branch; no automatic combat/mission speech added.
- Guard/context: Mission 1; Start guidance prompt (topic=initial).
- Exact English reference: Clear the patrols, face the Warden, then collect the relic. Crystals and relay scans are optional.
- Authoritative bindings: No dynamic placeholders.
- Playback policy: Candidate full fixed sentence; eligible only when the exact current response branch matches, after text/voice/rights approval.
- Source: `src/game/assistant/responses.js:19`; recorded source hash matches current file.
- Audio availability: Existing isolated evaluation audio only; not approved/mapped in production.
- Telugu/content status: PENDING / UNVERIFIED; no source wording changed.

### BH6-5E-002 — 1. Mission guidance

- Proposed event: existing explicit assistant request → `BH6-5E-002` branch; no automatic combat/mission speech added.
- Guard/context: Mission 1 objective-style prompt; attempt not ended, relic not collected, boss not intro/active/defeated, patrols remain.
- Exact English reference: Clear the remaining patrols, then approach the arena.
- Authoritative bindings: No dynamic placeholders.
- Playback policy: Candidate full fixed sentence; eligible only when the exact current response branch matches, after text/voice/rights approval.
- Source: `src/game/assistant/responses.js:18`; recorded source hash matches current file.
- Audio availability: Existing isolated evaluation audio only; not approved/mapped in production.
- Telugu/content status: PENDING / UNVERIFIED; no source wording changed.

### BH6-5E-003 — 1. Mission guidance

- Proposed event: existing explicit assistant request → `BH6-5E-003` branch; no automatic combat/mission speech added.
- Guard/context: Same objective branch, but no patrols remain and boss is not intro/active/defeated.
- Exact English reference: Approach the arena for the Warden encounter.
- Authoritative bindings: No dynamic placeholders.
- Playback policy: Candidate full fixed sentence; eligible only when the exact current response branch matches, after text/voice/rights approval.
- Source: `src/game/assistant/responses.js:18`; recorded source hash matches current file.
- Audio availability: No evaluation recording identified; remain text-only. No generation authorized.
- Telugu/content status: PENDING / UNVERIFIED; no source wording changed.

### BH6-5E-004 — 2. Combat tips

- Proposed event: existing explicit assistant request → `BH6-5E-004` branch; no automatic combat/mission speech added.
- Guard/context: Mission 1 combat prompt; health <=30. This branch has priority even if a boss is active.
- Exact English reference: Health is low. Create distance and read the wind-up before countering.
- Authoritative bindings: No dynamic placeholders.
- Playback policy: Candidate full fixed sentence; eligible only when the exact current response branch matches, after text/voice/rights approval.
- Source: `src/game/assistant/responses.js:20`; recorded source hash matches current file.
- Audio availability: Existing isolated evaluation audio only; not approved/mapped in production.
- Telugu/content status: PENDING / UNVERIFIED; no source wording changed.

### BH6-5E-005 — 2. Combat tips

- Proposed event: existing explicit assistant request → `BH6-5E-005` branch; no automatic combat/mission speech added.
- Guard/context: Mission 1 combat prompt; health >30 and bossStatus=active.
- Exact English reference: Read the Warden’s wind-up; evade or guard, then counter during recovery.
- Authoritative bindings: No dynamic placeholders.
- Playback policy: Candidate full fixed sentence; eligible only when the exact current response branch matches, after text/voice/rights approval.
- Source: `src/game/assistant/responses.js:20`; recorded source hash matches current file.
- Audio availability: No evaluation recording identified; remain text-only. No generation authorized.
- Telugu/content status: PENDING / UNVERIFIED; no source wording changed.

### BH6-5E-006 — 2. Combat tips

- Proposed event: existing explicit assistant request → `BH6-5E-006` branch; no automatic combat/mission speech added.
- Guard/context: Mission 1 combat prompt; health >30 and boss is not active.
- Exact English reference: Watch the patrol’s wind-up, guard or evade, then counter. Advice does not change combat rules.
- Authoritative bindings: No dynamic placeholders.
- Playback policy: Candidate full fixed sentence; eligible only when the exact current response branch matches, after text/voice/rights approval.
- Source: `src/game/assistant/responses.js:20`; recorded source hash matches current file.
- Audio availability: No evaluation recording identified; remain text-only. No generation authorized.
- Telugu/content status: PENDING / UNVERIFIED; no source wording changed.

### BH6-5E-007 — 3. Objective explanations

- Proposed event: existing explicit assistant request → `BH6-5E-007` branch; no automatic combat/mission speech added.
- Guard/context: Mission 1 factual snapshot; used with initial, objective/remaining/boss and completion/replay answers.
- Exact English reference: Patrols remaining: {patrol_count}. Boss state: {boss_state}. Relic: {relic_state}. Optional relays scanned: {relay_count}/3.
- Authoritative bindings: patrol_count=c.enemiesRemaining.length; boss_state=c.bossStatus; relic_state=collected/not collected from c.relic; relay_count=c.scans. Labels/values are review placeholders, not new runtime keys.
- Playback policy: Text-only factual fragment or dynamic fact. No slot narration/splicing or fixed-value recording proposed.
- Source: `src/game/assistant/responses.js:17`; recorded source hash matches current file.
- Audio availability: No evaluation recording identified; remain text-only. No generation authorized.
- Telugu/content status: PENDING / UNVERIFIED; no source wording changed.

### BH6-5E-008 — 3. Objective explanations

- Proposed event: existing explicit assistant request → `BH6-5E-008` branch; no automatic combat/mission speech added.
- Guard/context: Mission 1 combat answer factual snapshot.
- Exact English reference: Current health: {health}.
- Authoritative bindings: health=c.health. Keep the current numeric value; do not insert a percentage sign or change the maximum.
- Playback policy: Text-only factual fragment or dynamic fact. No slot narration/splicing or fixed-value recording proposed.
- Source: `src/game/assistant/responses.js:20`; recorded source hash matches current file.
- Audio availability: No evaluation recording identified; remain text-only. No generation authorized.
- Telugu/content status: PENDING / UNVERIFIED; no source wording changed.

### BH6-5E-009 — 3. Objective explanations

- Proposed event: existing explicit assistant request → `BH6-5E-009` branch; no automatic combat/mission speech added.
- Guard/context: Mission 1 combat answer factual snapshot.
- Exact English reference: Boss phase: {phase}.
- Authoritative bindings: phase=c.phase. A phase number does not establish a boss defeat.
- Playback policy: Text-only factual fragment or dynamic fact. No slot narration/splicing or fixed-value recording proposed.
- Source: `src/game/assistant/responses.js:20`; recorded source hash matches current file.
- Audio availability: No evaluation recording identified; remain text-only. No generation authorized.
- Telugu/content status: PENDING / UNVERIFIED; no source wording changed.

### BH6-5E-010 — 4. Story and event explanations

- Proposed event: existing explicit assistant request → `BH6-5E-010` branch; no automatic combat/mission speech added.
- Guard/context: Progress facts; only eligible seenBriefings IDs are listed.
- Exact English reference: Briefings marked seen (completed or skipped, not mission completion): {seen_briefings}.
- Authoritative bindings: seen_briefings=list(p.seenBriefings), filtered to eligible routes. No chronology or cinematic playback receipt is available.
- Playback policy: Text-only factual fragment or dynamic fact. No slot narration/splicing or fixed-value recording proposed.
- Source: `src/game/assistant/progress.js:51`; recorded source hash matches current file.
- Audio availability: No evaluation recording identified; remain text-only. No generation authorized.
- Telugu/content status: PENDING / UNVERIFIED; no source wording changed.

### BH6-5E-011 — 4. Story and event explanations

- Proposed event: existing explicit assistant request → `BH6-5E-011` branch; no automatic combat/mission speech added.
- Guard/context: Accepted tenth-mission recap; explains missing event detail.
- Exact English reference: The save does not record attack-by-attack events, story choices or cinematic viewing; those details cannot be verified from completion IDs.
- Authoritative bindings: No dynamic placeholders.
- Playback policy: Candidate full fixed sentence; eligible only when the exact current response branch matches, after text/voice/rights approval.
- Source: `src/game/assistant/progress.js:69`; recorded source hash matches current file.
- Audio availability: No evaluation recording identified; remain text-only. No generation authorized.
- Telugu/content status: PENDING / UNVERIFIED; no source wording changed.

### BH6-5E-012 — 4. Story and event explanations

- Proposed event: existing explicit assistant request → `BH6-5E-012` branch; no automatic combat/mission speech added.
- Guard/context: Accepted tenth-mission recap; local challenge completed, broader story history not established.
- Exact English reference: Current story position: the recorded local challenge is cleared. Missing chapters and intervening story events are not inferred.
- Authoritative bindings: No dynamic placeholders.
- Playback policy: Candidate full fixed sentence; eligible only when the exact current response branch matches, after text/voice/rights approval.
- Source: `src/game/assistant/progress.js:70`; recorded source hash matches current file.
- Audio availability: No evaluation recording identified; remain text-only. No generation authorized.
- Telugu/content status: PENDING / UNVERIFIED; no source wording changed.

### BH6-5E-013 — 5. Mission completion conversations

- Proposed event: existing explicit assistant request → `BH6-5E-013` branch; no automatic combat/mission speech added.
- Guard/context: Mission 1 completion/replay prompt; savedComplete=true and c.replay=false.
- Exact English reference: A completion is recorded. The facts list shows actual saved rewards.
- Authoritative bindings: No dynamic placeholders.
- Playback policy: Candidate full fixed sentence; eligible only when the exact current response branch matches, after text/voice/rights approval.
- Source: `src/game/assistant/responses.js:21`; recorded source hash matches current file.
- Audio availability: Existing isolated evaluation audio only; not approved/mapped in production.
- Telugu/content status: PENDING / UNVERIFIED; no source wording changed.

### BH6-5E-014 — 5. Mission completion conversations

- Proposed event: existing explicit assistant request → `BH6-5E-014` branch; no automatic combat/mission speech added.
- Guard/context: Mission 1 completion/replay prompt; savedComplete=false, irrespective of visual boss state.
- Exact English reference: No saved completion is recorded. Defeating the boss alone does not establish saved completion.
- Authoritative bindings: No dynamic placeholders.
- Playback policy: Candidate full fixed sentence; eligible only when the exact current response branch matches, after text/voice/rights approval.
- Source: `src/game/assistant/responses.js:21`; recorded source hash matches current file.
- Audio availability: No evaluation recording identified; remain text-only. No generation authorized.
- Telugu/content status: PENDING / UNVERIFIED; no source wording changed.

### BH6-5E-015 — 5. Mission completion conversations

- Proposed event: existing explicit assistant request → `BH6-5E-015` branch; no automatic combat/mission speech added.
- Guard/context: Mission 1 completion/replay facts; uses current selected-route saved reward entries.
- Exact English reference: Recorded rewards: {recorded_rewards}.
- Authoritative bindings: recorded_rewards=entries of c.rewards filtered to finite nonnegative amounts; source fallback none. Do not invent missing keys or amounts.
- Playback policy: Text-only factual fragment or dynamic fact. No slot narration/splicing or fixed-value recording proposed.
- Source: `src/game/assistant/responses.js:21`; recorded source hash matches current file.
- Audio availability: No evaluation recording identified; remain text-only. No generation authorized.
- Telugu/content status: PENDING / UNVERIFIED; no source wording changed.

### BH6-5E-016 — 6. Player progress summaries

- Proposed event: existing explicit assistant request → `BH6-5E-016` branch; no automatic combat/mission speech added.
- Guard/context: Progress summary prompt on currently supported routes.
- Exact English reference: Here is what your current campaign records actually establish. An unlocked chapter can still be unbuilt; a viewed briefing is not a completed mission.
- Authoritative bindings: No dynamic placeholders.
- Playback policy: Candidate full fixed sentence; eligible only when the exact current response branch matches, after text/voice/rights approval.
- Source: `src/game/assistant/progress.js:58`; recorded source hash matches current file.
- Audio availability: No evaluation recording identified; remain text-only. No generation authorized.
- Telugu/content status: PENDING / UNVERIFIED; no source wording changed.

### BH6-5E-017 — 6. Player progress summaries

- Proposed event: existing explicit assistant request → `BH6-5E-017` branch; no automatic combat/mission speech added.
- Guard/context: Progress fact; completed IDs intersect supported implemented/playable routes.
- Exact English reference: Recorded completed playable missions ({completed_count}): {completed_missions}.
- Authoritative bindings: completed_count=p.completed.length; completed_missions=list(p.completed). Deduplicated supported records only; empty source list is none.
- Playback policy: Text-only factual fragment or dynamic fact. No slot narration/splicing or fixed-value recording proposed.
- Source: `src/game/assistant/progress.js:45`; recorded source hash matches current file.
- Audio availability: No evaluation recording identified; remain text-only. No generation authorized.
- Telugu/content status: PENDING / UNVERIFIED; no source wording changed.

### BH6-5E-018 — 6. Player progress summaries

- Proposed event: existing explicit assistant request → `BH6-5E-018` branch; no automatic combat/mission speech added.
- Guard/context: Progress fact; current route/status from buildProgress.
- Exact English reference: Current mission: {current_mission} — {current_status}.
- Authoritative bindings: current_mission=missionLabel(p.current.id); current_status=p.current.status, including active/replay/ended, locked, unavailable and not-running distinctions.
- Playback policy: Text-only factual fragment or dynamic fact. No slot narration/splicing or fixed-value recording proposed.
- Source: `src/game/assistant/progress.js:46`; recorded source hash matches current file.
- Audio availability: No evaluation recording identified; remain text-only. No generation authorized.
- Telugu/content status: PENDING / UNVERIFIED; no source wording changed.

### BH6-5E-019 — 6. Player progress summaries

- Proposed event: existing explicit assistant request → `BH6-5E-019` branch; no automatic combat/mission speech added.
- Guard/context: Progress fact; source intersection of saved unlock IDs and implemented/playable allowlist.
- Exact English reference: Unlocked and available (including replays): {available_missions}.
- Authoritative bindings: available_missions=list(p.unlockedAvailable). Do not include planned/paused catalogue entries.
- Playback policy: Text-only factual fragment or dynamic fact. No slot narration/splicing or fixed-value recording proposed.
- Source: `src/game/assistant/progress.js:47`; recorded source hash matches current file.
- Audio availability: No evaluation recording identified; remain text-only. No generation authorized.
- Telugu/content status: PENDING / UNVERIFIED; no source wording changed.

### BH6-5E-020 — 6. Player progress summaries

- Proposed event: existing explicit assistant request → `BH6-5E-020` branch; no automatic combat/mission speech added.
- Guard/context: Progress/accepted recap; p.next exists.
- Exact English reference: Next unfinished available mission: {next_mission}.
- Authoritative bindings: next_mission=missionLabel(p.next), the first unlocked eligible unfinished route in catalogue order, not necessarily current mission +1.
- Playback policy: Text-only factual fragment or dynamic fact. No slot narration/splicing or fixed-value recording proposed.
- Source: `src/game/assistant/progress.js:48`; recorded source hash matches current file.
- Audio availability: No evaluation recording identified; remain text-only. No generation authorized.
- Telugu/content status: PENDING / UNVERIFIED; no source wording changed.

### BH6-5E-021 — 6. Player progress summaries

- Proposed event: existing explicit assistant request → `BH6-5E-021` branch; no automatic combat/mission speech added.
- Guard/context: Progress basis fact; dynamic denominator is supported routes, not 100.
- Exact English reference: Progress basis: {completed_count}/{supported_count} implemented routes have recorded completion; this is not completion of the full campaign.
- Authoritative bindings: completed_count=p.completed.length; supported_count=p.supported.length. Values are live-state slots, not invented player progress.
- Playback policy: Text-only factual fragment or dynamic fact. No slot narration/splicing or fixed-value recording proposed.
- Source: `src/game/assistant/progress.js:49`; recorded source hash matches current file.
- Audio availability: No evaluation recording identified; remain text-only. No generation authorized.
- Telugu/content status: PENDING / UNVERIFIED; no source wording changed.

### BH6-5E-022 — 6. Player progress summaries

- Proposed event: existing explicit assistant request → `BH6-5E-022` branch; no automatic combat/mission speech added.
- Guard/context: Progress fact; excludes ineligible planned or paused routes.
- Exact English reference: Planned or paused catalogue entries: {planned_count}; not treated as completed or playable.
- Authoritative bindings: planned_count=p.plannedCount from catalogue eligibility filtering.
- Playback policy: Text-only factual fragment or dynamic fact. No slot narration/splicing or fixed-value recording proposed.
- Source: `src/game/assistant/progress.js:50`; recorded source hash matches current file.
- Audio availability: No evaluation recording identified; remain text-only. No generation authorized.
- Telugu/content status: PENDING / UNVERIFIED; no source wording changed.

### BH6-5E-023 — 6. Player progress summaries

- Proposed event: existing explicit assistant request → `BH6-5E-023` branch; no automatic combat/mission speech added.
- Guard/context: Progress or accepted recap; only recorded completed route reward entries.
- Exact English reference: {mission} recorded rewards — {reward_entries}.
- Authoritative bindings: mission=missionLabel(id); reward_entries=rewardText(p.rewards[id] ?? {}). Missing values remain unknown, not zero.
- Playback policy: Text-only factual fragment or dynamic fact. No slot narration/splicing or fixed-value recording proposed.
- Source: `src/game/assistant/progress.js:52`; recorded source hash matches current file.
- Audio availability: No evaluation recording identified; remain text-only. No generation authorized.
- Telugu/content status: PENDING / UNVERIFIED; no source wording changed.

### BH6-5E-024 — 6. Player progress summaries

- Proposed event: existing explicit assistant request → `BH6-5E-024` branch; no automatic combat/mission speech added.
- Guard/context: Progress totals fact; valid recorded completion rewards grouped by saved key.
- Exact English reference: Known totals by saved reward key: {reward_totals}. These are recorded awards, not a spendable balance.
- Authoritative bindings: reward_totals=rewardText(p.totalsByKey). Preserve each key, zero and unknown; do not combine incompatible reward types.
- Playback policy: Text-only factual fragment or dynamic fact. No slot narration/splicing or fixed-value recording proposed.
- Source: `src/game/assistant/progress.js:53`; recorded source hash matches current file.
- Audio availability: No evaluation recording identified; remain text-only. No generation authorized.
- Telugu/content status: PENDING / UNVERIFIED; no source wording changed.

### BH6-5E-025 — 6. Player progress summaries

- Proposed event: existing explicit assistant request → `BH6-5E-025` branch; no automatic combat/mission speech added.
- Guard/context: Progress; p.unlockedUnavailable has entries.
- Exact English reference: Unlocked references that are unavailable: {unavailable_unlocked}; no launch is offered.
- Authoritative bindings: unavailable_unlocked=list(p.unlockedUnavailable). This is not an unlock or launch action.
- Playback policy: Text-only factual fragment or dynamic fact. No slot narration/splicing or fixed-value recording proposed.
- Source: `src/game/assistant/progress.js:54`; recorded source hash matches current file.
- Audio availability: No evaluation recording identified; remain text-only. No generation authorized.
- Telugu/content status: PENDING / UNVERIFIED; no source wording changed.

### BH6-5E-026 — 6. Player progress summaries

- Proposed event: existing explicit assistant request → `BH6-5E-026` branch; no automatic combat/mission speech added.
- Guard/context: Progress; excluded saved completion references exist.
- Exact English reference: Saved references excluded from completed gameplay: {excluded_missions} (unavailable or unknown).
- Authoritative bindings: excluded_missions=list(p.excludedCompletion). Source save is not rewritten or deleted.
- Playback policy: Text-only factual fragment or dynamic fact. No slot narration/splicing or fixed-value recording proposed.
- Source: `src/game/assistant/progress.js:55`; recorded source hash matches current file.
- Audio availability: No evaluation recording identified; remain text-only. No generation authorized.
- Telugu/content status: PENDING / UNVERIFIED; no source wording changed.

### BH6-5E-027 — 6. Player progress summaries

- Proposed event: existing explicit assistant request → `BH6-5E-027` branch; no automatic combat/mission speech added.
- Guard/context: Progress; an unattributed reward entry exists without accepted completion or on an unavailable route.
- Exact English reference: Unattributed reward record for {mission} — {reward_entries}; {reason}, not credited to completion totals.
- Authoritative bindings: mission=missionLabel(r.id); reward_entries=rewardText(r.values); reason=no recorded completion or unavailable or unknown route. Reason values still need localized review.
- Playback policy: Text-only factual fragment or dynamic fact. No slot narration/splicing or fixed-value recording proposed.
- Source: `src/game/assistant/progress.js:56`; recorded source hash matches current file.
- Audio availability: No evaluation recording identified; remain text-only. No generation authorized.
- Telugu/content status: PENDING / UNVERIFIED; no source wording changed.

### BH6-5E-028 — 7. Tenth-mission retrospective briefings

- Proposed event: existing explicit assistant request → `BH6-5E-028` branch; no automatic combat/mission speech added.
- Guard/context: Recap request for supported milestone with an accepted completion record.
- Exact English reference: Your {milestone} record confirms this encounter, not a complete history of the preceding chapters. Here are the recorded rewards and the gaps we must leave unknown.
- Authoritative bindings: milestone=missionLabel(milestone.id). Only supported completed tenth-mission encounters; not a promise the preceding nine chapters exist or are complete.
- Playback policy: Text-only factual fragment or dynamic fact. No slot narration/splicing or fixed-value recording proposed.
- Source: `src/game/assistant/progress.js:74`; recorded source hash matches current file.
- Audio availability: No evaluation recording identified; remain text-only. No generation authorized.
- Telugu/content status: PENDING / UNVERIFIED; no source wording changed.

### BH6-5E-029 — 7. Tenth-mission retrospective briefings

- Proposed event: existing explicit assistant request → `BH6-5E-029` branch; no automatic combat/mission speech added.
- Guard/context: Accepted recap fact; milestone.complete=true.
- Exact English reference: {milestone} — recorded local encounter completion: {encounter_name}.
- Authoritative bindings: milestone=missionLabel(milestone.id); encounter_name=milestone.name from existing ARC_BOSSES. Never introduce movie opponents or future outcomes.
- Playback policy: Text-only factual fragment or dynamic fact. No slot narration/splicing or fixed-value recording proposed.
- Source: `src/game/assistant/progress.js:64`; recorded source hash matches current file.
- Audio availability: No evaluation recording identified; remain text-only. No generation authorized.
- Telugu/content status: PENDING / UNVERIFIED; no source wording changed.

### BH6-5E-030 — 7. Tenth-mission retrospective briefings

- Proposed event: existing explicit assistant request → `BH6-5E-030` branch; no automatic combat/mission speech added.
- Guard/context: Accepted recap; ten-mission range history intersection.
- Exact English reference: Recorded history in this ten-mission range: {recorded_history}.
- Authoritative bindings: recorded_history=list(history), the range IDs that actually have accepted completion records.
- Playback policy: Text-only factual fragment or dynamic fact. No slot narration/splicing or fixed-value recording proposed.
- Source: `src/game/assistant/progress.js:65`; recorded source hash matches current file.
- Audio availability: No evaluation recording identified; remain text-only. No generation authorized.
- Telugu/content status: PENDING / UNVERIFIED; no source wording changed.

### BH6-5E-031 — 7. Tenth-mission retrospective briefings

- Proposed event: existing explicit assistant request → `BH6-5E-031` branch; no automatic combat/mission speech added.
- Guard/context: Accepted recap; missing accepted completions in the range.
- Exact English reference: No accepted completion history for: {missing_missions}.
- Authoritative bindings: missing_missions=list(missing). Absence of accepted history is not proof of a specific player action.
- Playback policy: Text-only factual fragment or dynamic fact. No slot narration/splicing or fixed-value recording proposed.
- Source: `src/game/assistant/progress.js:66`; recorded source hash matches current file.
- Audio availability: No evaluation recording identified; remain text-only. No generation authorized.
- Telugu/content status: PENDING / UNVERIFIED; no source wording changed.

### BH6-5E-032 — 7. Tenth-mission retrospective briefings

- Proposed event: existing explicit assistant request → `BH6-5E-032` branch; no automatic combat/mission speech added.
- Guard/context: Accepted recap; range includes unsupported/paused routes.
- Exact English reference: Unimplemented or paused chapters in this range: {unavailable_chapters}.
- Authoritative bindings: unavailable_chapters=list(unavailable). Not gameplay pause and not a new chapter unlock.
- Playback policy: Text-only factual fragment or dynamic fact. No slot narration/splicing or fixed-value recording proposed.
- Source: `src/game/assistant/progress.js:67`; recorded source hash matches current file.
- Audio availability: No evaluation recording identified; remain text-only. No generation authorized.
- Telugu/content status: PENDING / UNVERIFIED; no source wording changed.

### BH6-5E-033 — 7. Tenth-mission retrospective briefings

- Proposed event: existing explicit assistant request → `BH6-5E-033` branch; no automatic combat/mission speech added.
- Guard/context: Recap milestone=100 and accepted completion exists; extra warning.
- Exact English reference: A Mission 100 record is not proof that all 100 chapters are complete. No later mission or sequel outcome is implied.
- Authoritative bindings: No dynamic placeholders.
- Playback policy: Candidate full fixed sentence; eligible only when the exact current response branch matches, after text/voice/rights approval.
- Source: `src/game/assistant/progress.js:72`; recorded source hash matches current file.
- Audio availability: No evaluation recording identified; remain text-only. No generation authorized.
- Telugu/content status: PENDING / UNVERIFIED; no source wording changed.

### BH6-5E-034 — 7. Tenth-mission retrospective briefings

- Proposed event: existing explicit assistant request → `BH6-5E-034` branch; no automatic combat/mission speech added.
- Guard/context: Supported milestone exists but milestone.complete=false.
- Exact English reference: There is no completion recap to tell yet. Future encounters, events and rewards are not described.
- Authoritative bindings: No dynamic placeholders.
- Playback policy: Candidate full fixed sentence; eligible only when the exact current response branch matches, after text/voice/rights approval.
- Source: `src/game/assistant/progress.js:62`; recorded source hash matches current file.
- Audio availability: No evaluation recording identified; remain text-only. No generation authorized.
- Telugu/content status: PENDING / UNVERIFIED; no source wording changed.

### BH6-5E-035 — 7. Tenth-mission retrospective briefings

- Proposed event: existing explicit assistant request → `BH6-5E-035` branch; no automatic combat/mission speech added.
- Guard/context: Defensive recap API branch: requested milestone absent from p.milestones; not a normal supported dropdown choice.
- Exact English reference: No recap is available; no completion or future event is inferred.
- Authoritative bindings: No dynamic placeholders.
- Playback policy: Candidate full fixed sentence; eligible only when the exact current response branch matches, after text/voice/rights approval.
- Source: `src/game/assistant/progress.js:61`; recorded source hash matches current file.
- Audio availability: No evaluation recording identified; remain text-only. No generation authorized.
- Telugu/content status: PENDING / UNVERIFIED; no source wording changed.

### BH6-5E-036 — 8. Boss encounter guidance

- Proposed event: existing explicit assistant request → `BH6-5E-036` branch; no automatic combat/mission speech added.
- Guard/context: Mission 1 objective-style answer; gameOver=false, relic=false, bossStatus=intro.
- Exact English reference: The boss introduction is underway.
- Authoritative bindings: No dynamic placeholders.
- Playback policy: Candidate full fixed sentence; eligible only when the exact current response branch matches, after text/voice/rights approval.
- Source: `src/game/assistant/responses.js:18`; recorded source hash matches current file.
- Audio availability: No evaluation recording identified; remain text-only. No generation authorized.
- Telugu/content status: PENDING / UNVERIFIED; no source wording changed.

### BH6-5E-037 — 8. Boss encounter guidance

- Proposed event: existing explicit assistant request → `BH6-5E-037` branch; no automatic combat/mission speech added.
- Guard/context: Mission 1 objective-style answer; gameOver=false, relic=false, bossStatus=active.
- Exact English reference: Face the Warden; watch its attack wind-up.
- Authoritative bindings: No dynamic placeholders.
- Playback policy: Candidate full fixed sentence; eligible only when the exact current response branch matches, after text/voice/rights approval.
- Source: `src/game/assistant/responses.js:18`; recorded source hash matches current file.
- Audio availability: Existing isolated evaluation audio only; not approved/mapped in production.
- Telugu/content status: PENDING / UNVERIFIED; no source wording changed.

### BH6-5E-038 — 8. Boss encounter guidance

- Proposed event: existing explicit assistant request → `BH6-5E-038` branch; no automatic combat/mission speech added.
- Guard/context: Mission 1 objective-style answer; gameOver=false, relic=false, bossStatus=defeated. Actual collection additionally requires victoryReady.
- Exact English reference: Collect the relic after the encounter becomes ready.
- Authoritative bindings: No dynamic placeholders.
- Playback policy: Candidate full fixed sentence; eligible only when the exact current response branch matches, after text/voice/rights approval.
- Source: `src/game/assistant/responses.js:18`; recorded source hash matches current file.
- Audio availability: No evaluation recording identified; remain text-only. No generation authorized.
- Telugu/content status: PENDING / UNVERIFIED; no source wording changed.

### BH6-5E-039 — 8. Boss encounter guidance

- Proposed event: existing explicit assistant request → `BH6-5E-039` branch; no automatic combat/mission speech added.
- Guard/context: Mission 1 objective-style answer; not gameOver and relicCollected=true.
- Exact English reference: The relic is collected. Allow the ending and completion presentation to finish.
- Authoritative bindings: No dynamic placeholders.
- Playback policy: Candidate full fixed sentence; eligible only when the exact current response branch matches, after text/voice/rights approval.
- Source: `src/game/assistant/responses.js:18`; recorded source hash matches current file.
- Audio availability: No evaluation recording identified; remain text-only. No generation authorized.
- Telugu/content status: PENDING / UNVERIFIED; no source wording changed.

### BH6-5E-040 — 9. Replay and previously completed missions

- Proposed event: existing explicit assistant request → `BH6-5E-040` branch; no automatic combat/mission speech added.
- Guard/context: Mission 1 completion/replay prompt; savedComplete=true and replay=true.
- Exact English reference: A previous completion is recorded. This is a replay; the saved rewards are not a promise of another payout.
- Authoritative bindings: No dynamic placeholders.
- Playback policy: Candidate full fixed sentence; eligible only when the exact current response branch matches, after text/voice/rights approval.
- Source: `src/game/assistant/responses.js:21`; recorded source hash matches current file.
- Audio availability: No evaluation recording identified; remain text-only. No generation authorized.
- Telugu/content status: PENDING / UNVERIFIED; no source wording changed.

### BH6-5E-041 — 9. Replay and previously completed missions

- Proposed event: existing explicit assistant request → `BH6-5E-041` branch; no automatic combat/mission speech added.
- Guard/context: Mission 1 factual snapshot; c.replay=true.
- Exact English reference: Current attempt: replay.
- Authoritative bindings: No dynamic placeholders.
- Playback policy: Candidate full fixed sentence; eligible only when the exact current response branch matches, after text/voice/rights approval.
- Source: `src/game/assistant/responses.js:15`; recorded source hash matches current file.
- Audio availability: No evaluation recording identified; remain text-only. No generation authorized.
- Telugu/content status: PENDING / UNVERIFIED; no source wording changed.

### BH6-5E-042 — 9. Replay and previously completed missions

- Proposed event: existing explicit assistant request → `BH6-5E-042` branch; no automatic combat/mission speech added.
- Guard/context: Progress current.status when route is implemented, unlocked, savedComplete=true and playing=false.
- Exact English reference: completion recorded; not running
- Authoritative bindings: No dynamic placeholders.
- Playback policy: Text-only status/helper fragment; do not speak out of context.
- Source: `src/game/assistant/progress.js:35`; recorded source hash matches current file.
- Audio availability: No evaluation recording identified; remain text-only. No generation authorized.
- Telugu/content status: PENDING / UNVERIFIED; no source wording changed.

### BH6-5E-043 — 10. Missing-information fallback responses

- Proposed event: existing explicit assistant request → `BH6-5E-043` branch; no automatic combat/mission speech added.
- Guard/context: Legacy guidance answer invoked outside Mission 1 or for an unavailable route; not the progress/recap prompt.
- Exact English reference: Select an existing Mission 1 route to ask for guidance.
- Authoritative bindings: No dynamic placeholders.
- Playback policy: Candidate full fixed sentence; eligible only when the exact current response branch matches, after text/voice/rights approval.
- Source: `src/game/assistant/responses.js:14`; recorded source hash matches current file.
- Audio availability: No evaluation recording identified; remain text-only. No generation authorized.
- Telugu/content status: PENDING / UNVERIFIED; no source wording changed.

### BH6-5E-044 — 10. Missing-information fallback responses

- Proposed event: existing explicit assistant request → `BH6-5E-044` branch; no automatic combat/mission speech added.
- Guard/context: Mission 1 objective-style prompt; gameOver=true takes priority over all later objective branches.
- Exact English reference: This attempt ended. Use the existing restart control.
- Authoritative bindings: No dynamic placeholders.
- Playback policy: Candidate full fixed sentence; eligible only when the exact current response branch matches, after text/voice/rights approval.
- Source: `src/game/assistant/responses.js:18`; recorded source hash matches current file.
- Audio availability: No evaluation recording identified; remain text-only. No generation authorized.
- Telugu/content status: PENDING / UNVERIFIED; no source wording changed.

### BH6-5E-045 — 10. Missing-information fallback responses

- Proposed event: existing explicit assistant request → `BH6-5E-045` branch; no automatic combat/mission speech added.
- Guard/context: buildProgress warning: completedMissionIds is not an array.
- Exact English reference: Completion history is missing; no completed mission is inferred.
- Authoritative bindings: No dynamic placeholders.
- Playback policy: Candidate full fixed sentence; eligible only when the exact current response branch matches, after text/voice/rights approval.
- Source: `src/game/assistant/progress.js:20`; recorded source hash matches current file.
- Audio availability: Existing isolated evaluation audio only; not approved/mapped in production.
- Telugu/content status: PENDING / UNVERIFIED; no source wording changed.

### BH6-5E-046 — 10. Missing-information fallback responses

- Proposed event: existing explicit assistant request → `BH6-5E-046` branch; no automatic combat/mission speech added.
- Guard/context: buildProgress warning: unlockedMissionIds is not an array.
- Exact English reference: Unlock history is missing; availability is not inferred from briefing or reward data.
- Authoritative bindings: No dynamic placeholders.
- Playback policy: Candidate full fixed sentence; eligible only when the exact current response branch matches, after text/voice/rights approval.
- Source: `src/game/assistant/progress.js:21`; recorded source hash matches current file.
- Audio availability: No evaluation recording identified; remain text-only. No generation authorized.
- Telugu/content status: PENDING / UNVERIFIED; no source wording changed.

### BH6-5E-047 — 10. Missing-information fallback responses

- Proposed event: existing explicit assistant request → `BH6-5E-047` branch; no automatic combat/mission speech added.
- Guard/context: buildProgress warning: campaign.rewards is not a record object.
- Exact English reference: Reward history is missing; amounts are unknown, not zero.
- Authoritative bindings: No dynamic placeholders.
- Playback policy: Candidate full fixed sentence; eligible only when the exact current response branch matches, after text/voice/rights approval.
- Source: `src/game/assistant/progress.js:22`; recorded source hash matches current file.
- Audio availability: No evaluation recording identified; remain text-only. No generation authorized.
- Telugu/content status: PENDING / UNVERIFIED; no source wording changed.

### BH6-5E-048 — 10. Missing-information fallback responses

- Proposed event: existing explicit assistant request → `BH6-5E-048` branch; no automatic combat/mission speech added.
- Guard/context: buildProgress warning: invalid/incomplete reward record or invalid entries filtered.
- Exact English reference: Invalid or incomplete reward data for {mission}; invalid values ignored.
- Authoritative bindings: mission=missionLabel(id). The adapter filters invalid values but does not write the save.
- Playback policy: Text-only factual fragment or dynamic fact. No slot narration/splicing or fixed-value recording proposed.
- Source: `src/game/assistant/progress.js:26`; recorded source hash matches current file.
- Audio availability: No evaluation recording identified; remain text-only. No generation authorized.
- Telugu/content status: PENDING / UNVERIFIED; no source wording changed.

### BH6-5E-049 — 10. Missing-information fallback responses

- Proposed event: existing explicit assistant request → `BH6-5E-049` branch; no automatic combat/mission speech added.
- Guard/context: buildProgress warning: completed route has no reward entry.
- Exact English reference: No reward entry for recorded {mission}; amounts unknown.
- Authoritative bindings: mission=missionLabel(id), an accepted completed route. Do not replace missing with zero or promise a payout.
- Playback policy: Text-only factual fragment or dynamic fact. No slot narration/splicing or fixed-value recording proposed.
- Source: `src/game/assistant/progress.js:32`; recorded source hash matches current file.
- Audio availability: No evaluation recording identified; remain text-only. No generation authorized.
- Telugu/content status: PENDING / UNVERIFIED; no source wording changed.

### BH6-5E-050 — 10. Missing-information fallback responses

- Proposed event: existing explicit assistant request → `BH6-5E-050` branch; no automatic combat/mission speech added.
- Guard/context: rewardText helper receives no valid reward entries; a fragment used inside progress/recap facts.
- Exact English reference: amounts unknown (no valid reward entry)
- Authoritative bindings: No dynamic placeholders.
- Playback policy: Text-only status/helper fragment; do not speak out of context.
- Source: `src/game/assistant/progress.js:6`; recorded source hash matches current file.
- Audio availability: No evaluation recording identified; remain text-only. No generation authorized.
- Telugu/content status: PENDING / UNVERIFIED; no source wording changed.

### BH6-5E-051 — 10. Missing-information fallback responses

- Proposed event: existing explicit assistant request → `BH6-5E-051` branch; no automatic combat/mission speech added.
- Guard/context: Progress/accepted recap; p.next is null.
- Exact English reference: Next unfinished available mission: none currently unlocked and implemented.
- Authoritative bindings: No dynamic placeholders.
- Playback policy: Candidate full fixed sentence; eligible only when the exact current response branch matches, after text/voice/rights approval.
- Source: `src/game/assistant/progress.js:48`; recorded source hash matches current file.
- Audio availability: No evaluation recording identified; remain text-only. No generation authorized.
- Telugu/content status: PENDING / UNVERIFIED; no source wording changed.

## Plan decision

**CONDITIONAL — planning complete, implementation blocked pending rights/listening review and separate authorization.** No generation or production integration approved. Stop after this report.
