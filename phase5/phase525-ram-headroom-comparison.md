# Phase 5.2.5 — controlled background-memory comparison

12 November 2026, Asia/Calcutta. **Comparison finished. Stable 720p/30 FPS is NOT established. No Phase 5.3.**

## Conclusion

The closure intervention reduced committed memory and owned-browser hard faults, but did **not materially increase average available physical RAM**: A **782.79 MiB**, B **783.96 MiB** (mean of matched window means). Commit averaged **29.00 GiB → 19.86 GiB**. This is useful reduced-background-commit evidence, not a clean experiment with substantially more physical RAM capacity.

Owned-Chrome timed hard-fault completions were **2172 → 1269**, **41.57% fewer**, with mixed per-scenario results. System-wide page reads did **not** decrease: **1633.20 → 1698.37 reads/s**. Paging remains a demonstrated contributor from timestamped faults, including prior Phase 5.2.4 evidence, but it does not explain every severe stall. The worst selected B gap was **2475.90 ms**, despite lower commit. 8 GB is a contributing constraint for this multitasking workload; this test does **not** establish it as the sole/primary bottleneck or prove that upgrading RAM fixes the stalls.

## Controls and intervention

Same existing build, **1280×720 actual WebGL drawing buffers**, DPR 1, unchanged graphics and 30 Hz desktop render cap. Two 30-second samples cover The Complex menu idle, spawn-area Mission 1 exploration, Mission 1 combat, Mission 2 combat and real Bujji chase. Fresh isolated browser contexts preserve real user saves; only prerequisite/phase fixtures are seeded. Controls use an identical adaptive policy, not a bit-for-bit deterministic simulation. Workload endpoints are retained in the JSON.

The user approved closing Chrome, VS Code, Telegram, WhatsApp and Grammarly after saving work, while keeping VLC. Graceful WM_CLOSE requests were sent after all A samples; **some app windows/tray/background components remained**. No forced termination or service changes occurred. The recorded before/after/remaining process lists are in [memory/process evidence](phase525-memory-processes.json). Closing apps changes GPU/CPU demand too, and VLC's video workload was not frozen to identical content. Do not call this a RAM-only intervention.

The user initially chose battery, then instructed continuing without more battery questions. Actual power was logged. 10/10 paired windows pass measured frame, buffer, renderer, duration, browser-version and matched-power checks; 10/10 pairs have complete ETW paging evidence. Observed power states per window are retained; no power plan or Battery Saver setting was changed. The Balanced base scheme was observed near the transition; effective overlay/frequency/thermal state was not continuously fixed.

Two original A chase attempts lost the courier and ended early. They remain in the evidence and are excluded. One corrected clear-lane route was then measured twice under normal background conditions, before app closure; B uses that same route. All compared chase windows recorded their full duration. A corrected chase used a separate fresh browser session, so context/cache history is an extra chase-comparison confound.

## Per-sample render results

All percentiles below are **milliseconds**. These are actual render-start intervals, not high-frequency browser rAF FPS. Every maximum is retained; normal averages do not hide stalls.

- **menu, sample 1** — matched frame comparison; A: 29.67 FPS; p50 34.70, p95 34.90, p99 35.30, max **368.10 ms**; B: 30.00 FPS; p50 34.60, p95 35.00, p99 41.50, max **41.80 ms**. Owned hard faults A/B: 503/39.
- **menu, sample 2** — matched frame comparison; A: 30.00 FPS; p50 34.70, p95 35.00, p99 35.40, max **36.60 ms**; B: 30.00 FPS; p50 34.60, p95 34.90, p99 41.50, max **41.90 ms**. Owned hard faults A/B: 247/59.
- **m1-exploration, sample 1** — matched frame comparison; A: 30.00 FPS; p50 34.60, p95 35.30, p99 36.00, max **45.10 ms**; B: 30.00 FPS; p50 34.60, p95 35.60, p99 36.40, max **41.80 ms**. Owned hard faults A/B: 77/129.
- **m1-exploration, sample 2** — matched frame comparison; A: 29.50 FPS; p50 34.60, p95 35.20, p99 36.00, max **305.30 ms**; B: 29.97 FPS; p50 34.60, p95 35.30, p99 36.20, max **66.70 ms**. Owned hard faults A/B: 152/24.
- **m1-combat, sample 1** — matched frame comparison; A: 29.94 FPS; p50 34.60, p95 35.20, p99 35.70, max **86.30 ms**; B: 29.97 FPS; p50 34.60, p95 35.50, p99 36.40, max **79.30 ms**. Owned hard faults A/B: 312/65.
- **m1-combat, sample 2** — matched frame comparison; A: 30.00 FPS; p50 34.60, p95 35.10, p99 35.70, max **40.90 ms**; B: 29.90 FPS; p50 34.60, p95 35.20, p99 36.10, max **97.60 ms**. Owned hard faults A/B: 252/310.
- **m2-combat, sample 1** — matched frame comparison; A: 29.99 FPS; p50 34.60, p95 35.10, p99 35.60, max **53.80 ms**; B: 30.01 FPS; p50 34.50, p95 35.30, p99 40.40, max **50.10 ms**. Owned hard faults A/B: 136/311.
- **m2-combat, sample 2** — matched frame comparison; A: 30.00 FPS; p50 34.60, p95 35.10, p99 35.80, max **42.80 ms**; B: 30.00 FPS; p50 34.60, p95 35.00, p99 36.00, max **44.60 ms**. Owned hard faults A/B: 264/146.
- **bujji-chase, sample 1** — matched frame comparison; A: 30.00 FPS; p50 34.60, p95 35.00, p99 38.40, max **48.00 ms**; B: 30.00 FPS; p50 34.60, p95 35.00, p99 41.20, max **41.70 ms**. Owned hard faults A/B: 60/28.
- **bujji-chase, sample 2** — matched frame comparison; A: 29.66 FPS; p50 34.60, p95 35.00, p99 37.70, max **375.10 ms**; B: 26.60 FPS; p50 34.60, p95 35.80, p99 47.10, max **2475.90 ms**. Owned hard faults A/B: 169/158.

