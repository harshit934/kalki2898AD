import test from 'node:test'
import assert from 'node:assert/strict'
import {Scene,Group,PerspectiveCamera,BoxGeometry,Mesh,MeshBasicMaterial} from 'three'
import RAPIER from '@dimforge/rapier3d-compat'
import {createPersonalCraft,CRAFT_KEY} from '../game/reboot/src/world/personalCraft.js'
import {CRAFT_LOCATIONS,craftLocation,validCraftPosition} from '../game/reboot/src/world/craftLocations.js'
import {createPlayerFlight} from '../game/reboot/src/world/playerFlight.js'
import {createExplorationBujji} from '../game/reboot/src/world/explorationBujji.js'
import {BUILDINGS} from '../game/reboot/src/world/locations/buildings/definitions.js'
import {prepareBuildingInterior} from '../game/reboot/src/world/locations/buildings/interiorEnvironment.js'
import {LOCATION_DEFINITIONS} from '../game/reboot/src/world/locations/definitions.js'
import {resolveLocationSpawn} from '../game/reboot/src/world/locations/spawn.js'
import {createWeaponShop,WEAPON_SHOP} from '../game/reboot/src/world/weaponShop.js'
import MobileControls,{isFlightPrompt} from '../game/reboot/src/ui/MobileControls.js'
import {createElement} from 'react'
import {renderToStaticMarkup} from 'react-dom/server'

