# Phase 7.2 preservation and rollback

16 November 2026 (Asia/Calcutta). **PASS — integrity and rollback.**

- New candidate: `phase7/phase7.2/staging/`; compiled output `build/`; isolated launcher `serve.mjs`.
- Untouched accepted Phase 7.1 copy: `phase7/phase7.2/rollback/` — 173/173 hashes match `before.json`.
- Tested initial Phase 7.2 source before the responsive correction: `pre-responsive-fix/` — 174/174 hashes match `pre-responsive-fix-hashes.json`.
- Original accepted Phase 7.1 remains in its original path, 173/173 hashes unchanged. Its conditional opening acceptance remains intact. The rejected shader candidate was not used.
- Production 153/153, protected 47/47, Phase 6 baseline 171/171, accepted cinematic 16/16 and audio/voice 16/16 hashes match. See `phase7.2/integrity-results.json` for exact changed paths and hashes.

Only four candidate source paths differ: freeRoamCamera helper, Player integration, MobileControls exploration Dodge availability and exploration CSS. New helpers/tests/builds/reports remain under Phase 7.2. No environment/model/lighting/production/save schema/reward/unlock changes or personal profile access. Original failed layout screenshots and the pre-browser harness syntax failure remain preserved rather than erased.

Rollback requires no production restoration: stop any future owned launcher with Ctrl+C and use original Phase 7.1 or the untouched rollback. To inspect pre-responsive behavior, use its separate backup without overwriting either version. Do not delete old work or copy candidate sources into production.

Both sequential owned Chrome PIDs (5256, 21060) were verified absent; owned Phase 7.2 test runners zero. Each session closed its local server and memory monitor. No unrelated application terminated or caches/files deleted. No Phase 7.3 started.
