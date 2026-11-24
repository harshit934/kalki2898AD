import {Group,BoxGeometry,ConeGeometry,CylinderGeometry,MeshStandardMaterial,MeshBasicMaterial,InstancedMesh,Matrix4,Quaternion,Vector3,Euler,Color,Float32BufferAttribute,DynamicDrawUsage} from 'three'
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js'
import {deepFreeze,requireCondition} from '../campaign/contracts.js'

export const LIVING_KASHI_ID='kashi-ambient-presentation'
export const TRAFFIC_TYPES=deepFreeze(['courier','shuttle','freighter'])
export const TRAFFIC_ROUTES=deepFreeze([
 {id:'low-commuter-loop',profile:'street-corridor',center:[227,10],radii:[65,30],height:6.5,speed:7,direction:1,types:['courier','courier']},
 {id:'west-courier-loop',center:[220,70],radii:[65,100],height:62,speed:9,direction:1,types:['courier','shuttle','courier']},
 {id:'east-shuttle-loop',center:[310,50],radii:[46,48],height:74,speed:11,direction:-1,types:['shuttle','courier']},
 {id:'cross-city-freight',center:[236,48],radii:[122,62],height:86,speed:14,direction:1,types:['freighter','shuttle']},
 {id:'upper-service-return',center:[236,48],radii:[112,52],height:98,speed:10,direction:-1,types:['courier','freighter']}
])
// Deliberately beyond the playable perimeter, without doors, floors, numbers,
// mission markers or silhouettes copied from the twelve explorable buildings.
export const DISTANT_SKYLINE=deepFreeze([
 {id:'distant-array-a',x:92,z:-78,h:56,w:8,kind:'needle'},
 {id:'distant-array-b',x:124,z:-96,h:80,w:11,kind:'stepped'},
 {id:'distant-array-c',x:168,z:-76,h:62,w:9,kind:'paired'},
 {id:'distant-array-d',x:210,z:-108,h:91,w:10,kind:'needle'},
 {id:'distant-array-e',x:252,z:-84,h:72,w:12,kind:'stepped'},
 {id:'distant-array-f',x:295,z:-100,h:86,w:8,kind:'paired'},
 {id:'distant-array-g',x:340,z:-80,h:60,w:10,kind:'needle'},
 {id:'distant-array-h',x:384,z:-104,h:78,w:13,kind:'stepped'},
 {id:'distant-array-i',x:414,z:24,h:64,w:8,kind:'paired'},
 {id:'distant-array-j',x:422,z:96,h:82,w:11,kind:'needle'}
])

export function validateTrafficRoutes(routes){
 requireCondition(Array.isArray(routes)&&routes.length>0,'INVALID_TRAFFIC','Traffic routes required')
 const ids=new Set()
 for(const route of routes){
  requireCondition(route&&typeof route==='object','INVALID_TRAFFIC','Route object required')
  requireCondition(typeof route.id==='string'&&!ids.has(route.id),'INVALID_TRAFFIC','Unique route IDs required');ids.add(route.id)
  requireCondition(Array.isArray(route.center)&&route.center.length===2&&Array.isArray(route.radii)&&route.radii.length===2&&[...route.center,...route.radii,route.height,route.speed].every(Number.isFinite),'INVALID_TRAFFIC','Finite traffic geometry required')
  const safeHeight=route.profile==='street-corridor'?route.height>=6.5&&route.height<=12:route.height>=58
  requireCondition(route.radii.every(r=>r>=30)&&safeHeight&&route.speed>=6&&route.speed<=18&&[1,-1].includes(route.direction),'INVALID_TRAFFIC','Bounded, separated air lanes required')
  requireCondition(Array.isArray(route.types)&&route.types.length>=1&&route.types.length<=4&&route.types.every(type=>TRAFFIC_TYPES.includes(type)),'INVALID_TRAFFIC','Known, bounded vehicle composition required')
  requireCondition(route.profile!=='street-corridor'||route.types.every(type=>type==='courier'),'INVALID_TRAFFIC','Street corridor is restricted to compact courier hulls')
  // Four-to-nine metre hulls have a conservative 4.5m bounding radius. Lanes
  // separate vertically; equal phase slots keep each same-lane convoy apart.
  if(route.types.length>1)requireCondition(2*Math.min(...route.radii)*Math.sin(Math.PI/route.types.length)>12,'INVALID_TRAFFIC','Insufficient convoy separation')
 }
 for(let i=0;i<routes.length;i++)for(let j=i+1;j<routes.length;j++)requireCondition(Math.abs(routes[i].height-routes[j].height)>=12,'INVALID_TRAFFIC','Air lanes must be vertically separated')
 return true
}
validateTrafficRoutes(TRAFFIC_ROUTES)
export function sampleTraffic(time){
 requireCondition(Number.isFinite(time)&&time>=0,'INVALID_TRAFFIC_TIME','Non-negative finite simulation time required')
 return TRAFFIC_ROUTES.flatMap(route=>route.types.map((type,index)=>{
  const phase=index*Math.PI*2/route.types.length,rate=route.speed/Math.sqrt((route.radii[0]**2+route.radii[1]**2)/2),angle=(time*rate*route.direction+phase)%(Math.PI*2)
  const dx=-route.radii[0]*Math.sin(angle)*route.direction,dz=route.radii[1]*Math.cos(angle)*route.direction
  return {id:route.id+'-'+index,routeId:route.id,type,position:[route.center[0]+route.radii[0]*Math.cos(angle),route.height+.25*Math.sin(angle*2),route.center[1]+route.radii[1]*Math.sin(angle)],yaw:Math.atan2(dx,dz),bank:.035*Math.sin(angle)*route.direction}
 }))
}

