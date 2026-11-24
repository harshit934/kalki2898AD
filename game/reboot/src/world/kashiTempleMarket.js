import {deepFreeze} from '../campaign/contracts.js'
import {architecture,openAuthoredSeams} from './kashiArchitecture.js'

export const KASHI_TEMPLE_MARKET=deepFreeze({
 id:'kashi-temple-market',floor:-.22,
 regions:[{minX:142,maxX:350,minZ:310,maxZ:442},{minX:350,maxX:376,minZ:328,maxZ:442},{minX:366,maxX:376,minZ:310,maxZ:328}],
 gateways:[{x:162,z:310,width:18},{x:292,z:310,width:18}],
 temple:{x:256,z:400,w:28,d:28,platform:{x:256,z:394,w:56,d:56,y:.26},approach:[256,-.22,354]},
 streets:[{x:162,z:376,w:12,d:132},{x:194,z:376,w:6,d:132},{x:292,z:376,w:12,d:132},...[334,366,430].map(z=>({x:246,z,w:208,d:10}))],
 shops:[{id:'saffron-court',x:182,z:350,w:18,d:16,h:12,roof:'dome',mark:1},{id:'copper-lanterns',x:208,z:350,w:16,d:16,h:18,balcony:true,mark:2},{id:'weavers-row',x:182,z:394,w:18,d:24,h:16,mark:3},{id:'archive-merchants',x:208,z:394,w:16,d:24,h:22,balcony:true,mark:4}],
 stalls:[174,210].flatMap(x=>[370,414,422].map(z=>({x,z,w:4,d:5})))
})

export function appendKashiTempleMarket(ctx){
 const {box,part}=ctx,{solid,lamp,facade}=architecture(ctx,'temple-market-public')
 const seams=[{mat:'dark',at:[246,.4,310],size:[208,1.2,.7]},
  {mat:'stone',at:[371,-1.48,310],size:[10,.28,.26]},
  {mat:'brass',at:[371,.63,310],size:[10,.14,.18]},
  ...Array.from({length:21},(_,i)=>({mat:'brass',at:[366+i*.5,-.42,310],size:[.12,2.4,.12]}))]
 openAuthoredSeams(ctx,seams,'TEMPLE_SEAM_UNAVAILABLE')
 solid('stone',[246,-.52,376],[208,.6,132])
 solid('stone',[363,-.52,385],[26,.6,114])
 solid('stone',[371,-.52,327.4],[10,.6,1.2])
 for(const [a,b]of [[142,153],[171,283],[301,350]])solid('dark',[(a+b)/2,.4,310],[b-a,1.2,.7])
 for(const x of [142,376])solid('dark',[x,.4,376],[.7,1.2,132])
 solid('dark',[259,.4,442],[234,1.2,.7])
 // Contain the bank cut-out where the low riverwalk rises to the new terrace.
 solid('stone',[358,-.1,328],[16,1.1,.5])
 for(let i=0;i<14;i++){
  const z=310+(i+.5)*1.2,top=-1.62+(i+1)*.1
  solid('light',[371,(top-2.2)/2,z],[10,top+2.2,1.22])
  box('brass',[371,top+.008,z+.5],[9.5,.016,.08])
  for(const x of [366.2,375.8])solid('brass',[x,top+1.1,z],[.2,2.2,1.22])
 }
 for(const road of KASHI_TEMPLE_MARKET.streets)box('walk',[road.x,-.205,road.z],[road.w,.025,road.d])
 for(const b of KASHI_TEMPLE_MARKET.shops)facade(b)
 for(const [index,s]of KASHI_TEMPLE_MARKET.stalls.entries()){
  solid('dark',[s.x,.3,s.z],[s.w,1,s.d]);solid('light',[s.x,1.45,s.z+1.7],[s.w,1.3,.4])
  for(const dx of [-1.8,1.8])solid('brass',[s.x+dx,1.3,s.z],[.12,3,.12])
  box(index%2?'indigo':'leaf',[s.x,2.9,s.z],[4.6,.18,5.6])
  for(let dx=-1.5;dx<=1.5;dx+=1)box('brass',[s.x+dx,3,s.z],[.25,.08,5.6])
  for(const dx of [-1,0,1])part(index%2?'cylinder':'dome',index%2?'brass':'leaf',[s.x+dx,1,s.z-.8],[.35,.5,.35])
 }
 // A raised accessible mandapa faces the market; the shrine itself is sealed.
 solid('light',[256,-.04,394],[56,.6,56])
 for(let i=0;i<6;i++){const z=354+(i+.5)*2,top=-.22+(i+1)*.08;solid('light',[256,(top+.6)/2-.6,z],[18,top+.6,2.02]);box('brass',[256,top+.008,z-.8],[17.5,.016,.12])}
 solid('stone',[256,6.26,400],[28,12,28],true)
 for(let i=0;i<6;i++){
  const w=30-i*3.8,y=12.26+i*3
  solid(i%2?'light':'stone',[256,y+1.5,400],[w,3,w]);box('brass',[256,y+3.05,400],[w+.7,.2,w+.7])
 }
 part('dome','brass',[256,30.4,400],[3,3,3]);part('cylinder','brass',[256,34,400],[.35,5,.35])
 box('cyan',[256,9,385.9],[2,.6,.2])
 box('dark',[256,2.5,385.92],[3,4.5,.12]);part('arch','brass',[256,5,385.75],[2.4,2,.8])
 for(const x of [232,242,270,280])for(const z of [372,383]){
  solid('stone',[x,2.8,z],[.9,5.1,.9]);part('cylinder','brass',[x,5.5,z],[.8,.5,.8]);solid('light',[x,5.9,z],[2,.4,2])
 }
 solid('light',[256,6.4,377.5],[54,.6,18]);box('brass',[256,6.8,377.5],[55,.2,19])
 for(const x of [218,300])for(const z of [350,422])lamp(x,z)
 for(const z of [342,378,422])for(const x of [151,305,365])lamp(x,z)
 for(const x of [224,288])for(const z of [346,434]){solid('stone',[x,.3,z],[2,1,2]);part('dome','leaf',[x,.9,z],[1.1,1,1.1])}
 // Resting places and service jars animate the market without adding NPC logic.
 for(const x of [155,305]){solid('stone',[x,.15,412],[4,.7,1.2]);solid('stone',[x,.7,412.6],[4,1.2,.2])}
}
