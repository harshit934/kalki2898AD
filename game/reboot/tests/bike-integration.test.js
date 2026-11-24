import test from 'node:test'
import assert from 'node:assert/strict'
import {harness} from './story-native-fixture.js'
import {fixture,defeat,conclude} from './reward-service-fixture.js'
import {createPersonalBike} from '../src/world/personalBike.js'

test('actual Kashi Mission1 owns bike/jet access exclusively and retains checkpoint, pause and walking controls',async()=>{
 const reward=fixture();await reward.runtime.start('mission-2');await defeat(reward);conclude(reward);await reward.close()
 const personal=createPersonalBike({storage:reward.storage,wallet:reward.wallet}),f=harness(reward.storage,reward.wallet,undefined,personal)
 try{await f.integration.startMission('mission-1');await f.frames(5);f.integration.personalVehicle('bike:summon');const bike=f.host.scene.getObjectByName('surya-motorcycle');assert.ok(bike);await f.runtime.suspend('fixture-position');const p={x:bike.position.x,y:bike.position.y+.055,z:bike.position.z+1.8},player=f.player();player.setTranslation(p,true);player.setNextKinematicTranslation(p);f.host.world.step();await f.runtime.resume('fixture-position');f.integration.personalVehicle('bike:enter');await f.frames(40);assert.equal(f.integration.storyPose().vehicleOccupied,true);assert.throws(()=>f.integration.personalVehicle('summon'),{code:'BIKE_OCCUPIED'});await assert.rejects(f.integration.visitRoom(),{code:'ROOM_VISIT_UNAVAILABLE'});await f.runtime.saveCheckpoint('salvage-road-entry');assert.ok(f.runtime.snapshot().progress.missionCheckpoints['mission-1']);await f.runtime.suspend('menu');const position={...player.translation()};await f.press('w');await f.runtime.resume('menu');await f.frames(5);assert.ok(Math.hypot(player.translation().x-position.x,player.translation().z-position.z)<.05);f.integration.personalVehicle('bike:exit');await f.frames(40);assert.equal(f.integration.storyPose().vehicleOccupied,false);assert.equal(player.isEnabled(),true);assert.deepEqual(f.errors,[]);await f.runtime.end();assert.equal(f.host.scene.getObjectByName('surya-motorcycle'),undefined)
 }finally{await f.release()}
})

test('actual exploration world manager restores one earned bike across Kashi, Shambala and Complex transitions',async()=>{
 const reward=fixture();await reward.runtime.start('mission-2');await defeat(reward);conclude(reward);await reward.close()
 const personal=createPersonalBike({storage:reward.storage,wallet:reward.wallet}),f=harness(reward.storage,reward.wallet,undefined,personal)
 async function settle(){for(let n=0;n<40&&!f.integration.explorationPose();n++)await new Promise(r=>setImmediate(r));await f.frames(15);assert.ok(f.integration.explorationPose())}
 try{await f.integration.openWorld({intro:false});await settle();for(const location of ['kashi','shambala','complex']){if(location!=='kashi'){await f.integration.travel(location);await settle()}assert.equal(f.integration.locationSnapshot().loadedLocations,1);f.integration.personalVehicle('bike:summon');const bike=f.host.scene.getObjectByName('surya-motorcycle');assert.ok(bike);const player=f.player(),p={x:bike.position.x,y:bike.position.y+.055,z:bike.position.z+1.8};player.setTranslation(p,true);player.setNextKinematicTranslation(p);f.host.world.step();f.integration.personalVehicle('bike:enter');await f.frames(40);assert.equal(f.integration.explorationPose().vehicleOccupied,true);assert.throws(()=>f.integration.personalVehicle('enter'),{code:'BIKE_OCCUPIED'});f.integration.personalVehicle('bike:exit');await f.frames(40);assert.equal(f.integration.explorationPose().vehicleOccupied,false);assert.equal(personal.snapshot().locationId,location)}f.integration.personalVehicle('bike:enter');await f.frames(40);await f.release();await new Promise(r=>setImmediate(r));assert.deepEqual(f.errors,[])
 }finally{await f.release()}
})
