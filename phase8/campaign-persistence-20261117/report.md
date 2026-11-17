# Persistent campaign progression — isolated implementation

Status: implemented and offline-tested; browser/gameplay acceptance BLOCKED. The requested real Level5 → browser close → Vite stop/start → reopen → refresh sequence has NOT been performed. No full acceptance claim is made.

## Inspection and findings

The root game already uses `localStorage['kalki-campaign-progress']`, not React-only state. Its campaign store reads on module initialization and saves completion, unlocks, reward ledger and selection. Vite restart does not itself clear browser localStorage. No evidence establishes that this user's personal record was actually deleted. Origin changes (`localhost` versus `127.0.0.1`, port, scheme), a different browser profile, private browsing, site-data clearing, denied storage or corruption can make a save appear missing. Personal save content was not inspected or modified.

Confirmed gaps: load failures returned a fresh-looking default with only a console warning; there was no backup/recovery; known-field-only saves discarded extension fields; storage failures were not shown in the UI. The existing New Game control actually replayed Mission1 and changed the selected mission while keeping campaign progress, which could also appear to restart the campaign. Its precise contribution to the user's experience is unverified.

## Isolated implementation

Working copy: `phase8/campaign-persistence-20261117/staging/`.
Pre-change backup: `phase8/campaign-persistence-20261117/rollback/`.

Modified/created staging files:

- `src/game/campaignStorage.js` (new): existing primary key retained; optional saveVersion2 and timestamp; valid pre-write backup; recovery from backup; unique raw-record archives before replacing corrupt data or explicitly starting New Game; read-back verification; storage/conflict failure states; unknown legacy fields preserved. Loading alone never writes a migration.
- `src/game/campaignSystem.js`: automatic load, existing completion/selection/reward autosaves, explicit flush, mission-entry checkpoint, explicit-confirmation New Game with old-campaign archival. Rewards remain unique per mission/key even if a replay supplies a larger amount. Persistent campaignScore is derived from the unique reward ledger, not added again on load.
- `src/game/MainMenu.jsx`: existing Continue retained; failed/ambiguous save states cannot silently launch a fresh-looking campaign; visible save/recovery status; New Game confirmation and Cancel; confirmation required by the store as well as the UI.
- `src/App.jsx`: pagehide/hidden flush with listener cleanup; in-game save-failure notice. No combat, cinematics or mission content altered.
- `vite.config.js`: isolated copy reuses existing public assets read-only; no graphics changes.

### What is actually persisted

- Completed and unlocked mission IDs, selected mission and individual reward entries through existing authority.
- Campaign reward total, without duplicate replay payouts.
- Mission-entry checkpoint identifying the selected mission. Continue returns to that mission through the existing start flow; it does NOT reconstruct an arbitrary mid-fight world snapshot.
- Unknown existing extension fields, including character progression, health or inventory if already present in a legacy record, survive writes. No new character-upgrade system is invented. Story-related character access continues to derive from the saved campaign. This change does not add live health/inventory/upgrade serialization to gameplay systems that currently do not supply it.

The existing per-attempt gameplay score is distinct from permanent campaign rewards. Arbitrary live combat score, enemy transforms, boss phase and cinematic frame are not restored as a full simulation checkpoint. That remains a limitation rather than an unsupported resume claim.

### Recovery behaviour

A valid primary is loaded without changing it. If it is corrupt and a valid backup exists, the backup supplies progress; the original primary is archived before a later successful write. If neither can be read safely, an explicit warning is shown, normal Continue is disabled, and automatic writes do not replace the corrupt record. Storage errors or a changed primary from another tab report failure. Explicit New Game archives the old record first; failed archival prevents replacement.

This retains one pre-write valid backup plus unique archives for replacement events, not unlimited full-version history. Existing archives are never deleted. Unknown-field preservation is compatibility, not independent validation of every future extension schema. Ordinary localStorage does not provide a multi-tab transaction lock; the pre-write comparison catches observed competing changes but is not a database transaction guarantee.

## Actual validation

11offline checks PASS,0FAIL in `test-results.json`:

1. Legacy load performs no write; health/inventory/character extension fields survive save.
2. Corrupt primary recovers valid backup and archives original.
3. Unrecoverable corrupt primary is not silently replaced.
4. Unavailable storage reports failure.
5. Failed writes preserve the valid primary.
6. Observed competing-tab update is not overwritten.
7. Explicit fresh campaign archives previous progress.
8. Real campaign store completes Missions1–5 through progression APIs with a disposable file-backed storage adapter.
9. Fresh Node process restores Mission5 selection, five completions, Mission6 unlock and1750reward total; replay cannot increase the previous payout; unconfirmed New Game does nothing.
10. A second fresh Node process repeats the reload assertions.
11.156production source/config/build-policy hashes match the pre-change backup,0differences.

These tests invoke the real campaign authority but use synthetic disposable objective completions. They are NOT proof of natural Level5 gameplay or native Chrome localStorage persistence. They never access a real browser profile. Test storage is `disposable-storage.json`; it contains test data only.

Full staging lint passed with0errors and9warnings in unchanged files. Changed-file lint subsequently passed without diagnostics. Final staging build passed in45.81seconds (719modules). Existing large bundle warnings are not persistence failures.

## Required browser acceptance still BLOCKED

Resource preflight:120MiB available physical RAM and2505MiB available virtual memory. No browser or test server was launched. The user's running5173server was not stopped or changed. Real browser closure, Vite restart, refresh, computer restart and New Game dialog interactions remain UNVERIFIED. No claim that Windows shutdown was tested.

When safe, use one disposable staging origin consistently:

```powershell
Set-Location -LiteralPath 'C:\Users\Hp\Downloads\kalki 2898AD\phase8\campaign-persistence-20261117\staging'
node ..\..\..\node_modules\vite\bin\vite.js --host 127.0.0.1 --port 5316 --strictPort
```

Use http://127.0.0.1:5316/ every time with the same regular Chrome profile. Port availability has not been tested. This origin is separate from personal localhost:5173data. Reach/complete Level5 naturally on that disposable campaign, close Chrome, stop only this test server, restart the identical command, reopen the same URL, select Continue, verify selection/completions/rewards/unlocks, then refresh and repeat. New Game Cancel must preserve the existing campaign; confirm only on disposable data and verify its archive.

No implementation can honestly promise recovery after site-data deletion, private-profile disposal, disk failure or denied storage. Under normal persistent browser storage, server restarts and computer restarts do not erase localStorage. Acceptance remains pending the actual browser sequence and any requested full mid-mission checkpoint extension. Production, personal saves, earlier staging and rollback copies are unchanged; no promotion to localhost:5173was performed.
