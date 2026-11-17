# Phase 5.1 — Graphics benchmark mission plan

Status: **design only; requires review before Phase 5.2**. No mission, asset or renderer improvements were implemented. [Measured current baseline](phase51-hardware-audit.md) and [engine study](phase51-engine-comparison.md) constrain this plan.

## One playable production-oriented slice

Candidate: existing **Mission 2, The Glass Wastes**. It already has an accepted objective route, three pylons, five sentinels, Prism Sovereign, relic, opening/ending and bounty/ground-chase side sequence. Select it for visual production because these systems exercise traversal, combat, camera handoff, effects and persistence together. Do not substitute a static showcase or create a new mission solely to hide performance cost. Current fresh Phase 5 measurements are M1 only; no M2 performance result is claimed.

Scope the slice to an authored approach, one combat space and the existing mission route, retaining objective positions and collision clearance until gameplay review explicitly permits changes. Preserve all other missions and current save IDs. The entire mission must remain completable; the highest-fidelity art may initially cover only the bounded benchmark area and must be labeled as such.

## Paired gameplay and graphics milestones

1. **Reference and baseline:** record a full current M2 run, fixed camera bookmarks and matching low-cost collision proxies. Test objective interactions, combat reach, dodge clearance, wall/camera sweeps, boss/relic completion, save/reload and pause before accepting visual work.
2. **Materials and character presentation:** keep Bhairava/Groom 17 unchanged. Improve unprotected supporting-character and environment material candidates through a reviewed staging path; use realistic roughness variation, normals, believable scale, restrained metalness and consistent color space. Detailed enemy models must preserve attack telegraphs and hit zones. Any proposed hero derivative is blocked pending explicit protected-asset scope review. Character realism cannot be certified solely from the current protected mesh.
3. **Architecture and terrain:** author modular weathered structures, ground breakup and readable paths around the existing objectives. Provide LODs and simple collision proxies; instance repeating details. For each visual increment, repeat traversal, interaction and camera tests at the same locations. No decorative mesh may close a required route.
4. **Lighting and atmosphere:** begin with baked indirect lighting/environment reflection candidates, one tightly framed shadowed sun and pooled unshadowed local lights. Validate shadow shimmer, contact, interior/exterior balance and enemy silhouettes. Test bounded dust/haze/embers with combat telegraphs; reduce overdraw before reducing gameplay content. Real volumetric fog or ray tracing is not a required deliverable.
5. **Animation and combat effects:** improve permitted supporting-actor transitions, anticipation, foot contact and hit effects while retaining simulation-driven damage windows. Test input latency, block/dodge, impact confirmation, enemy count and simultaneous effects. Effects must not move hitboxes or conceal attacks. No protected animation or model replacement without review.
6. **Cinematic camera:** compose opening/ending shots using existing controller paths/FOV and audio timing. Validate skip, pause, replay and gameplay handback in desktop, portrait and landscape. Keep active-gameplay presentation restrictions and camera collision. Depth-of-field/bloom/color grading are individually measured optional experiments, not global defaults.
7. **Integrated acceptance:** complete the same mission using ordinary controls with all accepted visual increments, on both selected desktop tiers and real mobile targets. Ship no visual increment that breaks stability or persistence. Review matched screenshots/video and frame-time evidence together.

## Measurement protocol

- Package a production build from a recorded source/hash manifest. Serve over localhost for hardware timing, then a realistic throttled HTTPS deployment for loading tests. Keep development instrumentation separate from product code. The phase51 harness measures development mode only.
- Record OS/browser version, actual ANGLE adapter, driver, physical/internal resolution, DPR, display rate, AC/power mode, temperature/clocks and background workload. Verify GTX use from renderer identity; a high-performance hint alone is insufficient. Don't change the user's graphics settings silently.
- Use fresh isolated contexts/saves for test fixtures; never reset the user's profile. Test real progression separately from fixture-started segments. Log every fixture and distinguish ordinary-input completion from controlled state setup.
- Capture cold startup (three fresh browser runs with cache policy stated), warm traversal (three runs), dense combat, pylon effects, boss/relic and cinematic handoff. Use a reproducible 5-minute route plus a 20-minute thermal loop on each desktop tier. Include bounty/chase and pause/restart/reload once per matrix entry. Physical mobile needs a 15–20-minute session per device.
- Keep full foreground raw frame deltas, including spikes >1 second. Existing FrameMetrics drops deltas >1 second and resets on label/hidden changes, so it cannot alone certify stutter rates or complete-run percentiles. Log those exclusions and context loss separately. Discard only predeclared warm-up/hidden intervals.
- Report frame-weighted mean, p50/p95/p99 frame time, percent above 33.3/50/100 ms, worst frame and contiguous long-frame counts per segment. Derive 1% low consistently from frame times and state the definition. Do not average FPS values or merge window percentiles.
- Capture CPU update/physics/render-submit separately, GPU duration when valid (disjoint queries excluded), draw calls, triangles/passes, shader programs and texture/geometry counts. Measure JS heap, process RSS/commit, WASM allocation and adapter dedicated/shared memory with appropriate separate tools. Counts and GLB disk size cannot stand in for VRAM.
- Measure network bytes, image dimensions/formats, decoded residency estimates, parse/upload/compile stalls, time to interactive and context recovery. Collect errors/missing resources. Use fixed screenshot bookmarks at matched exposure and resolution; compare character, environment, shadow contact, combat readability and camera handoff.
- Change one graphics variable at a time: shadow setting, effects, local lights, resolution or material feature. Repeat A/B on the same route after temperatures settle. Do not call correlated spikes a proven bottleneck.

