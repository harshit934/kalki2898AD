import test from 'node:test'
import assert from 'node:assert/strict'
import {harness} from './story-native-fixture.js'
import {MISSION1_STRONGHOLD} from '../src/content/mission1Stronghold.js'

test('native R input produces a collision-confirmed special strike and cooldown survives pause',async()=>{
 const data=new Map(),storage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v)},f=harness(storage)
 try{
  await f.integration.startMission('mission-1');await f.frames(3)
  const opponent=MISSION1_STRONGHOLD.waves[0].members[0];await f.runtime.deployEncounter(opponent.encounterId)
  const id=opponent.actorId,at=f.enemy(id).translation();await f.runtime.suspend('fixture-place');f.place(at.x,at.z+2.2);await f.runtime.resume('fixture-place')
  const health=()=>f.runtime.snapshot().session.actorStates.find(a=>a.actorId===id).health,before=health();await f.press('r');assert.equal(health(),Math.max(0,before-81.6))
  await f.runtime.suspend('menu');await f.runtime.resume('menu');await f.frames(60)
  const after=health();await f.press('r');assert.equal(health(),after,'Pause cannot reset special cooldown')
  assert.deepEqual(f.errors,[])
 }finally{await f.release()}
})
