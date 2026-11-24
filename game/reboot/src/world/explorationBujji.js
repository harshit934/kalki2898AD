import {MISSION1_ASSETS} from '../content/mission1.js'
import {createMission1Loader,disposeMission1Asset} from '../gameplay/mission1Environment.js'
import {followBujji} from '../gameplay/bujjiFollow.js'

// The original companion model and follow behavior, owned by one explorer.
export async function createExplorationBujji({host,signal,player,vehicle,loadAsset}){
 let loader,object,stop,closed=false,time=0
 function release(){if(closed)return;closed=true;signal.removeEventListener('abort',release);stop?.();object?.removeFromParent();if(object)disposeMission1Asset(object);loader?.release()}
 signal.addEventListener('abort',release,{once:true})
 try{
  if(signal.aborted){release();return {release}}
  if(!loadAsset)loader=createMission1Loader()
  const asset=await (loadAsset??loader.load)(MISSION1_ASSETS.bujji)
  if(closed||signal.aborted){if(asset?.scene)disposeMission1Asset(asset.scene);release();return {release}}
  object=asset?.scene
  if(!object?.isObject3D)throw new Error('Original Bujji model unavailable')
  const start=player.body.translation();object.position.set(start.x+1.2,start.y+2.28,start.z);object.scale.setScalar(.4);object.name='exploration-bujji';host.scene.add(object)
  stop=host.subscribeAfterPhysics(delta=>{if(closed||signal.aborted)return;time+=delta;const craft=vehicle?.status();const p=craft?.occupied?{x:craft.position[0],y:craft.position[1],z:craft.position[2]}:player.body.translation();followBujji(object,p,host.camera,time,delta)})
  return {release}
 }catch(error){release();throw error}
}
