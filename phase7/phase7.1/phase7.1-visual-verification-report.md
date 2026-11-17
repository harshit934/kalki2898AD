# Phase 7.1 visual and gameplay verification

16 November 2026 (Asia/Calcutta). **Final decision: FAIL for full cinematic visual acceptance.** The functional opening and follow-on controls work; multi-second browser/main-thread interruptions fail the smoothness/no-freeze requirements. Existing partial delivery remains available and unchanged.

## Actual execution

Used the requested `phase7/phase7.1/serve.mjs` and its existing compiled build, with one loopback server, one headed Chrome 157 session/tab and a fresh disposable profile at 960×540/DPR1. No cinematic rebuild, diagnostic-module rebuild, gameplay setters or seeded completion. All scenarios used actual menu/buttons/keyboard. Passive browser rAF and long-task observations were injected by the test harness, not production/staging source.

Preflight: 849,608,704 bytes available physical RAM; 4,500,398,080 bytes commit headroom. No fixed 2 GB gate. Memory was sampled continuously. During the completed session available RAM ranged from 378,400,768 to 1,166,782,464 bytes; minimum commit headroom 2,092,507,136 bytes. No pressure safeguard fired, browser crashed or uncaught page error was recorded. No unrelated process terminated.

## Fourteen checks

1. **PASS — New Game:** actual NEW GAME → START MISSION 01 automatically started the opening in a fresh profile.
2. **PASS — establishing shot:** broad city/riverfront view captured and inspected.
3. **PASS — character reveal:** full character tracked within the scene, visible and unobstructed in inspected frames.
4. **PASS — close-up:** face, torso and weapon visible in actual close-up captures.
5. **PASS — rear framing:** rear/over-shoulder and wider rear frames captured before handoff.
6. **FAIL — smooth presentation:** 2,275.4 ms and 3,683.8 ms browser frame-callback gaps occurred with the cinematic overlay active. Pose snapping is not independently established; the observed interruptions alone prevent a smoothness PASS.
7. **BLOCKED — continuous no-clipping coverage:** no obvious character/building/terrain camera intersections in inspected stills. No continuous video or full camera-pose/collider trace was captured, so a full-path no-clipping guarantee remains unverified.
8. **PASS — natural completion into free roam:** completed without Skip, acknowledged the opening and entered saved exploration phase `roam`. No mission completion/reward fabricated. This verifies natural arrival, not perfectly smooth camera motion throughout the handoff.
9. **PASS — movement after transition:** ordinary W input moved the player from approximately (0, −0.22, 8) to (0.0009, −0.22, 4.2001), recorded by the existing exploration persistence. Input was accepted after the natural handoff without reload/recovery.
10. **PASS — third-person camera controls:** Rotate camera right changed saved yaw from 0 to 0.392699 radians, and the rendered view changed. Reset view was exercised afterward.
11. **PASS — Skip:** replayed cinematic was skipped through its real button; returned to free roam, persisted `reason: skipped`, campaign record unchanged.
12. **PASS — Replay:** existing Settings replay action followed by Continue started the opening again without resetting campaign data.
13. **PASS — refresh/return:** reloaded the same disposable origin, used Continue, reached free roam with no opening overlay, campaign record unchanged.
14. **FAIL — no black/frozen/jump problems:** no black screenshots or unhandled errors observed, but confirmed multi-second callback interruptions prevent a no-freeze PASS. An independent camera-jump defect was not proven.

Result: **11 PASS, 2 FAIL, 1 BLOCKED** across the fourteen requested checks. Fresh integrity adds five separately labelled PASS rows in the CSV. Still captures are visual evidence, not proof of every intervening frame.

## Performance and failure evidence

The configured sequence is 28 cinematic seconds; this cold run took 40.045 wall seconds from opening detection to the free-roam check, including readiness/initialization and handoff. This difference is not attributed solely to any one subsystem.

