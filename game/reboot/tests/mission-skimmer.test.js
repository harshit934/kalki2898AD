import test from 'node:test'
import assert from 'node:assert/strict'
import {harness} from './story-native-fixture.js'
import {createCrystalWallet} from '../src/economy/crystalWallet.js'

test('real Mission 1 owns summon, boarding, quick takeoff, pause/reset, landing, exit and cleanup',async()=>{
 const data=new Map(),storage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v)},wallet=createCrystalWallet({storage}),f=harness(storage,wallet)
 try{
  await f.integration.startMission('mission-1')
  const session=f.runtime.snapshot().session.id,player=f.player(),before=[...f.runtime.snapshot().session.completedObjectiveIds]
  assert.equal(f.integration.personalVehicle('summon').accepted,true)
  const root=f.host.scene.getObjectByName('kashi-player-skimmer'),at=root.children[0].position
  await f.runtime.suspend('test-place');f.place(at.x-3,at.z);await f.runtime.resume('test-place');await f.frames(20);assert.ok(f.states.some(s=>s.interaction?.label==='Board skimmer'))
  assert.equal(f.integration.personalVehicle('enter').accepted,true);assert.equal(player.isEnabled(),false)
  await assert.rejects(f.integration.visitRoom(),{code:'ROOM_VISIT_UNAVAILABLE'})
  await f.press(' ');await f.frames(90)
  assert.ok(player.translation().y>1.5,'Disabled character position follows the real flying craft for mission AI')
  assert.equal(f.integration.storyPose().vehicleOccupied,true)
  assert.deepEqual(f.runtime.snapshot().session.completedObjectiveIds,before)
  assert.equal(wallet.snapshot().balance,0)
  const y=player.translation().y
  await f.runtime.suspend('menu');assert.throws(()=>f.integration.personalVehicle('summon'),{code:'CRAFT_LOCATION_UNAVAILABLE'});await f.press(' ')
  await f.runtime.resume('menu');await f.frames(10)
  assert.ok(Math.abs(player.translation().y-y)<.15,'Paused Space does not become stale takeoff or ascent')
  await f.press('l');await f.frames(240)
  assert.equal(f.integration.personalVehicle('exit').accepted,true)
  assert.equal(player.isEnabled(),true);assert.equal(f.integration.storyPose().vehicleOccupied,false)
  assert.equal(f.runtime.snapshot().session.id,session)
  await f.runtime.end();assert.equal(f.host.scene.getObjectByName('kashi-player-skimmer'),undefined)
  assert.deepEqual(f.errors,[])
 }finally{await f.release()}
})
