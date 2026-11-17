# Phase 5.4A.1 follow-up: wait chain and shader warm-up

**12–13 November 2026, IST. Investigation finished and stopped. No production changes. Severe-stall cause remains unresolved; limited shader warm-up reduced the observed first-use query component, but stable 1080p/30 FPS is not established.**

## Scope and evidence

Used the unchanged accepted Phase 5.3 validation build. Every measured window asserted actual1920×1080 WebGL drawing buffer and CSS canvas, DPRapproximately1 and GTX1650/ANGLE D3D11. Temporary Chrome profiles isolated all test progress from the user profile. No missions, keyboard/touch controls, Bhairava assistance/AI behavior, existing player saves, protected assets, graphics settings or drivers were changed. No Phase 5.5.

Evidence: [diagnostic results](phase54a1-diagnostic-results.json), [raw data and helper source](phase54a1-follow-up-20261112/), [browser correlation](phase54a1-follow-up-20261112/wait-evidence.json), [kernel correlation and retention bounds](phase54a1-follow-up-20261112/wait-chain-assessment.json), [shader measurements](phase54a1-follow-up-20261112/shader-assessment-results.json), [final preservation](phase54a1-follow-up-20261112/final-preservation.json). Earlier reports remain unchanged.

## 1. Bounded wait-chain investigation

The original Windows session started00:01:59 IST. The last segment finalized00:11:53 IST: **594.1 seconds elapsed across both segments, below the900-second deadline**. No more than one combat window was needed after reproducing a severe event; no further wait-chain recording was launched afterward.

The file-mode segment collected scheduling/ready-thread/hard-fault stacks and GPU events but reached the resource guard during the menu lead-in, before combat. It was stopped and preserved. The nominal raw stop threshold was939,524,096 bytes; the observed value when stopping was1,297,350,656 bytes. The polling guard therefore overshot its raw threshold. WPR merging adds temporary storage; its transient peak was not measured and a strict2 GiB peak cannot be certified. This is a resource-control limitation, not a claim that the planned raw threshold held. No files were deleted.

Within the same original deadline, a second segment used fixed-size circular collectors (128 MiB kernel plus32 MiB events) and the existing unchanged combat controller. The browser captured a **1,118.0 ms gap**, then the run ended. Metrics:26.64 FPS; p9549.7 ms; p99142.6 ms; maximum renderer call263.2 ms. The three menu-prelude maxima were69.0/131.2/78.7 ms, but they do not all have complete Windows coverage and are not substituted for combat evidence.

### Confirmed application-thread evidence

The severe submission gap occurred00:09:24.226–00:09:25.344 IST. Renderer PID29972, main TID31100. Its preceding renderer call lasted56.2 ms and its following call9.9 ms. Chrome recorded a1,016.461 ms FireAnimationFrame with26.811 ms renderer-thread CPU, nested in ProxyMain::BeginMainFrame/RunTask ofabout1,017.5 ms wall and27.6 ms CPU. About990 ms of the callback elapsed without that main thread executing CPU instructions. This establishes a large non-CPU interval within the frame-delivery callback; it does not distinguish scheduler delay, page-in, worker coordination or IPC/driver waits. Nested durations must not be added together.

Earlier in this window, getProgramInfoLog took107.1 ms and a720-byte position-buffer upload took61.0 ms. Their timestamps are well before the severe gap; neither is its explanation. Tiny upload size also does not establish geometry bandwidth as the problem. Native wall duration includes descheduling and synchronization, not just execution.

Nearby1-second system samples recorded313.8–396.5 MiB available RAM, approximately28.64–28.68 GiB commit and roughly1,996–6,104system page-ins/second. This confirms pressure and paging during the period, not fault ownership or causation. The original3,878.1 ms and8,249.3 ms historical events remain separate observations, not repaired or retroactively attributed by this new event.

### Kernel attribution failed because the relevant events were not retained

The circular ETL parsed successfully:27,558owned/target context switches,10,286ready events,2,931owned/target hard-fault events and198,570GPU events, with eventsLost=0. **That zero does not account for intentional circular overwrite.**

The earliest retained main-thread switch was00:10:42.039 IST, approximately76.7 seconds AFTER the severe gap ended. There are no retained main switches in the gap and no valid same-time fault/queue chain to analyze. Raw correlation zero overlap values mean missing retained evidence; they must not be reported as zero off-CPU time or proof of no hard faults. The retained later GPU/DWM events cannot establish a dependency for the earlier event. Native stack conversion was not attempted for the absent interval.

