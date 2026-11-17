# Kalki 2898 AD — game prototype

React, Vite, Three.js / React Three Fiber and Rapier action-adventure prototype. This is a fan-made original adaptation, not official movie canon. Campaign design documents do not imply that all 100 missions are implemented or gameplay-accepted.

## Run the main source snapshot

Use Node.js compatible with Vite8 (20.19+ or22.12+, subject to installed dependency requirements).

```powershell
npm ci
npm run dev -- --port 5173 --strictPort
```

Use the same browser profile and origin, such as http://localhost:5173/, to retain its existing browser-local campaign data. Changing hostname, port or profile creates a different storage context. Never clear site data to troubleshoot without a separate save backup.

```powershell
npm run build
npm run lint
```

## Isolated recent fixes

These are separate candidates, not changes merged into the root game:

- `phase8/webgl-recovery-20261117/staging`: graphics-error containment; actual browser fallback acceptance pending.
- `phase8/boss-visibility-recovery-20261117/staging`: reset the boss's sunk/tilted defeat pose on a new round; visual acceptance pending.
- `phase8/campaign-persistence-20261117/staging`: campaign backups, recovery, confirmation/archival for New Game and reward deduplication; offline tests passed, exact browser/server restart sequence pending.

Each directory has a report with launch instructions and limitations. All reuse root dependencies and public asset paths. Do not mix their separate browser origins with personal campaign data. Tests use disposable storage and do not establish natural gameplay acceptance.

## Publication scope

`PUBLICATION-MANIFEST.json` records source snapshot provenance. Historical reports retain their original qualifications. This repository excludes local environment credentials, dependencies, builds, personal/test-save files, rollback snapshots, crash dumps, large diagnostic traces, audio recordings and video footage. Consequently some optional media references are intentionally unavailable; their presence in source is not distribution clearance. Do not add unauthorized movie footage, dialogue, soundtrack or actor voice clones.

Asset authorship/licensing and commercial distribution clearance are separate from a source-code push. Preserve asset attribution records. No blanket commercial rights or production readiness is claimed.
