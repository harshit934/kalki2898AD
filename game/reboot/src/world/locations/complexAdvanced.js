import {deepFreeze} from '../../campaign/contracts.js'
export const COMPLEX_ADVANCED=deepFreeze({bounds:{minX:190,maxX:330,minZ:-110,maxZ:20},areas:[{label:'Advanced Research Spine',at:[210,-12]},{label:'Observation Laboratory',at:[238,-36]},{label:'Testing and Control Hall',at:[294,-74]},{label:'Upper Research Walk',at:[260,-72]}]})
export function laboratory(a,{x,z,w,d,h=8}){
 const {box}=a,left=x-w/2,right=x+w/2,front=z+d/2,back=z-d/2
 for(const side of [left,right])for(const [lo,hi]of [[back,z-3],[z+3,front]])box('stone',[side,h/2,(lo+hi)/2],[.4,h,hi-lo],true)
 for(const [lo,hi]of [[left,x-5],[x+5,right]])box('light',[(lo+hi)/2,h/2,front],[hi-lo,h,.4],true)
 box('stone',[x,h/2,back],[w,h,.4],true);box('light',[x,h+.2,z],[w+.6,.4,d+.6],true)
 for(const side of [-1,1]){
  box('glass',[x+side*(w/2-5),2,z-6],[w/2-10,4,.18],true)
  for(const dz of [-d*.3,d*.25]){
   const tx=x+side*(w/2-6),tz=z+dz
   box('dark',[tx,.6,tz],[6,1.2,3],true);box('trim',[tx,1.3,tz],[6.2,.2,3.2])
   box('stone',[tx,1.9,tz],[1,1,1],true);box('glow',[tx,2.8,tz],[3,.04,1.7]);box('glass',[tx,3.4,tz],[2,.9,.08])
  }
 }
 for(const dx of [-w*.28,w*.28])box('glow',[x+dx,h-.05,z],[.18,.06,d-2])
}
export function appendComplexAdvanced(a,stage){
 const {box,floor,rail,stair}=a
 floor(260,-45,140,130,-.025)
 for(const x of [210,270,320])box('dark',[x,-.03,-45],[7,.02,122])
 for(const z of [12,-12,-54,-100])box('dark',[260,-.03,z],[132,.02,7])
 laboratory(a,{x:238,z:-36,w:44,d:40});laboratory(a,{x:294,z:-74,w:44,d:40})
 for(const [lo,hi]of stage>=4?[[-110,-100],[-88,6],[18,20]]:[[-110,20]])rail('z',330,lo,hi,-.025)
 rail('x',-110,190,330,-.025)
 for(const [lo,hi]of stage>=3?[[190,204],[216,314],[326,330]]:[[190,330]])rail('x',20,lo,hi,-.025)
 // Laboratory observation deck shares the existing service-gallery height.
 floor(217,-72,66,8,5);for(const z of [-76,-68])rail('x',z,184,250,5)
 floor(260,-72,20,32,5);rail('z',250,-88,-76,5);rail('z',250,-68,-64,5);rail('z',270,-88,-56,5)
 rail('x',-88,250,270,5);rail('x',-56,250,270,5)
 // Portal in west parapet matches the arriving stair and skybridge.
 // The skybridge joins betweenz-76..-68; stair joinsz-64..-56.
 // Replace that west edge with separate authored pieces.
 stair({start:220,end:250,fixed:-60,width:8,from:-.025,to:5,steps:51})
 for(const [x,z]of [[200,-74],[240,-74],[252,-86],[268,-58]])box('stone',[x,2.2,z],[1,4.4,1],true)
 for(const x of [204,324])for(const z of [4,-104]){box('trim',[x,2,z],[.12,4,.12],true);box('glow',[x,4,z],[1,.2,1])}
}
