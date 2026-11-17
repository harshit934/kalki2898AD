# Phase 5.5 correction plan — approval required

14 November 2026 (Asia/Calcutta).

**Conclusion:** the rejection is supported, but it combines confirmed defects, unresolved timing events, incomplete requirements and coverage limitations. They need different remedies. The strongest immediately actionable finding is the default ending's synchronous normalization work. Existing functional boss passes should be preserved; missing campaign chapters must not be added to close this review.

This document is analysis only. No fixes, gameplay tests, new profiling, build, lint or asset work were performed. The complete acceptance report, raw journals/results, source, CPU correlation and representative actual screenshots were reviewed. The original Phase1–10 roadmap remains authoritative: enemy AI/boss encounters are Phase5; campaign development/completion and assistant/voice expansion stay in their original workstreams. The81 unfinished missions are not a Phase5 rejection reason. No Phase6 work is authorized.

Severity: **High** blocks the applicable final-quality claim; **Medium** materially affects usability or leaves a coverage gap; **Low** is maintenance/disclosure. No current data loss or permanent gameplay deadlock is proven, so those are not invented Critical defects. Priority1 below means first work, not an assertion of catastrophic failure.

## F1. Default Mission1 ending performs expensive normalization at mount

**High; priority1.** Functional ending playback succeeds, but relic collection produces a visible interruption.

Raw default actor timings: `preparedEnding:false`, clone1.5ms, normalization493.9ms, total495.4ms. The measured block ends approximately11:22:57.740 UTC, inside the585.7ms interval ending11:22:57.799 UTC. A separate522.0ms renderer call starts at that boundary and is followed by a524.2ms interval ending11:22:58.323 UTC. **That522ms render follows the585.7ms gap; it does not cause the already elapsed gap.**

The opt-in actor records prepared bounds, clone5.9ms and normalization0.8ms. This supports the operation-level benefit, not a general transition-performance claim: the opt-in diagnostic replay still contains a948.9ms maximum elsewhere.

Evidence: [natural-ending-default-retry/mission-natural-diagnostic-results.json](<C:/Users/Hp/Downloads/kalki 2898AD/phase5/phase55-validation-20261114/natural-ending-default-retry/mission-natural-diagnostic-results.json>); [natural-ending-default-retry/mission1-natural-diagnostic-frame-journal.json](<C:/Users/Hp/Downloads/kalki 2898AD/phase5/phase55-validation-20261114/natural-ending-default-retry/mission1-natural-diagnostic-frame-journal.json>); [natural-ending/mission-natural-diagnostic-results.json](<C:/Users/Hp/Downloads/kalki 2898AD/phase5/phase55-validation-20261114/natural-ending/mission-natural-diagnostic-results.json>).

Affected files: [cinematics/CinematicStage.jsx](<C:/Users/Hp/Downloads/kalki 2898AD/src/game/cinematics/CinematicStage.jsx>) (`CinematicActor`, lines65–80, especially73), [kashiRevision/endingBounds.js](<C:/Users/Hp/Downloads/kalki 2898AD/src/game/kashiRevision/endingBounds.js>) (prepared-route predicate/cache/application), [kashiRevision/EndingBoundsPreparation.jsx](<C:/Users/Hp/Downloads/kalki 2898AD/src/game/kashiRevision/EndingBoundsPreparation.jsx>) and [App loading lifecycle](<C:/Users/Hp/Downloads/kalki 2898AD/src/App.jsx>).

**Confirmed cause:** the default route bypasses prepared-ending routing and runs `new Box3().setFromObject(object)` synchronously during actor normalization. The instrumented normalization region also includes scale/ground alignment and traversal; do not claim the entire493.9ms is one individually timed statement, or that it explains the whole585.7ms.

**Unresolved:** the following522ms renderer operation. First-use skinned culling bounds are plausible given prior bounds investigations, but the current call-duration evidence does not individually attribute that render to culling, shaders or a driver wait.

