# Phase 5.4A.2 diagnostic correction report

**13 November 2026, IST. Outcome: INCONCLUSIVE — reliable gameplay wait-chain attribution was not achieved. No production changes.**

The initial stop/export ordering problem was corrected and a synthetic retention check passed before a Windows reboot. The reboot interrupted the first gameplay attempt. Recovery then exposed additional diagnostic defects, including a stale-request replay that replaced the validation ETL. A shortened gameplay attempt was incomplete at the original deadline. Do not treat this phase as a performance pass, a root-cause finding, or fully validated recovery instrumentation.

## 1. Scope and references

Reviewed [Phase 5.4A.1](phase54a1-follow-up-report.md), including its circular-overwrite failure and GPU-query observer overhead. Work was limited to diagnostic helpers under [phase54a2-20261113](phase54a2-20261113/). The accepted Phase 5.3 game build, missions, controls, Bhairava behavior, saved player progress and protected assets were not modified. No experimental shader warm-up or rendering-quality change was applied. No Phase 5.5.

Supporting results:

- [Consolidated results and unavailable measurements](phase54a2-diagnostic-results.json)
- [Initial failed validation](phase54a2-20261113/validation-run.json)
- [Original validation retry result](phase54a2-20261113/validation-2-run.json)
- [Pre-reboot retention analysis](phase54a2-20261113/validation-2/coverage-validation.json)
- [Interrupted gameplay attempt](phase54a2-20261113/gameplay-run.json)
- [Incomplete recovery attempt](phase54a2-20261113/gameplay-resume-run.json)
- [Recovery failure and evidence limitations](phase54a2-20261113/recovery-failure.json)
- [Final preservation checks](phase54a2-20261113/final-preservation.json) and [cleanup](phase54a2-20261113/cleanup.json)

## 2. Trace-buffer and stop-sequence correction

The previous circular capture stopped Windows recording only after Chrome export. That allowed relevant scheduling events to be overwritten even though the recorder reported no lost events.

The corrected capture sequence used:

1. Short **file-mode** Windows segments, armed after the test page/gameplay readiness checks. No circular overwrite policy.
2. An asynchronous page-to-controller severe-gap signal, received independently of large frame/Chrome exports. A small stop request was written immediately.
3. A separate administrator recorder with a two-second post-roll, followed by the Windows stop command and file finalization.
4. Chrome trace export only after Windows confirmed its trace was saved. Stop-command, save and export timestamps were retained separately.
5. No GPU elapsed-query polling, which had itself caused large observer delays in Phase 5.4A.1. No CPU sampling profiler or extra shader warm-up was run.

Safeguards were a 900-second collection deadline from the first Windows start, at most three planned gameplay windows, a 256 MiB raw-segment stop threshold, a 2 GiB retained-evidence budget, 10 GiB minimum free space, admission reserve for merging, and peak-size sampling during finalization. These are polling/admission safeguards, not a filesystem quota or proof that an arbitrarily short transient peak cannot exceed a threshold. Watchdog scheduling delay is recorded explicitly.

### Initial validation failed and was preserved

A separate blank page, rather than the game, ran a deliberately labelled 1,200 ms busy interval. The initial harness failed because its CDP binding was not available after navigation. It also treated a null process exit code as failure despite WPR reporting that it saved the trace.

The binding was replaced with a navigation-safe exposed function and checked before arming. WPR finalization was changed to a direct `ProcessStartInfo` process with explicit output draining and exit-status retrieval. This was one validation retry within the original deadline, not a production fix or an unreported passing attempt.

### Retention validation passed before the reboot

The retry captured a **1,206.4 ms synthetic rAF delivery gap**, containing the requested 1,200 ms blank-page busy interval. This is an instrumentation test, **not gameplay performance evidence**.

