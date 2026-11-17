# Phase 5.4B performance implementation report

**13 November 2026. Finalized 13/11/2026, 02:45:33 IST.**

**Recommendation: CONDITIONAL PASS for retaining the isolated shader-readiness change; broad stable-1080p performance acceptance remains OPEN.**

**Overall stable-1080p/30 performance criterion: FAIL / not established**, because full-route transition and replay exceptions exceed the stated thresholds. This is separate from the functional regression verdict and the narrow basic-material improvement.

The planned narrow implementation and bounded evidence attempt are complete. No visual redesign or Phase 5.5 work was performed. Approval is required before proceeding. The change demonstrably avoids the wrong basic-material light variant; it does not establish a cause or repair for the historical multi-second stalls.

## Scope, baseline and preservation

Reviewed the approved Phase 5.4A.2 review/Phase 5.4B plan and its investigation limitations. Preflight independently matched all 47 protected hashes, 112 source entries, 5 configuration entries, 52 public assets, 61 earlier reports and 7 original audit reports. No usable Git worktree was assumed; explicit source copies and SHA-256 manifests provide rollback.

Only these production files changed:

- `src/game/FirstUseMaterialWarmup.jsx`: require the actual player, no loading fallback, idle cinematic/contract state and two matching scene-configuration samples; re-arm on mission/round replay.
- `src/game/shaderWarmup.js`: add optional configuration/stable-frame readiness to the existing cancellable scheduler. Its default behavior remains unchanged for other callers. Compile once per admitted effect; cancel pending work on cleanup and do not dispose live R3F materials.

Visible geometry, lighting, shadows, particle counts, physics, AI, controls, cinematics, audio, mission definitions and save schema were not changed. No new material variants or depth warm-up were added. Scene configuration tracks light types/counts/shadow flags, fog and renderer configuration; moving light positions/intensities do not cause recompilation.

Rollback originals are in [source-before](phase54b-20261113/source-before/). The exact [two-file diff](phase54b-20261113/production-changes.diff), [preflight](phase54b-20261113/preflight.json), and [final hash verification](phase54b-20261113/final-changes-and-hashes-v2.json) are preserved.

## Method and limits

Baseline and candidate observer builds were produced from the same saved source/settings, with only the two backed-up warm-up files substituted in memory for the baseline. Observer exports were identical. A separate production build contains no observer-export plugin. Tests used fresh nonpersistent Chrome contexts rather than the user's live profile, save data or rewards.

All comparison samples verified actual WebGL drawing buffer **1920×1080**, CSS canvas **1920×1080**, DPR approximately **1**, and ANGLE/NVIDIA **GTX 1650** rendering. This establishes render dimensions, not an independent visual-quality rating. No quality/resolution reduction, shader-cache deletion, driver change, background-app closure or power-setting change was used.

The host snapshot during the comparison reports AC online, battery 100%, about 934 MiB available physical RAM, about 18,162 MiB system commit in use and 1,682 MiB page-file usage. It is a point-in-time observation, not continuous proof of power/RAM constancy or owned hard faults. See [host snapshot](phase54b-20261113/performance-host-start.json). **Final power observation changed to AC OFFLINE, battery59%; the change time was not continuously recorded.** Therefore identical power conditions across all trials are NOT established. These results cannot establish an AC-controlled performance improvement or broad acceptance. No charger delay/retest was imposed; the bounded stage stops with that limitation. See [condition review](phase54b-20261113/condition-review.json). Existing background processes were retained. System RAM pressure remains relevant context, not an attributed cause here.

Frame measurements are consecutive main-render **start-to-start intervals**, nearest-rank percentiles and arithmetic means. They are CPU/browser submission timing, not GPU completion, DWM presentation or input latency. Leading/trailing coverage and hidden-tab observations are retained in raw data. Shader API wall times are not compiler CPU/GPU time.

