import {CRYSTAL_KEY} from '../src/economy/crystalPolicy.js'
import {SAVE_KEY} from '../src/persistence/repository.js'
import {createCrystalWallet} from '../src/economy/crystalWallet.js'
import test from 'node:test'
import assert from 'node:assert/strict'
import {Scene,Group,Bone,PerspectiveCamera,Box3,Vector3} from 'three'
import RAPIER from '@dimforge/rapier3d-compat'
import {fixture as rewardFixture,defeat,conclude} from './reward-service-fixture.js'
import {createPersonalBike,BIKE_KEY} from '../src/world/personalBike.js'
import {createPlayerBike} from '../src/world/playerBike.js'
import {createPlayerBindings} from '../src/gameplay/playerBindings.js'
import {createBikeModel,createJetModel} from '../src/world/vehicleModels.js'
import {stepBike} from '../src/world/bikeDynamics.js'
await RAPIER.init()
async function earned(){const f=rewardFixture();await f.runtime.start('mission-2');await defeat(f);conclude(f);await f.close();return f}
function key(target,type,key){const e=new Event(type,{cancelable:true});Object.defineProperties(e,{key:{value:key},repeat:{value:false}});target.dispatchEvent(e)}
function native(personal,locationId='kashi'){
 const [x,z]=locationId==='kashi'?[162,65]:locationId==='shambala'?[76,120]:[210,-12],world=new RAPIER.World({x:0,y:-19,z:0}),scene=new Scene(),camera=new PerspectiveCamera(42,1.5,.1,180),target=new EventTarget(),frames=new Set(),after=new Set(),signal=new AbortController(),errors=[],renderer={domElement:{dataset:{},ownerDocument:{defaultView:target}}}
 const floor=world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(x,-.1,z));world.createCollider(RAPIER.ColliderDesc.cuboid(45,.1,45),floor)
 const body=world.createRigidBody(RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(x,.05,z));world.createCollider(RAPIER.ColliderDesc.capsule(.55,.34).setTranslation(0,.89,0),body);const object=new Group();object.position.set(x,.05,z);for(const name of ['Hips','LeftUpLeg','RightUpLeg','LeftLeg','RightLeg','Spine','LeftArm','RightArm','LeftForeArm','RightForeArm']){const b=new Bone();b.name=name;if(name==='Hips')b.position.y=1;object.add(b)}scene.add(object)
 const player={body,object,setActive(v){this.active=v},isAlive:()=>true},controller=world.createCharacterController(.03),host={world,scene,camera,renderer,rapier:RAPIER,subscribeFrame(fn){frames.add(fn);return()=>frames.delete(fn)},subscribeAfterPhysics(fn){after.add(fn);return()=>after.delete(fn)}}
 const controls=createPlayerBindings({...host,target,onError:e=>errors.push(e)}).bindControls({sessionId:'walk',signal:signal.signal,player,controller,freeCamera:true,combatActions:false,attack(){},interact(){}});controls.activate();const bike=createPlayerBike({host,signal:signal.signal,ownerId:'bike-test',player,controls,worldContent:{locationId},personal,onError:e=>errors.push(e)})
 world.step();const f={world,scene,camera,target,frames,after,renderer,player,controls,bike,errors,run(n){for(let i=0;i<n;i++){for(const fn of [...frames])fn(1/60);world.step();for(const fn of [...after])fn(1/60)}},async press(k){key(target,'keydown',k);await new Promise(r=>setImmediate(r));key(target,'keyup',k)},down:k=>key(target,'keydown',k),up:k=>key(target,'keyup',k),place(p){controls.pause();body.setTranslation(p,true);body.setNextKinematicTranslation(p);object.position.copy(p);world.step();controls.resume({resetMotion:true})},release(){bike.release();controls.release();signal.abort();world.removeCharacterController(controller);world.free()}}
 f.run(3);return f
}
test('unearned bike is locked; corrupt bytes, stale writes and failed parking cannot fabricate ownership',async()=>{
 const rewards=rewardFixture(),locked=createPersonalBike({storage:rewards.storage,wallet:rewards.wallet});assert.equal(locked.snapshot().unlocked,false);assert.throws(()=>locked.commit({summoned:true}),{code:'BIKE_LOCKED'});assert.equal(rewards.data.has(BIKE_KEY),false);await rewards.close()
 const f=await earned(),bike=createPersonalBike({storage:f.storage,wallet:f.wallet}),other=createPersonalBike({storage:f.storage,wallet:f.wallet});bike.commit({locationId:'kashi',summoned:true,position:[162,0,65],yaw:0});assert.throws(()=>other.commit({summoned:false}),{code:'BIKE_SAVE_CONFLICT'});const before=f.data.get(BIKE_KEY);f.storage.blocked=BIKE_KEY;assert.throws(()=>bike.commit({summoned:false}));assert.equal(f.data.get(BIKE_KEY),before);f.storage.blocked=null;bike.commit({summoned:false});assert.equal(createPersonalBike({storage:f.storage,wallet:f.wallet}).snapshot().summoned,false);f.data.set(BIKE_KEY,'bad save');assert.equal(createPersonalBike({storage:f.storage,wallet:f.wallet}).snapshot().ready,false);assert.equal(f.data.get(BIKE_KEY),'bad save')
})
for(const locationId of ['kashi','shambala','complex'])test(locationId+' native bike mounts, accelerates, steers, brakes, dismounts and preserves parking',async()=>{
 const rewards=await earned(),personal=createPersonalBike({storage:rewards.storage,wallet:rewards.wallet}),f=native(personal,locationId)
 try{const walletBytes=rewards.data.get(CRYSTAL_KEY),campaignBytes=rewards.data.get(SAVE_KEY);f.bike.action('summon');const at=f.bike.status().position;f.place({x:at[0],y:at[1]+.05,z:at[2]+1.8});assert.equal(f.bike.canBoard(),true);f.bike.action('enter');assert.equal(f.bike.status().mode,'mounting');f.run(40);assert.equal(f.bike.status().mode,'riding');const cameraAt=f.bike.status().position;assert.ok(f.camera.position.distanceTo(new Vector3(cameraAt[0],cameraAt[1]+1.5,cameraAt[2]))>1.6,'Riding camera must remain outside the rider');assert.equal(f.player.body.isEnabled(),false);const initial=f.bike.status().position;f.down('w');f.run(90);f.up('w');if(!(f.bike.status().speed>5))console.log('ride trace',locationId,f.bike.status(),f.renderer.domElement.dataset.bikeRide,f.renderer.domElement.dataset.bikeBlocked,f.errors);assert.ok(f.bike.status().speed>5);assert.ok(Math.hypot(f.bike.status().position[0]-initial[0],f.bike.status().position[2]-initial[2])>3)
  const yaw=JSON.parse(f.renderer.domElement.dataset.bikeRide).yaw;f.down('d');f.run(30);f.up('d');assert.ok(Math.abs(JSON.parse(f.renderer.domElement.dataset.bikeRide).yaw-yaw)>.1);f.down(' ');f.run(75);f.up(' ');assert.ok(Math.abs(f.bike.status().speed)<.01);f.bike.action('exit');f.run(40);assert.equal(f.bike.occupied(),false);assert.equal(f.player.body.isEnabled(),true);assert.equal(f.player.active,true);assert.ok(personal.snapshot().position);assert.equal(personal.snapshot().locationId,locationId);assert.equal(rewards.data.get(CRYSTAL_KEY),walletBytes);assert.equal(rewards.data.get(SAVE_KEY),campaignBytes);assert.deepEqual(f.errors,[]);const saved=createPersonalBike({storage:rewards.storage,wallet:rewards.wallet});assert.deepEqual(saved.snapshot().position,personal.snapshot().position);f.bike.release();assert.equal(f.scene.getObjectByName('surya-motorcycle'),undefined)
 }finally{f.release()}
})
test('vehicle art has finite bounded geometry, black/gold materials, animated wheels and explicit cleanup',()=>{
 for(const make of [createJetModel,createBikeModel]){const model=make(),bounds=new Box3().setFromObject(model.root),size=bounds.getSize(new Vector3());assert.ok(size.toArray().every(n=>Number.isFinite(n)&&n>0));assert.ok(size.x<6&&size.y<3&&size.z<7);let vertices=0;const colors=new Set();model.root.traverse(o=>{if(o.isMesh){vertices+=o.geometry.attributes.position.count;colors.add(o.material.color.getHexString())}});assert.ok(vertices<25000);assert.ok(colors.has('c49b44')&&colors.has('101719'));const resources=new Set();model.root.traverse(o=>{if(o.isMesh){resources.add(o.geometry);resources.add(o.material)}});let disposed=0;for(const r of resources)r.addEventListener('dispose',()=>disposed++);model.update({speed:12,turn:.5,time:1});model.release();assert.equal(disposed,resources.size);model.release();assert.equal(disposed,resources.size);assert.equal(model.root.parent,null)}
})
test('bike acceleration, reverse, braking and steering remain bounded at different frame rates',()=>{for(const dt of [1/30,1/60,1/120]){let s={speed:0,yaw:0};for(let n=0;n<3/dt;n++)s=stepBike(s,{x:0,y:1,brake:false},dt);assert.ok(Math.abs(s.speed-18)<.001);for(let n=0;n<1/dt;n++)s=stepBike(s,{x:0,y:0,brake:true},dt);assert.equal(s.speed,0);for(let n=0;n<1/dt;n++)s=stepBike(s,{x:1,y:-1,brake:false},dt);assert.ok(s.speed<0&&s.speed>=-4)}assert.throws(()=>stepBike({speed:0,yaw:0},{x:0,y:1},1))})

