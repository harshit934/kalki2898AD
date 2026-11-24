import {deepFreeze} from '../campaign/contracts.js'

// East of the existing x=248 edge, sharing its metre/Y-up coordinate system.
// Environment names introduce no campaign characters, rewards or story events.
export const KASHI_NEIGHBORHOOD=deepFreeze({
 id:'kashi-east-courts',bounds:{minX:248,maxX:368,minZ:-24,maxZ:120},
 roads:[
  {id:'east-spine',x:292,z:48,w:12,d:144},
  {id:'east-cross',x:308,z:40,w:120,d:12},
  {id:'east-north',x:308,z:84,w:120,d:8},
  {id:'market-lane',x:308,z:28,w:80,d:6},
  {id:'east-promenade',x:259,z:68,w:66,d:6}
 ],
 buildings:[
  {id:'copper-market',label:'Copper market hall',x:270,z:10,w:18,d:18,h:11,front:1,door:false,kind:'market'},
  {id:'weavers-court',label:'Weavers court',x:338,z:10,w:24,d:18,h:17,front:1,door:false,kind:'court'},
  {id:'archive-house',label:'Archive house',x:270,z:100,w:18,d:20,h:26,front:-1,door:true,kind:'archive'},
  {id:'transit-lodge',label:'Transit lodge',x:338,z:100,w:26,d:20,h:20,front:-1,door:true,kind:'lodge'},
  {id:'sun-clock',label:'Sun-clock pavilion',x:338,z:60,w:14,d:14,h:12,front:-1,door:false,kind:'pavilion'}
 ],
 plaza:{id:'east-courts-plaza',x:324,z:60,w:44,d:24},
 portals:[{x:248,z:40,width:18},{x:248,z:68,width:10}],
 approaches:[
  {buildingId:'copper-market',points:[[270,19],[270,28],[292,28]]},
  {buildingId:'weavers-court',points:[[338,19],[338,28],[292,28]]},
  {buildingId:'archive-house',points:[[270,90],[270,84],[292,84]]},
  {buildingId:'transit-lodge',points:[[338,90],[338,84],[292,84]]},
  {buildingId:'sun-clock',points:[[338,53],[338,46],[310,46],[310,68],[292,68]]}
 ]
})
export const NEIGHBORHOOD_INTERIORS=deepFreeze(KASHI_NEIGHBORHOOD.buildings.map((b,index)=>({
 id:b.id,label:b.label,number:index+8,front:b.front,floor:-.175,door:b.door,
 entry:[b.x,-.175,b.z+b.front*b.d/2],
 bounds:{minX:b.x-b.w/2+.7,maxX:b.x+b.w/2-.7,minZ:b.z-b.d/2+.7,maxZ:b.z+b.d/2-.7}
})))
export const NEIGHBORHOOD_LIGHTS=deepFreeze({'copper-market':'#ffd0a0','weavers-court':'#bfcaff','archive-house':'#b9e5da','transit-lodge':'#ffd8ad','sun-clock':'#ffe8af'})

