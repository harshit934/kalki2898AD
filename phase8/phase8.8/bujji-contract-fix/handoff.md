# Bujji HUD correction handoff

**Implemented; offline validated; real browser acceptance pending.**

Working copy: [phase8/phase8.8/bujji-contract-fix/staging](<C:/Users/Hp/Downloads/kalki 2898AD/phase8/phase8.8/bujji-contract-fix/staging>). Rollback: [phase8/phase8.8/bujji-contract-fix/rollback](<C:/Users/Hp/Downloads/kalki 2898AD/phase8/phase8.8/bujji-contract-fix/rollback>). No previous staging or production changes.

PowerShell launch:

```powershell
Set-Location -LiteralPath 'C:\Users\Hp\Downloads\kalki 2898AD'
node .\phase8\phase8.8\bujji-contract-fix\serve.mjs
```

Browser URL:http://127.0.0.1:5286/ . Verify header X-Kalki-Staging-Milestone:8.8-bujji-contract-fix. For testing,use a disposable browser profile. Keep the same origin/profile when using Continue;never reset or overwrite personal saves for validation.

Mission1:before acceptance,the Bujji instruction is available. In the active conversation choose **CONFIRM SALVAGE CONTRACT**;in exploration,the explicit **CONFIRM CONTRACT AND START MISSION1** hub/conversation launch accepts the first step. The next objective is crystal recovery/verification. Talking again shows that current task without asking for confirmation again. The journal and both HUDs read the same state.

Continue restores a saved acceptance;restart/remount retain acceptance but still require new run crystal verification and the existing patrol/Warden sequence. An old save with no durable confirmation evidence requires one explicit confirmation;no prior completion is invented.

Tests:180PASS/8NOT APPLICABLE plus2process-savePASS;build/lintPASS,12inherited warnings;47protected hashes match. Actual browser confirmation/refresh and full natural Warden encounter were not tested due260MiB available RAM. [phase8/phase8.8/bujji-contract-fix/validation-report.md](<C:/Users/Hp/Downloads/kalki 2898AD/phase8/phase8.8/bujji-contract-fix/validation-report.md>). Changed files/root cause: [phase8/phase8.8/bujji-contract-fix/implementation-report.md](<C:/Users/Hp/Downloads/kalki 2898AD/phase8/phase8.8/bujji-contract-fix/implementation-report.md>). Protection evidence: [phase8/phase8.8/bujji-contract-fix/integrity-report.md](<C:/Users/Hp/Downloads/kalki 2898AD/phase8/phase8.8/bujji-contract-fix/integrity-report.md>).

**Stop here. Mission92 has not been started. Mission91 and the approved narrative remain unchanged.**
