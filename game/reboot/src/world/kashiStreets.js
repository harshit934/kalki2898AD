import {deepFreeze,requireCondition} from '../campaign/contracts.js'

// Metres, Y-up. Ground-level streets only; no new interiors or roof access.
export const KASHI_STREETS=deepFreeze({
 id:'kashi-north-street-quarter',bounds:{minX:142,maxX:350,minZ:176,maxZ:310},
 gateways:[{x:162,z:176,width:18},{x:292,z:176,width:18}],
 roads:[...[162,228,292].map(x=>({x,z:243,w:x===228?10:12,d:134})),
  ...[196,246,294].map(z=>({x:246,z,w:208,d:12}))],
 buildings:[
  {id:'north-arcade',x:190,z:220,w:26,d:24,h:18,front:-1,style:'arcade'},
  {id:'copper-exchange',x:260,z:220,w:26,d:24,h:32,front:-1,style:'stepped'},
  {id:'east-signal-hall',x:324,z:220,w:22,d:24,h:24,front:-1,style:'split'},
  {id:'textile-chambers',x:190,z:270,w:28,d:26,h:28,front:1,style:'stepped'},
  {id:'north-records',x:260,z:270,w:24,d:26,h:40,front:1,style:'split'},
  {id:'east-courier-house',x:324,z:270,w:24,d:26,h:16,front:1,style:'arcade'}
 ]
})

export function appendKashiStreets({box,part,batches,collisions}){
 // Fail closed if upstream geometry changes: open both visual and solid rails.
 const matches=p=>p.at.every((v,i)=>Math.abs(v-[246,.4,176][i])<1e-6)&&
  p.size.every((v,i)=>Math.abs(v-[208,1.2,.7][i])<1e-6)
 const visual=batches.get('box:dark')?.parts
 for(const list of [visual,collisions])requireCondition(list?.filter(matches).length===1,
  'STREET_SEAM_UNAVAILABLE','Expected north Terrace rail must exist exactly once')
 for(const list of [visual,collisions])list.splice(list.findIndex(matches),1)
 const solid=(mat,at,size,group='north-street-public')=>{
  box(mat,at,size,true);collisions.at(-1).buildingId=group
 }
 for(const [a,b]of [[142,153],[171,283],[301,350]])solid('dark',[(a+b)/2,.4,176],[b-a,1.2,.7])
 solid('stone',[246,-.43,243],[208,.42,134])
 for(const road of KASHI_STREETS.roads)box('road',[road.x,-.205,road.z],[road.w,.025,road.d])
 for(const x of [142,350])solid('dark',[x,.4,243],[.7,1.2,134])
 solid('dark',[246,.4,310],[208,1.2,.7])
 // Pavement segments stop at junctions, leaving roads/crossings continuous.
 for(const x of [162,228,292])for(const side of [-1,1])for(const [a,b]of [[179,189],[203,239],[253,287],[301,307]]){
  solid('light',[x+side*(x===228?6.4:7.4),-.16,(a+b)/2],[2.6,.12,b-a])
  for(let z=a+2;z<b;z+=7)box('brass',[x+side*(x===228?6.4:7.4),-.093,z],[.14,.012,1.8])
 }
 for(const z of [196,246,294])for(const x of [162,228,292])
  for(let dx=-4;dx<=4;dx+=2)box('light',[x+dx,-.185,z-4],[.9,.012,2.5])
 for(const b of KASHI_STREETS.buildings){
  const group=b.id,base=-.22,front=b.z+b.front*b.d/2,street=b.front<0?196:294
  // The ground-level mass is solid, with a clearly closed entrance panel.
  // Decorative upper setbacks/fins are exterior architecture, not playable rooms.
  solid(b.style==='split'?'indigo':'stone',[b.x,base+3,b.z],[b.w,6,b.d],group)
  // A sealed mass needs a solid volume: a triangle shell admits inside spawns.
  delete collisions.at(-1).buildingId
  if(b.style==='stepped')for(let tier=0;tier<3;tier++){
   const height=(b.h-6)/3,ratio=1-tier*.18
   solid('stone',[b.x,base+6+height*(tier+.5),b.z],[b.w*ratio,height,b.d*ratio],group)
   box('brass',[b.x,base+6+height*(tier+1),b.z],[b.w*ratio+.6,.3,b.d*ratio+.6])
  }
  else if(b.style==='split')for(const side of [-1,1]){
   solid('indigo',[b.x+side*b.w*.25,base+(6+b.h)/2,b.z],[b.w*.4,b.h-6,b.d*.8],group)
   box('light',[b.x+side*b.w*.25,base+b.h+.2,b.z],[b.w*.44,.4,b.d*.85])
  }
  else{
   solid('stone',[b.x,base+(6+b.h)/2,b.z],[b.w*.88,b.h-6,b.d*.88],group)
   for(const dx of [-b.w*.33,0,b.w*.33])part('arch','brass',[b.x+dx,base+4,front+b.front*1.1],[b.w*.15,1.2,1])
  }
  for(let y=8;y<b.h-1;y+=4)for(const side of [-1,1]){
   if(b.style==='split'){
    for(const tower of [-1,1]){const x=b.x+tower*b.w*.25;box('window',[x,base+y,b.z+side*(b.d*.4+.04)],[b.w*.28,1.8,.1]);box('brass',[x,base+y+1.2,b.z+side*(b.d*.4+.18)],[b.w*.32,.12,.5])}
    for(const dz of [-.2,.2])box('window',[b.x+side*(b.w*.45+.04),base+y,b.z+dz*b.d],[.1,1.8,b.d*.2])
    continue
   }
   // Window strips and brise-soleil sit outside the ground-floor facade.
   const ratio=b.style==='stepped'?1-Math.min(2,Math.floor((y-6)/((b.h-6)/3)))*.18:b.style==='split'?.8:.88
   for(const dx of [-.3,0,.3]){
    box('window',[b.x+dx*b.w*ratio,base+y,b.z+side*(b.d*ratio/2+.04)],[b.w*ratio*.21,1.8,.1])
    box('brass',[b.x+dx*b.w*ratio,base+y+1.2,b.z+side*(b.d*ratio/2+.18)],[b.w*ratio*.23,.12,.5])
   }
   for(const dz of [-.25,.25])box('window',[b.x+side*(b.w*ratio/2+.04),base+y,b.z+dz*b.d*ratio],[.1,1.8,b.d*ratio*.24])
  }
  // Recess-coloured sealed door, jambs, canopy and a four-metre clear approach.
  box('dark',[b.x,base+1.6,front+b.front*.04],[3.2,3.2,.1])
  for(const dx of [-1.85,1.85])box('brass',[b.x+dx,base+1.75,front+b.front*.13],[.3,3.5,.24])
  box('light',[b.x,base+3.6,front+b.front*.8],[5.2,.25,2])
  box('window',[b.x,base+4.5,front+b.front*.07],[4,1,.12])
  box('walk',[b.x,-.195,(front+street)/2],[4,.04,Math.abs(front-street)])
  for(const side of [-1,1]){
   solid('light',[b.x+side*(b.w/2+.35),base+2,front-b.front*2],[.6,4,1],group)
   box('brass',[b.x+side*(b.w/2+.35),base+4.2,front-b.front*2],[.8,.2,1.4])
  }
 }
}
