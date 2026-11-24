import {createStateDiagnostics} from './stateDiagnostics.js'
import {createCameraPlacement} from './cameraPlacement.js'
import {Vector3} from 'three'
import {createThirdPersonFollow,bindOrbitPointer,createMovementReference} from './thirdPersonFollow.js'
import {requireCondition} from '../campaign/contracts.js'
import {movementWithPendingTarget} from './nativeResources.js'
import {cameraClearance} from '../../../src/game/player/cameraCollision.js'
import {GAMEPLAY_QUERY_GROUPS} from '../../../src/game/collisionGroups.js'
import {DODGE_ACTIVE_MS,DODGE_COOLDOWN_MS} from '../../../src/game/player/combatTiming.js'

const inputOwners=new WeakMap(),cameraOwners=new WeakMap(),cameraViews=new WeakMap()
const cameraViewKey='kalki:phase5-staging:camera-view:v1'
function readCameraView(camera,target){
 if(cameraViews.has(camera))return cameraViews.get(camera)
 try{const value=JSON.parse(target?.sessionStorage?.getItem(cameraViewKey)??'null');if(value?.version===1&&[value.yaw,value.pitch].every(Number.isFinite)&&value.pitch>=-.15&&value.pitch<=1.05)return value}catch{/* Unavailable session storage never blocks controls. */}
 return null
}
function saveCameraView(camera,target,view){
 cameraViews.set(camera,view)
 try{target?.sessionStorage?.setItem(cameraViewKey,JSON.stringify({version:1,...view}))}catch{/* Camera preference is optional; campaign data is not accessed. */}
}
const movementKeys=new Set(['w','a','s','d','arrowup','arrowleft','arrowdown','arrowright','control'])
// Adapted from PlayerInput.jsx: per-session values replace the global store.
export function bindKeyboard({target,sessionId,signal,onMove,onAttack,onInteract,onHeal,onAction,onError=()=>{},extraKeys=[],onKeys=()=>{},onDiagnostic=()=>{}}){
 requireCondition(target?.addEventListener&&target?.removeEventListener&&typeof onMove==='function'&&typeof onAttack==='function','INPUT_UNAVAILABLE','Keyboard target and concrete input consumers required')
 let active=false,closed=false,epoch=0;const keys=new Set(),token={sessionId}
 const live=()=>!closed&&!signal.aborted&&inputOwners.get(target)===token&&active
 const record=(kind,detail={})=>onDiagnostic(kind,{epoch,...detail})
 function move(){let x=Number(keys.has('d')||keys.has('arrowright'))-Number(keys.has('a')||keys.has('arrowleft')),y=Number(keys.has('w')||keys.has('arrowup'))-Number(keys.has('s')||keys.has('arrowdown'));const length=Math.hypot(x,y);if(length>1){x/=length;y/=length}onMove({x,y,sprint:keys.has('control')});onKeys([...keys])}
 function clear(){epoch++;keys.clear();onMove({x:0,y:0,sprint:false});onKeys([]);onAction?.('block',false);record('input-cleared');target.dispatchEvent?.(new Event('kalki-input-reset'))}
 function queued(action,callback){const queuedEpoch=epoch;Promise.resolve().then(()=>{if(live()&&epoch===queuedEpoch){record('input-dispatched',{action});return callback()}record('stale-input-rejected',{action,queuedEpoch})}).catch(onError)}
 function down(event){
  if(!live()||event.target?.isContentEditable||event.target?.matches?.('input,textarea,select')||event.target?.closest?.('dialog,[aria-modal="true"]'))return
  const key=event.key?.toLowerCase(),action=onAction?(key==='f'?'block':key==='q'||key==='shift'?'dodge':key===' '?'jump':key==='r'?'finisher':null):null
  if(!movementKeys.has(key)&&!extraKeys.includes(key)&&!action&&!['e','j','k'].includes(key)&&!(key==='h'&&onHeal))return
  event.preventDefault()
  // A resume/blur boundary invalidates held keys. OS repeat is not a new press.
  if(event.repeat||keys.has(key)){record('input-repeat-rejected',{key});return}
  keys.add(key);record('input-accepted',{key});move()
  if(action)onAction(action,true)
  if(key==='h'&&onHeal)queued('heal',onHeal)
  if(key==='e'&&onInteract)queued('interact',onInteract)
  if(key==='j'||key==='k')queued('attack',()=>onAttack(key==='j'?'light':'heavy'))
 }
 function up(event){if(!live())return;const key=event.key?.toLowerCase();if(!keys.has(key))return;keys.delete(key);if(key==='f')onAction?.('block',false);record('input-released',{key});move()}
 function blur(){if(live())clear()}
 function pause(){if(!active)return;active=false;target.removeEventListener('keydown',down);target.removeEventListener('keyup',up);target.removeEventListener('blur',blur);if(inputOwners.get(target)===token){inputOwners.delete(target);clear()}}
 function resume(){requireCondition(!closed&&!signal.aborted,'SESSION_CANCELLED','Input owner released');if(active)return;requireCondition(!inputOwners.has(target),'INPUT_BUSY','Another session owns keyboard input');epoch++;inputOwners.set(target,token);active=true;target.addEventListener('keydown',down);target.addEventListener('keyup',up);target.addEventListener('blur',blur);record('input-resumed')}
 function release(){if(closed)return;pause();closed=true;signal.removeEventListener('abort',release)}
 signal.addEventListener('abort',release,{once:true});return Object.freeze({resume,pause,release})
}

