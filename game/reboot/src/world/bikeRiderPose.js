import {Quaternion,Euler,Vector3} from 'three'

// Per-instance additive procedural animation of the existing approved rig.
// Mixer ownership remains paused while mounted; every bone is restored on exit.
export function createBikeRiderPose(player){
 const specs={LeftUpLeg:[-1.25,0,-.12],RightUpLeg:[-1.25,0,.12],LeftLeg:[1.45,0,0],RightLeg:[1.45,0,0],Spine:[.2,0,0],LeftArm:[-.6,0,-.4],RightArm:[-.6,0,.4],LeftForeArm:[-.7,0,0],RightForeArm:[-.7,0,0]},bones=[]
 for(const [name,rotation]of Object.entries(specs)){const bone=player.object.getObjectByName(name);if(bone)bones.push({bone,base:bone.quaternion.clone(),target:bone.quaternion.clone().multiply(new Quaternion().setFromEuler(new Euler(...rotation)))})}
 player.object.updateMatrixWorld(true);const hip=player.object.getObjectByName('Hips'),hipHeight=hip?hip.getWorldPosition(new Vector3()).y-player.object.position.y:1
 return {hipHeight,update(blend){for(const b of bones)b.bone.quaternion.copy(b.base).slerp(b.target,Math.max(0,Math.min(1,blend)))},release(){for(const b of bones)b.bone.quaternion.copy(b.base)},boneCount:bones.length}
}
