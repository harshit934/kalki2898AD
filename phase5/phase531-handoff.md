# Phase 5.3.1 safe development handoff — 12 November 2026

Status: INCOMPLETE. Development and tests are stopped at the user's request.
Phase 5.3 remains open. Phase 5.4 has not started. Wait for user confirmation
before resuming any development, server or test.

## Saved work and preservation

All ten production source changes are saved on disk. Their SHA-256 hashes,
initial/current differences, asset hashes, test summaries and protection checks
are recorded in `phase531-evidence/handoff-state.json`. No source file is empty.
The pre-edit source copy and initial hashes remain in
`phase531-evidence/source-before/` and `initial-state.json`.

Fresh handoff verification: 47/47 protected files match expected hashes.
All five original Phase 5.3 deliverables match their pre-edit hashes. Existing
screenshots, logs, reports, rollback assets and all diagnostic iterations were
preserved. No project files were deleted to recover storage.

A parent Git worktree exists at C:/Users/Hp, but this project has zero tracked
files in it. The initial local .git-only probe was insufficient; the corrected
project-scoped inspection is in `git-state.json`. No Git/index writes, staging,
commits or parent-repository changes were performed. These changes are local
saved files, not a Git commit.

## Fixes implemented, subject to remaining validation

- Boss model lights stay mounted with zero intensity when inactive; a reserved
  relic light and Mission 2 projectile light avoid changing scene light counts.
  Hidden boss materials are warmed asynchronously against gameplay lighting.
  Active lighting colors, positions and intensities are retained.
- Boss introduction timing uses presented, capped simulation delta. A long
  blocked render no longer consumes the whole introduction before camera/actor
  poses have had time to move.
- Mission 1/2 camera staging moves smoothly toward a clear side during the
  introduction. Candidate selection prefers continuity rather than a brief
  overhead detour. Boss framing is wider and focuses between player and boss.
  No player teleport or forced scene reload was introduced.
- The existing ending-video overlay waits for a decoded frame and shows an
  explicit preparing/unavailable state over the game instead of an empty black
  panel. Native playback, pause, ending and skip behavior remain in use.
- Mission 1 rubble uses smooth, irregular instanced stone geometry and existing
  licensed surface maps. Original opposite-bank terrain, ghats and architecture
  were added; river coverage was extended. Distant geometry does not cast shadows.
  Stone weathering and batched costume fasteners improve surface presentation.
  Protected character/groom files were not replaced or modified.

New environment asset: `public/environment/mission531/riverbank-v1.glb`.
Generator, editable Blender source, geometry statistics and credits are retained.
The new bank has 153,912 triangles and a 765,176-byte export. Counts are not a
claim of cinematic-reference or AAA quality.

## Additional recording investigation

The supplied recording shows Mission 2's Prism Sovereign, not Mission 1's Warden.
Private diagnostic stills are in `recording-review/`, outside public assets.
The recording alone does not reveal whether a movement key was held.

Preserved-source reproductions established:

- First run: about 19.4 seconds inside rendering at boss introduction and
  21.5 seconds inside rendering after defeat. Forward input was present at the
  first stall; no pause or cinematic game-clock hold was active.
- A successful repeat attributed about 29.3 seconds to synchronous
  getProgramInfoLog calls across introduction and defeat. New point lights
  changed shader variants throughout the scene, including transmissive materials.
- Camera collision then shortened the gate-crossing camera ray to less than
  one metre as the wall-clock introduction expired during a render interruption.
  A separate side/high/rear escape change also produced abrupt framing changes.
- The ending overlay appeared about 1.9 seconds before the first decoded video
  frame. Black detection did not identify a matching encoded-black interval in
  the unchanged video file. The UI had no decoded-frame readiness handling.

This diagnoses the reproduced application-level behavior. It does not prove
that every historical Windows/hybrid-GPU stall has the same cause.

## Completed tests and preserved failures

- `camera-before`: Mission 1 baseline playthrough passed and reproduced camera
  collapse (minimum sampled distance about 1.02 m).
- `camera-after`: gameplay passed, but the first anticipatory camera change did
  NOT eliminate collapse (about 1.24 m). This failed correction is retained.
- `camera-after-final`: an intermediate Mission 1 run FAILED because the player
  was defeated. No page errors, console errors or missing assets were reported.
  Do not count this run as a pass.
- `recording-before`: Mission 2 baseline completed, with the long stalls above.
- `recording-before-expanded`: UNVERIFIED completion; the test route was blocked
  by an obstacle before reaching the boss. The incomplete capture is retained.
- `recording-before-verified`: normal keyboard detour reached and completed the
  boss, producing the exact shader-query attribution above.
- `recording-after`: corrected Mission 2 completed through the ending video's
  natural end and save reload. Largest recorded render-call duration was
  108.7 ms; no getProgramInfoLog call exceeded the 4 ms diagnostic threshold.
  The first decoded video frame arrived about 675 ms after waiting began.
  This used the earlier, narrower camera framing; final wider Mission 2 framing
  still needs a new run. These are instrumented render durations, not a final
  FPS benchmark or proof of stable 1080p.
