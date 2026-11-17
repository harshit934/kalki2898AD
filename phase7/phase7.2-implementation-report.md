# Phase 7.2 cinematic free-roam camera

16 November 2026 (Asia/Calcutta). **Final recommendation: CONDITIONAL PASS for the isolated prototype.** Camera/movement integration and the focused responsive correction passed actual browser checks. Stable performance, physical-device behavior and exhaustive clipping coverage remain unverified.

## Baseline and implementation

New staging: `phase7/phase7.2/staging/`; untouched baseline rollback: `phase7/phase7.2/rollback/`. Copied the conditionally accepted **original Phase 7.1** source, not its rejected shader-preparation candidate. All sixteen cinematic source files remain byte-identical, preserving the four-shot opening and its acceptance status. Phase 6 audio/voice files remain identical.

The previously supplied free-roam videos have no available local paths. The user explicitly authorized proceeding against the written requirements. No exact video-match claim is made, and the separate opening reference was not substituted.

New `game/exploration/freeRoamCamera.js` is a presentation-only rig. It reads movement/view/location information and never writes player inputs, campaign data or manual camera yaw. It adds:

- Eased walk/run distance and height changes with bounded turn lead (~10 degrees).
- Gradual idle wide-city framing after a delay, without entering a cinematic or holding controls.
- Bounded movement anticipation and existing-hub focus while keeping the character dominant.
- Three-second manual-view priority after yaw/pitch changes; no automatic recenter spin or input-axis rotation.
- Portrait-aware distance/lead bounds and frame-rate-independent damping.

`player/Player.jsx` integrates that rig **only during exploration**, keeps camera-relative movement based on manual yaw, rotates existing collision escape candidates with the current exploration view, and reuses the existing volume-clearance/smoothed-path checks. Normal mission camera branches and combat tuning remain. Walk/sprint/jump constants unchanged; sprint unlimited. No camera shake added, FOV animation, authored free-roam cutscene, replacement environment or forced mission trigger.

Inspection found dodge disabled in the old exploration mode. The new copy reuses the existing grounded dodge action, speed, timing/cooldown and animation for exploration; it does not add combat invulnerability there. The existing mobile Dodge button is enabled in exploration. Attack/Overdrive remain disabled there, as before. Combat dodge behavior is preserved.

No environment, lights, materials or character asset edits. The same bounded district and mission marker remain; this is not an open-world expansion.

## Files changed and correction cycle

Four new/modified staging paths:

- `src/game/exploration/freeRoamCamera.js` — new rig and rotated camera-offset helper.
- `src/game/player/Player.jsx` — exploration presentation integration and reuse of existing dodge.
- `src/game/player/MobileControls.jsx` — existing Dodge action available during exploration.
- `src/game/exploration/exploration.css` — focused portrait hint/landscape touch correction.

Initial browser gameplay assertions all passed, but screenshot review found two layout defects: portrait hint covered action labels; landscape width breakpoint hid touch controls. Preserved the tested working source in `pre-responsive-fix/`, then used the **one focused fix/retest** for exploration-only CSS: move the portrait hint above controls and show exploration controls for coarse-pointer screens up to 1000 px. The five focused browser checks passed. Original screenshots/defects remain documented in the CSV; no repeated full gameplay cycle.

A duplicate helper in the initial test script caused a syntax failure before any browser launched; corrected test tooling and preserved its previous version. It was not a gameplay failure.

## Executed validation

- **78 automated checks PASS:** ten new camera-rig checks plus 68 existing camera/opening/exploration/audio checks. They cover bounded smoothing, manual priority, read-only inputs, portrait framing, idle widening, rotated clearance candidates and persistence/legacy audio behavior. They do not establish visual acceptance alone.
- **14 actual browser gameplay checks PASS:** opening launch/Skip; no distant/forced mission start; walk/sprint; turning; jump; dodge; idle wide framing; manual orbit; bounded obstacle/boundary path; portrait Dodge/joystick; landscape overflow; hub launches Mission 1; no uncaught page error.
- **Five focused browser retest checks PASS:** portrait accessible controls/no hint overlap, touch Jump, landscape visible controls, touch movement and no new error.
- Build PASS and final lint PASS: zero errors, **nine existing warnings**, no new warning. Existing large-chunk warning remains.

Browser: one fresh Chrome 157 context/tab and one loopback server at a time, two sequential sessions for the initial test and authorized focused retest. Desktop 960×540, portrait 430×932 and landscape 932×430. Mobile checks are **browser emulation, not physical-device validation**. Test builds expose read-only camera/player observations; no store setters, teleport, forced health/completion or personal profiles used.

Walking moved 2.25 units and sprint 4.44 over the tested intervals. Jump and faster dodge displacement were observed. Idle camera-to-character distance grew from 5.63 to 6.53 units under actual collision constraints. Manual camera remained available, the subject stayed in the inspected frames, and the original hub started Mission 1 only after interaction. This is not a complete Mission 1/boss regression or fresh browser-restart save test.

## Performance and limitations

Ready exploration window (after initial ready snapshot, before hub launch): **836 browser rAF intervals**, median 34.8 ms, p95 90.1 ms, p99 222 ms, maximum **1,116.9 ms**. Three gaps exceeded one second: 1,096.0, 1,005.9 and 1,116.9 ms. Every >100 ms gap is retained in `performance-ready-window.json`.

Earlier startup/Skip readiness includes a 2,296.4 ms overlay-visible gap; all-stage maximum is **12,730 ms** during mission-transition/loading, outside the exploration window. These are callback intervals, not GPU or rendered-frame timings. Do not infer FPS or stable 30 FPS. Root cause and whether these are regressions versus the baseline are not established by this unmatched functional run; no speculative performance change or broad investigation performed.

Resource monitoring did not abort either session. Minimum available RAM: 337,268,736 bytes initial, 212,701,184 bytes retest. Commit headroom stayed above approximately 2.01 GiB. Frame/initialization hitches remain a material acceptance limitation, not hidden behind averages.

## Preservation and delivery

Fresh hashes: **47/47 protected**, **153/153 production**, **173/173 accepted Phase 7.1 baseline**, **173/173 new rollback**, **174/174 pre-responsive backup**, **171/171 Phase 6 baseline**, **16/16 cinematic files** and **16/16 audio/voice files** match. Exact changes/hashes: `phase7.2/integrity-results.json`. No personal saves accessed; save schema, unlocks/rewards and existing audio logic unchanged.

Launch for isolated review:

```powershell
cd 'C:\Users\Hp\Downloads\kalki 2898AD'
node phase7/phase7.2/serve.mjs
```

Use the printed loopback URL in a disposable profile, NEW GAME → START MISSION 01; stop with Ctrl+C. No production merge authorized. Both owned browser PIDs and runner processes were verified stopped; servers/monitors closed. **Stop after Phase 7.2; no Phase 7.3 started.**
