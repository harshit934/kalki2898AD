# Phase 5.4C revision — isolated riverfront prototype

Status: COMPLETE as an isolated reviewable prototype. NOT ACCEPTED for default production integration or unconditional visual/performance acceptance. Original environment remains default; stop here for user review.

## Scope and isolation

The original Kashi remains the default. The rejected first prototype remains available at `?kashiPrototype=54c` and its comparison viewer at `?kashiPrototype=review`. The revised Mission 1 is explicitly enabled by `?kashiPrototype=revision`; its separate art viewer is `?kashiPrototype=revision-review`. No Phase 5.5 work was started.

Before editing, recorded baseline source, old assets/reports and all 47 protected hashes were compared to the prior prototype record. Affected App/main/MissionOneDistrict sources were copied into `phase54c-revision-20261113/source-before/`. Existing evidence and rollback files were retained.

## Changes

- One connected riverfront block: four adjoining two/three-storey buildings, a supported quay, three ghat flights/landings, a shrine, street connections, stalls, jars and utility details. Façade variation includes recessed arches, grills, balconies, jali, cornices, lime plaster and stone. No new collision or gameplay area is claimed.
- The first two Mission 1 establishing camera poses were revised. Other cinematic timings, actors, cuts and gameplay handoff remain unchanged. The opening exposes the river-facing façades instead of blank flank walls.
- Detailed civilian bodies, hair, clothes and Idle animation replace the first prototype's primitive people. Two locally generated MakeHuman-derived variants are reused as three restrained actors. CC0 asset notice and upstream motion attribution accompany the public models. These are licensed game models, not film recordings or protected Bhairava geometry.
- Separate compressed base (120,724 bytes) and near detail (324,968 bytes). Architectural base is 7,260 triangles; near detail 22,352. Far inspection fetches the base only. Detailed civilians and their original-resolution shared textures are requested separately for nearby views. This is distance-based base/detail streaming, not a fully authored multi-level civilian LOD system.
- Civilian GLBs are 1,536,972 and 1,514,016 bytes plus external shared textures. Original and compact exports, generation parameters and scripts remain in the evidence folder. Geometry compression preserves faces; textures were deduplicated without resizing.
- Near water adds a small repeating normal surface, restrained motion and a transition strip. It is not a reflection simulation or finished river material.
- Revised scenery prepares before entering Mission 1. A cancellable, retryable loading dialog waits for assets and then the first committed scene submission before releasing the revision's own gameplay hold. This gate does not certify GPU completion or compilation of every offscreen material. Existing shader warm-up code is retained unchanged.

## Initial visual and render validation

`phase54c-revision-20261113/first-review/results.json`: no page errors or missing resources. Actual mission and art-viewer drawing buffers both measured 1920×1080, CSS canvas 1920×1080, DPR 1, ANGLE NVIDIA GTX 1650. The first cold revised preparation took 10,658 ms versus 373 ms for the default path; these are loading observations, not active frame-time results. Fresh far-only viewer requested `block-base.glb` and avoided detail/civilian/texture downloads.

Actual gameplay cinematic, before:

![Original opening](phase54c-revision-20261113/first-review/game-before-opening.png)

Actual gameplay cinematic, revised:

![Revised opening](phase54c-revision-20261113/first-review/game-revision-opening.png)

Isolated art inspection; not a gameplay screenshot:

![Street and civilian detail](phase54c-revision-20261113/first-review/viewer-street.png)

Actual revised playable view:

![Playable Mission 1](phase54c-revision-20261113/first-review/game-revision-playable.png)

## Known visual limitations

The new block is a reviewable architectural study rather than a completed cinematic city. Stone pattern repetition, coarse shoreline edges, plain water/distant silhouettes, some low-detail surfaces and limited street population remain visible. Existing distant buildings and environment outside this block remain unchanged. The new civilians have convincing anatomy at this scale but limited clothing/face variation and idle-only street activity; no physical mobile visual acceptance is claimed. The adjacent scenic connections do not imply newly playable collision surfaces. These limitations require review, not concealment through haze, blur or output resolution.

## Separate interruption investigation plan

See `phase54c-revision-20261113/bounded-capture-plan.md`. It proposes one immutable, timestamp-correlated capture with renderer-thread stacks, scheduling, owned paging and supported GPU queue/wait evidence; 10-minute total, three short windows maximum, first severe event only and 256 MiB ceiling. Retention/loss safeguards and permission/symbol limitations are explicit. It was planned separately and not executed as part of the visual revision. Historical 5,384.5 ms gameplay interruption and 533.6 ms ending transition remain unresolved observations; this revision does not mark either fixed. No speculative shadow, AI, physics or resolution reductions were applied.

