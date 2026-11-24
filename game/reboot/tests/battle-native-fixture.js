import assert from 'node:assert/strict'
import {tick} from './story-native-fixture.js'
export async function defeatStoryBoss(f,missionId,{testDefeat=false}={}){
 for(let n=0;n<30&&!f.enemy(missionId+'-boss');n++)await f.frames(4)
 const id=missionId+'-boss';assert.ok(f.enemy(id),'Actual principal actor deployed')
 await f.frames(145)
 if(testDefeat){
  const consolePosition=f.host.scene.getObjectByName('arena-shutdown-console').position
  await f.runtime.suspend('battle-fixture-placement');f.place(consolePosition.x,consolePosition.z+1.4);await f.runtime.resume('battle-fixture-placement')
  const shutdown=await f.integration.interact(f.runtime.snapshot().session.id);assert.equal(shutdown.accepted,true);assert.match(shutdown.message,/hazards suppressed/)
  const repeated=await f.integration.interact(f.runtime.snapshot().session.id);assert.equal(repeated.accepted,false);assert.match(repeated.message,/recharging/)
  await f.frames(2);assert.match(f.states.at(-1).battleEncounter.hint,/Hazards suppressed/)
  await f.runtime.suspend('battle-fixture-placement');const at=f.enemy(id).translation();f.place(at.x,at.z+2.2);await f.runtime.resume('battle-fixture-placement')
  const progress=structuredClone(f.runtime.snapshot().progress),health=f.runtime.snapshot().session.playerResources.health
  for(let n=0;n<35&&f.runtime.snapshot().session.playerResources.health>0;n++)await f.frames(180)
  assert.equal(f.runtime.snapshot().session.playerResources.health,0,'Actual boss attacks must be able to defeat the player');assert.ok(health>0)
  assert.deepEqual(f.runtime.snapshot().progress.completedMissionIds,progress.completedMissionIds,'Defeat cannot complete the mission')
  await f.runtime.retryCheckpoint(missionId)
  for(let n=0;n<30;n++){await tick();f.integration.skipStoryCinematic();await new Promise(r=>setTimeout(r,0))}
  assert.ok(f.runtime.snapshot().session.playerResources.health>0,'Checkpoint restores its saved health');assert.equal(f.runtime.snapshot().session.completedObjectiveIds.includes('defeat-story-boss'),false)
  for(let n=0;n<30&&!f.enemy(id);n++)await f.frames(4)
  assert.ok(f.enemy(id),'Retry redeploys the real principal');await f.frames(145)
 }
 const phases=new Set()
 for(let n=0;n<45&&f.runtime.snapshot().session.actorStates.find(a=>a.actorId===id)?.health>0;n++){
  const object=f.host.scene.getObjectByName('story-boss-'+missionId);phases.add(object.userData.battleState?.phase)
  // Fixture placement must reset the native controller's pending movement;
  // otherwise its previous terrace target drags the body through architecture.
  await f.runtime.suspend('battle-fixture-placement');const at=f.enemy(id).translation();f.place(at.x,at.z+2.2);await f.runtime.resume('battle-fixture-placement')
  await f.hit(id);await f.frames(2);for(let k=0;k<4;k++)await tick()
 }
 assert.equal(f.runtime.snapshot().session.actorStates.find(a=>a.actorId===id).health,0)
 assert.ok(f.runtime.snapshot().session.completedObjectiveIds.includes('defeat-story-boss'))
 assert.ok(phases.has(1)&&phases.has(2)&&phases.has(3),'All real boss health phases observed')
}
