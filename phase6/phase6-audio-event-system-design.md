# Phase 6 — event-driven movie dialogue and theme audio design

15 November 2026. **Inspection and design only. Movie dialogue/theme integration: BLOCKED.** The user's clarified stop conditions govern this task. No audio controller or playback integration was implemented.

## Current architecture and exact integration points

`src/audio/audioManager.js` already owns WebAudio initialization, catalogue dialogue playback, master gain/mute, cooldown maps, decoded-buffer promises, failed-file tracking and dialogue-status subscriptions. `playGameSound()` is a legacy event-to-dialogue adapter, not a complete SFX engine. Catalogue playback rejects entries lacking `distributionRights.verified === true` while the required-rights flag is enabled. It defaults to enabled; `src/App.jsx` explicitly enables it. Manual previews call the same gated playback function.

Current catalogue cooldowns: event 1,800 ms; clip 5,000 ms. Random selection excludes the last successful same-event clip when alternatives exist. One catalogue `activePlayback` prevents simultaneous catalogue dialogue; a higher numeric priority interrupts lower priority. These mechanisms are confirmed in source, not newly validated through audible gameplay.

`createCinematicAudio()` creates independent HTMLAudio elements and per-player voice/music/ambience channels. They follow master settings and global pause, and dispose on cinematic exit. They do not share one global spoken-dialogue lease with catalogue playback or the isolated assistant prototype. Their arbitrary `cue.src` input has no catalogue-rights check. Do not use that route to bypass asset approval. This audit does not establish unauthorized playback through that route.

Existing event paths:

- **Valid player damage:** `src/game/gameplayStore.js`, `takeDamage()`. It rejects held game time, game-over and invulnerable contacts; applies blocking reduction; sets actual health/damage state; then calls `playGameSound('playerDamage')`. A future reaction must require an enemy/boss source and actual health decrease. Environment damage must not be mislabeled an enemy hit. Current source does not give every caller a standardized attacker ID.
- **Opponent defeat:** `src/game/combatSystem.js`, `damageEnemy()`. It rejects unknown/already-defeated enemies, derives health, records the unique defeat/reward and calls `playGameSound('enemyDefeat')`. Place future observation after confirmed death, never every hit. `roundId` and target ID distinguish replayed encounters. Do not change score or crystal-drop randomness.
- **Mission entrance:** `src/App.jsx`, `startMissionReady()` and the successful `useCampaignState.startMission()` path. Mission intro/cinematic selection follows launch. Mission start is not identical to arbitrary arena/location entry. No universal once-per-location entrance-audio hook was found in inspected source. Use an explicit existing transition and stable entrance ID, not repeated distance polling or component mounts.
- **Boss encounter:** `src/game/bossSystem.js`, `beginEncounter()`: only dormant → intro succeeds, then `playGameSound('bossIntroduction')`. This is an encounter introduction, not evidence of a predictive attack warning. Preserve its state machine and cinematic contracts.
- **Pause:** `src/game/pauseSystem.js` calls `setGameAudioPaused()`; cinematic pause/resume and global audio holds are already coordinated.
- **Restart/exit:** App stops cinematic/catalogue dialogue, clears inputs and resets mission systems. Future music must follow this lifecycle without influencing completion or reward logic.

`src/game/player/Player.jsx` already has a successful `landed` result for attacks, but the latest requested scope is damage/defeat/entrance/boss/theme. Heavy/combo expansion from earlier proposals is not added to this task.

## Assets and actual readiness

Physical public audio found: `/audio/kalki/bhairava/overdrive-voice.ogg`, `/audio/kalki/bujji/support-voice.ogg`, and three cinematic WAVs: chime, Kashi wind and Kashi step. Both catalogue OGG recordings lack verified distribution-rights metadata and remain blocked. Their `automaticTriggerAllowed` flag is not rights clearance. Some other catalogue paths are research placeholders, not available recordings.

Kashi entry references wind/step/chime, and the Mission 1 ending/briefings reference a chime. No dedicated original Kalki theme file or verified game-use permission was identified in the inspected public audio inventory. A channel named music does not establish a supplied soundtrack. No additional theme versions or boss sections are assumed.

The public audio README predates the current two supplied OGG entries and gives outdated mapping descriptions. Current source plus actual file presence take precedence. The README was preserved, not silently corrected.

