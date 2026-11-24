import test from 'node:test'
import assert from 'node:assert/strict'
import {catalogue} from '../src/campaign/catalogue.js'
import {createRepository,SAVE_KEY} from '../src/persistence/repository.js'
import {createContentRegistry,createMissionRuntime} from '../src/missions/runtime.js'
import {createMissionCheckpoint} from '../src/gameplay/missionCheckpoint.js'

const content={missionId:'mission-1',zoneId:'checkpoint-native-test',entryPointId:'entry',contentVersion:'checkpoint-test-v1',checkpointAnchors:['entry'],checkpointPolicy:{restart:'fresh-attempt',resume:'semantic'},anchors:{entry:[0,0,0]},objectives:[{id:'a',event:'interaction',source:'interaction',targetId:'station-a'},{id:'b',event:'interaction',source:'interaction',targetId:'station-b',required:false,prerequisites:['a']}],objectiveRewards:['b'],encounters:[],rewards:[],resources:{health:100,maxHealth:100,healingCharges:5,healingCapacity:5},episodeEquipment:{weaponIds:['melee'],abilityIds:[]}}
function fixture(data=new Map()){
 const writes=[],storage={blocked:false,ambiguous:false,getItem:k=>data.get(k)??null,setItem(k,v){writes.push(k);if(this.blocked&&k===SAVE_KEY)throw Error('storage blocked');data.set(k,v);if(this.ambiguous&&k===SAVE_KEY)throw Error('write response lost')}},registry=createContentRegistry(catalogue),repository=createRepository(storage,catalogue)
 registry.register('mission-1',content,{prepare:async()=>({ready:true}),release:async()=>{},pause:async()=>({paused:true}),resume:async()=>({resumed:true}),restore:async()=>({restored:true})})
 const runtime=createMissionRuntime({catalogue,registry,repository});return {data,storage,writes,runtime,async start(){await runtime.start('mission-1');return createMissionCheckpoint({runtime,sessionId:runtime.snapshot().session.id,anchor:'entry'})},observe(id){runtime.observe({sessionId:runtime.snapshot().session.id,eventId:crypto.randomUUID(),objectiveId:id,type:'interaction',source:'interaction',targetId:'station-'+id})}}
}
test('safe checkpoint writer coalesces milestones, avoids pause/resume write churn and retains objective receipts after completion',async()=>{
 const f=fixture(),writer=await f.start();try{
  await writer.settle();const initial=f.writes.filter(k=>k===SAVE_KEY).length
  f.observe('a');f.observe('b');await writer.settle();assert.equal(f.writes.filter(k=>k===SAVE_KEY).length,initial+1)
  assert.deepEqual(f.runtime.snapshot().progress.missionCheckpoints['mission-1'].completedObjectiveIds,['a','b']);assert.deepEqual(f.runtime.snapshot().progress.objectiveRecords['mission-1'],['b'])
  const saved=f.writes.length;await f.runtime.suspend('menu');await f.runtime.resume('menu');await writer.settle();assert.equal(f.writes.length,saved)
  const id=f.runtime.snapshot().session.id;f.runtime.beginConclusion(id);f.runtime.acceptConclusion({sessionId:id,conclusionId:f.runtime.snapshot().session.conclusion.id});f.runtime.complete(id)
  assert.equal(f.runtime.snapshot().progress.missionCheckpoints['mission-1'],undefined);assert.deepEqual(f.runtime.snapshot().progress.objectiveRecords['mission-1'],['b'])
 }finally{writer.release();await f.runtime.end()}
})
test('failed autosave preserves last durable milestone and explicit retry recovers failed-write and write-then-throw outcomes',async()=>{
 const f=fixture(),writer=await f.start();try{
  await writer.settle();const before=f.data.get(SAVE_KEY);f.storage.blocked=true;f.observe('a');await writer.settle();assert.equal(writer.snapshot().status,'error');assert.equal(f.data.get(SAVE_KEY),before)
  f.storage.blocked=false;f.storage.ambiguous=true;await writer.retry();assert.equal(writer.snapshot().status,'saved');assert.deepEqual(f.runtime.snapshot().progress.missionCheckpoints['mission-1'].completedObjectiveIds,['a'])
 }finally{f.storage.ambiguous=false;writer.release();await f.runtime.end()}
})
test('failed objective cannot overwrite safe checkpoint; legitimate retry and fresh-service reload preserve prior evidence',async()=>{
 const f=fixture(),writer=await f.start();try{
  f.observe('a');await writer.settle();const before=structuredClone(f.runtime.snapshot().progress.missionCheckpoints['mission-1'])
  f.runtime.failObjective('b');assert.throws(()=>f.runtime.beginConclusion(),{code:'FAILED_OBJECTIVES'});await f.runtime.suspend('activity-failed');await writer.settle();assert.deepEqual(f.runtime.snapshot().progress.missionCheckpoints['mission-1'],before)
  writer.release();await f.runtime.retryCheckpoint('mission-1');assert.deepEqual(f.runtime.snapshot().session.completedObjectiveIds,['a']);assert.deepEqual(f.runtime.snapshot().session.failedObjectiveIds,[]);assert.equal(f.runtime.snapshot().session.objectiveStates.b,'active')
  await assert.rejects(f.runtime.retryCheckpoint('mission-1'),{code:'MISSION_NOT_FAILED'});await f.runtime.end()
  const reload=fixture(f.data);await reload.runtime.recover('mission-1');assert.deepEqual(reload.runtime.snapshot().session.completedObjectiveIds,['a']);assert.equal(reload.runtime.snapshot().session.objectiveStates.b,'active');await reload.runtime.end()
 }finally{writer.release();await f.runtime.end()}
})
test('released checkpoint writer cannot save evidence from a later session',async()=>{
 const f=fixture(),writer=await f.start();await writer.settle();writer.release();const writes=f.writes.filter(k=>k===SAVE_KEY).length;await f.runtime.end();await f.runtime.start('mission-1');f.observe('a');await new Promise(r=>setImmediate(r));assert.equal(f.writes.filter(k=>k===SAVE_KEY).length,writes+1,'Only the actual runtime start commits its selection; old writer is inert');await f.runtime.end()
})
