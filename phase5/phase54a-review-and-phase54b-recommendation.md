# Phase 5.4A review and Phase 5.4B recommendation

**Review date:** 12 November 2026, IST.  
**Recommendation: REVISE THE PROPOSAL.** Permit a narrowly bounded evidence gate before selecting a repair for the severe stalls; treat shader warm-up as a separate, smaller candidate. Do not authorize broad optimization or claim stable 1080p/30 FPS from the current results. Phase 5.4B has not started through this review, and production changes require approval.

## 1. Investigation summary

Reviewed the [investigation report](phase54a-investigation-report.md) and [optimization proposal](phase54a-optimization-proposal.md), checked their measurements against [reproduction results](phase54a-reproduction-results.json), and consulted the rendering and memory analyses and current warm-up/render-cadence source. No new gameplay benchmarks were run for this review.

The investigation completed 12 warm desktop windows using the accepted Phase 5.3 build: three environment menus and three Mission 1 combat repeats in each of two cohorts. Actual WebGL drawing buffer and CSS canvas dimensions were 1920×1080, with DPR approximately 1 and GTX 1650 rendering through ANGLE/D3D11. One cohort used passive timing; the other added CPU sampling, timeline/GC tracing, selected native WebGL timing and sparse GPU elapsed queries. Both collected Windows and NVIDIA telemetry.

The three control combat windows produced:

- 29.93 FPS; p95 39.3 ms; p99 46.7 ms; maximum 79.2 ms.
- 29.11 FPS; p95 42.8 ms; p99 63.7 ms; maximum 215.7 ms.
- 17.27 FPS; p95 73.9 ms; p99 339.5 ms; maximum **3,878.1 ms**, including four gaps over one second.

The profiled repeats had maxima of 181.8, 272.3 and 148.1 ms. No code changed between cohorts. These are diagnostic comparisons, **not before/after optimization results**. Background workload, cache/residency state and instrumentation overhead prevent attributing their difference to any improvement.

### What the 3,878.1 ms event means

This is a gap between renderer-submission start timestamps during already active combat, roughly 116 nominal 33.3 ms frame budgets. It demonstrates a serious interruption in delivery of game frames. It is not a measurement of 3.878 seconds of CPU computation, presentation latency, or GPU execution. Input response throughout that exact gap was not independently measured.

The gap runs from approximately 49,428.0 to 53,306.1 ms relative to the browser time origin. Its preceding renderer call lasted only 4.0 ms; most of this gap is outside recorded rendering and long-task spans. A **different** 3,309.8 ms gap overlaps a 3,259 ms long task. These events must not be merged into one explanation.

The earlier 8,249.3 ms audit gap contained an 8,237.6 ms renderer call. That exact renderer-dominated event was not reproduced with native-call profiling. The new event establishes that severe stalls persist, but does not establish that all historical stalls share a cause.

## 2. Confirmed findings versus hypotheses

### Confirmed evidence

- Severe interruptions occur in warm gameplay, beyond startup/loading screens. Current measurements fail a stable 1080p/30 FPS claim.
- A profiled 181.8 ms gap overlaps a V8 minor-GC event lasting 164.771 ms wall time, with only 2.224 ms renderer-thread CPU time. GC is a contributor to that specific smaller gap. The allocation producer and reason for the long non-CPU interval are unknown.
- A 219.2 ms renderer call lies inside a 223.791 ms animation-frame callback using 18.219 ms thread CPU. Another callback took about 220 ms wall time but only 9.9 ms thread CPU. These scopes contain substantial waiting/descheduling rather than equivalent continuous renderer-thread computation. Worker-thread execution is not measured by the main thread's CPU duration.
- First-use `getProgramInfoLog` calls took up to 26.4 ms on basic shader variants; depth variants took 11.3 and 5.8 ms in later combat repeats. These are real synchronous query costs, but not isolated compiler CPU time or a seconds-long explanation.
- Physical RAM pressure and system paging are measured. Control combat repeat 3 reached approximately 19.1 MiB available RAM and 26.60 GiB system commit. Nearby samples around the largest gap showed high disk-read latency and little additional owned-renderer CPU time.
- Warm profiled windows recorded no new Resource Timing fetch events. Six Chrome traces explicitly reported no data loss. This does not imply complete kernel, native-call or GPU coverage.