- `camera-final-v2`: current wider-framing Mission 1 completed and saved/reloaded.
  First active-boss camera distance was about 6.64 m. A 740.3 ms render call at
  the in-engine ending remains recorded and unresolved; shader queries also
  occurred there. Do not claim transition stabilization.
- `replay-full`: INCOMPLETE. Writing the ongoing report failed with ENOSPC.
  No replay-completion, duplicate-reward or ending verdict can be inferred from
  it. Preserve its error/log and retry in a new folder after storage is safe.

Isolated validation and diagnostic builds compiled successfully. Intermediate
lint passed with the four pre-existing MenuScene.jsx immutability warnings.
Final production `npm run build` and final lint after the latest edits have not
been run. No fresh 720p/1080p acceptance benchmark has been completed.

## Operations and storage at handoff

No matching owned Node/Blender test processes, temporary Playwright Chrome
browsers with this task's launch flags, or listeners on the known test-server
ports 5301, 5303, 5305, 5307, 5309, 5311, 5313, 5315, 5317 and 5321 remained.
No further process termination was necessary after that verification. Ordinary
user browser windows and unrelated applications were not closed.

C: free space at the final read: approximately 2.33 GB (2.17 GiB), specifically
2,333,421,568 bytes. Earlier ENOSPC interrupted a test despite later free space
recovering after its browser closed. The exact storage-exhaustion mechanism is
not established. Do not assume current headroom is sufficient for long tests.
No tests, builds, exports or development servers remain running.

The source is safe to close and resume later. This is not an acceptance signoff.
The project is not committed in Git, and failed/incomplete evidence must not be
used as passing evidence. Continue to preserve rollback and protected assets.

## Exact resume sequence — only after confirmation

1. Obtain the user's confirmation. Establish adequate storage headroom outside
   this project, or obtain approval for alternate storage. Recommend at least
   10 GB free before long browser/build batches. Do not delete project evidence,
   models, screenshots, reports or rollback files. Check space between runs.
2. Compare current source hashes with `handoff-state.json` and reverify all 47
   expected protected hashes. Stop and report any unexpected protected conflict.
3. Read this handoff and the failed/incomplete raw results. Reuse immutable
   `build-corrected-v2` for diagnostic runs and `build-validation-v2` for ordinary
   checks only if saved source hashes still match. If changes are needed, create
   a new versioned build/folder; do not overwrite prior traces or build evidence.
4. Retry the complete saved Mission 1 replay in a NEW folder using bounded
   telemetry. Investigate the remaining 740 ms ending render and any cold replay
   shader variants before claiming transition stability. Current helper source:
   `replay-full/playthrough.mjs`; its previous ENOSPC result is not a pass.
5. Run `camera-stress-v2/playthrough.mjs` (prepared, NOT RUN). Its deliberate
   3000 ms main-thread interruption is a robustness fixture, excluded from normal
   performance results. Run `recording-final-v2/playthrough.mjs` (NOT RUN) to
   verify wider Mission 2 framing and its entire natural ending. Preserve failures.
6. Run prepared independent mission tests: `expansion/missions3to10.mjs`, then
   `expansion-touch/missions3to10.mjs`. Neither has been run. Prerequisite progress
   is seeded only in isolated contexts to access each mission. Completion must
   use real controls and encounters. Report each as an existing prototype;
   authored story content is not established by a functional pass.
7. Run `regression/missions12.mjs`, `chase/server.mjs`, `relays/playthrough.mjs`,
   `presentation-check.mjs after-selected`, and `hud-relay-check.mjs`. These final
   matrix runs are NOT RUN. They include airborne jump sampling, keyboard/touch,
   objectives, save reload, all HUD modes, relay behavior, chase and pause.
   `run-validation.mjs` is a prepared sequential batch runner, NOT STARTED; inspect
   its output paths/storage behavior before using it. Never launch parallel test
   browsers on this memory/storage-constrained machine.
8. Add delayed-video/error readiness tests and verify the new overlay's loading,
   pause, skip and natural-ending paths. No forced media-delay/error test is done.
9. Create a new Phase 5.3.1 performance runner. Measure three comparable 720p
   repeats for exploration, normal combat, real simultaneous-enemy activity,
   boss combat and transitions. Record averages, p95/p99/max, all stalls and
   censored boundaries. Test 1080p separately. Do not mix diagnostic GL wrappers
   or injected-stall fixtures into ordinary performance acceptance.
   Compare with untouched `phase53-performance-results.json`: after-combat
   29.96 FPS, p95 40.6 ms, p99 47.5 ms, max 75.5 ms. Retain historical multi-second
   stalls as open risks unless separately established as fixed.
10. Run final production build and lint, verify the 47 hashes and old evidence,
    and create all six requested final deliverables. They do not yet exist:
    phase531-corrective-development-report.md; phase531-camera-visual-review.md;
    phase531-mission-regression-results.json; phase531-performance-results.json;
    phase531-changes-and-hashes.json; phase531-final-acceptance-report.md.
    Do not run Phase 5.3 finalization scripts that overwrite its reports.

Do not declare Phase 5.3.1 complete, close Phase 5.3 or start Phase 5.4 without
actual acceptance evidence and the user's approval.

Package/config preservation at handoff: {"package.json": true, "package-lock.json": true, "vite.config.js": true}.
