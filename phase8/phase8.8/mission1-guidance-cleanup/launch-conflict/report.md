# Cleanup staging launch conflict — resolved

Date checked: 2026-11-16. Scope: launcher and launch documentation only.

## Cause and ownership

The supplied name `mission91-guidance-cleanup` does not identify an existing staging folder. The requested cleanup build is `phase8/phase8.8/mission1-guidance-cleanup`.

Its normal launcher previously defaulted to port **5286** (optional awakening-test mode remains 5287). A shell's `KALKI_STAGING_PORT` overrides the default. The inspection environment had no override.

Read-only listener and process inspection identified **PID 7500**, `node.exe`, running `phase8\phase8.8\mission91\serve.mjs` on `127.0.0.1:5286`. HTTP returned 200 and `X-Kalki-Staging-Milestone: 8.8-mission91`. A temporary bind attempt reproduced **EADDRINUSE**. This is a different existing Kalki staging build; it was never stopped or reconfigured. No existing process required termination approval.

## Resolution

Only this cleanup launcher's normal default changed to fixed port **5296**, verified free before launch. No random-port fallback was added. Bind errors now identify the attempted port and error code. Existing environment overrides remain supported; the documented command explicitly selects 5296.

```powershell
Set-Location -LiteralPath 'C:\Users\Hp\Downloads\kalki 2898AD'
$env:KALKI_STAGING_PORT = '5296'
node .\phase8\phase8.8\mission1-guidance-cleanup\serve.mjs
```

Open **http://127.0.0.1:5296/**. Keep the terminal open. Expected header: **X-Kalki-Staging-Milestone: 8.8-mission1-guidance-cleanup**.

Keep that exact origin and browser profile. Port 5296 has separate browser storage from 5286; no existing saved progress was read, migrated, deleted or overwritten. Switching hostnames also changes the storage origin. Browser save persistence was not tested in this launcher-only task.

## Actual verification

- PASS: `node --check` on the modified launcher.
- PASS: startup on fixed 5296, own test PID **10280**, HTTP 200, expected cleanup milestone header, response body hash matches the existing compiled build/index.html.
- PASS: stop only own test server; restart on the identical origin with own PID **10756**, same HTTP/header/body results.
- PASS: both owned verification servers stopped afterward; no listener remained on 5296.
- PASS: final listener inspection still showed original Mission91 PID **7500** on 5286, unchanged.
- PASS: **47/47 protected hashes**, **153/153 production hashes**, and **1,285/1,285 current source/build/rollback/Mission91 snapshot hashes** match; zero differences. Machine-readable details: `results.json` and `snapshot.json` beside this report.

No browser, gameplay test, audio generation, build compilation or save access was needed or performed. Gameplay/browser acceptance remains as previously reported, not upgraded by these server tests.

## Files changed and rollback

Modified: this copy's `serve.mjs` and `handoff.md` only.

Added under this copy's `launch-conflict/`: `serve.before.mjs`, `handoff.before.md`, `check.mjs`, `snapshot.json`, `results.json`, and this report. The first two are exact pre-edit launcher/documentation backups. Existing rollback files were not overwritten.

Production, personal saves, compiled gameplay, unrelated staging configurations, Mission91, and existing rollback copies remain untouched. No gameplay change or production promotion. Launch conflict resolved; task stopped here.