### Hypotheses, not established root causes

1. **System/browser scheduling or blocked-wait delays under memory pressure:** the leading working explanation for the new low-CPU waits. System paging and disk latency support investigation, but process fault totals combine soft and hard faults; they do not prove the game was waiting on a page-in. Fault counts are mostly flat during part of the largest wait.
2. **Browser GPU-process/driver IPC or hybrid-GPU synchronization:** plausible, especially for the historical renderer-dominated event. No timestamp-correlated queue/fence completion chain establishes it. AMD display output alone is not evidence of fault.
3. **GC worker/safepoint coordination or memory residency:** plausible for the captured long GC wall interval. The trace does not prove excessive allocation or justify blaming particles.
4. **Sustained GPU saturation, VRAM exhaustion, heavy AI/physics or texture downloads:** not supported as the severe-stall cause. Sparse GPU intervals were below 23 ms, but cannot rule out an unsampled GPU wait. CPU leaf samples and scene complexity show activity, not isolated on-CPU bottlenecks. No new fetch does not exclude decoding, GPU first use or paging of existing data.

## 3. Root-cause assessment

**The investigation localized several smaller stalls, but did not establish the complete blocking chain for the multi-second event.** The most defensible assessment is mixed frame-delivery and callback waits, with memory pressure a credible contributor. Confidence is insufficient to rank paging versus scheduling versus GPU IPC as the primary cause, or to prescribe a single production repair.

Shader first use and a particular GC pause are confirmed narrower problems. Neither explains the missing seconds. Reducing scene detail, removing cinematics, changing enemy logic or suppressing shader checks would be an unsupported response. The proposal is appropriately cautious, but needs a finite diagnostic stopping rule, explicit branch decisions, quantified acceptance thresholds and per-change rollback gates.

## 4. Evaluation of every proposed optimization/action

### A. Bounded owned-process scheduling/hard-fault/GPU-wait capture

**Retain as the first evidence gate, not an optimization.** Use the same accepted build, controller, actual resolution and synchronized clocks. Record renderer and GPU-process identities, context switches/wait reasons, owned hard faults and supported GPU submissions/completions. Preserve unsupported or missing event categories as limitations.

Revise the scope to one session of at most 15 minutes, with at most three comparable combat windows and the necessary menu lead-in. Stop early after one useful severe event; do not automatically repeat if inconclusive. Set a trace-size cap before starting, retain at least 10 GiB disk headroom, and stop safely if storage or system responsiveness becomes unsafe. Record incomplete captures instead of deleting evidence or extending the session. Elevated tracing, if needed, requires the applicable permission; it is not granted by this review.

**Benefit:** identifying an actionable wait chain; no FPS benefit yet. **Risk:** observer CPU/RAM/disk overhead may alter the event. **Validation:** correlate the same frame gap and process/thread across clocks; inspect event loss and compare a lightweight control. **Rollback:** stop owned recording/test processes, remove runtime observers by closing the isolated browser, and restore the original test invocation. No service, driver or application setting changes are needed.

### B. Extend async warm-up for observed basic/depth variants

**Conditional, small implementation candidate after approval and exact material-owner mapping.** Existing `FirstUseMaterialWarmup.jsx` already warms three basic variants, with readiness conditioned on the real player replacing its fallback. Do not duplicate that work blindly. Match the observed cache keys to actual materials, lights, shadow configuration and first-use events first.

**Expected benefit:** reduce the measured first-use query contribution, up to 26.4 ms for an individual observed query. This is an upper bound on that component, not a guaranteed frame-time saving or a remedy for multi-second gaps. **Risks:** startup delay, extra retained programs/materials, wrong variants, stale completion callbacks after replay/unmount, premature disposal of live resources, and changes to cinematic readiness. Keep error reporting and intended cinematics intact.

