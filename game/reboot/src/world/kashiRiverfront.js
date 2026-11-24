import {deepFreeze,requireCondition} from '../campaign/contracts.js'

// Metres, Y-up. The water is scenery; only authored stairs/decks are playable.
export const KASHI_RIVERFRONT=deepFreeze({
 id:'kashi-east-ghats',streetY:-.22,promenadeY:-1.62,bridgeY:1,
 ghats:[{id:'south-steps',z:196},{id:'north-steps',z:294}],
 regions:[{minX:350,maxX:370,minZ:184,maxZ:208},
  {minX:350,maxX:370,minZ:282,maxZ:306},
  {minX:366,maxX:376,minZ:180,maxZ:310},
  {minX:350,maxX:416,minZ:242,maxZ:250},
  {minX:414,maxX:430,minZ:236,maxZ:256}],
 promenade:{x:371,minZ:180,maxZ:310,width:10},
 bridge:{minX:368,maxX:416,z:246,width:8},
 landing:{x:422,z:246,width:16,depth:20},
 water:{minX:376,maxX:414,minZ:176,maxZ:314,y:-2.3}
})

export function appendKashiRiverfront({box,part,batches,collisions}){
 const match=p=>p.at.every((v,i)=>Math.abs(v-[350,.4,243][i])<1e-6)&&
  p.size.every((v,i)=>Math.abs(v-[.7,1.2,134][i])<1e-6)
 const visual=batches.get('box:dark')?.parts
 for(const list of [visual,collisions])requireCondition(list?.filter(match).length===1,
  'RIVERFRONT_SEAM_UNAVAILABLE','Expected east street rail must exist exactly once')
 for(const list of [visual,collisions])list.splice(list.findIndex(match),1)
 const solid=(mat,at,size,group='riverfront-public')=>{box(mat,at,size,true);collisions.at(-1).buildingId=group}
 for(const [a,b]of [[176,184],[208,242],[250,282],[306,310]])solid('dark',[350,.4,(a+b)/2],[.7,1.2,b-a])
 const lower=KASHI_RIVERFRONT.promenadeY
 solid('stone',[371,lower-.3,245],[10,.6,130])
 // Keep the landward edge contained between the two wide ghat stairs.
 for(const [a,b]of [[180,184],[208,242],[250,282],[306,310]])solid('stone',[366.05,lower+.5,(a+b)/2],[.2,1,b-a])
 function railing(axis,fixed,from,to,floor,group='riverfront-public'){
  const at=(along,y)=>axis==='z'?[fixed,y,along]:[along,y,fixed]
  const size=(thickness,height,length)=>axis==='z'?[thickness,height,length]:[length,height,thickness]
  solid('stone',at((from+to)/2,floor+.14),size(.26,.28,to-from),group)
  solid('brass',at((from+to)/2,floor+2.25),size(.18,.14,to-from),group)
  // Real narrow-spaced bars, not an invisible full-height collision wall.
  for(let p=from;p<=to+.001;p+=.5)solid('brass',at(p,floor+1.2),[.12,2.4,.12],group)
 }
 railing('z',375.8,180,310,lower)
 railing('x',180,366,376,lower);railing('x',310,366,376,lower)
 for(const g of KASHI_RIVERFRONT.ghats){
  for(let i=0;i<14;i++){
   const x=350+(i+.5)*1.2,top=-.22-(i+1)*.1
   solid('light',[x,(top-2.2)/2,g.z],[1.22,top+2.2,24])
   box('brass',[x+.5,top+.008,g.z],[.08,.016,23.5])
   for(const side of [-1,1]){
    solid('stone',[x,top+.3,g.z+side*11.9],[1.22,.6,.25])
    solid('brass',[x,top+1.05,g.z+side*11.9],[1.22,.12,.18])
   }
  }
  // Detailed entry piers and arch stand outside the clear central walking line.
  for(const side of [-1,1]){
   solid('stone',[349,1.8,g.z+side*10],[1.6,4,1.6])
   part('cylinder','brass',[349,4.2,g.z+side*10],[1.1,.5,1.1])
   part('dome','light',[349,4.5,g.z+side*10],[1.1,.7,1.1])
   box('window',[349,2,g.z+side*9.15],[.7,2,.12])
  }
  part('arch','brass',[349,4.1,g.z],[9.5,2,1],Math.PI/2)
 }
 // The central cross-street approaches a raised bridge. The lower promenade
 // continues under its deck with 2.42m of physical headroom.
 for(let i=0;i<18;i++){
  const top=-.22+(i+1)*(1.22/18),x=350+i+.5
  solid('walk',[x,(top-2.2)/2,246],[1.02,top+2.2,8],'riverfront-bridge')
  for(const side of [-1,1])solid('brass',[x,top+.7,246+side*3.9],[1.02,1.4,.18],'riverfront-bridge')
 }
 solid('walk',[392,.9,246],[48,.2,8],'riverfront-bridge')
 for(const z of [242.1,249.9])railing('x',z,368,430,1,'riverfront-bridge')
 // Supports lie in the water, leaving the entire lower promenade unobstructed.
 for(const x of [384,402])for(const z of [243,249]){
  solid('stone',[x,-.8,z],[1.2,3.4,1.2],'riverfront-bridge')
  box('brass',[x,.7,z],[1.8,.25,1.8])
 }
 solid('light',[422,.7,246],[16,.6,20],'riverfront-landing')
 railing('z',429.8,236,256,1,'riverfront-landing')
 for(const z of [236,256])railing('x',z,414,430,1,'riverfront-landing')
 for(const [a,b]of [[236,242],[250,256]])railing('z',414,a,b,1,'riverfront-landing')
 // Scenery shares the existing district instancing/material lifetime.
 box('river',[395,-2.35,245],[38,.1,138])
 for(let z=186;z<308;z+=8){box('brass',[371,lower+.014,z],[.16,.018,2]);box('dark',[374.9,lower+.05,z],[.6,.1,1.5])}
}
