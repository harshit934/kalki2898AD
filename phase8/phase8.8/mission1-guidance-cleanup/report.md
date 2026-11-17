# Mission1 unwanted opponent instruction removal

2026-11-16. **Implemented in isolated staging; automated validation PASS. Browser verification BLOCKED.**

## Scope and source trace

User confirmed Mission1. The exact reported instruction was not found verbatim;the current source contains Warden-directed variants. The phrase final opponent occurs in Mission8 narrative context,which is outside this request and unchanged. Production/historical copies retain their original text because only new staging is authorized.

- [game/arcOne/missionOneObjective.js](<C:/Users/Hp/Downloads/kalki 2898AD/phase8/phase8.8/mission1-guidance-cleanup/rollback/src/game/arcOne/missionOneObjective.js>) — Live tracker branches: Clear patrols then approach Warden;Approach Warden arena;Defeat Warden. Direct neutral UI statuses;state kinds and gates unchanged.
- [game/arcOne/contracts.js](<C:/Users/Hp/Downloads/kalki 2898AD/phase8/phase8.8/mission1-guidance-cleanup/rollback/src/game/arcOne/contracts.js>) — Bujji prompts/replies: Before taking on Warden;Warden is the last obstacle. Canonical data preserved;conversation/contract-message display filtered.
- [game/assistant/responses.js](<C:/Users/Hp/Downloads/kalki 2898AD/phase8/phase8.8/mission1-guidance-cleanup/rollback/src/game/assistant/responses.js>) — Legacy objective/initial guidance: Face Warden;approach arena for Warden. Canonical drafts preserved;active assistant response and history presentation filtered.
- [game/assistant/campaignAnswers.js](<C:/Users/Hp/Downloads/kalki 2898AD/phase8/phase8.8/mission1-guidance-cleanup/rollback/src/game/assistant/campaignAnswers.js>) — Contextual next-step fallback: Approach existing arena trigger;defeat boss. Unchanged facts/generator;active Mission1 display filtered.
- [game/storyCampaign.js](<C:/Users/Hp/Downloads/kalki 2898AD/phase8/phase8.8/mission1-guidance-cleanup/rollback/src/game/storyCampaign.js>) — Mission1 objective consumed by journal and card: Recover crystals and defeat Arena Warden. Canonical objective preserved;Mission1 display filtered.
- [game/MissionOneObjectives.jsx](<C:/Users/Hp/Downloads/kalki 2898AD/phase8/phase8.8/mission1-guidance-cleanup/rollback/src/game/MissionOneObjectives.jsx>) — Route/objective summary: Clear patrols,defeat Warden,recover relic. Displayed summary filtered;three crystals,patrols,relic and optional scans retained.
- [game/GameHud.jsx](<C:/Users/Hp/Downloads/kalki 2898AD/phase8/phase8.8/mission1-guidance-cleanup/rollback/src/game/GameHud.jsx>) — Legacy fallback alongside shared tracker: DEFEAT THE WARDEN. Mission1 display scoped;other missions unchanged.

The active GameHud and contract tracker use the shared Mission1 objective view,also read by the journal and Bujji panel. Static journal/mission-card summaries,route scans,and assistant current/history output were separately traced. The old standalone assistant component is not mounted by current App;its data is consumed through the active assistant's scoped presentation path. Combat narrative/cinematic source searches found no additional matching Mission1 instruction. The existing Mission1 introduction contains no matching face/confront directive. [Source inventory](<C:/Users/Hp/Downloads/kalki 2898AD/phase8/phase8.8/mission1-guidance-cleanup/instruction-source-inventory.json>).

## Change

Mission1 now shows remaining patrol counts without the appended Warden directive;when only the encounter remains,the HUD/journal show neutral Contract checks and patrols complete or Encounter in progress. No replacement command to confront the opponent. Boss identity/health and actual combat remain available.

A pure Mission1-only presentation policy removes equivalent directives from the active Bujji,summary,journal,card and assistant UI boundaries. Stored history is filtered again when rendered,so closing/reopening dialogue cannot restore an old instruction. No preference/save flag can turn the removed UI text back on;fresh launches,Continue and restarts execute the same display policy. Approved/legacy Telugu source text is not edited;when a changed English answer has an untranslated matching draft,the stale translation is withheld rather than invented. Actual recordings/audio are untouched.

Canonical objectives and three-crystal,patrol,Warden,relic,mission completion,reward and save conditions are unchanged. All other mission IDs,including91,return their original strings/data from the policy. Mission91's story and progression remain unchanged;Mission92 was not started.

## Changed source files