## Performance and regression results

Repeated comparison and focused regression results are complete below. Full frame arrays, cold-start records, long tasks, actual render dimensions and passive power/memory journals are preserved in the revision evidence folder. Means alone do not establish stable 30 FPS.

## Rollback

Use the default URL to return immediately to the unchanged original environment. Keep both opt-in prototypes for comparison. For a source rollback, restore only App.jsx, main.jsx and MissionOneDistrict.jsx from this revision's `source-before` copies, then build/lint; do not restore or replace saves, protected assets, old reports or shader warm-up helpers. New revision files may remain dormant. No deletion is needed.

### Completed six-window comparison

Interleaved same-build OFF/ON 60-second mixed combat/retreat windows, three per condition; 1920×1080 drawing buffer/CSS, DPR 1, GTX 1650, foreground, AC continuously online. Native shader-call wrappers, CPU samplers and GPU timers were disabled. No resolution or quality changes.

- before-1: average 29.80 FPS; mean 33.56 ms; median 34.6 ms; p95 35.2 ms; p99 35.9 ms; maximum 299.7 ms; gaps >100 ms 1, >1000 ms 0.
- after-2: average 29.98 FPS; mean 33.35 ms; median 34.6 ms; p95 35.2 ms; p99 36.1 ms; maximum 85.1 ms; gaps >100 ms 0, >1000 ms 0.
- after-3: average 30.00 FPS; mean 33.33 ms; median 34.6 ms; p95 35.1 ms; p99 35.8 ms; maximum 40.7 ms; gaps >100 ms 0, >1000 ms 0.
- before-4: average 29.87 FPS; mean 33.48 ms; median 34.6 ms; p95 35.1 ms; p99 35.7 ms; maximum 254.5 ms; gaps >100 ms 1, >1000 ms 0.
- before-5: average 29.77 FPS; mean 33.60 ms; median 34.6 ms; p95 35.1 ms; p99 35.8 ms; maximum 431.2 ms; gaps >100 ms 1, >1000 ms 0.
- after-6: average 30.00 FPS; mean 33.33 ms; median 34.6 ms; p95 35.1 ms; p99 35.7 ms; maximum 58.1 ms; gaps >100 ms 0, >1000 ms 0.

All six were measured without missing resources, page errors, defeat or hidden-tab samples. Full distributions (p01 through p99.9), raw frame/render/rAF/long-task arrays, boundary gaps, worst-event timestamps, cold setup and passive 2-second power/memory records are in performance-summary.json and performance-comparison/. Cold setup is separate and included the intended opening, not just loading. Available RAM varied approximately 535–1236 MiB and commit headroom fell to 372 MiB; no causal memory or GPU diagnosis follows from those counters. Windows commit limit changed during the series. Near-detail distance streaming can remove near objects during combat traversal; this benchmark is not a continuous close-up riverfront test.

The revised windows showed no >100 ms interruption, but the p95/p99 remain above the strict 33.3 ms frame budget. The baseline had 254.5–431.2 ms gaps. These small samples do not prove the visual changes repaired any stall mechanism. Historical 5384.5 ms active and 533.6 ms ending gaps remain unresolved. Native shader-call zero fields in the raw comparison are unobserved placeholders in passive mode, not proof of zero compilation.

## Focused regression results and evidence limitations

