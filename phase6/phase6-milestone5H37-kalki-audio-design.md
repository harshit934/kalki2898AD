# Phase 6 Milestone 5H.37 — Kalki audio design

15 November 2026. **PROPOSED DESIGN ONLY.** No production integration, new audio or gameplay changes. Palace Escape listening was blocked; none of the recommendations below are claimed as observations of that game.

## Existing architecture: what the current source supports

Source inspected directly in this milestone:

- `src/audio/audioManager.js`: WebAudio catalogue playback, decoded-buffer promise cache, failed-clip tracking, one master volume/mute, event pools, priority arbitration and cinematic HTMLAudio players.
- `src/audio/dialogueInventory.js`: dialogue metadata, trigger pools and research placeholders.
- `src/audio/AudioControls.jsx`, `src/audio/DialogueControls.jsx`, `src/App.jsx`: existing controls, manual preview and gesture initialization. App explicitly requires verified mission voices and captures pointer/key interactions for `unlockAudio()`.
- `src/game/player/Player.jsx`, `player/playerAudio.js`, `combatSystem.js`, `gameplayStore.js`, `bossSystem.js`, `BossEncounter.jsx`, `CombatEnemies.jsx`: real attack, damage, defeat and boss hooks.
- `src/game/cinematics/controller.js`, `kashiEntry.js`, `missionOneEnding.js`, `storyBriefing.js`, and `src/game/pauseSystem.js`: cinematic ownership, cues, pause/resume and disposal.
- `tools/voice-build-policy.mjs`: production exclusion of unapproved catalogue recordings and exact-content aliases.

The manager already has 1,800 ms event and 5,000 ms clip cooldowns. Event selection avoids the previous successful clip when its pool contains alternatives. One catalogue dialogue owns `activePlayback`; a higher-priority catalogue line interrupts a lower-priority one. Runtime rejects unverified catalogue rights while the existing required-rights flag is enabled, which App sets to true. These are **source-confirmed mechanisms**, not new runtime PASS results.

Existing physical public assets found: two catalogue OGG recordings (`bhairava/overdrive-voice.ogg`, `bujji/support-voice.ogg`) and three cinematic WAVs (`phase41-chime.wav`, `kashi-wind.wav`, `kashi-step.wav`). Both OGG entries lack verified distribution-rights metadata and remain ineligible. Their presence is not permission. The public audio README contains outdated descriptions relative to the current inventory; it is not authoritative evidence that all source recordings are absent or approved. It was not changed.

Kashi entry schedules wind, steps and chimes; Mission 1 ending schedules a chime. No dedicated continuous gameplay soundtrack or independent music-bus implementation was found in the inspected source. A cinematic channel named `music` is capability, not proof that music is supplied or playing. No fresh listening, sound-quality or licensing approval of those WAVs is claimed.

The isolated 5H.22 prototype and later staging evidence remain separate from production. Existing Indic Tiny samples have temporary prototype acceptance only; pronunciation, expressive quality and commercial clearance are not promoted here. No physical Android PASS is inferred from desktop/browser emulation.

## Gaps to address in an authorized isolated implementation

1. Legacy `playGameSound()` forwards to dialogue pools; jump, obstacle collision, boss attack and boss damage mappings return `no-match`. The existence of a sound-event name does not establish a distinct SFX asset.
2. Heavy attacks emit generic attack audio. A heavy impact must use the actual `landed` result in Player.jsx, not a key press or the pre-damage narrative text cue.
3. Combo/multi-defeat audio aggregation and an automatic low-health threshold hook were not found in the inspected paths. Any new observer must remain read-only and must not alter combat mechanics.
4. Independent cinematic players do not share one speech owner with catalogue dialogue or the separate synthetic prototype. Starting a cinematic stops catalogue dialogue, but this is not universal prevention of later overlap.
5. Cinematic `play(cue)` accepts a source independently of catalogue rights checks. This is a policy coverage gap, not proof of current unauthorized playback. New assets must not use it to bypass approval.
6. Music/dialogue/SFX currently share master settings. There are no independent user bus gains. No bounded decoded combat-banter cache exists.
7. A failed obsolete asynchronous load can publish a `missing` status after another playback owns the manager; a targeted race test is justified before changing it. This source risk is not a reproduced bug.
8. Build exclusion detects known denied paths and exact raw/base64 copies; it cannot recognize every transcoded or uncatalogued movie extract.

**Architecture decision:** retain the manager and add small, isolated adapters/buses and shared speech ownership in staging if separately approved. A whole-game rewrite is unnecessary. The current architecture does not yet satisfy the complete requested system.

## Proposed event direction

All durations and cooldowns in this section are starting targets, not measured results or authored movie clips.

