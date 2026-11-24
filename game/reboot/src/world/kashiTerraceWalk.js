import {deepFreeze,requireCondition} from '../campaign/contracts.js'
import {appendTerraceBuildingFinish,appendTerracePlazaFinish} from './terraceArchitecture.js'

// Walking-only addition at the city's positive-Z edge. No flight, traffic,
// camera, campaign or world-manager ownership is introduced here.
export const TERRACE_WALK=deepFreeze({
 id:'kashi-terrace-walk',bounds:{minX:142,maxX:350,minZ:120,maxZ:176},
 roads:[
  {id:'terrace-avenue',x:162,z:148,w:12,d:56},
  {id:'terrace-east-spine',x:292,z:148,w:12,d:56},
  {id:'terrace-cross-street',x:246,z:140,w:208,d:10}
 ],
 paths:[{id:'terrace-loop',x:250,z:168,w:176,d:6},{id:'plaza-spine',x:264,z:154,w:4,d:28}],
 portals:[{x:162,z:120,width:18},{x:292,z:120,width:18}],
 plaza:{x:264,z:155,w:36,d:24},
 buildings:[
  {id:'terrace-arcade',label:'Terrace arcade',x:214,z:155,w:20,d:16,h:9,front:1,door:false},
  {id:'terrace-hall',label:'Terrace hall',x:326,z:155,w:20,d:18,h:14,front:1,door:true}
 ],
 approaches:[
  {buildingId:'terrace-arcade',points:[[214,163],[214,168],[162,168]]},
  {buildingId:'terrace-hall',points:[[326,164],[326,168],[292,168]]}
 ]
})
export const TERRACE_INTERIORS=deepFreeze(TERRACE_WALK.buildings.map((b,index)=>({id:b.id,label:b.label,number:index+13,front:b.front,floor:-.175,door:b.door,entry:[b.x,-.175,b.z+b.d/2],bounds:{minX:b.x-b.w/2+.7,maxX:b.x+b.w/2-.7,minZ:b.z-b.d/2+.7,maxZ:b.z+b.d/2-.7}})))
export const TERRACE_LIGHTS=deepFreeze({'terrace-arcade':'#ffce9c','terrace-hall':'#c7dcec'})

function same(values,expected){return values.length===expected.length&&values.every((v,i)=>Math.abs(v-expected[i])<1e-6)}
// Cut only the two known seam rails before scene/collider compilation. Fail
// explicitly if the prior layout changes; never erase arbitrary geometry.
function openSeam({batches,collisions,box}){
 const pieces=batches.get('box:dark')?.parts
 requireCondition(pieces,'TERRACE_SEAM_UNAVAILABLE','Existing city rail batch required')
 const rails=[{at:[176,.4,120],size:[144,1.2,.7],segments:[[104,153],[171,248]]},{at:[308,.4,120],size:[120,1.2,.7],segments:[[248,283],[301,368]]}]
 // Validate all visual/collision sources before making either opening.
 for(const rail of rails)for(const list of [pieces,collisions])requireCondition(list.filter(p=>same(p.at,rail.at)&&same(p.size,rail.size)).length===1,'TERRACE_SEAM_UNAVAILABLE','Expected north-edge rail must exist exactly once')
 for(const rail of rails){
  for(const list of [pieces,collisions]){const index=list.findIndex(p=>same(p.at,rail.at)&&same(p.size,rail.size));list.splice(index,1)}
  for(const [a,b] of rail.segments)box('dark',[(a+b)/2,.4,120],[b-a,1.2,.7],true)
 }
}

