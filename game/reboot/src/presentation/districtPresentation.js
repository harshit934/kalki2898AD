import {Vector3} from 'three'
import {leaseCamera} from '../gameplay/playerBindings.js'
import {requireCondition,deepFreeze} from '../campaign/contracts.js'

export const DISTRICT_SHOTS=deepFreeze([
 {time:0,position:[356,146,224],target:[252,12,58],fov:58,far:520},
 {time:3,position:[252,67,137],target:[212,24,94],fov:46,far:360},
 {time:6,position:[180,18,86],target:[176,4,65],fov:44,far:240},
 {time:9,position:[162,2.23,69.15],target:[162,1.03,65],fov:42,far:180}
])
export function sampleDistrictShot(time,shots=DISTRICT_SHOTS){
 requireCondition(Number.isFinite(time),'INVALID_CAMERA','Finite shot time required')
 const t=Math.min(9,Math.max(0,time)),index=t<3?0:t<6?1:2,a=shots[index],b=shots[index+1],u=(t-a.time)/(b.time-a.time),blend=u*u*u*(10+u*(-15+6*u)),lerp=(x,y)=>blend===0?x:blend===1?y:x+(y-x)*blend
 return {position:a.position.map((v,i)=>lerp(v,b.position[i])),target:a.target.map((v,i)=>lerp(v,b.target[i])),fov:lerp(a.fov,b.fov),far:lerp(a.far,b.far)}
}

// Uses the same exclusive camera lease as normal player controls. No new RAF,
// mission evidence or reward pathway exists here; this runs before exploration.
export function createDistrictPresentation({host,signal,ownerId,shots=DISTRICT_SHOTS,onComplete=()=>{}}){
 requireCondition(!signal.aborted,'WORLD_CANCELLED','Presentation cancelled')
 const camera=leaseCamera({camera:host.camera,sessionId:ownerId,signal});let closed=false,finished=false,stop=null,time=0
 function finish(completed){if(closed)return;stop?.();if(completed){if(finished)return;finished=true;onComplete()}else{closed=true;camera.release();signal.removeEventListener('abort',abort)}}
 const abort=()=>finish(false)
 try{
  camera.resume();camera.project({fov:48,near:.1,far:420})
  const position=new Vector3(),target=new Vector3()
  function pose(){const shot=sampleDistrictShot(time,shots);camera.update(position.fromArray(shot.position),target.fromArray(shot.target));camera.project({fov:shot.fov,near:.1,far:shot.far})}
  pose();stop=host.subscribeAfterPhysics(delta=>{if(closed||signal.aborted)return;time+=delta;pose();if(time>=9)finish(true)})
  signal.addEventListener('abort',abort,{once:true})
  return {skip:()=>{if(closed||finished)return;time=9;pose();finish(true)},release:()=>finish(false)}
 }catch(error){finish(false);throw error}
}
