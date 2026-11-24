import {leaseCamera} from '../gameplay/playerBindings.js'
import {cameraClearance} from '../../../src/game/player/cameraCollision.js'
import {requireCondition} from '../campaign/contracts.js'
import {storyShot} from './storyShots.js'
import {dialogueId} from '../audio/dialoguePlayback.js'

// Borrows the current scene and frame loop. This director produces no mission
// evidence, reward or persistent state, including when skipped or interrupted.
export function createStoryCinematic({host,signal,ownerId,player,subject,title,text,kind='dialogue',duration=6,readDialogue=()=>null,onState=()=>{},onGesture=()=>{},onCue=()=>{}}){
 requireCondition(!signal.aborted&&duration>0&&Number.isFinite(duration),'CINEMATIC_UNAVAILABLE','Live bounded cinematic required')
 const camera=leaseCamera({camera:host.camera,sessionId:ownerId,signal}),start=host.camera.position.clone(),at=player.body.translation()
 const target=host.renderer?.domElement?.ownerDocument?.defaultView,keyOptions={capture:true}
 let elapsed=0,closed=false,stop,resolve,lastPublish=0,performance
 const done=new Promise(r=>{resolve=r})
 function finish(reason){if(closed)return;closed=true;stop?.();target?.removeEventListener('keydown',skipKey,keyOptions);signal.removeEventListener('abort',abort);try{performance?.();onGesture(false)}finally{camera.release();onState(null);resolve({reason})}}
 const abort=()=>finish('interrupted'),skipKey=event=>{if(event.key==='Escape'&&!event.repeat){event.preventDefault();event.stopImmediatePropagation();finish('skipped')}}
 try{
  camera.resume();camera.project({fov:kind==='boss'?49:44,near:.1,far:host.camera.far});performance=player.presentAction?.(kind==='finisher'?'Sword slash':'Sword idle (guard)');onGesture(true);onCue();onState({title,text,kind,duration,elapsed:0,shot:storyShot(kind,0,subject,at).label})
  stop=host.subscribeFrame(delta=>{if(closed)return;elapsed=Math.min(duration+30,elapsed+Math.max(0,Math.min(.1,delta)));const shot=storyShot(kind,elapsed/duration,subject,at),t=Math.min(1,elapsed/.8),blend=t*t*(3-2*t),position=start.clone().lerp(shot.position,blend),clearance=cameraClearance(host.world,host.rapier,shot.look,position,player.body.collider(0),player.body,.28);position.lerpVectors(shot.look,position,clearance);camera.update(position,shot.look);if(elapsed-lastPublish>=.1){lastPublish=elapsed;onState({title,text,kind,duration,elapsed,shot:shot.label})}const voice=readDialogue(),speaking=voice?.id===dialogueId(title,text)&&['playing','loading','paused'].includes(voice.state);if(elapsed>=duration&&(!speaking||elapsed>=duration+30))finish('completed')})
  signal.addEventListener('abort',abort,{once:true});target?.addEventListener('keydown',skipKey,true)
  return {done,skip:()=>finish('skipped'),release:()=>finish('interrupted'),snapshot:()=>({elapsed,closed,title})}
 }catch(error){finish('failed');throw error}
}
