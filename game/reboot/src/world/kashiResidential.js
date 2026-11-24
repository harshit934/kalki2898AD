import {deepFreeze} from '../campaign/contracts.js'
import {architecture,openAuthoredSeams} from './kashiArchitecture.js'

export const KASHI_RESIDENTIAL=deepFreeze({
 id:'kashi-west-residential',bounds:{minX:16,maxX:142,minZ:310,maxZ:442},floor:-.22,
 gateways:[{x:142,z:334,width:14},{x:142,z:430,width:14}],
 streets:[...[38,78,118].map(x=>({x,z:376,w:x===78?6:8,d:132})),...[334,374,430].map(z=>({x:79,z,w:126,d:8}))],
 homes:[22,56,98,132].flatMap((x,col)=>[350,392,418].map((z,row)=>({
  id:['potters','weavers','scholars','lantern-makers'][col]+'-'+(row+1),x,z,
  w:col===0?10:col===3?12:20,d:[18,20,14][row],h:[8,14,19,11][(col+row)%4],
  mat:col%2?'stone':'indigo',balcony:col===1||col===2,roof:(col+row)%3===0?'dome':'terrace',mark:col+1
 }))),
 courts:[{id:'water-court',position:[56,-.22,370]},{id:'gathering-terrace',position:[98,.14,368]}],
 routes:['west-lane','weavers-lane','east-lane','south-passage','water-court-passage','north-passage']
})

export function appendKashiResidential(ctx){
 const {box,part}=ctx,{solid,lamp,facade}=architecture(ctx,'residential-public')
 openAuthoredSeams(ctx,[{mat:'dark',at:[142,.4,376],size:[.7,1.2,132]}],'RESIDENTIAL_SEAM_UNAVAILABLE')
 solid('stone',[79,-.52,376],[126,.6,132])
 for(const [a,b]of [[310,327],[341,423],[437,442]])solid('dark',[142,.4,(a+b)/2],[.7,1.2,b-a])
 solid('dark',[16,.4,376],[.7,1.2,132])
 for(const z of [310,442])solid('dark',[79,.4,z],[126,1.2,.7])
 for(const road of KASHI_RESIDENTIAL.streets)box('walk',[road.x,-.205,road.z],[road.w,.025,road.d])
 for(const b of KASHI_RESIDENTIAL.homes){
  facade(b)
  // Different trades leave readable traces around each threshold.
  const front=b.z-b.d/2
  if(b.id.startsWith('potters'))for(const dx of [-2,2]){solid('stone',[b.x+dx,.25,front-1],[.7,.9,.7]);part('cylinder','brass',[b.x+dx,.8,front-1],[.35,.3,.35])}
  if(b.id.startsWith('weavers')){box('indigo',[b.x,3.8,front-.9],[b.w*.7,.16,2]);for(let i=-2;i<=2;i++)box('brass',[b.x+i,3.9,front-.9],[.16,.06,2])}
  if(b.id.startsWith('scholars')){solid('dark',[b.x-4,.3,front-1.1],[1.4,1,1]);box('brass',[b.x-4,.85,front-1.1],[1.5,.1,1.1])}
  if(b.id.startsWith('lantern-makers'))for(const dx of [-3,3]){solid('brass',[b.x+dx,1.3,front-.8],[.1,3,.1]);box('cyan',[b.x+dx,2.7,front-.8],[.45,.6,.45])}
 }
 // An open cistern court with dry walking paths on all sides, not a new economy.
 solid('stone',[56,.05,367],[6,.54,4]);box('river',[56,.33,367],[5,.04,3])
 for(const x of [51,61]){solid('stone',[x,.15,367],[1,.74,5]);box('brass',[x,.55,367],[1.1,.1,5.1])}
 for(const z of [364.5,369.5])solid('stone',[56,.2,z],[11,.84,.7])
 // Public raised gathering terrace, reached from the north by three low steps.
 solid('light',[98,-.19,368],[12,.66,12])
 for(let i=0;i<3;i++){const top=.14-(i+1)*.12,z=374+(i+.5)*1.2;solid('light',[98,(top+.8)/2-.8,z],[6,top+.8,1.22]);box('brass',[98,top+.008,z+.5],[5.7,.016,.08])}
 for(const x of [93,103])solid('stone',[x,.5,366],[1,.72,5])
 for(const x of [45,85,125])for(const z of [326,380,437])lamp(x,z)
 // Laundry stays well above head/camera level and never changes movement input.
 for(const z of [363,408]){
  box('brass',[78,5.4,z],[22,.05,.05])
  for(let x=69;x<=87;x+=3)box(x%2?'light':'indigo',[x,4.8,z],[1.5,1.1,.05])
 }
 for(const x of [30,126]){solid('stone',[x,.2,436],[3,.84,1]);part('dome','leaf',[x,.8,436],[1.2,1,1.2])}
}
