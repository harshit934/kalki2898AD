import {appendKashiCityIntegration,KASHI_CITY} from './kashiCityIntegration.js'
import {appendKashiResidential,KASHI_RESIDENTIAL} from './kashiResidential.js'
import {appendKashiTempleMarket,KASHI_TEMPLE_MARKET} from './kashiTempleMarket.js'
import {appendKashiRiverfront,KASHI_RIVERFRONT} from './kashiRiverfront.js'
import {appendKashiStreets,KASHI_STREETS} from './kashiStreets.js'
import {BoxGeometry,CylinderGeometry,SphereGeometry,TorusGeometry,Group,Mesh,MeshStandardMaterial,InstancedMesh,Matrix4,Quaternion,Vector3,Color,Fog,HemisphereLight,DirectionalLight,PointLight} from 'three'
import {requireCondition,deepFreeze} from '../campaign/contracts.js'
import {createDistrictInteractions} from './districtInteractions.js'
import {createLivingKashi} from './livingKashi.js'
import {appendTerraceWalk,TERRACE_WALK,TERRACE_INTERIORS,TERRACE_LIGHTS} from './kashiTerraceWalk.js'
import {appendDistrictRefinement,KASHI_ROOM_FINISHES} from './districtRefinement.js'
import {appendKashiNeighborhood,KASHI_NEIGHBORHOOD,NEIGHBORHOOD_INTERIORS,NEIGHBORHOOD_LIGHTS} from './kashiNeighborhood.js'

// One authored district in the existing metre/Y-up coordinate system. Its
// western approach joins Mission 1's existing floor without moving that map.
export const KASHI_DISTRICT=deepFreeze({id:'kashi-first-district',bounds:{minX:104,maxX:248,minZ:-24,maxZ:120},spawn:[162,-.22,65],
 roads:[{id:'main',x:162,z:48,w:12,d:144},{id:'cross',x:176,z:40,w:144,d:12},{id:'west-lane',x:142,z:48,w:6,d:136},{id:'east-lane',x:204,z:14,w:6,d:68},{id:'north-link',x:141,z:84,w:74,d:6},{id:'south-link',x:176,z:-8,w:144,d:6},{id:'landmark-walk',x:194,z:68,w:64,d:5},{id:'approach',x:76,z:40,w:56,d:12}],
 buildings:[{id:'sandstone-arcade',x:126,z:20,w:18,d:18,h:9,open:true,front:1},{id:'indigo-court',x:126,z:100,w:18,d:16,h:12,open:true,front:-1},{id:'stepped-tower',x:187,z:12,w:18,d:16,h:25},{id:'split-spire',x:224,z:12,w:20,d:20,h:34},{id:'gate-pavilion',x:116,z:63,w:12,d:16,h:10},{id:'terrace-tower',x:180,z:104,w:16,d:18,h:22},{id:'civic-landmark',x:216,z:96,w:28,d:22,h:42,landmark:true}]})

export const KASHI_INTERIORS=deepFreeze(KASHI_DISTRICT.buildings.map((b,index)=>{const front=b.front??(['terrace-tower','civic-landmark'].includes(b.id)?-1:1),floor=b.landmark?.11:-.175;return {id:b.id,label:['Sandstone arcade','Indigo court','Workshop hall','Twin-spire atrium','Gate room','Terrace lounge','Landmark lobby'][index],number:index+1,front,floor,door:!b.open,entry:[b.x,floor,b.z+front*b.d/2],bounds:{minX:b.x-b.w/2+.7,maxX:b.x+b.w/2-.7,minZ:b.z-b.d/2+.7,maxZ:b.z+b.d/2-.7}}}))

