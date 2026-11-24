import {findSkimmerLanding} from './skimmerLanding.js'
import {Group,Mesh,MeshStandardMaterial,MeshBasicMaterial,RingGeometry,Vector3} from 'three'
import {createKashiVehicleGeometry} from './livingKashi.js'
import {bindKeyboard,leaseCamera} from '../gameplay/playerBindings.js'
import {cameraClearance} from '../../../src/game/player/cameraCollision.js'
import {deepFreeze,requireCondition} from '../campaign/contracts.js'

export const PLAYER_SKIMMER_ID='kashi-player-skimmer'
export const FLIGHT_BOUNDS=deepFreeze({minX:108,maxX:364,minZ:-20,maxZ:116,maxY:54})
export const LANDING_PADS=deepFreeze([
 {id:'salvage-avenue',position:[162,-.1925,59]},
 {id:'east-spine',position:[292,-.1925,60]},
 {id:'cross-street',position:[318,-.1925,40]}
])
export const FLIGHT_HINT='SKIMMER | W/S thrust | A/D turn | Space takeoff/rise | L / Shift descend | Hold L to descend and land on clear, level ground; marked rings offer landing assist | E exit anywhere (airborne exit causes a fall)'
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v)),identity={x:0,y:0,z:0,w:1}
function cameraPose(camera){return {position:camera.position.clone(),target:camera.position.clone().add(camera.getWorldDirection(new Vector3()).multiplyScalar(8))}}

