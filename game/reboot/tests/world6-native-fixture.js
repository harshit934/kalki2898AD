import assert from 'node:assert/strict'
import {performance} from 'node:perf_hooks'
import {Scene,Group,Mesh,BoxGeometry,MeshStandardMaterial,PerspectiveCamera} from 'three'
import R from '@dimforge/rapier3d-compat'
import {LOCATION_DEFINITIONS,containsPosition} from '../src/world/locations/definitions.js'
import {resolveLocationSpawn} from '../src/world/locations/spawn.js'
import {createPlayerMotion} from '../src/gameplay/playerBindings.js'
// Controlled asset scaffold for native tests only. Existing GLB tests separately
// decode original assets; this fixture is not rendered or model acceptance.
export function scaffold(){const scene=new Group(),material=new MeshStandardMaterial();material.name='Green patina';scene.add(new Mesh(new BoxGeometry(.8,8,.8).translate(-9,4,-6),material));return {scene}}
export async function worldFixture(id,prepare,options={}){
 const world=new R.World({x:0,y:-19,z:0}),frames=new Set(),before=new Set(),after=new Set(),host={world,rapier:R,scene:new Scene(),camera:new PerspectiveCamera(42,16/9,.1,500),renderer:{shadowMap:{enabled:false}},subscribeFrame:fn=>{frames.add(fn);before.add(fn);return()=>{frames.delete(fn);before.delete(fn)}},subscribeAfterPhysics:fn=>{frames.add(fn);after.add(fn);return()=>{frames.delete(fn);after.delete(fn)}}}
 const abort=new AbortController(),start=performance.now();let content
 try{content=await prepare({host,signal:abort.signal,loadAsset:async()=>scaffold(),...options})}catch(e){world.free();throw e}
 return {host,world,frames,before,after,abort,content,loadMs:performance.now()-start,location:LOCATION_DEFINITIONS.find(l=>l.id===id),release(){content.release();world.free()}}
}
export function walker(f,at=f.content.spawn){
 const p=resolveLocationSpawn({host:f.host,location:f.location,position:at}),body=f.world.createRigidBody(R.RigidBodyDesc.kinematicPositionBased().setTranslation(...p));f.world.createCollider(R.ColliderDesc.capsule(.55,.34).setTranslation(0,.89,0),body)
 const controller=f.world.createCharacterController(.03);controller.enableAutostep(.3,.2,false);controller.enableSnapToGround(.3);const abort=new AbortController(),motion=createPlayerMotion({player:{body,object:new Group()},controller,rapier:R,signal:abort.signal});f.world.step();let frames=0,metres=0
 function step(n){for(let i=0;i<n;i++){const before=body.translation();f.beforePhysics?.(1/60);motion.tick(1/60);f.world.step();f.afterPhysics?.(1/60);const after=body.translation();frames++;metres+=Math.hypot(after.x-before.x,after.z-before.z);assert.ok(after.y>(f.minimumY??-.6),'Player remained above the authored minimum floor')}}
 return {body,motion,step,stats:()=>({frames,metres}),walk(x,z){const before={...body.translation()},start={frames,metres},limit=Math.ceil(Math.hypot(x-before.x,z-before.z)/4.5*120)+240;let i=0
  while(Math.hypot(x-body.translation().x,z-body.translation().z)>.15){assert.ok(i++<limit,JSON.stringify({goal:[x,z],position:body.translation()}));const p=body.translation(),d=Math.hypot(x-p.x,z-p.z);motion.setInput({x:(x-p.x)/d,y:-(z-p.z)/d});step(1)}motion.setInput({x:0,y:0});step(5);const position={...body.translation()};assert.ok(containsPosition(f.location,[position.x,position.y,position.z]));return {goal:[x,z],before,position,frames:frames-start.frames,metres:metres-start.metres}
 },release(){abort.abort();f.world.removeCharacterController(controller);f.world.removeRigidBody(body)}}
}
