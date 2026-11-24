const identity={x:0,y:0,z:0,w:1}
// Query only real static architecture. No new floor, body, teleport or save state.
export function findSkimmerLanding({world,rapier,position,bounds,ignoredBodies=[]}){
 if(![position.x,position.y,position.z].every(Number.isFinite))return null
 const half=2.2,padding=.08
 if(position.x-half-padding<bounds.minX||position.x+half+padding>bounds.maxX||position.z-half-padding<bounds.minZ||position.z+half+padding>bounds.maxZ)return null
 const fixed=c=>c.parent()?.isFixed()&&!ignoredBodies.includes(c.parent().handle)
 const heightAt=(x,z)=>{const ray=new rapier.Ray({x,y:position.y+.2,z},{x:0,y:-1,z:0}),hit=world.castRayAndGetNormal(ray,position.y+30,true,rapier.QueryFilterFlags.EXCLUDE_SENSORS,undefined,undefined,undefined,fixed);return hit&&hit.normal.y>.95?ray.origin.y-hit.timeOfImpact:null}
 world.propagateModifiedBodyPositionsToColliders()
 const height=heightAt(position.x,position.z);if(height===null||height+.84>position.y+.08)return null
 for(const dx of [-half,0,half])for(const dz of [-half,0,half]){const sample=heightAt(position.x+dx,position.z+dz);if(sample===null||Math.abs(sample-height)>.06)return null}
 const center={x:position.x,y:height+.84,z:position.z},shape=new rapier.Cuboid(half,.8,half)
 if(world.intersectionWithShape(center,identity,shape,rapier.QueryFilterFlags.EXCLUDE_SENSORS,undefined,undefined,undefined,fixed))return null
 return {id:'clear-ground',position:[position.x,height,position.z]}
}
