# Phase 5.2.4 — memory pressure and GPU synchronization

12 November 2026, Asia/Calcutta. **Diagnostics only; no stabilization claim. No Phase 5.3.**

## Adapter conclusion

The tested game **is rendering on the intended NVIDIA GTX 1650**, verified per WebGL context and independently by Chrome SystemInfo. ANGLE/D3D11 identifies PCI 10DE:1F9D; actual drawing buffer and CSS canvas are 1920×1080 at DPR 1. Windows identifies AMD PCI 1002:1638 as the 1920×1080/144 Hz display controller; NVIDIA has no current display mode in that query. Chrome owns contexts on both adapters. This supports a hybrid render/display arrangement, but does not identify the slow AMD context as the game canvas's exact presentation surface. Headless render measurements are not physical scanout validation. [Adapter evidence](phase524-adapter-analysis.json).

## Matched current measurements

Four 60-second windows use the same AC-online/Battery-Saver-off condition, resolution, packaged graphics and capture profile. Per-second power checks and clock bridges are retained. Existing apps were preserved; host memory/cache/thermal conditions are not isolated laboratory constants. No fresh uninstrumented AC control is claimed.

The installed DxgKrnl metadata assigns driver Profiler events 105/106 to keyword 0x2, while queue events use Base 0x1. The custom diagnostic profile uses 0x275, excluding 0x2, and adds FileIO/file attribution and ReadyThread stacks. It changes recording only. Overall trace size is **not** lower: the new stack/file-I/O recording itself adds substantial traffic and paging pressure. Actual event counts, file sizes and lost-event counts—not the keyword mask alone—determine collection limits.

- **menu sync1** — RECOVERED MEASURED WINDOW; POST-RENDER CHECK UNAVAILABLE. 29.68 FPS; mean 33.69 ms; p95 34.90 ms; p99 35.30 ms; maximum **374.70 ms**, >100 ms render intervals **2**. rAF callback maximum 358.40 ms. [Frame summary](phase524-evidence/menu-sync1/frame-summary.json).
- **menu sync2** — COMPLETE DIAGNOSTIC. 29.85 FPS; mean 33.50 ms; p95 35.00 ms; p99 35.70 ms; maximum **187.60 ms**, >100 ms render intervals **2**. rAF callback maximum 175.60 ms. [Frame summary](phase524-evidence/menu-sync2/frame-summary.json).
- **combat sync1** — COMPLETE DIAGNOSTIC. 29.59 FPS; mean 33.80 ms; p95 35.70 ms; p99 38.10 ms; maximum **323.50 ms**, >100 ms render intervals **4**. rAF callback maximum 318.00 ms. [Frame summary](phase524-evidence/combat-sync1/frame-summary.json).
- **combat sync2** — INCOMPLETE TRACE. 29.88 FPS; mean 33.46 ms; p95 35.90 ms; p99 41.90 ms; maximum **98.70 ms**, >100 ms render intervals **0**. rAF callback maximum 94.60 ms. [Frame summary](phase524-evidence/combat-sync2/frame-summary.json).

The first harness timed out waiting for WPR finalization after the frame window. Windows subsequently saved its ETL with exit code 0. Its dedicated frame log and browser trace were already intact; the original failure is retained, the recovered sync record is explicit, and final renderer/context checks are unavailable for that first run. The later diagnostic wait was increased without changing capture or graphics settings. Legacy combat counters continued during trace delivery; all numbers above come only from dedicated start/end frame logs.

## Memory, assets and processes

System RAM availability, commit/limit, paging reads, disk latency and per-adapter dedicated/shared usage were sampled. Top-16 private-memory consumers were sampled every five telemetry ticks. [Process, asset and memory detail](phase524-evidence/memory-assets.json) and per-gap correlation retain timestamps. Private bytes are committed virtual memory, **not resident RAM**; a large mostly paged-out development process cannot be called an equally large physical RAM consumer. Hard faults can involve executable/file-backed pages or anonymous memory; unnamed backing files are not automatically pagefile.sys.

Resource timing and browser resource events are examined separately from faults. Absence of a new request does not exclude later decode/upload work, driver shader-cache I/O or residency pressure from assets already in memory. The recovered first menu run lacks the legacy final resource extraction, so that absence is not counted as zero requests. Background process observations identify contributors to allocation pressure, not proof that a specific app caused a frame.

## Timestamp-correlated gaps

