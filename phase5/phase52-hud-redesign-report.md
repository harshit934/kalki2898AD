# HUD redesign — Restore gameplay visibility

11 November 2026. Follow-up scope within Phase 5.2; no unrelated gameplay redesign.

**HUD functional result: PASS.** Full Phase 5.2 performance signoff remains pending because its otherwise passing starting percentile benchmark recorded repeated >100 ms stalls; see the [complete visual/performance report](phase52-visual-design-report.md).

## Final behavior

- **Health:** always visible at bottom-left, with teal/green fill, coral critical treatment and numeric percentage. Portrait reserves the lower touch-control area and places vitals just above it.
- **Score and crystals:** compact text indicators. Contextual modes reveal changes for 4.2 simulation seconds, keep critical combat context and offer a STATUS/LESS disclosure for on-demand access. Values remain bound to the existing stores.
- **Overdrive:** small lightning symbol and charge counter; active state remains readable. No charges, boost behavior or timing were changed.
- **Objectives:** small top-right OBJECTIVES button. Expanded details show current objective/enemy counts, route instructions, Bujji briefing and the optional Mission 2 bounty/replay action. Closing details frees the view; information is preserved.
- **Bujji:** no permanent large briefing button. The existing journal/briefing is available from objectives. Combat dialogue still expires after 3.2 simulation seconds, with a subtle fade; pause freezes its timer and animation. Companion support status is contextual or visible through Full HUD/STATUS.
- **Bosses:** the boss bar appears only during boss intro/active states, at the top edge. Health, phases and values remain driven by the original boss system.
- **Header:** small logo at top-left and accessible pause at top-right. Audio, volume and dialogue controls are in pause/settings. The wide opaque top bar was removed from active gameplay.
- **Bujji chase:** integrity, distance and courier gap remain compact; instructions move into CONTROLS disclosure. Steering/acceleration/brake touch surfaces, pause/leave and actual vehicle logic are unchanged.

## HUD preferences

Pause → Settings and Main Menu → Settings both expose Full HUD, Compact HUD and Minimal HUD. Compact is the default. Full retains secondary status; Compact hides it after safe exploration settles; Minimal additionally suppresses routine score/crystal information until updates or on-demand expansion. All preserve health and access to objectives and status. Preferences persist under `kalki-visual-settings-v1`; campaign save keys and their data are unchanged. Performance quality and HUD preferences save together without overwriting each other.

Visual layers use translucent warm-neutral panels, small utility text, coral/teal/gold accents, and pointer-events only on actual HUD buttons. The centre remains a canvas input surface. Full and Minimal do not change simulation, difficulty, rewards or mission availability.

## Evidence and test interpretation

[HUD test results](phase52-hud-test-results.json) combine focused display/visibility checks with actual mission and chase evidence. Focused fixtures verify numeric binding, boss-bar state, contextual hiding and geometry clearance; they do not certify actual boss defeat. Ordinary-input mission runs separately validate combat, boss/relic completion and saved progression. Chase runs use keyboard or dispatched real touch events without setting vehicle position or enemy health.

The visibility diagnostic checks both M1 and M2 at 1280 × 720 and 430 × 932: lower-left health, a canvas at the centre of the screen, no intersection between HUD rectangles and visible mobile action controls, and a conservative total HUD rectangle area below 10% of the viewport in settled exploration. This geometric threshold is not a substitute for human visual review. Initial safe-spawn/readiness assumptions encountered real enemy targeting; their outputs are retained. The final display-only fixture waits for the hero to render and zeroes enemy health in its isolated context to reliably distinguish safe exploration from combat. It does not claim ordinary-input enemy defeats; those are independently verified by the full mission runs.

Physical-phone performance, every possible notch/device aspect ratio and long thermal behavior are unverified. The target laptop and desktop-GPU portrait emulation are identified in the performance report. No protected character asset was edited.

Final focused result: **4/4 mission/layout cases passed**, with no page errors. The settled-exploration HUD rectangle sum was **2.26%** of the 1280 × 720 viewport and **4.39%** of the 430 × 932 viewport. The central hit-test returned CANVAS, and no visible mobile action-control rectangle intersected the measured HUD rectangles. These figures exclude on-demand expanded panels and are conservative rectangle areas, not opaque pixel counts. Both mission completions and the bounty/chase passed separately through ordinary inputs on desktop and portrait.

## Before / after screenshots

Before the visibility revision: initial Phase 5.2 HUD occupied the top edge with status panels.

![Before desktop HUD revision](phase52-evidence/hud-before-desktop.png)
![After compact desktop HUD](phase52-evidence/after-desktop-hud-compact.png)

![Before portrait HUD revision](phase52-evidence/hud-before-portrait.png)
![After compact portrait HUD](phase52-evidence/after-portrait-hud-compact.png)

![On-demand objective details](phase52-evidence/after-desktop-objectives-open.png)
![Full HUD](phase52-evidence/after-desktop-hud-full.png)
![Minimal HUD](phase52-evidence/after-desktop-hud-minimal.png)
![Compact Bujji chase display with actual touch controls](phase52-evidence/portrait-ground-chase.png)

No Phase 5.3 work is included. Review this HUD alongside the complete Phase 5.2 design and measured performance deliverables.
