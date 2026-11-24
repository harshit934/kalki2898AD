import {Group,BoxGeometry,SphereGeometry,MeshStandardMaterial,InstancedMesh,Matrix4,Quaternion,Vector3,Euler,Color} from 'three'
import {resolveLocationSpawn} from '../locations/spawn.js'
import {LOCATION_DEFINITIONS} from '../locations/definitions.js'

function initialPoint(points,fraction){
 const lengths=points.map((p,i)=>Math.hypot(points[(i+1)%points.length][0]-p[0],points[(i+1)%points.length][2]-p[2]));let d=lengths.reduce((a,b)=>a+b,0)*fraction
 for(let i=0;i<points.length;i++){if(d<=lengths[i]){const a=points[i],b=points[(i+1)%points.length],t=d/lengths[i];return {position:[a[0]+(b[0]-a[0])*t,a[1],a[2]+(b[2]-a[2])*t],next:(i+1)%points.length}}d-=lengths[i]}
 throw Error('Invalid pedestrian route')
}
export function createPopulation({host,profile,readPlayer=()=>null}){
 const {world,rapier:R}=host,root=new Group();root.name=profile.groupId??'phase6d-population-'+profile.id
 const actors=[],ownedBodies=[],ownedControllers=[],geometry=new BoxGeometry(1,1,1),headGeometry=new SphereGeometry(1,8,6),material=new MeshStandardMaterial({roughness:.9}),count=profile.roles.reduce((n,role)=>n+(role.count??3),0),bodyMesh=new InstancedMesh(geometry,material,count*5),heads=new InstancedMesh(headGeometry,material,count),matrix=new Matrix4(),quaternion=new Quaternion(),headQuaternion=new Quaternion(),euler=new Euler(),v=new Vector3(),scale=new Vector3();let closed=false,time=0
 bodyMesh.name='moving-role-humanoids';heads.name='pedestrian-heads';root.add(bodyMesh,heads)
 try{
  for(const role of profile.roles)for(let i=0;i<(role.count??3);i++){
   const start=initialPoint(role.points,i/(role.count??3)),position=resolveLocationSpawn({host,location:LOCATION_DEFINITIONS.find(d=>d.id===profile.id),position:start.position}),body=world.createRigidBody(R.RigidBodyDesc.kinematicPositionBased().setTranslation(...position));ownedBodies.push(body);body.userData={populationOwner:root.name,roleId:role.id}
   const collider=world.createCollider(R.ColliderDesc.capsule(.5,.24).setTranslation(0,.74,0).setSensor(true),body),controller=world.createCharacterController(.025);ownedControllers.push(controller)
   controller.enableAutostep(.25,.2,false);controller.enableSnapToGround(.25)
   const actor={id:profile.id+'-'+role.id+'-'+i,role:role.id,definition:role,body,collider,controller,next:start.next,wait:0,vertical:0,state:'walking',yaw:0,distance:0,held:false,override:null,once:false,atGoal:false};actors.push(actor)
   for(let k=0;k<5;k++)bodyMesh.setColorAt((actors.length-1)*5+k,new Color(role.color));heads.setColorAt(actors.length-1,new Color(role.skin??'#b99778'))
  }
  const draw=()=>{for(const [i,a]of actors.entries()){
   const p=a.body.translation(),swing=a.state==='walking'?Math.sin(time*(a.definition.gaitRate??7)+a.distance)*.4:a.state==='talking'?Math.sin(time*3)*.18:0
   const put=(j,dx,y,dz,sx,sy,sz,angle=0)=>{const x=p.x+dx*Math.cos(a.yaw)+dz*Math.sin(a.yaw),z=p.z-dx*Math.sin(a.yaw)+dz*Math.cos(a.yaw);quaternion.setFromEuler(euler.set(angle,a.yaw,0));matrix.compose(v.set(x,p.y+y,z),quaternion,scale.set(sx,sy,sz));bodyMesh.setMatrixAt(i*5+j,matrix)}
   put(0,0,.98,0,.42,.58,.25);put(1,-.12,.38,0,.14,.7,.15,swing);put(2,.12,.38,0,.14,.7,.15,-swing);put(3,-.29,.94,0,.12,.6,.12,-swing);put(4,.29,.94,0,.12,.6,.12,swing)
   matrix.compose(v.set(p.x,p.y+1.45,p.z),headQuaternion,scale.set(.19,.23,.19));heads.setMatrixAt(i,matrix)
  }bodyMesh.instanceMatrix.needsUpdate=true;heads.instanceMatrix.needsUpdate=true;bodyMesh.computeBoundingSphere();heads.computeBoundingSphere()}
  function hasNearbyPeer(index,p){for(let i=0;i<index;i++){const q=actors[i].body.translation();if(Math.hypot(q.x-p.x,q.z-p.z)<.9)return true}return false}
  function tick(delta,active=true){if(closed)return;time+=active?delta:0
   for(const [index,a]of actors.entries()){
    const p=a.body.translation();if(!active){a.body.setNextKinematicTranslation(p);a.vertical=0;continue}
    if(a.held){a.state=a.holdState??'waiting';a.body.setNextKinematicTranslation(p);continue}
    if(a.wait>0){a.wait-=delta;a.state=a.role==='security'||a.role==='warden'||a.role==='guardian'?'watching':'inspecting';a.body.setNextKinematicTranslation(p);continue}
    const points=a.override??a.definition.points,goal=points[a.next],dx=goal[0]-p.x,dz=goal[2]-p.z,d=Math.hypot(dx,dz)
    if(d<.2){if(a.once&&a.next===points.length-1){a.held=true;a.atGoal=true;a.state='waiting'}else a.next=(a.next+1)%points.length;a.wait=a.override?0:a.definition.dwell;a.body.setNextKinematicTranslation(p);continue}
    const player=readPlayer(),nearPlayer=player&&Math.hypot(player.x-p.x,player.z-p.z)<1.25&&(!a.override||dx*(player.x-p.x)+dz*(player.z-p.z)>0),nearPeer=hasNearbyPeer(index,p)
    if(nearPlayer||nearPeer){a.state='yielding';a.body.setNextKinematicTranslation(p);continue}
    const step=Math.min(d,a.definition.speed*delta);a.vertical=a.controller.computedGrounded()?-.5:Math.max(-8,a.vertical-19*delta)
    a.controller.computeColliderMovement(a.collider,{x:dx/d*step,y:a.vertical*delta,z:dz/d*step},R.QueryFilterFlags.EXCLUDE_SENSORS|R.QueryFilterFlags.EXCLUDE_KINEMATIC|R.QueryFilterFlags.EXCLUDE_DYNAMIC,undefined,c=>c.handle!==a.collider.handle)
    const m=a.controller.computedMovement();a.body.setNextKinematicTranslation({x:p.x+m.x,y:p.y+m.y,z:p.z+m.z});a.yaw=Math.atan2(dx,dz);a.state=Math.hypot(m.x,m.z)<step*.2?'blocked':'walking';a.distance+=Math.hypot(m.x,m.z)
   }
  }
  const snapshot=()=>actors.map(a=>({id:a.id,role:a.role,state:a.state,position:{...a.body.translation()},distance:a.distance,next:a.next,atGoal:a.atGoal}))
  host.scene.add(root);draw()
  return {root,tick,draw,snapshot,release,control(id,command){const a=actors.find(row=>row.id===id);if(!a||closed)throw Error('Story actor not owned');if(command.points){if(!Array.isArray(command.points)||command.points.length<1||command.points.length>128||!command.points.every(p=>Array.isArray(p)&&p.length===3&&p.every(Number.isFinite)))throw Error('Valid actor route required');a.override=command.points.map(p=>[...p]);a.next=0;a.once=Boolean(command.once);a.wait=0;a.atGoal=false}if(typeof command.hold==='boolean')a.held=command.hold;if(command.state)a.holdState=command.state}}
 }catch(e){release();throw e}
 function release(){if(closed)return;closed=true;root.removeFromParent();for(const controller of ownedControllers)world.removeCharacterController(controller);for(const body of ownedBodies)world.removeRigidBody(body);bodyMesh.dispose();heads.dispose();geometry.dispose();headGeometry.dispose();material.dispose()}
}
