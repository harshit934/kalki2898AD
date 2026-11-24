import {deepFreeze} from '../../campaign/contracts.js'
import {laboratory} from './complexAdvanced.js'
export const COMPLEX_PRODUCTION=deepFreeze({bounds:{minX:34,maxX:330,minZ:20,maxZ:150},areas:[{label:'Manufacturing Hall',at:[110,80]},{label:'Engineering Workshop',at:[248,80]},{label:'Production Service Bridge',at:[178,124]},{label:'Industrial Support Court',at:[320,124]}]})
export function appendComplexProduction(a,stage){
 const {box,floor,rail,stair}=a
 floor(182,85,296,130,-.025)
 for(const x of [54,178,210,320])box('dark',[x,-.03,85],[7,.02,122])
 for(const z of [36,124])box('dark',[182,-.03,z],[288,.02,7])
 rail('z',34,20,150,-.025);rail('x',150,34,330,-.025)
 for(const [lo,hi]of stage>=4?[[20,118],[130,150]]:[[20,150]])rail('z',330,lo,hi,-.025)
 for(const [x,w]of [[110,68],[248,72]]){
  laboratory(a,{x,z:80,w,d:60,h:14})
  for(const side of [-1,1]){
   const line=x+side*16
   box('dark',[line,.6,80],[6,1.2,30],true);box('trim',[line,1.25,80],[6.2,.1,30])
   for(let z=67;z<=93;z+=3){box('light',[line,1.35,z],[5.8,.1,.5]);box('stone',[line+side*5,3,z],[3,6,2],true);box('glow',[line+side*5,6.1,z],[2.6,.15,1.6])}
   box('trim',[line,9,80],[.7,.7,42],true)
  }
  for(const z of [56,104])box('glow',[x,13.9,z],[w-4,.08,.3])
 }
 floor(178,32,8,168,5);for(const x of [174,182])rail('z',x,-52,116,5)
 floor(180,124,60,16,5)
 rail('x',116,150,174,5);rail('x',116,182,210,5)
 rail('x',132,150,192,5);rail('x',132,200,210,5);for(const x of [150,210])rail('z',x,116,132,5)
 stair({axis:'z',start:148,end:132,fixed:196,width:8,from:-.025,to:5,steps:51})
 for(const z of [-28,4,52,92])for(const x of [175,181])box('stone',[x,2.2,z],[.8,4.4,.8],true)
 for(const x of [154,206])box('stone',[x,2.2,128],[1.2,4.4,1.2],true)
 for(const x of [42,318])for(const z of [28,140]){box('trim',[x,2,z],[.15,4,.15],true);box('glow',[x,4,z],[1,.2,1])}
 for(const x of [160,296]){box('dark',[x,.7,142],[14,1.4,7],true);for(let i=0;i<4;i++)box('trim',[x-5+i*3,2,142],[2,1.2,6],true)}
}
