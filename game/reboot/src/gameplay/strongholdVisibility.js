import {Box3,Frustum,Matrix4,Vector3} from 'three'

// A deployment is permitted only outside the current view, or behind existing
// solid geometry. Actor visibility never changes after insertion to hide a pop.
export function hiddenStrongholdSpawn({host,position,player,heavy=false}){
 if(Math.hypot(position[0]-player.x,position[2]-player.z)<6)return false
 const camera=host.camera;if(!camera?.isCamera)return false
 camera.updateMatrixWorld(true)
 const radius=heavy?.85:.6,height=heavy?3:2.5
 const bounds=new Box3(new Vector3(position[0]-radius,position[1],position[2]-radius),new Vector3(position[0]+radius,position[1]+height,position[2]+radius))
 const frustum=new Frustum().setFromProjectionMatrix(new Matrix4().multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse))
 if(!frustum.intersectsBox(bounds))return true
 const origin=camera.getWorldPosition(new Vector3()),points=[bounds.getCenter(new Vector3())]
 for(const x of [bounds.min.x,bounds.max.x])for(const y of [bounds.min.y,bounds.max.y])for(const z of [bounds.min.z,bounds.max.z])points.push(new Vector3(x,y,z))
 return points.every(p=>{const direction=p.clone().sub(origin),distance=direction.length();direction.normalize();const hit=host.world.castRay(new host.rapier.Ray(origin,direction),distance,true,host.rapier.QueryFilterFlags.EXCLUDE_SENSORS,undefined,undefined,undefined,c=>!c.parent()||c.parent().isFixed());return hit&&hit.timeOfImpact<distance-.1})
}
