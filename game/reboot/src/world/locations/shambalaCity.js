import {deepFreeze} from '../../campaign/contracts.js'
import {createWorldArchitecture} from './phase6Architecture.js'

export const SHAMBALA_CITY=deepFreeze({
 id:'shambala-himalayan-city',bounds:{minX:65,maxX:207,minZ:-60,maxZ:60},
 regions:[{minX:65,maxX:207,minZ:-60,maxZ:60},{minX:55,maxX:65,minZ:4,maxZ:20}],floor:-.04,
 gate:{x:55,z:12,width:16},
 buildings:[{x:88,z:-20,w:18,d:18,h:14},{x:88,z:36,w:18,d:10,h:18,style:'dome'},
  {x:184,z:-20,w:18,d:18,h:22},{x:184,z:36,w:18,d:10,h:16},
  {x:126,z:52,w:18,d:10,h:16},{x:150,z:52,w:18,d:10,h:20,style:'dome'}],
 monument:{x:138,z:-12,w:26,d:24,h:34,style:'dome'},
 areas:[{label:'Sky Temple Plaza',at:[138,4]},{label:'Eastern Skybridge',at:[192,18]},
  {label:'Cedar Residential Court',at:[76,36]},{label:'Himalayan Trading Court',at:[138,44]}]
})
export const cityTerrain=(x,z,original)=>x>=49&&x<=55&&z>=8&&z<=16?-.04:original(x,z)
export const cityLandscape=(x,z,original)=>x>=50&&x<=215&&z>=-70&&z<=70?Math.min(-.4,original(x,z)):original(x,z)

export function buildShambalaCity(args){
 const a=createWorldArchitecture({...args,id:SHAMBALA_CITY.id,palette:{stone:'#c7c2a5',light:'#e4d8b5',dark:'#34474c',trim:'#b9a275',glow:'#78d9cb',glass:'#517b85'}})
 try{
 const {box,floor,stair,rail,block,part}=a,stage=args.stage??1
 floor(136,0,142,120,-.04);floor(60,12,10,16,-.04)
 for(const z of [-36,12,44])box('dark',[136,-.015,z],[142,.02,8])
 for(const x of [76,112,164,196])box('dark',[x,-.015,0],[6,.02,112])
 rail('x',-60,65,207,-.04);for(const [lo,hi]of stage>=2?[[65,70],[82,190],[202,207]]:[[65,207]])rail('x',60,lo,hi,-.04)
 rail('z',207,-60,60,-.04);rail('z',65,-60,4,-.04);rail('z',65,20,60,-.04);rail('x',4,55,65,-.04);rail('x',20,55,65,-.04)
 for(const b of SHAMBALA_CITY.buildings)block(b)
 block(SHAMBALA_CITY.monument)
 for(let i=0;i<5;i++)box('light',[138,35+i*2,-12],[24-i*4,1.5,22-i*3.5])
 part('dome','trim',[138,45,-12],[3,3,3]);part('cylinder','glow',[138,47,-12],[1.2,4,1.2])
 // Elevated public court and two connected sky bridges, with real support piers.
 floor(138,18,52,20,6);floor(176,18,24,8,6);floor(194,18,12,20,6)
 floor(138,4,12,8,6)
 stair({start:82,end:112,fixed:18,width:8,from:-.04,to:6,steps:61})
 rail('z',112,8,14,6);rail('z',112,22,28,6)
 rail('x',8,112,132,6);rail('x',8,144,164,6);rail('x',28,112,164,6)
 for(const z of [14,22])rail('x',z,164,188,6)
 for(const [lo,hi]of stage>=2?[[8,14],[22,28]]:[[8,28]])rail('z',200,lo,hi,6);for(const z of [8,28])rail('x',z,188,200,6)
 rail('z',188,8,14,6);rail('z',188,22,28,6)
 for(const x of [132,144])rail('z',x,0,8,6)
 // Open a 12m join in the court's northern parapet for the temple spur.
 // Its rail is authored as two pieces rather than blocking the bridge.
 for(const [x,z]of [[114,10],[162,10],[114,26],[162,26],[190,10],[198,26]])box('stone',[x,2.8,z],[1.2,5.6,1.2],true)
 for(const x of [120,156])for(const z of [10,26]){box('stone',[x,8.7,z],[.8,5.4,.8],true);part('dome','trim',[x,11.5,z],[1.1,.8,1.1])}
 // Energy monuments and recognizable public resting places.
 for(const x of [76,196]){box('stone',[x,.45,-50],[5,1,5],true);part('cylinder','trim',[x,3,-50],[2,4,2]);part('dome','glow',[x,5.1,-50],[2.2,2.2,2.2])}
 for(const x of [118,158])box('stone',[x,.4,36],[5,.9,1.4],true)
 for(const x of [64,104,172,202])for(const z of [-44,32]){box('trim',[x,2,z],[.16,4,.16],true);box('glow',[x,4,z],[1,.25,1])}
 // Mountains stay beyond the city boundary and support a Himalayan skyline.
 for(let i=0;i<9;i++)part('rock','dark',[70+i*18,10,-95-(i%3)*8],[22,30+(i%4)*8,24])
 for(const x of [230,252])for(const z of [-30,36])part('rock','light',[x,12,z],[22,42,30])
 const metrics=a.finish();return {...a,metrics,areas:SHAMBALA_CITY.areas}
 }catch(error){a.release();throw error}
}
