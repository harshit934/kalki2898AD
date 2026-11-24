import {Group,Mesh,BoxGeometry,OctahedronGeometry,MeshStandardMaterial} from 'three'
import {ACTIVITIES} from './definitions.js'
export function createActivityField({host,world,service,canPlay=()=>true}){
 const def=ACTIVITIES[world],root=new Group();root.name='phase6e-activities-'+world
 const box=new BoxGeometry(1,1,1),gem=new OctahedronGeometry(.42),materials=[],rows=[],body=host.world.createRigidBody(host.rapier.RigidBodyDesc.fixed());let closed=false
 try{
  for(const kind of ['discovery','relay','survey'])for(const [index,at]of (kind==='discovery'?[def.discovery]:def[kind]).entries()){
   const material=new MeshStandardMaterial({color:kind==='relay'?'#e4bc63':kind==='survey'?'#5cb9d5':'#b3e680',emissive:kind==='relay'?'#6a4f13':'#145e65',emissiveIntensity:.6,roughness:.55});materials.push(material)
   const mesh=new Mesh(kind==='discovery'?gem:box,material);mesh.position.set(at[0]-1.15,at[1]+.65,at[2]+1.1);if(kind!=='discovery')mesh.scale.set(.35,1.3,.35);root.add(mesh);mesh.name=kind+'-'+(index+1)
   // Raised geometric pips identify relay order without a new font/texture asset.
   if(kind==='relay')for(let n=0;n<=index;n++){const pip=new Mesh(gem,material);pip.scale.setScalar(.13);pip.position.set(mesh.position.x,at[1]+1.55+n*.17,at[2]+1.1);root.add(pip)}
   const collider=host.world.createCollider(host.rapier.ColliderDesc.cuboid(.18,.65,.18).setSensor(kind==='discovery').setTranslation(mesh.position.x,at[1]+.65,at[2]+1.1),body);rows.push({kind,index,at,mesh,collider})
  }
  host.scene.add(root)
 }catch(e){release();throw e}
 function visible(row,p){const start={x:p.x,y:p.y+1.1,z:p.z},target=row.mesh.position,dx=target.x-start.x,dy=target.y-start.y,dz=target.z-start.z,length=Math.hypot(dx,dy,dz);if(length<.001)return true;const hit=host.world.castRay(new host.rapier.Ray(start,{x:dx/length,y:dy/length,z:dz/length}),length,true,host.rapier.QueryFilterFlags.EXCLUDE_SENSORS|host.rapier.QueryFilterFlags.EXCLUDE_KINEMATIC|host.rapier.QueryFilterFlags.EXCLUDE_DYNAMIC);return !hit||hit.collider.handle===row.collider.handle||hit.timeOfImpact>=length-.1}
 function nearby(p){return rows.filter(row=>Math.hypot(p.x-row.at[0],p.z-row.at[2])<=1.65&&Math.abs(p.y-row.at[1])<=.65)}
 function focus(p){if(closed||!p||!canPlay())return null;const local=nearby(p).filter(row=>visible(row,p));for(const row of local)if(row.kind!=='relay')service.observe({world,kind:row.kind,index:row.index,position:p});const s=service.snapshot(world);for(const row of rows){const done=s.completed.includes(row.kind)||(row.kind==='survey'&&s.survey.includes(row.index));row.mesh.material.emissiveIntensity=done?.08:.7;row.mesh.visible=!(row.kind==='discovery'&&done)}const relay=local.find(row=>row.kind==='relay');return relay&&!s.completed.includes('relay')?{prompt:'Align relay '+(relay.index+1)+' (E)',message:def.title+' · activate 1 → 3 → 2 · '+s.relay+'/3'+(s.error?' · '+s.error:'')}:local.length?{message:def.title+' · discoveries '+s.completed.length+'/3'+(s.error?' · '+s.error:'')}:null}
 function interact(p){if(closed||!p||!canPlay())return {accepted:false};const row=nearby(p).find(r=>r.kind==='relay'&&visible(r,p));return row?service.observe({world,kind:row.kind,index:row.index,position:p,interact:true}):{accepted:false}}
 function release(){if(closed)return;closed=true;root.removeFromParent();host.world.removeRigidBody(body);box.dispose();gem.dispose();materials.forEach(m=>m.dispose())}
 return {root,focus,interact,snapshot:()=>service.snapshot(world),release}
}