test('native wall collision stops the hull; pause clears held input; defeat restores the existing player',async()=>{
 const rewards=await earned(),personal=createPersonalBike({storage:rewards.storage,wallet:rewards.wallet}),f=native(personal)
 try{f.bike.action('summon');const at=f.bike.status().position;const wall=f.world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(at[0],2,at[2]-8));f.world.createCollider(RAPIER.ColliderDesc.cuboid(10,2,.2),wall);f.place({x:at[0],y:at[1]+.05,z:at[2]+1.8});f.bike.action('enter');f.run(40);const bent=f.player.object.getObjectByName('LeftLeg');assert.ok(Math.abs(bent.quaternion.x)>.1,'Existing rider rig is posed');f.down('w');f.run(180);assert.ok(f.bike.status().position[2]>=at[2]-6.6,'Bike cannot cross the wall');f.bike.pause();const before=[...f.bike.status().position];f.run(90);f.up('w');f.bike.resume();f.run(30);assert.ok(Math.hypot(f.bike.status().position[0]-before[0],f.bike.status().position[2]-before[2])<.05,'No stale thrust after resume');const lastCamera=f.camera.position.clone();f.bike.defeat();assert.ok(f.camera.position.distanceTo(lastCamera)<.01,'Defeat retains current encounter framing');assert.equal(f.bike.occupied(),false);assert.equal(f.player.body.isEnabled(),true);assert.equal(bent.quaternion.x,0,'Riding pose restored on defeat');assert.deepEqual(f.errors,[])
 }finally{f.release()}
})

