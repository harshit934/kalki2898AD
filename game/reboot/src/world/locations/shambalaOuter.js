import {deepFreeze} from '../../campaign/contracts.js'
export const SHAMBALA_OUTER=deepFreeze({
 bounds:{minX:65,maxX:207,minZ:60,maxZ:190},
 blocks:[96,136,176].flatMap((x,i)=>[104,150].map((z,j)=>({x,z,w:20,d:20,h:14+(i+j)%3*5,style:(i+j)%2?'tiered':'dome'}))),
 shops:[96,136,176].map((x,i)=>({x,z:70,w:20,d:12,h:10+i*4})),
 areas:[{label:'Outer Residential Courts',at:[116,128]},{label:'South Trading Street',at:[116,84]},{label:'Residential Sky Terrace',at:[194,128]}]
})
export function appendShambalaOuter(a,stage){
 const {box,part,floor,rail,stair,block}=a
 floor(136,125,142,130,-.04)
 for(const x of [76,116,156,196])box('dark',[x,-.045,125],[7,.02,122])
 for(const z of [84,128,174])box('dark',[136,-.045,z],[134,.02,8])
 for(const b of [...SHAMBALA_OUTER.blocks,...SHAMBALA_OUTER.shops]){
  block(b)
  for(let y=5;y<b.h;y+=5){box('light',[b.x,y,b.z-b.d/2-1],[b.w*.7,.2,2],true);box('trim',[b.x,y+.65,b.z-b.d/2-1.9],[b.w*.7,1.1,.15],true)}
 }
 rail('z',65,60,190,-.04)
 for(const [lo,hi]of stage>=3?[[60,122],[134,190]]:[[60,190]])rail('z',207,lo,hi,-.04)
 for(const [lo,hi]of stage>=4?[[65,192],[200,207]]:[[65,207]])rail('x',190,lo,hi,-.04)
 // A city-level skywalk joins the original eastern overlook without crossing homes.
 floor(202,18,4,8,6);floor(202,71,4,98,6);floor(189,128,30,16,6)
 rail('x',14,200,204,6);rail('z',204,14,120,6);rail('z',200,22,120,6)
 rail('x',120,174,200,6);rail('z',174,120,136,6);rail('z',204,120,136,6)
 rail('x',136,174,193,6);rail('x',136,199,204,6)
 stair({axis:'z',start:164,end:136,fixed:196,width:6,from:-.04,to:6,steps:61})
 for(const z of [48,80,112])for(const x of [200.5,203.5])box('stone',[x,2.7,z],[.7,5.4,.7],true)
 for(const x of [96,136,176]){
  box('stone',[x,.35,123],[5,.8,1.2],true)
  box('stone',[x,.4,132],[3,.9,3],true);part('dome','glow',[x,1,132],[1.1,.7,1.1])
  for(const side of [-1,1]){box('trim',[x+side*7,2.2,79],[.15,4.4,.15],true);box('glow',[x+side*7,4.4,79],[.8,.25,.8])}
 }
 for(const x of [88,128,168]){box('dark',[x,.45,178],[4,1,3],true);box('light',[x,2.8,178],[5,.2,4]);for(const dx of [-2,2])box('trim',[x+dx,1.4,178],[.1,2.8,.1],true)}
 for(const x of [68,204])for(const z of [94,140,182]){box('trim',[x,2,z],[.12,4,.12],true);box('glow',[x,4,z],[1,.2,.8])}
}
