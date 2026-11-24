import {deepFreeze} from '../../campaign/contracts.js'
import {laboratory} from './complexAdvanced.js'
export const COMPLEX_CONTAINMENT=deepFreeze({bounds:{minX:330,maxX:450,minZ:-110,maxZ:150},areas:[{label:'Security Checkpoint',at:[348,12]},{label:'Containment Observation Hall',at:[392,-40]},{label:'Security Overlook',at:[436,-40]},{label:'Deep Maintenance Level',at:[410,124]}]})
export function appendComplexContainment(a){
 const {box,part,floor,stair,rail}=a
 floor(390,-5,120,210,-.025);floor(390,143,120,14,-.025)
 floor(333,118,6,36,-.025);floor(415,118,70,36,-.025)
 rail('z',450,-110,150,-.025);for(const z of [-110,150])rail('x',z,330,450,-.025)
 for(const [lo,hi]of [[-110,-100],[-88,6],[18,118],[130,150]])rail('z',330,lo,hi,-.025)
 for(const z of [-94,12]){
  for(const side of [-1,1])box('dark',[348,3,z+side*5],[2,6,2],true)
  box('trim',[348,6.2,z],[2,.4,12],true);box('glow',[347,5,z],[.1,.4,8])
 }
 for(const x of [354,445])box('dark',[x,-.03,0],[6,.02,208])
 for(const z of [-94,12,80,124])box('dark',[390,-.03,z],[112,.02,6])
 laboratory(a,{x:392,z:-40,w:56,d:50,h:12})
 for(const x of [384,404]){box('dark',[x,.5,-46],[12,1,12],true);box('glass',[x,4,-46],[10,6,10],true);part('cylinder','glow',[x,4,-46],[3,5,3]);for(const side of [-1,1])box('trim',[x+side*5.1,4,-46],[.2,6,10.4],true)}
 floor(432,-40,24,56,6)
 for(const x of [420,444])rail('z',x,-68,-12,6)
 rail('x',-68,420,444,6);rail('x',-12,420,432,6);rail('x',-12,440,444,6)
 stair({axis:'z',start:20,end:-12,fixed:436,width:8,from:-.025,to:6,steps:61})
 for(const [x,z]of [[422,-66],[442,-14]])box('dark',[x,2.7,z],[1.2,5.4,1.2],true)
 // Guard the cut-out on the ground level, independently of the deep route below.
 for(const z of [100,136])rail('x',z,336,380,-.025)
 rail('z',380,100,136,-.025);rail('z',336,100,120,-.025);rail('z',336,128,136,-.025)
 stair({start:336,end:376,fixed:124,width:8,from:-.025,to:-8,steps:81})
 floor(411,122,70,40,-8)
 for(const z of [102,142])rail('x',z,376,446,-8)
 rail('z',446,102,142,-8);rail('z',376,102,120,-8);rail('z',376,128,142,-8)
 const below={...a,box:(mat,at,size,solid)=>box(mat,[at[0],at[1]-8,at[2]],size,solid)}
 laboratory(below,{x:410,z:122,w:52,d:36,h:5})
 for(const z of [120,128])box('dark',[380,-5.5,z],[8,5,.35],true)
 box('dark',[380,-2.8,124],[8,.4,8],true)
 for(const x of [350,370,392,428])box('glow',[x,x<376?-1-(x-336)*.199:-3.05,124],[.2,.15,1.2])
 for(const z of [-82,32,92,144]){box('trim',[442,2,z],[.15,4,.15],true);box('glow',[442,4,z],[1,.3,1])}
}
