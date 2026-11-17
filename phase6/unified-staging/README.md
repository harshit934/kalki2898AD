# Unified Phase 6 staging

From the project root:

```powershell
node phase6/unified-staging/server.mjs
```

Open the printed loopback URL in a new disposable profile only. Stop with Ctrl+C. The former fixed 2 GB available-RAM gate is superseded by the resource-aware audio playback procedure in `resource-aware-audio/procedure.md`. Available RAM alone does not prohibit a test: use one browser session, monitor commit pressure and browser health, test events sequentially, and stop safely on dangerous pressure or instability.

Flow: new campaign → opening (Skip available) → bounded exploration → nearby hub (E/Interact) → existing Mission 1. This is a limited district, not a full open world. Original environment remains default; revised Kashi stays opt-in. Opening replay remains in settings.

Existing voice categories use the shared dialogue bus and prototype Skip/replay panel. Master mute/volume and independent music/dialogue/SFX controls remain. Serious missing-history speech has no invented automatic mission trigger. Audio uses exact existing evaluation sample mappings and original Foley/ambience, not movie dialogue or theme. No commercial clearance is implied.

Staging launcher serves original public assets and five existing evaluation WAVs read-only. No audio copied into the new directory. The build output alone is not a self-contained deployment.

Build: `node phase6/unified-staging/build.mjs`.
Lint: `node node_modules/oxlint/bin/oxlint phase6/unified-staging/staging/src`.
Run each Node test: controller.test.mjs, exploration.test.mjs, opening.test.mjs, entrance.test.mjs and shared-audio.test.mjs.

Rollback: leave this directory and use untouched prior staging. `rollback/` is the unchanged free-roam base. Do not copy staging into production. Campaign save format is unchanged; use only disposable staging-origin storage.