**Smallest proposed correction:** prepare the same actor's normalization and conservative animated culling bounds during an existing default-Mission1 loading gate, reusing the loaded GLTF and helper. Keep Kashi opt-in and shader warm-up unchanged. This is not a one-line predicate flip: default loading must actually prepare the cache before the clone consumes it. Preserve cancellation/retry, actor height/feet, animation, weapon/costume, camera and shadows.

**Risk/rollback:** longer loading, stale/incomplete cache, cancellation race or tight animation bounds. Back up the affected active source; retain the old route as rollback. Restore only that source change if loading/alignment/culling/save assertions fail. Never restore user saves or entire old source trees over newer work.

**Effort:**8–16 developer-hours including targeted lifecycle integration and replay QA. Repair of the separate unidentified render cost is not included or guaranteed.

**Acceptance:**3 matched cold/default and3 warm/replay1080p natural endings plus720p sanity; prepared data ready before actor mount; normalization/bounds application each below5ms; no repeated full skinned-vertex scans at mount/first culling; full animation/costume/weapon/feet/shadow visibility; cancel/retry, pause/resume/skip, repeated replay and exact-once rewards pass. Measure the following renderer cost separately; fast normalization alone does not pass the transition.

## F2. Remaining frame gaps lack exact attribution

**High; priority2.** Near30-FPS averages coexist with visible hitches.

- Mission10 observer regression max347.2ms.
- Mission20 max455.6ms. A442.1ms render call starts10:56:49.086 UTC and ends about10:56:49.528 UTC, inside the interval ending10:56:49.542 UTC.
- Minimal-observer default1080p idle window:167.6ms at11:14:07.453 UTC.
- Minimal-observer portrait guard-area window:243.0ms at11:17:58.654 UTC.
- Instrumented natural replays: default585.7ms, opt-in948.9ms maxima. They include detailed diagnostics/polling/screenshots and cannot be treated as clean production-throughput samples.

The acceptance report retains50>100ms events across distinct contexts. This is not50 equivalent clean-benchmark failures. Prior239.1/533.6/4051.2ms incidents remain historical observations, not proven fixed or necessarily the same problem.

Evidence: [validation-summary.json](<C:/Users/Hp/Downloads/kalki 2898AD/phase5/phase55-validation-20261114/validation-summary.json>); [performance/results.json](<C:/Users/Hp/Downloads/kalki 2898AD/phase5/phase55-validation-20261114/performance/results.json>); [tests/boss-browser-strict-results.json](<C:/Users/Hp/Downloads/kalki 2898AD/phase5/phase55-validation-20261114/tests/boss-browser-strict-results.json>); [profile/correlation-analysis.json](<C:/Users/Hp/Downloads/kalki 2898AD/phase5/phase55-validation-20261114/profile/correlation-analysis.json>); [profile/m20-renderer-cpu.cpuprofile](<C:/Users/Hp/Downloads/kalki 2898AD/phase5/phase55-validation-20261114/profile/m20-renderer-cpu.cpuprofile>).

Investigation entry points: [GameCanvas.jsx](<C:/Users/Hp/Downloads/kalki 2898AD/src/game/GameCanvas.jsx>), [phase54e/ArcBossFight.jsx](<C:/Users/Hp/Downloads/kalki 2898AD/src/game/phase54e/ArcBossFight.jsx>), actor/material/loading lifecycles and browser/OS/GPU scheduling. These are **not proven faulty files**.

**Confirmed:** a major renderer invocation occupies much of the Mission20 gap; the clean-window hitches are measured. Available RAM345.6–1054.8MiB and85–95% memory load confirm pressure. Whole-host CPU and GPU endpoint samples cannot identify the operation responsible for a transient stall.

**Not confirmed:** shader compilation, GC, hard paging, hybrid-adapter synchronization, driver waits, physics, AI or React causing these specific events. A renderer call is a location, not the complete blocking chain.

**Profile caveat:** the separate28.49s capture has a307.1ms first interval overlapping profiler setup, a281.286ms sampling hole and only3 samples inside the interval. After that initial interval, max41.9ms. This is not a clean reproduction of the455.6ms event. No>1ms calls were logged among the selected GL wrappers; other GL calls/OS waits were not exhaustively observed. A nearby sampled function named `free` is not evidence that freeing memory caused the stall.

