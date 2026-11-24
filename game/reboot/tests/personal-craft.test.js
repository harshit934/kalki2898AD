import test from 'node:test'
import assert from 'node:assert/strict'
import {Scene,Group,Mesh,BoxGeometry,MeshBasicMaterial,AnimationClip,PerspectiveCamera} from 'three'
import RAPIER from '@dimforge/rapier3d-compat'
import {createFrameHost} from '../src/gameplay/frameHost.js'
import {createWorldExplorer} from '../src/world/worldExploration.js'
import {prepareKashiDistrict} from '../src/world/kashiDistrict.js'
import {PLAYER_SKIMMER_ID} from '../src/world/playerFlight.js'
import {createPersonalCraft} from '../src/world/personalCraft.js'
await RAPIER.init()
const tick=()=>new Promise(resolve=>setImmediate(resolve))
function asset(){const scene=new Group();scene.add(new Mesh(new BoxGeometry(1,2,1),new MeshBasicMaterial()));return {scene,animations:['Sword idle (guard)','Idle','Walk','Run'].map(name=>new AnimationClip(name,1,[]))}}
function key(target,type,value){const event=new Event(type,{cancelable:true});Object.defineProperties(event,{key:{value},repeat:{value:false}});target.dispatchEvent(event)}
async function fixture(storage){
 const lifetime=new AbortController(),abort=new AbortController(),world=new RAPIER.World({x:0,y:-19,z:0}),scene=new Scene(),camera=new PerspectiveCamera(42,16/9,.1,180),target=new EventTarget(),queue=new Map(),captured=[],errors=[],states=[]
 let next=0,time=0
 const renderer={isWebGLRenderer:true,shadowMap:{enabled:false},domElement:{ownerDocument:{defaultView:target}},getContext:()=>({isContextLost:()=>false}),render(){}}
 const frames=createFrameHost({world,scene,camera,renderer,signal:lifetime.signal,onError:e=>errors.push(e),requestFrame:fn=>{queue.set(++next,fn);return next},cancelFrame:id=>queue.delete(id)})
 const host={...frames,world,scene,camera,renderer,rapier:RAPIER,subscribeFrame(fn){captured.push(fn);return frames.subscribeFrame(fn)}}
 const content=await prepareKashiDistrict({host,signal:lifetime.signal}),cleanups=[]
 const explorer=await createWorldExplorer({host,signal:abort.signal,ownerId:'flight-test',position:[162,-.175,62.5],own:fn=>cleanups.push(fn),loadPlayerAsset:async()=>asset(),worldContent:content,personalCraft:createPersonalCraft({storage}),onError:e=>errors.push(e),onWorldState:s=>states.push(s)})
 let player;world.forEachRigidBody(body=>{if(body.isKinematic())player=body})
 host.resume()
 const f={host,world,scene,camera,target,content,explorer,abort,errors,states,player,captured,
  run(count){for(let i=0;i<count;i++){const value=queue.entries().next().value;assert.ok(value,'existing frame loop active');queue.delete(value[0]);value[1](time+=1000/60)}},
  async press(value){key(target,'keydown',value);await tick()},up:value=>key(target,'keyup',value),
  async release(){await explorer.release();abort.abort();content.release();frames.release();world.free()}}
 f.run(5);return f
}
async function takeoff(f){await f.press(' ');f.run(90);f.up(' ');f.run(60);assert.equal(f.explorer.vehicleStatus().mode,'flying')}
test('personal craft actual native summon, exclusive drive, exit, persistence and dismiss',async()=>{
 const data=new Map(),storage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v)},f=await fixture(storage)
 try{const mesh=f.scene.getObjectByName(PLAYER_SKIMMER_ID).children[0];assert.equal(mesh.visible,false);f.explorer.personalVehicle('summon');assert.equal(mesh.visible,true);assert.throws(()=>f.explorer.personalVehicle('summon'),{code:'CRAFT_ALREADY_SUMMONED'});
 const at=f.explorer.vehicleStatus().position,p={x:at[0]+3,y:at[1]-.84+.055,z:at[2]};f.player.setTranslation(p,true);f.player.setNextKinematicTranslation(p);f.world.step();f.explorer.personalVehicle('enter');assert.equal(f.player.isEnabled(),false);assert.throws(()=>f.explorer.personalVehicle('dismiss'),{code:'VEHICLE_OCCUPIED'});await takeoff(f);await f.press('w');f.run(60);f.up('w');const moved=f.explorer.vehicleStatus();assert.ok(Math.hypot(moved.position[0]-at[0],moved.position[2]-at[2])>2);await f.press('d');f.run(30);f.up('d');assert.ok(f.explorer.vehicleStatus().yaw<moved.yaw);f.run(90);f.explorer.personalVehicle('exit');assert.equal(f.player.isEnabled(),true);assert.equal(createPersonalCraft({storage}).snapshot().summoned,true);f.explorer.personalVehicle('dismiss');assert.equal(mesh.visible,false);assert.equal(createPersonalCraft({storage}).snapshot().summoned,false);assert.deepEqual(f.errors,[])
 }finally{await f.release()}
})

test('failed personal summon/dismiss writes preserve visibility and failed exit save still restores player controls',async()=>{
 const data=new Map(),storage={blocked:false,getItem:k=>data.get(k)??null,setItem(k,v){if(this.blocked)throw Error('personal save blocked');data.set(k,v)}},f=await fixture(storage)
 try{const mesh=f.scene.getObjectByName(PLAYER_SKIMMER_ID).children[0];storage.blocked=true;assert.throws(()=>f.explorer.personalVehicle('summon'));assert.equal(mesh.visible,false);storage.blocked=false;f.explorer.personalVehicle('summon');const at=f.explorer.vehicleStatus().position,p={x:at[0]+3,y:at[1]-.84+.055,z:at[2]};f.player.setTranslation(p,true);f.player.setNextKinematicTranslation(p);f.world.step();f.explorer.personalVehicle('enter');assert.throws(()=>f.explorer.personalVehicle('enter'),{code:'CRAFT_ENTRY_BLOCKED'});storage.blocked=true;f.explorer.personalVehicle('exit');assert.equal(f.player.isEnabled(),true);assert.equal(f.explorer.vehicleStatus().occupied,false);assert.throws(()=>f.explorer.personalVehicle('dismiss'));assert.equal(mesh.visible,true);storage.blocked=false;f.explorer.personalVehicle('dismiss');assert.equal(mesh.visible,false);assert.deepEqual(f.errors,[])}finally{await f.release()}
})

test('normal summon initially lies outside boarding radius; ordinary movement can approach and board',async()=>{const data=new Map(),storage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v)},f=await fixture(storage);try{f.explorer.personalVehicle('summon');const craft=f.explorer.vehicleStatus().position,start={...f.player.translation()},distance=Math.hypot(start.x-craft[0],start.z-craft[2]);console.log('boarding reproduction',JSON.stringify({start,craft,distance}));assert.ok(distance>4);assert.throws(()=>f.explorer.personalVehicle('enter'));await f.press('s');f.run(40);f.up('s');const after={...f.player.translation()};console.log('boarding approach',JSON.stringify({after,distance:Math.hypot(after.x-craft[0],after.z-craft[2])}));f.explorer.personalVehicle('enter');assert.equal(f.player.isEnabled(),false)}finally{await f.release()}})
