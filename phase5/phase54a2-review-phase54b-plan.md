# Phase 5.4A.2 review and Phase 5.4B plan

**13 November 2026, IST. Review only; no new diagnostics or production implementation.**

**Recommendation: proceed with conditions to a narrowly scoped Phase 5.4B plan, after approval.** First validate evidence-preservation safeguards using disposable fixtures. One bounded investigation using an independent live wait-chain source is technically worthwhile; repeating the same ETL/export procedure unchanged is not. Shader readiness is a separate, limited optimization candidate. The severe-stall cause and overall performance acceptance remain open.

## 1. Review basis and current verification

Reviewed [the correction report](phase54a2-diagnostic-correction-report.md), its consolidated results, current recorder/capture/coverage-validator code, provenance warnings and evidence index. Also checked the earlier shader results against the six retained raw frame/native-call journals. No capture, gameplay test, diagnostic-helper execution or production edit was performed during this review.

Fresh read-only checks found:

- **47/47 protected files match** their expected hashes. No expected hashes were updated.
- **18/18 currently indexed evidence files match** the post-recovery index. This verifies their current identity, not the identity of the overwritten original ETL.
- `combat-1/frames.json` remains absent; `combat-1/browser.trace.json.gz` remains **zero bytes**.
- The original validation coverage JSON has **no input-hash manifest**. It must not be retroactively upgraded using the replacement ETL.
- All six earlier shader samples remain internally consistent with their retained raw maximum frame intervals and program-info-query totals. This is a consistency check, not an independent benchmark reproduction or a new proof of original-file provenance.

The review creates only this requested document. Production, missions, controls, Bhairava behavior, saves and protected assets remain untouched. No Phase 5.5.

## 2. Evidence ledger: usable, qualified and missing

### Retained evidence with a valid limited interpretation

- **Original synthetic validation Chrome trace, frame journal, parsed CSVs, coverage result and run-embedded recorder snapshots:** these preserve the observed pre-reboot retention test. It recorded a 1,206.4 ms synthetic frame gap, a 7.4 ms signal latency, Windows save before Chrome export, and main-thread switch counts of 419/446/600 before/during/after the busy interval. They support that the stop/retention path worked once. They are not gameplay measurements, and the lost source ETL prevents independent reprocessing of the original Windows trace.
- **Initial failed validation:** preserves the missing-binding error and unreliable exit-code handling. These were harness failures, not game regressions.
- **Windows boot-time record:** establishes a reboot at 00:52:03.500 IST after the first gameplay attempt began. It supports the interruption account. It does not explain why Windows rebooted or identify the cause of historical gameplay stalls.
- **Recovery run metadata:** establishes actual 1920×1080 buffer/CSS dimensions, approximately DPR 1, GTX 1650 rendering, limited combat activity, saved Windows stop information and the deadline/export failure. Health 88, score 700 and two enemy defeats are limited activity evidence, not a mission regression pass.
- **Recovery gameplay ETL:** remains a saved Windows artifact. Without a complete synchronized frame journal/browser trace or target severe-event notification, it cannot establish the historical stall's wait chain.
- **Earlier Phase 5.4A/5.4A.1 measurements:** remain historical evidence of severe gaps and smaller shader costs. They are not fresh Phase 5.4A.2 performance results.

### Lost or unusable for the claimed purpose

- **Original validation ETL and original on-disk recorder metadata:** replaced by stale-request replay. The current `validation-2/system-gpu.etl` is a different recording. Never pair it with the original parsed CSVs or coverage result. Run-embedded metadata snapshots survive, but they are not a recreated raw trace.
- **Pre-restart shared telemetry files:** overwritten by reuse of output names. Current root telemetry is post-restart data; it cannot fill the earlier timeline.
- **Recovery gameplay browser trace:** zero-byte export, therefore unusable despite the earlier `dataLossOccurred=false` message.
- **Recovery gameplay frame journal:** never durably harvested. Average FPS, p50/p95/p99 and maximum are unavailable, not zero and not passing.