- **menu-sync1, 374.70 ms**, UTC ending 2026-11-11T19:24:59.322Z: renderer off CPU 369.47 ms; known blocked 369.28 ms; ready delay 0.17 ms; inferred on CPU 5.23 ms; direct renderer-main hard-fault overlap 0.00 ms. Full overlap records retain backing filenames, GPU events and telemetry.
- **menu-sync1, 347.20 ms**, UTC ending 2026-11-11T19:25:00.196Z: renderer off CPU 344.22 ms; known blocked 344.10 ms; ready delay 0.12 ms; inferred on CPU 2.98 ms; direct renderer-main hard-fault overlap 0.00 ms. Full overlap records retain backing filenames, GPU events and telemetry.
- **combat-sync1, 323.50 ms**, UTC ending 2026-11-11T19:34:32.863Z: renderer off CPU 304.62 ms; known blocked 304.21 ms; ready delay 0.42 ms; inferred on CPU 18.88 ms; direct renderer-main hard-fault overlap 222.69 ms. Full overlap records retain backing filenames, GPU events and telemetry.
- **combat-sync1, 218.20 ms**, UTC ending 2026-11-11T19:34:43.226Z: renderer off CPU 206.59 ms; known blocked 206.55 ms; ready delay 0.04 ms; inferred on CPU 11.61 ms; direct renderer-main hard-fault overlap 0.00 ms. Full overlap records retain backing filenames, GPU events and telemetry.
- **menu-sync2, 187.60 ms**, UTC ending 2026-11-11T19:31:38.755Z: renderer off CPU 183.94 ms; known blocked 183.82 ms; ready delay 0.12 ms; inferred on CPU 3.66 ms; direct renderer-main hard-fault overlap 0.00 ms. Full overlap records retain backing filenames, GPU events and telemetry.
- **menu-sync2, 180.20 ms**, UTC ending 2026-11-11T19:31:23.145Z: renderer off CPU 176.20 ms; known blocked 176.08 ms; ready delay 0.12 ms; inferred on CPU 4.00 ms; direct renderer-main hard-fault overlap 0.00 ms. Full overlap records retain backing filenames, GPU events and telemetry.
- **combat-sync1, 177.90 ms**, UTC ending 2026-11-11T19:34:33.751Z: renderer off CPU 148.13 ms; known blocked 147.61 ms; ready delay 0.51 ms; inferred on CPU 29.77 ms; direct renderer-main hard-fault overlap 148.77 ms. Full overlap records retain backing filenames, GPU events and telemetry.
- **combat-sync1, 160.80 ms**, UTC ending 2026-11-11T19:34:33.912Z: renderer off CPU 143.34 ms; known blocked 143.06 ms; ready delay 0.28 ms; inferred on CPU 17.46 ms; direct renderer-main hard-fault overlap 132.74 ms. Full overlap records retain backing filenames, GPU events and telemetry.

All gaps and nested browser/OS evidence remain in [diagnostic results](phase524-diagnostic-results.json). Do not add duplicate render/rAF intervals or overlapping spans as separate elapsed time. Intentional 30 Hz waiting is included in a normal render interval. Clock-bridge uncertainty and ETW/QPC cross-check differences limit fine alignment.

## Findings

