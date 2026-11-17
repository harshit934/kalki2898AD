# Phase 6 Milestone 5H.37 — proposed implementation plan

15 November 2026. **Approval requested for a future isolated test; nothing implemented here.** No production copy-back is proposed.

## Smallest representative test

One existing combat encounter in a new isolated staging copy with a disposable browser profile. Preserve the original production default, existing Kashi opt-in status, Phase 5 conditional acceptance, accepted assistant prototype and all rollback points. Do not expand missions or change combat parameters.

Exactly four demonstration cues:

1. One short heavy-impact SFX after an actual landed heavy hit.
2. One enemy-defeat reaction after a unique real death.
3. One optional original funny Telugu line during a safe lull.
4. One factual boss warning with higher priority, cancelling the optional line.

Use genuine state transitions for integrated gameplay evidence. A mocked warning/interruption is useful for deterministic controller testing but must be labelled a fixture, not proof of a natural boss encounter. Select a real boss-warning state only after verifying its meaning in the existing encounter code; do not invent a tactical prediction.

**Asset gate:** identify one approved-for-isolated-testing recording/effect per cue, with hash, provenance, permitted scope, text and intended context. No suitable funny Telugu recording is established by this audit. Existing 5H.36 movie pointers are ineligible; current Indic Tiny samples have temporary prototype acceptance only and may not fit the four cue meanings. Missing assets block the audible four-cue acceptance test. Silent/mocked controller tests cannot substitute for listening proof. This plan does not authorize synthesis, downloads or permission changes.

## Implementation sequence and effort

Estimates are active engineering time after usable test assets are available; external permissions and user listening are separate dependencies.

1. **Preservation and mapping: 1–2 hours.** Snapshot affected staging files/settings, pin source/sample hashes and identify exact hit/death/boss hooks. Record encounter/attack/target IDs. Fail closed on mismatched assets. No personal profile access.
2. **Controller and bus extension: 3–5 hours.** Reuse manager interfaces in staging; add shared speech reservation, context/rights eligibility, event dedup, expiry, conservative cooldowns and independent bus gains. No automatic relaxation of rights. Keep optional playback fire-and-forget. Test lifecycle/status races before changing them.
3. **Four-cue event adapter: 2–3 hours.** Connect confirmed heavy hit and unique defeat; one safe-lull joke and real boss warning. Bind Skip/replay/mute/volume through existing prototype controls with no menu redesign. Do not add general combo/multi-kill systems to this first test.
4. **Validation and evidence: 3–5 hours.** Mocked boundary tests, actual desktop encounter, portrait/landscape browser emulation, measured audio/frame timing and integrity checks. Physical Android only when a device is available. Stop owned servers/browsers; produce a bounded report.

Expected isolated implementation plus validation: **9–15 hours**, approximately 2–3 working days with asset prerequisites met. Palace Escape listening completion, new recordings and commercial clearance are not included or promised. No estimate claims the entire game's audio overhaul is done.

## Proposed staging files and boundaries

Create a new `phase6/milestone5H37-evaluation/` directory only after separate authorization, with its own README, rollback manifest and test outputs. Retain old staging/prototype directories unchanged.

Potential affected **staging equivalents only**: `src/audio/audioManager.js`, a small combat-audio event adapter, `src/game/player/Player.jsx`, `src/game/combatSystem.js`, `src/game/bossSystem.js`, and narrowly scoped audio controls. Confirm actual need before editing; avoid modifying every listed file automatically. Keep `dialogueInventory.js` and the existing production packaging policy as authoritative protected constraints rather than disabling them. No production file is on the authorized change list for this milestone.

## Measurable acceptance tests

- **Rights:** unapproved/missing approval returns blocked before fetch/decode; movie candidates cannot play through any new route. Every test asset has an explicit permitted testing scope. Shipping clearance remains a separate gate.
- **Outcome accuracy:** missed swings/zero damage do not produce confirmed-impact audio; one heavy swing does not emit duplicate impacts on repeated polling. Defeat fires once per enemy/encounter. Audio never alters damage, objectives, rewards, completion, unlocks or saves.
- **Priority/overlap:** maximum one dialogue source at once across integrated owners. Boss warning preempts a joke, including while its file is loading; the joke never starts late. Cinematic speech cannot be interrupted by banter. Exercise 20 rapid synthetic requests and actual gameplay events; count starts/stops, not only promise results.
- **Repetition:** deterministic tests of allowlist, empty pool, context filters, cooldown and recent history. Drop stale optional lines; no catch-up chatter on resume/unmute. A one-clip pool is allowed to stay silent during its cooldown.
- **Controls:** Skip ends current optional playback and releases ownership without changing gameplay state. Replay does not retrigger mission events. Independent buses and master mute/zero volume work. No stuck ducking after end/error/skip.
- **Lifecycle/errors:** pause/resume, restart, exit, victory, backgrounding, rejected autoplay, missing/corrupt files and a cancelled pending decode. Old asynchronous callbacks cannot overwrite current status or restart old speech. Important cinematic sequencing remains unchanged.
- **Desktop and mobile:** actual desktop browser playback after first interaction; portrait/landscape touch layout and readable Skip/captions. Physical Android is UNVERIFIED/BLOCKED unless actually exercised. Do not count emulation as hardware playback evidence.
- **Gameplay:** one complete existing encounter, natural boss warning and defeat where feasible; movement/combat responsive during speech; affected ending/replay/reward regressions use disposable saves. Fixtures are reported separately.
- **Performance:** three matched short 1080p runs with feature off and on, same encounter/build/settings/power condition and minimal observer. Report average FPS, median, p95/p99/max frame interval, every gap above 100 ms, and loading/decode separately. Measure warm request-to-source-start p95 target ≤100 ms; source start is not speaker-output latency. Audible alignment requires listening or suitable external measurement and must not be inferred from a promise. Target median/p95 degradation ≤5% where repeatability supports comparison; investigate new recurring audio-attributed gaps above 100 ms, do not promise perfect 30 FPS.
- **Resources:** no decode/fetch in the hot hit callback for prepared cues; bounded cache and voice count; compare available memory before/after repeated encounters. No new audio-attributed recurring interruption or sustained leak.
- **Integrity:** production hashes unchanged, 47/47 protected hashes, standalone prototype and accepted rollback unchanged. Compare disposable campaign completion/rewards with baseline. Do not read or write personal saves.

Only mark PASS for executed checks with evidence. Unknowns remain UNVERIFIED; asset/licensing/device prerequisites can remain BLOCKED. Build/lint of an unchanged production tree does not establish audio quality.

## Rollback and stop rules

Before each significant staging edit, copy only affected files to a new rollback location and record hashes. Keep audio by allowlisted reference where possible, without changing old files. If a baseline/hash mismatch, production write, save risk, uncontrolled audio overlap or rights bypass appears, stop safely and preserve evidence. Never delete rollback files to free space.

Rollback means stop the owned staging server and test browser and return to the untouched accepted staging/production path; do not copy experimental files into production. Remove nothing automatically. Later production integration requires separate approval, actual rights clearance and acceptance evidence.

## Decision for approval

**Proceed only to a separately authorized isolated four-cue test after its asset gate is met.** The current audit does not establish that the funny Telugu recording exists or is cleared. The Palace Escape listening comparison remains incomplete. Do not implement the full event catalogue or integrate anything into production on this milestone's authority.