Do not reconstruct missing frames from a nominal 30 FPS cap, infer percentiles from a 15-second controller duration, or synthesize an ETL from parsed CSVs. The post-recovery evidence index documents what remains; it does not repair the loss.

### Root-cause hypotheses — still unconfirmed

Prior memory pressure and low main-thread CPU relative to wall time justify considering owned paging, scheduling delay, browser/GPU IPC or synchronization, and GC worker/safepoint coordination. They do not distinguish those mechanisms or establish one primary cause. A supported dependency must overlap a newly captured stall before selecting a repair. GPU saturation/VRAM exhaustion, expensive enemy AI/physics and network loading have not been established as the severe-stall cause. The later reboot and recovery failures explain missing diagnostics; they do not explain the older gameplay gaps.

## 3. Diagnostic safeguard assessment

### Supported by the pre-reboot synthetic trial

- Navigation-safe stop signaling after the first binding failure was corrected.
- File-mode collection rather than circular overwriting, independent two-second post-roll, and Windows save before Chrome export.
- Recorder exit-status handling through a direct child process.
- Retained-event counts and temporal coverage in addition to event-loss flags.
- Removal of GPU elapsed-query polling from the new stall capture.

This is a **qualified historical validation**, since its original raw ETL was subsequently lost. It is not validation of every later recovery guard or of a real gameplay wait chain.

### Present in source, but not runtime-proven

- Boot-versus-preflight rejection; discovery of existing segment keys; request timestamps/IDs; unique telemetry directories; nonempty-directory refusal.
- Validation-source hashes checked at gameplay admission.
- Frame checkpoint before merge/export and finalization grace at the deadline.

The code review confirms these mechanisms are present. Their earlier syntax checks do not prove that they withstand restart, races, partial writes or delayed callbacks. The current coverage result lacks the new hashes, so the canonical runner would reject it rather than accept the replayed ETL; do not bypass that failure to resume this session.

### Remaining gaps to close before collecting again

1. **Session identity is incomplete.** Request IDs are generated but acknowledgements/stop messages are not consistently matched to an immutable run, boot, request and process-creation identity. Boot rejection happens at helper startup; a mid-run reboot must invalidate the session rather than invite recovery into the same directory. The timestamp check should reject implausible future requests as well as old ones.
2. **Non-overwrite checks are not atomic.** Checking files before writing leaves a race between helpers. Admission needs exclusive creation/ownership, immutable attempt directories and refusal of existing outputs. A stale `stop-request.json` also needs identity/freshness validation. No generic mutable output path should serve two attempts.
3. **Durability is still late.** A whole-frame checkpoint after Windows stop is better than post-export harvesting, but it still depends on a responsive renderer. Use small sequenced checkpoints during the run, record durable acknowledgements and expose any dropped/unflushed tail. Use temporary files plus atomic completion/manifest publication; do not equate a partially written JSON file with a completed acknowledgement.
4. **Budget enforcement is partly advisory.** Raw-size/free-space checks poll; the WPR merge loop has no firm timeout and only reports a size breach after merging. A 60-second browser grace does not bound every recorder/export wait. Define separate collection and finalization limits, reserve merge space, and preserve incomplete output on expiry rather than silently extending or deleting evidence. Never stop an unrelated recording to recover ownership.
5. **Completeness needs semantic checks.** Counts above zero and zero reported loss do not prove every needed dependency is decoded or continuously retained. Require matching identities/clocks, complete source files, expected markers, source hashes, correct thread mapping and coverage of the actual target interval. Unsupported events and missing fields remain explicit limitations.

Required disposable-fixture tests: stale request/reply, reused ID, pre-existing output, two competing helpers, truncated acknowledgement, simulated boot-ID change, process exit, full output queue, deadline during merge/export, and export failure. Use small fake fixtures and labelled blank-page waits; do not reboot Windows, overwrite real evidence or alter game saves to test these guards. Any preservation failure stops admission to gameplay capture.

