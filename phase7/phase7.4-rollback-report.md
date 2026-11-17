# Phase 7.4 rollback

Production was not changed. Current unaccepted candidate is `phase7/phase7.4/staging/`. Baseline is `phase7/phase7.4/rollback/`, verified 178/178 against `phase7/phase7.4/before.json` and accepted Phase 7.3 staging.

To return to the previous playable version, stop the Phase 7.4 launcher and use `node phase7/phase7.3/serve.mjs`. No copy-back, save reset, schema conversion or production rollback is required.

If file restoration is needed later, create a new directory from this rollback snapshot and rebuild there; preserve the current candidate and raw evidence. Never overwrite Phase 7.1, 7.2, 7.3, Phase 6 or their rollback snapshots. Four modified and three new source files are enumerated in the implementation report and integrity JSON. No original audio/model file was overwritten.

[Integrity evidence](phase7.4/integrity-results.json): protected 47/47; production 153/153; Phase 7.1 173/173; Phase 7.2 174/174; Phase 7.3 178/178; Phase 6 171/171; rollback 178/178; audio source 8/8. Personal profile never opened; no personal-save file read, copied, hashed or modified.

[Browser cleanup](phase7.4/browser-evaluation/attempt-1794775184732/results.json) records the resource-triggered stop and finally cleanup. Chrome PID 15996 independently checked absent. No task-owned server/browser/monitor remains intentionally running. User applications and manually launched game servers were not stopped.