// Exploration-lease resource. It never owns the persistent world, character
// asset, campaign data, Bujji or autonomous traffic. An empty parked craft is
// non-blocking to pedestrians; its full collision hull exists while occupied.
export function createPlayerFlight({host,signal,ownerId,player,controls,worldContent,onChange=()=>{},onError=()=>{},personal}){
 const {world,rapier,camera}=host,target=host.renderer.domElement.ownerDocument.defaultView
 requireCondition(!signal.aborted&&player?.body&&controls?.pause&&controls?.resume,'FLIGHT_UNAVAILABLE','Live character and exploration controls required')
 requireCondition(!host.scene.getObjectByName(PLAYER_SKIMMER_ID),'DUPLICATE_PLAYER_VEHICLE','Only one exploration skimmer may exist')
 const root=new Group();root.name=PLAYER_SKIMMER_ID;root.userData={ownerId,role:'player-flight-prototype'}
 let geometry,material,padGeometry,padMaterial,body=null,collider=null,controller=null,keyboard=null,cameraLease=null,stop=null,closed=false,releaseFailure=null,state='parked',message='',yaw=Math.PI,landHeld=false
 let input={x:0,y:0,up:false,down:false},position=new Vector3(162,.6475,59),velocity=new Vector3(),turn=0,landingPad=null
 const cameraPosition=new Vector3(),cameraTarget=new Vector3(),forward=new Vector3(),desiredCamera=new Vector3(),desiredLook=new Vector3()
 const occupied=()=>['landed','taking-off','flying','landing','faulted'].includes(state)
 const live=()=>requireCondition(!closed&&!signal.aborted,'SESSION_CANCELLED','Exploration vehicle released')
 const setMessage=text=>{message=text;onChange()}
 function onPad(p){return LANDING_PADS.find(pad=>Math.hypot(p.x-pad.position[0],p.z-pad.position[2])<=5)??null}
 function groundAt(x,z){
  const hit=world.castRayAndGetNormal(new rapier.Ray({x,y:position.y+2,z},{x:0,y:-1,z:0}),position.y+30,true,rapier.QueryFilterFlags.EXCLUDE_SENSORS,undefined,undefined,body,c=>c.parent()?.isFixed()&&c.parent()?.handle!==player.body.handle)
  return hit&&hit.normal.y>.95?position.y+2-hit.timeOfImpact:null
 }
 function landingSite(p=position){return findSkimmerLanding({world,rapier,position:p,bounds:FLIGHT_BOUNDS,ignoredBodies:[player.body.handle,body?.handle].filter(v=>v!==undefined)})}
 function safePad(pad){const site=landingSite({x:pad.position[0],y:position.y,z:pad.position[2]});return site&&Math.abs(site.position[1]-pad.position[1])<.08}
 function exitPosition(){
  for(const [dx,dz] of [[3.4,0],[-3.4,0],[0,3.5],[0,-3.5]]){
   const x=position.x+dx,z=position.z+dz;if(x<108||x>364||z<-20||z>116)continue
   const ground=groundAt(x,z),supported=ground!==null&&Math.abs(ground-(position.y-.84))<=.18
   const foot=supported?ground+.055:position.y-.84+.055,shape=new rapier.Capsule(.55,.34)
   const hit=world.intersectionWithShape({x,y:foot+.89,z},identity,shape,rapier.QueryFilterFlags.EXCLUDE_SENSORS,undefined,undefined,body,c=>c.parent()?.handle!==player.body.handle)
   const sweep=world.castShape({x:position.x,y:foot+.89,z:position.z},identity,{x:dx,y:0,z:dz},shape,0,1,true,rapier.QueryFilterFlags.EXCLUDE_SENSORS,undefined,undefined,body,c=>c.parent()?.handle!==player.body.handle)
   if(!hit&&(!sweep||sweep.time_of_impact>=1))return {x,y:foot,z}
  }return null
 }
 function cleanFlight(){
  const errors=[],attempt=fn=>{try{fn()}catch(error){errors.push(error)}}
  const unsubscribe=stop;stop=null;attempt(()=>unsubscribe?.());attempt(()=>keyboard?.release());keyboard=null;attempt(()=>cameraLease?.release());cameraLease=null
  const oldController=controller;controller=null;if(oldController)attempt(()=>world.removeCharacterController(oldController))
  const oldBody=body;body=null;collider=null;if(oldBody)attempt(()=>world.removeRigidBody(oldBody))
  if(errors.length)throw new AggregateError(errors,'Flight cleanup failed')
 }
 function requestLanding(){
  const pad=onPad(position)
  const site=pad&&safePad(pad)?pad:landingSite()
  if(!site){setMessage('No safe landing surface below. Find clear, level ground wide enough for the skimmer, then press L.');return false}
  if(site.id==='clear-ground'&&position.y-(site.position[1]+.84)>3){setMessage('Hold L to descend; release to hover. Landing engages near clear, level ground.');return false}
  landingPad=site;state='landing';setMessage('Landing assist engaged. Space cancels landing.');return true
 }
 function dismount(){
  const foot=exitPosition();if(!foot){setMessage('No clear exit beside the skimmer. Stay aboard and choose another landing spot.');return false}
  const from=cameraPose(camera);cleanFlight();state='parked';velocity.set(0,0,0)
  player.body.setTranslation(foot,true);player.body.setNextKinematicTranslation(foot);player.body.setEnabled(true);player.object.position.set(foot.x,foot.y,foot.z);player.object.visible=true;player.setActive(true)
  controls.resume({cameraFrom:from,resetMotion:true});if(personal)try{personal.commit({summoned:true,position:position.toArray(),yaw})}catch(e){setMessage('Dismounted; parking save failed: '+e.message);return true}setMessage('Dismounted safely. Character controls restored.');return true
 }
 function board(){
  if(!canBoard())return false
  if(!landingSite()){setMessage('This parking location is no longer safe.');return false}
  const from=cameraPose(camera);let paused=false
  try{
   controls.pause();paused=true;player.setActive(false);player.object.visible=false;player.body.setEnabled(false)
   body=world.createRigidBody(rapier.RigidBodyDesc.kinematicPositionBased().setTranslation(position.x,position.y,position.z))
   collider=world.createCollider(rapier.ColliderDesc.cuboid(2.2,.8,2.2),body)
   controller=world.createCharacterController(.04);controller.setSlideEnabled(true)
   cameraLease=leaseCamera({camera,sessionId:ownerId+'-skimmer',signal});cameraLease.resume();cameraPosition.copy(from.position);cameraTarget.copy(from.target);cameraLease.update(cameraPosition,cameraTarget)
   keyboard=bindKeyboard({target,sessionId:ownerId+'-skimmer',signal,onMove:value=>{input.x=value.x;input.y=value.y},onAttack:()=>{},onInteract:()=>dismount(),extraKeys:[' ','shift','l'],onKeys:keys=>{
    input.up=keys.includes(' ');input.down=keys.includes('shift')||keys.includes('l');const land=keys.includes('l');if(land&&!landHeld&&state!=='landed')requestLanding();landHeld=land
   },onError})
   state='landed';input={x:0,y:0,up:false,down:false};velocity.set(0,0,0);turn=0;keyboard.resume();stop=host.subscribeFrame(tick)
   requireCondition(typeof stop==='function','FLIGHT_UNAVAILABLE','Flight frame cleanup required');setMessage(FLIGHT_HINT);return true
  }catch(error){
   const failures=[error];try{cleanFlight()}catch(cleanup){failures.push(cleanup)}
   state='parked'
   if(paused&&!signal.aborted){try{player.body.setEnabled(true);player.object.visible=true;player.setActive(true);controls.resume({cameraFrom:from,resetMotion:true})}catch(restore){failures.push(restore)}}
   setMessage('Boarding failed: '+error.message)
   if(failures.length>1)onError(new AggregateError(failures,'Boarding and recovery failed'))
   return false
  }
 }
 function canBoard(){return root.children[0]?.visible!==false&&!closed&&!signal.aborted&&!occupied()&&Math.hypot(player.body.translation().x-position.x,player.body.translation().z-position.z)<=4&&Math.abs(player.body.translation().y-(position.y-.84))<1}
 function tick(delta){
  if(closed||signal.aborted||!body||state==='faulted')return
  try{
   requireCondition(Number.isFinite(delta)&&delta>0&&delta<=.1,'INVALID_FRAME','Bounded flight delta required')
   position.copy(body.translation())
   if(state==='flying'&&landHeld&&!input.up){const ground=groundAt(position.x,position.z);if(ground!==null&&position.y-(ground+.84)<=3)requestLanding()}
   if(state==='landed'&&input.up){state='taking-off';landingPad=null}
   if(state==='landing'&&input.up){state='flying';landingPad=null}
   turn+=(input.x*1.3-turn)*(1-Math.exp(-delta*6));yaw-=turn*delta
   forward.set(Math.sin(yaw),0,Math.cos(yaw))
   const speed=input.y>=0?13:7,targetVelocity=forward.clone().multiplyScalar(state==='landed'?0:input.y*speed)
   targetVelocity.y=state==='landed'?0:input.up?4:input.down?-3:0
   if(state==='taking-off')targetVelocity.y=Math.max(3,targetVelocity.y)
   if(state==='landing'){
    targetVelocity.set(clamp((landingPad.position[0]-position.x)*2,-3,3),clamp((landingPad.position[1]+.84-position.y)*2,-3,0),(clamp((landingPad.position[2]-position.z)*2,-3,3)))
   }
   velocity.lerp(targetVelocity,1-Math.exp(-delta*(input.y?3.2:4.8)))
   const next=position.clone().addScaledVector(velocity,delta)
   next.x=clamp(next.x,FLIGHT_BOUNDS.minX,FLIGHT_BOUNDS.maxX);next.z=clamp(next.z,FLIGHT_BOUNDS.minZ,FLIGHT_BOUNDS.maxZ);next.y=Math.min(FLIGHT_BOUNDS.maxY,next.y)
   // Traffic stays autonomous. Yield before entering its conservative hull
   // envelope; this is an avoidance buffer, not a vehicle damage system.
   if(message==='Holding for ambient traffic')message=FLIGHT_HINT
   const traffic=worldContent?.livingCity?.snapshot().vehicles??[]
   for(const actor of traffic){const p=new Vector3(...actor.position);if(next.distanceTo(p)<8&&next.distanceTo(p)<position.distanceTo(p)){next.copy(position);velocity.set(0,0,0);message='Holding for ambient traffic';break}}
   controller.computeColliderMovement(collider,{x:next.x-position.x,y:next.y-position.y,z:next.z-position.z},rapier.QueryFilterFlags.EXCLUDE_SENSORS,undefined,c=>c.handle!==collider.handle)
   const move=controller.computedMovement();position.add(new Vector3(move.x,move.y,move.z));body.setNextKinematicTranslation(position);root.children[0].position.copy(position);root.children[0].rotation.set(0,yaw,clamp(-turn*.07,-.1,.1))
   if(state==='taking-off'&&position.y>2.8)state='flying'
   if(state==='landing'&&Math.hypot(position.x-landingPad.position[0],position.z-landingPad.position[2])<.15&&Math.abs(position.y-(landingPad.position[1]+.84))<.065){state='landed';velocity.set(0,0,0);message='Landed. E to dismount | Space to take off'}
   desiredCamera.copy(position).addScaledVector(forward,-8);desiredCamera.y+=3.8;desiredLook.copy(position).addScaledVector(forward,2);desiredLook.y+=.5
   const origin=position.clone();origin.y+=.8
   let clearance=cameraClearance(world,rapier,origin,desiredCamera,collider,body,.4)
   if(clearance<.45){desiredCamera.copy(position);desiredCamera.y+=7;clearance=cameraClearance(world,rapier,origin,desiredCamera,collider,body,.4)}
   desiredCamera.lerpVectors(origin,desiredCamera,clearance);cameraPosition.lerp(desiredCamera,1-Math.exp(-delta*5));cameraTarget.lerp(desiredLook,1-Math.exp(-delta*6));cameraLease.update(cameraPosition,cameraTarget)
  }catch(error){state='faulted';try{keyboard?.pause();const fn=stop;stop=null;fn?.();cameraLease?.pause()}finally{setMessage('Flight stopped safely. Return to the main menu to release this attempt.');onError(error)}}
 }
 function personalAction(action){
  live();requireCondition(personal?.snapshot().ready,'CRAFT_UNAVAILABLE','Personal skimmer ownership unavailable');
  if(action==='enter'){requireCondition(board(),'CRAFT_ENTRY_BLOCKED','Approach a safely parked skimmer to enter');return {accepted:true}}
  if(action==='exit'){requireCondition(occupied(),'CRAFT_NOT_OCCUPIED','Not driving');requireCondition(dismount(),'CRAFT_EXIT_BLOCKED','No clear exit');return {accepted:true}}
  requireCondition(!occupied(),'VEHICLE_OCCUPIED','Exit before summoning or dismissing');
  if(action==='dismiss'){personal.commit({summoned:false,position:position.toArray(),yaw});root.children[0].visible=false;onChange();return {accepted:true}}
  requireCondition(action==='summon','INVALID_CRAFT_ACTION','Unknown vehicle action');requireCondition(!root.children[0].visible,'CRAFT_ALREADY_SUMMONED','Personal skimmer already present');
  const p=player.body.translation(),candidates=[[p.x+6,p.y+2,p.z],[p.x-6,p.y+2,p.z],[p.x,p.y+2,p.z+6],...LANDING_PADS.map(pad=>[...pad.position])];let site
  for(const at of candidates){site=landingSite({x:at[0],y:at[1]+2,z:at[2]});if(site)break}
  requireCondition(site,'CRAFT_SPAWN_BLOCKED','Find a clear broad landing area');const next=[site.position[0],site.position[1]+.84,site.position[2]];personal.commit({summoned:true,position:next,yaw});position.set(...next);root.children[0].position.copy(position);root.children[0].visible=true;setMessage('Personal skimmer summoned. Approach and press E.');return {accepted:true}
 }
 function status(){
  live();return {mode:state,position:position.toArray(),velocity:velocity.toArray(),yaw,occupied:occupied(),prompt:occupied()?'Exit skimmer':canBoard()?'Board skimmer':null,message:occupied()?(message===FLIGHT_HINT?message:message+' | '+FLIGHT_HINT):canBoard()?'E to board the sky courier. '+message:''}
 }
 function release(){
  if(closed){if(releaseFailure)throw releaseFailure;return}closed=true;const errors=[],attempt=fn=>{try{fn()}catch(error){errors.push(error)}}
  signal.removeEventListener('abort',abort);attempt(cleanFlight);root.removeFromParent()
  for(const resource of [geometry,material,padGeometry,padMaterial])attempt(()=>resource?.dispose())
  if(errors.length){releaseFailure=new AggregateError(errors,'Player vehicle cleanup failed');throw releaseFailure}
 }
 const abort=()=>{try{release()}catch{/* Exploration cleanup reports retained errors. */}}
 try{
  geometry=createKashiVehicleGeometry('courier');material=new MeshStandardMaterial({vertexColors:true,roughness:.6,metalness:.35,emissive:'#285d68',emissiveIntensity:.18})
  const mesh=new Mesh(geometry,material);mesh.name='player-courier-hull';mesh.position.copy(position);mesh.rotation.y=yaw;root.add(mesh)
  if(personal){const saved=personal.snapshot();mesh.visible=false;if(saved.ready&&saved.summoned&&saved.position){const site=landingSite({x:saved.position[0],y:saved.position[1],z:saved.position[2]});if(site){position.set(saved.position[0],site.position[1]+.84,saved.position[2]);yaw=saved.yaw;mesh.position.copy(position);mesh.rotation.y=yaw;mesh.visible=true}}}
  padGeometry=new RingGeometry(2.7,2.9,24);padMaterial=new MeshBasicMaterial({color:'#d7b679',transparent:true,opacity:.8,depthWrite:false})
  for(const pad of LANDING_PADS){const ring=new Mesh(padGeometry,padMaterial);ring.name='landing-pad-'+pad.id;ring.rotation.x=-Math.PI/2;ring.position.set(pad.position[0],pad.position[1]+.012,pad.position[2]);root.add(ring)}
  host.scene.add(root);signal.addEventListener('abort',abort,{once:true})
  return {ready:true,root,canBoard,occupied,status,personalAction,interact(){live();return {accepted:occupied()?dismount():board(),message}},release}
 }catch(error){try{release()}catch(cleanup){throw new AggregateError([error,cleanup],'Vehicle preparation and cleanup failed')}throw error}
}
