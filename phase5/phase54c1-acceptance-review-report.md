# Phase 5.4C.1 — Revision acceptance review and 489 ms interruption

Review date: 13 November 2026 (Asia/Calcutta). **Decision: REJECT acceptance/default production integration.** The revised block remains an opt-in review prototype; the original environment remains the production default. Root-cause attribution is INCONCLUSIVE. No production fix, new gameplay test, benchmark, native capture or Phase 5.4D work was performed.

## Evidence reviewed and preservation

Reviewed the existing phase54c-revision-report.md; first-review/results.json and original/revised opening, revised playable and street-viewer screenshots; six performance-comparison frame records and results.json; performance-summary.json; conditions.jsonl and performance-run.json; Mission 1 completed-save replay raw synchronized-browser-trace.json, playthrough harness, passive telemetry and result/log; Mission 1 touch/Mission 2/chase/HUD results; loading recovery and camera-preservation results; production build/final lint logs; source dispatch, relic trigger, cinematic controller/stage/ending config and revision distance-streaming code; rollback copies and final changes/hash record.

New supporting files are confined to phase54c1-review-20261113/. offline-analysis-v2.json independently recalculates distributions and boundary states. hash-verification-v2.json records fresh streaming SHA-256 checks. gaps-over100.json enumerates every >100 ms render-start gap in the six active windows, both captured replay traces and separately labeled pre-window startup captures. The first derived analysis was retained; v2 improves state-boundary classification to include boss-intro and post-relic idle states. Existing source, reports and raw evidence were not overwritten.

Fresh verification: **47/47 protected hashes match**. All recorded source, configuration, old assets/reports, new revision source/assets, rejected-prototype files and shader warm-up helpers match the completed revision record. Original environment dispatch still requires no flag; the new block is gated by the exact kashiPrototype=revision value. Old prototype/review routes and source-before rollback copies remain. No saves or persistent player browser profile were opened. No source/assets were modified.

## Exact incident and corrected classification

Affected run: regression/m1-replay-ready, mission-1-keyboard, completed-save replay, explicit ?kashiPrototype=revision, observer build after-build-v3, Chrome headless. Source record: phase54c-revision-20261113/regression/m1-replay-ready/synchronized-browser-trace.json. performance.timeOrigin = 1794556801706.4 ms.

- Render-start pair: browser-relative **75,238.0 → 75,727.0 ms**, a **489.0 ms** gap.
- Approximate wall-clock mapping: **2026-11-13 08:01:16.944 → 08:01:17.433 UTC**, or **13:31:16.944 → 13:31:17.433 IST**. Derived from browser time origin, not an independently calibrated Windows QPC synchronization.
- Last pre-start state (75,236.0 ms): boss defeated/HP 0, relic false, cinematic idle, visible tab, no HTML mission video. At 75,249.9 ms the relic is still false and cinematic idle.
- First post-gap state (75,714.7 ms): relic true, cinematic playing, boss still defeated, no HTML mission video. Player approximately (-1.881, -0.201, -67.285), in the boss arena. This is a **relic-completion-to-ending-cinematic transition boundary**, not an established ordinary combat/AI freeze, chase interruption or initial mission loading stall.
- The previous report called this an active gap because its reducer labeled the whole interval from the preceding idle state. That loses the state change inside the interval. The original record remains untouched; this review corrects the interpretation.

The ending ID is inferred from unchanged source: MissionOneRelays starts missionOneEnding when victoryReady && relicCollected, using config id kashi-contract-return. The trace does not record the session ID itself. The source/state match is strong contextual evidence, not a timed CPU stack.

## Timing decomposition and strongest supported finding

The render at 75,238.0 ms took **5.6 ms**. Approximately **483.4 ms** then elapsed between its return and the next recorded render start. The rAF timestamp sequence has a **464.8 ms** hole (75,249.9 → 75,714.7). These are callback/render timing observations; rAF timestamps are not CPU execution samples or display-present timings.

The next render, beginning at 75,727.0 ms, separately took **362.4 ms** wall time. The following render began at 76,096.8 ms, giving an adjacent **369.8 ms** gap, of which the preceding long render accounts for about 362.4 ms. Together the two start-to-start gaps span **858.8 ms**. The long render belongs to the second interval; it cannot retroactively explain the preceding 489 ms gap. Avoid both double-counting it and overlooking it.

