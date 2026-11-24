import {MathUtils,Vector3} from 'three'

// Reuses the original BujjiCompanion shoulder orbit/damping without importing
// its legacy global combat stores or adding another frame owner.
export function followBujji(object,player,camera,time,delta){
 const dt=Math.min(delta,1/30),forward=new Vector3(player.x-(camera?.position.x??player.x),0,player.z-(camera?.position.z??player.z+4.15)).normalize(),right=new Vector3(-forward.z,0,forward.x),orbit=Math.sin(time*.55)*.34
 const target=new Vector3(player.x+right.x*(1.18+orbit)-forward.x*.55,player.y+2.28+Math.sin(time*2.8)*.12,player.z+right.z*(1.18+orbit)-forward.z*.55)
 object.position.x=MathUtils.damp(object.position.x,target.x,3.8,dt);object.position.y=MathUtils.damp(object.position.y,target.y,4.5,dt);object.position.z=MathUtils.damp(object.position.z,target.z,3.8,dt)
 object.scale.setScalar(MathUtils.damp(object.scale.x,.4,3.8,dt))
 const yaw=Math.atan2(player.x-object.position.x,player.z-object.position.z)
 object.rotation.y+=Math.atan2(Math.sin(yaw-object.rotation.y),Math.cos(yaw-object.rotation.y))*(1-Math.exp(-4*dt));object.rotation.z=Math.sin(time*1.2)*.045
 object.visible=true
}
