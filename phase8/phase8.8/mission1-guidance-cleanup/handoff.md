# Staging launch —Mission1 guidance cleanup

Implemented;offline validation PASS;browser verification BLOCKED.

PowerShell—run these three command lines only:

```powershell
Set-Location -LiteralPath 'C:\Users\Hp\Downloads\kalki 2898AD'
$env:KALKI_STAGING_PORT = '5296'
node .\phase8\phase8.8\mission1-guidance-cleanup\serve.mjs
```

Open **http://127.0.0.1:5296/**. Leave the terminal running. The cleanup copy now defaults to fixed port 5296; the explicit environment setting also prevents an old shell override from selecting 5286. Port 5286 belongs to the separate Mission91 staging server (PID 7500 at investigation time), which was left untouched. If 5296 is occupied, inspect ownership before taking any action; do not force-kill another server. This launcher never selects a random port.

Keep exactly the same URL and browser profile for disposable cleanup progress. Port 5296 is a separate browser storage origin from 5286, and localhost is a different origin from 127.0.0.1. Existing progress at 5286 was not read, copied, cleared or migrated. Continue at 5296 can restore only saves already present at that origin/profile. Launcher checks do not establish browser save-persistence acceptance.

Verify terminal banner **MISSION1 GUIDANCE CLEANUP** and response header **X-Kalki-Staging-Milestone:8.8-mission1-guidance-cleanup**. This is [phase8/phase8.8/mission1-guidance-cleanup/staging](<C:/Users/Hp/Downloads/kalki 2898AD/phase8/phase8.8/mission1-guidance-cleanup/staging>),not production. Choose **Continue** for existing staging progress,or use a disposable browser profile for tests. Never clear or overwrite personal saves.

In Mission1,the shared tracker and journal no longer command the player to face/confront/defeat/approach the Warden or final opponent. Bujji/assistant duplicate versions are removed from display. Three-crystal verification,patrols,Warden encounter,relic,rewards and progression remain intact. Neutral encounter status is shown where appropriate. Closing dialogue,Continue,restart and history rendering use the same policy;actual browser verification remains pending.

[Changed files,source trace,test results and protected hashes](<C:/Users/Hp/Downloads/kalki 2898AD/phase8/phase8.8/mission1-guidance-cleanup/report.md>). 153automatedPASS/8NOT APPLICABLE plus2separate-process savePASS;build/lintPASS;47protected hashes match.

Previous Bujji/Mission91 staging and rollback remain unchanged. **Mission92 was not started. Stop here.**