export function leaseCamera({camera,sessionId,signal}){
 requireCondition(camera?.isCamera,'CAMERA_UNAVAILABLE','Real Three.js camera required');let closed=false,active=false,saved;const token={sessionId}
 function resume(){requireCondition(!closed&&!signal.aborted,'SESSION_CANCELLED','Camera owner released');if(active)return;requireCondition(!cameraOwners.has(camera),'CAMERA_BUSY','Camera belongs to another session');saved={position:camera.position.clone(),quaternion:camera.quaternion.clone(),fov:camera.fov,near:camera.near,far:camera.far};cameraOwners.set(camera,token);active=true}
 function update(position,target){requireCondition(!closed&&!signal.aborted&&active&&cameraOwners.get(camera)===token,'CAMERA_NOT_OWNED','Camera write rejected');requireCondition([...position.toArray(),...target.toArray()].every(Number.isFinite),'INVALID_CAMERA','Finite camera transforms required');camera.position.copy(position);camera.lookAt(target);camera.updateMatrixWorld()}
 function project({fov,near,far}){requireCondition(!closed&&!signal.aborted&&active&&cameraOwners.get(camera)===token,'CAMERA_NOT_OWNED','Camera projection write rejected');requireCondition(Number.isFinite(fov)&&fov>0&&fov<180&&Number.isFinite(near)&&near>0&&Number.isFinite(far)&&far>near,'INVALID_CAMERA','Finite perspective projection required');Object.assign(camera,{fov,near,far});camera.updateProjectionMatrix()}
 function pause(){if(cameraOwners.get(camera)!==token)return;camera.position.copy(saved.position);camera.quaternion.copy(saved.quaternion);if(camera.isPerspectiveCamera){Object.assign(camera,{fov:saved.fov,near:saved.near,far:saved.far});camera.updateProjectionMatrix()}camera.updateMatrixWorld();cameraOwners.delete(camera);active=false}
 function release(){if(closed)return;pause();closed=true;signal.removeEventListener('abort',release)}
 signal.addEventListener('abort',release,{once:true});return Object.freeze({resume,pause,update,project,release})
}