- Stop-signal reception latency: **7.4 ms** after the detected gap ended.
- Windows stop command: **00:46:11.941 IST**, after the two-second post-roll.
- Windows trace saved: **00:46:40.667 IST**.
- Chrome export started: **00:46:40.758 IST**, after the Windows save.
- Original parsed main-thread context-switch counts: **419 before, 446 during and 600 after** the synthetic busy interval, using the recorded validation ranges.
- Corresponding owned/target context-switch counts: **3,156 / 3,039 / 4,692**.
- Reported Windows event loss: **0**; Chrome `dataLossOccurred`: **false**.
- The validation checked timestamp coverage and retained events before/during/after the interval, not merely the loss counter. Recorder mode was File, and the checked ordering passed.

This demonstrated the corrected stop/retention path at that time. Its later evidence-integrity limitation must not be omitted.

## 3. Reboot, recovery defects and artifact integrity

Windows reports **LastBootUpTime = 00:52:03.500 IST**. The first gameplay runner had entered setup before that time, and its runner/helper/samplers were absent afterward. This explains their disappearance and the reset clock/session. The cause of the reboot was not investigated, and it is **not** an explanation for the historical gameplay stalls.

A recovery attempt stayed within the original deadline but exposed a serious harness error: the restarted recorder remembered only the first validation key, reread the stale `validation-2` request, and **replaced that validation ETL and its recorder metadata**. Shared telemetry filenames were also reused by the resumed runner, so current root telemetry contains post-restart data rather than preserved pre-restart telemetry. These are diagnostic preservation failures; they are not game defects.

The original validation Chrome trace, frame journal, parsed CSVs, coverage result and run-embedded recorder snapshots remain. The original validation raw ETL is no longer available. The current ETL in that directory is a later replay and **must not be paired with the old parsed CSVs or cited as the validated raw recording**. An [artifact provenance warning](phase54a2-20261113/validation-2/ARTIFACT-PROVENANCE-WARNING.md) identifies this explicitly. Original recorder snapshots are retained separately from the run report.

Thus the earlier observed retention pass is retained as derived evidence, but its original raw ETL cannot now be independently reprocessed. No replacement hash or passing status is retroactively assigned to the replayed file. Earlier Phase 5.4A/5.4A.1 reports and protected game assets were not affected.

## 4. Repeated gameplay attempt and performance measurements

The first gameplay attempt was interrupted in setup by the reboot and produced no measured gameplay window.

One shortened recovery attempt reached the accepted game at:

- WebGL drawing buffer: **1920×1080**.
- CSS canvas: **1920×1080**; DPR approximately **1**.
- Rendering adapter: **NVIDIA GTX 1650 through ANGLE/D3D11**.

Its planned controller window was 15 seconds. At the recorded endpoint, the player was alive with health 88 and score 700; two enemies were defeated and the remaining heavy enemy was active. This supports limited combat/control activity, not mission completion or regression acceptance. No severe-event notification was recorded in that short attempt; a maximum-stall claim cannot be independently verified without the frame journal.

The Windows stop command was issued at **00:57:27.617 IST**, approximately **878.3 seconds** after the original first Windows start. The file finalized at **00:57:50.758 IST**, approximately **901.5 seconds** after that start. No new collection was started to extend the deadline; the final seconds were file finalization.

The original 900-second browser deadline closed Chrome while finalization/export was in progress. Windows saved `combat-1/system-gpu.etl`, and Chrome reported `dataLossOccurred=false` before export, but the browser trace file is **zero bytes** and the in-page frame journal was not durably harvested. A zero loss flag does not make a zero-byte export usable.

**New gameplay average FPS, p95, p99 and maximum frame time: NOT AVAILABLE.** They are null in the consolidated results, not zero and not passing. The run remains incomplete. No synthetic measurements, earlier Phase 5.4A.1 values, or viewport dimensions are substituted for missing gameplay measurements.

There is no sufficiently synchronized target event/browser trace/frame journal for reliable wait-chain attribution. The saved kernel trace is preserved, but unrelated faults or GPU activity are not used to invent a cause.

## 5. Wait-chain findings and remaining uncertainty

Confirmed in this phase:

- File-mode recording with immediate signaling and post-roll retained the original synthetic interval before Chrome export.
- A Windows reboot interrupted the initial gameplay runner.
- Recovery lacked stale-request, immutable-output and cross-boot admission guards.
- Frame data was not durably saved before an export interrupted by the deadline.

Not established:

- The blocked operation, wait object or dependency responsible for the historical 1,118 ms, 3,878.1 ms or 8,249.3 ms gameplay events.
- Whether a specific gameplay stall was caused by an owned hard fault, scheduler starvation, Chrome/GPU IPC, a driver/fence wait, GC coordination or another subsystem.
- Stable 1080p/30 FPS, or any production performance improvement.

RAM pressure and non-executing thread intervals remain prior evidence and hypotheses from earlier phases. They were not promoted to an exact cause by this incomplete attempt. No mission/AI/physics/rendering rewrite is justified by these results.

Shader warm-up measurements remain in [Phase 5.4A.1](phase54a1-follow-up-report.md). No new warm-up experiment was performed here, and the observed reduction in shader-query work is not used as an explanation of the severe stalls.

## 6. Additional diagnostic corrections and validation status

Canonical diagnostic helpers now include:

- Rejection of sessions whose Windows boot time is later than their preflight; no reuse of clocks or pre-reboot PIDs as ownership proof.
- Recognition of existing segment artifacts and rejection of stale, reused or unversioned requests. Requests carry a unique ID and creation timestamp.
- Unique telemetry output directories and refusal to record into nonempty segment folders.
- Validation-source checksums, with a check before gameplay admission. The old coverage result is not silently upgraded with checksums of the replacement ETL.
- A durable frame checkpoint after the Windows stop command and **before** merge/export.
- Bounded finalization grace rather than closing Chrome during an already-started export. No additional gameplay windows may start after the deadline.

JavaScript, PowerShell and Python syntax checks passed. **These additional recovery/durability guards were not runtime-validated after the collection bound expired.** The corrected capture procedure therefore remains incomplete as a fully validated restart-safe tool. Archived failed and earlier helper versions are retained for inspection, not recommended for execution.

## 7. Preservation, safeguards and rollback

Fresh final comparisons matched **47/47 protected files, 112/112 source files, 5/5 configurations, 52/52 public assets, 61/61 earlier reports and 7/7 initial audit reports** against the recorded baseline. No expected protected hashes were updated.

At cleanup, WPR was idle, no owned diagnostic runner/helper or listener on port 5422 remained, retained diagnostic data was approximately **371 MB**, and C: had **54.17 GB free** (decimal). Recorded size peaks remained below the retained-data budget; the preservation defects described above are separate from resource-limit compliance. No project files were deleted to free storage.

No production-source rollback or user-save restoration is needed because this phase changed neither. Closing isolated test browsers removed runtime wrappers. Preserve all remaining logs, traces, failed results, parsed outputs and diagnostic source versions. Do not run a blanket worktree reset or blindly cancel another recording. Do not execute archived unsafe recovery scripts.

The overwritten validation ETL cannot be restored from this phase's saved files; that failure is explicitly documented rather than described as a successful rollback. A future approved run must use a fresh session directory, current boot identity and immutable segment identifiers.

## 8. Recommendation and stop decision

**Stop with attribution inconclusive. Do not approve production optimization or performance acceptance on this evidence.**

If further work is approved, first validate boot-change rejection, stale-request rejection, non-overwrite behavior and durable export interruption handling using disposable diagnostic fixtures. Then run one fresh, bounded real-game capture with the now-validated safeguards. Require retained events before/during/after the actual target interval, zero reported trace loss, verified source checksums and independent frame data before interpreting a dependency chain. Do not automatically launch another investigation or new phase.

Future gameplay acceptance still requires actual 1920×1080 output near 30 FPS, with per-window average/p95/p99/maximum and all long gaps reported. The previously proposed gates remain: at least 29.5 FPS, p95 ≤40 ms, p99 ≤50 ms and maximum ≤100 ms for a strict pass; multi-second active-play gaps block acceptance. These are future targets, not results of this phase.

**No Phase 5.5. Await user approval.**