- **Heavy attack:** short gear/whoosh at a verified attack phase and a 0.1–0.4 s impact only on confirmed contact. The representative test needs only the confirmed-impact cue. Rate-limit multi-target hits from one swing.
- **Combo:** brief musical/percussive acknowledgement and optional dry reaction after a verified sequence. Proposed observer: three landed attacks within three seconds without player damage; this creates no new combo reward or mechanic.
- **Enemy defeat:** one 0.2–0.6 s nonverbal cue per actual alive-to-dead transition. Optional spoken reaction after a safe lull; never announce invented points or money.
- **Multiple defeat:** coalesce two unique defeats within 1.5 s into one optional acknowledgement, replacing rather than stacking single-defeat banter.
- **Player damage:** brief original impact/reaction only after applied damage; suppress repeated pain barks within 1.5 s. Do not react to invulnerable or zero-damage contacts.
- **Low health:** factual warning on crossing an agreed threshold (proposed 35%, re-arm above 45%), with 30 s cooldown. Optional jokes disabled while danger persists; do not imply a health/control state unsupported by the store.
- **Boss entrance/warning:** a concise, intelligible warning and approved entrance accent on the real encounter/attack state. This outranks comedy. Do not invent an attack prediction absent a reliable boss-state signal.
- **Boss defeat:** one restrained sting on confirmed defeat, with optional reaction only after required story speech. Relic collection and mission completion are separate events.
- **Victory/mission completion:** a distinct 1–2 s approved sting on the authoritative completion transition, not on a subtitle or audio end. Speech must use actual completion/rewards.
- **Rare Easter egg:** optional original comic line in a safe lull, proposed 2% eligibility chance, once per mission, at least 120 s between chances. Drop it if the context no longer fits.
- **Movement/interactions/power-ups:** restrained footsteps/interaction acknowledgements and an Overdrive activation cue; do not claim existing jump/activation event names supply these sounds. Avoid footsteps masking combat.
- **Music/atmosphere:** licensed original exploration and combat beds with short fades at real mode transitions. Defer new soundtrack creation; neither a generic channel nor the supplied film is an approved music library.

## Telugu humour and 5H.36 reference use

The existing 5H.36 map contains 12 review pointers, not approved clips: ten dialogue windows and two mixed-transient windows. Exact Telugu words, speaker identity, precise spoken boundaries and humour remain UNVERIFIED. Candidate duration is generally a subtitle window, not a measured utterance. No movie listening or extraction was added here.

Useful reference associations: MEME-REF-01/0335 for heavy-hit confidence, 02/0332 for combo understatement, 03/0355 for defeat swagger, 04/0308 for a context-dependent multi-enemy reaction, 05/0338 for a companion call, 06/0385 for exhaustion, 07/0326 for boss-entry irony, 08/1259 for post-fight attitude and 09/0311 for a rare joke. REF-10/0305 may be a rival speaking and must not be attributed to Bhairava. REF-11/12 are mixed transients, not clean impact assets. An outnumbered line is ineligible once the arena is empty.

Every movie recording remains blocked pending documented permission for the intended interactive/distribution use and embedded material. Local possession and short length are insufficient evidence. No permission or legal exception is established by this audit.

Original alternatives: commission newly written Telugu observations about an overworked weapon, a missed boast, inconvenient timing or a companion's dry correction. Preserve tactical facts; avoid movie wording, reconstructed translations or actor imitation. These are commissioning briefs, not verified Telugu dialogue or available recordings. Existing synthetic recordings are not assumed cleared for commercial distribution. An isolated humorous-audio test still needs an authorized, context-appropriate recording; do not relabel an unrelated calm sample as funny.

## Centralized playback contract

Proposed flow: **verified gameplay outcome → read-only event adapter → approved/context-valid pool → freshness/dedup/cooldown → shared speech reservation → bus playback → cleanup**. Audio is never awaited by mission progression, health, damage, rewards or unlocks.

- One global spoken-dialogue owner, including catalogue, cinematic voice and any separately enabled staging assistant. Critical story speech > boss/tactical warning > urgent assistance > calm assistance > optional banter > Easter egg. A joke about a boss does not inherit boss-warning priority.
- A boss warning immediately cancels optional speech, without delayed queue replay. Optional speech drops if critical ownership is unknown. No unbounded queue. Existing cinematic timing, skip and completion contracts remain authoritative.
- Rights and context filtering before random selection or fetch; one recent-history ring, no immediate repeat, silence valid when every candidate is excluded. Start with a 20 s global banter gap and event-specific 18–90 s gaps; tune by listening, not event count.
- Independent Music, Dialogue and SFX gains below the existing master mute/volume; ambience follows Music initially to avoid extra scope. Optional-banter toggle affects only jokes. Existing saved master settings remain valid; no campaign-save migration.
- Proposed dialogue ducking: music down approximately 6 dB, 50 ms attack/250 ms release. Never duck critical impact information into silence. These values require listening validation; absolute mix balance is not measured here.
- Pause suspends important speech under existing lifecycle; transient banter cancels and does not resume stale. Restart/exit/game-over invalidate the encounter token, stop old sources and release ownership. Cinematics cancel banter before their first line. Backgrounding cancels optional speech and requires safe gesture recovery where needed.
- Preserve visible Skip/captions and appropriate Replay. Replay is narration-only and cannot repeat rewards/objectives. Muting, missing/corrupt media, denied autoplay or loading failure leaves text/gameplay usable. No retry loops during combat.
- Initialize on actual pointer/key/touch interaction, inspect resume outcome, do not assume desktop success proves Android behavior. Browser emulation and physical-device results remain separate.

## Performance safeguards

Use a tiny approved asset allowlist, prepare/decode outside active combat, cap simultaneous SFX voices (proposed eight), drop expired optional requests and avoid frame-by-frame React/audio-object allocation. Initial optional dialogue allowance: six clips × three seconds × 24,000 samples/s × four bytes ≈ 1.73 MB mono PCM; allow 4 MiB with overhead, measure actual use. This is a budget estimate, not a benchmark. No full movie loading, runtime extraction or source separation.

No resolution, shadows, enemy AI, physics, difficulty or mission logic changes are proposed. Historical rendering/transition hitches are not attributed to audio without new evidence.
