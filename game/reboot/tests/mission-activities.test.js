import {defeatStoryBoss} from './battle-native-fixture.js'
import test from 'node:test'
import assert from 'node:assert/strict'
import {createElement} from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
import {harness,finish,asset,tick} from './story-native-fixture.js'
import {registerStoryMissions} from '../src/gameplay/storyMissions.js'
import {STORY_MISSIONS} from '../src/content/storyMissions.js'
import {MISSION1_CITY_CONTENT} from '../src/content/mission1.js'
import {MISSION_ACTIVITIES,STORY_PATROLS,withMissionActivities,activityObjectiveId} from '../src/content/missionActivities.js'
import {validateRuntimeContent} from '../src/campaign/contracts.js'
import {createCrystalWallet} from '../src/economy/crystalWallet.js'
import {CRYSTAL_KEY} from '../src/economy/crystalPolicy.js'
import {bindMissionCrystalRewards} from '../src/economy/missionCrystalRewards.js'
import MissionObjectives from '../src/ui/MissionObjectives.js'

function storageFixture(){const data=new Map([['personal-save-sentinel','unchanged']]),storage={blocked:null,getItem:k=>data.get(k)??null,setItem(k,v){if(this.blocked===k)throw Error('isolated test write failure');data.set(k,v)}};return {data,storage}}
async function idle(f){for(let i=0;i<30;i++){await tick();f.integration.skipStoryCinematic();await new Promise(r=>setTimeout(r,0))}}
async function position(f,at){await f.runtime.suspend('fixture-placement');const p={x:at[0]+1.4,y:at[1]+.06,z:at[2]},body=f.player();body.setTranslation(p,true);body.setNextKinematicTranslation(p);f.host.world.step();await f.runtime.resume('fixture-placement');await f.frames(2)}
function actualStation(f,id){const group=f.host.scene.getObjectByName('activity-station-'+id);assert.ok(group,'Actual grounded station '+id);return group.position.toArray()}
async function openStation(f,s){await position(f,actualStation(f,s.id));assert.equal((await f.integration.interact(f.runtime.snapshot().session.id)).accepted,true);assert.equal(f.states.at(-1).missionActivity.panel.id,s.id)}
async function act(f,action){const result=await f.integration.missionActivityAction(action);await idle(f);return result}
async function hold(f,key,frames){const target=f.host.renderer.domElement.ownerDocument.defaultView,down=new Event('keydown',{cancelable:true}),up=new Event('keyup');Object.defineProperties(down,{key:{value:key},repeat:{value:false}});Object.defineProperty(up,'key',{value:key});target.dispatchEvent(down);await f.frames(frames);target.dispatchEvent(up);await f.frames(8)}
async function solve(f,s){await openStation(f,s);if(s.mechanic==='survey'){await act(f,'scan');await f.frames(130)}else if(s.mechanic==='inspect')await act(f,'inspect');else if(s.mechanic==='collect')await act(f,'complete');else if(s.mechanic==='allocate'){await act(f,'set:'+s.answer);await act(f,'confirm')}else await act(f,'choose:'+s.answer);assert.ok(f.runtime.snapshot().session.completedObjectiveIds.includes(activityObjectiveId(s.id)),s.id)}
async function talk(f,id,{close=true}={}){let npc;f.host.world.forEachRigidBody(b=>{if(b.userData?.roleId===id)npc=b});assert.ok(npc);const at=npc.translation();await position(f,[at.x,at.y,at.z]);assert.equal((await f.integration.interact(f.runtime.snapshot().session.id)).accepted,true);assert.equal(f.integration.storyChoice('briefing').accepted,true);await idle(f);if(close)f.integration.storyChoice('close')}
async function requiredStory(f,c){for(const index of c.story.order){await position(f,c.story.terminals[index].at);assert.equal((await f.integration.interact(f.runtime.snapshot().session.id)).accepted,true);await idle(f)}if(c.encounters.length){await f.frames(20);for(const suffix of ['a','b']){const id=c.missionId+'-guard-'+suffix;for(let n=0;f.runtime.snapshot().session.actorStates.find(a=>a.actorId===id)?.health>0&&n<35;n++){await f.hit(id);await idle(f)}assert.equal(f.runtime.snapshot().session.actorStates.find(a=>a.actorId===id).health,0)}}await defeatStoryBoss(f,c.missionId);await talk(f,c.story.finalCharacter,{close:false});await idle(f);assert.equal(f.runtime.snapshot().session,null);assert.equal(f.integration.campaign.snapshot().conversation,null)}

