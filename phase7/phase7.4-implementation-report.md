# Phase 7.4 — Representative combat visual upgrade

2026-11-16, Asia/Calcutta. **Implementation preserved; actual combat acceptance BLOCKED by memory pressure.**

## Baseline and selected scope

Inspected the Phase 5 combat visual gap audit/roadmap, Phase 7.1 cinematic acceptance, Phase 7.2 camera acceptance and Phase 7.3 introduction implementation/acceptance. New isolated working copy: `phase7/phase7.4/staging/`. Untouched rollback: `phase7/phase7.4/rollback/` (178 source/config files), copied from latest Phase 7.3 staging. Earlier conditional acceptance decisions are not upgraded or reopened.

Only **Mission 1 Scout / scout-01** and **Mission 1 Warden** receive new presentation. Other enemy instances and all ten arc-final boss profiles retain their behavior and visual paths. No new campaign or assets downloaded.

## Implemented source changes — not yet visually accepted

- Scout: reuse soldier-source GLB, original texture maps and Idle/Walk/Run clips; richer metal/dust body and visor material definition; existing merged scout armour activated only for this instance; bronze weapon finish. Existing stature/collider preserved.
- Scout animation: additive arm/spine/knee posing driven by the authoritative wind-up/strike/recovery and hit timestamps; anticipation resolves into a forward strike at the existing damage instant. Recoil, brief visual-only mixer slowdown and defeat knee pose added. Applied offsets are removed before each mixer update to avoid cumulative bone drift. These are procedural additions, not newly authored motion-capture clips.
- Warden: reuse original body/leg/weapon GLBs with owned material clones; seven small bronze/gunmetal panel details; existing silhouette, collider and phase accents retained. Breathing, speed-scaled leg stride, bracing, weapon anticipation/contact/recovery, recoil and defeat collapse added inside the existing presentation. Existing outer defeat timing/reward logic remains unchanged.
- Impact: one reusable 220 ms target-bound ring on each selected actor, enabled only by confirmed existing hit timestamps. Existing bounded particles remain. No damage callbacks, audio events, global hit-stop, camera shake, dynamic lights or particle emitters added. This is damage-confirmation feedback, not a new swept-weapon collision system.
- Arena: Mission 1 floor/rings receive warmer bronze/sandstone colouring and reduced ring emission. Existing arena, terrain, walls, lighting, shadows and gameplay geometry preserved. No world replacement or Kashi promotion.
- HUD/player: unchanged. Unlimited sprint remains intentional; no stamina fabricated. Player/controller, damage, AI, boss phases, rewards, save schema, mission state and audio source are unchanged.

## Exact affected source

- Modified `phase7/phase7.4/staging/src/game/BossEncounter.jsx`.
- Modified `phase7/phase7.4/staging/src/game/CombatEnemies.jsx`.
- Modified `phase7/phase7.4/staging/src/game/MissionOneWarden.jsx`.
- Modified `phase7/phase7.4/staging/src/game/RiggedEnemy.jsx`.
- Created `phase7/phase7.4/staging/src/game/CombatContactPulse.jsx`.
- Created `phase7/phase7.4/staging/src/game/combatVisualPresentation.js`.
- Created `phase7/phase7.4/staging/src/game/CombatWardenPart.jsx`.

Other additions under this milestone are isolated build/launch scripts, tests, diagnostic browser build, logs and reports. No production, prior accepted staging or rollback source was edited.

## Validation performed

109 automated checks pass, including 13 new presentation/contract checks and 96 inherited camera/intro/audio/exploration tests. Final build passes. Final lint: zero errors, **12 existing baseline warnings, zero new warnings**. Same lint was run on rollback: earlier Phase 7.3 report said nine, but matched current-source validation finds twelve (including its introduction component warnings). No prior-stage files were edited to change that result.

Implementation-time lint caught missing selected-enemy prop forwarding and leftover Warden component references; corrected before browser execution. No combat acceptance is inferred from compilation.

A single real Chrome attempt started at desktop 1920×1080, with a disposable context and resource monitor. It reached the opening/Skip flow but was closed while waiting for exploration, before any selected-enemy/boss fight. No final combat screenshots or FPS measurements were obtained. After the stop, the small Warden defeat-pose addition and focused unit/build/lint checks were finalized without another browser launch; it remains browser-unverified too.

## Technical/performance limitations

No quality reduction or new packages. Geometry additions are small: one reused merged scout armour mesh, seven Warden detail meshes and two normally hidden rings. No new lights, high-cost shaders or high-resolution textures. Actual draw-call delta, frame-time distributions, CPU/GPU utilization and mobile responsiveness remain unmeasured; small source changes do not prove acceptable runtime cost. Physical Android was not tested.

## Launch when resources are safe

From project root: `node phase7/phase7.4/serve.mjs`. Open the printed loopback URL in a disposable browser profile. New Game → Start Mission 01 → watch/Skip opening → approach mission hub → E → watch/Skip mission intro. The first patrol is scout-01; the Warden uses the existing mission prerequisites/arena. Keep Phase 7.3 launcher for rollback. No automatic restart/retest is running.

**Do not expand to additional enemies or bosses until actual combat acceptance passes.**
