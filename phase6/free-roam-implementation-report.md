# Phase 6 — bounded Kashi exploration implementation

15 November 2026. **IMPLEMENTATION PRESERVED; BROWSER ACCEPTANCE BLOCKED.** The user explicitly chose “Preserve work and report browser testing blocked” after the test infrastructure exhausted memory. No further browser test was launched.

## Location and flow

New staging: `phase6/free-roam-staging/staging/`. Untouched pre-edit source: `phase6/free-roam-staging/rollback/`. Based on the completed isolated cinematic opening; no production merge.

Implemented orchestration:

**Fresh campaign → existing opening → bounded exploration → nearby mission hub interaction → existing Mission1 launch.**

Exploration has a separate active/phase state. The campaign's `isPlaying` remains false until the existing mission launch succeeds. During exploration the same world, protagonist, lighting and physics render, while the `Gameplay` subtree containing mission enemies, hazards, objectives, collectibles and rewards is not mounted. It mounts normally after the hub starts Mission1. Combat/boss/campaign/reward store implementations are unchanged.

This is a **limited street district**, approximately 16 × 64 metres before boundary margins, not a fully open-world city. It does not add districts, interiors, a new environment or new campaign content. The original environment/default and opt-in Kashi separation remain.

## Implemented components — source confirmed, runtime unverified

- `game/exploration/explorationState.js`: separate presentation/exploration state and save record, pose validation, district limits, hub eligibility, camera heading, one pending launch and campaign-resume phase.
- `ExplorationWorld.jsx`: four fixed boundary colliders, a visible hub using an existing carved-monolith asset with marker accents, and periodic/page-lifecycle exploration persistence. No mission-state writes.
- `ExplorationHud.jsx` and `exploration.css`: bounded-district label, hub distance, nearby Start Mission1 action, return to menu, accessible rotation/reset controls and touch look pad. Distant interaction is rejected.
- `App.jsx`: exploration launch and return flow, existing cinematic gating, hub interaction through E/the existing Interact input, mission HUD separation and saved-phase continuation. Mission1 calls its original launch/preparation path only after the nearby hub request.
- `GameCanvas.jsx`/`World.jsx`: exploration rendering/physics and conditional mission-subtree mounting. No replacement world assets.
- `player/Player.jsx`: exploration-only restored pose, camera-relative movement/orbit and boundary clamp. Existing walk/run/jump, gravity, collider movement and camera collision routines are reused. Attacks/Overdrive/dodge are not activated in exploration; normal mission branches retain their existing behavior.
- `player/MobileControls.jsx`: retains joystick, Sprint, Jump and Interact; combat actions are disabled/hidden only in exploration.
- `PauseMenu.jsx`: exploration keeps Resume, Settings and Exit; mission restart/selection actions remain in normal campaign mode.
- `cinematics/campaignOpeningState.js`: adds a replay-request getter for orchestration; existing acknowledgement/Skip/refresh semantics retained. The cinematic sequence and protected actor assets are unchanged.

## Controls, camera and limits

Existing keyboard movement: WASD/arrows, Ctrl for unlimited sprint, Space for jump, E for interaction, Esc for pause. No stamina mechanic. Existing mission controls are retained. Exploration adds right-button canvas drag, an on-screen look pad and rotation/reset buttons; mobile joystick input rotates with the exploration camera basis. Physical mobile behavior is not validated.

Existing movement constants remain walk 4.5, sprint 7, jump velocity 6.8 and gravity 19 in game units. Exploration yaw uses shortest-angle smoothing with factor `1-exp(-5*delta)`; follow smoothing/camera-clearance logic is reused. Pitch is limited to −0.2…0.65 radians. The intended configuration is preserved in `free-roam-staging/exploration-controls.json`; these constants are not measured real-world speed or smoothness results.

World bounds: X −8…8, Z −48…16, with a 0.45 software margin and tall physical boundary colliders. Jump height is not clamped by the X/Z fallback. Existing ground covers the bounded rectangle. Physical collision/camera behavior still requires browser testing.

Hub: X 3, Y −0.22, Z −10, interaction radius 2.4; excessive height or distant interaction is ineligible. The launch is latched to prevent repeat requests. Only successful existing campaign launch marks the separate exploration record as mission-started. Asset-preparation failure/cancellation does not award progression.

## Persistence and returning sessions

New key: `kalki-exploration-staging-v1`; fields are version, roam/mission phase, bounded position, yaw, pitch and whether the hub was visited. No campaign-save schema changes. The record is saved periodically and on menu/page lifecycle; reload restores a safe ground-level pose rather than a suspended jump.

Roam saves resume exploration. After the first hub launch, the saved phase resumes the existing campaign launch behavior; it does not invent an in-mission checkpoint system. Completed campaigns and other selected missions keep their normal campaign flow. Zero-completion legacy profiles without an exploration record are ambiguous; this new staging flow offers the pre-mission district rather than asserting that an unfinished mission was completed. Personal profiles were not inspected or migrated.

The existing cinematic acknowledgement decides whether the full opening plays. Returning acknowledged sessions skip it. Settings replay remains queued for a later Mission1/exploration launch without resetting progress. Storage failure exposes a session-only limitation; unit tests do not prove browser storage availability.

## Executed checks and blocker

**12/12 automated state tests PASS.** They cover first flow, distant/duplicate hub requests, all four clamp boundaries, independent pose/camera persistence, menu state, mission-resume phase, existing campaigns, corrupt/denied storage and airborne interaction.

Staging build PASS; lint PASS with the original nine warnings and no new errors. Existing large-chunk warning remains. No performance or visual-quality approval follows from these results.

The actual browser attempt aborted during Vite dependency optimization with **“memory allocation of 52 bytes failed”**, exit 1. No browser check journal or successful gameplay assertion was produced. The recorded failure artifact is explicitly a tool-execution observation, not reconstructed missing browser evidence.

After failure, Windows reported **647 MiB available physical RAM, 435 MiB remaining commit, 31,070 MiB total commit capacity**. C: had about 15.93 GiB free; storage was not the identified blocker. A post-failure process query found no temporary Playwright Chrome parent to reclaim. No unrelated process was stopped, and no OS/page-file/security setting was changed. The exact native allocation chain was not profiled; low headroom and the allocator failure are the observed facts.

The user chose preservation with browser testing blocked. All nine requested gameplay/browser acceptance areas remain **BLOCKED**, separately from passing unit tests. No gameplay screenshot, movement, camera, collision, touch, reload or hub-start PASS is fabricated. Earlier cinematic/audio evidence is historical and not proof of this new exploration mode.

## Integrity and changes

Fresh verification: **47/47 protected hashes**, **153/153 production source/config**, **159/159 new rollback**, **1,271/1,271 prior-stage files**, and **1,135/1,135 older bounded evidence files** match. Exact staged before/after hashes are in `free-roam-staging/integrity-results.json`. No audio generated/copied/extracted, models installed, service purchased or personal save accessed.

Eleven staging source files are new/modified: App, GameCanvas, World, PauseMenu, Player, MobileControls, campaignOpeningState and the four exploration files. All other new files are test/build/verification/launch scripts, configuration, logs/results and reports in the new directory. Earlier staging and rollback copies remain unchanged.

## Status and next action

**Not accepted for runtime use yet.** Preserve this implementation; free sufficient RAM/commit headroom before retrying the existing browser script. Test cinematic-to-roam, real keyboard/touch/camera/bounds, reload, hub-only launch and campaign regression with disposable profiles. Do not lower graphics or change combat to manufacture a pass. No new phase or production integration is authorized by this report.
