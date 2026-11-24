import {Vector3} from 'three'
import {cameraEscapeOffsets} from '../../../src/game/player/cameraCollision.js'
import {CAMERA_QUERY_GROUPS} from '../../../src/game/collisionGroups.js'

const identity={x:0,y:0,z:0,w:1},minimumBoom=1.65
// A stateful placement filter on the existing camera, not a second rig or loop.
// Requested orbit angles remain owned by thirdPersonFollow.
export function createCameraPlacement({world,rapier,camera,player}){
 let previous=null,lastMode=null,diagnostic=null,recovering=false
 const collider=player.body.collider(0)
 function solve(position,requested,delta,target=null){
  const origin=new Vector3(position.x,position.y+1.3,position.z),wanted=requested.clone().sub(origin)
  const near=camera.near,tangent=Math.tan(camera.fov*Math.PI/360)
  const radius=Math.max(.45,Math.hypot(near,near*tangent,near*tangent*camera.aspect)+.05),ball=new rapier.Ball(radius)
  const bodyPosition=player.body.translation(),center=new Vector3().copy(collider.translation()).add(new Vector3(position.x-bodyPosition.x,position.y-bodyPosition.y,position.z-bodyPosition.z))
  const shape=collider.shape,actorRadius=shape.radius,halfHeight=shape.halfHeight??0
  if(!Number.isFinite(actorRadius)||![...requested.toArray(),radius,delta].every(Number.isFinite)||delta<=0)throw new Error('CAMERA_CLEARANCE_UNAVAILABLE: invalid collision inputs')
  const axis=new Vector3(0,halfHeight,0).applyQuaternion(collider.rotation()),low=center.clone().sub(axis),high=center.clone().add(axis),segment=high.clone().sub(low)
  const actorClearance=point=>{const t=segment.lengthSq()?Math.max(0,Math.min(1,point.clone().sub(low).dot(segment)/segment.lengthSq())):0;return point.distanceTo(low.clone().addScaledVector(segment,t))-actorRadius-radius}
  // Enemy capsules govern combat/movement, not camera placement. A crowd at a
  // doorway must not seal every boom direction and stop the mission frame host.
  // Architecture stays solid; Bhairava retains the separate capsule clearance.
  const filter=c=>!c.parent()?.userData?.cameraActor
  // A valid player capsule can stand beside low furniture that overlaps the
  // larger camera sphere at chest height. Start its sweep from a clear point
  // within the upper torso/head range, without moving the actor or aim target.
  const overlaps=point=>world.intersectionWithShape(point,identity,ball,rapier.QueryFilterFlags.EXCLUDE_SENSORS,CAMERA_QUERY_GROUPS,collider,player.body,filter)
  if(overlaps(origin))for(const lift of [.3,.45,.6]){
   const candidate=new Vector3(position.x,position.y+1.3+lift,position.z)
   if(!overlaps(candidate)){origin.copy(candidate);break}
  }
  const sweep=(from,to)=>world.castShape(from,identity,to.clone().sub(from),ball,.03,1,false,rapier.QueryFilterFlags.EXCLUDE_SENSORS,CAMERA_QUERY_GROUPS,collider,player.body,filter)
  const safe=point=>{if(point.distanceTo(origin)<minimumBoom||actorClearance(point)<.08||world.intersectionWithShape(point,identity,ball,rapier.QueryFilterFlags.EXCLUDE_SENSORS,CAMERA_QUERY_GROUPS,collider,player.body,filter))return false;const hit=sweep(origin,point);return !hit||hit.time_of_impact>=.999}
  const project=point=>{const hit=sweep(origin,point),fraction=hit?Math.max(0,Math.min(1,hit.time_of_impact-.025)):1;return {point:origin.clone().lerp(point,fraction),hit}}
  const direct=project(requested)
  let selected=safe(direct.point)&&direct.point.distanceTo(origin)>=2.25?{point:direct.point,id:'requested'}:null
  if(!selected){
   const yaw=Math.atan2(wanted.x,wanted.z),distance=Math.max(minimumBoom,wanted.length()),pitch=Math.atan2(wanted.y,Math.hypot(wanted.x,wanted.z)),candidates=[]
   const add=(point,id)=>{const projected=project(point).point;if(safe(projected)){const cost=projected.distanceToSquared(requested)+.45*(previous?projected.distanceToSquared(previous):0)-(lastMode===id ? .5 : 0);candidates.push({point:projected,id,cost})}}
   // Try elevation without reversing the user's requested horizontal orbit.
   for(const lift of [.3,.6]){const a=Math.min(1.2,pitch+lift);add(origin.clone().add(new Vector3(Math.sin(yaw)*Math.cos(a),Math.sin(a),Math.cos(yaw)*Math.cos(a)).multiplyScalar(distance)),'lift-'+lift)}
   // Reuse the established shoulder/high-lift escape positions in camera space.
   for(const [index,[x,y,z]]of cameraEscapeOffsets(Math.hypot(wanted.x,wanted.z),1.8).entries())add(origin.clone().add(new Vector3(x*Math.cos(yaw)+z*Math.sin(yaw),y,-x*Math.sin(yaw)+z*Math.cos(yaw))),'shoulder-'+index)
   for(const angle of [Math.PI/6,Math.PI/3,Math.PI/2,2*Math.PI/3,5*Math.PI/6,Math.PI])for(const sign of [-1,1]){
    const a=yaw+sign*angle
    add(origin.clone().add(new Vector3(Math.sin(a)*Math.cos(pitch),Math.sin(pitch),Math.cos(a)*Math.cos(pitch)).multiplyScalar(distance)),'orbit-'+angle*sign)
   }
   candidates.sort((a,b)=>a.cost-b.cost||a.id.localeCompare(b.id));selected=candidates[0]
  }
  // No solution is preferable to silently rendering inside actor/wall geometry.
  if(!selected)throw new Error('CAMERA_CLEARANCE_UNAVAILABLE: no collision-clear third-person placement '+JSON.stringify({origin:origin.toArray(),radius,overlap:overlaps(origin)?.translation(),direct:direct.point.toArray()}))
  const constrained=Boolean(direct.hit)||selected.id!=='requested';if(constrained)recovering=true
  let result=selected.point
  if(previous&&safe(previous)&&(constrained||recovering)){
   const restoring=selected.id==='requested',step=Math.min(delta,.1),alpha=1-Math.exp(-(restoring?5:16)*step)
   const from=previous.clone().sub(origin),to=result.clone().sub(origin),fromYaw=Math.atan2(from.x,from.z),difference=Math.atan2(Math.sin(Math.atan2(to.x,to.z)-fromYaw),Math.cos(Math.atan2(to.x,to.z)-fromYaw))
   const yaw=fromYaw+Math.max(-4*step,Math.min(4*step,difference*alpha)),fromPitch=Math.atan2(from.y,Math.hypot(from.x,from.z)),pitch=fromPitch+Math.max(-2.5*step,Math.min(2.5*step,(Math.atan2(to.y,Math.hypot(to.x,to.z))-fromPitch)*alpha)),distance=from.length()+(to.length()-from.length())*alpha
   const smooth=origin.clone().add(new Vector3(Math.sin(yaw)*Math.cos(pitch),Math.sin(pitch),Math.cos(yaw)*Math.cos(pitch)).multiplyScalar(distance))
   const environment=sweep(previous,smooth),self=world.castShape(previous,identity,smooth.clone().sub(previous),ball,0,1,true,rapier.QueryFilterFlags.EXCLUDE_SENSORS,undefined,undefined,undefined,c=>c.handle===collider.handle)
   if(safe(smooth)&&(!environment||environment.time_of_impact>=1)&&(!self||self.time_of_impact>=1))result=smooth
   else {
    // Slide along a blocking surface instead of permanently holding at a jamb.
    // Native contact normals are local to the hit collider; convert them before
    // removing the inward component. Every slide is swept and revalidated.
    const contact=environment??self,normal=contact?.normal1
    let slid=null
    if(normal){
     const n=new Vector3().copy(normal);if(contact.collider)n.applyQuaternion(contact.collider.rotation());n.normalize()
     const travel=smooth.clone().sub(previous);travel.addScaledVector(n,-travel.dot(n))
     const candidate=previous.clone().add(travel),wall=sweep(previous,candidate),actor=world.castShape(previous,identity,travel,ball,0,1,true,rapier.QueryFilterFlags.EXCLUDE_SENSORS,undefined,undefined,undefined,c=>c.handle===collider.handle)
     if(travel.lengthSq()>1e-10&&safe(candidate)&&(!wall||wall.time_of_impact>=1)&&(!actor||actor.time_of_impact>=1))slid=candidate
    }
    result=slid??previous.clone()
   }
  }
  if(!safe(result))throw new Error('CAMERA_CLEARANCE_UNAVAILABLE: unsafe final position')
  if(!constrained&&result.distanceTo(selected.point)<.01)recovering=false
  previous=result.clone();lastMode=selected.id
  const hit=direct.hit?.collider,hitShape=hit?.shape
  diagnostic={heading:Math.atan2(result.x-(target?.x??origin.x),result.z-(target?.z??origin.z)),player:{...position},camera:result.toArray(),requested:requested.toArray(),blockedProjection:direct.point.toArray(),boom:result.distanceTo(origin),actorClearance:actorClearance(result),radius,mode:selected.id,capsule:{center:center.toArray(),halfHeight,radius:actorRadius},obstacle:hit?{handle:hit.handle,position:hit.translation(),halfExtents:hitShape.halfExtents??null}:null}
  return result
 }
 return {solve,heading:()=>diagnostic?.heading??null,reset(){previous=null;lastMode=null;diagnostic=null;recovering=false},snapshot:()=>diagnostic}
}