test('four distinct optional contracts preserve required mission graphs, IDs, rewards and registered enemy roles',()=>{
 for(const base of [MISSION1_CITY_CONTENT,...STORY_MISSIONS]){const c=withMissionActivities(base);validateRuntimeContent(c);assert.equal(c.missionId,base.missionId);assert.deepEqual(c.objectives.filter(o=>o.required!==false),base.objectives.filter(o=>o.required!==false));assert.deepEqual(c.rewards,base.rewards);assert.equal(c.activities.stations.length,base.missionId==='mission-2'?3:4);assert.equal(withMissionActivities(c),c)}
 assert.equal(MISSION_ACTIVITIES['mission-5'],undefined);assert.notEqual(STORY_PATROLS['mission-2'][0].classId,STORY_PATROLS['mission-4'][0].classId)
})

test('native survey requires actual proximity and uninterrupted time; pause, movement, wallet failure and replay cannot manufacture rewards',async()=>{
 const {data,storage}=storageFixture(),wallet=createCrystalWallet({storage}),f=harness(storage,wallet),binding=bindMissionCrystalRewards({runtime:f.runtime,wallet})
 try{
  await f.integration.startMission('mission-1');await f.frames(5);await assert.rejects(f.integration.missionActivityAction('complete'))
  const bujji=f.registered.anchors['accept-contract'];f.place(bujji[0],bujji[2]);await f.press('e');await idle(f);assert.ok(f.runtime.snapshot().session.completedObjectiveIds.includes('accept-contract'))
  const plan=MISSION_ACTIVITIES['mission-1'],first=plan.stations[0];await openStation(f,first);await act(f,'scan');await f.frames(35);assert.ok(!f.runtime.snapshot().session.completedObjectiveIds.includes(activityObjectiveId(first.id)))
  await hold(f,'d',60);assert.equal(f.states.at(-1).missionActivity.panel,null)
  await openStation(f,first);await act(f,'scan');await f.frames(20);await f.runtime.suspend('window-blur');await f.runtime.resume('window-blur');assert.equal(f.states.at(-1).missionActivity.panel,null)
  for(const s of plan.stations.slice(0,3))await solve(f,s)
  const before=wallet.snapshot().balance;storage.blocked=CRYSTAL_KEY;await solve(f,plan.stations[3]);const final=activityObjectiveId(plan.stations[3].id);assert.ok(f.runtime.snapshot().progress.objectiveRecords['mission-1'].includes(final));assert.equal(wallet.snapshot().balance,before);assert.ok(wallet.snapshot().error)
  storage.blocked=null;binding.retry();assert.equal(wallet.snapshot().balance,before+25);assert.equal(wallet.hasReceipt('objective:mission-1:'+final),true);binding.retry();assert.equal(wallet.snapshot().balance,before+25)
  await assert.rejects(f.integration.missionActivityAction('complete'));await f.runtime.end();assert.equal(f.host.scene.getObjectByName('mission-activity-'+f.states.find(s=>s.sessionId)?.sessionId),undefined)
  const reload=createCrystalWallet({storage});assert.equal(reload.snapshot().balance,before+25);assert.equal(data.get('personal-save-sentinel'),'unchanged');assert.deepEqual(f.errors,[])
 }finally{storage.blocked=null;binding.release();await f.release()}
})

