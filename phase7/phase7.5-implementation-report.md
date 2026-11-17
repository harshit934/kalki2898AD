# Phase 7.5 — Performance and resource optimization

2026-11-16, Asia/Calcutta. **CONDITIONAL PASS for the bounded non-browser optimization; runtime effects remain unverified. Phase 7.4 remains BLOCKED.**

## Protection and scope

Read the Phase 7.1–7.4 implementation/acceptance records, including Phase 7.1's later cinematic-view conditional acceptance (not the failed shader candidate). Copied latest Phase 7.4 source into `phase7/phase7.5/staging/` and `phase7/phase7.5/rollback/`. Baseline manifest: `phase7/phase7.5/before.json`, 181 files. All 47 protected assets matched before edits and afterward. No production, save, older staging or rollback changes.

## Implemented optimization

**One retained optimization: instance-owned Three.js vector scratch for Bujji's existing companion follow and beam calculations.**

- Modified only `phase7/phase7.5/staging/src/game/BujjiCompanion.jsx`.
- Added `phase7/phase7.5/staging/src/game/companionMath.js`.

Before: each active follow update constructed three Vector3 objects; a visible assist beam cloned another vector and constructed an up vector. After: five vectors are allocated once per mounted companion via useMemo and reused. Follow and beam scratch are separate, cannot alias, and do not escape into gameplay state. The existing assist-event target snapshot remains separately allocated so later updates cannot mutate it. No listeners, animation loops, timers, global caches or GPU resources added. CPU-only vectors need no GPU disposal and become eligible for collection after unmount; actual GC timing is not claimed.

Target selection, assist cooldowns/damage, voice rules and JSX remain byte-identical. Player controller, mission/reward/save logic, audio implementation, camera composition and rendering settings are unchanged. No Scout/Warden source, appearance, behavior or asset changes.

## Measured before/after

Original arithmetic is extracted from rollback source and executed against the candidate helper. 5,000 moving camera/player cases plus zero-horizontal-distance and beam orientation cases match to the declared numerical tolerance.

- 20,000 follow updates: **60,000 → 5 vector constructions**, including candidate setup; steady-state three → zero per update.
- 20,000 visible-beam updates: **40,000 → 5 constructions**, measured separately with fresh setup; two → zero temporary vectors per beam update. One real instance shares the same five scratch objects for both operations.
- Seven alternating warmed CPU rounds, 20,000 follow samples each: median **2.619 → 1.246 ms**. Constructor counts are deterministic; timings are machine/JIT-sensitive microbenchmarks, not rendered FPS. Raw rounds are retained in optimization-results.json.
- JS/CSS bundle: **4991532 → 4991801 bytes** (+269); gzip sum **1550613 → 1550723** (+110); 22 emitted files in both builds. Small helper overhead is reported, not hidden as a bundle-size saving. Same installed Vite/config/minifier/dependencies; no public assets copied into either build.

## Investigation results and rejected work

Inspected per-frame object creation, geometry/material/texture ownership, effect cleanup, request caches, audio/event loops, assistant subscriptions, assets and package usage. Existing inspected rubble/arcade/head resource builders dispose owned resources; audio and loaders already have bounded caches/cleanup. No additional leak fix or dependency removal was justified by this inspection. This is not a proof that every allocation or leak in the game is solved.

A material-cache trial was tested in a synthetic repeated-material fixture, then **reverted**: the inspected default riverfront, riverbank and courtyard GLBs have respectively 9/9, 6/6 and 9/9 primitive/material-reference counts, so no current savings were demonstrated. KashiEnvironment is byte-identical to rollback. Trial source is preserved outside staging as discarded-material-cache.jsx; it is not shipped.

Static public inventory: 202 files, 379938649 bytes. Largest files include authored street-core (60,976,156 bytes) and protagonist GLB (26,119,932 bytes). File size does not establish load path, decoded RAM/VRAM or a performance defect; no assets were resized/reencoded/deleted and no graphics downgrade was applied. Existing large build chunks remain. All current package dependencies are retained; no speculative pruning or installations.

## Validation and one correction

**123 checks PASS**: 14 new CPU/equivalence/resource/contract checks plus 109 inherited regressions. Environment clone/texture disposal tests are baseline lifecycle checks, not claims of a retained material optimization. Candidate and rollback builds PASS; lint has 12 inherited warnings, zero new warnings/errors.

Initial lint identified a new ref-during-render warning in lazy scratch initialization. One focused correction moved initialization into useMemo; affected equivalence tests and lint then passed. No further correction cycle. Material-trial withdrawal was an evidence-driven scope reduction, not a speculative graphics change.

## Limits

No browser or development/static server launched. No runtime FPS, GPU timing, Windows RAM reduction, visual/mobile playback or fix of historical multi-second stalls is claimed. Bujji's live appearance/behavior requires later permitted browser confirmation. Phase 7.4 is still BLOCKED, its 181 source files and seven Scout/Warden files match, and no production promotion is authorized.
