# Phase 5.2 — Colorful graphics foundation and UI

11 November 2026 · React / Vite / Three.js / R3F · HP Victus Ryzen 5 5600H, GTX 1650 4 GiB, 8 GiB RAM.

**Review status:** functional/UI/HUD checks pass; graphics foundation is implemented. The starting 30 FPS percentile budget passes in the tested production-build sample, but repeated long frames remain. **Full stable-performance acceptance is pending; do not treat this report as a stutter-free certification.**

## Delivered design

The opening experience is now a real main menu with Continue Game, Level Selection, New Game, Settings and Exit Game. A live R3F architectural scene uses the existing protected Bhairava asset without editing it. Warm sandstone, teal architectural accents, gold trim, atmospheric depth and a restrained camera drift replace the previous text-only entry. Menu animation requests frames at 30 Hz and stops when the document is hidden. The menu renderer unmounts for gameplay; the gameplay renderer unmounts on exit rather than retaining a hidden world alongside the menu.

Three selectable 3D location studies establish distinct directions: Kashi uses warm golden stone; Shambhala uses green planting and softer natural colors; the Complex uses metallic teal and gold structures. The last two are clearly labeled planned-environment studies. They do not create new playable chapters or claim completed production environments. The visuals remain a foundation built from authored primitives, not scan-quality AAA environment art.

The main menu, campaign, shared settings, pause, victory and completion surfaces use coral `#F07858`, teal `#19A6A0`, gold `#E8B94F`, violet `#8D72C7`, green `#8CBF72` and sand `#F2D9B8`. Serif display titles and system/monospace utility text avoid a downloaded font dependency. Buttons have consistent focus states, minimum touch targets, hover/entry transitions and reduced-motion treatment. Main menu and pause dialogs restore focus and use native modal focus containment.

## Navigation and saves

- Continue starts the saved selected chapter if it is unlocked and implemented; it otherwise chooses an unlocked implemented chapter. Existing saves store campaign progression, not an in-progress world checkpoint, so Continue starts that mission's run rather than claiming exact-position restoration.
- New Game explicitly confirms a **fresh Mission 1 run while preserving earned campaign progress**. Cancel leaves saves alone. This non-destructive behavior honors the instruction to preserve completion data, rewards and unlocks; it is not an erase-save operation.
- Level Selection opens from the main menu and has a back route. Ten arcs expose 100 designed mission slots, ten per arc. Only the existing ten implemented combat prototypes can be launched, and only when unlocked. Ninety story plans remain visibly planned and disabled.
- Each mission has a distinct deterministic SVG landscape/architecture composition, title, region, objective description, implementation state, earned rewards where present and reward category. These are original vector **location concepts**, labeled accordingly, not misleading screenshots of unbuilt missions. Planned rewards remain undefined rather than invented amounts.
- Settings share the existing audio and touch-control systems and add Balanced/Performance graphics and Full/Compact/Minimal HUD preferences. The new visual-preference storage key is separate from campaign progression. Sound/volume/dialogue controls are available in pause/settings rather than the active-gameplay header.
- Exit Game confirms leaving, stops the menu scene and shows a saved-progress screen where the user can close the tab or return. A normal browser tab cannot reliably close itself; no false desktop-app exit behavior is simulated.

## Graphics foundation

The active mission renderer retains ACES/sRGB, antialiasing, the existing 1024² player-following PCF sun shadow and pooled local lights. Hemisphere/fill light and fog colors now separate warm Kashi-like spaces from the cooler teal/violet Glass Wastes. The renderer caps its default drawing-buffer area at 1280 × 720 pixels (921,600 pixels), while keeping portrait proportions. Performance mode additionally caps DPR at 0.75; Balanced caps DPR at 1. Device DPR is respected below the cap. No frame-rate cap is imposed on gameplay.

A single 256² generated paving/detail texture adds grounded surface scale; no new large bitmap textures were introduced. The existing mission-5 surface path remains intact. New distant architecture uses four instanced mesh batches plus one horizon arch rather than separate draw calls per tower. These are outside the existing navigation corridor, add no gameplay collision, and do not alter objective locations or combat geometry. Existing particles, Bujji, controller, animations, hit timing and camera collision remain authoritative.

The menu alone uses a one-frame 256² contact-shadow bake to ground the static character presentation. There is no new full-screen postprocessing chain, ray tracing, real-time reflection capture, shadow-resolution increase or protected-character texture/geometry conversion. Material reflection quality remains limited by the existing raster/environment setup. The current visuals should be reviewed as a colorful foundation, not certified photorealism.

## Gameplay visibility revision

The follow-up HUD request supersedes the initial large status panels. Final health is anchored at bottom-left, above touch-control space on portrait. Score/crystals are small indicators, Overdrive is a compact lightning symbol/counter, and objectives are a small top-right disclosure. The central view is left to the player and combat. The logo and pause action remain; the wide gameplay top bar and permanent briefing/bounty buttons are gone. Briefing and optional bounty entry remain reachable through objective details.

Secondary status hides after 4.2 simulation seconds without a relevant update during safe exploration. Combat, low health and active Overdrive retain important status. Full HUD retains status; Compact adds contextual visibility; Minimal reduces nonessential status but keeps health and provides on-demand access. Existing combat dialogue expires after 3.2 simulation seconds and now uses a small fading strip. Objective detail, briefings and chase instructions are on demand. Boss health remains conditional on intro/active boss state. Pause holds the simulation timers and dialogue fade. See [HUD report](phase52-hud-redesign-report.md).

## Verification and limitations

