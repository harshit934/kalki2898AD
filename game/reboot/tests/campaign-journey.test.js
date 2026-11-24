import test from 'node:test'
import assert from 'node:assert/strict'
import {Scene,Group,Mesh,BoxGeometry,MeshBasicMaterial,MeshStandardMaterial,PerspectiveCamera,AnimationClip} from 'three'
import RAPIER from '@dimforge/rapier3d-compat'
import {createTravelFoundation} from '../src/gameplay/travelFoundation.js'
import {createFrameHost} from '../src/gameplay/frameHost.js'
import {registerMission1} from '../src/gameplay/mission1Registration.js'
import {prepareKashiDistrict} from '../src/world/kashiDistrict.js'
import {catalogue} from '../src/campaign/catalogue.js'
import {createRepository} from '../src/persistence/repository.js'
import {MISSION1_STRONGHOLD} from '../src/content/mission1Stronghold.js'
import {MISSION1_CITY_PLACEMENTS as placements} from '../src/content/mission1Placements.js'
import {createCrystalWallet} from '../src/economy/crystalWallet.js'
import {CRYSTAL_GRANTS} from '../src/economy/crystalPolicy.js'
import {bindMissionCrystalRewards} from '../src/economy/missionCrystalRewards.js'
import {createArsenal,SHOP_OFFERS} from '../src/equipment/arsenal.js'
import {createPersonalCraft} from '../src/world/personalCraft.js'
import {createJourneyMemory,JOURNEY_KEY} from '../src/world/locations/journeyMemory.js'
await RAPIER.init()
const tick=()=>new Promise(r=>setImmediate(r))
function locationAsset(){const scene=new Group(),material=new MeshStandardMaterial();material.name='Green patina';scene.add(new Mesh(new BoxGeometry(.8,8,.8).translate(-9,4,-6),material));return {scene,animations:[]}}
function asset(){const scene=new Group();scene.add(new Mesh(new BoxGeometry(1,2,1),new MeshBasicMaterial()));return {scene,animations:['Idle','Walk','Run','Sword idle (guard)'].map(n=>new AnimationClip(n,1,[]))}}
function harness(storage,currency,arsenal){
 let host,queue,id=0,timestamp=0,cooldownClock=0;const target=new EventTarget(),states=[],errors=[]
 const repository=createRepository(storage,catalogue)
 const integration=createTravelFoundation({catalogue,repository,currency,arsenal,personalCraft:createPersonalCraft({storage}),positionMemory:createJourneyMemory({storage}),loadComplexAsset:async()=>locationAsset(),loadShambalaAsset:async()=>locationAsset(),canvas:()=>null,prepareWorld:prepareKashiDistrict,loadPlayerAsset:async()=>asset(),onState:s=>{states.push(s);if(s.error)errors.push(s.error)},createHost:({signal,onError})=>{
  const scene=new Scene(),world=new RAPIER.World({x:0,y:-19,z:0}),camera=new PerspectiveCamera(42,16/9,.1,180),renderer={isWebGLRenderer:true,shadowMap:{enabled:false},domElement:{ownerDocument:{defaultView:target}},getContext:()=>({isContextLost:()=>false}),render(){}};queue=new Map()
  const frames=createFrameHost({scene,world,camera,renderer,signal,onError,requestFrame:fn=>{queue.set(++id,fn);return id},cancelFrame:i=>queue.delete(i)})
  host={...frames,scene,world,camera,renderer,rapier:RAPIER,gameTime:()=>frames.gameTime()+cooldownClock,release(){frames.release();world.free()}};return host
 }})
 const registered=registerMission1(integration,{environment:{probe:async()=>true,loadAsset:async()=>{throw Error('Legacy terrain must never load')}},combat:{stronghold:true,loadAsset:async()=>asset()},interactions:{loadAsset:async()=>asset()}})
 const f={integration,runtime:integration.runtime,registered,states,errors,get host(){return host},get queue(){return queue},player(){let result;host.world.forEachRigidBody(b=>{if(b.isKinematic()&&!b.userData?.projectileOwner)result=b});assert.ok(result);return result},enemy(actorId){let result;host.world.forEachRigidBody(b=>{if(b.userData?.projectileOwner===actorId)result=b});return result},place(x,z){const ray=new RAPIER.Ray({x,y:.3,z},{x:0,y:-1,z:0}),hit=host.world.castRay(ray,1.5,true,undefined,undefined,undefined,undefined,c=>c.parent()?.isFixed());assert.ok(hit);const p={x,y:.3-hit.timeOfImpact,z},body=this.player();body.setTranslation(p,true);body.setNextKinematicTranslation(p);host.world.step()},async press(key){const event=new Event('keydown',{cancelable:true});Object.defineProperties(event,{key:{value:key},repeat:{value:false}});target.dispatchEvent(event);const up=new Event('keyup');Object.defineProperty(up,'key',{value:key});target.dispatchEvent(up);for(let i=0;i<4;i++)await tick()},async frames(n=1){for(let i=0;i<n;i++){const next=queue.entries().next().value;if(!next)throw Error('Expected active native frame host');queue.delete(next[0]);next[1](timestamp+=1000/60);await tick()}},async hit(actorId){const body=this.enemy(actorId);assert.ok(body);const p=body.translation();this.place(p.x,p.z+2.2);cooldownClock+=1000;await this.press('k')},async release(){await integration.release()}}
 return f
}