await RAPIER.init()
function storage(initial=null){const data=new Map(initial===null?[]:[[CRAFT_KEY,initial]]);return {getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v)}}
function key(target,type,value){const e=new Event(type,{cancelable:true});Object.defineProperties(e,{key:{value},repeat:{value:false}});target.dispatchEvent(e)}
function fixture(locationId,ground=0){
 const abort=new AbortController(),world=new RAPIER.World({x:0,y:-19,z:0}),scene=new Scene(),camera=new PerspectiveCamera(),target=new EventTarget(),bounds=CRAFT_LOCATIONS[locationId],frames=new Set(),after=new Set(),errors=[]
 camera.position.set(0,5,20)
 const origin=locationId==='kashi'?[180,ground,60]:[0,ground,10]
 const floor=world.createRigidBody(RAPIER.RigidBodyDesc.fixed());world.createCollider(RAPIER.ColliderDesc.cuboid((bounds.maxX-bounds.minX)/2,.2,(bounds.maxZ-bounds.minZ)/2).setTranslation((bounds.maxX+bounds.minX)/2,ground-.2,(bounds.maxZ+bounds.minZ)/2),floor)
 const body=world.createRigidBody(RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(...origin));world.createCollider(RAPIER.ColliderDesc.capsule(.55,.34).setTranslation(0,.89,0),body)
 const player={body,object:new Group(),setActive(v){this.active=v}},controls={pause(){this.paused=true},resume(){this.paused=false}},host={world,rapier:RAPIER,scene,camera,renderer:{domElement:{ownerDocument:{defaultView:target}}},subscribeFrame(fn){frames.add(fn);return()=>frames.delete(fn)},subscribeAfterPhysics(fn){after.add(fn);return()=>after.delete(fn)}}
 const store=storage(),personal=createPersonalCraft({storage:store}),flight=createPlayerFlight({host,signal:abort.signal,ownerId:'test-'+locationId,player,controls,worldContent:{locationId},personal,onError:e=>errors.push(e)})
 function step(n=1){for(let i=0;i<n;i++){for(const fn of [...frames])fn(1/60);world.step();for(const fn of [...after])fn(1/60)}}
 step()
 return {abort,world,scene,camera,target,host,player,controls,flight,personal,store,frames,after,errors,step,release(){flight.release();abort.abort();world.free()}}
}
for(const id of Object.keys(CRAFT_LOCATIONS)){
 test(`${id}: summon, enter, held flight, steering, descent, exit and persistence use real Rapier`,()=>{
  const f=fixture(id)
  try{
   f.flight.personalAction('summon');const at=f.flight.status().position
   assert.equal(craftLocation(f.personal.snapshot()),id);assert.equal(f.personal.snapshot().summoned,true)
   assert.ok(validCraftPosition(at,id));assert.equal(f.flight.canBoard(),false)
   f.player.body.setTranslation({x:at[0]-3,y:at[1]-.84,z:at[2]},true);f.step()
   assert.equal(f.flight.canBoard(),true);f.flight.personalAction('enter');assert.equal(f.player.body.isEnabled(),false);assert.equal(f.controls.paused,true)
   const touch=renderToStaticMarkup(createElement(MobileControls,{enabled:true,flight:isFlightPrompt(f.flight.status().prompt)}));assert.match(touch,/Rise/);assert.match(touch,/Descend/);assert.match(touch,/Exit/)
   key(f.target,'keydown',' ');f.step(90);key(f.target,'keyup',' ');f.step(40);assert.equal(f.flight.status().mode,'flying')
   const before=f.flight.status();key(f.target,'keydown','w');key(f.target,'keydown','d');f.step(30);key(f.target,'keyup','w');key(f.target,'keyup','d');const moved=f.flight.status();assert.ok(Math.hypot(moved.position[0]-before.position[0],moved.position[2]-before.position[2])>.5);assert.ok(moved.yaw<before.yaw)
   key(f.target,'keydown','l');f.step(25);key(f.target,'keyup','l');assert.ok(f.flight.status().position[1]<moved.position[1])
   f.flight.personalAction('exit');assert.equal(f.player.body.isEnabled(),true);assert.equal(f.controls.paused,false)
   const loaded=createPersonalCraft({storage:f.store}).snapshot();assert.equal(craftLocation(loaded),id);assert.deepEqual(loaded.position,f.flight.status().position)
   f.flight.release();assert.equal(f.frames.size,0);assert.equal(f.scene.children.length,0);assert.deepEqual(f.errors,[])
  }finally{f.release()}
 })
 test(`${id}: quick Space press/release is consumed once and blur discards pending takeoff`,()=>{
  const f=fixture(id)
  try{
   f.flight.personalAction('summon');const at=f.flight.status().position;f.player.body.setTranslation({x:at[0]-3,y:at[1]-.84,z:at[2]},true);f.step();f.flight.personalAction('enter')
   key(f.target,'keydown',' ');key(f.target,'keyup',' ');f.step();assert.equal(f.flight.status().mode,'taking-off')
   f.flight.personalAction('exit');f.step();f.flight.personalAction('enter')
   key(f.target,'keydown',' ');key(f.target,'keyup',' ');f.target.dispatchEvent(new Event('blur'));f.step();assert.equal(f.flight.status().mode,'landed')
  }finally{f.release()}
 })
}
test('legacy Kashi saves remain valid; unknown locations and out-of-bounds writes are rejected without mutation',()=>{
 const legacy=JSON.stringify({version:1,owned:true,summoned:true,position:[162,.6475,59],yaw:Math.PI}),s=storage(legacy),craft=createPersonalCraft({storage:s})
 assert.equal(craft.snapshot().ready,true);assert.equal(craftLocation(craft.snapshot()),'kashi')
 assert.throws(()=>craft.commit({locationId:'wrong',position:null}));assert.equal(s.getItem(CRAFT_KEY),legacy)
 assert.throws(()=>craft.commit({locationId:'complex',position:[999,0,0]}));assert.equal(s.getItem(CRAFT_KEY),legacy)
 const failed={getItem:()=>legacy,setItem(){throw new Error('disk full')}},blocked=createPersonalCraft({storage:failed});assert.throws(()=>blocked.commit({summoned:false}),/disk full/);assert.equal(blocked.snapshot().summoned,true)
})
test('a craft parked in another world is not restored at foreign local coordinates',()=>{
 const f=fixture('complex')
 try{assert.equal(f.flight.root.children[0].visible,false);f.personal.commit({locationId:'shambala',summoned:true,position:[0,.84,10]});f.flight.release();const other=createPlayerFlight({host:f.host,signal:f.abort.signal,ownerId:'other',player:f.player,controls:f.controls,worldContent:{locationId:'complex'},personal:f.personal});try{assert.equal(other.root.children[0].visible,false);other.personalAction('summon');assert.equal(f.personal.snapshot().locationId,'complex')}finally{other.release()}}finally{f.release()}
})
for(const id of Object.keys(CRAFT_LOCATIONS))test(`${id}: Bujji follows walking and occupied craft poses, then releases its subscription and original model clone`,async()=>{
 const f=fixture(id),asset={scene:new Group().add(new Mesh(new BoxGeometry(1,1,1),new MeshBasicMaterial()))};let disposed=false;asset.scene.children[0].geometry.addEventListener('dispose',()=>{disposed=true})
 try{const companion=await createExplorationBujji({host:f.host,signal:f.abort.signal,player:f.player,vehicle:f.flight,loadAsset:async()=>asset});assert.equal(f.after.size,1);assert.equal(asset.scene.scale.x,.4);const start=f.player.body.translation();f.player.body.setTranslation({x:start.x+10,y:start.y,z:start.z},true);f.step(60);assert.ok(asset.scene.position.x>start.x+8);f.flight.personalAction('summon');const at=f.flight.status().position;f.player.body.setTranslation({x:at[0]-3,y:at[1]-.84,z:at[2]},true);f.step();f.flight.personalAction('enter');key(f.target,'keydown',' ');f.step(90);key(f.target,'keyup',' ');f.step(60);assert.ok(Math.abs(asset.scene.position.y-(f.flight.status().position[1]+2.28))<.5);companion.release();companion.release();assert.equal(f.after.size,0);assert.equal(f.scene.getObjectByName('exploration-bujji'),undefined);assert.equal(disposed,true)}finally{f.release()}
})
test('cancelled Bujji load disposes late model without inserting it or retaining listeners',async()=>{
 const f=fixture('complex');let complete,disposed=false;const asset={scene:new Group().add(new Mesh(new BoxGeometry(),new MeshBasicMaterial()))};asset.scene.children[0].geometry.addEventListener('dispose',()=>{disposed=true})
 try{const pending=createExplorationBujji({host:f.host,signal:f.abort.signal,player:f.player,loadAsset:()=>new Promise(resolve=>{complete=resolve})});f.abort.abort();complete(asset);await pending;assert.equal(disposed,true);assert.equal(f.after.size,0);assert.equal(f.scene.getObjectByName('exploration-bujji'),undefined)}finally{f.release()}
})
for(const building of BUILDINGS)test(`${building.label}: real furnished interior spawn, walls, exit trigger and cleanup`,async()=>{
 const world=new RAPIER.World({x:0,y:-19,z:0}),host={world,rapier:RAPIER,scene:new Scene()},abort=new AbortController(),owned=[],trips=[]
 try{const interior=await prepareBuildingInterior({host,signal:abort.signal,own:fn=>owned.push(fn),building,onExit:b=>trips.push(b.id)}),location=LOCATION_DEFINITIONS.find(l=>l.id===building.id);resolveLocationSpawn({host,location,position:interior.spawn});assert.throws(()=>resolveLocationSpawn({host,location,position:[building.size[0]/2-.05,0,0]}));assert.ok(interior.metrics.instances>25);assert.equal(interior.interact({position:{x:0,y:0,z:building.size[1]/2-1}}).accepted,true);await Promise.resolve();assert.deepEqual(trips,[building.id]);if(building.kind==='residential')assert.deepEqual(interior.restTargets.map(t=>t.kind),['sleep','sit']);interior.release();assert.equal(host.scene.children.length,0);assert.equal(world.bodies.len(),0)}finally{for(const release of owned)release();world.free()}
})
test('weapon shop only opens inside House 01, closes, and cleans up',()=>{
 const f=fixture('kashi');let opens=0,closes=0;const shop=createWeaponShop({host:f.host,signal:f.abort.signal,player:f.player,canOpen:()=>true,onOpen:()=>opens++,onClose:()=>closes++})
 try{assert.throws(()=>shop.open(),e=>e.code==='SHOP_OUT_OF_RANGE');const [x,y,z]=WEAPON_SHOP.counter;f.player.body.setTranslation({x,y,z},true);f.step();assert.equal(shop.nearby(),true);shop.open();assert.equal(shop.status().open,true);assert.equal(opens,1);assert.equal(shop.close(),true);assert.equal(closes,1);shop.release();assert.equal(f.scene.getObjectByName('bhairava-weapon-shop'),undefined)}finally{shop.release();f.release()}
})