**Strongest evidence-supported finding:** interruption at completion/ending initialization, followed by a long synchronous renderer call. **Underlying operation/subsystem remains unresolved.** A render wall-time wrapper includes possible JavaScript traversal, browser/driver calls, waits or preemption; it does not separate CPU execution from GPU/OS waiting.

### Confirmed evidence versus hypotheses

- Transition initialization is confirmed context. Source can perform actor cloning, bounds calculation, appearance/costume setup, animation preparation and cinematic/audio initialization. None has a measured duration at this timestamp, so none is a confirmed cause.
- Shader/material first-use or GPU upload/wait remains a hypothesis. Program count is 46 before and after; unchanged count does not exclude compilation, texture upload or waits. The replay configured **zero native shader wrappers** (the loop is empty), so empty glSlow and failedWrappers arrays prove no attribution. No GPU timer, queue/fence trace, driver wait or DWM trace exists for this incident.
- CPU-heavy React/actor work, garbage collection and OS scheduling/preemption cannot be separated: no CPU sampling stacks, scheduling trace, GC events or Long Task observer were captured in this replay. The controlled comparison's Long Task data belongs to different windows.
- RAM/commit/paging/disk causation is unsupported here. The native journal ends at **07:59:55.253 UTC, 81.691 seconds before the incident**. It covers the six performance windows, not this replay. There are no incident-overlapping memory, owned hard-fault, process working-set, disk or VRAM records. Earlier low headroom is a risk indicator, not event attribution.
- No HTML video was active around this boundary and no media events overlap it. That rules out an observed HTML-video playback stall, not arbitrary asset/audio work. The replay only records failed HTTP responses, not complete timestamped successful resource/decode activity; loading cannot be excluded.
- Collision lock, AI deadlock or camera failure is not established: the boss is already defeated, relic progresses and the ending runs to victory/save reload. Input ownership, velocity and collision events were not recorded at stall precision. Stationary player state after cinematic start is consistent with the intended hold, not proof of movement failure.
- Screenshots, CDP polling and passive state/render collection exist in the headless regression harness. Their exact command intervals were not logged; observer/screenshot effects cannot be ruled out or asserted as the cause.

## Existing before/after performance comparison

These are **existing original-environment versus revised-environment measurements**, recalculated from raw records; there is no Phase 5.4C.1 optimization or new after-fix measurement. Six interleaved 60-second mixed Mission 1 combat/retreat windows used one build, 1920×1080 actual drawing buffer and CSS canvas, DPR 1 and GTX 1650. All had zero hidden-tab samples, page errors and missing assets. Near details can unload during traversal, so they do not certify continuous close-up riverfront performance. Native shader wrappers/CPU/GPU profilers were disabled.

- before-1: 29.80 FPS; mean 33.56 ms; p01/p05/p25/p50/p75/p90/p95/p99/p99.9 = 27.3/27.6/34.2/34.6/34.8/35.0/35.2/35.9/92.4 ms; maximum 299.7 ms; >100 ms count 1.
- after-2: 29.98 FPS; mean 33.35 ms; p01/p05/p25/p50/p75/p90/p95/p99/p99.9 = 27.4/27.8/34.0/34.6/34.8/34.9/35.2/36.1/62.6 ms; maximum 85.1 ms; >100 ms count 0.
- after-3: 30.00 FPS; mean 33.33 ms; p01/p05/p25/p50/p75/p90/p95/p99/p99.9 = 27.6/27.8/34.1/34.6/34.7/34.9/35.1/35.8/40.1 ms; maximum 40.7 ms; >100 ms count 0.
- before-4: 29.87 FPS; mean 33.48 ms; p01/p05/p25/p50/p75/p90/p95/p99/p99.9 = 27.4/27.8/34.1/34.6/34.7/34.9/35.1/35.7/91.6 ms; maximum 254.5 ms; >100 ms count 1.
- before-5: 29.77 FPS; mean 33.60 ms; p01/p05/p25/p50/p75/p90/p95/p99/p99.9 = 27.3/27.6/34.3/34.6/34.8/34.9/35.1/35.8/68.0 ms; maximum 431.2 ms; >100 ms count 1.
- after-6: 30.00 FPS; mean 33.33 ms; p01/p05/p25/p50/p75/p90/p95/p99/p99.9 = 27.4/27.6/34.3/34.6/34.8/34.9/35.1/35.7/42.5 ms; maximum 58.1 ms; >100 ms count 0.

