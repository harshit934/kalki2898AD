# Phase 6 Milestone 5H.28 — remaining acceptance gaps

15 November 2026. **Partially resolved. Retain 5H.27 CONDITIONAL PASS for the unchanged one-event desktop staging build. The new extra-event copy is experimental and is not approved for copy-back or production.**

## Evidence and isolation

Reviewed all fourteen milestone report/checklist/rollback Markdown files for 5H.22–5H.27 and the 5H.25, 5H.26 and 5H.27 result CSVs. `milestone5H28/evidence-reviewed.json` lists exact documents and SHA-256 values. Also inspected the standalone manifest/controller, current event gate/adapter, Mission 1/2 campaign, gameplay, boss, cinematic, HUD and audio lifecycle code, the original listening scorecard, 5H.21 user decision, and existing 5H.11–5H.13 rights findings plus the pinned local licence record.

Accepted staging remains `phase6/milestone5H24/staging/`. All experimental edits and tests used a new copy at `phase6/milestone5H28/staging/`. Its Vite root, envDir and cache are isolated; original public assets and node_modules are referenced read-only. No `.env` or personal browser profile was copied. Tests used new disposable Chrome contexts on ephemeral loopback origins. No new audio or models were generated or downloaded.

## Four gaps from 5H.27

### 1. Physical Android playback — UNVERIFIED

Fresh read-only PnP/ADB inspection found no accessible Android target and no ADB at PATH or the three checked locations. `milestone5H28/device-availability.json` records the exact checks. No physical test was performed and browser emulation was not substituted. This does not prove that no phone physically exists.

Next action: provide an accessible physical Android device for an authorized hardware playback test. No installation or device configuration change was attempted.

### 2. Broader Mission 1 voice-event coverage — PARTIALLY RESOLVED

The accepted copy still has exactly one event: `mission-1:<roundId>:first-movement-guidance`, BH6-5E-002. Five category labels exist in the standalone prototype; they were never evidence of five game bindings.

The new test copy reuses those exact five samples and unchanged Telugu wording. Bindings read authoritative current state and do not modify mission stores, rewards or objectives. Optional playback has no mission advancement callbacks. The controller remains the existing unchanged implementation. A staging-only 100 ms observer chooses eligible extra events, deduplicated once per round; this polling design is an experiment, not a proposed production architecture.

- **Calm / initial patrol guidance — PASS, natural input.** BH6-5E-002 says clear patrols before the arena. First eligible movement starts it, only while patrols remain and the boss is dormant.
- **Combat low-health warning — PASS, natural input.** BH6-5E-004 says health is low. It triggered at **33.6 HP**, with remaining patrols. The test copy requires positive HP at or below 35 and actual patrol/boss combat. This threshold is a bounded test-binding choice, not a combat-rule change. Audio reached playing/ended states while gameplay continued.
- **Boss warning — PASS, natural input.** BH6-5E-037 refers specifically to the Warden. It triggered with boss status active at **19.6 player HP** and played to completion. It is not generalized to other bosses.
- **Recorded completion / victory — PASS for controlled fixture only; UNVERIFIED naturally in this copy.** BH6-5E-013 refers to recorded completion and saved facts. A separate disposable context was seeded once from the genuinely earned 5H.26 test save; boss/relic and completed-ending presentation state were explicitly injected in memory. Native playback, visible reward facts, Skip, replay without reward duplication, prior-clip settlement and pause/exit cleanup passed. It is not evidence of earning completion or naturally playing the ending.
- **Emotional/serious dialogue — BLOCKED for normal Mission 1 events.** BH6-5E-045 actually says completion history is unavailable. It cannot truthfully accompany an ordinary boss, victory or emotional story event when authoritative history is available. The policy deliberately refuses this mapping. No text or audio was rewritten to hide the mismatch.

Other intended contextual uses from the assistant design—current objective, remaining enemies/objectives, relic explanations, replay explanations, progress summaries and tenth-mission recaps—do not all have matching audio among these five samples. Their text-only behavior is not spoken coverage. No extra missions or tenth-mission campaign content was added. Content mapping/appropriate recordings remain a prerequisite for broader voice coverage, outside this no-generation assessment.

### Natural Mission 1 attempt and limits

`milestone5H28/raw-results.json` records ordinary keyboard movement, attacks, block, dodge and Overdrive, with read-only state-assisted navigation. The fresh run reached the Warden, but **failed completion: player 0 HP, boss 46 HP, no relic and no recorded completion/rewards**. Time from post-restart run start to defeat: **78.394 seconds**. Calm, combat and boss event audit records and native playback logs are present; no page exceptions were recorded. No direct health, damage, teleport or completion setters were used in this natural attempt.

This is a failed gameplay attempt, not a confirmed audio-caused defect. The evidence does not justify changing combat difficulty or blaming voice playback. New-copy natural relic → ending → victory voice remains UNVERIFIED; the controlled fixture does not replace it. The accepted-copy 5H.26 successful natural ending/rewards and 5H.27 browser-restart evidence remain valid historical results for that unchanged candidate.

Initial calm Skip/replay, mute/volume, movement deduplication, pause/resume, actual HTTP 404 fallback and restart passed in the new copy. The initial relay interaction did not establish a BUJJI message and remains UNVERIFIED in the new run; valid 5H.26 relay evidence is historical only. The inherited harness's raw “No stale calm sample” PASS uses an invalid future-time predicate, so it is excluded as acceptance proof and classified UNVERIFIED in the final CSV. Event truthfulness conclusions use explicit audit contexts and native playing/ended records instead. Bounded controller log event counts are not treated as full event-history counts.