**Proposed action:** one bounded follow-up only after F1, using explicit setup-complete/measurement markers and an unprofiled control. Capture before/during/after timestamps, render boundaries, resource readiness, long tasks and available memory/GC/scheduling evidence. No screenshots or heap snapshots inside clean timed windows. Do not reopen BIOS/registry/driver experiments or reduce resolution, shadows, AI or physics speculatively.

**Effort:**2–4h maximum capture/correlation budget; stop unresolved if attribution fails. A subsequent attributable small software fix might take4–16h, but the actual repair cannot responsibly be estimated before the operation is identified. A platform/driver issue may have no safe in-project fix.

**Acceptance:** preserve raw events and every>100ms gap; require timestamp-supported operation attribution before changing code. After a justified repair, use identical build/route/quality/power/resolution and3x120s combat windows plus3 matched transitions. Separate setup/loading from active play. No promise that another profile will establish causation.

## F3. Original enemy-role requirements lack implementation evidence

**High requirement/coverage gap, not a failed existing fight.** The original master brief names rifle guards, shock troops, heavy enforcers, ranged drones, elite guards and bosses. The current roster exposes scout, warrior, heavy, glassStalker and glassBrute with shared close-range infrastructure. Dedicated rifle/drone/elite acceptance is absent; a renamed scout or an arc boss does not close it.

Affected files: [combatSystem.js](<C:/Users/Hp/Downloads/kalki 2898AD/src/game/combatSystem.js>) (ENEMY_TYPES line11, spawn/health/damage lookup), [CombatEnemies.jsx](<C:/Users/Hp/Downloads/kalki 2898AD/src/game/CombatEnemies.jsx>), [RiggedEnemy.jsx](<C:/Users/Hp/Downloads/kalki 2898AD/src/game/RiggedEnemy.jsx>), [EnemyArmor.jsx](<C:/Users/Hp/Downloads/kalki 2898AD/src/game/EnemyArmor.jsx>), [missionExpansionContent.js](<C:/Users/Hp/Downloads/kalki 2898AD/src/game/missionExpansionContent.js>). Supporting requirement: [campaign-enemy-requirements.json](<C:/Users/Hp/Downloads/kalki 2898AD/campaign-enemy-requirements.json>); preservation evidence: [existing19-definition-regression.json](<C:/Users/Hp/Downloads/kalki 2898AD/phase5/phase55-validation-20261114/existing19-definition-regression.json>).

**Cause:** incomplete delivery/evidence against the stated taxonomy, not a proven rendering failure hiding implemented roles. Future faction proposals are not playable content.

**Required decision:** approve explicit implementation within existing missions under a separately authorized feature scope, or explicitly accept/defer named roles. Do not silently move requirements, add campaign missions or treat this plan as permission to introduce new combat features.

**Effort:**1–2h requirement/evidence matrix. If implementation is authorized: rifle24–48 engineering-hours, drone24–48h, elite12–24h, shared regression12–20h; original/licensed art/animation approximately28–64 additional asset-hours. These are provisional ranges, not a commitment or authorization.

**Acceptance:** each approved role has live detection/navigation, telegraphed attack, collision/line-of-sight, damage/reaction/death/reset and keyboard/touch counterplay evidence. Rifle attacks respect cover, drones stay in safe bounds, elite behavior differs meaningfully. Preserve all existing encounters and10 genuine1v1 bosses. A named approved limitation stays unimplemented, not falsely passed.

## F4. Boss/enemy presentation remains below the quality target

**High for claimed final encounter presentation.** Actual Mission40/20 captures show shared block-like bodies, simple surfaces and form-specific primitive attachments. Distinct functional attacks/phases pass; final art has not been accepted.

