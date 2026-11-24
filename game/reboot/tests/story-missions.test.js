import test from 'node:test'
import assert from 'node:assert/strict'
import {harness,finish,asset,tick} from './story-native-fixture.js'
import {registerStoryMissions} from '../src/gameplay/storyMissions.js'
import {STORY_MISSIONS} from '../src/content/storyMissions.js'
import {validateRuntimeContent} from '../src/campaign/contracts.js'
import {createCrystalWallet} from '../src/economy/crystalWallet.js'
import {bindMissionCrystalRewards} from '../src/economy/missionCrystalRewards.js'

test('three approved adaptations keep IDs, valid objective graphs and explicit world assignments',()=>{
 assert.deepEqual(STORY_MISSIONS.map(m=>[m.missionId,m.worldId]),[['mission-2','kashi'],['mission-3','shambala'],['mission-4','complex']])
 for(const m of STORY_MISSIONS)assert.equal(validateRuntimeContent(m),m)
})

test('native story journey uses real dialogue, physical terminals, encounters, receipts and reload',async()=>{
 const data=new Map(),storage={blocked:false,getItem:k=>data.get(k)??null,setItem(k,v){if(this.blocked)throw Error('fixture write failure');data.set(k,v)}},wallet=createCrystalWallet({storage}),f=harness(storage,wallet)
 registerStoryMissions(f.integration,{loadCombatAsset:async()=>asset(),loadCompanionAsset:async()=>asset()})
 const binding=bindMissionCrystalRewards({runtime:f.runtime,wallet})
 async function idle(){for(let i=0;i<30;i++){await tick();f.integration.skipStoryCinematic();await new Promise(r=>setTimeout(r,0))}}
 async function place(at){await f.runtime.suspend('fixture-placement');const body=f.player(),p={x:at[0],y:at[1]+.06,z:at[2]};body.setTranslation(p,true);body.setNextKinematicTranslation(p);await f.runtime.resume('fixture-placement')}
 async function talk(id){const character=f.integration.campaign.snapshot().characters;void character;let npc;f.host.world.forEachRigidBody(b=>{if(b.userData?.roleId===id)npc=b});assert.ok(npc,id);const p=npc.translation();await place([p.x+1.4,p.y,p.z]);assert.equal((await f.integration.interact(f.runtime.snapshot().session.id)).accepted,true,id);assert.equal(f.integration.storyChoice('briefing').accepted,true,id);await idle();f.integration.storyChoice('close')}
 try{
  await assert.rejects(f.integration.startMission('mission-2'))
  await f.integration.startMission('mission-1');await finish(f)
  assert.equal(wallet.snapshot().balance,200)
  for(const content of [...STORY_MISSIONS,STORY_MISSIONS[2]]){
   await f.integration.startMission(content.missionId);await idle()
   assert.equal(f.integration.locationSnapshot().locationId,content.worldId)
   await talk(content.story.introCharacter)
   await talk(Object.keys(content.story.briefings)[1])
   for(const index of content.story.order){const at=content.story.terminals[index].at;await place([at[0]+1.4,at[1],at[2]]);assert.equal((await f.integration.interact(f.runtime.snapshot().session.id)).accepted,true);await idle()}
   if(content.encounters.length){await f.frames(20);const first=f.enemy(content.missionId+'-guard-a').translation();await place([content.story.arena[0]+5,content.story.arena[1],content.story.arena[2]+7]);await f.frames(50);const moved=f.enemy(content.missionId+'-guard-a').translation();assert.ok(Math.hypot(moved.x-first.x,moved.z-first.z)>.1,'Real security AI moves in its authored arena');for(const suffix of ['a','b']){const id=content.missionId+'-guard-'+suffix;assert.ok(f.enemy(id),id);for(let n=0;f.runtime.snapshot().session.actorStates.find(a=>a.actorId===id)?.health>0&&n<35;n++){const enemy=f.enemy(id).translation();await place([enemy.x,enemy.y,enemy.z+2.2]);await f.hit(id);await idle()};assert.equal(f.runtime.snapshot().session.actorStates.find(a=>a.actorId===id).health,0,id)}}
   await talk(content.story.finalCharacter);await idle();assert.equal(f.runtime.snapshot().session,null)
   assert.ok(f.runtime.snapshot().progress.completedMissionIds.includes(content.missionId))
  }
  assert.equal(wallet.snapshot().balance,800)
  assert.equal(f.integration.campaign.snapshot().missions.find(m=>m.id==='mission-5').registered,false)
  await f.integration.startMission('mission-3');await idle();await talk('terrace-guide');await talk('trading-steward');await place([281.4,8,150]);for(let n=0;n<3;n++)assert.equal((await f.integration.interact(f.runtime.snapshot().session.id)).accepted,false);assert.equal(f.runtime.snapshot().session.state,'suspended');assert.ok(f.runtime.snapshot().session.failedObjectiveIds.includes('align-0'));await f.runtime.end()
  await f.integration.startMission('mission-3');for(let n=0;n<20&&!f.runtime.snapshot().session.pauseReasons.includes('story-cinematic');n++)await tick();assert.ok(f.runtime.snapshot().session.pauseReasons.includes('story-cinematic'));await f.runtime.suspend('window-blur');await idle();assert.deepEqual(f.runtime.snapshot().session.pauseReasons,['window-blur']);await f.runtime.resume('window-blur');assert.equal(f.runtime.snapshot().session.state,'active');await talk('terrace-guide');const before=structuredClone(f.runtime.snapshot().progress);storage.blocked=true;await assert.rejects(f.runtime.saveCheckpoint('entry'));storage.blocked=false;assert.deepEqual(f.runtime.snapshot().progress,before);await f.runtime.saveCheckpoint('entry');await f.runtime.end();await f.integration.recoverMission('mission-3');await idle();assert.ok(f.runtime.snapshot().session.completedObjectiveIds.includes('briefing'));assert.equal(f.integration.locationSnapshot().locationId,'shambala')
  assert.deepEqual(f.errors,[])
 }catch(error){console.log('mission errors',f.errors,f.runtime.snapshot().session?.pauseReasons);throw error}finally{binding.release();await f.release()}
 const reloaded=createCrystalWallet({storage});assert.equal(reloaded.snapshot().balance,800);const next=harness(storage,reloaded);registerStoryMissions(next.integration,{loadCombatAsset:async()=>asset(),loadCompanionAsset:async()=>asset()});try{assert.deepEqual(next.runtime.snapshot().progress.completedMissionIds,['mission-1','mission-2','mission-3','mission-4']);assert.equal(next.runtime.snapshot().progress.score,7000)}finally{await next.release()}
})