export function appendTerraceWalk({box,part,batches,collisions,doors}){
 const start=collisions.length
 openSeam({batches,collisions,box})
 // openSeam removes earlier records, so tag new public surfaces immediately
 // rather than relying on indices captured before the two removals.
 for(const c of collisions)if(c.at[1]===.4&&c.at[2]===120&&c.size[2]===.7)c.buildingId='terrace-public-surfaces'
 const publicBox=(material,at,size)=>{box(material,at,size,true);collisions.at(-1).buildingId='terrace-public-surfaces'}
 publicBox('stone',[246,-.43,148],[208,.42,56])
 for(const road of TERRACE_WALK.roads)publicBox('road',[road.x,-.205,road.z],[road.w,.025,road.d])
 for(const path of TERRACE_WALK.paths)publicBox('walk',[path.x,-.205,path.z],[path.w,.025,path.d])
 const plaza=TERRACE_WALK.plaza
 publicBox('walk',[plaza.x,-.205,plaza.z],[plaza.w,.025,plaza.d])
 for(const x of [142,350])publicBox('dark',[x,.4,148],[.7,1.2,56])
 publicBox('dark',[246,.4,176],[208,1.2,.7])
 for(const route of TERRACE_WALK.approaches)for(let i=1;i<route.points.length;i++){
  const a=route.points[i-1],b=route.points[i],dx=Math.abs(a[0]-b[0]),dz=Math.abs(a[1]-b[1])
  publicBox('walk',[(a[0]+b[0])/2,-.205,(a[1]+b[1])/2],[dx?dx+1:4,.025,dz?dz+1:4])
 }
 // Crossings and paired route lights retain a clear pedestrian lane.
 for(const x of [162,292]){
  for(let z=116;z<=172;z+=7)for(const side of [-1,1])box('cyan',[x+side*5.3,-.18,z],[.12,.012,2])
  for(const z of [132,148])for(let dx=-4;dx<=4;dx+=2)box('light',[x+dx,-.18,z],[1,.025,3])
 }
 for(const b of TERRACE_WALK.buildings){
  const room=TERRACE_INTERIORS.find(r=>r.id===b.id),first=collisions.length,front=room.entry[2],side=(b.w-3.6)/2,color=b.door?'indigo':'stone'
  box('walk',[b.x,room.floor-.025,b.z],[b.w-1.4,.05,b.d-1.4],true)
  for(const x of [b.x-b.w/2+.35,b.x+b.w/2-.35])box(color,[x,2.4,b.z],[.7,5.2,b.d],true)
  box(color,[b.x,2.4,b.z-b.d/2+.35],[b.w,5.2,.7],true)
  for(const x of [b.x-1.8-side/2,b.x+1.8+side/2])box(color,[x,2.4,front],[side,5.2,.7],true)
  box(color,[b.x,3.99,front],[3.6,1.73,.7],true)
  box('dark',[b.x,5.1,b.z],[b.w,.24,b.d],true)
  if(b.door){
   doors.set(b.id,{room,mesh:null,collider:null});collisions.push({at:[b.x,room.floor+1.65,front],size:[3.6,3.3,.18],doorId:b.id})
   // Side reading alcoves and a rear display wall are physical furnishings,
   // not unimplemented interactable services. The central aisle stays clear.
   for(const dx of [-6.5,6.5]){
    box('dark',[b.x+dx,.5,b.z-1],[2.1,1.3,7],true)
    box('brass',[b.x+dx,1.2,b.z-1],[2.4,.12,7.3])
    for(const z of [b.z-4,b.z+2])box('light',[b.x+dx,3.1,z],[1.7,.08,1.6])
   }
   box('indigo',[b.x,9.5,b.z],[b.w*.75,8,b.d*.7],true)
   for(const x of [-5,0,5]){box('window',[b.x+x,8.4,b.z+b.d*.35+.1],[3,1.6,.12]);box('brass',[b.x+x,11.4,b.z+b.d*.35+.1],[.12,4,.18])}
   box('light',[b.x,13.75,b.z],[b.w*.8,.4,b.d*.75])
   for(const dx of [-4,0,4])box('cyan',[b.x+dx,3,b.z-b.d/2+.8],[2,.15,.08])
  }else{
   for(const dx of [-6.5,6.5]){
    box('brass',[b.x+dx,.45,b.z],[2,1.2,6],true)
    box('indigo',[b.x+dx,4.4,b.z],[3,.12,10])
   }
   for(const dx of [-6,0,6])part('arch','brass',[b.x+dx,6.1,b.z],[2.4,2.1,2.5])
   for(let tier=0;tier<3;tier++)box('light',[b.x,5.7+tier*.7,b.z],[b.w-tier*2,.18,b.d-tier*2])
   for(const dx of [-4,0,4])box('indigo',[b.x+dx,room.floor+.005,b.z],[2,.008,7])
  }
  for(const dx of [-2.3,2.3])box('cyan',[b.x+dx,1.8,front+.4],[.12,3.4,.14])
  const strokes={a:[0,.24,.4,.05],b:[.22,.12,.05,.24],c:[.22,-.12,.05,.24],d:[0,-.24,.4,.05],e:[-.22,-.12,.05,.24],f:[-.22,.12,.05,.24],g:[0,0,.4,.05]},digits={1:'bc',3:'abgcd',4:'fgbc'}
  box('dark',[b.x,3.7,front+.5],[3,.8,.15])
  for(const [i,digit] of [...String(room.number)].entries())for(const key of digits[digit]){const [x,y,w,h]=strokes[key];box('cyan',[b.x+(i-.5)*.7+x,3.7+y,front+.6],[w,h,.03])}
  appendTerraceBuildingFinish({b,room,box,part})
  for(let i=first;i<collisions.length;i++)if(!collisions[i].doorId)collisions[i].buildingId=b.id
 }
 // Furniture edges leave the plaza's north/south and east/west axes open.
 for(const x of [252,276])for(const z of [149,161]){
  publicBox('dark',[x,.15,z],[3,.7,1.2]);box('brass',[x,.54,z],[3.2,.08,1.4])
 }
 for(const x of [246.8,281.2]){publicBox('dark',[x,.25,155],[1.2,.9,3]);part('cylinder','leaf',[x,.95,155],[.45,.6,.9])}
 appendTerracePlazaFinish({box,part,publicBox,plaza})
 requireCondition(collisions.length>start,'TERRACE_CONTENT_UNAVAILABLE','Terrace surfaces were not appended')
}