test('blocked recall preserves save bytes and allocates no decorative bike',async()=>{
 const rewards=await earned(),personal=createPersonalBike({storage:rewards.storage,wallet:rewards.wallet}),f=native(personal)
 try{const p=f.player.body.translation();for(const [dx,dz]of [[3.5,0],[-3.5,0],[0,4],[0,-4]]){const b=f.world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(p.x+dx,1,p.z+dz));f.world.createCollider(RAPIER.ColliderDesc.cuboid(1.5,1,1.6),b)}f.world.step();const before=rewards.data.get(BIKE_KEY);assert.throws(()=>f.bike.action('summon'),{code:'BIKE_SPAWN_BLOCKED'});assert.equal(rewards.data.get(BIKE_KEY),before);assert.equal(f.scene.getObjectByName('surya-motorcycle'),undefined)
 }finally{f.release()}
})

test('riding parking failure retains last save, avoids retry loops and permits explicit recovery',async()=>{
 const rewards=await earned(),personal=createPersonalBike({storage:rewards.storage,wallet:rewards.wallet}),f=native(personal)
 try{f.bike.action('summon');const at=f.bike.status().position;f.place({x:at[0],y:at[1]+.05,z:at[2]+1.8});f.bike.action('enter');f.run(40);const before=rewards.data.get(BIKE_KEY),set=rewards.storage.setItem.bind(rewards.storage);let attempts=0;rewards.storage.setItem=(key,value)=>{if(key===BIKE_KEY)attempts++;return set(key,value)};rewards.storage.blocked=BIKE_KEY;f.down('w');f.run(150);f.up('w');assert.equal(rewards.data.get(BIKE_KEY),before);assert.ok(personal.snapshot().error);const failed=attempts;f.run(180);assert.equal(attempts,failed,'No automatic failed-write retry loop');rewards.storage.blocked=null;f.bike.action('save');assert.equal(personal.snapshot().error,null);assert.notEqual(rewards.data.get(BIKE_KEY),before);assert.equal(createPersonalBike({storage:rewards.storage,wallet:rewards.wallet}).snapshot().unlocked,true)
 }finally{rewards.storage.blocked=null;f.release()}
})