**Validation:** three fresh-context introductions and three saved replays; first attack, defeat, boss introduction/defeat and contract-replay intro; verify matching program keys, query timing and visual equivalence. Record startup and gameplay separately, with loading failures and timeouts retained. A reduction must exceed observed run-to-run variation and not regress loading or memory. **Rollback:** restore only the backed-up warm-up/helper/caller files, rebuild, and rerun introduction/replay plus protected checks. Never restore an old user save to undo a rendering patch.

### C. GC/allocation reduction, including particle pooling

**Defer until allocation and wait ownership are demonstrated.** GC overlap is confirmed; the allocating code is not. Pooling may reduce collection frequency, but benefit is unquantified and it may retain more memory on an 8 GB system.

**Risks:** reused effects retain position/color/opacity or expiry state, timers fire against a later effect, cleanup disposes shared geometry, and replay leaks objects. **Validation if justified later:** allocation samples tied to the same GC event; identical effect count, appearance, duration and combat outcomes; repeated defeat/replay cycles with memory trends and frame tails. **Rollback:** restore only the effect/resource-ownership files and remove the new pool; reload the isolated test context and verify shared resources remain valid. No gameplay timing or save-schema changes should accompany it.

### D. Matrix/animation, AI/physics or React update throttling

**Defer; no isolated dominant on-CPU cost has been established.** Desktop rendering is capped at 30 Hz while other R3F updates continue at display cadence. This distinction is intentional and cannot safely be replaced by a global 30 Hz simulation cap.

**Risks:** missed keyboard/touch releases, altered movement/collision, attack windows, assisted targeting, boss AI, camera smoothing and cinematic timing. A render-only change may still disturb callback ordering. **Validation if justified:** measure the affected callback's on-CPU cost first; test motion distance, collisions, attack/block outcomes, enemy decisions and animation transitions at different display cadences and both input modes. Prefer presentation-only savings over simulation changes. **Rollback:** restore the exact affected callbacks/cadence files and run deterministic state/outcome comparisons and replay tests. Do not use teleportation, reloads or altered game speed to conceal waits.

### E. Shadow/texture/geometry reductions or lower resolution

**Reject for the current severe-stall repair.** There is no isolated evidence that these remove the wait. Lower resolution cannot count as meeting the 1080p target, and modifying protected geometry/textures is prohibited.

Possible future unprotected, visually equivalent rendering changes require a measured GPU bottleneck and separate approval. Validate actual buffer size, shadow/scene screenshots, GPU cost and frame tails. Roll back the precise rendering patch if silhouettes, lighting, camera visibility or performance regress. No such implementation is recommended now.

### F. Driver, registry, BIOS or system changes

**Reject from Phase 5.4B implementation scope on current evidence.** These are system interventions, not a proven software optimization. They introduce broad compatibility and power-behavior risk and need a separately reviewed diagnostic finding and recovery procedure. Do not disable hardware acceleration, services or error reporting as a workaround. No system rollback is necessary because none is proposed or performed.

## 5. Gameplay, saves and asset risk assessment