Evidence: [tests/boss-40-intro.png](<C:/Users/Hp/Downloads/kalki 2898AD/phase5/phase55-validation-20261114/tests/boss-40-intro.png>); [tests/boss-20-intro.png](<C:/Users/Hp/Downloads/kalki 2898AD/phase5/phase55-validation-20261114/tests/boss-20-intro.png>); [tests/ui-stage-landscape-hud-full.png](<C:/Users/Hp/Downloads/kalki 2898AD/phase5/phase55-validation-20261114/tests/ui-stage-landscape-hud-full.png>). Code: [phase54e/ArcBossFight.jsx](<C:/Users/Hp/Downloads/kalki 2898AD/src/game/phase54e/ArcBossFight.jsx>) (shared body, Plate/Ring pieces and form attachments around lines20–45), [phase54e/arcBosses.js](<C:/Users/Hp/Downloads/kalki 2898AD/src/game/phase54e/arcBosses.js>), [RiggedEnemy.jsx](<C:/Users/Hp/Downloads/kalki 2898AD/src/game/RiggedEnemy.jsx>), [EnemyArmor.jsx](<C:/Users/Hp/Downloads/kalki 2898AD/src/game/EnemyArmor.jsx>).

**Confirmed explanation:** the renderer deliberately assembles those shared geometric forms/materials. That explains the appearance; it does not invalidate the distinct move sets. Final quality is a visual acceptance judgement, not a geometry-count test.

**Correction:** agree a representative ordinary enemy/boss quality benchmark; improve one reversible pilot's silhouette, surfaces and attack/defeat presentation. Preserve hitboxes/attacks/phases/rewards and fallback. Use original/licensed non-protected assets. Do not redesign the entire city/arenas to disguise one crude model or change protected Bhairava/rollback content.

**Effort:**4–8h benchmark/specification,16–32h reviewable pilot (not finished-art promise). Fully authored model/UV/PBR/rig/animation/LOD work may require40–100 asset-hours per boss, with24–48h shared integration/QA; ten could require400–1000 asset-hours before ordinary enemies. Validate the pilot's finish before estimating/authorizing all ten. Modular reuse may reduce effort; recoloring is not ten completed identities.

**Acceptance:** matched normal-gameplay shots and full action/defeat playback, clear silhouettes/telegraphs and no culling/weapon/feet/costume/shadow regressions; measured texture/geometry/VRAM/draw-call budgets; unchanged encounter behavior; affected tests then ten-boss regression if shared assets/rendering changed. Actual gameplay and explicit visual approval are required.

## F5. Animation fidelity and balancing lack comprehensive approval

**Medium coverage gap.** Live damage/counterplay, movement and all boss phases function; static animation checks pass. Detailed deformation, contact and perceived fairness are not established by a scripted win. Boss end health varies about33–100; this does not prove imbalance or fairness, or a universal heavy-attack exploit.

Affected: existing player/enemy rigs, `player/RiggedBhairava.jsx`, `RiggedEnemy.jsx`, `phase54e/ArcBossFight.jsx`, `combatSystem.js`, `bossSystem.js`, `cinematics/CinematicStage.jsx` under the project source root.

**Action/effort:**4–8h structured clip/contact review and8–16 tester-hours of representative novice/experienced counterplay;2–8h only for a subsequently demonstrated small defect. No arbitrary damage increase or protected animation replacement.

**Acceptance:** documented tell/recovery windows, hit registration versus visible attacks/colliders, block/dodge behavior, every attack/phase and reset, plus human difficulty/presentation judgement. New defects need evidence and a fresh targeted estimate.

## F6. Mobile overlay coverage and misleading duel counters

**Medium usability issue.** Expanded mobile panels/buttons reduce peripheral combat visibility. The reviewed central player remains visible; do not mislabel this as a confirmed total player obstruction. Arc panels show `ARC-FINAL DUEL0/0` and `PURSUERS0/0` during a live duel.