## Provisional budgets — targets, not achieved results

### HP Victus discrete-GPU desktop

Baseline acceptance tier: 1280 × 720 internal, DPR 1, **30 FPS**. Steady gameplay p95 ≤33.3 ms, p99 ≤50 ms, no repeated >100 ms stalls after loading; three-run mean at least 30 FPS. Initial CPU main-thread update/physics/submission allowance ≤20 ms and GPU ≤28 ms, overlapping rather than added, with headroom inside 33.3 ms. Native 1080p is an optional quality experiment, not a promise.

Performance tier: 1280 × 720 internal, reduced effects/shadows as needed, **60 FPS** only if measured p95 ≤16.7 ms and p99 ≤25 ms across full combat. Provisional CPU allowance ≤10 ms, GPU ≤14 ms. A 144 Hz display does not make 144 FPS a realistic requirement.

Initial resource ceilings: game-attributable total process footprint ≤1.5 GiB, JS heap ≤256 MiB steady / 384 MiB transient; measured game graphics allocation ≤1.5 GiB steady / 2 GiB transient, whole-adapter dedicated occupancy ≤3.2 GiB. Keep at least 1.5 GiB system physical memory available in the controlled test environment; current workstation snapshots fail that headroom prerequisite. These categories overlap: never add JS heap to RSS or treat shared graphics memory as extra RAM. Require no sustained memory growth beyond 10% after warm caches across three replay cycles; investigate trends rather than masking them with reloads.

Initial scene guardrails: ≤250 reported draws, ≤1 million rendered triangles in the agreed counting mode including relevant passes, ≤4 skinned supporting enemies at highest detail simultaneously (LOD/cull farther visuals without deleting AI), one shadowed directional source at 1024², no new shadowed point lights. Current M1 is already near those draw/triangle limits; they are caps, not spare capacity. Stage ≤512 MiB decoded texture residency, mostly 1K/2K maps, no routine 4K additions. Account for mip chains and framebuffer/transmission/shadow memory separately. Treat all limits as starting controls to revise from M2 GPU captures.

### Integrated-GPU fallback

Start at 960 × 540–1280 × 720 internal, 30 FPS, minimal optional effects, same simulation/mission logic. Current AMD samples do not pass the proposed p95 gate consistently. Do not advertise this fallback as validated until the integrated mission benchmark passes.

### Mobile, independently validated

No physical device audited. These are conservative starting budgets for a nominated midrange 6 GB Android device, plus a separately nominated iPhone/Safari target; model/OS must be recorded before certification. Baseline **30 FPS**, approximately 540 × 960 or equivalent landscape pixel area, DPR capped at 1 initially, dynamic resolution floor explicitly tested for readability. p95 ≤33.3 ms, p99 ≤50 ms after warm-up over a sustained session. No 60 FPS mobile commitment.

Initial game process ceiling ≤500 MiB, JS heap ≤128 MiB steady /192 MiB transient, estimated graphics residency ≤256 MiB, textures ≤128 MiB, ≤100 draws and ≤250,000 rendered triangles under the agreed counter definition. One 512² shadow map or measured cheaper contact treatment, capped transparent particles and pooled lights. These budgets are unverified proposals, not browser-enforced allocations. The current 409,614-triangle protected hero alone conflicts with the mobile triangle target: physical-mobile visual parity is blocked until a permitted derivative strategy is reviewed. Do not silently decimate the protected GLB.

## Review gate

Require a fully playable M2, accepted visual reference comparisons, no objective/save/pause/cinematic regressions, no missing assets/context loss, and measured tier compliance across sustained runs. If a tier fails, first reduce optional resolution/effects, shadow reach and distant visual detail; retain collision, enemy behavior, mission logic and input timing. Failed 60 FPS experiments must fall back to a reviewed stable 30 FPS target. No graphics-quality or mobile-performance claim is accepted without that evidence.