Every >100 ms active-window gap (UTC start; original environment only):

- before-1: 2026-11-13T07:50:04.043Z → 2026-11-13T07:50:04.343Z, 299.7 ms.
- before-4: 2026-11-13T07:55:13.001Z → 2026-11-13T07:55:13.256Z, 254.5 ms.
- before-5: 2026-11-13T07:56:57.228Z → 2026-11-13T07:56:57.659Z, 431.2 ms.

The three revised active windows have zero >100 ms gaps. p95/p99 still exceed the strict 33.3 ms budget. Improved sampled maxima do not prove a causal fix; memory/commit varied and the historical 5,384.5 ms gameplay and 533.6 ms ending issues remain unresolved. The native-shader zero placeholders in passive comparison mode are not measurements of zero compilation.

Broader captured replays (pooled render-start intervals including cinematic/transition phases):

- m1-replay-ready: 29.37 FPS; mean 34.04 ms; p01/p05/p25/p50/p75/p90/p95/p99/p99.9 = 26.7/27.6/34.0/34.6/34.8/35.1/35.4/39.9/184.2 ms; maximum 489.0 ms; >100 ms count 7. Its early buffer read was 1920×1080 but CSS 0×0 before readiness; do not use that early read as incident-time visible-1080p proof. Separate six-window measurements validate 1080p.
- m2-keyboard: 29.85 FPS; mean 33.50 ms; p01/p05/p25/p50/p75/p90/p95/p99/p99.9 = 27.4/27.7/34.2/34.6/34.7/34.9/35.1/35.7/177.5 ms; maximum 177.8 ms; >100 ms count 2. This run was 1280×720; not 1080p performance evidence.

Every >100 ms replay gap (UTC start; inferred phase from sampled state, not exact callback execution time):

- m1-replay-ready: 2026-11-13T08:00:22.182Z → 2026-11-13T08:00:22.301Z: 118.4 ms; GAMEPLAY.
- m1-replay-ready: 2026-11-13T08:00:55.611Z → 2026-11-13T08:00:55.766Z: 154.9 ms; TRANSITION_BOUNDARY.
- m1-replay-ready: 2026-11-13T08:01:16.944Z → 2026-11-13T08:01:17.433Z: 489.0 ms; TRANSITION_BOUNDARY.
- m1-replay-ready: 2026-11-13T08:01:17.433Z → 2026-11-13T08:01:17.803Z: 369.8 ms; CINEMATIC_OR_VIDEO.
- m1-replay-ready: 2026-11-13T08:01:18.878Z → 2026-11-13T08:01:18.982Z: 103.8 ms; CINEMATIC_OR_VIDEO.
- m1-replay-ready: 2026-11-13T08:01:19.578Z → 2026-11-13T08:01:19.763Z: 184.2 ms; CINEMATIC_OR_VIDEO.
- m1-replay-ready: 2026-11-13T08:01:28.995Z → 2026-11-13T08:01:29.127Z: 132.1 ms; POST_RELIC_IDLE (cinematic idle after relic/ending; not established active combat).
- m2-keyboard: 2026-11-13T08:04:03.386Z → 2026-11-13T08:04:03.563Z: 177.8 ms; GAMEPLAY.
- m2-keyboard: 2026-11-13T08:05:06.452Z → 2026-11-13T08:05:06.630Z: 177.5 ms; TRANSITION_BOUNDARY.

Startup/pre-window records are separate from active windows. All >100 ms startup render-start gaps are enumerated in gaps-over100.json. Counts/maxima: before-1: 11/5534.7 ms; after-2: 13/2714.0 ms; after-3: 12/1278.5 ms; before-4: 8/694.4 ms; before-5: 9/694.8 ms; after-6: 11/2671.7 ms. These ranges include initial loading, intended cinematic setup and deliberate navigation/hidden-canvas intervals; their maxima must not be called unexplained active gameplay stalls without state evidence. Raw leading/trailing active-window boundary times remain in the original comparison; the largest leading/trailing boundary is 158.1 ms, not silently included as a completed render interval.

## Visual acceptance review

The revised opening and connected riverfront are clearer than the original shot. Joined buildings, ghat flights, shrine, stalls, arches/grills/balconies and detailed licensed people improve the isolated block. These are observed screenshots, not proof of a whole production city.

Visual blockers remain for the requested cinematic presentation:

