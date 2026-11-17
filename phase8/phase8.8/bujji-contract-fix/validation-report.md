# Validation results

**188 automated checks:180PASS,8NOT APPLICABLE,0finalFAIL.** Two additional separate-process disposable save checksPASS. [Full case index](<C:/Users/Hp/Downloads/kalki 2898AD/phase8/phase8.8/bujji-contract-fix/final-test-index.json>).

- New focused suite16/16PASS:before/after confirmation,shared current objective,duplicate rejection,hub entry,paused/closed conversation guards,original marker action,three-crystal requirement,Warden progression states,checkpoint Continue,stale cleanup,remount,old/malformed saves and unchanged Missions2–10 conversation data.
- Mission91 regression25/25PASS. Combat20,divine core10,divine integration24,combat visual13 and existing boss-intro10 checksPASS.
- Mission1–10 contract fixtures all executed sequentially:70checks,62PASS/8NOT APPLICABLE. These are direct Node/CPU/source fixtures,not natural playthroughs.
- Separate Node processes verify actual same-record confirmation persistence,restoration without confirmation prompt,zero load writes,unchanged completion/rewards and preservation of an unknown older-save field. [phase8/phase8.8/bujji-contract-fix/save-write-results.json](<C:/Users/Hp/Downloads/kalki 2898AD/phase8/phase8.8/bujji-contract-fix/save-write-results.json>) and [phase8/phase8.8/bujji-contract-fix/save-read-results.json](<C:/Users/Hp/Downloads/kalki 2898AD/phase8/phase8.8/bujji-contract-fix/save-read-results.json>). Not browser refresh/server restart proof.
- Production-equivalent staging buildPASS(final1.01s);development entry buildPASS. [phase8/phase8.8/bujji-contract-fix/build-final.log](<C:/Users/Hp/Downloads/kalki 2898AD/phase8/phase8.8/bujji-contract-fix/build-final.log>); [phase8/phase8.8/bujji-contract-fix/dev-build-final.log](<C:/Users/Hp/Downloads/kalki 2898AD/phase8/phase8.8/bujji-contract-fix/dev-build-final.log>).
- LintPASS:0errors,12existing warnings,0new. [phase8/phase8.8/bujji-contract-fix/lint-final.log](<C:/Users/Hp/Downloads/kalki 2898AD/phase8/phase8.8/bujji-contract-fix/lint-final.log>).

Initial inherited integration I14 ran before the new build existed and failed its build-existence assertion;after building it passed. An inherited M07 source assertion expected unconditional getState().clear();it was updated in the copied test to require the guarded releaseArcOneContract call. Initial results are preserved as integration-before-build.json and mission1-before-cleanup-assertion.json. The new B09 behavior test verifies stale cleanup cannot erase restored acceptance. These were test-order/expected-wiring adjustments,not hidden gameplay failures.

## Browser limitations

No browser or server launched. Resource preflight at2026-11-16T14:24:03.538Z:260.11MiB available physical RAM,2562.37MiB commit headroom. A previous real Chrome session consumed substantially more physical headroom;launching another scene at this level was not considered safe. No fixed2GiB gate and no repeated browser retries.

Actual rendered before/after HUD,physical conversation-button/keyboard action,natural crystal/Warden completion and browser refresh/Continue remainUNVERIFIED. State/adapters,shared subscriptions,source UI wiring and cross-process save behavior passed;they are not presented as full browser acceptance.