export function createKashiVehicleGeometry(type){
 const pieces=[]
 function part(geometry,position,scale,color,rotateX=0){
  try{
   const transform=new Matrix4().compose(new Vector3(...position),new Quaternion().setFromEuler(new Euler(rotateX,0,0)),new Vector3(...scale));geometry.applyMatrix4(transform)
   const tint=new Color(color),values=new Float32Array(geometry.attributes.position.count*3)
   for(let i=0;i<values.length;i+=3){values[i]=tint.r;values[i+1]=tint.g;values[i+2]=tint.b}
   geometry.setAttribute('color',new Float32BufferAttribute(values,3));pieces.push(geometry)
  }catch(error){geometry.dispose();throw error}
 }
 const box=(p,s,c)=>part(new BoxGeometry(1,1,1),p,s,c)
 try{
  if(type==='courier'){
   part(new ConeGeometry(1,1,4),[0,0,.25],[1.1,3.8,.55],'#c8a573',Math.PI/2)
   box([0,0,-.35],[3.4,.14,1.1],'#546f78');box([0,.35,.35],[.75,.4,1.2],'#8bc9c9')
   box([0,0,-1.6],[.65,.16,.12],'#72dce3')
  }else if(type==='shuttle'){
   box([0,0,0],[2.6,1.15,5.2],'#778da0');box([0,.3,2.62],[2,.42,.08],'#89d7d7')
   for(const side of [-1,1]){part(new CylinderGeometry(.45,.45,2.2,8),[side*1.75,-.15,-.4],[1,1,1],'#b89b68',Math.PI/2);box([side*1.75,-.15,-1.55],[.5,.35,.12],'#72dce3')}
  }else{
   box([0,0,0],[3.2,1.2,5.8],'#746c5c');for(const side of [-1,1])box([side*1.85,.25,0],[.3,.3,6.5],'#c7aa70')
   for(const x of [-.8,.8])for(const z of [-1.1,1.1])box([x,1,z],[1.3,.8,1.8],'#9b745c')
   for(const x of [-1.1,1.1])box([x,-.15,-2.95],[.7,.35,.12],'#72dce3')
  }
  const merged=mergeGeometries(pieces);requireCondition(merged,'TRAFFIC_GEOMETRY_FAILED','Vehicle parts could not be combined');merged.computeBoundingSphere();return merged
 }finally{for(const geometry of pieces)geometry.dispose()}
}

