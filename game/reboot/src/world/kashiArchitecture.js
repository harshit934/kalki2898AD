import {requireCondition} from '../campaign/contracts.js'

// Shared authored primitives feed the district's existing instanced batches.
export function architecture({box,part,collisions},group){
 const solid=(mat,at,size,volume=false)=>{box(mat,at,size,true);if(!volume)collisions.at(-1).buildingId=group}
 const lamp=(x,z)=>{solid('brass',[x,1.4,z],[.14,3.2,.14]);box('cyan',[x,3.05,z],[.6,.25,.6])}
 function facade(b){
  const floor=-.22,front=b.z-b.d/2
  solid(b.mat??'stone',[b.x,floor+b.h/2,b.z],[b.w,b.h,b.d],true)
  for(let y=3;y<b.h;y+=3.5){
   box('brass',[b.x,floor+y+1.1,front-.12],[b.w+.4,.16,.4])
   for(const dx of [-.3,0,.3]){
    box('window',[b.x+dx*b.w,floor+y,front-.04],[b.w*.2,1.5,.1])
    box('light',[b.x+dx*b.w,floor+y+.95,front-.7],[b.w*.23,.16,1.5])
   }
   if(y>4&&b.balcony){solid('light',[b.x,floor+y-1,front-.9],[b.w*.65,.2,2]);solid('brass',[b.x,floor+y-.4,front-1.8],[b.w*.65,1.1,.14])}
  }
  box('dark',[b.x,1.2,front-.06],[2,2.8,.12])
  box('brass',[b.x,3.2,front-.12],[3.2,.5,.18])
  // Cyan tally marks are physical sign graphics, not a promise of an interior.
  for(let i=0;i<(b.mark??2);i++)box('cyan',[b.x-.65+i*.45,3.2,front-.23],[.12,.25,.08])
  solid('light',[b.x,floor+b.h+.15,b.z],[b.w+.6,.3,b.d+.6])
  if(b.roof==='dome')part('dome','brass',[b.x,floor+b.h+.3,b.z],[b.w*.34,3,b.d*.34])
  else{solid('indigo',[b.x+b.w*.2,floor+b.h+1.5,b.z],[b.w*.35,2.7,b.d*.4]);box('cyan',[b.x+b.w*.2,floor+b.h+2.9,b.z],[b.w*.3,.1,b.d*.35])}
 }
 return {solid,lamp,facade}
}

// Validate every visual AND collision seam before changing either array.
export function openAuthoredSeams({batches,collisions},specs,code){
 const targets=specs.map(s=>{
  const match=p=>p.at.every((v,i)=>Math.abs(v-s.at[i])<1e-5)&&p.size.every((v,i)=>Math.abs(v-s.size[i])<1e-5)
  const visual=batches.get('box:'+s.mat)?.parts
  for(const list of [visual,collisions])requireCondition(list?.filter(match).length===1,code,'Expected authored seam must exist exactly once')
  return {visual,match}
 })
 for(const {visual,match}of targets)for(const list of [visual,collisions])list.splice(list.findIndex(match),1)
}