test('real story journeys validate deduction failure/retry, energy allocation, safety isolation, reload and one-time rewards',async()=>{
 const {data,storage}=storageFixture();let wallet=createCrystalWallet({storage}),f=harness(storage,wallet),binding=bindMissionCrystalRewards({runtime:f.runtime,wallet})
 const register=()=>registerStoryMissions(f.integration,{loadCombatAsset:async()=>asset(),loadCompanionAsset:async()=>asset()});register()
 try{
  await f.integration.startMission('mission-1');await finish(f);assert.equal(wallet.snapshot().balance,200)
  for(const c of STORY_MISSIONS){
   await f.integration.startMission(c.missionId);await idle(f);await f.frames(2);for(const id of Object.keys(c.story.briefings).slice(0,2))await talk(f,id)
   const plan=MISSION_ACTIVITIES[c.missionId]
   for(let i=0;i<plan.stations.length;i++){
    const s=plan.stations[i]
    if(c.missionId==='mission-2'&&s.mechanic==='deduction'){
     await openStation(f,s);for(let n=0;n<3;n++)assert.equal((await act(f,'choose:weather')).accepted,false)
     assert.equal(f.runtime.snapshot().session.state,'suspended');assert.ok(f.runtime.snapshot().session.failedObjectiveIds.includes(activityObjectiveId(s.id)));assert.deepEqual(f.runtime.snapshot().progress.missionCheckpoints[c.missionId].failedObjectiveIds,[])
     await f.runtime.retryCheckpoint(c.missionId);await idle(f);await f.frames(2);assert.ok(f.runtime.snapshot().session.completedObjectiveIds.includes('activity-seal-original'));assert.equal(f.runtime.snapshot().session.objectiveStates[activityObjectiveId(s.id)],'active')
    }
    await solve(f,s)
    if(c.missionId==='mission-3'&&i===0){
     const before=wallet.snapshot().balance;binding.release();await f.release();wallet=createCrystalWallet({storage});f=harness(storage,wallet);register();binding=bindMissionCrystalRewards({runtime:f.runtime,wallet});await f.integration.recoverMission('mission-3');await idle(f);await f.frames(2);assert.equal(wallet.snapshot().balance,before);assert.ok(f.runtime.snapshot().session.completedObjectiveIds.includes(activityObjectiveId(s.id)));assert.equal(f.states.at(-1).missionActivity.completed,1)
    }
   }
   const final=activityObjectiveId(plan.stations.at(-1).id);assert.ok(wallet.hasReceipt('objective:'+c.missionId+':'+final));await requiredStory(f,c);assert.ok(f.runtime.snapshot().progress.objectiveRecords[c.missionId].includes(final))
  }
  assert.equal(wallet.snapshot().balance,950);assert.equal(f.runtime.snapshot().progress.score,7000)
  const c=STORY_MISSIONS[1];await f.integration.startMission(c.missionId);await idle(f);await f.frames(2);for(const id of Object.keys(c.story.briefings).slice(0,2))await talk(f,id);for(const s of MISSION_ACTIVITIES[c.missionId].stations)await solve(f,s);await requiredStory(f,c);assert.equal(wallet.snapshot().balance,950);assert.equal(f.runtime.snapshot().progress.score,7000)
  assert.equal(f.integration.campaign.snapshot().missions.find(m=>m.id==='mission-5').state,'locked');assert.equal(data.get('personal-save-sentinel'),'unchanged');assert.deepEqual(f.errors,[])
 }finally{binding.release();await f.release()}
 const reload=createCrystalWallet({storage});assert.equal(reload.snapshot().balance,950)
})

test('objective UI renders actual progress, saved-state feedback, recorded clues and actionable puzzle choices',()=>{
 const session={state:'active',playerResources:{health:100},completedObjectiveIds:['a'],objectiveStates:{a:'completed',b:'active'}},objectives=[{id:'a',label:'Interview the witness'},{id:'b',label:'Decode the seal',required:false}],activity={title:'The copied seal',reward:40,completed:2,total:3,unlocked:true,records:[{label:'Original',clue:'Seal A 09:00'}],next:{label:'Compare records',distance:12,direction:'north'},panel:{id:'deduction',label:'Compare records',mechanic:'deduction',clue:'Two different times',choices:[{id:'copied',label:'The seal was copied.'}]},failures:1,failureLimit:3}
 const html=renderToStaticMarkup(createElement(MissionObjectives,{session,objectives,checkpoint:{status:'saved'},activity,onAction(){}}));for(const text of ['Objectives 1 / 1','Checkpoint saved','Recorded evidence','Seal A 09:00','The seal was copied.','Rejected answers: 1 / 3'])assert.ok(html.includes(text),text)
})
