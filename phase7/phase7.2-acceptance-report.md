# Phase 7.2 acceptance

16 November 2026 (Asia/Calcutta). **CONDITIONAL PASS.** The isolated cinematic free-roam camera is playable and passed the executed controls/framing tests. This does not grant production integration or stable-performance approval.

## Accepted scope

- Actual keyboard walk/sprint, turning, jump and grounded dodge remain usable while the camera follows. No stamina introduced.
- Dynamic movement framing, idle city-wide framing, manual orbit/reset and bounded location/turn lead work without taking control of player input or starting missions.
- The existing obstacle clearance and district boundary route kept the subject visible in inspected samples. No obvious camera-through-building/character intersection in those frames; full-district continuous no-clipping/no-snap coverage remains unverified.
- Portrait touch Dodge/joystick and Jump passed; landscape touch movement passed after the responsive fix. Action controls were visible, within the viewport and topmost at their centers in the focused retest.
- Mission 1 marker remained accessible; distant interaction did not start the mission. Actual nearby Interact launched existing Mission 1 with progression unchanged before launch.
- Opening launch and Skip passed in the new copy; all accepted Phase 7.1 cinematic source hashes remain unchanged. Full opening/Replay/refresh were not unnecessarily repeated in Phase 7.2; earlier Phase 7.1 results retain their original scope.

Evidence: `phase7.2/browser-evaluation/attempt-1794770399609/results.json` (14 checks) and `attempt-1794770668465/results.json` (five focused checks). **78 automated checks, build and lint passed**, with nine existing warnings. Initial portrait hint overlap and hidden landscape controls are retained as historical visual failures; their focused retests passed.

## Actual visual evidence

- [Desktop follow](<C:/Users/Hp/Downloads/kalki 2898AD/phase7/phase7.2/browser-evaluation/attempt-1794770399609/follow-desktop.png>)
- [Idle city framing](<C:/Users/Hp/Downloads/kalki 2898AD/phase7/phase7.2/browser-evaluation/attempt-1794770399609/city-wide-desktop.png>)
- [Obstacle-side orbit](<C:/Users/Hp/Downloads/kalki 2898AD/phase7/phase7.2/browser-evaluation/attempt-1794770399609/obstacle-orbit.png>)
- [Corrected portrait controls](<C:/Users/Hp/Downloads/kalki 2898AD/phase7/phase7.2/browser-evaluation/attempt-1794770668465/portrait-controls-fixed.png>)
- [Corrected landscape controls](<C:/Users/Hp/Downloads/kalki 2898AD/phase7/phase7.2/browser-evaluation/attempt-1794770668465/landscape-controls-fixed.png>)

Inspected images support clearer character/city composition without new assets. The existing world remains sparse/repetitive at distance; this milestone does not claim an environment upgrade, film/AAA quality or an exact match to unavailable reference videos. The user authorized proceeding with written requirements.

## Conditions and remaining checks

1. **Performance is not fully accepted.** Ready exploration rAF median/p95/p99/max: **34.8 / 90.1 / 222 / 1,116.9 ms**. Three ready-window gaps exceeded one second. The separate mission-transition/loading maximum was **12,730 ms**. No rendered-FPS, GPU-timing or stable-30-FPS claim; no attribution of these gaps to user interruption. Their source and regression status remain unresolved. All gap records are retained, not dismissed as harmless.
2. Physical Android/mobile testing remains UNVERIFIED; desktop touch emulation cannot establish real-device behavior/performance.
3. Exhaustive camera collision/clipping, every district corner and long-duration turning remain UNVERIFIED beyond the executed route and inspected images. Camera math tests do not substitute for those observations.
4. No exact reference-video comparison, full mission-completion/boss regression or fresh browser-restart persistence test in this milestone. Source/store preservation and existing automated persistence checks are supporting evidence only.

The single focused correction cycle was used for exploration control layout and passed. No further investigation/correction cycle started. Preserve this candidate for review; do not merge into production or claim the listed limitations resolved.

## Integrity and stop

**47/47 protected hashes match**; production 153/153, accepted Phase 7.1 173/173, rollback 173/173, pre-fix backup 174/174 and Phase 6 baseline 171/171 unchanged. All 16 cinematic and 16 audio/voice files match the baseline. No production/personal saves or protected assets modified.

Browser/server/monitor cleanup recorded, both exact Chrome PIDs absent and owned runners zero. **Final decision: CONDITIONAL PASS for isolated prototype review. No Phase 7.3 begun.**