## Memory, CPU, GPU and trace quality

Window-filtered available RAM, commit, page-file usage, system CPU, normalized process CPU, private bytes and working sets are retained alongside hard-fault actor roles. Aggregated sampled system CPU A/B: **27.73% / 33.08%**; NVIDIA busiest-engine A/B: **23.51% / 23.21%**. Page-file current usage averaged **4641.44 / 1774.55 MiB**. System paging reads averaged **1633.20 / 1698.37 reads/s**. These are sampled metrics, not sub-frame peaks or direct cause assignments.

- A-main: 0 lost events; 49308 owned hard-fault records across the entire capture including setup; 2,922,119,168 ETL bytes. Timed counts are filtered separately.
- A-chase-corrected: 0 lost events; 7007 owned hard-fault records across the entire capture including setup; 924,319,744 ETL bytes. Timed counts are filtered separately.
- B-main: 0 lost events; 12877 owned hard-fault records across the entire capture including setup; 3,298,033,664 ETL bytes. Timed counts are filtered separately.

The recorder profile omits broad file-I/O and stack walks and the driver Profiler keyword that previously caused large overhead. Browser tracing collects user-timing markers only. Recording and PDH sampling still add load. All three recordings report zero lost events, but the intervention is nonrandomized A-then-B and has no restoration/counterbalanced A2 condition. Cached assets, elapsed time, app shutdown and thermal state can differ.

[Private memory](https://learn.microsoft.com/en-us/dotnet/api/system.diagnostics.process.privatememorysize64) is allocated nonshared process memory, not resident RAM. Working sets can contain shared pages; do not sum them as unique physical memory. GPU utilization follows the [busiest-engine interpretation](https://devblogs.microsoft.com/directx/gpus-in-the-task-manager/). Matched queue packets are sampled from exported stall/worst-frame ranges, predominantly AMD contexts owned by the Chrome GPU process; they are not a complete NVIDIA render-time distribution.

## Largest residual stall and independence from direct paging

**B-bujji-chase-2**, renderer interval **2475.90 ms**, starts at UTC **2026-11-11T20:31:56.831Z** (local 12 November about **02:01:56.831**). The active renderer spends about **2448.12 ms off CPU**, including **2447.60 ms blocked** and **0.52 ms ready/runnable delay**. There are **0 owned-Chrome hard faults overlapping this interval**, with **0.00 ms direct renderer-main fault overlap**.

An owned AMD context packet overlapping that period has an observed submit-to-DMA-start delay of **3506.58 ms**, followed by an observed DMA span of **0.67 ms**. The conservative browser/ETW cross-clock allowance for this sample is approximately **±3.18 ms**, including the helper UTC/QPC check, not just bridge round-trip time. The GPU queue/wait-object ownership chain is not proven; this cannot be called GTX draw time or a confirmed faulty driver. It does show that direct owned-process paging does not explain this largest B gap. Other process paging, driver residency, synchronization and tracing costs are not categorically excluded.

Test B's short menu samples did not reproduce the historical long menu wait. That does not establish a permanent fix or independence from every kind of memory pressure. Combat p99/max results are mixed, so a meaningful RAM-caused combat improvement is not demonstrated. Historical 1,820.5/521.3 ms events remain separately unattributed.

## Preservation and safest next action

**47/47 protected hashes match**, with 0 mismatches among 159 source/config/asset reference checks. [Changes/hashes](phase525-changes-and-hashes.json). No production code, protected/rollback assets, saves, progression, drivers, registry, BIOS or Windows services were modified. No graphical optimization or Phase 5.3 work occurred. Approved close requests were not reversed automatically; remaining processes are documented.

Keep production graphics, drivers and source unchanged. Investigate the residual Chrome/hybrid-GPU blocked wait in one persistent session with matched scene history. If repeating a physical-RAM-headroom experiment, verify a substantial available-RAM difference before sampling; use user-approved app exits rather than force-closing work or disabling services.

Raw frame logs, markers, per-condition telemetry, ETLs and parsed correlations are under [phase525-evidence](phase525-evidence/). [Full diagnostic results](phase525-diagnostic-results.json). Investigation stops after these findings.
