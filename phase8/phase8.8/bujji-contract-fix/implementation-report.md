# Bujji contract objective correction

2026-11-16. **Implemented in isolated staging; offline validated. Browser acceptance unverified.**

## Cause

The old Bujji panel was a read-only conversation. Its launch button started Mission1 but never advanced m1-brief. The successful hub launch receipt was consumed without using it to update the contract. The mission's separate contract store therefore started at cursor0,and the HUD correctly displayed that stale authoritative first step. Opening/closing or reading the conversation was not equivalent to the contract interaction at the old marker.

Confirmation also lacked an immediate checkpoint write,and the world adapter's unconditional cleanup could clear a newer contract state if an old-round cleanup arrived after restoration. The latter is a source-level lifecycle hazard covered by the new Node ordering regression,not a claimed observed browser event.

## Correction

- Active Mission1 Bujji conversation now provides an explicit confirmation action. It advances only m1-brief and saves through the existing checkpoint authority immediately. Merely talking does not confirm.
- A successful explicit hub launch also records its contract acceptance before the mission introduction. Failed/paused/non-Mission1 entries do not use this path. The launch button clearly names contract confirmation. Cinematic completion never grants mission completion.
- Recorded confirmation is reused on remount/restart;normal checkpoint Continue restores its actual cursor. Cleanup is mission/round guarded so an old scene cannot clear a newer run.
- A single Mission1 objective view feeds the main HUD,contract HUD,journal and Bujji panel. After confirmation it shows crystal recovery/verification,then remaining patrols,Warden,relic or the genuine ending/completed state. Unregistered state displays synchronization rather than stale confirmation.
- No mission definition,crystal threshold,boss,damage,reward,save key/schema or Mission91 source changes. No new permanent progress system or listener/timer loop.

## Changed source files

- Modified [src/App.jsx](<C:/Users/Hp/Downloads/kalki 2898AD/phase8/phase8.8/bujji-contract-fix/staging/src/App.jsx>)
- Modified [src/game/arcOne/ArcOneObjectives.jsx](<C:/Users/Hp/Downloads/kalki 2898AD/phase8/phase8.8/bujji-contract-fix/staging/src/game/arcOne/ArcOneObjectives.jsx>)
- Modified [src/game/arcOne/contractState.js](<C:/Users/Hp/Downloads/kalki 2898AD/phase8/phase8.8/bujji-contract-fix/staging/src/game/arcOne/contractState.js>)
- Modified [src/game/arcOne/runtime.js](<C:/Users/Hp/Downloads/kalki 2898AD/phase8/phase8.8/bujji-contract-fix/staging/src/game/arcOne/runtime.js>)
- Modified [src/game/characters/CharacterInteraction.jsx](<C:/Users/Hp/Downloads/kalki 2898AD/phase8/phase8.8/bujji-contract-fix/staging/src/game/characters/CharacterInteraction.jsx>)
- Modified [src/game/characters/characterRuntime.js](<C:/Users/Hp/Downloads/kalki 2898AD/phase8/phase8.8/bujji-contract-fix/staging/src/game/characters/characterRuntime.js>)
- Modified [src/game/GameHud.jsx](<C:/Users/Hp/Downloads/kalki 2898AD/phase8/phase8.8/bujji-contract-fix/staging/src/game/GameHud.jsx>)
- Modified [src/game/StoryJournal.jsx](<C:/Users/Hp/Downloads/kalki 2898AD/phase8/phase8.8/bujji-contract-fix/staging/src/game/StoryJournal.jsx>)
- Created [src/game/arcOne/missionOneObjective.js](<C:/Users/Hp/Downloads/kalki 2898AD/phase8/phase8.8/bujji-contract-fix/staging/src/game/arcOne/missionOneObjective.js>)

All paths above are under the new working copy [phase8/phase8.8/bujji-contract-fix/staging](<C:/Users/Hp/Downloads/kalki 2898AD/phase8/phase8.8/bujji-contract-fix/staging>). Previous Mission91 staging and its rollback remain unchanged. Separate rollback: [phase8/phase8.8/bujji-contract-fix/rollback](<C:/Users/Hp/Downloads/kalki 2898AD/phase8/phase8.8/bujji-contract-fix/rollback>). Reports,tests,builds and disposable fixtures are contained in this new bugfix directory;existing story/approval reports were not overwritten.

## Old-save limitation

A save with a recorded contract cursor/done marker retains acceptance. An older bugged save that never recorded any confirmation cannot be safely inferred from an opened conversation or watched cinematic. Such a save needs one explicit confirmation through the new button;this preserves existing crystals,patrol state,rewards and mission history. No acceptance/completion history is fabricated.

Stop after this correction. Mission92 was not started;Mission91 and its approved story were not changed.