1. Water is a flat, strongly repetitive surface; the shoreline/quay edge reads as a hard slab with abrupt right-angle water intersections. There is insufficient wet-edge, bank transition and convincing water depth/detail.
2. Large plain plaster/end-wall expanses and repetitive masonry/arches remain; weathering/roughness variation and building-to-building identity are insufficient. Distant silhouettes, empty horizon and sky/river boundary are sparse and coarse.
3. Street-viewer humans are much better than the rejected primitive population, but only three idle instances/two base models provide little activity or variation. Their placement/appearance does not establish finished crowd quality.
4. The actual playable screenshot still shows the unchanged street's faceted rubble, repetitive surfaces, simple props/silhouettes and dark character presentation. A polished isolated viewer cannot stand in for production gameplay quality. No protected character alteration is proposed here.

Opening/flank composition is improved and no large UI clipping defect is visible in the reviewed shots. The above are visual-quality blockers, not newly demonstrated mission/control failures. **Visual approval is withheld.** Images inspected:

![Revised actual opening](phase54c-revision-20261113/first-review/game-revision-opening.png)

![Isolated detail inspection — not gameplay](phase54c-revision-20261113/first-review/viewer-street.png)

![Actual playable presentation](phase54c-revision-20261113/first-review/game-revision-playable.png)

## Tests and acceptance gates

Existing executed evidence, not newly rerun tests:

- Mission 1 keyboard replay: boss/relic/victory, save reload and unchanged repeat reward PASS. Initial movement probe is false and early CSS 0×0; do not mark it passed. Separate post-gate loading validation confirms 3.137 m ordinary movement.
- Mission 1 portrait touch playthrough: controls, combat, boss/relic, save/reward preservation PASS at 520×900. Opening pause/resume/skip tested; separate first-review run completed the opening naturally. No mobile frame trace was exported and no physical mobile device was tested.
- Mission 2 keyboard progression/boss/relic/save and natural video ending PASS at 720p, with captured decode events. Bujji duel/chase/contract replay, desktop and portrait touch controls, pause, outro and reload PASS in saved results.
- All three HUD modes, relay/objective updates, pause/audio preference controls and loading cancel/error/retry PASS in existing records. HUD store-display fixtures are explicitly fixtures, not fresh combat proofs. Audible sound quality is not certified.
- Build PASS (4.38 s), lint exit 0 with four pre-existing MenuScene warnings; existing large-chunk warning remains. Camera config-preservation test PASS. Runtime/source/config hashes unchanged since those checks, so no justified build/regression rerun follows from this read-only review.
- Missions 3–10 not newly tested in this revision/review; do not relabel old accepted results as fresh coverage.

Gates: visual approval **FAIL**; unexplained severe interruptions absent **NOT ESTABLISHED** (completion boundary and other >100 ms gaps remain); repeatable full-scope stable 1080p/30 FPS **NOT ESTABLISHED** (three limited revised windows are favorable); existing build/gameplay evidence **PASS WITH DOCUMENTED COVERAGE LIMITS**; fresh protected verification **PASS 47/47**; default/opt-in/rollback preservation **PASS**.

## Decision and smallest next action

**REJECT acceptance/integration at present.** This is not a request to delete the prototype or revert accepted gameplay. Keep both prototypes and rollback copies, with the original default.

No meaningful fix is established, so no speculative optimization or repeated performance run was justified under this task. The available evidence can identify the completion/ending boundary and a subsequent long render call; it cannot identify the blocked native operation or distinguish CPU work, scheduling, paging, driver/GPU waits and observer effects.

If further investigation is approved, use the existing bounded capture plan once, aimed specifically at **relic collection → kashi-contract-return first render**, with timestamped actor/setup/asset phases, renderer stacks/off-CPU intervals and contemporaneous owned paging/GPU evidence where supported. Log screenshot/CDP command intervals and capture before/after the first severe event. Stop within the documented time/resource bounds and report missing attribution honestly. Do not warm up, rewrite, lower quality or alter gameplay merely because these operations are plausible. After an evidence-supported fix, rerun the same 1080p windows and broader completion replay, enumerate all >100 ms gaps, and retest only affected gameplay/loading paths. Visual water/shoreline/distant-detail revisions require separate approval; do not apply them during the stall investigation.

Only this report and new offline analysis/hash files were created. No server, gameplay test, Windows/GPU capture or production modification was launched. Stop here; no Phase 5.4D or integration without approval.