// Extracts the legacy controller movement; supplied model/body are real resources,
// never fabricated here. Frame/world stepping remains owned by the renderer host.
export function createPlayerMotion({player,controller,rapier,signal,actions=false,jumpActions=actions,relativeMovement=false,getCameraHeading=null}){
 requireCondition(player?.object?.isObject3D&&player.body?.collider(0)&&controller?.computeColliderMovement&&rapier?.QueryFilterFlags,'MOVEMENT_UNAVAILABLE','Initialized model, body, collider and controller required')
 let input={x:0,y:0,sprint:false},vertical=0,pending=null,clock=0,dodgeUntil=0,dodgeReady=0,guarding=false,jumpQueued=false,dodgeQueued=false,direction={x:0,z:-1},airborne=false
 let heading=player.object.rotation.y,velocityX=0,velocityZ=0,resumeContact=false
 const cameraRelative=typeof getCameraHeading==='function'
 const state=()=>({guarding:guarding&&clock>=dodgeUntil,dodging:clock<dodgeUntil,airborne})
 const publish=()=>player.setCombatState?.(state())
 return Object.freeze({setInput(value){input=value;if(value.x||value.y)resumeContact=false},turn(delta){if(relativeMovement&&!signal.aborted&&Number.isFinite(delta))heading+=delta},snapshot:state,action(name,value=true){if(signal.aborted||!(name==='jump'?jumpActions:actions))return {accepted:false,code:'ACTION_UNAVAILABLE'};if(name==='finisher')return {accepted:false,code:'FINISHER_UNAVAILABLE',message:'Finisher unavailable: no Mission 1 finisher animation or session-safe implementation.'};if(name==='block')guarding=Boolean(value);else if(name==='jump')jumpQueued=true;else if(name==='dodge')dodgeQueued=true;else return {accepted:false,code:'ACTION_UNAVAILABLE'};publish();return {accepted:true}},reset(){resumeContact=true;heading=player.object.rotation.y;velocityX=0;velocityZ=0;pending=null;vertical=0;input={x:0,y:0,sprint:false};guarding=false;jumpQueued=false;dodgeQueued=false;dodgeUntil=clock;airborne=false;publish()},tick(delta){requireCondition(!signal.aborted,'SESSION_CANCELLED','Movement owner released');requireCondition(Number.isFinite(delta)&&delta>0&&delta<=.1,'INVALID_FRAME','Bounded frame delta required');clock+=delta*1000;if(relativeMovement&&!cameraRelative)player.object.rotation.y+=Math.atan2(Math.sin(heading-player.object.rotation.y),Math.cos(heading-player.object.rotation.y))*(1-Math.exp(-12*delta));const localX=input.x,localY=input.y,yaw=cameraRelative?getCameraHeading():relativeMovement?player.object.rotation.y:0,worldX=localX*Math.cos(yaw)-localY*Math.sin(yaw),worldZ=-localX*Math.sin(yaw)-localY*Math.cos(yaw);const body=player.body,collider=body.collider(0),current=body.translation(),grounded=controller.computedGrounded();vertical=grounded&&vertical<0?-.5:vertical-19*delta
  if(jumpQueued&&grounded&&!airborne&&clock>=dodgeUntil)vertical=6.8;jumpQueued=false
  if(dodgeQueued&&grounded&&clock>=dodgeReady){const length=Math.hypot(input.x,input.y);if(length>.08)direction={x:worldX/length,z:worldZ/length};else{const v=new Vector3(0,0,-1).applyQuaternion(player.object.quaternion);direction={x:v.x,z:v.z}}dodgeUntil=clock+DODGE_ACTIVE_MS;dodgeReady=clock+DODGE_COOLDOWN_MS}dodgeQueued=false
  const dodging=clock<dodgeUntil,speed=(input.sprint?7:4.5)*(guarding&&!dodging?.5:1)
  // Only Mission 1 opts into camera-relative steering. Existing exploration and
  // vehicle bindings retain their movement contract.
  if(cameraRelative){
   requireCondition(Number.isFinite(yaw),'INVALID_CAMERA','Finite camera heading required')
   const alpha=1-Math.exp(-(Math.hypot(localX,localY)>.08?14:18)*delta)
   velocityX+=(worldX*speed-velocityX)*alpha;velocityZ+=(worldZ*speed-velocityZ)*alpha
   if(Math.hypot(localX,localY)>.08&&!dodging){const facing=Math.atan2(-worldX,-worldZ);player.object.rotation.y+=Math.atan2(Math.sin(facing-player.object.rotation.y),Math.cos(facing-player.object.rotation.y))*(1-Math.exp(-12*delta))}
  }
  const desired={x:dodging?direction.x*10.5*delta:(cameraRelative?velocityX:worldX*speed)*delta,y:vertical*delta,z:dodging?direction.z*10.5*delta:(cameraRelative?velocityZ:worldZ*speed)*delta}
  // Static traction at a grounded, motionless capsule must not turn downward
  // ground pressure into sideways travel around a pavement edge. Keep the
  // collision query and gravity; sliding is restored for movement and free fall.
  const stationary=resumeContact&&cameraRelative&&grounded&&!dodging&&vertical<=0&&velocityX===0&&velocityZ===0&&typeof controller.setSlideEnabled==='function'
  const sliding=stationary?controller.slideEnabled():null
  try{if(stationary)controller.setSlideEnabled(false);controller.computeColliderMovement(collider,movementWithPendingTarget(current,pending,desired),rapier.QueryFilterFlags.EXCLUDE_SENSORS,undefined,obstacle=>obstacle.handle!==collider.handle)}finally{if(stationary)controller.setSlideEnabled(sliding)}
  const move=controller.computedMovement();airborne=vertical>0||!controller.computedGrounded();if(controller.computedGrounded()&&vertical<0)vertical=-.5;pending={x:current.x+move.x,y:current.y+move.y,z:current.z+move.z};body.setNextKinematicTranslation(pending);player.object.position.set(pending.x,pending.y,pending.z);if(!relativeMovement&&!cameraRelative&&Math.hypot(input.x,input.y)>.08&&!dodging)player.object.rotation.y=Math.atan2(-input.x,input.y);publish();return pending}})
}