export async function prepareKashiDistrict({host,signal,streets=false,riverfront=false,templeMarket=false,residential=false,cityIntegration=false}){
 requireCondition(host?.scene?.isScene&&host.world&&host.rapier&&!signal.aborted,'DISTRICT_UNAVAILABLE','Initialized native world required')
 requireCondition(!host.scene.getObjectByName(KASHI_DISTRICT.id),'DUPLICATE_DISTRICT','Kashi district already exists')
 const root=new Group();root.name=KASHI_DISTRICT.id;root.userData.worldOwned=true;root.userData.visualRevision='phase3c-batch2';root.userData.interactionRevision='district-completion-batch3';root.userData.refinementRevision='phase3c-batch4';root.userData.neighborhoodId=KASHI_NEIGHBORHOOD.id;root.userData.terraceWalkId=TERRACE_WALK.id
 let citySurfaceMetrics=null
 const bodies=[],geometry=new Map(),materials=new Map(),batches=new Map(),collisions=[],doors=new Map(),roomLights=[]
 const previous={background:host.scene.background,fog:host.scene.fog,shadows:host.renderer.shadowMap?.enabled};let closed=false,releaseFailure=null,gateCollider,gateMesh,interactions,neighborhoodInteractions,terraceInteractions,livingCity,lighting='day'
 const palette={stone:'#b59c7a',light:'#dbc29a',dark:'#343c4b',indigo:'#3d4668',brass:'#b79451',road:'#343f49',walk:'#827c70',cyan:'#6ae0df',window:'#25485a',leaf:'#415e52',river:'#355d68'}
 function part(shape,material,at,size,rotation=0,solid=false){
  const key=shape+':'+material;if(!batches.has(key))batches.set(key,{shape,material,parts:[]});batches.get(key).parts.push({at,size,rotation})
  if(solid)collisions.push({at,size})
 }
 const box=(material,at,size,solid=false)=>part('box',material,at,size,0,solid)
 function geo(shape){if(!geometry.has(shape))geometry.set(shape,shape==='box'?new BoxGeometry(1,1,1):shape==='cylinder'?new CylinderGeometry(1,1,1,12):shape==='dome'?new SphereGeometry(1,16,8,0,Math.PI*2,0,Math.PI/2):new TorusGeometry(1,.075,6,24,Math.PI));return geometry.get(shape)}
 function material(name){if(!materials.has(name))materials.set(name,new MeshStandardMaterial({color:palette[name],roughness:name==='brass'?.42:.85,metalness:name==='brass'?.65:.1,...(name==='cyan'?{emissive:palette.cyan,emissiveIntensity:.7}:name==='window'?{emissive:'#173b4b',emissiveIntensity:.35}:{})}));return materials.get(name)}
 function release(){
  if(closed){if(releaseFailure)throw releaseFailure;return}closed=true;const errors=[],attempt=fn=>{try{fn()}catch(error){errors.push(error)}}
  attempt(()=>livingCity?.release());interactions?.release();neighborhoodInteractions?.release();terraceInteractions?.release();root.removeFromParent();for(const body of bodies)attempt(()=>host.world.removeRigidBody(body))
  root.traverse(object=>{if(object.isInstancedMesh)attempt(()=>object.dispose());if(object.isLight&&object.dispose)attempt(()=>object.dispose())})
  for(const value of geometry.values())attempt(()=>value.dispose());for(const value of materials.values())attempt(()=>value.dispose())
  host.scene.background=previous.background;host.scene.fog=previous.fog;if(host.renderer.shadowMap)host.renderer.shadowMap.enabled=previous.shadows
  signal.removeEventListener('abort',abort);if(errors.length){releaseFailure=new AggregateError(errors,'District cleanup failed');throw releaseFailure}
 }
 const abort=()=>{try{release()}catch{/* Owner shutdown still disposes native world. */}}
 signal.addEventListener('abort',abort,{once:true})
 try{
  // Approach is 2 cm above the old floor to avoid coplanar surface flicker
  // where the two authored areas overlap; the existing controller can step it.
  box('stone',[176,-.43,48],[144,.42,144],true);box('dark',[76,-.41,40],[56,.42,18],true)
  for(const road of KASHI_DISTRICT.roads){box(road.id==='landmark-walk'?'walk':'road',[road.x,-.205,road.z],[road.w,.025,road.d],true)}
  // Pavement bands, lane lights and patterned crossing blocks distinguish a
  // connected street network from the surrounding courtyards.
  const pavementZ=[[-22,-12],[-4,33],[47,64.5],[71.5,80],[88,118]],pavementX=[[106,138],[146,154],[170,200],[208,246]]
  for(const x of [154.5,169.5])for(const [start,end] of pavementZ){box('light',[x,-.155,(start+end)/2],[2.5,.12,end-start],true);for(let z=start+2;z<end-1;z+=8)box('cyan',[x,-.086,z],[.15,.02,2])}
  for(const z of [32.5,47.5])for(const [start,end] of pavementX)box('light',[(start+end)/2,-.155,z],[end-start,.12,2.5],true)
  for(const x of [151,173])for(let z=35;z<=45;z+=2)box('light',[x,-.18,z],[3,.025,1])
  for(const z of [29,51])for(let x=158;x<=166;x+=2)box('light',[x,-.18,z],[1,.025,3])
  for(let z=-18;z<116;z+=8)if(Math.abs(z-40)>12&&Math.abs(z-84)>6)box('brass',[162,-.184,z],[.12,.012,3])
  for(const b of KASHI_DISTRICT.buildings){
   const collisionStart=collisions.length
   const color=b.id==='indigo-court'||b.id==='split-spire'?'indigo':'stone',y=-.22
   if(b.open){
    // Real ground-floor room: side and rear walls, an open central doorway,
    // upper occupied mass and an arcade of columns/chajjas facing the street.
    for(const x of [b.x-b.w/2+.35,b.x+b.w/2-.35])box(color,[x,y+2.2,b.z],[.7,4.4,b.d],true)
    box(color,[b.x,y+2.2,b.z-b.front*(b.d/2-.35)],[b.w,4.4,.7],true)
    box(color,[b.x,y+(b.h+4.4)/2,b.z],[b.w,b.h-4.4,b.d],true)
    for(const x of [b.x-b.w/2+1,b.x+b.w/2-1])box('light',[x,y+2.1,b.z+b.front*b.d/2],[1,4.2,1],true)
    for(const dx of [-6,-2,2,6]){const at=[b.x+dx,y+2,b.z+b.front*(b.d/2+1.4)];part('cylinder','light',at,[.25,4,.25]);collisions.push({at,size:[.5,4,.5]});part('arch','brass',[b.x+dx,y+2.8,b.z+b.front*(b.d/2+1.4)],[1.8,1.4,1])}
    box('dark',[b.x,y+4.35,b.z+b.front*(b.d/2+.9)],[b.w+2,.3,3.4])
    box('brass',[b.x-b.w/2+2,y+.45,b.z],[2,.9,4],true)
    box('walk',[b.x,y+.025,b.z],[b.w-1.5,.04,b.d-1.5],true)
    for(const dx of [-4,0,4])for(const dz of [-4,0,4])box('light',[b.x+dx,y+.05,b.z+dz],[2.8,.012,2.8])
    for(const dz of [-4,0,4])box('brass',[b.x,y+3.95,b.z+dz],[b.w-1.5,.22,.25])
    box('dark',[b.x+4,y+.65,b.z-b.front*(b.d/2-2)],[4,1.3,1.5],true)
    box('cyan',[b.x+4,y+1.32,b.z-b.front*(b.d/2-2)],[3.5,.04,1.2])
    for(const side of [-1,1])for(const dz of [-4,0,4])box('indigo',[b.x+side*(b.w/2-.55),y+2,b.z+dz],[.15,2.4,2.6])
    const lamp=new PointLight('#ffd5a0',24,12,2);lamp.position.set(b.x,3.2,b.z);root.add(lamp);roomLights.push(lamp)
   }else{
    const room=KASHI_INTERIORS.find(r=>r.id===b.id),frontZ=b.z+room.front*(b.d/2-.35),side=(b.w-3.6)/2,doorTop=room.floor+3.35
    for(const x of [b.x-b.w/2+.35,b.x+b.w/2-.35])box(color,[x,y+3.5,b.z],[.7,7,b.d],true)
    box(color,[b.x,y+3.5,b.z-room.front*(b.d/2-.35)],[b.w,7,.7],true)
    for(const x of [b.x-1.8-side/2,b.x+1.8+side/2])box(color,[x,y+3.5,frontZ],[side,7,.7],true)
    box(color,[b.x,(doorTop+6.78)/2,frontZ],[3.6,6.78-doorTop,.7],true)
    box('dark',[b.x,6.65,b.z],[b.w-.7,.26,b.d-.7],true)
    box('walk',[b.x,room.floor-.025,b.z],[b.w-1.4,.05,b.d-1.4],true)
    box('brass',[b.x,room.floor-.03,room.entry[2]],[4,.06,1.8],true)
    doors.set(b.id,{room,mesh:null,collider:null});collisions.push({at:[b.x,room.floor+1.65,room.entry[2]],size:[3.6,3.3,.18],doorId:b.id})
    for(const dx of [-2.1,2.1])box('cyan',[b.x+dx,room.floor+1.8,room.entry[2]+room.front*.4],[.12,3.6,.15])
    if(b.landmark)box('light',[216,.05,83.75],[4,.12,4],true)
    if(b.id==='stepped-tower')for(const side of [-1,1]){box('dark',[b.x+side*5,room.floor+.6,b.z-3],[2,1.2,5],true);box('cyan',[b.x+side*5,room.floor+1.22,b.z-3],[1.7,.04,4.6])}
    if(b.id==='split-spire')for(const side of [-1,1]){box('indigo',[b.x+side*5,room.floor+.6,b.z],[2,1.2,4],true);part('arch','brass',[b.x+side*5,4.4,b.z],[2,1.5,2])}
    if(b.id==='gate-pavilion'){box('dark',[b.x-2.3,1.2,b.z-3],[.3,2.8,4],true);box('brass',[b.x+2.5,.4,b.z-3],[3,1,2],true)}
    if(b.id==='terrace-tower'){for(const side of [-1,1])box('indigo',[b.x+side*5,.3,b.z],[1.5,1,5],true);box('dark',[b.x,1.2,b.z+7],[8,2.8,.8],true);for(const h of [.5,1.4,2.3])box('brass',[b.x,h,b.z+6.5],[7.5,.12,.8])}
    if(b.landmark){for(const dx of [-8,8])for(const dz of [-3,3]){part('cylinder','light',[b.x+dx,2.6,b.z+dz],[.4,5,.4]);collisions.push({at:[b.x+dx,2.6,b.z+dz],size:[.8,5,.8]})}box('brass',[b.x,room.floor+.015,b.z],[5,.02,5])}
    for(const dz of [-b.d*.25,0,b.d*.25])box('brass',[b.x,6.25,b.z+dz],[b.w-2,.18,.2])
    if(b.id==='split-spire')for(const dx of [-5,5])box(color,[b.x+dx,y+(b.h+7)/2,b.z],[5.5,b.h-7,b.d*.65])
    else if(b.id==='terrace-tower')for(let tier=0;tier<3;tier++)box(color,[b.x,y+9.5+tier*5,b.z],[b.w*(.9-tier*.2),5,b.d*(.9-tier*.2)])
    else box(color,[b.x,y+(b.h+7)/2,b.z],[b.w*.76,b.h-7,b.d*.76])
    for(let level=7;level<b.h;level+=5){
     const ratio=b.id==='terrace-tower'?.9-Math.floor((level-7)/5)*.2:.76
     if(b.id==='split-spire')for(const dx of [-5,5]){box('light',[b.x+dx,y+level,b.z],[6.1,.5,b.d*.69]);box('window',[b.x+dx,y+level+1.7,b.z+b.d*.325+.06],[4.3,1.7,.16]);box('brass',[b.x+dx,y+level+1.7,b.z+b.d*.325+.17],[.12,2,.14])}
     else{
      box('light',[b.x,y+level,b.z],[b.w*(ratio+.04),.5,b.d*(ratio+.04)])
      for(const dx of [-.26,0,.26]){box('window',[b.x+b.w*ratio*dx,y+level+1.7,b.z+b.d*ratio/2+.06],[b.w*ratio*.22,1.7,.16]);box('brass',[b.x+b.w*ratio*(dx+.12),y+level+1.7,b.z+b.d*ratio/2+.17],[.12,2,.14])}
      for(const dz of [-.23,.23])box('window',[b.x+b.w*ratio/2+.06,y+level+1.7,b.z+b.d*ratio*dz],[.16,1.7,b.d*ratio*.32])
     }
    }
   }
   // Setbacks, jali fins, shaded cornices and roof chhatris establish an
   // Indian architectural vocabulary without copying film footage/assets.
   const crownRatio=b.id==='terrace-tower'?.5:.85
   box('light',[b.x,y+b.h+.25,b.z],[b.w*crownRatio,.5,b.d*crownRatio])
   if(b.id!=='split-spire')for(let dx=-b.w*crownRatio*.35;dx<=b.w*crownRatio*.35;dx+=1.5)box('brass',[b.x+dx,y+b.h-2,b.z+b.d*(b.id==='terrace-tower'?.25:.39)],[.18,3.5,.28])
   const domeRadius=b.landmark?6.3:Math.min(3,b.w*.16)
   part('cylinder','brass',[b.x,y+b.h+1,b.z],[domeRadius,1.4,domeRadius]);part('dome','light',[b.x,y+b.h+1.7,b.z],[domeRadius,domeRadius*.65,domeRadius])
   part('cylinder','brass',[b.x,y+b.h+domeRadius*.65+2.4,b.z],[.17,2.2,.17])
   if(b.landmark){
    // Tall asymmetric landmark with a public stepped forecourt and twin ribs.
    for(const dx of [-12,12]){box('dark',[b.x+dx,18,b.z],[2,36,3]);box('cyan',[b.x+dx,20,b.z+1.6],[.25,28,.15])}
    for(let step=0;step<4;step++)box('light',[b.x,-.16+step*.07,78+step],[24-step*2,.12,1.5],true)
    for(const x of [b.x-9,b.x+9]){part('cylinder','brass',[x,3.5,80],[.5,7,.5]);collisions.push({at:[x,3.5,80],size:[1,7,1]})}
    box('brass',[b.x,7,80],[23,.45,3])
    for(let rib=0;rib<6;rib++)part('arch','brass',[b.x,y+b.h+1.7,b.z],[6.4,4.2,6.4],rib*Math.PI/6)
   }
   for(let i=collisionStart;i<collisions.length;i++)if(!collisions[i].doorId)collisions[i].buildingId=b.id
  }
  appendDistrictRefinement({box,part,interiors:KASHI_INTERIORS,buildings:KASHI_DISTRICT.buildings})
  const glyphs={1:'bc',2:'abged',3:'abgcd',4:'fgbc',5:'afgcd',6:'afgecd',7:'abc'},strokes={a:[0,.24,.4,.05],b:[.22,.12,.05,.24],c:[.22,-.12,.05,.24],d:[0,-.24,.4,.05],e:[-.22,-.12,.05,.24],f:[-.22,.12,.05,.24],g:[0,0,.4,.05]}
  for(const room of KASHI_INTERIORS){box('dark',[room.entry[0],room.floor+3.9,room.entry[2]+room.front*.5],[4.5,.75,.2]);for(const key of glyphs[room.number]){const [x,y,w,h]=strokes[key];box('cyan',[room.entry[0]+x*room.front,room.floor+3.9+y,room.entry[2]+room.front*.62],[w,h,.03])}}
  // Entrance arch, constrained boundaries and a landing adjoining the old city.
  for(const z of [31,49])box('stone',[106,4,z],[2.5,8,2.5],true)
  part('arch','brass',[106,7,40],[8,5,8],Math.PI/2)
  for(const [start,end] of [[-24,31],[49,120]])box('dark',[104,.4,(start+end)/2],[.7,1.2,end-start],true)
  // Open only the two authored connections through the old east rail.
  for(const [start,end] of [[-24,31],[49,63],[73,120]])box('dark',[248,.4,(start+end)/2],[.7,1.2,end-start],true)
  for(const z of [-24,120])box('dark',[176,.4,z],[144,1.2,.7],true)
  for(const z of [31,49])box('brass',[76,.4,z],[56,1.2,.5],true)
  collisions.push({at:[48,.4,40],size:[.5,1.2,18],gate:true})
  for(const [x,z] of [[145,18],[145,98],[178,55],[234,60],[233,112]]){
   box('dark',[x,.25,z],[3,.9,3],true);part('cylinder','leaf',[x,1,z],[1.2,1,1.2]);part('cylinder','brass',[x+2.4,2.2,z],[.1,4.8,.1]);box('cyan',[x+2.4,4.5,z],[.5,.2,.6])
  }
  appendKashiNeighborhood({box,part,collisions,doors})
  appendTerraceWalk({box,part,batches,collisions,doors})
  if(streets){appendKashiStreets({box,part,batches,collisions});root.userData.streetQuarter=KASHI_STREETS.id}
  if(riverfront){requireCondition(streets,'RIVERFRONT_STREETS_REQUIRED','Riverfront requires connected streets');appendKashiRiverfront({box,part,batches,collisions});root.userData.riverfront=KASHI_RIVERFRONT.id}
  if(templeMarket){requireCondition(riverfront,'TEMPLE_RIVERFRONT_REQUIRED','Temple market requires riverfront');appendKashiTempleMarket({box,part,batches,collisions});root.userData.templeMarket=KASHI_TEMPLE_MARKET.id}
  if(residential){requireCondition(templeMarket,'RESIDENTIAL_MARKET_REQUIRED','Residential district requires temple market');appendKashiResidential({box,part,batches,collisions});root.userData.residential=KASHI_RESIDENTIAL.id}
  if(cityIntegration){requireCondition(residential,'CITY_RESIDENTIAL_REQUIRED','City integration requires all districts');citySurfaceMetrics=appendKashiCityIntegration({box,part,batches,collisions});root.userData.navigationLandmarks=KASHI_CITY.landmarks;root.userData.cityIntegration=KASHI_CITY.id}
  for(const [key,batch] of batches){
   requireCondition(!signal.aborted,'WORLD_CANCELLED','District creation cancelled')
   const mesh=new InstancedMesh(geo(batch.shape),material(batch.material),batch.parts.length);mesh.name=key;const matrix=new Matrix4(),rotation=new Quaternion(),up=new Vector3(0,1,0)
   batch.parts.forEach((p,i)=>{rotation.setFromAxisAngle(up,p.rotation);matrix.compose(new Vector3(...p.at),rotation,new Vector3(...p.size));mesh.setMatrixAt(i,matrix)})
   mesh.instanceMatrix.needsUpdate=true;mesh.castShadow=!['cyan','road','walk','river'].includes(batch.material);mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh)
  }
  gateMesh=new Mesh(geo('box'),material('brass'));gateMesh.position.set(48,.4,40);gateMesh.scale.set(.5,1.2,18);root.add(gateMesh)
  for(const [id,door] of doors){const panel=new Group();panel.name='district-door-'+id;panel.position.set(door.room.entry[0],door.room.floor+1.65,door.room.entry[2]);const leaf=new Mesh(geo('box'),material('indigo'));leaf.scale.set(3.6,3.3,.18);panel.add(leaf);const strip=new Mesh(geo('box'),material('cyan'));strip.scale.set(.08,2.5,.24);panel.add(strip);root.add(panel);door.mesh=panel}
  const staticGroups=new Map()
  for(const p of collisions){if(p.buildingId){if(!staticGroups.has(p.buildingId))staticGroups.set(p.buildingId,[]);staticGroups.get(p.buildingId).push(p);continue}const body=host.world.createRigidBody(host.rapier.RigidBodyDesc.fixed().setTranslation(...p.at));bodies.push(body);const collider=host.world.createCollider(host.rapier.ColliderDesc.cuboid(...p.size.map(v=>v/2)),body);if(p.gate)gateCollider=collider;if(p.doorId)doors.get(p.doorId).collider=collider}
  // Static compound building surfaces use one actual triangle-mesh collider per
  // building. Preserve every wall/floor/prop, not just a bounding box over rooms.
  const boxGeometry=geo('box'),vertices=boxGeometry.attributes.position,index=boxGeometry.index
  for(const parts of staticGroups.values()){const points=[],indices=[];for(const p of parts){const offset=points.length/3;for(let i=0;i<vertices.count;i++)points.push(p.at[0]+vertices.getX(i)*p.size[0],p.at[1]+vertices.getY(i)*p.size[1],p.at[2]+vertices.getZ(i)*p.size[2]);for(let i=0;i<index.count;i++)indices.push(offset+index.getX(i))}const body=host.world.createRigidBody(host.rapier.RigidBodyDesc.fixed());bodies.push(body);host.world.createCollider(host.rapier.ColliderDesc.trimesh(new Float32Array(points),new Uint32Array(indices)),body)}
  const fill=new HemisphereLight('#c7dfed','#6c5241',1.6),sun=new DirectionalLight('#ffe3ae',2.8);sun.position.set(115,110,95);sun.target.position.set(236,0,48);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-160,right:160,top:120,bottom:-120,near:1,far:350});sun.shadow.bias=-.0003
  sun.shadow.camera.updateProjectionMatrix();root.add(fill,sun,sun.target);host.scene.background=new Color('#667e8a');host.scene.fog=new Fog('#8b9b9b',145,390);if(host.renderer.shadowMap)host.renderer.shadowMap.enabled=true
  const doorOperations={setDoorOpen(id,open){requireCondition(!closed,'WORLD_CANCELLED','District released');const door=doors.get(id);door.collider.setEnabled(!open);door.mesh.position.x=door.room.entry[0]+(open?3.9:0);door.mesh.userData.open=open},canSee(room,p,body){const dx=room.entry[0]-p.x,dy=room.floor+1.2-(p.y+.9),dz=room.entry[2]-p.z,d=Math.hypot(dx,dy,dz);if(d<.001)return true;const hit=host.world.castRay(new host.rapier.Ray({x:p.x,y:p.y+.9,z:p.z},{x:dx/d,y:dy/d,z:dz/d}),d+.02,true,host.rapier.QueryFilterFlags.EXCLUDE_SENSORS,undefined,undefined,body);return !hit||hit.collider.handle===doors.get(room.id).collider.handle}}
  interactions=createDistrictInteractions({interiors:KASHI_INTERIORS,...doorOperations})
  neighborhoodInteractions=createDistrictInteractions({interiors:NEIGHBORHOOD_INTERIORS,...doorOperations})
  terraceInteractions=createDistrictInteractions({interiors:TERRACE_INTERIORS,...doorOperations})
  const allInteriors=deepFreeze([...KASHI_INTERIORS,...NEIGHBORHOOD_INTERIORS,...TERRACE_INTERIORS])
  const ledgers=[interactions,neighborhoodInteractions,terraceInteractions]
  const interact=args=>{let result;for(const ledger of ledgers){result=ledger.interact(args);if(result.accepted||result.message!=='Approach a building door and press E')return result}return result}
  host.world.step();host.scene.add(root)
  livingCity=createLivingKashi({host,signal})
  return {ready:true,root,livingCity,streetQuarter:streets?KASHI_STREETS:null,riverfront:riverfront?KASHI_RIVERFRONT:null,templeMarket:templeMarket?KASHI_TEMPLE_MARKET:null,residential:residential?KASHI_RESIDENTIAL:null,cityIntegration:cityIntegration?KASHI_CITY:null,citySurfaceMetrics,spawn:[...KASHI_DISTRICT.spawn],interiors:KASHI_INTERIORS,allInteriors,terraceWalk:TERRACE_WALK,neighborhood:KASHI_NEIGHBORHOOD,interact,doorSnapshot:()=>interactions.snapshot(),neighborhoodDoorSnapshot:()=>neighborhoodInteractions.snapshot(),terraceDoorSnapshot:()=>terraceInteractions.snapshot(),allDoorSnapshot:()=>[...interactions.snapshot(),...neighborhoodInteractions.snapshot(),...terraceInteractions.snapshot()],updateFocus(args){requireCondition(!closed,'WORLD_CANCELLED','District released');const nearest=[...allInteriors].sort((a,b)=>Math.hypot(args.position.x-a.entry[0],args.position.z-a.entry[2])-Math.hypot(args.position.x-b.entry[0],args.position.z-b.entry[2])).slice(0,2);nearest.forEach((room,i)=>{roomLights[i].position.set((room.bounds.minX+room.bounds.maxX)/2,room.floor+3.2,(room.bounds.minZ+room.bounds.maxZ)/2);roomLights[i].color.set(KASHI_ROOM_FINISHES[room.id]?.light??NEIGHBORHOOD_LIGHTS[room.id]??TERRACE_LIGHTS[room.id])});const views=ledgers.map(ledger=>ledger.focus(args));return views.find(view=>view.insideBuildingId||view.prompt)??views[0]},setLighting(mode){requireCondition(!closed,'WORLD_CANCELLED','District released');requireCondition(['day','night'].includes(mode),'INVALID_LIGHTING','Day or night lighting required');lighting=mode;const night=mode==='night';fill.intensity=night?.45:1.6;sun.intensity=night?.14:2.8;host.scene.background.set(night?'#111e35':'#667e8a');host.scene.fog.color.set(night?'#182b43':'#8b9b9b');host.scene.fog.near=night?110:145;host.scene.fog.far=night?330:390;for(const lamp of roomLights)lamp.intensity=night?36:24;material('cyan').emissiveIntensity=night?1.1:.7;material('window').emissiveIntensity=night?.8:.35;livingCity.setLighting(mode);return lighting},collisionCount:bodies.length,drawBatches:batches.size,setMissionActive(active){requireCondition(!closed,'WORLD_CANCELLED','District released');gateMesh.visible=!active;gateCollider.setEnabled(!active)},release}
 }catch(error){try{release()}catch(cleanup){throw new AggregateError([error,cleanup],'District preparation and cleanup failed')}throw error}
}

export const prepareKashiStreets=args=>prepareKashiDistrict({...args,streets:true})

export const prepareKashiRiverfront=args=>prepareKashiDistrict({...args,streets:true,riverfront:true})

export const prepareKashiTempleMarket=args=>prepareKashiDistrict({...args,streets:true,riverfront:true,templeMarket:true})

export const prepareKashiResidential=args=>prepareKashiDistrict({...args,streets:true,riverfront:true,templeMarket:true,residential:true})

export const prepareKashiCity=args=>prepareKashiDistrict({...args,streets:true,riverfront:true,templeMarket:true,residential:true,cityIntegration:true})
