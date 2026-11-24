import test from 'node:test'
import assert from 'node:assert/strict'
import {createElement} from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
import {catalogue} from '../src/campaign/catalogue.js'
import {createRepository,SAVE_KEY} from '../src/persistence/repository.js'
import {createContentRegistry,createMissionRuntime} from '../src/missions/runtime.js'
import {MISSION1_CONTENT} from '../src/content/mission1.js'
import {createCrystalWallet} from '../src/economy/crystalWallet.js'
import {CRYSTAL_KEY as CRYSTAL_SAVE_KEY} from '../src/economy/crystalPolicy.js'
import {bindMissionCrystalRewards} from '../src/economy/missionCrystalRewards.js'
import {CrystalHUDView} from '../src/ui/CrystalHUD.js'

// Small authored transaction fixture: real runtime/encounter/repository services,
// not a rendered Mission 1 playthrough or fabricated completed-progress snapshot.
function store(){const data=new Map();return {data,blocked:null,getItem:k=>data.get(k)??null,setItem(k,v){if(this.blocked===k)throw Error('storage unavailable');data.set(k,v)}}}
function fixture(storage){
 const registry=createContentRegistry(catalogue)
 registry.register('mission-1',{missionId:'mission-1',contentVersion:'currency-transaction-fixture-v1',zoneId:'fixture',entryPointId:'entry',objectives:[{id:'clear',event:'encounter-defeated',source:'encounters',targetId:'guard'}],encounters:[{id:'guard',category:'regular',anchors:['entry'],policy:{mode:'waves',maxActive:1},prerequisites:[],required:true,waves:[{id:'first',enemies:[{id:'guard-a',classId:'melee',anchorId:'entry'}]}]}],rewards:MISSION1_CONTENT.rewards,episodeEquipment:{weaponIds:[],abilityIds:[]}}, {prepare:async()=>({ready:true}),release:async()=>{},pause:async()=>({paused:true}),resume:async()=>({resumed:true}),encounters:{deploy:async plan=>{for(const actor of plan.actors)plan.createActor({actorId:actor.id,maxHealth:50,release:async()=>{}}).register();return {actorIds:plan.actors.map(a=>a.id),release:async()=>{}}}}})
 const runtime=createMissionRuntime({catalogue,registry,repository:createRepository(storage,catalogue)}),wallet=createCrystalWallet({storage}),binding=bindMissionCrystalRewards({runtime,wallet})
 return {runtime,wallet,binding,async close(){binding.release();await runtime.end()}}
}
async function conclude(f){
 await f.runtime.deployEncounter('guard')
 const actor=f.runtime.snapshot().session.actorStates[0]
 await f.runtime.damageEnemy({sessionId:actor.sessionId,instanceId:actor.instanceId,eventId:'legitimate-fixture-hit',source:'combat',encounterId:'guard',actorId:actor.actorId,amount:50})
 const session=f.runtime.snapshot().session
 f.runtime.observe({sessionId:session.id,eventId:'guard-cleared',objectiveId:'clear',type:'encounter-defeated',source:'encounters',targetId:'guard'})
 f.runtime.beginConclusion();const s=f.runtime.snapshot().session
 f.runtime.acceptConclusion({sessionId:s.id,conclusionId:s.conclusion.id})
}
test('real completion commits 3250 score and +200 crystals once across replay and repository reload',async()=>{
 const storage=store(),f=fixture(storage)
 try{
  await f.runtime.start('mission-1');assert.equal(f.wallet.snapshot().balance,0)
  assert.throws(()=>f.runtime.beginConclusion(),{code:'INCOMPLETE_OBJECTIVES'})
  await conclude(f);assert.equal(f.wallet.snapshot().balance,0)
  f.runtime.complete();assert.equal(f.wallet.snapshot().balance,200);assert.equal(f.runtime.snapshot().progress.score,3250)
  const html=renderToStaticMarkup(createElement(CrystalHUDView,f.wallet.snapshot()));assert.match(html,/Crystals: 200/);assert.match(html,/\+200 crystals/)
  f.runtime.complete();f.binding.retry();assert.equal(f.wallet.snapshot().balance,200)
  await f.runtime.end();await f.runtime.start('mission-1');await conclude(f);f.runtime.complete();assert.equal(f.wallet.snapshot().balance,200);assert.equal(f.runtime.snapshot().progress.score,3250)
 }finally{await f.close()}
 const reopened=fixture(storage);try{assert.equal(reopened.wallet.snapshot().balance,200);assert.deepEqual(reopened.runtime.snapshot().progress.completedMissionIds,['mission-1']);reopened.binding.retry();assert.equal(reopened.wallet.snapshot().balance,200)}finally{await reopened.close()}
})
test('failed mission commit cannot credit crystals; accepted conclusion retries safely',async()=>{
 const storage=store(),f=fixture(storage);try{await f.runtime.start('mission-1');await conclude(f);storage.blocked=SAVE_KEY;assert.throws(()=>f.runtime.complete(),{code:'SAVE_FAILED'});assert.equal(f.wallet.snapshot().balance,0);storage.blocked=null;f.runtime.complete();assert.equal(f.wallet.snapshot().balance,200)}finally{await f.close()}
})
test('wallet failure after genuine completion recovers through fresh repository binding without replay credit',async()=>{
 const storage=store(),f=fixture(storage);try{await f.runtime.start('mission-1');await conclude(f);storage.blocked=CRYSTAL_SAVE_KEY;f.runtime.complete();assert.equal(f.runtime.snapshot().session.state,'completed');assert.equal(f.wallet.snapshot().balance,0);assert.match(f.wallet.snapshot().error,/storage unavailable/)}finally{await f.close()}
 storage.blocked=null;const reopened=fixture(storage);try{assert.equal(reopened.wallet.snapshot().balance,200);reopened.binding.retry();assert.equal(reopened.wallet.snapshot().balance,200)}finally{await reopened.close()}
})