Final ordinary-input results: Mission 1 keyboard **PASS** (57.9 s route), Mission 2 keyboard **PASS** (94.0 s), Mission 2 portrait touch **PASS** (104.0 s). Each defeated its boss, collected the relic, preserved rewards/unlocks across reload and recorded no page errors, console errors, missing resources or forbidden active-gameplay story overlays. Final scores were 4,550 / 6,760 / 6,760. Mission 2 prerequisite completion in fresh contexts is an explicitly separate unlock fixture. Full fresh Mission 1 touch completion was not run; its portrait HUD and display bindings were tested independently.

Actual bounty duel and Bujji chase **PASS** on desktop and portrait: counter windows, attack/guard/touch controls, obstacle collisions, pause/resume, outro/handoff, main-world restoration, saved completion, replay and leave cleanup. Production UI and focused HUD suites pass both layouts. Build **PASS** (664 modules), lint **PASS** with no warnings, and campaign persistence/camera collision/shader ownership checks **PASS**.

### Actual GTX 1650 measurement

[Raw performance and acceptance result](phase52-performance-results.json), [reproducible harness](phase52-evidence/measure-combat.mjs), [all raw frame deltas](phase52-evidence/after-frame-trace.json).

Packaged production build, Chrome 157.0.8103.40 headless, **verified ANGLE NVIDIA GTX 1650 / D3D11**, 1280 × 720, DPR 1. No other audit browser suite or build ran during the measurement. The test waits for the hero to render, then warms for 12 seconds. A 120.10-second foreground route retains **all 11,095 frame deltas**, including stalls: mean **92.38 FPS**, mean **10.82 ms**, p50 **7.0 ms**, p95 **27.8 ms**, p99 **41.3 ms**, worst **208.1 ms**. There were **282 frames above 33.334 ms**, **51 above 50 ms**, **30 above 100 ms**, no frames above one second and no hidden-frame exclusions.

The 120 seconds include traversal, combat and settling; this is not 120 seconds of uninterrupted fighting. A separately labeled **2,363-frame /29.80-second target-or-effect combat subset** had p95 **28.2 ms**, p99 **48.3 ms**, and the same 208.1 ms worst frame. All five sentinels were defeated using normal keyboard input; the measured segment does not certify boss completion (the independent full mission routes do).

Sampled renderer counters ranged **192–430 calls** and **1.239–1.252 million triangles**, with **56 textures**. These include renderer pass effects and exceed the initial 250-call /1-million-triangle planning guardrails in some views. Transmission passes, skinned rendering and existing material complexity remain profiling candidates; no causal attribution is claimed without a trace/A-B. Sampled JS heap ranged **82.6–118.6 MiB**; this does not measure total native/WASM process memory or dedicated/shared VRAM and cannot certify the full memory budget.

**Result:** p95/p99 meet the starting 30 FPS percentile thresholds, including the combat subset. **The separate no-repeated-long-stalls gate does not pass.** The average is not evidence of stable 60/90 FPS. A longer thermal test and targeted main-thread/GPU/paging investigation of the 30 long frames remain necessary before stable-production acceptance. The Phase 5.1 M1 development-mode samples are not comparable enough to claim a before/after speedup. No graphics or power settings were changed at the OS level.

Preservation **PASS**: **4,014** immutable baseline public/phase3/phase4/archive files match; all **47** prior recorded protected checks match. Seven existing source files changed and nine source files were added, as enumerated in [changes and hashes](phase52-changes-and-hashes.json). Package manifests, Vite configuration, protected Bhairava, Groom 17 and rollback assets remain unchanged.

The final outcomes, actual frame-time measurements and preservation checks are recorded in the three machine-readable deliverables beside this report. Evidence distinguishes display fixtures from ordinary-input completion. Tests use fresh isolated browser contexts and do not open or reset the user's saved profile. Portrait is touch emulation on the laptop, not physical Android/iPhone performance certification.

The first ordinary-input run exposed a completion-video skip button overlap from the relocated briefing button. The video overlay order was corrected and final runs retested; the initial failed evidence is retained. Focused exploration-hide assertions initially assumed a safe, fully ready spawn, but enemy targeting made that assumption invalid. The final diagnostic uses an explicitly labeled isolated display-only enemy-suppression fixture after the hero renders; ordinary-input combat completion is verified separately. Initial diagnostic output is retained rather than counted as a product pass.

The earlier Phase 4 legacy-test exceptions remain historical context; this change does not claim all historical scripts passed. Large physics/Three bundle warnings and Three.Clock/Rapier deprecation warnings remain. No physical-phone or long thermal certification, production likeness acceptance, full 100-mission implementation, or Phase 5.3 work is claimed.

## Before and after

### Main menu

Before: the app opened directly into campaign selection; a complete main menu was absent.

![Before opening screen](phase52-evidence/before-desktop-main-menu.png)
![After main menu](phase52-evidence/after-desktop-main-menu.png)

### Level selection

![Before level selection](phase52-evidence/before-desktop-level-selection.png)
![After level selection](phase52-evidence/after-desktop-level-selection.png)

### Pause

![Before pause](phase52-evidence/before-desktop-pause.png)
![After pause](phase52-evidence/after-desktop-pause.png)

### HUD and representative playable environment

![Before M2 HUD and environment](phase52-evidence/before-desktop-hud.png)
![After compact M2 HUD and environment](phase52-evidence/after-desktop-hud-compact.png)
![After portrait HUD](phase52-evidence/after-portrait-hud-compact.png)

### Distinct location studies

![Kashi preview](phase52-evidence/after-desktop-location-kashi.png)
![Shambhala planned-location preview](phase52-evidence/after-desktop-location-shambhala.png)
![Complex planned-location preview](phase52-evidence/after-desktop-location-the-complex.png)

### Victory

![After victory navigation](phase52-evidence/after-desktop-victory.png)

Stop after Phase 5.2 review. No Phase 5.3 implementation is included.