Evidence: [tests/ui-stage-portrait-hud-full.png](<C:/Users/Hp/Downloads/kalki 2898AD/phase5/phase55-validation-20261114/tests/ui-stage-portrait-hud-full.png>); [tests/ui-stage-landscape-hud-full.png](<C:/Users/Hp/Downloads/kalki 2898AD/phase5/phase55-validation-20261114/tests/ui-stage-landscape-hud-full.png>); [tests/ui-visual-stage-results.json](<C:/Users/Hp/Downloads/kalki 2898AD/phase5/phase55-validation-20261114/tests/ui-visual-stage-results.json>); [tests/input-browser-results.json](<C:/Users/Hp/Downloads/kalki 2898AD/phase5/phase55-validation-20261114/tests/input-browser-results.json>). Files: [GameHud.jsx](<C:/Users/Hp/Downloads/kalki 2898AD/src/game/GameHud.jsx>) lines104–122, [compactHud.css](<C:/Users/Hp/Downloads/kalki 2898AD/src/game/compactHud.css>), [ui54d.css](<C:/Users/Hp/Downloads/kalki 2898AD/src/game/ui54d.css>), [player/MobileControls.jsx](<C:/Users/Hp/Downloads/kalki 2898AD/src/game/player/MobileControls.jsx>).

**Confirmed counter cause:** arc-final definitions have empty ordinary-objective/enemy arrays; generic count formatting therefore produces0/0 and ordinary route-cleared messaging. This is display logic, not boss deadlock. Layout area consumption is visible, but no single CSS declaration has been isolated as its sole cause.

**Correction/effort:** contextual duel/phase display instead of meaningless counts,2–4h; targeted responsive panel/spacing adjustments,4–8h. Preserve every action, target size, unlimited sprint and existing layout architecture. Do not invent stamina. Preserve the independent14 campaign copies even if an active source file also contains paused integration.

**Acceptance:** all3 HUD modes at430×932,844×390,720p/1080p; correct ordinary/duel information, player/attack readability, hittable controls and no overlap/clipping/page scroll; actual touch counterplay, objective expansion and pause continue to work.

## F7. Landscape mission launch requires scrolling

**Medium/Low navigation issue, not an unlock failure.** The initial launch action is aroundCSS y670.8 in a390px-high landscape viewport; scrolling reaches it and horizontal overflow tests pass.

Affected: `MissionSelect.jsx`, `ui54d.css` and the existing scroll container. Evidence: `tests/ui-visual-stage-results.json` and its landscape mission-selection capture. Exact responsibility for spacing needs layout inspection; do not invent a single-selector root cause.

**Correction/effort:**2–4h for a clear scroll affordance and a small landscape spacing/navigation refinement. Preserve100 archive entries/10 arcs and unlock logic.

**Acceptance:** action is visible or clearly discoverable by scrolling, keyboard focus scrolls it into view, touch/keyboard launch works, no clipped labels and no gameplay page scroll.

## F8. Physical-device and natural-flow coverage is missing

**Medium coverage limitation, not a confirmed runtime defect.** Mobile tests ran on laptop Chrome emulation, not a phone. Game-over layout used a forced UI fixture. Full main-route Missions2–9 reuse valid earlier evidence; natural completion of every video, first-clear, natural death and long-session/device matrices were not freshly certified.

**Action/effort:**6–12h focused missing-coverage work, avoiding gratuitous repeats. Test fresh disposable first-clear, actual damage→death→restart, relevant video completion and affected routes. Physical checks require hardware: approximately4–8h per representative Android device, with availability wait unknown. Human balancing is separate.

**Acceptance:** genuine death stops play and restart correctly resets state without reward duplication; relevant fresh mission completion/Continue and video transitions pass; a declared physical Android baseline runs controls/combat/chase/orientation/restart with actual buffer/distribution data. Otherwise explicitly constrain support and obtain acceptance of that limitation. Emulation never becomes a physical PASS.

## F9. Warnings, save history and test-harness failures are not gameplay rejections

**Low/disclosure.** Build/lint pass with9 warnings:4 MenuScene,1 CorrectedCity,2 paused MissionSelect imports and2 paused Batch20Gameplay immutability warnings. None is demonstrated as the stall cause; no unrelated refactor or paused-campaign cleanup is justified.

