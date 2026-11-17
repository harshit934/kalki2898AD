# Phase 7.1 stutter investigation

16 November 2026 (Asia/Calcutta). **First-use rendering initialization established as a major source in reproduction; exact native driver operation and attribution of each historical gap remain limited.** No evidence attributes the interruptions to the user. All interaction in these captures was controlled test input, not user interruption.

## Historical incidents

Reviewed the visual-verification report, results CSV and rollback report. Original document-relative timestamps:

- 7,935.1 ms: preceding callback gap 2,275.4 ms; overlapping main-thread task started 5,694.4 ms and lasted 2,245 ms.
- 19,777.4 ms: preceding callback gap 3,683.8 ms; overlapping task started 16,093.8 ms and lasted 3,688 ms.

Both were labelled natural-opening with the cinematic overlay present. Some early time includes scene readiness. Original evidence has no call stacks; it cannot retrospectively prove the responsible operation for each exact incident. No backgrounding was recorded.

## Bounded reproduction and diagnosis

Created `stutter-work/staging/`, an untouched `stutter-work/rollback/` and an exact initial compiled-build copy from the working Phase 7.1 version. One before capture and one authorized candidate retest used fresh disposable Chrome sessions sequentially, 960×540/DPR1, identical graphics/content, 1 ms CPU sampling, passive rAF/long-task records, limited WebGL shader-call instrumentation and Windows memory monitoring. No new packages or assets.

Before reproduction captured cinematic-overlay gaps of **4,592.5 ms, 2,726.4 ms and 3,551.8 ms**. Sampling mapped through the browser's NavigationStart monotonic timestamp shows:

- 4,592.5 ms window: approximately 2,331.3 ms sample-weighted time in stacks containing `getUniforms`.
- 3,551.8 ms window: approximately 2,542.3 ms in those stacks; approximately 430.4 ms in bounding calculations.
- A separate 554.9 ms early gap contained approximately 533 ms in skinned bounds/normalization stacks. GC contributed to other windows but was not the dominant stack in the two largest shader-related windows.

The repeated path is `RenderCadence → WebGLRenderer.render → renderBufferDirect → program.getUniforms → WebGLProgram.onFirstUse` (minified function C in the retained events bundle). Installed Three.js source shows first use queries program/shader diagnostic logs and populates uniforms/attributes after linking. This confirms render-time first-use program initialization as a major blocked application path. It does **not** separately establish which native query/driver wait accounts for every millisecond or prove a defective GPU/driver.

Instrumented linkProgram calls reached 71.1 ms, and getProgramParameter 62.9 ms; those individual measured calls do not explain the multi-second gaps. The CPU stacks identify the later first-use path. No shader-error check was disabled. Evidence does not support blaming camera interpolation or unnecessary React updates as the primary cause. Secondary skinned bounds, material texture creation and GC costs remain documented; no unrelated fix applied.

Heap at natural completion was approximately 27.9 MB before and 30.7 MB after. These are JS heap observations, not total browser/process memory. CPU sampling and tracing add observer overhead; only one pair was captured, with different OS/cache conditions. No repeatability or statistical guarantee is claimed.

## Evidence limitations

- Both CPU profiles were saved completely. Exact stacks, shader records, clock alignment and weighted windows are preserved in `stutter-work/performance-summary.json` and the per-attempt `cpu-profile.json` files.
- Before tracing used recordUntilFull with a 16 MiB internal buffer, not circular overwrite. Export exceeded the 24 MiB text-stream limit; `trace.json` is an incomplete prefix and is not treated as a valid full trace.
- After natural completion, memory pressure stopped Chrome during trace export. That export did not complete. No replacement trace was fabricated; saved rAF/long-task data and CPU profile remain independent evidence.
- No reliable OS paging, scheduling or GPU timeline attribution was collected. Full GC-event attribution is incomplete. The historical incidents remain observations consistent with the reproduced mechanism, not individually proven by stacks that did not exist then.

## Targeted candidate and outcome

One opening-only preparation candidate waits for existing scene/actor readiness, uses `compileAsync` and representative first draws before advancing the cinematic clock, and explicitly presents this as loading. Active multi-second gaps disappeared in the one saved candidate run, but preparation still had 2,442.1 ms and 1,984.3 ms gaps.

Candidate visual review found an exposed unposed actor frame at readiness release (`after-20261116-001854/cinematic-009s.png`). The candidate is **not accepted or promoted**. The single fix-and-retest allowance is exhausted; no further cycle performed. See the performance-fix report for validation and remaining work.
