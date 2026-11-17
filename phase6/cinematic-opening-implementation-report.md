# New-campaign opening — isolated implementation report

15 November 2026. **PASS for isolated functional implementation and the executed tests. Visual review/production approval remain pending. No merge into production.**

## Implementation and location

New copy: `phase6/cinematic-opening-staging/staging/`. Its untouched pre-edit copy is `phase6/cinematic-opening-staging/rollback/`. It starts from the completed 5H.40 staging work and preserves earlier audio integration, original production environment/defaults and opt-in Kashi separation.

The new sequence uses the existing Three.js/React Three Fiber cinematic director, current world, Bhairava rig, costume, weapon and existing animation clips. No environment/character replacement, new model, movie footage or protected asset edit. Current world lighting, shadows and atmosphere remain active. No expensive post-processing was added.

Configuration: [campaignOpening.js](<C:/Users/Hp/Downloads/kalki 2898AD/phase6/cinematic-opening-staging/staging/src/game/cinematics/campaignOpening.js>), with a machine-readable copy at [camera-sequence.json](<C:/Users/Hp/Downloads/kalki 2898AD/phase6/cinematic-opening-staging/camera-sequence.json>).

Nominal authored timeline:

1. 0–5 s: elevated wide city view, gently advancing toward the street.
2. 5–10 s: continuous descent/travel into the existing environment.
3. 10–15 s: protagonist reveal while the existing walk blends to guard idle.
4. 15–19 s: closer three-quarter character framing with a narrower field of view.
5. 19–28 s: continuous orbit toward the rear gameplay position, followed by the existing 1.4 s camera return blend.

Seven authored camera keys, no hard cuts. Existing smoothstep position/FOV interpolation and quaternion slerp are reused. The new config retains its staged protagonist during return, avoiding an empty-player interval while the existing director hands back ownership. Other cinematic configurations keep their previous return behavior.

Twenty-eight seconds is simulation-timeline duration, not a guaranteed wall-clock runtime on this machine. Loading and existing frame interruptions can extend elapsed time. This task does not establish stable 30 FPS or resolve the world's historical performance issues.

## First-launch and replay behavior

The presentation-only key is `kalki-campaign-opening-staging-v1`. It is separate from campaign saves and rewards. Only natural `completed` or explicit `skipped` results write acknowledgement. Exit, actor error, unmount and other interrupted reasons do not fabricate completion. Browser refresh during an unacknowledged introduction leaves it eligible for the next launch; no permanent control lock is stored.

Fresh Mission1 profiles with no completion history or prior introduction acknowledgement get the opening on their first launch. Subsequent launches go directly to gameplay. Existing legacy intro-seen profiles or completed campaigns are not forced through a new introduction. No personal profile was inspected or migrated.

The existing game's NEW GAME action actually replays Mission1 while preserving progress. This work does not introduce destructive campaign reset, multiple save slots or a new campaign schema. First-launch gating applies to a fresh campaign's initial Mission1 entry, regardless of which existing launch button is used.

Settings now offers **REPLAY OPENING ON NEXT MISSION 1 LAUNCH**. It queues one in-memory explicit replay, keeps campaign progress and returns through the normal launch path. It does not switch missions or reset saves. A refresh before using that queue discards the replay request; durable completion acknowledgement remains. Existing Skip Cinematic and pause controls are reused.

If browser storage is unavailable, acknowledgement survives only in the current page. Unit tests verify that this fallback does not falsely report a durable write. Cross-refresh persistence cannot be promised when storage is disabled.

## Audio

Reserved `audioIntegration` theme/entrance-dialogue fields remain null and rights-blocked. They document future integration points; no movie recording is loaded or enabled from them. Existing original ambience/chime and inherited isolated audio-test behavior remain. Existing Telugu subtitle wording is reused without new linguistic approval. No movie extraction, TTS generation, purchases or licence changes.

## Executed validation

Final evidence: `phase6/cinematic-opening-staging/attempt-1794756587980/raw-results.json`.

**11/11 actual-browser checks PASS**, Chrome 157.0.8103.51, disposable contexts:

- Fresh campaign launch enters the opening and holds gameplay input.
- Natural completion persists acknowledgement and releases the cinematic hold.
- City/reveal/close-up/rear shots captured; camera samples recorded.
- Staged actor remains mounted through return; sampled final return → first idle camera displacement **0.002388 m**. This is an endpoint continuity observation, not proof of flawless motion at every frame.
- Normal keyboard movement works after natural handoff.
- Reload preserves the actual campaign record and returning launch skips the introduction.
- Settings triggers an explicit replay without resetting campaign progress.
- Skip persists acknowledgement and returns control without changing the campaign record.
- Refresh midway leaves no false completion; next launch recovers the introduction.
- Recovered playback can be skipped and releases camera/input ownership.
- No uncaught browser errors in the final run.

**10/10 persistence/configuration unit checks PASS**, separately labelled from browser evidence. They cover completion/skip, interrupted/error reasons, legacy/returning state, one-shot replay, corrupt/unavailable storage and camera/audio-slot configuration.

Staging build and lint PASS; zero lint errors, the same nine pre-existing warnings in unchanged files, and existing large-chunk build warning. Actual primary drawing buffer and CSS canvas were both **1920×1080**. This verifies output dimensions for the tested session, not cinematic art quality or sustained rendering performance. The recovery context used 1280×800; no mobile/physical-device acceptance claimed.

Consolidated results: [cinematic-opening-test-results.json](<C:/Users/Hp/Downloads/kalki 2898AD/phase6/cinematic-opening-test-results.json>).

## Earlier attempts, preserved

Three unsuccessful diagnostic attempts remain intact. The first completed naturally and verified movement but lacked camera telemetry, then timed out on an observer-dependent check. The second had a test-server camera-transform syntax error. The third captured camera telemetry but compared return position against normal gameplay follow movement approximately half a second later; that assertion failed. The final test compares actual handoff samples. The optional actor-retention change separately addresses the existing director's return visibility behavior; it is not claimed as the cause of the earlier measurement assertion.

None of these attempts is relabelled a full pass. Their JSONs/screenshots and the final successful run are preserved. No general gameplay camera, combat or rendering rewrite was applied.

## Actual game screenshots

These are unedited browser captures from the final staging run, not concept renders:

- [City establishing view](<C:/Users/Hp/Downloads/kalki 2898AD/phase6/cinematic-opening-staging/attempt-1794756587980/city.png>)
- [Character reveal](<C:/Users/Hp/Downloads/kalki 2898AD/phase6/cinematic-opening-staging/attempt-1794756587980/reveal.png>)
- [Character close-up](<C:/Users/Hp/Downloads/kalki 2898AD/phase6/cinematic-opening-staging/attempt-1794756587980/closeup.png>)
- [Rear-camera approach](<C:/Users/Hp/Downloads/kalki 2898AD/phase6/cinematic-opening-staging/attempt-1794756587980/handoff.png>)
- [Actor retained during return](<C:/Users/Hp/Downloads/kalki 2898AD/phase6/cinematic-opening-staging/attempt-1794756587980/returning.png>)

Visual limitations remain: repetitive architecture/materials, sparse distant scenery, abrupt outside-world/water boundaries, and existing enemy/character presentation limitations visible in the frozen world. These are not concealed or declared fixed by the camera work. No AAA/cinematic visual acceptance is claimed without user review.

## Changed staging files and integrity

New: `src/game/cinematics/campaignOpening.js`, `campaignOpeningState.js`.

Modified only in this new staging copy: `src/App.jsx` (gating/completion callback), `src/game/SettingsPanel.jsx` (replay setting), `src/game/cinematics/CinematicStage.jsx` (opt-in actor retention during return), `src/game/GameCanvas.jsx` (development-only read-only camera observer, excluded from production-mode observation). No player input, movement, combat, reward, unlock or campaign-store implementation changed relative to 5H.40.

Fresh integrity: **47/47 protected hashes**, **153/153 production source/config**, **157/157 new rollback files**, **808/808 prior 5H.38–40 files**, and **1,135/1,135 older bounded evidence files** match. Exact before/after hashes are in `phase6/cinematic-opening-staging/integrity-results.json`. No audio file created or copied. Personal saves were not accessed; this is not independent certification of their contents.

## Review and stop

For optional review, from the project root run `node phase6/cinematic-opening-staging/launch.mjs`, open its printed localhost URL in a disposable browser profile, then stop that owned server with Ctrl+C. It is not launched automatically. Production remains unchanged.

No complete mission/boss-defeat/reward regression or mobile/performance acceptance is claimed in this cinematic task. All owned browser/server/test processes have exited. The implementation is ready for isolated visual review; no production merge, new phase or additional implementation begins automatically.