The shader trials wrap native shader calls. The independent frame-pacing comparison has no native GL wrappers, GPU timer polling, WPR or CPU profiler; it retains lightweight render/rAF/long-task and startup warm-up observation. Its automatically generated raw shader-counter zeros are **not measured zero calls**: native shader counts were not collected in those windows. The normalized summary explicitly marks them unavailable.

## Stage 1: shader-readiness result

### Confirmed evidence

The old readiness predicate could run while a cinematic was playing, compiling against **10 point lights**. Settled gameplay has **9**. In all three baseline shader trials, active play then submitted six shader compilations and three program links for the three basic-material variants. The candidate warmed the existing group against idle gameplay's nine-light keys. All three candidate fresh-intro trials had no compile/link submissions in the subsequent measured window, with targeted queries below 4 ms.

| Trial | Build | Warm phase | Point lights | Late compile calls | Late link calls | Query total ms | Largest query ms | Final programs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| before-1 | before | playing | 10 | 6 | 3 | 6.4 | 2.4 | 52 |
| after-2 | after | idle | 9 | 0 | 0 | 1.2 | 0.5 | 49 |
| after-3 | after | idle | 9 | 0 | 0 | 1.6 | 0.6 | 49 |
| before-4 | before | playing | 10 | 6 | 3 | 6.9 | 2.6 | 52 |
| before-5 | before | playing | 10 | 6 | 3 | 7.2 | 2.6 | 52 |
| after-6 | after | idle | 9 | 0 | 0 | 2.3 | 1.6 | 49 |

Each candidate fresh introduction completed normally. Candidate warm-up asynchronous wall waits were 34.0 ms / 18.6 ms / 15.9 ms. These were completed before the recorded combat windows; they are not loading-screen duration. Initial and final texture count stayed at 110; final geometry count was 156 in these trials. Baseline programs grew from 49 to 52; candidate stayed at 49. Browser JS heap snapshots are preserved, but neither program counts nor JS heap prove VRAM usage or absence of a long-term leak.

### Saved replay and residual first use

Three separate completed-Mission-1 save fixtures were launched through the menu. The target nine-light basic keys were warmed in all three. Every targeted basic-material query was at most 0.7 ms. However, every replay also submitted one additional late program pair and queried a **depth** key. The first pair/query share the same recorded timestamp; the native compile/link records do not themselves carry program IDs. This is evidence of residual first-use work, not permission to assume all shader stutter is solved or expand the patch.

| Replay | Largest targeted basic query ms | Late compile calls, all programs | Late links, all programs | Other query | FPS | p95 ms | p99 ms | Max ms |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| after-1 | 0.7 | 2 | 1 | depth: 9.6ms | 29.87 | 35.1 | 35.8 | 145.8 |
| after-2 | 0.4 | 2 | 1 | depth: 2.5ms | 30.00 | 35.0 | 35.4 | 40.6 |
| after-3 | 0.6 | 2 | 1 | depth: 1.8ms | 29.00 | 35.4 | 75.2 | 169.6 |

Thus the targeted query gate passed 6/6 candidate intro/replay trials. The broader no-late-compilation guard is **not** universally passed: saved replays contain residual depth-program work. The 145.8 / 169.6 ms frame gaps and the third replay's p99 75.2 ms/FPS 29.00 fail strict frame-pacing acceptance in those instrumented windows. No synchronized wait-chain was armed in these separate shader trials, so their exact causes remain unknown. The depth query of 9.6 ms does not explain either entire gap.

The controlled route includes seven seconds of settling before attacks. No input/cinematic gating was added to wait for compilation; these trials do not prove zero warm-up overlap if a player attacks immediately on the first controllable frame. Existing controls remain responsive in the functional checks below.

### Loading comparison