## 4. Is a different bounded investigation worthwhile?

**Yes, conditionally: one independent, in-flight Windows Wait Chain Traversal (WCT) snapshot attempt, paired with a durable browser frame journal.** Its value is observing a supported wait while it is happening, rather than depending on an ETL and Chrome export surviving later. It cannot guarantee the cause will be exposed.

WCT follows thread/object dependencies for supported waits, including ALPC, COM, critical sections, mutexes, SendMessage and process/thread waits. Use its asynchronous session mode so a query can be cancelled rather than blocking the recorder indefinitely. [Microsoft WCT documentation](https://learn.microsoft.com/en-us/windows/win32/debug/wait-chain-traversal).

`GetThreadWaitChain` requires debug privilege and reports access/unsupported conditions. A one-node result may mean either a running thread or an unsupported wait; it does **not** rule out a GPU/driver/page-in delay. A snapshot can become stale immediately, and WCT is not a complete GPU-fence, paging or scheduler trace. Permission feasibility must be checked before testing, without changing drivers/services or treating this plan as UAC approval. [API contract and limitations](https://learn.microsoft.com/en-us/windows/win32/api/wct/nf-wct-getthreadwaitchain).

### Proposed collection design — not implemented

- Use a fresh immutable session directory, current boot identity, accepted build and isolated browser profile. Bind the renderer/GPU process and relevant thread identities to process creation times; never reuse old PIDs as proof of ownership.
- Persist small sequenced frame/rAF and event batches during play, independently of Chrome trace export. Keep a durable controller heartbeat and renderer heartbeat separate. A stale renderer heartbeat with a healthy controller is different evidence from both going stale.
- An external watchdog should query the owned renderer/GPU threads when the renderer heartbeat is about 500 ms stale, **before the next frame resumes**. Triggering only after a one-second gap ends may miss the blocked operation again. Record query start/end, statuses, nodes, cycles, CPU-time progress and heartbeat timing. If both heartbeats stall, classify the observer/system delay rather than blaming the renderer.
- Limit queries to the first incident, at most five snapshot sets with short asynchronous timeouts, then retain a short post-roll and stop. Correlate any eventual frame gap with the snapshots' actual timestamps. A supported named dependency during that same interval is stronger than temporal co-occurrence; an unknown node is not a cause.
- Cap the whole armed session at 15 minutes, at most three comparable combat windows, one incident capture, 128 MiB of journal/snapshot output and at least 10 GiB free disk headroom. Allow at most 60 seconds of separately labelled finalization. Setup, cache/power/background conditions and truncations must be reported; no automatic restart or deadline reset after a reboot.
- Do not run WPR or GPU timer-query polling in this alternative by default. Include a lightweight control to assess observer overhead. If no useful event occurs, permissions fail or WCT cannot describe the wait, stop with that result; do not fall into another unbounded ETW cycle.

User-mode stack minidumps are a possible separately approved escalation, not part of this first attempt. They may perturb the process, consume memory/disk and still lack the necessary symbols/kernel context. Microsoft recommends capturing from a separate process to avoid target-process deadlock risks. Full-memory dumps or dumps of unrelated user applications are not recommended here. [MiniDumpWriteDump documentation](https://learn.microsoft.com/en-us/windows/win32/api/minidumpapiset/nf-minidumpapiset-minidumpwritedump).

**Decision rule:** one supported, time-aligned dependency can justify a narrowly targeted repair proposal. Unsupported/late snapshots, observer failure or no reproduction justify an inconclusive stop, not a claimed root cause. No WCT snapshot can retroactively assign the historical 1,118 / 3,878.1 / 8,249.3 ms events.

## 5. Shader warm-up as an isolated optimization

The earlier runtime-only trial recompiled the existing three basic-material warm-up objects against the settled scene. Current raw journals corroborate:

- Control program-info-query totals: **62.0 / 59.0 / 9.3 ms**; largest calls **22.2 / 24.6 / 4.1 ms**.
- Warm totals: **3.0 / 1.4 / 1.5 ms**; largest calls **1.4 / 0.6 / 0.9 ms**.
- Pre-combat warm-up waits: **49.9 / 33.6 / 1.0 ms**.
- Controls submitted compile/link work during play; warm trials shifted the observed targeted work before the window.

This supports a **small shader-readiness candidate**, not a severe-stall repair. The first control included an extra depth variant; browser/driver caches were shared, conditions/outcomes varied, and diagnostic GPU polling itself reached 242.9 ms. Warm frame maxima were 465.9 / 119.8 / 223.2 ms. Thus whole-game speedup and stable pacing were not established.

After separate approval, limit the patch to readiness/cancellation around the existing warm-up group and actual observed program keys/light configuration. Do not repeatedly compile every frame, invent a timeout-based readiness shortcut, suppress shader error checks, dispose live R3F resources or expand to unverified depth variants. Keep any warm-up wait outside active control and preserve intended intro/replay cinematics.

**Component gate:** three fresh introductions and three saved replays, matching targeted keys; first-use targeted queries ≤4 ms in every trial, with no late compile/link submissions for those identified variants once active control begins. Report all pre-combat waits and memory/program retention. Require no new intro timeout or unexplained loading regression; a median increase over 10% across comparable runs needs review. Native-call timing for this component must be separate from profiler-free frame-pacing acceptance.

Risks are delayed startup, retained programs, wrong keys and stale completion after mission/round change. Validate mission switch/unmount/replay cancellation and first attack/defeat. This candidate can be approved independently of the severe-stall investigation, but it cannot close that blocker.

## 6. Prioritized Phase 5.4B plan

### P0 — preservation and admission tests

Freeze the current evidence with its provenance labels; never recreate the lost ETL or overwrite old reports. Establish a fresh run/boot/attempt identity and atomic output ownership. Validate the fixture cases in section 3 before any real recording. Acceptance requires deliberate stale/reused/restarted inputs to fail closed without changing protected fixture outputs, and frame evidence to survive export interruption.

**Rollback:** stop only verified owned helpers and leave fixtures/results intact. Restore only backed-up diagnostic helper files if required. Do not resume an old run directory or execute archived unsafe recovery scripts.

### P1 — one independent evidence attempt, if approved

Use the bounded WCT/journal design above. Preserve actual resolution, quality, game build and normal controller route; record power, background workload, available memory and clocks. No teleport, reload workaround or state forcing to conceal a stall. End with a supported dependency, non-reproduction, unsupported wait or incomplete capture decision.

**Validation/rollback:** prove snapshot timestamps overlap the event, the controller remained responsive, identities match, journal sequences/source hashes are complete and loss/truncation is explicit. Close query sessions and the isolated browser; remove runtime wrappers by closing that context. This requires no game-source or save rollback. No automatic repeat if inconclusive.

### P2 — narrow shader-readiness patch, independently approvable

Back up and hash the affected warm-up/helper/readiness-caller files, then implement only the evidence-supported change. Preserve the accepted build and all user changes; do not assume a clean Git repository or perform a blanket reset. Compare one change at a time against the same baseline with no shader-cache deletion or quality reduction.

**Validation/rollback:** meet the component gate and affected gameplay tests below. Revert only the exact affected source files if the benefit is not repeatable or loading, memory, controls or visuals regress; rebuild and verify hashes. Keep the rejected candidate and evidence. Never restore an old save over newer player progress as a source rollback.

### P3 — production repair only after evidence; final assessment

If P1 identifies a specific application dependency, propose the smallest repair with a measured causal expectation before editing. If it implicates an unsupported kernel/driver wait, retain the limitation and seek a separate decision rather than changing rendering architecture. Do not implement speculative particle pooling, AI/physics throttling, shadow/detail cuts or driver/BIOS/registry changes.

A shader component pass may coexist with an unresolved severe-stall failure. Phase 5.4B must finish with explicit passed/failed/not-reproduced/not-tested/deferred outcomes. No automatic Phase 5.5 or performance acceptance.

## 7. Performance and regression acceptance

These are proposed gates, **not achieved results**.

- **Desktop:** actual 1920×1080 drawing buffer and CSS dimensions, recorded DPR and GTX 1650 adapter, same quality/build and documented power conditions. Nominal budget 33.33 ms; per qualifying window average ≥29.5 FPS, p95 ≤40 ms, p99 ≤50 ms, maximum ≤100 ms. The percentile allowance covers modest jitter/cadence quantization; frames over 33.33 ms are still over budget.
- **Tails:** report p50/p95/p99/max and counts above 33.33/50/100/250/1,000 ms for every repeat. A strict pass has no >100 ms gap. A 100–250 ms exception needs explicit conditional approval; >250 ms fails this gate, and every multi-second active-play gap remains a blocker. Do not pool repeats into a passing average.
- **Sampling:** at least three matched profiler-free baseline/candidate windows for the changed scenario, then qualifying repeats covering Mission 1 exploration, normal/multiple-enemy/boss combat, Mission 2 combat and Bujji chase before broad acceptance. Use 60-second active windows where feasible, with cold entry, first use and transitions separately labelled. A bounded mixed replay session can assess rare gaps; finite coverage is not proof that a rare historical event can never recur.
- **Loading/cinematics:** keep all boundary gaps and actual durations. Intended cinematic length is not a stall, but black-screen hangs, intro timeouts and unresponsive transitions fail. Do not trim first attacks or reclassify active combat as loading. Renderer-submission timing is not presentation latency or input latency; verify responsiveness separately.
- **Memory:** no OOM, context/device loss or persistent unexplained resource growth across repeated steady replay. Record owned/private memory, system commit/headroom and available GPU metrics; distinguish caching from a leak. No fixed per-game RAM/VRAM budget or page-in threshold has been proven here, and system page-ins are not owned hard faults.
- **Mobile:** desktop touch emulation validates only the tested layout/input behavior. Preserve the mobile cadence policy. Actual phone performance requires a named device and its measured buffer/settings; otherwise report physical-mobile performance NOT TESTED rather than extrapolating GTX results.

For every retained significant production change, run build, lint and relevant automated tests, separating pre-existing warnings. Test Mission 1 replay through boss defeat/ending, Mission 2, Bujji chase/replay, camera obstruction, contract intros/video loading, pause/settings/navigation/audio and all three HUD modes. Check keyboard and touch movement/attack/block combinations, releases, cancellation and pause/focus transitions. Individually smoke-test Missions 3–10 without calling unfinished prototype endings complete.

Preserve Bhairava's movement, facing, target assistance, animation/hit timing and mission-specific behavior; sampled animation activity is not permission to redesign AI. Verify save/reload completion, unlocks and rewards against the accepted repeat-reward policy using isolated fixtures, never the user's live browser storage. Recheck all 47 expected protected hashes before and after each retained change; a mismatch stops work rather than updating the manifest. Hashes do not substitute for visual/runtime tests of shared materials and animations.

## 8. Handoff decision

**Conditional next-stage plan recommended; production implementation is not authorized by this review.** The highest-priority requirement is trustworthy evidence preservation. One different-source, bounded live-wait attempt has a reasonable technical purpose once its admission tests pass. A small shader-readiness patch has a measured component basis and can be considered separately. Broad optimization and stable-1080p acceptance remain unsupported.

Only this review document was created. No lost evidence was recreated, no original report replaced, and all 47 protected hashes still match the fresh review check. Stop here and await user approval.
