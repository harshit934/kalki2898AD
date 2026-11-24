import {Group} from 'three'
import {WORLD_CRYSTALS} from './crystalPolicy.js'
import {createCrystalVisual} from './crystalVisuals.js'
export function createWorldCrystalField({host,signal,player,wallet,locationId,canCollect=()=>true}){
 const root=new Group();root.name='phase5g-world-crystals';const rows=WORLD_CRYSTALS.filter(c=>c.locationId===locationId).map(def=>{const visual=createCrystalVisual();visual.object.position.fromArray(def.position);visual.object.name='crystal-'+def.id;root.add(visual.object);return {def,visual}});let closed=false,time=0,retryAt=0
 host.scene.add(root)
 const stop=host.subscribeAfterPhysics(delta=>{if(closed||signal.aborted)return;time+=delta
  for(const {def,visual}of rows){const id='world:'+def.id;visual.object.visible=!wallet.hasReceipt(id);if(!visual.object.visible)continue;visual.object.rotation.y=time;visual.object.position.y=def.position[1]+Math.sin(time*2)*.06
   if(!wallet.snapshot().ready||time<retryAt||!canCollect()||player.isAlive?.()===false||player.isResting?.())continue
   const p=player.body.translation(),at=visual.object.position,dx=at.x-p.x,dy=at.y-(p.y+.9),dz=at.z-p.z,distance=Math.hypot(dx,dy,dz)
   if(distance>=1.25)continue
   const start={x:p.x,y:p.y+1.1,z:p.z},length=Math.hypot(dx,at.y-start.y,dz),hit=length>.0001?host.world.castRay(new host.rapier.Ray(start,{x:dx/length,y:(at.y-start.y)/length,z:dz/length}),length,true,host.rapier.QueryFilterFlags.EXCLUDE_SENSORS,undefined,player.body.collider(0),player.body):null
   if(hit&&hit.timeOfImpact<length-.04)continue
   try{wallet.grant(id);visual.object.visible=false}catch(error){retryAt=time+2;wallet.reportError(error.message)}
  }
 })
 const release=()=>{if(closed)return;closed=true;stop();for(const row of rows)row.visual.release();root.removeFromParent();signal.removeEventListener('abort',release)}
 signal.addEventListener('abort',release,{once:true});return {release}
}