Passive rAF intervals while the `natural-opening` stage and cinematic overlay were active: 3,208 samples, median 7.0 ms, p95 20.7 ms, p99 27.8 ms, maximum **3,683.8 ms**. These are browser callback intervals, **not rendered game-frame or GPU timings**; no average-FPS or stable-30-FPS claim follows.

Strongest evidence:

- Browser time 7,935.1 ms: preceding rAF gap 2,275.4 ms; recorded long task started at 5,694.4 ms and lasted 2,245 ms.
- Browser time 19,777.4 ms: preceding rAF gap 3,683.8 ms; recorded long task started at 16,093.8 ms and lasted 3,688 ms.
- Replay/menu transition also recorded a 5,473.7 ms callback gap with no cinematic overlay, and 2,178.2 ms during replay with the overlay active. All >100 ms captured gaps are preserved in `performance-observations.json`, rather than hidden by percentiles.

Times above are document-relative monotonic browser timestamps. Memory journal UTC timestamps remain unchanged; this run occurred around 00:03–00:05 IST on 16 November. No document-backgrounding events were recorded.

**Confirmed:** long main-thread tasks and callback interruptions. **Unresolved:** responsible operation/call stack, contribution of initialization, shader/renderer work, paging or scheduling. Some early capture shows the intended loading/readiness screen; the overlay being present does not alone distinguish asset readiness from active animation. At least the later city presentation is interrupted, so blanket smoothness approval is unsupported.

No fix was applied: the capture lacks operation attribution needed for a safe targeted correction. Changing camera paths, geometry or quality would be speculative. The allowed focused source-fix/retest cycle was not used; the task stops with the exact defect documented rather than starting a broad investigation or another milestone.

## Actual screenshots

All filenames are elapsed **wall-time** snapshots, not exact authored keyframe times. Evidence directory: `visual-verification/20261116-000322/`.

- [Establishing view](<C:/Users/Hp/Downloads/kalki 2898AD/phase7/phase7.1/visual-verification/20261116-000322/cinematic-016s.png>)
- [Character reveal](<C:/Users/Hp/Downloads/kalki 2898AD/phase7/phase7.1/visual-verification/20261116-000322/cinematic-020s.png>)
- [Close-up](<C:/Users/Hp/Downloads/kalki 2898AD/phase7/phase7.1/visual-verification/20261116-000322/cinematic-028s.png>)
- [Rear framing](<C:/Users/Hp/Downloads/kalki 2898AD/phase7/phase7.1/visual-verification/20261116-000322/cinematic-036s.png>)
- [Free-roam camera rotation](<C:/Users/Hp/Downloads/kalki 2898AD/phase7/phase7.1/visual-verification/20261116-000322/free-roam-rotated.png>)
- Additional files show replay, post-Skip and returning free roam. Sixteen actual screenshots were captured.

The character remains readable in the inspected reveal/close-up/rear compositions. Sparse distant scenery, repeated façade masses and the visible mission-hub label remain inherited presentation limitations. No replacement assets or world redesign attempted; no AAA/complete visual-quality approval inferred.

## Integrity, rollback and cleanup

Fresh hashes: **47/47 protected assets, 153/153 production source/config, 171/171 Phase 6 baseline, 171/171 Phase 7.1 rollback and 173/173 current Phase 7.1 source files unchanged**. Personal profiles/saves not accessed. Only disposable test-origin records changed during gameplay. No production/audio/mission/progression code modified, downloads, paid services or new assets.

New files only: visual test harness, passive observations, screenshots, memory/results/integrity JSONs, CSV builder and requested reports under this isolated Phase 7.1 directory. Existing partial-delivery build and previous reports/evidence preserved. No build/lint rerun needed: no implementation changes; their prior passing results remain historical evidence only.

Owned Chrome PID 24288 verified absent; owned visual runner count and serve.mjs process count both zero. Server/browser/monitor closed. No Phase 7.2 begun.

**Final: FAIL for full visual acceptance; functional partial delivery retained.** The targeted remaining blocker is repeatable interruption attribution/correction, plus continuous clipping/handoff verification—not rebuilding the cinematic.
