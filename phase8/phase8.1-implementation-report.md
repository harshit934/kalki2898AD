# Phase 8.1 implementation

**CONDITIONAL PASS — campaign foundation implemented and offline-validated.** 2026-11-16.

## Completed

- Separate194-file staging baseline and rollback from unified7.7, with protected/production gates before copying.
- Ten connected arcs and100 unique meaningful definitions, exported in the full campaign CSV. All IDs/titles/order preserved; original adaptation ending designed with Karna’s powers, not implemented as gameplay.
- Catalogue, dependency validation/launch checks, compatible successor integration and read-only runtime bridge.
- Eight typed objective reducers; actual combat/boss read-side integration. Reserved factual assistant port, no AI/audio expansion.
-395/395 checks across22 suites pass:272 inherited checks adapted to the intentional campaign adapter changes, plus123 foundation/definition/graph/engine/save/bridge checks. Exact authorized campaign/App changes are separately asserted rather than weakening behavioral coverage.
- Build PASS; lint PASS with12 inherited warnings and zero new warnings. Existing large-chunk advisory remains.

## Correction and evidence

The new reset regression initially reproduced stale `objectives-satisfied` status after round-store resets arrived in sequence. It affected the transient observer only, not authoritative mission/reward state. One focused correction includes the current defeated-enemy/boss snapshot in its derivation key; F15 then passes. Pre-fix source, failing JSON/log and final results are preserved under `pre-reset-correction/`, `reset-defect-before.json` and `foundation-results.json`. An inherited launcher-identity assertion also initially expected the old banner; only its expected8.1 label was corrected. No actor, camera or combat fix was needed.

Actual campaign-module bodies are tested with explicit disposable in-memory storage for launch, completion, rewards2,500+750, reload/state recreation, replay deduplication, legacy history and unavailable slots. These tests do not prove natural gameplay, browser restart or personal-save contents.

## Not implemented / remaining

- No new playable missions:19 inherited runtime routes remain,81 slots planned. Continuous1→100 playthrough remains impossible while Missions11–19 and later gaps are unbuilt. Arc-final duels do not establish preceding story completion.
- Full story cinematics, character performances, new worlds/factions, escort/protection world controllers, survival/investigation content, production art and actual Karna powers are not implemented.
- Proposed rewards/difficulty are not applied to live combat. Existing balancing, controls, unlimited sprint and all boss contracts remain.
- The inherited arc/environment/character-plan mismatch is explicitly unresolved in the architecture report.
- Browser acceptance BLOCKED: 542.12MiB available RAM/1631.66MiB commit headroom versus prior ~572MiB browser overhead. No fixed2GB gate, browser launch, server, retry or user-process termination. UI, performance and actual gameplay remain unverified in8.1.
- Phase7 historical qualifications remain:7.4 administratively complete without browser combat proof;7.5 runtime gains unverified;65-effect visual quality and historical frame interruptions unresolved. Commercial voice/movie audio clearance is not changed.

## Files changed

- `phase8/phase8.1/staging/index.html`
- `phase8/phase8.1/staging/src/App.jsx`
- `phase8/phase8.1/staging/src/game/campaignSystem.js`
- `phase8/phase8.1/staging/src/game/campaign/CampaignFoundationBridge.jsx`
- `phase8/phase8.1/staging/src/game/campaign/catalogue.js`
- `phase8/phase8.1/staging/src/game/campaign/foundationData.js`
- `phase8/phase8.1/staging/src/game/campaign/missionFramework.js`
- `phase8/phase8.1/staging/src/game/campaign/runtimeBridge.js`

Other new files stay under `phase8/phase8.1/` for scripts, test adaptation, build, rollback and evidence, plus the six requested deliverables and two new overall work-index documents. No older roadmap/report was overwritten.

## Integrity and availability

47/47 protected,153/153 production,194/194 new rollback,5141/5141 recorded Phase7 files including prior staging/rollback/reports match.191/191 other inherited staged files match. The existing character/world/camera/effect/control/audio assets and source are unchanged. Personal saves/profiles were not accessed, copied, hashed or modified; no independent content verification claimed.

Launch only when resource pressure permits, from PowerShell in the project folder:

```powershell
node .\phase8\phase8.1\serve.mjs
```

Use the printed loopback URL in a disposable profile; banner identifies **Phase8.1 CAMPAIGN FOUNDATION STAGING**. Existing New Game/opening/free-roam/hub/Mission1 flow remains. No launcher is running. No production promotion or further milestone started.
