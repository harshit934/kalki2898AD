import {deepFreeze} from '../campaign/contracts.js'
import {architecture} from './kashiArchitecture.js'

export const KASHI_CITY=deepFreeze({
 id:'kashi-connected-city',
 landmarks:[
  {id:'street-quarter',label:'North Street Quarter',position:[292,-.22,246]},
  {id:'temple-precinct',label:'Temple Forecourt',position:[256,-.22,346]},
  {id:'market-lanes',label:'Lantern Market',position:[194,-.22,366]},
  {id:'residential-courts',label:'Residential Water Court',position:[78,-.22,374]},
  {id:'river-promenade',label:'Lower River Promenade',position:[371,-1.62,220]},
  {id:'river-bridge',label:'River Bridge',position:[390,1,246]}
 ],
 joins:[{id:'terrace-west',at:[162,-.22,176]},{id:'terrace-east',at:[292,-.22,176]},
  {id:'market-west',at:[162,-.22,310]},{id:'temple-east',at:[292,-.22,310]},
  {id:'homes-south',at:[142,-.22,334]},{id:'homes-north',at:[142,-.22,430]},
  {id:'river-stairs',at:[371,-.22,328]}],
 skyline:[{x:42,z:488,w:20,d:22,h:46},{x:110,z:510,w:26,d:24,h:65},
  {x:184,z:482,w:18,d:22,h:42},{x:316,z:505,w:24,d:30,h:58},
  {x:452,z:190,w:18,d:22,h:40},{x:460,z:310,w:24,d:20,h:54},{x:450,z:418,w:16,d:18,h:38}]
})

function subtract(a,b){
 const left=Math.max(a.l,b.l),right=Math.min(a.r,b.r),near=Math.max(a.n,b.n),far=Math.min(a.f,b.f)
 if(left>=right||near>=far)return [a]
 return [{l:a.l,r:left,n:a.n,f:a.f},{l:right,r:a.r,n:a.n,f:a.f},
  {l:left,r:right,n:a.n,f:near},{l:left,r:right,n:far,f:a.f}].filter(p=>p.r-p.l>1e-6&&p.f-p.n>1e-6)
}

// Preserve the exact union of authored flat road surfaces; only overdraw changes.
// Physics bodies, texture scale, non-flat parts and the old district are untouched.
export function normalizeCityStreetSurfaces(batches){
 const metrics={inputInstances:0,outputInstances:0,inputArea:0,outputArea:0}
 for(const key of ['box:road','box:walk']){
  const batch=batches.get(key);if(!batch)continue
  const patches=[],untouched=[]
  for(const p of batch.parts){
   if(p.rotation!==0||Math.abs(p.at[1]+.205)>1e-6||Math.abs(p.size[1]-.025)>1e-6||p.at[2]<176){untouched.push(p);continue}
   metrics.inputInstances++;metrics.inputArea+=p.size[0]*p.size[2]
   let fragments=[{l:p.at[0]-p.size[0]/2,r:p.at[0]+p.size[0]/2,n:p.at[2]-p.size[2]/2,f:p.at[2]+p.size[2]/2}]
   for(const previous of patches)fragments=fragments.flatMap(f=>subtract(f,previous))
   patches.push(...fragments)
  }
  metrics.outputInstances+=patches.length
  for(const p of patches)metrics.outputArea+=(p.r-p.l)*(p.f-p.n)
  batch.parts=[...untouched,...patches.map(p=>({at:[(p.l+p.r)/2,-.205,(p.n+p.f)/2],size:[p.r-p.l,.025,p.f-p.n],rotation:0}))]
 }
 return {...metrics,removedOverlapArea:metrics.inputArea-metrics.outputArea}
}

export function appendKashiCityIntegration(ctx){
 const {box,part}=ctx,{solid}=architecture(ctx,'city-waymarkers')
 for(const join of KASHI_CITY.joins){
  const [x,y,z]=join.at,alongX=join.id.startsWith('homes'),width=alongX?12:join.id==='river-stairs'?8:16
  box('brass',[x,y+.04,z],alongX?[.22,.025,width]:[width,.025,.22])
 }
 for(const [x,y,z,yaw]of [[162,-.22,318,0],[292,-.22,318,0],[132,-.22,334,Math.PI/2],[132,-.22,430,Math.PI/2],
  [256,-.22,346,0],[371,-1.62,220,0],[390,1,246,Math.PI/2],[371,-.22,334,0]]){
  part('box','cyan',[x,y+.035,z],[.16,.02,1.6],yaw)
  for(const side of [-1,1])part('box','cyan',[x+Math.cos(yaw)*side*.3+Math.sin(yaw)*.6,y+.035,z+Math.cos(yaw)*.6-Math.sin(yaw)*side*.3],[.14,.02,.8],yaw-side*.8)
 }
 // Waymarker pillars sit beside, not in, the clear gate centre lines.
 for(const [x,z]of [[150,318],[304,318],[150,438],[126,326],[362,334]]){
  solid('stone',[x,.6,z],[.65,1.65,.65]);box('brass',[x,1.5,z],[.8,.15,.8]);box('cyan',[x,1.05,z-.34],[.36,.45,.04])
 }
 // Explicitly distant scenery beyond playable bounds; no fake accessible doors.
 for(const [i,b]of KASHI_CITY.skyline.entries()){
  box(i%2?'indigo':'dark',[b.x,b.h/2-.22,b.z],[b.w,b.h,b.d])
  for(let tier=0;tier<3;tier++){const width=b.w*(1-tier*.2);box('stone',[b.x,b.h+tier*2,b.z],[width,2,b.d*(1-tier*.2)]);box('brass',[b.x,b.h+tier*2+1.1,b.z],[width+.5,.15,b.d*(1-tier*.2)+.5])}
  for(let y=5;y<b.h;y+=7)box('window',[b.x,y,b.z-b.d/2-.04],[b.w*.72,1,.08])
 }
 return normalizeCityStreetSurfaces(ctx.batches)
}