Whole setup includes menu navigation, actual scene/character startup, the intended opening cinematic and a fixed settling delay. It is not isolated network/asset-load duration. Shader-instrumented setup median was **44,431 → 51,676 ms (+16.3%)**, exceeding the plan's 10% review trigger. The separate interleaved frame-pacing series was **44,263 → 44,428 ms (+0.37%)**. Shared driver/browser caches and trial order confound cold-start attribution. There is no consistent measured candidate setup regression across both series, but cold-start latency is **inconclusive**, not an unconditional loading-performance pass. No timeout was bypassed, shortened or removed.

Evidence: [raw shader comparison](phase54b-20261113/shader-comparison/results.json), [saved replay shader data](phase54b-20261113/saved-replay-shader-comparison/results.json), [normalized measurements](phase54b-20261113/performance-summary.json).

## Stage 2: one bounded alternative wait-chain investigation

Used Windows asynchronous Wait Chain Traversal (WCT), independent renderer/controller heartbeats and sequenced fsync journals. No WPR or circular ETL capture was used. A brief startup-only Chrome user-timing marker established exact page renderer PID/TID; tracing stopped before the measurement window. Windows thread descriptions/process creation identities were checked against that mapping. A CPU-activity guess from the first synthetic pipeline trial was preserved and superseded, not used to attribute gameplay.

Safeguard tests passed **8/8**: stale/future and mismatched run/boot rejection, exclusive output ownership/race rejection, existing-output preservation, incomplete acknowledgement rejection, sequence/queue limits, deadline and retained journal prefix on simulated failure. Scheduler unit tests passed **7/7**. Native named-mutex fixture verified the supported worker→mutex→owner chain. A managed .NET wait yielded an uninformative single-thread result; that limitation is preserved. The corrected blank-page busy fixture captured an in-flight snapshot against the exact renderer thread during a known synthetic 1,200 ms busy interval. It is **not gameplay performance**. No real reboot was induced and no lost historical ETL was recreated.

The one actual armed session used a 15-minute/three-case/one-incident limit, at most five snapshot sets, 128 MiB output ceiling and 10 GiB free-space floor. It ended after **335.6 seconds**, using **1.29 MiB** of session output, without restarting or extending the investigation.

| Case | Status | Recorded duration s | FPS | p95 ms | p99 ms | Max ms | Missing journal sequences | Unflushed durable-tail frames |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| case-1 | MEASURED | 61.0 | 29.97 | 35.3 | 35.9 | 116.1 | 0 | 0 |
| case-2 | MEASURED | 61.1 | 29.98 | 35.4 | 38.8 | 63.4 | 0 | 7 |
| case-3 | FAILED | 50.4 | 29.78 | 35.3 | 40.7 | 188.8 | 0 | 7 |

Two windows completed. Case 3 stopped around 50 seconds because the ordinary-input automated player was defeated; it is a truncated/failed comparison, not a complete 60-second pass. All three enemies had been defeated in each case, followed by time near the arena/post-combat area. These are mixed combat/post-combat windows, not continuous full-minute multi-enemy combat.

No ≥500 ms renderer-heartbeat incident occurred, so the real gameplay run produced **zero triggered WCT snapshot sets**. There is no new supported blocked operation/dependency to attribute. Historical 1,118 / 3,878.1 / 8,249.3 ms events remain unresolved and cannot be retroactively assigned to a GPU, driver, GC, paging or AI operation.

No journal identity/sequence gaps were detected. Durable packet counts were 241 / 240 / 198. Cases 2 and 3 had seven final frames outside the last durable heartbeat batch; normal final frame exports retain them. A crash at that instant could have lost that explicitly bounded tail. fsync writer maxima were 91 / 102 / 164 ms; observer overhead is real, and these measurements are not the profiler-free acceptance series. The analysis does not call a missing WCT incident proof that no other stall is possible.

[Session evidence](phase54b-20261113/wct-session-724a3f3c-d602-4a0e-a872-93afc1d882cf/) · [coverage/limits analysis](phase54b-20261113/wct-analysis.json) · [fixture log](phase54b-20261113/protocol-tests.log).