The named personal save is currently readable/consistent and its11 database-file content hashes stayed unchanged during prior validation. No independent pre-update baseline proves its earlier history. That is an evidence limitation, not a corrupted-save finding. Never rewrite it to make a normalizer comparison pass.

Sandbox denial, stale dialogue-region selector, empty preview folder and inappropriate opt-in readiness in the first default attempt were harness failures; corrected retests pass. They do not justify game-code fixes. Retain those failed logs.

**Action/effort:**1–2h evidence/coverage matrix;2–4h test-only setup/screenshot markers if required for F2. Historical-save comparison depends on an independently supplied earlier baseline; discovery time is unknown. No current save repair is indicated.

**Acceptance:** build/lint have no errors or new warnings; disclose existing9. Disposable Continue/reward/replay/reload/browser-restart tests pass; original save checks remain read-only with unchanged hashes. Historical claims remain limited when no older baseline exists.

## F10. Broader environment, voice and campaign limitations stay deferred

Sparse default scenery, repeated opt-in Kashi façades/activity, unfinished broader world/character art and missing full voice/story coverage are accurately observed context. They do not authorize a city rebuild,81 missions or Phase6 under this plan. Relevant files/assets: `World.jsx`, `WorldArchitecture.jsx`, `phase54e/CorrectedCity.jsx`, `phase54e/cityAssets.js` and menu imagery.

**Action/effort:**0 implementation hours in this Phase5-only correction plan; record the limitations under their original workstreams. Kashi remains opt-in/unaccepted. Boss/enemy presentation under F4 remains relevant. Full city/campaign art is excluded from the estimates.

## Prioritized plan and effort boundaries

1. **Safeguards/approval gate,1–2h:** verify47 hashes,14 copies, current-source baseline and save no-write policy; explicitly approve default-ending scope and the disposition of role/art requirements.
2. **F1 first repair,8–16h including targeted tests:** prepare default ending bounds correctly through loading. Measure normalization and following rendering separately; revert only that change if readiness/animation/save tests fail.
3. **F2 bounded investigation,2–4h cap:** one meaningful follow-up after removing the known cost, with setup markers/clean control. Stop unresolved when the budget ends. A supported repair needs its own estimate; no indefinite diagnostic cycle.
4. **F6/F7 usability,8–16h combined:** counters first, then smallest panel/scroll changes. Preserve functional settings/controls and all paused work.
5. **F3/F4 only after scope approval:** explicit role disposition and one approved visual pilot before expensive role/art production. No new mission or protected asset modification is implicit.
6. **Affected regression/approval,6–12h plus applicable human/device time:** reuse unchanged evidence; retest changed paths, and all ten bosses when shared combat/model/rendering changes. End with saves/integrity/build/lint/cleanup.

Estimates are focused developer/artist/tester hours, not autonomous-chat wall time. Shared QA must not be double-counted. A narrow existing-system repair/UX/revalidation allowance is roughly24–48 developer-hours, excluding unknown-cause repairs, new-role development, full boss-art production and hardware waits. A reliable final approval date is not available until F2 attribution and F3/F4 acceptance scope are settled. No small pilot is falsely costed as final production art.

## Specific proposed Phase5.5 acceptance gates

These thresholds are proposals for approval, not retroactive test results or already-approved scope changes.