- Mission 1 completed-save keyboard replay: boss defeated, relic collected, victory UI reached, save survived reload and rewards unchanged. Raw result: regression/m1-replay-ready/mission-playthroughs.json. An initial 400 ms movement probe returned false and sampled CSS canvas 0×0 before preparation finished; preserve that failed probe. It is not valid evidence of loaded gameplay dimensions or a passed movement assertion. The separately executed loading-validation/results.json waits for dialog release and verifies 3.137 m ordinary keyboard movement. The full replay also traversed and fought through the encounter normally.
- Mission 1 fresh portrait touch playthrough: PASS, including opening pause/resume/skip, movement, sprint, dodge, jump/airborne jump, both attacks, boss, relic, victory, save reload and preservation of prior rewards. Actual mobile buffer/CSS 520×900, DPR 1. Emulation only. No passive frame trace was exported by that original mobile harness; do not infer mobile frame percentiles from this functional result.
- Mission 2 keyboard playthrough: PASS, movement/combat/pylons/boss/relic, natural ending video completion, victory and save reload. Its actual buffer was 1280×720; it is a functional preservation test, not a 1080p performance claim. The video produced 303 captured media/decode events, including decoded-frame observations.
- Bujji contract/chase: PASS for desktop and portrait browser-touch layouts. Actual duel, ordinary-input chase completion, pause holds, touch brake/acceleration/two-finger steering, outro handoff, unchanged main mission state/save, natural full contract replay introduction, completion reload and cleanup were checked. Contract state fixtures are labeled in the harness; game controls drive the duel/chase.
- HUD/settings: PASS desktop 1280×720 and portrait 430×932. Full/compact/minimal modes, readable health, center hit target remains canvas, actual relay scan and objective count, pause/settings, sound mute/volume preference and dialogue panel. Health/score/boss-visibility binding checks use explicit display-state fixtures; they are not independent combat reward tests. Audible audio quality was not certified.
- Scenery lifecycle: PASS controlled delayed-asset cancel (no late mission start), controlled HTTP 503 and retry into the intended unskipped Kashi opening, and completed-save replay movement after gate release. Portrait loading and recoverable-error screenshots retained. Old rejected comparison viewer still loads. No teleport or reload workaround was introduced into gameplay.
- Camera configuration preservation test: PASS. The adapter leaves input config immutable, all non-camera fields and later camera keys intact, and retains the first two key times. Actual revised opening and gameplay screenshots are above. The separate first-review run allowed the opening to complete naturally; the touch playthrough intentionally tested pause/resume/skip. Regression browser states contain camera positions, but raycast-camera samples were disabled in these inherited passive harnesses; this is not an exhaustive new camera collision certification.
- Missions 3–10 were not freshly replayed in this bounded visual revision. Their accepted prior functionality is preserved by unchanged code/asset checks; no new passing playthrough claim is made for them.

Fresh broader regression telemetry must not be omitted: Mission 1 replay had a 489.0 ms active render-start gap and 369.8 ms cinematic gap. Mission 2 had 177.8 ms active and 177.5 ms video/cinematic gaps. These functional traces are separate from the six controlled performance windows. They show that frame-time stability is still imperfect. No synchronized native stacks/paging/GPU waits were captured, so the responsible operation and whether the 489 ms event is new are not established. No multi-second gap was observed in the recorded new samples; that does not resolve the historical interruptions. See regression-summary.json and original synchronized-browser-trace.json files.

Actual portrait gameplay:

![Portrait boss encounter](phase54c-revision-20261113/regression/m1-touch-ready/mission-1-mobile-warden-active.png)

## Final build, preservation and closure

Production build PASS (4.38 seconds), final lint exit 0 with four pre-existing MenuScene.jsx immutability warnings. A large-chunk advisory remains a build warning, not proof of runtime cost. Dedicated observer build v3 supplied passive exports for comparison; production build contains no diagnostic window exports. Camera preservation check and all focused functional harnesses completed. Intermediate builds/logs and the initial invalid movement probe were retained.

Final hash record: phase54c-revision-20261113/final-changes-and-hashes.json. All 47/47 protected checks match the preflight/accepted baseline. Old rejected prototype files match. Exactly three previously recorded runtime source files changed: src/App.jsx, src/main.jsx, src/game/MissionOneDistrict.jsx. No other baseline source, old asset/report or configuration hash changed; no saved-player profile was opened or altered. Tests used ephemeral Chrome contexts and copied save fixtures. Shader warm-up helper hashes match the baseline.

New runtime files are under src/game/kashiRevision/: KashiRevision.jsx, RevisionReview.jsx, revisionAssets.js, revisionOpening.js, loading.css and review.css. New distributable models, textures and license notices are confined to public/environment/phase54c-revision/. Generation/build/test evidence and backups are in phase54c-revision-20261113/. No drivers, registry, BIOS, Windows services, protected assets, AI, physics or controls were changed.

All eight owned preview/regression ports were verified closed in server-closure.json. Final available C: space: approximately 39.40 GiB. No cleanup/deletion was performed. No test operation remains running. Baseline and rollback evidence are retained.

## Recommendation

Accept this only as the next isolated prototype for visual review; do not integrate it into the default environment. Architectural continuity/composition and human models are improved, but water/shoreline/distant scenery, surface repetition and civilian variety remain below final cinematic-city quality. Strict stable 1080p/30 FPS and absence of severe interruptions are not established by the current evidence, especially the 489 ms broader replay gap. The historical 533.6 ms ending-transition issue remains open.

Safest next action: review the supplied actual gameplay and art-viewer screenshots, then decide the bounded next visual scope and whether to authorize the separately documented native capture. Do not expand to a whole-city replacement or apply unverified shadow/AI/physics reductions. No additional stage or Phase 5.5 was started. Wait for approval.

