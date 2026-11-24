import {deepFreeze} from '../../campaign/contracts.js'
export const COMPLEX_ENERGY=deepFreeze({bounds:{minX:34,maxX:190,minZ:-190,maxZ:-110},areas:[{label:'Grand Reactor Arrival',at:[118,-122]},{label:'Reactor Observation Ring',at:[118,-133]},{label:'Energy Facility Rear Court',at:[118,-182]}]})
export const COMPLEX_NETWORK=deepFreeze([
 {label:'Original Arrival',position:[0,0,13]},{label:'Original Reactor',position:[118,-.025,-44]},
 {label:'Research Laboratories',position:[238,-.025,-36]},{label:'Manufacturing Hall',position:[110,-.025,80]},
 {label:'Containment Observation',position:[392,-.025,-36]},{label:'Deep Maintenance',position:[410,-8,124]},
 {label:'Grand Reactor Forecourt',position:[118,-.025,-122]},{label:'Grand Observation Ring',position:[118,12,-133]}
])
export function appendComplexEnergy(a){
 const {box,part,floor,rail,stair}=a
 floor(112,-150,156,80,-.025)
 for(const x of [34,190])rail('z',x,-190,-110,-.025);rail('x',-190,34,190,-.025)
 for(const x of [78,178])box('dark',[x,-.03,-150],[7,.02,72])
 for(const z of [-122,-182])box('dark',[112,-.03,z],[148,.02,7])
 // A grounded containment core sits within a genuinely walkable observation ring.
 box('dark',[118,2,-154],[18,4,18],true);box('glass',[118,14,-154],[16,20,16],true)
 part('cylinder','glow',[118,14,-154],[12,24,12]);box('light',[118,26.5,-154],[18,1,18],true)
 for(const x of [108,128])for(const z of [-164,-144]){box('trim',[x,15,z],[1,30,1],true);box('glow',[x,30.1,z],[1.3,.2,1.3])}
 for(const x of [80,156])for(const z of [-176,-130])box('stone',[x,19,z],[2,38,2],true)
 box('light',[118,38.2,-153],[82,.4,52],true);part('dome','trim',[118,38.5,-153],[40,8,25])
 floor(118,-133,80,10,12);floor(118,-173,80,10,12);floor(87,-153,18,30,12);floor(149,-153,18,30,12)
 rail('z',78,-178,-137,12);rail('z',78,-129,-128,12);rail('z',158,-178,-128,12)
 for(const z of [-178,-128])rail('x',z,78,158,12)
 for(const x of [96,140])rail('z',x,-168,-138,12);for(const z of [-168,-138])rail('x',z,96,140,12)
 stair({start:42,end:78,fixed:-133,width:8,from:-.025,to:12,steps:121})
 for(const z of [-128,-100])box('stone',[146,15,z],[1.5,30,1.5],true)
 box('trim',[146,30,-114],[1,1,44],true);box('glow',[146,30.6,-114],[.25,.2,44])
 for(const [x,y,z]of [[78,-.025,-110],[178,-.025,-110],[190,-.025,12],[330,-.025,12],[330,-.025,124],[336,-.025,124]]){
  box('trim',[x,y+.015,z],[3,.02,.25]);box('glow',[x,y+.025,z+1],[.2,.02,1.4])
 }
 for(const [x,y,z]of [[70,-.025,-118],[184,-.025,-180],[204,-.025,4],[324,-.025,30],[342,-.025,90],[380,-8,118]]){
  box('stone',[x,y+.7,z],[.7,1.4,.7],true);box('glow',[x,y+1.2,z-.36],[.4,.4,.05])
 }
}