- **Missions and progression:** delayed or stale warm-up completion can block mission entry/replay; resource cleanup can affect a shared scene. Scheduling changes can alter encounter triggers, boss phases, rewards and mission completion. Test mission IDs independently; smoke tests do not certify unfinished endings.
- **Keyboard and mobile controls:** input polling/release, simultaneous movement/attack/block, joystick pointer cancellation, pause/resume and focus transitions must survive. The portrait rendering policy differs from desktop. Laptop touch emulation is not physical mobile performance evidence.
- **Bhairava AI/behavior:** the source has player combat assistance/target selection, including different assistance in Mission 2 and expansion missions; this review does not assert a separate autonomous Bhairava AI subsystem. Preserve targeting, facing, attack range, animation/hit timing and movement locks. Test both assisted and non-assisted paths, plus enemy/boss reactions. No behavior redesign is authorized.
- **Saved progress:** no optimization should migrate storage keys or schemas, reset unlocks, duplicate completion rewards or overwrite the user's browser profile. Test on isolated profiles with copied fixtures; compare unlocked/completed missions, rewards and selected mission across replay, reload and returning to menu. Source rollback and save rollback are different operations; never overwrite newer valid player progress with a backup automatically.
- **Protected assets:** no proposed repair needs a protected-file edit. Shared runtime material mutation/disposal can break presentation without changing an asset hash, so hashes alone are insufficient. Require visual checks plus all 47 file checks. A hash mismatch stops implementation for review rather than updating the expected manifest.

## 6. Prioritized Phase 5.4B plan — approval required

1. **Preserve and scope.** Record the source/config/build fingerprint, current worktree state if available, all 47 expected hashes, settings/power/background-process context and free storage. Preserve accepted build and append-only evidence. Back up each affected source file before any approved edit. Do not assume a usable Git repository or use a blanket reset.
2. **Close the missing evidence gate once.** Execute action A only after approval. If an owned paging/scheduling or GPU wait chain is established, present the smallest repair and its causal expectation. If evidence remains inconclusive or permissions are unavailable, stop this branch with an unresolved blocker and seek a decision; no automatic new phase or open-ended recordings.
3. **Implement only an approved, supported repair.** Action B can be reviewed independently as a limited first-use improvement after owner mapping; it must not be sold as the severe-stall fix. Actions C/D remain gated by their missing attribution. Keep one significant change per comparison and no mission, save or asset redesign in the patch.
4. **Validate immediately and retain/revert.** Use the per-action tests above and acceptance criteria below. If the intended measured component does not improve beyond noise, or functionality/quality worsens, restore the affected files and revalidate. Do not stack unproven changes.
5. **Close with an explicit decision.** Produce before/after results, raw tails, regression outcomes and final hashes. A smaller optimization may pass its own gate while overall performance acceptance remains failed. Unresolved severe stalls require a documented limitation and explicit user decision, not an automatic Phase 5.4 pass. No Phase 5.5.

## 7. Proposed measurable performance acceptance criteria

These are **proposed future gates**, not achieved results or a hardware performance guarantee.

### Desktop target

- GTX 1650 4 GB, Ryzen 5 5600H, 8 GB RAM; record OS/browser/driver/power/build/settings. Assert **1920×1080 drawing buffer and CSS dimensions**, record DPR and rendering adapter at each window boundary; no dynamic resolution or hidden quality changes.
- Nominal frame budget **33.33 ms**. For each active gameplay window, aim for average at least **29.5 FPS**, p95 **≤40 ms**, p99 **≤50 ms**, and maximum **≤100 ms**. The percentile allowance recognizes display/cap quantization and modest jitter; it does not redefine every frame over 33.33 ms as on-budget. Record counts above 33.33, 50, 100, 250 and 1,000 ms.
- Strict performance PASS requires every qualifying repeated window to meet the gates, with **zero gaps over 100 ms**. A 100–250 ms exception needs individual evidence and explicit conditional acceptance; it is not a strict pass. Any active-play gap over 250 ms fails this gate, and every multi-second gameplay gap is a blocker even if averages look good. The present results fail.
- Use renderer-submission intervals for direct baseline comparison, while separately measuring rAF delivery and, where supported, presentation/input-response behavior. Submission timing alone cannot certify displayed frame pacing or responsive controls.

### Sampling and loading boundaries