export function createCollisionResolver({world,rapier}){
 return function resolve({sessionId,signal,player,type,actors}){
  requireCondition(!signal.aborted,'SESSION_CANCELLED','Attack owner released');requireCondition(world?.castRay&&rapier?.Ray&&player?.body&&player.object?.isObject3D,'COLLISION_UNAVAILABLE','Initialized physics and player required');requireCondition(['light','heavy'].includes(type),'INVALID_ATTACK','Unknown attack')
  const body=player.body,collider=body.collider(0);requireCondition(world.getRigidBody(body.handle)===body&&collider,'INVALID_PHYSICS_ACTOR','Player body is outside this world')
  const origin=body.translation(),forward=new Vector3(0,0,-1).applyQuaternion(player.object.getWorldQuaternion(new player.object.quaternion.constructor()));let result=null,nearest=type==='heavy'?2.85:2.35
  for(const actor of actors){requireCondition(actor.sessionId===sessionId,'SESSION_MISMATCH','Collision candidate belongs to another session');const targetBody=actor.body,targetCollider=actor.collider??targetBody?.collider(0);requireCondition(targetBody&&world.getRigidBody(targetBody.handle)===targetBody&&targetCollider&&world.getCollider(targetCollider.handle)===targetCollider,'INVALID_PHYSICS_ACTOR','Target collider must belong to current world');const position=targetBody.translation(),dx=position.x-origin.x,dz=position.z-origin.z,distance=Math.hypot(dx,dz);if(distance<.001||distance>nearest||(dx*forward.x+dz*forward.z)/distance<.16)continue
   const start={x:origin.x,y:origin.y+1.18,z:origin.z},direction=new Vector3(dx,position.y-origin.y,dz).normalize(),ray=new rapier.Ray(start,direction),hit=world.castRay(ray,distance+.01,true,rapier.QueryFilterFlags.EXCLUDE_SENSORS,GAMEPLAY_QUERY_GROUPS,collider,body)??world.castShape(start,{x:0,y:0,z:0,w:1},direction,new rapier.Ball(.002),0,distance+.01,true,rapier.QueryFilterFlags.EXCLUDE_SENSORS,GAMEPLAY_QUERY_GROUPS,collider,body)
   // A 2mm swept probe handles nearly axial capsule-ray precision misses.
   // Existing range/facing gates and the first actual obstruction remain authoritative.
   if(hit?.collider.handle===targetCollider.handle){nearest=distance;result={actorId:actor.actorId,instanceId:actor.instanceId,sessionId,confirmed:true}}
  }return result
 }
}

