# Boss partial visibility correction

Status: isolated implementation; offline validated; actual visual/gameplay acceptance UNVERIFIED.

## Confirmed defect and scope

BossEncounter's defeat animation tilts the visual group up to1.25radians, lowers its local Y by up to1.8units and shrinks it. The next-round branch restores physics translation but did not restore the visual transforms. BossArena is not keyed to the round, so those transforms can survive a restart. Active combat restores scale, but not the downward offset or X tilt. This is a reproducible code-level cause of a partly buried active boss.

The screenshot has an active442/720boss and4/100player health, consistent with the Warden/default encounter rather than Mission3's540boss/150player maximum. The screenshot alone does not prove that this particular run passed through the defective restart path. Camera-edge clipping or other live-state issues remain possible until actual browser inspection.

## Isolated changes

Staging: `phase8/boss-visibility-recovery-20261117/staging`.
Rollback: `phase8/boss-visibility-recovery-20261117/rollback`.

- Added `src/game/bossPresentation.js`: reset only the model's defeat-owned Y offset, X tilt and scale. Facing and parent physics/world position are preserved.
- Changed `src/game/BossEncounter.jsx`: invoke that reset in the existing round-change branch. No boss replacement, attack, health, damage, reward, arena, prerequisite or mission-completion changes.
- Changed staging `vite.config.js` only to reuse root public assets read-only from the isolated copy.
- Added recovery-local `verify.mjs` and `test-results.json`; historical tests and result files are untouched.

Production and localhost:5173source remain unchanged. No personal storage was read, reset or migrated. Earlier staging and rollback copies are untouched.

## Validation

-6offline checks PASS,0FAIL: old physics-only reset reproduces stale visual pose; new reset restores pose; facing/world position retained; null/repeated reset safe; round-change wiring present;156production source/config hashes match rollback.
- Build PASS:719modules,18.44seconds; existing large-chunk warning.
- Lint PASS:0errors,9warnings in unchanged code.
- Browser rendering, full visibility, combat damage/defeat and reward/completion:UNVERIFIED. Most recent resource preflight during investigation was233MiB physical RAM and1330MiB available virtual memory. No additional 3D session or server was launched under that pressure.

## Review launch, once memory permits

```powershell
Set-Location -LiteralPath 'C:\Users\Hp\Downloads\kalki 2898AD\phase8\boss-visibility-recovery-20261117\staging'
node ..\..\..\node_modules\vite\bin\vite.js --host 127.0.0.1 --port 5315 --strictPort
```

Open http://127.0.0.1:5315/. Port availability has not been tested. This distinct origin uses isolated browser storage, not the existing localhost:5173personal save. Do not fabricate completed prerequisites or copy personal saves to force access. Actual encounter review remains required before claiming the user's screenshot is fixed.
