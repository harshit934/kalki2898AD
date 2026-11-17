# Phase 7.1 verified opening — partial delivery

15 November 2026. **PARTIAL DELIVERY.** The verified cinematic opening is enabled in the isolated playable Phase 7.1 staging build. Remaining acceptance gaps do not disable it. This is not full Phase 7.1 acceptance.

## Launch

Open PowerShell and run:

```powershell
Set-Location -LiteralPath 'C:\Users\Hp\Downloads\kalki 2898AD'
node phase7/phase7.1/serve.mjs
```

Open the exact `http://127.0.0.1:<port>/` URL printed by the command in a fresh Chrome Guest/disposable profile. The launcher chooses an available port; do not substitute a production/personal-save address. Keep that terminal open. **Ctrl+C stops the server.**

Select **NEW GAME → START MISSION 01**. These are the existing UI labels for beginning Mission 1 from the start while preserving campaign progress. In a genuinely fresh staging profile, this selects Mission 1, enters the exploration launch path, and starts the opening automatically. No settings change or acceptance override is required.

The prior actual browser run clicked **CONTINUE GAME** in a fresh disposable profile. That route and the New Game confirmation both call the same existing `begin(mission)`/`onStart` path. New Game wiring is source-confirmed; the exact New Game button sequence has not been independently browser-retested. Do not clear personal saves to obtain a fresh launch. Existing returning profiles may have acknowledged the opening; returning/replay runtime behavior remains UNVERIFIED.

## What is delivered

- Existing implementation: `phase7/phase7.1/staging/`.
- Existing compiled playable build: `phase7/phase7.1/build/`.
- New lightweight launcher: `phase7/phase7.1/serve.mjs`; serves the existing compiled build and shared assets read-only, without Vite startup, dependency optimization or a rebuild.
- Current opening mode is enabled as `continuous-opening`, with the existing 28-second choreography. No cinematic component, environment, actor, movement or audio event logic was rebuilt/replaced.
- Launcher syntax check PASS. Local HTTP smoke PASS: compiled entry HTTP 200; unapproved voice-catalogue request HTTP 403. Server stopped afterward. No browser launched for this delivery check.

## Actual browser-verified stages

Evidence remains in `phase7.1/browser-evaluation/attempt-1794766452475/` and the acceptance report:

1. **Wide environmental establishing shot:** `establishing.png`.
2. **Tracking character reveal:** `reveal.png`.
3. **Character close-up:** `closeup.png`.
4. **Rear/handoff-stage framing:** `handoff.png`.

The full sequence naturally reached cinematic idle, cleared the cinematic gameplay hold and left the existing free-roam state active. Completion acknowledgement was recorded; mission completion/rewards were not fabricated. Smooth frame-by-frame handoff continuity is a separate unverified measurement, not inferred from this state transition.

## Remaining UNVERIFIED acceptance items

- Skip Cinematic behavior in the real browser.
- Settings Replay Cinematic behavior.
- Refresh and returning-session behavior.
- Normal post-cinematic movement, follow/orbit camera controls.
- Continuous snap-free handoff and full-path no-clipping/no-freezing/glitch acceptance.
- Portrait/mobile rendered cinematic behavior and sustained performance/frame-time stability.
- The exact New Game confirmation button path, beyond source-level wiring to the already verified launch function.

Controls remain present; they are not disabled because tests are incomplete. Earlier automated checks remain separate evidence and do not convert these runtime items into PASS. Previous final browser decision remains BLOCKED for full acceptance; this delivery status concerns availability of the verified subset only.

## Integrity, changes and rollback

Fresh hashes: **47/47 protected, 153/153 production source/config, 171/171 Phase 6 baseline, 173/173 Phase 7.1 source and 171/171 rollback files unchanged**. Personal profiles/saves not accessed. Existing audio event logic and protected assets unchanged; no copyrighted movie dialogue/theme introduced.

Only `serve.mjs`, delivery verification/smoke-result JSONs and this report were added. Existing build entry and all directly referenced JS/CSS assets were checked present. No rebuild, model/package installation, paid assets, audio generation or browser test forced under pressure.

Verification: `phase7.1/delivery-verification.json`, `phase7.1/launcher-smoke-results.json`. Rollback remains `phase7.1/rollback/`; leaving this isolated launcher requires no production restoration. No server/browser remains from this task. No Phase 7.2 started.

**Final status: PARTIAL DELIVERY — available for isolated play, not full acceptance.**