- The tested game WebGL context uses the intended GTX 1650 through ANGLE/D3D11. WebGL and Chrome SystemInfo agree; buffer/CSS dimensions are 1920×1080 at DPR 1. AMD is the Windows display owner and also has Chrome-owned GPU contexts. This is not evidence of the game accidentally rendering on AMD.
- Severe gaps recur on AC: menu maxima are 374.7 and 187.6 ms; combat maxima are 323.5 and 98.7 ms. All four measured windows retain AC=1 and Battery Saver=0. These instrumented results do not certify stable 30 FPS.
- In zero-loss combat sync1, renderer PID/TID 29764/16468 has a 323.5 ms interval ending at 2026-11-11T19:34:32.8635Z (12 November 01:04:32.8635 local). Main-thread hard faults overlap about 222.69 ms; renderer off-CPU time is about 304.62 ms, with about 0.42 ms known ready delay. Paging is a demonstrated substantial contributor to this specific new stall; backing files remain unnamed.
- The worst menu intervals show a different pattern: 374.7 ms includes about 369.47 ms off CPU and 187.6 ms includes about 183.94 ms off CPU, with no matching renderer-main or GPU-process hard-fault overlap in those particular intervals. AMD queue delay is not a universal explanation: the matched packet around the 374.7 ms interval waits only 7.63 ms, while a separate 347.2 ms menu interval overlaps an AMD packet waiting 369.61 ms. The 187.6 ms interval overlaps a separate AMD packet waiting 210.79 ms. Queue overlap is not the missing renderer wait/fence linkage.
- Across the new whole-recording PDH samples, available RAM falls as low as 369 MiB, system commit reaches about 27.5 GiB against a 30.3 GiB limit, and paging reads are active. NVIDIA LUID 72024 is matched by vendor/device identity; its dedicated usage stays roughly 411–501 MiB in sampled accounting, far below 4 GiB. These observations support system-memory pressure, not measured GTX VRAM exhaustion.
- The pre-existing development node process PID 5224 holds about 1513 MiB private committed memory while observed working set is only about 5–24 MiB. Other editor/browser processes also contribute allocation/working-set demand. Private commitment is not resident RAM, and process presence does not prove responsibility for a specific stall. The owned combat GPU process reaches about 831 MiB private bytes and about 244 MiB observed working set in the top-16 samples.
- No timed resource requests were recorded for the menu. Each combat browser timeline does contain two requests: /audio/kalki/bujji/support-voice.ogg (60615 bytes) and /favicon.png (62572 bytes). The legacy combat resource filter omitted OGG/PNG, so its empty list was incomplete. These requests do not overlap the worst 323.5 ms combat interval; their presence still prevents claiming zero loading during combat. Existing asset heap/driver residency and later decode/upload work are not ruled out. The recovered first menu run lacks final harness resource extraction, with browser timeline coverage retained.
- The installed provider metadata separates driver Profiler events on keyword 0x2 from Base queue events on 0x1. The new 0x275 profile exports no Profiler/Start or Profiler/Stop events, but file/stack collection still creates large traces and observer overhead. A fresh uninstrumented AC control was not run.
- Three current ETW captures report zero lost events. Combat sync2 reports 252891 lost events and cannot establish a complete scheduling chain; its independent frame log, power telemetry and adapter queries are retained separately. The first menu window was recovered after a post-window WPR-wait timeout; its final renderer check is unavailable.
- Bounded native extraction from the earlier zero-loss 497.8 ms capture produced 236 switch-out stacks and 30 ReadyThread records; switch-out stacks have module information, while those ReadyThread records have no stacks. Renderer frames include Chrome, Windows kernel and wait-library modules; the GPU-thread stacks include AMD atidxx64/atiuxp64, DXGI/D3D11 and some NVIDIA nvwgf2umx frames. Counts reflect frames, not time percentages or proof of a driver defect.

## Remaining unknowns

- The exact Chrome wait object, IPC/command-buffer fence and corresponding AMD/NVIDIA context/packet completion remain unlinked. No complete renderer → browser GPU thread → driver synchronization object → wakeup chain is established.
- The historical 1820.5 ms combat and 521.3 ms menu stalls remain unattributed; causes of new or smaller gaps are not assigned retroactively.
- Hard-fault backing filenames remain unavailable in relevant new faults despite FileIO capture. Anonymous/pagefile-backed, executable/file-backed and asset-derived pages cannot be distinguished reliably from these records.
- One-second GPU memory samples do not establish WDDM residency budgets or exclude short transient pressure. The full NVIDIA hardware-queue execution chain has not been reconstructed; long AMD packet spans must not be called NVIDIA render time.
- The amount of disturbance from stack/file-I/O recording is not quantified. The first post-window wait timeout, the final trace's event loss and a 32.64 ms helper UTC/QPC discrepancy in menu sync2 limit fine-grained attribution; bridge RTT alone is not the total clock uncertainty.
- The fresh bounded ETLX stack read failed with Read past end of stream. Its empty/incomplete stack export is not usable evidence of an absent wait. Old native module stacks remain unsymbolized at the function/object level, with no symbol downloads performed.
- A controlled comparison with known RAM headroom and stable AC has not isolated background-memory pressure from browser/driver and recorder costs. No RAM upgrade, quality cut, driver change or software repair is proven to resolve all stalls.

## Preservation and stopping point

159 source/config/asset/protected reference checks; mismatches 0. Protected checks **47/47**. [Hashes](phase524-evidence/preservation.json). No production assets, gameplay, rollback files or user saves were changed. Fixtures use disposable test contexts. No driver, registry, BIOS, power-plan or graphics-setting change occurred. No additional full gameplay acceptance, production build or lint pass is claimed because production files did not change.

**Safest next action:** Keep the game, graphics and drivers unchanged. Arrange one bounded stable-AC, native-1080p comparison with lower background memory demand after the user has saved work and explicitly approved any app closures; include a minimal-observer control and a narrow paging/synchronization recording that avoids the current high-volume file/stack capture. Use it to test the demonstrated paging contribution, then resolve the specific Chrome wait/fence and AMD context ownership. Do not assume that reducing graphics or changing drivers will repair these stalls.

Investigation stops here. [Blocking-chain assessment](phase524-blocking-chain-analysis.md).