Next action: review the experimental event mappings. A natural completion with these extra bindings would still be needed before accepting the expanded copy. Do not promote it on the strength of the fixture.

### 3. Mission 2 runtime compatibility — PASS for bounded desktop smoke

Actual Mission 2 was launched through the UI in the isolated new copy, using a disposable profile seeded from 5H.26's actual earned Mission 1 save. Its zero-padded mission card was selected normally. Briefing returned into rendered gameplay, real W input moved the player from approximately z8 to z6.85, and a glass stalker's health changed from **89 to 77** during keyboard combat. Pause/resume and real UI exit passed.

The Mission 1 adapter was absent and **zero prototype WAV requests** occurred throughout Mission 2. Mission 1 rewards/completion remained unchanged and no Mission 2 completion was fabricated. Evidence: `milestone5H28/mission2-results.json` and `mission2-runtime.png`.

This resolves basic runtime exclusion/compatibility, not Mission 2 full completion, boss, Bujji contract/chase, mobile or exhaustive regression. Voice was not enabled for Mission 2 or production.

An initial test locator expected “MISSION 2” while the actual card is “MISSION 02”; it timed out. Its failure is retained in `mission2-selector-attempt.json`. The corrected locator supplied new actual runtime evidence; no game fix was made.

### 4. Pronunciation, expressive suitability and commercial rights — UNVERIFIED / BLOCKED

Fresh scorecard inspection: **10 rows, 0 listened=YES, 0/50 filled rating cells**. No subjective listening scores, fluent-speaker approval or emotional-quality conclusions were added. The user's 5H.21 decision continues to permit temporary prototype use in all categories; it does not complete the scorecard or provide independent quality evidence.

Existing pinned local documentation declares acoustic weights CC BY 4.0 and runtime code MIT, with Rasa Telugu and Vocos/LibriTTS provenance declarations. Those declarations are documented evidence, not automatic clearance of every downstream right. Existing 5H.13 questions remain: applicable gated dataset terms, voice/non-copyright permission scope, generated-output commercial scope or a supported release assessment, and distribution-specific notices/asset approval. No additional permission evidence was located in the inspected records. This audit did not obtain new rights-holder consent or perform a fresh remote legal clearance.

Commercial production remains **BLOCKED**; pronunciation and expressive suitability remain **UNVERIFIED**. Prototype WAV validation and technical playback cannot resolve these. Existing production rights enforcement/packaging remains untouched.

## Validation and evidence quality

Chrome 157.0.8103.51, headless desktop 1920×1080. Native media state establishes technical playback, not audible speaker output or linguistic quality. The controlled fixture is separately labelled in every result. Six new policy contract tests passed; focused existing Oxlint on the experimental adapter/policy exited 0. Production build/lint and sustained performance benchmarks were not run because this is an isolated gap assessment with no production changes. No 30-FPS claim follows.

The first victory-fixture attempt timed out waiting for playback after early input. Its readiness-aware follow-up waited for the existing keyboard listener before sending movement and passed. Initial timeout evidence remains in `victory-readiness-attempt.json`; no decoder root cause or production workaround is claimed.

`phase6-milestone5H28-test-results.csv` has **44 grouped assessment/attempt rows: 33 PASS, 3 FAIL, 5 UNVERIFIED, 3 BLOCKED**. The three FAIL rows are the natural completion attempt and two retained test-harness attempts. Counts are not numbers of independent missions and do not represent blanket staging acceptance.

## Screenshots inspected

- `milestone5H28/boss-active.png`: actual natural Warden encounter and staging warning panel. Player is partly outside the camera edge in this capture; no camera-quality acceptance is asserted.
- `milestone5H28/attempt-final.png`: actual defeated attempt, not a victory.
- `milestone5H28/mission2-runtime.png`: genuine Mission 2 gameplay, no prototype panel. Existing world/model quality is not reassessed as passed.
- `milestone5H28/victory-fixture.png`: explicitly injected presentation fixture, not natural mission victory. Saved reward facts are shown; fixture run score is zero and is not a claimed earned score.

## Integrity, rollback and stop

Fresh verification: **47/47 protected SHA-256 values match the expected historical manifest** (`phase5/phase54f-stabilization-20261114/changes-and-hashes.json`). **965/965 existing snapshotted files remain unchanged**, including accepted staging, production source/assets, prior rollback copies, standalone prototype, audio and previous evidence in that snapshot. Details: `milestone5H28/integrity-results.json`, `protected-hashes.json`, `existing-before.json`.

Within the new copy only `src/stagingVoice/StagingVoice.jsx` differs from its copied baseline; added files are `clips.json` and `eventPolicy.mjs`. New server, tests, JSON logs, screenshots and reports live under the new milestone directory or the three requested deliverable paths. No original WAV or dialogue draft was overwritten. No personal profile was opened; preservation by isolation is not an independent examination of personal-save contents.

Rollback requires no restoration: keep using the unchanged 5H.24/5H.27 candidate and retain the entire experimental copy/evidence for comparison. Do not copy it back or delete earlier rollback points. No production recovery or save restoration is needed.

All disposable browsers and loopback servers closed through finally blocks; final owned test/server Node process count is **0**. No unrelated process was stopped. Stop after this assessment. No production integration or additional milestone has begun.