test('jet engine exits face opposite the preserved local +Z flight direction',()=>{const jet=createJetModel();try{jet.root.updateMatrixWorld(true);const rim=jet.root.getObjectByName('jet-engine-rim').getWorldPosition(new Vector3());assert.ok(rim.z<0,'Engines must face aft, not forward');}finally{jet.release()}})

test('a nearby wall cannot be bypassed by mounting the motorcycle',async()=>{
 const reward=await earned(),personal=createPersonalBike({storage:reward.storage,wallet:reward.wallet}),f=native(personal)
 try{f.bike.action('summon');const at=f.bike.status().position;const wall=f.world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(at[0]+1,1,at[2]));f.world.createCollider(RAPIER.ColliderDesc.cuboid(.04,1,3),wall);f.place({x:at[0]+1.8,y:at[1]+.055,z:at[2]});assert.equal(f.bike.canBoard(),false);assert.throws(()=>f.bike.action('enter'),{code:'BIKE_ENTRY_BLOCKED'});assert.equal(f.player.body.isEnabled(),true)
 }finally{f.release()}
})

test('wallet lease loss cannot trap an already-earned rider; exit restores walking and preserves ledger bytes',async()=>{
 const reward=await earned();let allowed=true;const wallet=createCrystalWallet({storage:reward.storage,writeGuard:()=>allowed}),personal=createPersonalBike({storage:reward.storage,wallet}),f=native(personal)
 try{f.bike.action('summon');const at=f.bike.status().position;f.place({x:at[0],y:at[1]+.05,z:at[2]+1.8});f.bike.action('enter');f.run(40);const bytes=reward.data.get(CRYSTAL_KEY);allowed=false;wallet.reload();assert.equal(wallet.snapshot().ready,false);assert.equal(f.bike.action('exit').accepted,true);f.run(40);assert.equal(f.bike.occupied(),false);assert.equal(f.player.body.isEnabled(),true);assert.equal(reward.data.get(CRYSTAL_KEY),bytes)
 }finally{f.release()}
})
