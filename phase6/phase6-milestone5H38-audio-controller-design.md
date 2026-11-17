# Phase 6 5H.38 — isolated audio controller design

15 November 2026. **Implemented in staging, tested with mocked playback only. Original movie/theme playback BLOCKED.**

## Boundary and location

New staging: `phase6/milestone5H38/staging/`. New unmodified rollback: `phase6/milestone5H38/rollback/`. Neither earlier `movie-audio-staging` snapshots nor any accepted assistant staging build was edited. Production remains unchanged. Staging began from 153 current source/config files, not from an obsolete voice prototype. No .env, public audio, models or saves copied.

## Components

- `src/audio/eventController.js`: injectable controller, independent bus levels, one spoken-dialogue reservation, session ownership, cooldown/dedup, cancellation tokens, bounded recent history, once-only entrance/encounter receipts, music lifecycle and defensive error results.
- `src/audio/eventSlots.js`: five configurable dialogue requirements and one theme requirement. Every `src` is null; every rights record is unverified. No invented recording or movie quotation.
- `src/audio/eventRuntime.js`: safe fire-and-forget handler facade and initialization. Mock-controller injection explicitly refuses a browser environment. There is no URL/localStorage approval bypass.
- `src/audio/eventWebAudio.js`: reuses the existing manager's AudioContext and decoded-buffer loader/cache. Separate gain nodes connect Music, Dialogue and SFX. Cancellable preparation is checked before starting a source; paused looping music keeps its offset.
- Existing staging audio manager: initializes backend, synchronizes master settings, routes legacy catalogue dialogue through the dialogue bus, propagates global pause, and reserves protected ownership during catalogue/cinematic playback. Cinematic media retain their disposal contract and follow bus settings.
- Existing staging audio controls: three separately labelled sliders under a staging-only details section. Gains are memory-only; no campaign/settings schema migration. Existing master controls retain their previous behavior.

## Real handler wiring

1. `gameplayStore.takeDamage()` emits `playerDamage` after a valid enemy/boss damage update, not before immunity checks. Ordinary enemies now pass `enemy:<id>` from their existing successful attack path; boss source labels already exist. Unqualified/environment damage does not claim to be an enemy hit. Health, immunity and damage values are unchanged.
2. `combatSystem.damageEnemy()` emits `enemyDefeat` only in its confirmed death branch; repeated damage to a defeated target remains rejected. Existing score/drop/progression logic is unchanged.
3. `campaignSystem.startMission()` emits entrance only after successful launch, creates an audio session ID in memory, and starts the music lifecycle. `returnToSelection()` exits audio. The serial is not saved. `gameplayStore.restart()` and App exit clean up the controller.
4. `bossSystem.beginEncounter()` emits one arena entrance and highest-priority boss introduction on its actual dormant-to-intro transition. The boss line supersedes the generic entrance; both are not forced to play. This does not predict an attack or change the boss state machine.
5. `bossSystem.damageBoss()` supplies the configurable victory slot on the existing confirmed boss defeat/reward path. This slot means boss victory; it does not independently declare relic collection or a cinematic finished.

All hooks are in handlers, not new render-loop observers, polling effects or animation-frame audio triggers. Existing collision/AI code still decides whether an attack lands. No audio result is awaited by combat, missions or rewards.

## Priority, dedup and cancellation

This milestone follows the latest requested ordering: **boss 40 > entrance 30 > victory 20 > normal hit/defeat 10**. Equal/lower-priority requests drop as busy; higher priority stops/invalidate the prior owner. No dialogue backlog. Existing story/cinematic/catalogue speech is protected through hold ownership and cannot be preempted by the new event layer.

Per-event cooldown starts at accepted request: hit 6 seconds, defeat 8 seconds. Stable event IDs plus session IDs suppress duplicates; unique-death/intro handlers also keep their original guards. A 512-entry rolling receipt set bounds memory. Separate once-only receipts (maximum 64 per session) keep entrance/boss/victory suppression intact after rolling-history eviction. Exit clears session-local history. Dropped/busy events are not replayed late. A blocked slot may remain consumed for that session; asset configuration is expected before a new session.

Cancellation checks the active request identity after load and before source start. An old load failure cannot erase a newer line. Pending SFX include a session generation, so pause/exit/restart cannot resurrect old effects. At most eight pending/active SFX reservations. SFX are available through the controller API; no new gameplay SFX recordings or unrelated SFX trigger system was added.

## Music, mixing and lifecycle

One music request or active handle per session; repeated same-session entry and unlock do not restart an active theme. Pause/resume preserves loop position. Restart ends the old session. Exit/menu cleanup stops all owned handles and invalidates pending work. Important dialogue (priority ≥30) targets a 0.5 music multiplier (about −6 dB), with approximately 50 ms attack/250 ms release; the WebAudio adapter smooths targets with `setTargetAtTime`. Normal reactions do not duck. Restoration uses current user bus/master settings, including mute.

Defaults: master follows existing settings; Music 0.35, Dialogue 1, SFX 0.8. Master mute produces zero effective gain on all buses and cancels new dialogue. Bus values clamp to [0,1]; non-finite inputs are ignored. No campaign data writes. Existing cinematic media use bus gain updates, while important new dialogue's smooth ducking is exercised through the prepared music channel. No audible gain-ramp quality is claimed.

Global pause first cancels transient speech/SFX, pauses owned music and follows the shared context hold. Music resumes only after the context is running. Protected cinematic holds pause the new gameplay music rather than compete with existing cinematic audio. Audio unlock follows existing user-gesture paths. A locked context, absent asset, missing/corrupt load or rejected request returns safely without blocking gameplay. No retries or external requests occur for blocked slots.

## Rights and remaining validation

Eligibility requires nonempty source plus explicit verified-rights metadata and an evidence reference. This is an enforcement mechanism, not independent legal verification of any supplied metadata. Actual slots remain empty/unverified. Tests use fictional `mock-only:` identities labelled TEST FIXTURE ONLY, not recordings or clearance.

Staging build uses no public copy, its own envDir/cache/output and no project .env. Production rights checks and packaging policy were not modified. No movie audio was extracted, downloaded, generated, copied or packaged. Actual movie dialogue/theme remain BLOCKED.

Thirty executed tests establish mocked controller behavior, mock WebAudio offset/ramp calls and actual JavaScript handler wiring. They do not establish physical audio output, perceived ducking, desktop/mobile autoplay compatibility, natural gameplay responsiveness or commercial permission. Those remain separate future checks after authorization and asset clearance.
