# Phase 5.3.1 corrective development

Recorded 2026-11-12T13:19:52.177Z. Recommendation: **FAIL — do not close Phase 5.3**. This bounded validation pass is finished when the linked capture/build/hash records are final; it is not a claim that the milestone passed. Phase 5.4 was not started.

## Implemented corrections

- Kept boss meshes and gameplay point-light slots mounted, reduced dormant intensity instead of changing light counts, and warmed boss materials against the live scene after the actual player model is ready. Intro duration now advances with capped simulation time rather than expiring behind a blocked frame.
- Staged the boss camera during introduction; chose the nearest unobstructed escape direction and widened encounter framing. No player teleport or scene reload workaround.
- Waited for the first decoded video frame before making the cinematic video opaque; retained gameplay behind a transparent loading layer, pause/skip, and error Continue.
- Added smooth instanced textured rubble, world-space surface weathering, original distant riverbank/ghat geometry and small costume detail. Protected character/groom geometry was not replaced.

All production edits preceded the saved handoff. The resumed pass made no production source changes. Exact changed paths/hashes: [manifest](phase531-changes-and-hashes.json). Original reports and failed captures remain preserved.

## Investigation conclusions

The supplied recording depicts Mission 2. Preserved-source reproduction recorded 15152.4 ms intro and 14475.9 ms defeat render calls with synchronous shader-program queries after light-count changes. Movement input and active game-clock state were present: those captured interruptions were rendering stalls, not an established AI or movement deadlock. Camera obstruction was a separate reproduced failure. The old video overlay could cover the game before a decoded frame existed.

A corrected diagnostic Mission 2 run reduced maximum intro render call to 108.7 ms. Three final ordinary-WebGL Mission 2 runs completed natural endings. This does **not** establish stable performance: the Mission 1 replay diagnostic still recorded a 3049.1 ms ending render call including a 634.0 ms bufferData call. Its precise resource/driver blocking chain remains unknown; screenshots and GL wrappers confound whole-run cadence. The screenshot-free replay died before the ending, so it cannot clear this blocker.

## Validation and limits

- Completed saved Mission 1 replay with original reward values unchanged after reload; Mission 1 emulated-touch full encounter passed. Separate retries that ended in player defeat remain failures.
- Three Mission 2 keyboard boss/defeat/natural-video/reload runs passed; emulated-touch route failed to complete all pylons. The bot used activated-count rather than missing-pylon identity; this is a verified automation defect, not proof of a gameplay lock. Any corrected route result is separately recorded.
- All eight Missions 3–10 independently passed basic keyboard smoke checks. Full completion/rewards/endings are not certified.
- All HUD modes, relay scan, pause/settings and unobstructed screen-centre checks passed desktop/portrait. Native 1080p opening screenshots record actual drawing buffer, CSS size and DPR.
- Bujji duel/chase and restoration checks passed both layouts through their first handoff; the portrait post-reload contract replay timed out. This is unresolved unless the separately labelled follow-up establishes the guard/state involved.
- Build/lint and all 47 protected results are in the manifest; tests do not modify real browser saves.

## Performance

Primary 720p controlled windows:

- m1-exploration-1: 29.7 FPS; p50 34.3, p95 38.9, p99 45.2, max 185.5 ms; 895 intervals; leading/trailing boundaries 11.1/13.2 ms.
- m1-combat-1: 28.9 FPS; p50 34.5, p95 37.7, p99 51.9, max 697.8 ms; 869 intervals; leading/trailing boundaries 27.6/22.7 ms.
- m1-exploration-2: 25.5 FPS; p50 34.5, p95 47.4, p99 116.1, max 1538.0 ms; 765 intervals; leading/trailing boundaries 26.0/31.2 ms.
- m1-combat-2: 15.8 FPS; p50 34.6, p95 155.8, p99 923.3, max 2965.8 ms; 474 intervals; leading/trailing boundaries 4.8/18.0 ms.
- m1-exploration-3: 27.1 FPS; p50 34.5, p95 41.9, p99 159.8, max 352.0 ms; 813 intervals; leading/trailing boundaries 29.2/11.9 ms.
- m1-combat-3: 22.0 FPS; p50 34.4, p95 39.8, p99 464.3, max 3381.1 ms; 662 intervals; leading/trailing boundaries 6.2/11.5 ms.

Separate 1080p windows:

- m1-exploration-1: 26.7 FPS; p50 34.5, p95 41.7, p99 209.7, max 739.5 ms; 799 intervals; leading/trailing boundaries 11.1/36.9 ms.
- m1-combat-1: 29.8 FPS; p50 34.5, p95 38.6, p99 51.7, max 103.2 ms; 895 intervals; leading/trailing boundaries 17.1/7.5 ms.

[Raw performance and limitations](phase531-performance-results.json). Baseline Phase 5.3 after-combat: 29.96 FPS, p95 40.6, p99 47.5, max 75.5 ms. Current captures are on a later source/build and different system conditions; this is not a controlled A/B causal estimate. Severe stalls are not hidden by averages.

## Smallest next action

Keep Phase 5.3 open and request approval for only a short, scoped main-frame stage-span/resource-owner capture around the remaining >100 ms gaps. Current clean traces separate render-call duration from render-to-render gaps but do not name the operation filling the gap. Do not choose a speculative repair. Inspect ending upload ownership separately only if that stall is reproduced. This is a recommendation, not an automatically launched investigation or new phase.

## Clean-capture stall distinction

The screenshot-free controlled windows recorded a worst render-to-render gap of 3381.1 ms. See `controlledGapEvidence` in the performance JSON for each gap and the preceding/following synchronous render duration. A long gap outside the synchronous render call is not proof of shader compilation, GPU execution, collision lock or AI deadlock. The unmeasured interval remains unattributed. Multiple-attacker and boss/transition matched performance coverage is incomplete; no complete performance acceptance is claimed.

## Targeted follow-up disposition

Corrected missing-pylon touch route: mission-2-mobile PASS. See the closure runner for any timeout. Completed-contract replay UI fixture: INCOMPLETE/FAIL; inspect per-layout evidence. Original failed runs remain retained. These follow-ups do not clear the performance blocker.

## Contract-intro timeout evidence

The isolated completed-contract replay fixture timed out after 20 seconds in both layouts: sequence `intro`, cinematic `playing`, desktop cinematic time approximately 0.2664 s and portrait approximately 0.1 s. `readyActors` contained Bhairava; the config requires exactly that one actor. Therefore an actor-readiness deadlock is **not established**. No synchronized frame/GL-stage trace was recorded in this fixture, so the operation delaying advancement is unknown. The first full duel/chase/handoff passed both layouts; the replay-intro timeout remains a separate failed test. Manual intro skip was not exercised after these timeouts, so this evidence does not prove an unrecoverable lock. No speculative cinematic source change was made.
