import {Group,BufferGeometry,Float32BufferAttribute,Points,PointsMaterial,Mesh,MeshBasicMaterial,TorusGeometry,OctahedronGeometry,PlaneGeometry,InstancedMesh,Matrix4,Vector3,Quaternion,AdditiveBlending,DoubleSide} from 'three'
const BUDGET=128
export const EFFECT_PROFILES=Object.freeze({
 kashi:{particle:'#d8bd88',event:'Riverfront lantern release',anchor:[256,14,354],period:180,duration:16},
 shambala:{particle:'#daeaf3',event:'Palace aurora convergence',anchor:[280,86,104],period:180,duration:20},
 complex:{particle:'#9dd9e4',event:'Reactor energy circulation',anchor:[118,28,-154],period:180,duration:14}
})
// One bounded geometry buffer per world, no new texture/model, RAF or timer.
// Effects borrow the live world's clock and never move the player or alter physics.
export function createWorldEffects({host,world,environment,readPlayer=()=>null}){
 const profile=EFFECT_PROFILES[world],root=new Group();root.name='phase6f-effects-'+world
 const arrays=new Float32Array(BUDGET*3),geometry=new BufferGeometry();geometry.setAttribute('position',new Float32BufferAttribute(arrays,3))
 const material=new PointsMaterial({color:profile.particle,size:world==='shambala'?.12:.08,transparent:true,opacity:.4,depthWrite:false}),particles=new Points(geometry,material);particles.name='bounded-local-weather';particles.visible=false;root.add(particles)
 const geometries=[geometry],materials=[material],meshes=[],matrix=new Matrix4(),position=new Vector3(),scale=new Vector3(1,1,1),rotation=new Quaternion();let closed=false,eventActive=false,phase=0,weather='clear',roof=false,checkRoof=0,lastTime=null
 function mesh(g,m,name,at){geometries.push(g);materials.push(m);const object=new Mesh(g,m);object.name=name;object.position.fromArray(at);root.add(object);meshes.push(object);return object}
 const glow=color=>new MeshBasicMaterial({color,transparent:true,opacity:.4,depthWrite:false,blending:AdditiveBlending,side:DoubleSide})
 let lanterns,lanternGeometry,lanternMaterial
 try{
  if(world==='kashi'){
   lanternGeometry=new OctahedronGeometry(.3);lanternMaterial=glow('#ffd28a');geometries.push(lanternGeometry);materials.push(lanternMaterial);lanterns=new InstancedMesh(lanternGeometry,lanternMaterial,12);lanterns.name='ceremonial-floating-lanterns';root.add(lanterns)
   const water=mesh(new PlaneGeometry(36,132,12,24),glow('#78b7af'),'river-current-shimmer',[395,-2.278,245]);water.rotation.x=-Math.PI/2;water.material.opacity=.035
  }else if(world==='shambala'){
   for(let i=0;i<3;i++){const arc=mesh(new TorusGeometry(24+i*5,.12,4,64,Math.PI*1.5),glow(i%2?'#c8b9f5':'#69d4c6'),'high-palace-aurora-'+i,[280,86+i*3,104]);arc.rotation.set(.4,0,i*.3);arc.scale.y=.3}
   const mist=mesh(new PlaneGeometry(12,8),glow('#a9d7da'),'cascade-spray',[330,6,166]);mist.material.opacity=.045
  }else{
   for(let i=0;i<3;i++){const halo=mesh(new TorusGeometry(10+i*.6,.12,6,48),glow(i%2?'#ffd5a4':'#7bdadf'),'grand-reactor-energy-'+i,[118,8+i*8,-154]);halo.rotation.x=Math.PI/2}
   const halo=mesh(new TorusGeometry(4.1,.08,6,40),glow('#7bdadf'),'original-reactor-energy',[118,8.7,-60]);halo.rotation.x=Math.PI/2
  }
  host.scene.add(root)
 }catch(error){release();throw error}
 function update(delta,active=true){if(closed||!active)return;const state=environment.snapshot(),time=state.seconds;weather=state.weather;phase=time%profile.period;eventActive=phase<profile.duration;const p=readPlayer()??{x:profile.anchor[0],y:0,z:profile.anchor[2]}
  checkRoof-=delta;if(checkRoof<=0){checkRoof=.5;const hit=host.world.castRay(new host.rapier.Ray({x:p.x,y:p.y+1.9,z:p.z},{x:0,y:1,z:0}),150,true,host.rapier.QueryFilterFlags.EXCLUDE_SENSORS|host.rapier.QueryFilterFlags.EXCLUDE_KINEMATIC|host.rapier.QueryFilterFlags.EXCLUDE_DYNAMIC);roof=Boolean(hit)}
  particles.visible=weather!=='clear'&&!roof;material.opacity=weather==='mist'||weather==='haze'?.13:.45;material.size=weather==='mist'||weather==='smog'||weather==='haze'?.7:world==='shambala'?.12:.08
  if(particles.visible){for(let i=0;i<BUDGET;i++){const n=i*3,fall=world==='shambala'?.8:weather==='ion-drizzle'?5:.24;arrays[n]=p.x+((i*13.37+time*.9)%32)-16;arrays[n+1]=p.y+2+((i*7.13-time*fall)%14+14)%14;arrays[n+2]=p.z+((i*19.71+Math.sin(time*.1+i))%32+32)%32-16}geometry.attributes.position.needsUpdate=true;geometry.computeBoundingSphere()}
  const eventGlow=eventActive?Math.sin(Math.PI*phase/profile.duration)**2:0
  for(let i=0;i<meshes.length;i++){const object=meshes[i];if(object.name==='river-current-shimmer'){object.material.opacity=.025+.02*(.5+.5*Math.sin(time*.8));object.position.y=-2.278+Math.sin(time*.6)*.003}else if(object.name==='cascade-spray')object.material.opacity=.04+.03*(.5+.5*Math.sin(time));else{object.material.opacity=.18+eventGlow*.45;object.rotation.z=Math.sin(time*.14+i)*.25;if(world==='shambala')object.rotation.y=time*.01+i*.3}}
  if(lanterns){lanterns.visible=eventActive;for(let i=0;i<12;i++){const angle=i*2.399;position.set(profile.anchor[0]+Math.cos(angle)*18,profile.anchor[1]+phase*.7+(i%4),profile.anchor[2]+Math.sin(angle)*18);matrix.compose(position,rotation,scale);lanterns.setMatrixAt(i,matrix)}lanterns.instanceMatrix.needsUpdate=true;lanterns.computeBoundingSphere()}
  lastTime=time
 }
 function release(){if(closed)return;closed=true;root.removeFromParent();lanterns?.dispose();for(const g of geometries)g.dispose();for(const m of materials)m.dispose()}
 update(0)
 return {root,tick:update,snapshot:()=>({world,weather,event:profile.event,eventActive,phase,particleBudget:BUDGET,visibleParticles:particles.visible?BUDGET:0,covered:roof,lastTime,drawObjects:root.children.length}),release}
}