- **Integrity:**47/47 protected hashes,14/14 independent campaign copies, exact source diff; no personal-save reset/schema change, no new mission promotion; default environment unchanged and Kashi opt-in.
- **Known transition cost:** prepared normalization/bounds application below5ms, conservative full-animation coverage, no repeated costly full skinned scans on mount/first culling. Three default and three opt-in matched natural replays pass. Following522ms render cost is separately measured/resolved or explicitly accepted.
- **1080p consistency:** actual1920×1080, balanced settings, declared hardware/power; proposed average29–31 FPS, p95≤40ms and p99≤50ms for the existing30-FPS cadence. Aim for no unexplained active-gameplay/transition gap>100ms in3x120s representative combat windows and matched transitions. Preserve every outlier; good averages cannot override unexplained severe maxima. If infeasible, report failure and request an explicit limitation decision rather than lower resolution or quietly relax a gate.
- **720p/mobile:** measure720p separately, not as1080p proof. Declare CSS/buffer/DPR/device. Any physical-phone30-FPS claim needs the declared phone/profile and distributions; emulation remains functional/layout evidence. Explicitly mark load/setup/screenshot intervals.
- **Function:** all existing ten bosses' attacks/phases/defeat/relic/reward/reload; ordinary enemy collision/damage/death; keyboard/touch actions, unlimited sprint, Bujji/chase, affected objectives and pause/resume/exit. Human fairness/presentation approval is separate from scripted wins.
- **Role coverage:** each approved original role has implementation/live evidence, or a user-approved named limitation. No campaign additions.
- **Visual quality:** agreed boss/enemy benchmark, normal-camera captures and full animation/defeat playback, readable telegraphs and no clipping/weapon/feet/shadow defects; geometry counts, concept art and builds are insufficient.
- **Persistence:** disposable Continue/unlocks/exact-once rewards/replay/reload/browser restart pass. Original profile/origin data stays unchanged; historical preservation claims require an older baseline.
- **Build/cleanup:** no build/lint errors or introduced warnings; disclose existing9. Stop owned test browsers/captures/servers and preserve failed attempts, logs, images and rollback points.

## Rollback protocol

Before any approved change, compare the current source hash with the reviewed baseline and retain a timestamped copy. Do not overwrite the14 independent campaign files. Active source containing paused integration requires a focused patch preserving that integration, not whole-tree restoration. Keep new assets non-protected and reversible. Change one verified concern at a time; retain before/after data and an exact manifest. Roll back only the failed change. Never conceal defects with user-save restoration, automatic teleportation, forced reload, deleted caches or reduced visual quality.

## Evidence index and review boundary

- [validation-summary.json](<C:/Users/Hp/Downloads/kalki 2898AD/phase5/phase55-validation-20261114/validation-summary.json>)

- [profile/correlation-analysis.json](<C:/Users/Hp/Downloads/kalki 2898AD/phase5/phase55-validation-20261114/profile/correlation-analysis.json>)

- [final-integrity.json](<C:/Users/Hp/Downloads/kalki 2898AD/phase5/phase55-validation-20261114/final-integrity.json>)

- [personal-save-readonly/results.json](<C:/Users/Hp/Downloads/kalki 2898AD/phase5/phase55-validation-20261114/personal-save-readonly/results.json>)

- [tests/boss-browser-strict-results.json](<C:/Users/Hp/Downloads/kalki 2898AD/phase5/phase55-validation-20261114/tests/boss-browser-strict-results.json>)

- [tests/mission10-browser-results.json](<C:/Users/Hp/Downloads/kalki 2898AD/phase5/phase55-validation-20261114/tests/mission10-browser-results.json>)

- [tests/ui-visual-stage-results.json](<C:/Users/Hp/Downloads/kalki 2898AD/phase5/phase55-validation-20261114/tests/ui-visual-stage-results.json>)

- [chase/contract-live-results.json](<C:/Users/Hp/Downloads/kalki 2898AD/phase5/phase55-validation-20261114/chase/contract-live-results.json>)

- [lint.log](<C:/Users/Hp/Downloads/kalki 2898AD/phase5/phase55-validation-20261114/lint.log>)

All146 active source files remained byte-identical during review;47/47 protected hashes and14/14 preserved campaign copies match. Personal storage-file hashes stayed unchanged during this review; no personal browser was launched and no save was written. No tests, servers or implementation were started. Only this requested plan was created.

**Recommendation: approve the narrowly scoped F1 repair and bounded F2 evidence plan first, with explicit roster/art acceptance decisions before broader work. The existing REJECT remains until applicable gates pass or limitations are explicitly accepted. Stop for approval; no fixes, campaign expansion or Phase6 are authorized by this document.**