- After an approved significant repair, at least three matched 60-second windows each for Mission 1 exploration, normal combat, multiple-enemy combat, boss combat, Mission 2 combat and Bujji chase, plus three 30-second windows per menu preview. Include a bounded 10-minute mixed replay/transition session to increase coverage of rare gaps. Do not pool all windows into one passing average.
- Preserve same scenario/controller/quality/power and record available RAM and background workload. Use profiling-disabled runs for performance acceptance and separate profiled runs for attribution; alternate baseline/candidate order where feasible. Inconsistent conditions or incomplete traces remain labelled and cannot silently disappear from the report.
- Measure cold entry, first attack/defeat, boss introduction, saved replay and ending transitions separately. Report loading/readiness/media wait and frame gaps independently. Do not relabel an active-combat gap as loading or trim boundary stalls. Retain censored start/end intervals and actual duration. No cinematic bypass, stuck black screen or intro timeout is acceptable. Establish a matched cold-loading baseline before choosing an absolute startup SLA; require no new failures or more than 10% median loading regression across three comparable runs without review.

### Memory and mobile

- Record physical headroom, commit/limit, owned renderer/GPU-process private/working-set memory, system page-ins, owned hard faults where supported and GPU residency/queue metrics where available. Never substitute process total faults for hard faults or global GPU memory for game allocation.
- No OOM, device/context loss, missing assets, or persistent unexplained resource growth across replay. Investigate a post-settling memory increase above 10% across three equivalent replay cycles; caching differences must be distinguished from leaks. A fixed per-game RAM/VRAM cap is not yet supported by these traces. About 1 GiB available system RAM is a useful operating-headroom goal, not a proven threshold or grounds to discard pressured runs.
- Preserve portrait touch usability and current rendering policy. Proposed mobile pacing goal: at least 30 FPS with the same tail criteria **on a named physical device at its recorded native drawing buffer**, subject to measurement and later approval. Do not claim GTX touch emulation establishes it or require desktop 1080p on every phone. If no device is available, report physical-mobile performance NOT TESTED; emulation only validates the tested layout/input behavior.

## 8. Testing, preservation and rollback strategy

For every retained significant change, production build, lint and relevant automated tests must pass; identify unchanged warnings separately. Follow the action-specific validation above with Mission 1 replay through boss defeat and ending, Mission 2 keyboard/touch and cinematic transitions, Bujji chase/replay, all three HUD modes, pause/settings/navigation, camera obstruction checks, audio/dialogue and individual Missions 3–10 smoke tests. Record passed, failed, not reproduced, not tested and deferred separately. Save/reload must preserve completion, rewards and unlocks without duplicate grants. Existing accepted tests are prior evidence, not fresh passes.

Maintain separate baseline/candidate outputs with source hashes and original logs/screenshots. Use isolated browser profiles; never clear the real user's storage or terminate unrelated applications to obtain a result. Preserve valid save fixtures and rollback files, and stop rather than delete evidence if storage becomes insufficient.

Before editing, make a timestamped copy and checksum of only the affected files; preserve any pre-existing user changes. After each significant change, verify protected hashes before continuing. On a failed gate, stop owned tests, restore those exact source files, rebuild and rerun the affected critical scenario and hash checks. Keep the failed candidate and evidence for review; do not overwrite accepted reports or blindly reset a worktree. Closing an isolated runtime removes diagnostic wrappers. Do not restore unrelated assets, configs or newer saves as part of source rollback.

### Current read-only verification

Fresh checks during this review matched **47/47 protected files, 112/112 accepted source files, 5/5 configuration files and 52/52 public assets** against the recorded Phase 5.4A expected hashes. No gameplay, save, protected-file, system-setting or production-source change was performed. Only this requested review document was created.

The two reviewed reports remain immutable inputs, with SHA-256:

- `phase54a-investigation-report.md`: `2d12bd18bf380098d5a01b1b7d1f2f19b092790721684363bbe3620619b4cd6a`
- `phase54a-optimization-proposal.md`: `8c91e5518939666947fa279b3800df729cd3626fa63ed74778084032260001e4`

**Final recommendation: REVISE THE PROPOSAL using these evidence, scope and acceptance gates. Approve the bounded first step separately; do not begin production optimization or Phase 5.5 through this review. Stop here and await user approval.**