The procedure requested Windows stop after collecting/exporting the Chrome trace. That delay allowed the circular trace to overwrite the useful interval. This was a **capture-sequencing failure**, not proof that Windows supplied a complete trace or that a particular subsystem was innocent. Exact blocked operation, dependency owner and kernel/driver reason remain unknown. No extra capture was run to bypass the agreed bound.

## 2. Separate shader warm-up assessment

Six30-second nominal combat windows were measured in alternating order:control,warm,warm,control,control,warm. Each used a fresh isolated context, the same build/resolution/controller and the same pause/settle/resume procedure. No Windows recording or CPU sampling ran during these windows. Both conditions retained the same native-call/passive-frame instrumentation and sparse GPU queries.

The sole experimental difference was awaiting compileAsync on the **existing first-use-material-warmup group**, with the current camera and settled scene/light configuration, before resuming gameplay. Its three existing objects cover health background, health fill and transparent burst/beam basic materials. No material replacement, added effect, shader-error suppression, asset edit or production-source patch occurred.

- control-m1-combat-1: 28.8 FPS; p95 40.1 ms; p99 78.9 ms; maximum **259.0 ms**. Program-info query total 62.0 ms; largest query 22.2 ms; pre-window compile wait 0.0 ms.
- warm-m1-combat-2: 28.8 FPS; p95 41.6 ms; p99 60.7 ms; maximum **465.9 ms**. Program-info query total 3.0 ms; largest query 1.4 ms; pre-window compile wait 49.9 ms.
- warm-m1-combat-3: 29.7 FPS; p95 37.5 ms; p99 50.1 ms; maximum **119.8 ms**. Program-info query total 1.4 ms; largest query 0.6 ms; pre-window compile wait 33.6 ms.
- control-m1-combat-4: 28.7 FPS; p95 44.4 ms; p99 60.1 ms; maximum **388.7 ms**. Program-info query total 59.0 ms; largest query 24.6 ms; pre-window compile wait 0.0 ms.
- control-m1-combat-5: 25.5 FPS; p95 41.9 ms; p99 279.9 ms; maximum **564.3 ms**. Program-info query total 9.3 ms; largest query 4.1 ms; pre-window compile wait 0.0 ms.
- warm-m1-combat-6: 29.8 FPS; p95 38.4 ms; p99 46.7 ms; maximum **223.2 ms**. Program-info query total 1.5 ms; largest query 0.9 ms; pre-window compile wait 1.0 ms.

Controls submitted8/6/6compileShader calls and4/3/3linkProgram calls during the counted windows; warm windows submitted none. Program-info query totals were**62.0/59.0/9.3 ms control versus3.0/1.4/1.5 ms warm**, with warm per-query maxima1.4/0.6/0.9 ms. Warm-up await durations were49.9/33.6/1.0 ms outside combat. Two warm trials added three cached programs before the window; the last already had the needed cache state. This demonstrates an observed relocation/reduction of a specific first-use query component, with an upfront wait/resource cost. It is not pure GPU compiler time or a guarantee of the same benefit on every launch.

Controls had basic-program slow queries with retained cache keys; the first control also had an extra depth variant, so its four-query total is not an exact match to the three-query cases. Shared browser/driver caches, starting program states, memory residency, attack scheduling and health/score outcomes varied. All windows defeated the same three enemies without player defeat, but these were not deterministic full-mission comparisons. Do not interpret the aggregate query difference as a whole-game percentage speedup.

### Diagnostic observer overhead affects frame comparisons

The GPU timer-query polling block itself took up to**242.9 ms** in control5. It began around62427.7 ms and lies inside that window's256.9 ms renderer call at62413.8 ms. Other runs had polling blocks up to40.8 ms. That scope includes disjoint-status, availability/result reads and query cleanup; the individual blocking subcall was not isolated. This is a verified diagnostic overhead contributor, not normal production gameplay code or an explanation of the old unprofiled3.88-second gap.

Consequently, frame maxima above are complete observations but are observer-affected. **Overall frame stability did not pass**, and shader warm-up is not established as the severe-stall repair. Future acceptance runs must omit GPU timer-query polling and heavy profilers; use separate diagnostic runs when GPU timing is needed.

## 3. Confirmed findings and remaining hypotheses

Confirmed: a new severe event persists at actual1080p; the captured callback is mostly non-executing main-thread time; smaller shader/upload costs exist outside that event; late warm-up reduced observed first-use query work; diagnostic GPU polling can materially perturb frame times.

Unresolved: owned hard-fault contribution at the severe timestamp; the awaited object/worker/IPC endpoint; GPU queue/fence completion and cross-adapter dependency; allocation producer and any GC/worker wait; relationship to the historical severe events. RAM/scheduling pressure is a credible working hypothesis, but GPU IPC or other waits are not excluded. No evidence justifies a physics, AI, character, camera or scene-quality rewrite.

