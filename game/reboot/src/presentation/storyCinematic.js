import {Vector3} from 'three'
import {leaseCamera} from '../gameplay/playerBindings.js'
import {cameraClearance} from '../../../src/game/player/cameraCollision.js'
import {requireCondition} from '../campaign/contracts.js'

// Borrows the current scene and frame loop. This director produces no mission
// evidence, reward or persistent state, including when skipped or interrupted.
export function createStoryCinematic({host,signal,ownerId,player,subject,title,text,duration=6,onState=()=>{},onGesture=()=>{},onCue=()=>{}}){
 requireCondition(!signal.aborted&&duration>0&&Number.isFinite(duration),'CINEMATIC_UNAVAILABLE','Live bounded cinematic required')
 const camera=leaseCamera({camera:host.camera,sessionId:ownerId,signal}),start=host.camera.position.clone(),focus=new Vector3(subject.x,subject.y+1.25,subject.z),at=player.body.translation(),away=new Vector3(at.x-subject.x,0,at.z-subject.z)
 if(away.length()<.1)away.set(0,0,1)
 away.normalize()
 const shoulder=new Vector3(away.z,0,-away.x),destination=focus.clone().addScaledVector(away,3.5).addScaledVector(shoulder,1.2);destination.y+=.55
 const target=host.renderer?.domElement?.ownerDocument?.defaultView,keyOptions={capture:true}
 let elapsed=0,closed=false,stop,resolve
 const done=new Promise(r=>{resolve=r})
 function finish(reason){if(closed)return;closed=true;stop?.();target?.removeEventListener('keydown',skipKey,keyOptions);signal.removeEventListener('abort',abort);try{onGesture(false)}finally{camera.release();onState(null);resolve({reason})}}
 const abort=()=>finish('interrupted'),skipKey=event=>{if(event.key==='Escape'&&!event.repeat){event.preventDefault();event.stopImmediatePropagation();finish('skipped')}}
 try{
  camera.resume();camera.project({fov:44,near:.1,far:host.camera.far});onGesture(true);onCue();onState({title,text,duration,elapsed:0})
  stop=host.subscribeFrame(delta=>{if(closed)return;elapsed=Math.min(duration,elapsed+delta);const t=Math.min(1,elapsed/1.2),blend=t*t*(3-2*t),desired=destination.clone().addScaledVector(shoulder,Math.sin(elapsed/duration*Math.PI)*.6),position=start.clone().lerp(desired,blend),clearance=cameraClearance(host.world,host.rapier,focus,position,player.body.collider(0),player.body,.28);position.lerpVectors(focus,position,clearance);camera.update(position,focus);if(elapsed>=duration)finish('completed')})
  signal.addEventListener('abort',abort,{once:true});target?.addEventListener('keydown',skipKey,true)
  return {done,skip:()=>finish('skipped'),release:()=>finish('interrupted'),snapshot:()=>({elapsed,closed,title})}
 }catch(error){finish('failed');throw error}
}
