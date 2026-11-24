import {requireCondition} from '../../campaign/contracts.js'
import {containsPosition,finitePosition} from './definitions.js'
// Queries the existing Rapier world. Never creates a world, body or controller.
export function resolveLocationSpawn({host,location,position,profile={halfHeight:.55,radius:.34,offsetY:.89}}){
 requireCondition(containsPosition(location,position),'LOCATION_BOUNDARY','Spawn lies outside this location');requireCondition(host?.world?.castRayAndGetNormal&&host.world.intersectionWithShape&&host.rapier?.Capsule,'LOCATION_COLLISION_UNAVAILABLE','Existing collision host required');requireCondition([profile.halfHeight,profile.radius,profile.offsetY].every(v=>Number.isFinite(v)&&v>0),'INVALID_LOCATION_PROFILE','Finite player capsule required')
 const {world,rapier}=host,ray=new rapier.Ray({x:position[0],y:position[1]+.45,z:position[2]},{x:0,y:-1,z:0}),fixed=[]
 world.propagateModifiedBodyPositionsToColliders();world.forEachCollider(c=>{if(c.parent()?.isFixed()&&!c.isSensor())fixed.push(c)})
 let hit=null;for(const c of fixed){const next=c.castRayAndGetNormal(ray,1,true);if(next&&(!hit||next.timeOfImpact<hit.timeOfImpact))hit=next}

 requireCondition(hit,'LOCATION_GROUND_UNAVAILABLE','No static support near spawn');requireCondition(hit.normal.y>=.65,'LOCATION_SPAWN_BLOCKED','Surface is not walkable');const y=ray.origin.y-hit.timeOfImpact,center={x:position[0],y:y+profile.halfHeight+profile.radius+.035,z:position[2]},shape=new rapier.Capsule(profile.halfHeight,profile.radius)
 requireCondition(!fixed.some(c=>c.intersectsShape(shape,center,{x:0,y:0,z:0,w:1})),'LOCATION_SPAWN_BLOCKED','Player capsule overlaps architecture');const result=[position[0],y-(profile.offsetY-profile.halfHeight-profile.radius),position[2]];requireCondition(finitePosition(result),'INVALID_LOCATION_POSITION','Invalid resolved spawn');return result
}