The 5H.36 map offers 12 research windows, not playable assets. Exact Telugu words, speaker attribution, audible boundaries, humour and event suitability remain unverified. Existing Indic Tiny prototype samples are a different feature and are not substituted as movie dialogue.

## Proposed event behavior

**Player hit:** one short context-matched reaction for actual applied enemy damage; configurable starting event cooldown 6 seconds and clip reuse gap 30 seconds. The gameplay immunity window remains unchanged. Drop suppressed/stale reactions rather than queue them. Audio cannot be expected on every valid hit while preserving cooldown and priority constraints.

**Enemy defeat:** a separate approved pool, starting event cooldown 8 seconds, clip reuse gap 30 seconds; deduplicate `{session, round, enemyId, defeat}`. No hit-triggered victory speech. Avoid announcing rewards not in the authoritative store. If no eligible clip exists, silence/text is valid.

**Mission/arena entrance:** once per `{session, round, missionId, entranceId}`, after successful launch/actual entrance. If an important cinematic is running, allow at most one bounded pending entrance request; discard on restart/exit/mission change, and do not play late after combat has moved on. A blocked/missing request must not stall the entrance or hold gameplay.

**Boss encounter:** once per actual encounter intro. Higher priority than ordinary damage/defeat speech. Do not simultaneously play normal-enemy defeat dialogue. Never add new gameplay timing or announce an attack unsupported by boss state.

Suggested requested ordering: entrance 40 > boss encounter 30 > enemy defeat 20 > hit reaction 10. Existing essential story/cinematic speech reserves a higher protected class. Optional comedy never displaces required tactical warnings. If entrance and boss happen together, preserve the requested ordering but drop stale speech rather than building a long queue.

## Mixing, music and controls

Extend the existing manager only in a separately approved staging implementation. Keep one master mute, with independent Background Music, Dialogue and SFX gains. No campaign-save schema changes. Existing master settings must retain their meaning. New audio-only settings, if authorized later, need safe defaults and validation without changing personal saves.

One persistent music owner per gameplay session. Start only after gameplay begins and a permitted asset is available; initialize/unlock from an actual user interaction. Do not create a new theme player on every render, hit, pause toggle or arena transition. Pause/resume the same position where supported. Stop/release on mission exit to menu; define restart as a new session. Repeated internal mode updates must not restart the track. Separate boss/entrance sections are conditional on real approved files; with only one theme, retain that theme and duck rather than invent variants.

Starting mix targets, not measured quality: important dialogue ducks music about 6 dB with a 50 ms attack/250 ms release. Final bus level is master × user bus gain × duck gain. Restore from current user settings after end/error/skip/interruption; never force music audible after mute. Protect essential gameplay cues from masking. Actual listening and output measurements must validate these targets.

Dialogue uses one shared speech owner across new reactions, existing catalogue and cinematic/assistant owners. Preempting a low-priority line cancels its pending load token as well as its source. On mute, pause/exit, error and skip, release ownership and restore ducking exactly once. A stale async error must not overwrite the current line's status. Replay, if exposed, repeats narration only, never the originating damage/reward/entrance event.

`src/App.jsx` already calls `unlockAudio()` from pointer/key capture; existing sound controls also request unlock. Mobile gesture/autoplay recovery remains a runtime/device validation requirement. WebAudio readiness does not automatically guarantee every independent HTMLAudio element can play. Failure should retain text or silence, return a diagnostic result and never block movement/combat/progression.

## Rights, isolation and packaging

Movie dialogue and theme remain BLOCKED. No newly supplied permission was available. Obtain a documented grant covering the exact recording/segment, interactive game use, commercial distribution if intended, editing/looping, territories/platforms, term and credits, including relevant embedded music/performance permissions. This is an evidence checklist, not a finding that local possession, short duration or humour provides permission.

Do not extract new clips for this task. Keep the full movie/research references outside production asset directories. The existing build policy excludes unapproved catalogue paths and exact-content copies; it does not detect all transformed/uncatalogued movie audio. Any future theme requires its own approved manifest entry and packaging audit. Do not set existing runtime rights flags false.

## Implementation decision

The existing manager is a practical base, but independent buses, persistent music ownership, universal speech arbitration, source-qualified damage events and explicit entrance dedup are incomplete. A targeted staging extension is feasible; production integration is not ready. The current task ends with inspection and these deliverables. Audible acceptance, new source edits and new tests require a later authorized stage after asset/rights gates are satisfied.
