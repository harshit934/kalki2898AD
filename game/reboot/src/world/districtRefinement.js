import {deepFreeze} from '../campaign/contracts.js'

// These are approach paths to existing rooms, not additional destinations.
// Every segment is axis-aligned so its visible slab and Rapier box agree.
export const KASHI_APPROACHES=deepFreeze([
 {buildingId:'sandstone-arcade',points:[[126,29],[126,33],[142,33]]},
 {buildingId:'indigo-court',points:[[126,92],[126,88],[142,88]]},
 {buildingId:'stepped-tower',points:[[187,20],[187,40]]},
 {buildingId:'split-spire',points:[[224,22],[224,40]]},
 {buildingId:'gate-pavilion',points:[[116,71],[116,84]]},
 {buildingId:'terrace-tower',points:[[180,95],[180,84],[162,84]]},
 {buildingId:'civic-landmark',points:[[216,85],[216,68]]}
])
export const KASHI_ROOM_FINISHES=deepFreeze({
 'sandstone-arcade':{accent:'brass',light:'#ffd0a0',pattern:'market-inlay'},
 'indigo-court':{accent:'indigo',light:'#b9c9ff',pattern:'court-mosaic'},
 'stepped-tower':{accent:'cyan',light:'#9fe5e1',pattern:'workshop-circuits'},
 'split-spire':{accent:'brass',light:'#d7c5ff',pattern:'twin-ribs'},
 'gate-pavilion':{accent:'light',light:'#ffdab2',pattern:'checkpoint-bands'},
 'terrace-tower':{accent:'indigo',light:'#ffc7a0',pattern:'lounge-panels'},
 'civic-landmark':{accent:'brass',light:'#ffe7b8',pattern:'civic-medallion'}
})

export function appendDistrictRefinement({box,part,interiors,buildings}){
 for(const route of KASHI_APPROACHES){
  for(let index=1;index<route.points.length;index++){
  const a=route.points[index-1],b=route.points[index],dx=Math.abs(b[0]-a[0]),dz=Math.abs(b[1]-a[1]),x=(a[0]+b[0])/2,z=(a[1]+b[1])/2
  box('walk',[x,-.205,z],[dx?dx+1:4,.025,dz?dz+1:4],true)
  // Flush segmented edge lights and brass threshold bands preserve a clear
  // four-metre corridor rather than adding curbs across the walking route.
  const length=dx||dz
  for(let d=2;d<length;d+=4){const u=d/length,px=a[0]+(b[0]-a[0])*u,pz=a[1]+(b[1]-a[1])*u
   for(const side of [-1,1])box('cyan',[px+(dz?side*1.7:0),-.187,pz+(dx?side*1.7:0)],[dz?.1:1.1,.012,dx?.1:1.1])
  }
  }
 }
 for(const room of interiors){
  const b=buildings.find(value=>value.id===room.id),finish=KASHI_ROOM_FINISHES[room.id],backZ=b.z-room.front*(b.d/2-.8)
  // Entrance canopy, flanking fins and a three-bar public-wayfinding motif.
  // All new overhead detail is above the 3.35m door opening.
  box('brass',[b.x,room.floor+4.45,room.entry[2]+room.front*.8],[5.8,.18,2.2])
  for(const dx of [-2.8,2.8]){
   box(finish.accent,[b.x+dx,room.floor+2,room.entry[2]+room.front*.45],[.22,3.7,.22])
   for(let band=0;band<3;band++)box('light',[b.x+dx,room.floor+.65+band*.32,room.entry[2]+room.front*.58],[.45,.08,.08])
  }
  // Wall-mounted treatments stay clear of the existing player walking lane.
  for(const side of [-1,1]){
   const wallX=b.x+side*(b.w/2-.8)
   for(let panel=-1;panel<=1;panel++){
    box(finish.accent,[wallX,room.floor+2.4,b.z+panel*2.5],[.1,1.5,1.6])
    box('brass',[wallX-side*.08,room.floor+3.25,b.z+panel*2.5],[.08,.08,1.7])
   }
  }
  if(room.id==='sandstone-arcade'){
   for(const dx of [-4,4]){box('indigo',[b.x+dx,room.floor+3.75,b.z],[2.6,.09,b.d-3]);box('brass',[b.x+dx,room.floor+.005,b.z],[1.8,.008,5])}
  }else if(room.id==='indigo-court'){
   for(const dx of [-3,0,3])for(const dz of [-3,0,3])box('indigo',[b.x+dx,room.floor+.005,b.z+dz],[1.6,.008,1.6])
  }else if(room.id==='stepped-tower'){
   for(const side of [-1,1])for(let line=0;line<3;line++)box('cyan',[b.x+side*5,room.floor+2.1+line*.3,backZ],[2.8,.055,.06])
  }else if(room.id==='split-spire'){
   for(const dx of [-5,5])for(const dz of [-4,0,4])box('brass',[b.x+dx,room.floor+4.9,b.z+dz],[.14,1.8,.14])
  }else if(room.id==='gate-pavilion'){
   for(let line=0;line<4;line++)box('brass',[b.x+2.5,room.floor+1.7+line*.3,backZ],[2.8,.1,.09])
  }else if(room.id==='terrace-tower'){
   for(const dx of [-4,0,4])box('indigo',[b.x+dx,room.floor+5.7,b.z],[2.4,.12,5])
  }else{
   for(const dx of [-2,2])for(const dz of [-2,2])box('light',[b.x+dx,room.floor+.005,b.z+dz],[1.4,.008,1.4])
   // Crown detailing reads from the city approach without another light,
   // shadow map, reflection target or material allocation.
   for(const dx of [-6,6])box('cyan',[b.x+dx,b.h+1.3,b.z],[.18,1.4,4])
   part('cylinder','brass',[b.x,b.h+1.5,b.z],[7.1,.2,7.1])
  }
 }
}