for(const [id,ground]of [['kashi',6],['shambala',12],['complex',-8]])test(id+': parked skimmer recalls beside player and quick takeoff uses local surface height',()=>{
 const f=fixture(id,ground)
 try{f.flight.personalAction('summon');const before=[...f.flight.status().position];const p=f.player.body.translation();f.player.body.setTranslation({x:p.x+20,y:ground,z:p.z},true);f.step();f.flight.personalAction('summon');const recalled=f.flight.status().position;assert.ok(Math.abs(recalled[0]-before[0])>10);assert.ok(Math.hypot(recalled[0]-f.player.body.translation().x,recalled[2]-f.player.body.translation().z)<=7);assert.deepEqual(f.personal.snapshot().position,recalled);f.player.body.setTranslation({x:recalled[0]-3,y:ground,z:recalled[2]},true);f.step();f.flight.personalAction('enter');key(f.target,'keydown',' ');key(f.target,'keyup',' ');f.step(90);assert.equal(f.flight.status().mode,'flying');assert.ok(f.flight.status().position[1]>recalled[1]+2);assert.ok(f.flight.status().position[1]<recalled[1]+3.1);assert.throws(()=>f.flight.personalAction('summon'),{code:'VEHICLE_OCCUPIED'})}finally{f.release()}
})
test('recall save failure preserves the existing parked craft and wallet-independent state',()=>{const f=fixture('kashi');try{f.flight.personalAction('summon');const before=f.flight.status().position,saved=f.personal.snapshot();const p=f.player.body.translation();f.player.body.setTranslation({x:p.x+20,y:p.y,z:p.z},true);f.step();const original=f.store.setItem;f.store.setItem=()=>{throw Error('disk full')};assert.throws(()=>f.flight.personalAction('summon'),/disk full/);assert.deepEqual(f.flight.status().position,before);assert.deepEqual(f.personal.snapshot().position,saved.position);assert.equal(f.personal.snapshot().yaw,saved.yaw);assert.equal(f.personal.snapshot().error,'disk full');f.store.setItem=original}finally{f.release()}})

test('blocked recall does not discard the original parked craft',()=>{const f=fixture('kashi');try{f.flight.personalAction('summon');const before=f.flight.status().position,saved=f.store.getItem(CRAFT_KEY),fixed=[];f.world.forEachRigidBody(b=>{if(b.isFixed())fixed.push(b)});for(const b of fixed)f.world.removeRigidBody(b);f.step();assert.throws(()=>f.flight.personalAction('summon'),{code:'CRAFT_SPAWN_BLOCKED'});assert.deepEqual(f.flight.status().position,before);assert.equal(f.store.getItem(CRAFT_KEY),saved);assert.equal(f.flight.root.children[0].visible,true)}finally{f.release()}})