/** Composes real input, Rapier movement, camera writes and ray hits. No model
 * factory or frame loop is invented; those must be supplied by a renderer host.
 */
export function createPlayerBindings({world,rapier,camera,target,renderer,subscribeFrame,onError=()=>{},onActionFeedback=()=>{},walkingSkyline=false,gameTime=()=>null}){
 return Object.freeze({resolvePlayerHit:createCollisionResolver({world,rapier}),bindControls({sessionId,signal,player,controller,attack,interact,heal,combatActions=false,jumpActions=combatActions,freeCamera=combatActions,readGameplayState}){
  requireCondition(typeof subscribeFrame==='function','FRAME_HOST_UNAVAILABLE','Renderer-owned frame subscription required');const diagnostics=freeCamera?createStateDiagnostics({target,canvas:renderer?.domElement,sessionId,readState:readGameplayState,readPosition:()=>player.body.translation(),readClock:gameTime}):null;const follow=freeCamera?createThirdPersonFollow({orbit:true,followFacing:true,heading:player.object.rotation.y,state:readCameraView(camera,target)}):null,placement=freeCamera?createCameraPlacement({world,rapier,camera,player}):null,movementReference=follow?createMovementReference(()=>placement.heading()??follow.heading()):null,motion=createPlayerMotion({player,controller,rapier,signal,actions:combatActions,jumpActions,relativeMovement:freeCamera,getCameraHeading:movementReference?.heading}),cameraLease=leaseCamera({camera,sessionId,signal}),keyboard=bindKeyboard({target,sessionId,signal,onMove:value=>{cameraMoving=Boolean(value.x||value.y);movementReference?.input(value);motion.setInput(player.isResting?.()?{x:0,y:0}:value)},onDiagnostic:(kind,detail)=>diagnostics?.record(kind,detail),onAttack:attack,onInteract:interact,onHeal:combatActions?heal:undefined,onAction:combatActions||jumpActions?(name,value)=>{if(signal.aborted||player.isAlive?.()===false||player.isResting?.())return;const result=motion.action(name,value);if(!result.accepted)onActionFeedback(result)}:undefined,onError});let diagnosticTime=0;const headingDrag=freeCamera?bindOrbitPointer({target,canvas:renderer?.domElement,signal,rotate:(dx,dy)=>{if(Math.abs(dx)>.001)movementReference?.orbit();follow.rotate(dx,dy)}}):null;let unsubscribe=null,closed=false,active=false,blendPosition=null,blendLook=null,skylineWeight=0,cameraMoving=false
  const saveOnPageHide=()=>{if(active&&follow)saveCameraView(camera,target,follow.snapshot())}
  function pause(){if(active&&follow)saveCameraView(camera,target,follow.snapshot());active=false;target.removeEventListener('pagehide',saveOnPageHide);cameraMoving=false;placement?.reset();if(renderer?.domElement?.dataset?.cameraSafetyOwner===sessionId){delete renderer.domElement.dataset.cameraSafety;delete renderer.domElement.dataset.cameraSafetyOwner}blendPosition=null;blendLook=null;const stop=unsubscribe;unsubscribe=null;try{stop?.()}finally{try{headingDrag?.pause();follow?.reset();keyboard.pause();motion.reset();movementReference?.reset()}finally{cameraLease.pause();diagnostics?.setPaused(true)}}}
  function tick(delta){if(!active||signal.aborted||player.isAlive?.()===false)return;try{const p=player.isResting?.()?(player.restCameraTarget?.()??player.body.translation()):motion.tick(delta);const desired=walkingSkyline?walkingSkylineWeight(p):0;skylineWeight+=(desired-skylineWeight)*(1-Math.exp(-delta*3));const framing=follow?follow.update(p,player.isResting?.()?follow.heading():player.object.rotation.y,delta,cameraMoving):walkingFrame(p,skylineWeight),origin=new Vector3(p.x,p.y+1.3,p.z),position=framing.position,look=framing.target;if(!placement){const clearance=cameraClearance(world,rapier,origin,position,player.body.collider(0),player.body,.45);position.lerpVectors(origin,position,clearance)}if(blendPosition){const alpha=1-Math.exp(-delta*8);blendPosition.lerp(position,alpha);blendLook.lerp(look,alpha);const finalPosition=blendPosition.clone();if(!placement){const finalClearance=cameraClearance(world,rapier,origin,finalPosition,player.body.collider(0),player.body,.45);finalPosition.lerpVectors(origin,finalPosition,finalClearance)}cameraLease.update(placement?placement.solve(p,finalPosition,delta,blendLook):finalPosition,blendLook);if(blendPosition.distanceTo(position)<.01&&blendLook.distanceTo(look)<.01){blendPosition=null;blendLook=null}}else cameraLease.update(placement?placement.solve(p,position,delta,look):position,look);if(placement&&renderer?.domElement?.dataset){diagnosticTime+=delta;if(diagnosticTime>=.2){diagnosticTime=0;renderer.domElement.dataset.cameraSafetyOwner=sessionId;renderer.domElement.dataset.cameraSafety=JSON.stringify(placement.snapshot())}}}catch(error){try{pause()}finally{onError(error)}}}
  function resume({cameraFrom,resetMotion=false}={}){requireCondition(!closed&&!signal.aborted,'SESSION_CANCELLED','Controls released');if(active)return;try{if(resetMotion)motion.reset();cameraLease.resume();if(cameraFrom){blendPosition=cameraFrom.position.clone();blendLook=cameraFrom.target.clone();cameraLease.update(blendPosition,blendLook)}keyboard.resume();headingDrag?.resume();active=true;target.addEventListener('pagehide',saveOnPageHide);unsubscribe=subscribeFrame(tick);requireCondition(typeof unsubscribe==='function','INVALID_FRAME_HOST','Frame subscription cleanup required');diagnostics?.setPaused(false)}catch(error){pause();throw error}}
  function release(){if(closed)return;closed=true;diagnostics?.release();try{pause()}finally{headingDrag?.release();keyboard.release();cameraLease.release();signal.removeEventListener('abort',release)}}
  signal.addEventListener('abort',release,{once:true});return {ready:true,activate:resume,pause,resume,release,combatState:motion.snapshot,recordDiagnostic:(kind,detail)=>diagnostics?.record(kind,detail)}
 }})
}

// Opt-in for world walking only. Position-based blending adds no input owner,
// frame loop, projection changes or cinematic/vehicle camera writes.
export function walkingSkylineWeight(position){
 const distance=Math.hypot(position.x-264,position.z-155)
 const t=Math.max(0,Math.min(1,(40-distance)/18))
 return t*t*(3-2*t)
}
export function walkingFrame(p,weight=0){
 const w=Math.max(0,Math.min(1,weight))
 return {position:new Vector3(p.x,p.y+2.45-1.1*w,p.z+4.15),target:new Vector3(p.x,p.y+1.25+.25*w,p.z)}
}