WCT supports only specified user-mode dependencies; a single-node response can mean a running thread or an unsupported wait, and cannot rule out kernel/driver/GPU/page-in delays. See [Microsoft WCT contract](https://learn.microsoft.com/en-us/windows/win32/debug/wait-chain-traversal) and [GetThreadWaitChain requirements](https://learn.microsoft.com/en-us/windows/win32/api/wct/nf-wct-getthreadwaitchain).

**Decision: bounded investigation complete, severe-stall cause NOT REPRODUCED / unresolved. No speculative repair was made.**

## Stage 3: separate 1080p frame-pacing comparison

Three baseline and three candidate 60-second windows were interleaved B/A/A/B/B/A with identical settings/route. Fresh contexts share browser/driver caches; this is not six cold-cache boots. Each contains initial ordinary-input combat and later post-combat idle. Outcomes and damage differ, so small maximum differences are not a causal whole-game speedup.

Gate: average ≥29.5 FPS, p95 ≤40 ms, p99 ≤50 ms and maximum ≤100 ms. A 100–250 ms exception requires conditional approval; >250 ms fails. Nominal frame budget remains 33.33 ms, and over-budget counts are not hidden.

| Window | Status | FPS | Mean ms | Median ms | p95 ms | p99 ms | Max ms | >33.33 ms | >50 ms | >100 ms | >250 ms | >1000 ms | Numeric gate |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| before-1 | MEASURED | 29.98 | 33.35 | 34.6 | 35.2 | 35.7 | 73.4 | 1430 | 2 | 0 | 0 | 0 | PASS |
| after-2 | MEASURED | 30.00 | 33.33 | 34.6 | 35.2 | 35.7 | 42.7 | 1435 | 0 | 0 | 0 | 0 | PASS |
| after-3 | MEASURED | 30.00 | 33.33 | 34.6 | 35.2 | 35.8 | 43.2 | 1436 | 0 | 0 | 0 | 0 | PASS |
| before-4 | MEASURED | 30.00 | 33.33 | 34.6 | 35.2 | 35.7 | 39.4 | 1428 | 0 | 0 | 0 | 0 | PASS |
| before-5 | MEASURED | 30.00 | 33.33 | 34.6 | 35.2 | 35.7 | 39.4 | 1432 | 0 | 0 | 0 | 0 | PASS |
| after-6 | MEASURED | 30.01 | 33.32 | 34.6 | 35.0 | 35.6 | 41.8 | 1433 | 0 | 0 | 0 | 0 | PASS |

All six measured windows met that numeric gate. Continuous identical power conditions were not verified, so the full controlled-condition acceptance gate remains OPEN. Candidate results are approximately 30 FPS with maxima 41.8–43.2 ms. Baseline also runs at approximately 30 FPS. **No broad FPS improvement or severe-stall resolution is established.** The improved material-key readiness is supported independently by the shader trials, not by claiming a reduction from the worst historical gap to these new maxima.

Cold entry/cinematic setup is retained separately from active-window frames. No active first attack was trimmed and called loading, but the fixed pre-attack settling period limits first-instant-input coverage. There are no physical-device mobile performance measurements. Three qualifying 1080p repeats of every mission/boss/chase scenario and long-duration rare-event coverage were not completed in this bounded stage; broad stable-1080p acceptance remains unproven. Functional replay traces below are not interchangeable with this controlled comparison.

## Functional transition frame-time tails

The functional keyboard playthroughs also recorded frame intervals. These are headless, observer-bearing full routes, not the matched 60-second comparison. Their pauses/cinematic boundaries remain included and labelled from actual state observations, rather than erased as loading.

| Scenario | FPS, whole trace | Median ms | p95 ms | p99 ms | Max ms | >100 ms | >250 ms | >1000 ms |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| m1-replay | 29.63 | 34.6 | 35.2 | 36.1 | 533.6 | 3 | 2 | 0 |
| m2-keyboard | 29.93 | 34.6 | 35.1 | 36.0 | 165.5 | 1 | 0 | 0 |
| m1-baseline-replay | 29.51 | 34.6 | 35.5 | 38.2 | 466.9 | 3 | 2 | 0 |

The candidate Mission 1 replay has a **533.6 ms** frame gap spanning relic collection and the in-engine ending transition (last observed idle/relic false → playing/relic true), followed by a **451.1 ms** interval containing **446.5 ms** inside rendering. No HTML video is present at those timestamps. The transition completed, but this is a failed transition-pacing gate, not a pass hidden behind average FPS. The exact renderer/blocked operation is not established by these passive observations. No second wait-chain investigation was started.

Contract intro replay also completed naturally in **9,189 / 9,365 ms** on desktop/portrait. Those functional tests used **1280×720 / 520×900**, not the1080p acceptance windows, and their native-call/scene observers recorded maximum renderer walls of **426.8 / 456.8 ms**. No wrapped native call≥4ms was logged; this does not explain the render walls or prove an absence of GPU/driver waits. These are additional transition-performance exceptions, not failed intro functionality.

A single matched baseline replay was added specifically to assess that boundary against the preserved old warm-up files. Baseline functional verdict: **PASS**. Its largest recorded gap is **466.9 ms**, during **cinematic/transition**. One baseline repeat cannot establish causal significance from timing differences; the complete baseline/candidate tails and observed warm-up keys remain available for review. It is not used to manufacture a severe-stall repair claim.

See [full-route frame summary](phase54b-20261113/functional-frame-summary.json), including per-phase statistics, all >100 ms gaps and before/after cinematic/relic states. Touch playthroughs are input/functionality tests without equivalent frame instrumentation; no mobile FPS is inferred.

## Functional regression and build verification

| Check | Actual verdict | Evidence under session root |
| --- | --- | --- |
| m1-replay | PASS | regression/m1-replay/mission-playthroughs.json |
| m2-keyboard | PASS | regression/m2-keyboard/mission-playthroughs.json |
| m1-touch | PASS | regression/m1-touch/mission-playthroughs.json |
| m2-touch | PASS | regression/m2-touch/mission-playthroughs.json |
| missions3to10 | PASS | regression/prototype-smokes/results.json |
| chase | PASS | regression/chase/contract-live-results.json |
| hud | PASS | regression/hud-relay-results.json |
| presentation | PASS | regression/after-selected/presentation-results.json |
| media | PASS | regression/media-readiness/results.json |
| contract-replay | PASS | saved-contract-replay/results.json |

Mission 1 replay and fresh touch playthrough, Mission 2 keyboard/touch playthroughs, relic/reward collection and save/reload assertions are reported by their executed ordinary-input harnesses. Completed-save fixtures only initialize isolated contexts; no real save is overwritten. Mission 1 replay explicitly checks that previously granted rewards remain unchanged. Mission 2 prerequisite completion is a labelled fixture, not a fresh Mission 1 pass.

Bujji contract/chase uses actual keyboard and emulated-touch controls, pause/resume, natural replay intro and handoff; fixtures do not force duel/chase success. Missions 3–10 are **individual bounded prototype smokes**, verifying launch, movement, first objective/encounter activity, pause and save/reload. Their complete endings/rewards are not newly certified.

HUD tests exercise Full/Compact/Minimal on desktop and portrait layouts, plus mute/unmute, volume preference storage and the dialogue panel. Audible output is not independently certified. Their display-state fixture for health/score/boss-bar binding is labelled separately from gameplay. Video tests deliberately delay or fail the ending request in disposable contexts, then verify decoded playback/pause/error continuation; they do not certify a boss kill by themselves. Mission playthroughs provide actual boss/ending-navigation coverage. Some playthroughs use the intended UI skip, so exhaustive full-length media playback is not claimed. Presentation checks capture the normal-time opening, cinematic pause/resume, camera-to-gameplay handoff and relay/pause/settings behavior. All retained screenshots are actual test captures.

Production build passed: `npm run build -- --outDir phase5/phase54b-20261113/production-build --emptyOutDir false`. Lint passed with exit 0 and four **pre-existing** MenuScene.jsx react/immutability warnings; no unrelated warning refactor was made. Build retains the existing bundle-size warning. Diagnostic observer-build source-map warnings are not presented as proof of source-level attribution. See [production build](phase54b-20261113/build-production.log), [lint](phase54b-20261113/lint.log), [unit tests](phase54b-20261113/unit-final.log) and [regression summary](phase54b-20261113/regression-summary.json).

## Final preservation, shutdown and rollback

| Group | Matching / checked | Unchanged expectation |
| --- | --- | --- |
| protectedChecks | 47 / 47 | All match required |
| sourceChecks | 110 / 112 | Only the two authorized source changes allowed |
| auditReports | 7 / 7 | All match required |
| configurationChecks | 5 / 5 | All match required |
| previousReportChecks | 61 / 61 | All match required |
| publicAssetChecks | 52 / 52 | All match required |

The first verification output is preserved; its aggregate incorrectly flagged the two permitted relative source paths because of an absolute-path-only allowlist comparison. The correctedv2 output fixes that diagnostic classification, without changing expected hashes or any production file.

Protected assets: **47/47 match**. Unexpected production source changes: **0**. Previous reports, public assets and configuration remain checked against preflight. Build/test outputs and diagnostics are isolated in the new session directory; no rollback asset, prior screenshot, recording or report was deleted/replaced.

For source rollback, stop only owned test servers/browser contexts, copy the two `source-before` originals back to their exact `src/game/` paths, verify their recorded pre-change SHA-256 values, rebuild, and rerun the affected warm-up/intro/replay smoke. Do not reset the project tree or restore any save. Preserve the candidate/diff and all diagnostic evidence. Runtime instrumentation is removed by closing its isolated context; compiled WCT helpers are not imported by production. No driver/service/registry/BIOS rollback is needed because none was changed.

Final shutdown verification found **zero listeners on the owned test ports and zero matching test/diagnostic processes**. All test scripts returned and their browsers/servers closed; no unrelated process was terminated. C: has **50.08 GiB** free (53.77 GB decimal). Current source/evidence are saved and safe to close. See [shutdown/free-space record](phase54b-20261113/final-host-and-shutdown.json).

Remaining risks: rare severe stalls remain unexplained; saved replays still show out-of-scope depth first use and >100 ms gaps; ending-transition gaps exceed250ms; cold-start median differences are cache/order-confounded; no phone performance or exhaustive branch/long-soak guarantee; no direct GPU completion/VRAM pressure attribution. If functional or protected-hash verification fails, hold approval rather than manufacture a pass.

## Final decision and next action

- **Implemented:** isolated readiness/settled-key correction with rollback copies.
- **Passed:** 6/6 measured frame-pacing windows; targeted basic query threshold in 6/6 candidate shader trials; 15 unit/safeguard tests; the explicitly passing functional checks above; production build/lint as qualified.
- **Failed/conditional:** strict all-program saved-replay pacing/no-late-compilation guard; 145.8 / 169.6 ms instrumented gaps, the533.6ms ending-transition gap and cold-start +16.3% review trigger remain disclosed.
- **Not reproduced:** historical multi-second severe-stall wait chain in the single bounded attempt.
- **Not tested/deferred:** physical-phone performance, exhaustive prototype completion and broad repeated long-duration 1080p mission coverage; any depth warm-up or additional severe-stall repair.

**Recommended next action: review this limited shader change for conditional retention, with overall stable-1080p acceptance explicitly open.** Do not proceed on an unconditional performance claim. Any depth-program warm-up proposal needs isolated evidence/validation and a separate scope decision; no additional diagnostic phase, visual redesign or Phase 5.5 is started automatically. Await user approval.
