# Staging launch —Mission1 guidance cleanup

Implemented;offline validation PASS;browser verification BLOCKED.

PowerShell—run these two command lines only:

```powershell
Set-Location -LiteralPath 'C:\Users\Hp\Downloads\kalki 2898AD'
node .\phase8\phase8.8\mission1-guidance-cleanup\serve.mjs
```

Open **http://127.0.0.1:5286/**. Leave the terminal running. If that port is already occupied,stop the old server in its own terminal withCtrl+C;do not use the old page or force-kill unrelated processes. This server deliberately does not choose a different port,so the same origin/profile can retain its saved progress.

Verify terminal banner **MISSION1 GUIDANCE CLEANUP** and response header **X-Kalki-Staging-Milestone:8.8-mission1-guidance-cleanup**. This is [phase8/phase8.8/mission1-guidance-cleanup/staging](<C:/Users/Hp/Downloads/kalki 2898AD/phase8/phase8.8/mission1-guidance-cleanup/staging>),not production. Choose **Continue** for existing staging progress,or use a disposable browser profile for tests. Never clear or overwrite personal saves.

In Mission1,the shared tracker and journal no longer command the player to face/confront/defeat/approach the Warden or final opponent. Bujji/assistant duplicate versions are removed from display. Three-crystal verification,patrols,Warden encounter,relic,rewards and progression remain intact. Neutral encounter status is shown where appropriate. Closing dialogue,Continue,restart and history rendering use the same policy;actual browser verification remains pending.

[Changed files,source trace,test results and protected hashes](<C:/Users/Hp/Downloads/kalki 2898AD/phase8/phase8.8/mission1-guidance-cleanup/report.md>). 153automatedPASS/8NOT APPLICABLE plus2separate-process savePASS;build/lintPASS;47protected hashes match.

Previous Bujji/Mission91 staging and rollback remain unchanged. **Mission92 was not started. Stop here.**
