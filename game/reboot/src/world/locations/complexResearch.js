import {deepFreeze} from '../../campaign/contracts.js'
import {createWorldArchitecture} from './phase6Architecture.js'

export const COMPLEX_RESEARCH=deepFreeze({
 id:'complex-research-precinct',bounds:{minX:34,maxX:190,minZ:-110,maxZ:20},floor:-.025,
 gate:{x:34,z:15.5,width:10},
 buildings:[{x:64,z:-45,w:16,d:18,h:28,mat:'dark'},{x:64,z:-78,w:16,d:18,h:38,mat:'dark'},{x:164,z:-4,w:20,d:16,h:18}],
 hall:{minX:90,maxX:146,minZ:-76,maxZ:-32,ceiling:10},
 areas:[{label:'Research Arrival Court',at:[78,12]},{label:'Reactor Concourse',at:[118,-44]},
  {label:'Materials Laboratory',at:[98,-46]},{label:'Technology Laboratory',at:[138,-46]},
  {label:'Elevated Service Gallery',at:[170,-70]},{label:'Cooling Works',at:[54,-78]}]
})

// Reuse the authored backdrop farther beyond the new playable precinct.
export const researchFrontage=(p,stage=1)=>p.scale>1.2?{...p,at:[p.at[0],p.at[1],p.at[2]-(stage>=5?180:100)]}:p

export function buildComplexResearch(args){
 const a=createWorldArchitecture({...args,id:COMPLEX_RESEARCH.id,palette:{stone:'#75868e',light:'#c7d6d8',dark:'#293b49',trim:'#b68b58',glow:'#ffbf70',glass:'#77b9c7'}})
 try{
 const {box,part,floor,rail,stair,block}=a,stage=args.stage??1
 floor(112,-45,156,130,-.025)
 for(const x of [54,78,158,178])box('dark',[x,-.03,-45],[6,.02,120])
 for(const z of [12,-20,-94])box('dark',[112,-.03,z],[150,.02,7])
 for(const [lo,hi]of stage>=2?[[-110,-100],[-88,6],[18,20]]:[[-110,20]])rail('z',190,lo,hi,-.025);rail('z',34,-110,10,-.025)
 for(const [lo,hi]of stage>=5?[[34,72],[84,172],[184,190]]:[[34,190]])rail('x',-110,lo,hi,-.025);for(const [lo,hi]of stage>=3?[[34,48],[60,172],[184,190]]:[[34,190]])rail('x',20,lo,hi,-.025)
 for(const b of COMPLEX_RESEARCH.buildings){block(b);for(const side of [-1,1])box('trim',[b.x+side*(b.w/2-.4),b.h/2,b.z-b.d/2-.2],[.4,b.h,1])}
 // Open reactor hall and real side laboratories. Walls have authored portals.
 box('stone',[90,5,-54],[.5,10,44],true)
 for(const [a,b]of [[-76,-68],[-52,-32]])box('stone',[146,5,(a+b)/2],[.5,10,b-a],true)
 for(const y of [1.5,8.5])box('stone',[146,y,-60],[.5,3,16],true)
 box('glass',[146,5,-60],[.18,4,16],true)
 box('stone',[118,5,-76],[56,10,.5],true)
 for(const [a,b]of [[90,112],[124,146]])box('stone',[(a+b)/2,5,-32],[b-a,10,.5],true)
 box('light',[118,10.2,-54],[57,.4,45],true)
 for(const x of [104,132])for(const [a,b]of [[-76,-70],[-66,-48],[-44,-32]])box('light',[x,2,(a+b)/2],[.35,4,b-a],true)
 for(const x of [106,130])box('glow',[x,9.9,-54],[.25,.08,40])
 for(const x of [110,126])box('trim',[x,.01,-54],[.12,.02,40])
 // Reactor pedestal, transparent containment and a grounded luminous core.
 box('dark',[118,2,-60],[8,4,8],true);box('glass',[118,6,-60],[6,4,6],true)
 part('cylinder','glow',[118,5,-60],[5,6,5])
 for(const x of [114.9,121.1])box('trim',[x,6,-60],[.2,4,6.2],true)
 for(const z of [-63.1,-56.9])box('trim',[118,6,z],[6,.2,.2])
 for(const x of [96,140])for(const z of [-38,-58]){
  box('dark',[x,.5,z],[7,1,3],true);box('trim',[x,1.1,z],[7.3,.2,3.3])
  for(const dx of [-2,0,2]){box('stone',[x+dx,1.8,z],[1.2,1.2,.8],true);box('glow',[x+dx,1.9,z+.43],[.9,.5,.05])}
 }
 box('dark',[96,.7,-69],[5,1.4,4],true);part('cylinder','glow',[96,2.8,-69],[2,3,2]);box('glass',[96,2.8,-69],[2.4,3.4,2.4],true)
 // A reachable five-metre service gallery overlooks the hall windows.
 stair({axis:'z',start:-22,end:-52,fixed:158,width:8,from:-.025,to:5,steps:60})
 floor(169,-70,30,36,5)
 rail('z',154,-88,-52,5);for(const [lo,hi]of stage>=2?[[-88,-76],[-68,-52]]:[[-88,-52]])rail('z',184,lo,hi,5)
 rail('x',-88,154,184,5);for(const [lo,hi]of stage>=3?[[162,174],[182,184]]:[[162,184]])rail('x',-52,lo,hi,5)
 for(const x of [155,183])for(const z of [-62,-84])box('stone',[x,2.2,z],[1.1,4.4,1.1],true)
 for(const z of [-64,-80]){box('trim',[169,5.05,z],[24,.06,.15]);box('dark',[181,5.7,z],[3,1.4,2],true);box('glow',[181,6.5,z],[2.6,.15,1.6])}
 // Pipe gantries and cooling equipment remain attached to their supports.
 for(const z of [-42,-80]){box('trim',[78,12,z],[28,.8,.8],true);for(const x of [74,88])box('stone',[x,6,z],[.6,12,.6],true)}
 for(const x of [48,82,150,186])for(const z of [6,-102]){box('trim',[x,2,z],[.15,4,.15],true);box('glow',[x,4,z],[1.4,.2,.4])}
 // Distant industrial silhouettes are beyond the validated precinct perimeter.
 for(let i=0;i<5;i++){const x=48+i*32,h=32+i*6;box('dark',[x,h/2,stage>=5?-260:-140],[12,h,16]);part('cylinder','trim',[x,h+4,stage>=5?-260:-140],[5,8,5]);box('glow',[x,h+8,stage>=5?-260:-140],[4,.2,4])}
 const metrics=a.finish();return {...a,metrics,areas:COMPLEX_RESEARCH.areas}
 }catch(error){a.release();throw error}
}