The reused wait-harness method string mentions CPU sampling; the executed helper removed Profiler.start/stop. Authoritative evidence here is timeline/thread CPU duration, selected native-call timing and Windows tracing, not a CDP sampled CPU profile. Shader methodology is recorded separately and correctly in its results.

## 4. Recommended next steps — approval required

1. **Repair the diagnostic sequence only before any further wait capture:** signal the independent Windows stop immediately upon the first severe event, BEFORE native/Chrome trace serialization/export. Preserve the browser event in a small bounded journal first, validate pre-trigger retention, and predefine cumulative storage/merge headroom. Remove GPU timer queries from the default reproduction. If another capture is approved, retain a fixed time/window limit and treat missing coverage as an invalid attribution attempt. No automatic repeat or new phase is started here.
2. **A limited production shader-readiness patch is now a supported candidate for separate approval**, targeting the observed basic program keys after the real player and required scene/light configuration commit. Reuse existing materials. Do not just repeatedly compile every frame or wait an arbitrary duration. Depth variants need their own owner/key evidence before expanding scope. Expected benefit is the measured first-use component, not removal of multi-second waits.
3. **Keep broader optimization deferred.** No particle pool, simulation throttling, AI change, material/asset replacement, resolution reduction or driver/system intervention is supported as the severe-stall repair. Keep overall performance acceptance open.

## 5. Risks, rollback and acceptance criteria

A future warm-up patch can delay entry, retain programs, compile the wrong light/shadow key or resolve after replay/unmount. Keep readiness/cancellation tied to the current mission/round and preserve intended cinematics, keyboard/touch input and simulation timing. Do not dispose R3F-owned live resources. No patch should touch save schemas, completion/reward logic, Bhairava assets/behavior or protected files. Diagnostic traces themselves add CPU/RAM/disk overhead; this pass demonstrates why control runs are necessary.

Before an approved production edit, back up and hash only affected source files and preserve the accepted build and current user changes. Keep baseline/candidate outputs separate. Roll back those exact files and rebuild if benefits fail to repeat or loading, visuals, controls or replay regress. Never reset a whole worktree, restore over newer valid saves or delete rollback/evidence files. Runtime-only experiments are undone by closing isolated test contexts; that cleanup is complete.

Proposed shader-component gate: at least three fresh introductions and three saved replays, matching cache keys and light configuration; first-use targeted queries≤4 ms in each measured trial, compile/link shifted before active combat, all warm-up waits reported separately, no new intro timeout or more than10%median loading regression without review. Validate first attack/defeat, boss introduction/defeat, contract replay and ending transitions; preserve shader error reporting. This gate is narrower than overall performance acceptance.

Overall proposed desktop gate remains actual1920×1080 at approximately30 FPS (at least29.5 FPS per qualifying window), p95≤40 ms, p99≤50 ms and maximum≤100 ms, with counts above50/100/250/1,000 ms retained per repeat. Any multi-second active-gameplay gap is a blocker; a100–250 ms exception requires explicit conditional approval, and gaps over250 ms fail the proposed gate. Submission timing must be distinguished from presentation and input latency. Repeat matched profiling-disabled baseline/candidate windows, include first use/transitions rather than trimming them, and keep rare-event coverage bounded. These results do not meet that gate.

Any approved significant production patch additionally needs build/lint/relevant tests and affected Mission1/Mission2/Bujji/HUD/keyboard/touch/save/replay regression, plus47hash checks. Physical-mobile performance remains untested; laptop touch emulation is not a phone benchmark. No new full campaign, build/lint or physical-mobile pass is claimed in this diagnostic-only phase.

## 6. Preservation, resources and stop state

Final verification: **47/47protected,112/112source,5/5configurations,52/52public assets,61/61earlier reports and7/7initial audit reports match** the recorded baseline. No production changes; the user's normal browser/save profile was not accessed. The earlier investigation/review reports and rollback files were not replaced.

Cleanup verified no owned browser/sampler/helper processes or listeners on5411/5412/5413; WPR reports not recording. At cleanup, retained follow-up evidence was1,646,167,654 bytes (about1.53 GiB) and C: free48,458,768,384 bytes (about45.13 GiB), above10 GiB headroom. Derived reports add a small amount afterward. Final retained evidence meets the2 GiB target; transient merge peak remains unverified as described above. Shader collection completed its six-window limit within its separate15-minute ceiling; exact start/end timestamps are preserved in its benchmark-results.json.

**Stop and await approval. Recommendation: retain the accepted baseline, approve only a narrow shader-readiness candidate if desired, and require corrected immediate-stop capture evidence before selecting a repair or accepting the severe-stall issue. No Phase 5.5.**
