# Phase 7.1 targeted performance fix result

16 November 2026 (Asia/Calcutta). **Final decision: FAIL.** The isolated candidate improved the captured active cinematic but introduced a readiness-presentation regression, and its later browser regressions were blocked. The original working partial-delivery version remains unchanged and remains the default launcher.

## Scope and files

Candidate: `phase7/phase7.1/stutter-work/staging/`. Its pre-fix rollback: `stutter-work/rollback/`. Original delivered version: `phase7/phase7.1/staging/` and original `serve.mjs`.

Only four candidate source paths changed:

- `cinematics/prepareOpeningPrograms.js`: compile existing scene programs, then perform four representative existing-camera draws with temporary actor visibility; restore visibility and leave the live camera unchanged. Cancellation/retry checks prevent acknowledgement after cancellation.
- `cinematics/CinematicStage.jsx`: hold opening clock until preparation succeeds, track existing actor groups and report readiness/errors.
- `cinematics/CinematicOverlay.jsx` and `cinematic.css`: explicit preparation presentation, distinct from active playback, retaining Skip controls.

Camera keyframes, actor height/alignment/animations, asset references and all four shot compositions were not edited. Shader-error checks, Phase 6 warm-up/audio logic, gameplay, rewards, progression and save schemas were not changed.

## Actual before/after measurements

All values below are **browser rAF callback intervals, not GPU time or actual rendered game-frame timings**. Full CSV and every recorded >100 ms gap are retained; no FPS invented.

- Historical unprofiled opening/readiness: median 7.0 ms, p95 20.7 ms, p99 27.8 ms, max 3,683.8 ms; two gaps >1 second; wall duration 40.045 seconds.
- Instrumented before opening/readiness: median 7.0 ms, p95 14.1 ms, p99 27.8 ms, max 4,592.5 ms; three gaps >1 second; wall duration 43.363 seconds.
- Instrumented candidate, including preparation: median 7.0 ms, p95 20.8 ms, p99 34.6 ms, max 2,442.1 ms; two gaps >1 second; wall duration 40.406 seconds.
- Candidate explicit preparation: 74 intervals, max 2,442.1 ms, two gaps >1 second. This loading cost remains; it was not eliminated.
- Candidate active playback: 3,082 intervals, median 7.0 ms, p95 20.8 ms, p99 27.8 ms, max **208.1 ms**, zero gaps >1 second; six gaps >100 ms (208.1, 166.5, 201.3, 208.1, 104.2 and 180.5 ms).

Before readiness was not separately labelled. Comparing its combined maximum with the candidate's active-only maximum is not a total-startup speedup claim. The candidate deliberately relocates first-use work into explicit preparation. Remaining short hitches and observer/screenshot overhead prevent a stable-frame-pacing guarantee. One before/after pair does not establish repeatability.

## Executed validation

**73 automated checks PASS:** five preparation lifecycle checks plus 68 existing camera/opening/exploration/audio regressions. Preparation tests use a mocked renderer and verify ordering, cancellation, error restoration and retry; they do not replace browser validation.

Build PASS: 737 modules, existing large-chunk warning. Lint exits successfully with zero errors, **ten warnings: nine existing and one new cleanup-ref warning** in CinematicStage. The new warning is not hidden as pre-existing.

Before-profile browser run passed New Game, natural handoff, movement, camera rotation, Replay, Skip and refresh/return on the unmodified version. Candidate raw results and saved records prove:

- **PASS:** New Game starts candidate opening; explicit readiness presentation appears.
- **PASS, recorded evidence:** natural candidate completion marker and free-roam phase were saved, with no campaign completion/reward fabrication. The normal assertion after trace export was not reached; this conclusion comes from the preserved `afterOpening` records and complete natural-opening rAF observations.
- **PASS, scoped:** establishing, reveal, close-up and rear stages appear in candidate screenshots; camera configuration hash is unchanged.
- **FAIL:** `cinematic-009s.png` shows an unposed actor between preparation and the proper establishing shot. The helper renders temporary visible actor groups to the main canvas; releasing the cover without an explicitly presented clean initial frame is a likely mechanism. No further source edit applied after the allowed retest.
- **BLOCKED on candidate:** post-handoff movement/orbit, Skip, Replay, refresh/return and continuous clipping/snap verification. Baseline passes are not promoted into candidate passes. Pure preparation lifecycle tests do not establish actual browser Skip behavior during compilation.

The candidate's 40.406-second natural opening completed before the resource/export stop. During subsequent trace export, available RAM stayed below 128 MiB for three samples (minimum 36,966,400 bytes). The monitor closed Chrome. Trace export then failed to finish; the exact owned runner/server were terminated to complete cleanup. Partial exports are explicitly invalid/incomplete, not silently replaced. No user interruption is alleged.

## Evidence

- Before: `stutter-work/before-20261116-001332/results.json`, `cpu-profile.json` and snapshots.
- Candidate: `stutter-work/after-20261116-001854/results.json`, `cpu-profile.json`, memory journal and snapshots.
- [Preparation presentation](<C:/Users/Hp/Downloads/kalki 2898AD/phase7/phase7.1/stutter-work/after-20261116-001854/cinematic-007s.png>)
- [Rejected unposed-actor frame](<C:/Users/Hp/Downloads/kalki 2898AD/phase7/phase7.1/stutter-work/after-20261116-001854/cinematic-009s.png>)
- [Preserved close-up](<C:/Users/Hp/Downloads/kalki 2898AD/phase7/phase7.1/stutter-work/after-20261116-001854/cinematic-028s.png>)
- Summary/stacks/all gap lists: `stutter-work/performance-summary.json`. Commands and lifecycle tests: adjacent JSON/logs. Cleanup evidence is separate from the incomplete raw finally path.

## Preservation and stop

Fresh SHA-256: **47/47 protected, 153/153 production, 173/173 original Phase 7.1 source, 173/173 new rollback, 171/171 older rollback and 171/171 Phase 6 baseline match**. All 16 candidate audio/voice files and the camera choreography file match the pre-fix baseline. Exact candidate changes/hashes: `stutter-work/integrity-results.json`. No personal saves/profile accessed; disposable test data only.

Both profiling sessions stopped; the resource-stopped Chrome PID was verified absent, and owned runner/server counts were zero. Original launcher still serves the original partial delivery. Candidate remains isolated and **must not be copied into it or production**.

Smallest remaining correction, for future authorization: prevent exposure of warm-up draws by presenting a correctly initialized opening frame before releasing readiness, address the new cleanup-ref warning, then complete only the blocked candidate UI/continuity checks and a matched performance check. No second cycle, broad optimization or Phase 7.2 started here.