// Appends to the original district's batches and resource ledger. No renderer,
// independent world, texture loader, subscription or save authority is created.
export function appendKashiNeighborhood({box,part,collisions,doors}){
 const neighborhoodStart=collisions.length
 box('stone',[308,-.43,48],[120,.42,144],true)
 for(const road of KASHI_NEIGHBORHOOD.roads)box(road.id==='east-promenade'?'walk':'road',[road.x,-.205,road.z],[road.w,.025,road.d],true)
 const plaza=KASHI_NEIGHBORHOOD.plaza
 box('walk',[plaza.x,-.205,plaza.z],[plaza.w,.025,plaza.d],true)
 // Retain original outer rails; extend their enclosure along the new floor.
 box('dark',[368,.4,48],[.7,1.2,144],true)
 for(const z of [-24,120])box('dark',[308,.4,z],[120,1.2,.7],true)
 for(const route of KASHI_NEIGHBORHOOD.approaches)for(let i=1;i<route.points.length;i++){
  const a=route.points[i-1],b=route.points[i],dx=Math.abs(b[0]-a[0]),dz=Math.abs(b[1]-a[1])
  box('walk',[(a[0]+b[0])/2,-.205,(a[1]+b[1])/2],[dx?dx+1:4,.025,dz?dz+1:4],true)
 }
 // Road markings, crossing strips and a luminous promenade guide both ways.
 for(let z=-18;z<116;z+=8)if(Math.abs(z-40)>10&&Math.abs(z-84)>8)box('brass',[292,-.184,z],[.12,.012,3])
 for(const x of [283,301])for(let z=35;z<=45;z+=2)box('light',[x,-.18,z],[3,.025,1])
 for(let x=228;x<292;x+=6)for(const side of [-1,1])box('cyan',[x,-.18,68+side*2.6],[2,.012,.12])
 for(const b of KASHI_NEIGHBORHOOD.buildings){
  const start=collisions.length,room=NEIGHBORHOOD_INTERIORS.find(r=>r.id===b.id),color=b.kind==='court'||b.kind==='lodge'?'indigo':'stone'
  const front=room.entry[2],back=b.z-b.front*(b.d/2-.35),sideWidth=(b.w-4)/2
  box('walk',[b.x,room.floor-.025,b.z],[b.w-1.4,.05,b.d-1.4],true)
  for(const x of [b.x-b.w/2+.35,b.x+b.w/2-.35])box(color,[x,2.4,b.z],[.7,5.2,b.d],true)
  box(color,[b.x,2.4,back],[b.w,5.2,.7],true)
  for(const x of [b.x-2-sideWidth/2,b.x+2+sideWidth/2])box(color,[x,2.4,front],[sideWidth,5.2,.7],true)
  box(color,[b.x,b.door?3.99:4.4,front],[4,b.door?1.73:1.2,.7],true)
  box('dark',[b.x,5,b.z],[b.w,.24,b.d],true)
  if(b.door){doors.set(b.id,{room,mesh:null,collider:null});collisions.push({at:[b.x,room.floor+1.65,front],size:[3.6,3.3,.18],doorId:b.id})}
  // Each facade has a different upper mass and indoor use, while retaining a
  // four-metre entrance and a clear central lane all the way to the back wall.
  if(b.kind==='market'){
   for(const dx of [-5,5]){box('brass',[b.x+dx,.45,b.z],[2.2,1.2,8],true);box('indigo',[b.x+dx,4.3,b.z],[3,.12,12])}
   for(const dx of [-5,0,5])part('arch','brass',[b.x+dx,8,b.z],[2.2,2.2,3])
   box('light',[b.x,6.5,b.z],[b.w+1,2,b.d*.7])
  }else if(b.kind==='court'){
   for(const dx of [-8,8])box(color,[b.x+dx,10,b.z],[5,10,b.d*.8])
   for(const dx of [-7,7]){box('light',[b.x+dx,.35,b.z-3],[2,.9,4],true);box('brass',[b.x+dx,3.7,b.z+3],[2,.12,5])}
   part('arch','brass',[b.x,12,b.z],[5,4,3])
  }else if(b.kind==='archive'){
   for(let tier=0;tier<3;tier++)box('stone',[b.x,8.5+tier*6,b.z],[b.w*(.9-tier*.17),6,b.d*(.9-tier*.17)])
   for(const dx of [-6,6])for(const height of [.7,1.7,2.7])box('brass',[b.x+dx,height,b.z],[2,.12,9])
   for(const dx of [-6,6])box('dark',[b.x+dx,1.4,b.z],[2.2,3,9],true)
  }else if(b.kind==='lodge'){
   for(const dx of [-8,8])box(color,[b.x+dx,11,b.z],[7,12,b.d*.8])
   box('light',[b.x,17,b.z],[b.w,.5,b.d*.85])
   for(const dx of [-8,8])box('indigo',[b.x+dx,.35,b.z],[2,1,10],true)
   box('brass',[b.x,4.3,b.z],[7,.15,8])
  }else{
   for(const dx of [-5,5])for(const dz of [-4,4])part('cylinder','brass',[b.x+dx,3.2,b.z+dz],[.25,6,.25])
   box('light',[b.x,7,b.z],[b.w+2,.45,b.d+2])
   part('cylinder','brass',[b.x,9,b.z],[4,.8,4]);part('dome','light',[b.x,9.4,b.z],[4,2.5,4])
   for(const dx of [-3,0,3])box('cyan',[b.x+dx,7.7,front+.12],[.15,1,.15])
  }
  for(const dx of [-b.w*.32,b.w*.32]){
   box('light',[b.x+dx,3.5,front+b.front*.35],[.28,3,.3])
   box('cyan',[b.x+dx,2,front+b.front*.55],[.1,2.2,.1])
  }
  for(let level=7;level<b.h;level+=4)for(const dx of [-.28,.28])box('window',[b.x+b.w*dx,level,front-b.front*.8],[b.w*.2,1.1,.12])
  box('brass',[b.x,4.9,front+b.front*.8],[5,.15,2])
  // Two-digit geometric wayfinding, using existing shared geometry/materials.
  const strokes={a:[0,.24,.4,.05],b:[.22,.12,.05,.24],c:[.22,-.12,.05,.24],d:[0,-.24,.4,.05],e:[-.22,-.12,.05,.24],f:[-.22,.12,.05,.24],g:[0,0,.4,.05]},digits=['abcdef','bc','abged','abgcd','fgbc','afgcd','afgecd','abc','abcdefg','abfgcd']
  const text=String(room.number);box('dark',[b.x,3.7,front+b.front*.5],[3,.8,.16])
  for(let i=0;i<text.length;i++)for(const key of digits[Number(text[i])]){const [x,y,w,h]=strokes[key];box('cyan',[b.x+(i-(text.length-1)/2)*.7+x*b.front,3.7+y,front+b.front*.6],[w,h,.03])}
  for(let i=start;i<collisions.length;i++)if(!collisions[i].doorId)collisions[i].buildingId=b.id
 }
 // Benches and low planted islands flank the public square, not its route.
 for(const z of [49,71])for(const x of [316,326]){
  box('dark',[x,.1,z],[3,.6,1],true);box('brass',[x,.43,z],[3.3,.08,1.2])
 }
 for(const x of [304,356]){box('dark',[x,.2,60],[2,.8,3],true);part('cylinder','leaf',[x,.8,60],[.8,.6,1.2])}
 // One compound static resource for public surfaces, rather than a rigid body
 // per road tile. Door colliders remain independently toggleable.
 for(let i=neighborhoodStart;i<collisions.length;i++)if(!collisions[i].buildingId&&!collisions[i].doorId)collisions[i].buildingId='east-public-surfaces'
}