export function createLivingKashi({host,signal}){
 requireCondition(host?.scene?.isScene&&typeof host.subscribeAfterPhysics==='function'&&!signal.aborted,'AMBIENT_UNAVAILABLE','Live scene and world frame host required')
 requireCondition(!host.scene.getObjectByName(LIVING_KASHI_ID),'DUPLICATE_AMBIENT','Living Kashi already belongs to this world')
 const root=new Group();root.name=LIVING_KASHI_ID;root.userData={worldOwned:true,ownerDistrictId:'kashi-first-district',explorable:false}
 const geometries=new Set(),materials=new Set(),trafficMeshes=new Map(),matrix=new Matrix4(),position=new Vector3(),scale=new Vector3(1,1,1),rotation=new Quaternion(),euler=new Euler()
 let stop=null,closed=false,releaseFailure=null,elapsed=0,renderedTime=0,mode='day',poses=[]
 function geometry(value){geometries.add(value);return value}
 function material(value){materials.add(value);return value}
 function release(){
  if(closed){if(releaseFailure)throw releaseFailure;return}closed=true;const errors=[],attempt=fn=>{try{fn()}catch(error){errors.push(error)}}
  attempt(()=>stop?.());stop=null;signal.removeEventListener('abort',abort);root.removeFromParent()
  root.traverse(o=>{if(o.isInstancedMesh)attempt(()=>o.dispose())})
  for(const g of geometries)attempt(()=>g.dispose());for(const m of materials)attempt(()=>m.dispose())
  if(errors.length){releaseFailure=new AggregateError(errors,'Living Kashi cleanup failed');throw releaseFailure}
 }
 const abort=()=>{try{release()}catch{/* Owning district reports retained cleanup failure. */}}
 try{
  const trafficMaterial=material(new MeshStandardMaterial({vertexColors:true,roughness:.6,metalness:.35,emissive:'#3a7279',emissiveIntensity:.12}))
  const initial=sampleTraffic(0)
  for(const type of TRAFFIC_TYPES){
   const count=initial.filter(v=>v.type===type).length,mesh=new InstancedMesh(geometry(createKashiVehicleGeometry(type)),trafficMaterial,count);mesh.name='ambient-traffic-'+type
   mesh.instanceMatrix.setUsage(DynamicDrawUsage);mesh.castShadow=false;mesh.receiveShadow=false;root.add(mesh);trafficMeshes.set(type,mesh)
  }
  const boxes=[],spires=[],windows=[]
  for(const tower of DISTANT_SKYLINE){
   if(tower.kind==='paired')for(const side of [-1,1])boxes.push({at:[tower.x+side*tower.w*.6,tower.h/2,tower.z],size:[tower.w*.65,tower.h,8]})
   else if(tower.kind==='stepped')for(let tier=0;tier<3;tier++)boxes.push({at:[tower.x,(tier+.5)*tower.h/3,tower.z],size:[tower.w*(1-tier*.2),tower.h/3,10-tier*2]})
   else{boxes.push({at:[tower.x,tower.h*.43,tower.z],size:[tower.w,tower.h*.86,8]});spires.push({at:[tower.x,tower.h*.93,tower.z],size:[tower.w*.65,tower.h*.14,tower.w*.65]})}
   for(let level=8;level<tower.h;level+=10)windows.push({at:[tower.x,level,tower.z+5.1],size:[tower.w*.6,.25,.08]})
  }
  const boxGeometry=geometry(new BoxGeometry(1,1,1)),spireGeometry=geometry(new ConeGeometry(1,1,6))
  const skylineMaterial=material(new MeshStandardMaterial({color:'#40535f',roughness:1})),signalMaterial=material(new MeshBasicMaterial({color:'#86c4c9',transparent:true,opacity:.28,depthWrite:false}))
  function skylineBatch(name,g,m,parts){const mesh=new InstancedMesh(g,m,parts.length);mesh.name=name;parts.forEach((p,i)=>{matrix.compose(new Vector3(...p.at),new Quaternion(),new Vector3(...p.size));mesh.setMatrixAt(i,matrix)});mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();root.add(mesh)}
  skylineBatch('distant-city-masses',boxGeometry,skylineMaterial,boxes);skylineBatch('distant-city-spires',spireGeometry,skylineMaterial,spires);skylineBatch('distant-city-signals',boxGeometry,signalMaterial,windows)
  function update(time){
   poses=sampleTraffic(time);const indices={courier:0,shuttle:0,freighter:0}
   for(const pose of poses){const mesh=trafficMeshes.get(pose.type);matrix.compose(position.fromArray(pose.position),rotation.setFromEuler(euler.set(0,pose.yaw,pose.bank)),scale);mesh.setMatrixAt(indices[pose.type]++,matrix)}
   for(const mesh of trafficMeshes.values())mesh.instanceMatrix.needsUpdate=true
   signalMaterial.opacity=(mode==='night'?.6:.28)*(.96+.04*Math.sin(time*.6))
  }
  update(0)
  // Fixed conservative route envelope includes every lane/hull, so moving
  // instances remain cull-safe without scanning all matrices every frame.
  for(const mesh of trafficMeshes.values()){mesh.computeBoundingSphere();for(const x of [108,364])for(const y of [0,104])for(const z of [-36,176])mesh.boundingSphere.expandByPoint(new Vector3(x,y,z))}
  host.scene.add(root);signal.addEventListener('abort',abort,{once:true})
  stop=host.subscribeAfterPhysics(delta=>{if(closed||signal.aborted)return;requireCondition(Number.isFinite(delta)&&delta>=0,'INVALID_AMBIENT_FRAME','Finite simulation delta required');elapsed+=delta;renderedTime=Math.round(elapsed*1e6)/1e6;update(renderedTime)})
  requireCondition(typeof stop==='function','AMBIENT_UNAVAILABLE','World subscription must provide cleanup')
  return {ready:true,root,vehicleCount:initial.length,drawBatches:6,skylineCount:DISTANT_SKYLINE.length,
   snapshot(){requireCondition(!closed,'WORLD_CANCELLED','Living Kashi released');return {time:renderedTime,vehicles:poses.map(p=>({...p,position:[...p.position]}))}},
   setLighting(value){requireCondition(!closed&&['day','night'].includes(value),'INVALID_LIGHTING','Live day/night presentation required');mode=value;trafficMaterial.emissiveIntensity=mode==='night'?.25:.12;update(renderedTime)},release}
 }catch(error){try{release()}catch(cleanup){throw new AggregateError([error,cleanup],'Living Kashi preparation and cleanup failed')}throw error}
}
