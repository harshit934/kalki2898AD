# Phase 5.2 — Performance stabilization investigation

11 November 2026. **Percentile budget passes; full stall elimination remains unproven.** The final build retains no speculative gameplay optimization. A final run still recorded a 154.7 ms rendered-frame gap, which is disclosed rather than hidden by the averages. No Phase 5.3 work.

## What was found

The CPU/subsystem profile placed the largest measured block inside renderer submission: **413.5 ms** in the first instrumented capture. Measured physics-step maxima across the two diagnostic captures were **18.8 ms**; enemy/model/particle callbacks shared the CombatEnemies scope and peaked at **34.7 ms**, player callbacks at **28.3 ms**, character CPU animation at **22.1 ms**, Bujji callbacks at **10.4 ms**. These are wall-time probes under profiling, not clean comparative benchmark numbers. GPU skinning remains part of rendering and is not ruled out by a small mixer time.

Shadow-map stacks accounted for **5.92 seconds of 45.45 seconds (13.0%)** of sampled profile time, including descendants. This is sampled CPU-stack attribution, not direct shadow GPU duration. The existing 1024² shadow map and gameplay materials remain unchanged. Particle visual callbacks were included in the shared enemy/effect scope; there was no evidence justifying removal of effects or enemies.

In the first measured profile interval no shader compile/link calls were recorded; observed texture subimage calls peaked at **7.5 ms** and buffer uploads at **0.4 ms**. The recorded hero GLB request completed before the warmed combat window. The native-call profile observed ordinary uniforms/draw/buffer operations and did not establish an individual driver call as the cause of the historic 208 ms gap. Sampled contiguous GC time reached about **61.9 ms**, not enough evidence to assign the 413.5 ms render block solely to GC. Asset loading, physics and AI are therefore not supported as the sole cause of the largest observed block; an exact cross-process driver/paging diagnosis remains open.

## Hardware/power confounders

Windows directly reported **AC offline, battery 12%, Battery Saver on**. Some fresh Chrome processes then selected AMD despite the high-performance GPU flag. Those AMD runs were excluded. After the user connected the charger, Windows reported **AC online / Battery Saver off**; final tests verify both endpoint power states and the actual ANGLE NVIDIA GTX 1650 adapter. No power plan, registry preference, driver or user application was changed by the agent. [Microsoft documents these power-status fields](https://learn.microsoft.com/en-us/windows/win32/api/winbase/ns-winbase-system_power_status).

System-wide profiling counters showed **577–1490 MiB** available RAM, **12.8–1796.6 page reads/sec**, and total CPU **23–94%**. This establishes a constrained host environment, not per-process causality for any particular frame. The original Phase 5.2 run did not record AC state, so its 208 ms spike cannot retrospectively be blamed conclusively on Battery Saver. Even initial AC baselines still had large stalls.

## Controlled before/after measurements

GTX 1650 verified; 1280×720 viewport, DPR 1, balanced visual tier. Native drawing-buffer checks in final runs confirm 1280×720. Fresh isolated browser contexts; M1 completion is a prerequisite-unlock fixture only. All combat movement/attacks/guarding use normal keyboard events, without changing health, positions or enemy state. Each run defeated all five sentinels. Target/effect combat frames are separately summarized in the JSON. Initial baseline trials are roughly 120 seconds each; final uncapped trials are roughly 60 seconds each. These samples do not certify long thermal behavior.

**Before: actual renderer intervals, AC baseline**

- ac1: mean **9.35 ms**, p95 **14.60 ms**, p99 **22.00 ms**, maximum **386.10 ms**; >100 ms frames: **9**.
- ac2: mean **8.36 ms**, p95 **12.90 ms**, p99 **16.90 ms**, maximum **927.00 ms**; >100 ms frames: **3**.
- ac3: mean **8.47 ms**, p95 **13.60 ms**, p99 **20.60 ms**, maximum **564.40 ms**; >100 ms frames: **25**.

**Final: actual renderer intervals, AC**

- ac1: mean **7.32 ms**, p95 **9.70 ms**, p99 **12.20 ms**, maximum **43.40 ms**; >100 ms frames: **0**.
- ac2: mean **8.36 ms**, p95 **12.50 ms**, p99 **16.30 ms**, maximum **67.00 ms**; >100 ms frames: **0**.
- ac3: mean **7.98 ms**, p95 **13.40 ms**, p99 **16.80 ms**, maximum **154.70 ms**; >100 ms frames: **1**.

Each final run passes p95 ≤33.334 ms and p99 ≤50 ms. The final no->100-ms criterion **does not pass across all runs**. Average/update-loop FPS must not be substituted for rendered-frame pacing. Full summaries, combat subsets, adapter/power checks, raw-file references and exclusions are in [results](phase52-performance-stabilization-results.json).

## Candidate tested and rejected

A presentation-only ceiling was tested while keeping every normal frame subscriber running: no physics/AI/animation/input cadence or visual asset was reduced. Three candidate runs had no >100 ms rendered gaps. However, disabling the ceiling in the final-asset rollback control was also stable (maximum **31.6 ms**). That failed to demonstrate that the ceiling caused the improvement. **The ceiling was removed from production**, not shipped as a claimed fix. GameCanvas and all gameplay systems match their pre-investigation source hashes. Candidate sources/results are archived for inspection.

The retained FrameMetrics correction measures actual renderer submissions rather than update callbacks, adds p99 and >100 ms counts, and stops silently excluding foreground gaps above one second. It only runs under the existing profiling query flag. Menu asset batching, static menu shadow baking and rAF-aligned menu pacing are retained as independently measured menu improvements; none reduces gameplay visual quality.

## Final verification and remaining work

Desktop and portrait menu/settings/victory/navigation plus Full/Compact/Minimal HUD checks: **PASS**. Ordinary-input Mission 1 keyboard, Mission 2 keyboard and Mission 2 touch: **PASS**, including boss/relic completion and reload persistence. Bujji duel/chase keyboard and touch: **PASS**, including pause/resume, obstacles, handoff, replay and saved completion. Build/lint and campaign/camera/shader checks have individual logs in the evidence folder. Physical mobile performance remains unverified.

Preservation: **PASS**; 4014 original immutable files and 47 protected records verified. [Hashes](phase52-final-changes-and-hashes.json). No protected model/groom/rollback changes or save resets.

**Honest remaining bottleneck:** intermittent renderer/main-thread/driver submission delay under a memory-constrained host. Its exact driver-versus-paging mechanism was not isolated by these profiles. A cross-process GPU/hard-fault trace is the next diagnostic if it recurs; do not lower shadows, particles or character quality on speculation. This report does not claim a permanent fix, stable 60/120 FPS, or full Phase 5.2 performance acceptance.