async function settle(f){await f.frames(80)}
async function finish(f){
 for(const id of ['accept-contract','compare-relay']){const o=placements.objectives.find(p=>p.objectiveId===id);f.place(o.position[0],o.position[2]);await f.press('e');assert.ok(f.runtime.snapshot().session.completedObjectiveIds.includes(id))}
 for(const wave of MISSION1_STRONGHOLD.waves)for(const m of wave.members){await f.runtime.deployEncounter(m.encounterId);for(let i=0;f.enemy(m.actorId)&&i<30;i++)await f.hit(m.actorId);assert.equal(f.enemy(m.actorId),undefined)}
 await f.runtime.deployEncounter('warden');await f.frames(160);for(let i=0;f.enemy('arena-warden')&&i<30;i++)await f.hit('arena-warden');assert.equal(f.enemy('arena-warden'),undefined);await f.frames(140);const relic=f.host.scene.getObjectByName('mission1-target-recover-relic');assert.equal(relic.visible,true);f.place(relic.position.x,relic.position.z);await f.press('e');for(let i=0;i<100&&f.runtime.snapshot().session;i++)await tick();assert.equal(f.runtime.snapshot().session,null)
}
test('integrated travel, personal craft, owned upgrade, real mission reward, replay and reload retain one coherent state',async()=>{
 const data=new Map([['personal-save-sentinel','unchanged']]),storage={blocked:null,getItem:k=>data.get(k)??null,setItem(k,v){if(k===this.blocked)throw Error('travel write failed');data.set(k,v)}},wallet=createCrystalWallet({storage,offers:SHOP_OFFERS})
 for(const id of Object.keys(CRYSTAL_GRANTS).filter(id=>!id.startsWith('mission:')))wallet.grant(id)
 const arsenal=createArsenal({wallet,storage});arsenal.purchase('sunblade');arsenal.equip('sunblade');arsenal.upgrade('sunblade',0);const before=wallet.snapshot().balance,f=harness(storage,wallet,arsenal),binding=bindMissionCrystalRewards({runtime:f.runtime,wallet})
 try{
  await f.integration.openWorld({intro:false});await settle(f);f.integration.personalVehicle('summon');const craft=f.host.scene.getObjectByName('kashi-player-skimmer').children[0];f.place(craft.position.x+3,craft.position.z);f.integration.personalVehicle('enter');await assert.rejects(f.integration.startMission('mission-1'),{code:'VEHICLE_OCCUPIED'});assert.equal(f.integration.explorationPose().vehicleOccupied,true);f.integration.personalVehicle('exit');
  storage.blocked=JOURNEY_KEY;await assert.rejects(f.integration.travel('complex'),/travel write failed/);storage.blocked=null;await settle(f);assert.equal(f.integration.locationSnapshot().locationId,'kashi');assert.ok(f.integration.explorationPose());assert.equal(f.integration.locationSnapshot().loadedLocations,1)
  for(const id of ['complex','shambala','kashi']){await f.integration.travel(id);await settle(f);assert.equal(f.integration.locationSnapshot().locationId,id);assert.equal(f.integration.locationSnapshot().loadedLocations,1)}
  for(const id of ['complex','shambala','kashi']){await f.integration.previewLocation(id);assert.equal(f.integration.locationSnapshot().locationId,id);assert.equal(f.integration.locationSnapshot().loadedLocations,1);assert.equal(f.integration.explorationPose(),null)}
  await f.integration.startMission('mission-1');assert.equal(f.runtime.snapshot().session.state,'active');assert.equal(arsenal.combatProfile().heavy,60);await finish(f);assert.equal(wallet.snapshot().balance,before+200);assert.equal(f.runtime.snapshot().progress.score,3250)
  await f.integration.startMission('mission-1');await finish(f);assert.equal(wallet.snapshot().balance,before+200);assert.equal(f.runtime.snapshot().progress.score,3250);assert.deepEqual(f.errors,[])
 }finally{binding.release();await f.release();arsenal.release()}
 const nextWallet=createCrystalWallet({storage,offers:SHOP_OFFERS}),nextArsenal=createArsenal({wallet:nextWallet,storage}),next=harness(storage,nextWallet,nextArsenal),nextBinding=bindMissionCrystalRewards({runtime:next.runtime,wallet:nextWallet})
 try{assert.equal(nextWallet.snapshot().balance,before+200);assert.equal(nextArsenal.combatProfile().level,1);assert.equal(nextArsenal.combatProfile().heavy,60);assert.deepEqual(next.runtime.snapshot().progress.completedMissionIds,['mission-1']);assert.equal(next.runtime.snapshot().progress.score,3250);await next.integration.openWorld({intro:false});await settle(next);assert.equal(next.integration.locationSnapshot().loadedLocations,1);assert.ok(createPersonalCraft({storage}).snapshot().position);assert.ok(createJourneyMemory({storage}).load().positions.some(p=>p.locationId==='complex'));assert.equal(data.get('personal-save-sentinel'),'unchanged')}finally{nextBinding.release();await next.release();nextArsenal.release()}
})
test('journey storage rejects corrupt input and stale writes, reconciles write-then-throw without data loss',()=>{const data=new Map(),storage={getItem:k=>data.get(k)??null,setItem(k,v){data.set(k,v);throw Error('ambiguous write')}},a=createJourneyMemory({storage}),b=createJourneyMemory({storage}),value={version:1,positions:[{locationId:'kashi',position:[162,-.175,65],heading:0}]};a.save(value);assert.deepEqual(a.load(),value);assert.throws(()=>b.save(value),{code:'JOURNEY_SAVE_CONFLICT'});data.set(JOURNEY_KEY,'corrupt');assert.throws(()=>a.load(),{code:'INVALID_LOCATION_SAVE'});assert.equal(data.get(JOURNEY_KEY),'corrupt')})