- Modified [src/game/arcOne/ArcOneObjectives.jsx](<C:/Users/Hp/Downloads/kalki 2898AD/phase8/phase8.8/mission1-guidance-cleanup/staging/src/game/arcOne/ArcOneObjectives.jsx>)
- Modified [src/game/arcOne/missionOneObjective.js](<C:/Users/Hp/Downloads/kalki 2898AD/phase8/phase8.8/mission1-guidance-cleanup/staging/src/game/arcOne/missionOneObjective.js>)
- Modified [src/game/assistant/CampaignAssistant.jsx](<C:/Users/Hp/Downloads/kalki 2898AD/phase8/phase8.8/mission1-guidance-cleanup/staging/src/game/assistant/CampaignAssistant.jsx>)
- Modified [src/game/characters/characterRuntime.js](<C:/Users/Hp/Downloads/kalki 2898AD/phase8/phase8.8/mission1-guidance-cleanup/staging/src/game/characters/characterRuntime.js>)
- Modified [src/game/GameHud.jsx](<C:/Users/Hp/Downloads/kalki 2898AD/phase8/phase8.8/mission1-guidance-cleanup/staging/src/game/GameHud.jsx>)
- Modified [src/game/MissionOneObjectives.jsx](<C:/Users/Hp/Downloads/kalki 2898AD/phase8/phase8.8/mission1-guidance-cleanup/staging/src/game/MissionOneObjectives.jsx>)
- Modified [src/game/MissionSelect.jsx](<C:/Users/Hp/Downloads/kalki 2898AD/phase8/phase8.8/mission1-guidance-cleanup/staging/src/game/MissionSelect.jsx>)
- Modified [src/game/StoryJournal.jsx](<C:/Users/Hp/Downloads/kalki 2898AD/phase8/phase8.8/mission1-guidance-cleanup/staging/src/game/StoryJournal.jsx>)
- Created [src/game/missionOneUiText.js](<C:/Users/Hp/Downloads/kalki 2898AD/phase8/phase8.8/mission1-guidance-cleanup/staging/src/game/missionOneUiText.js>)

All are inside [phase8/phase8.8/mission1-guidance-cleanup/staging](<C:/Users/Hp/Downloads/kalki 2898AD/phase8/phase8.8/mission1-guidance-cleanup/staging>). Separate255-file rollback [phase8/phase8.8/mission1-guidance-cleanup/rollback](<C:/Users/Hp/Downloads/kalki 2898AD/phase8/phase8.8/mission1-guidance-cleanup/rollback>). Previous Bujji-fix and Mission91 builds and existing documentation are preserved. Test/build/launch/report support files are confined to this new work directory. No assets,packages,save schema or personal saves changed.

## Validation

**161 automated checks:153PASS,8NOT APPLICABLE,0FAIL.** Ten new policy checks cover exact/variant wording,all generated current/legacy guidance topics across boss states,history re-rendering,canonical-data immutability,other-mission identity and all UI boundaries. Existing contract correction16/16,Mission91 25/25,combat20/20,divine core10/10,boss intro10/10 and sequential Missions1–10 fixtures70checks62PASS/8NOT APPLICABLE also pass. [Complete case index](<C:/Users/Hp/Downloads/kalki 2898AD/phase8/phase8.8/mission1-guidance-cleanup/test-results.json>).

Two additional separate-process disposable save checksPASS. They verify existing confirmation/checkpoint persistence and load writes0 without campaign completions/reward changes;not actual browser refresh. Presentation has no new persistence or cache state. [phase8/phase8.8/mission1-guidance-cleanup/save-write-results.json](<C:/Users/Hp/Downloads/kalki 2898AD/phase8/phase8.8/mission1-guidance-cleanup/save-write-results.json>); [phase8/phase8.8/mission1-guidance-cleanup/save-read-results.json](<C:/Users/Hp/Downloads/kalki 2898AD/phase8/phase8.8/mission1-guidance-cleanup/save-read-results.json>).

Production-equivalent staging buildPASS(1.21s),lintPASS(0errors,12inherited warnings,0new). [phase8/phase8.8/mission1-guidance-cleanup/build.log](<C:/Users/Hp/Downloads/kalki 2898AD/phase8/phase8.8/mission1-guidance-cleanup/build.log>); [phase8/phase8.8/mission1-guidance-cleanup/lint.log](<C:/Users/Hp/Downloads/kalki 2898AD/phase8/phase8.8/mission1-guidance-cleanup/lint.log>). No failed checks hidden or skipped. No new gameplay defect/correction cycle occurred.

Browser verification was not launched:resource preflight14:42:44UTC showed312.37MiB available physical RAM and1292.64MiB commit headroom. Recent real Chrome usage was much larger;another rendering session was not safe. No arbitrary2GiB rule. Actual rendered absence,physical dialogue/restart/refresh and natural Warden playthrough remainUNVERIFIED. Generated-text/state/source tests are not browser acceptance. No browser or server process was started;all owned Node/build/lint commands exited.

## Integrity

- protected: **47/47 match**,0 unexpected differences.
- production: **153/153 match**,0 unexpected differences.
- rollback: **255/255 match**,0 unexpected differences.
- previousBujjiStagingAndEvidence: **686/686 match**,0 unexpected differences.
- storyApprovalAndMission91Reports: **9/9 match**,0 unexpected differences.
- canonicalObjectivesWardenCombatSaveMission91: **32/32 match**,0 unexpected differences.

[All47 protected SHA256 before/after values](<C:/Users/Hp/Downloads/kalki 2898AD/phase8/phase8.8/mission1-guidance-cleanup/protected-hash-comparison.json>). Personal save contents/browser profiles were not opened,copied,hashed or modified;only disposable Node fixtures were used. All boss/combat/controller and canonical mission/save data remain byte-identical.

Stop after this correction. No production merge or Mission92 work.
