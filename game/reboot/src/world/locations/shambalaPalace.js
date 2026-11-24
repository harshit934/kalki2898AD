import {deepFreeze} from '../../campaign/contracts.js'
export const SHAMBALA_PALACE=deepFreeze({bounds:{minX:207,maxX:345,minZ:80,maxZ:190},areas:[{label:'Grand Palace Terrace',at:[280,144]},{label:'Ceremonial Energy Plaza',at:[330,128]},{label:'Mountain Cascade Court',at:[326,160]}],palace:{x:280,z:104,w:42,d:32,h:44,style:'dome'}})
export function appendShambalaPalace(a,stage){
 const {box,part,floor,stair,rail,block}=a
 floor(276,135,138,110,-.04)
 for(const z of [80,190])rail('x',z,207,345,-.04)
 for(const [lo,hi]of stage>=4?[[80,122],[134,190]]:[[80,190]])rail('z',345,lo,hi,-.04)
 rail('z',207,80,122,-.04);rail('z',207,134,190,-.04)
 for(const z of [96,128,174])box('dark',[276,-.045,z],[130,.02,7])
 for(const x of [209.5,330])box('dark',[x,-.045,135],[x===330?7:4.5,.02,102])
 block(SHAMBALA_PALACE.palace)
 for(let i=0;i<5;i++){box('light',[280,45+i*2,104],[44-i*7,1.5,34-i*5]);box('trim',[280,46+i*2,104],[45-i*7,.2,35-i*5])}
 part('dome','glow',[280,54,104],[3,3,3])
 floor(280,144,64,32,8);floor(280,124,16,8,8)
 stair({start:212,end:248,fixed:148,width:8,from:-.04,to:8,steps:81})
 rail('z',248,128,144,8);rail('z',248,152,160,8);rail('z',312,128,160,8)
 rail('x',160,248,312,8);rail('x',128,248,272,8);rail('x',128,288,312,8)
 for(const x of [272,288])rail('z',x,120,128,8)
 for(const x of [256,304])for(const z of [132,156]){box('light',[x,12,z],[1,8,1],true);part('dome','trim',[x,16,z],[1.5,1,1.5]);box('stone',[x,3.7,z],[2,7.4,2],true)}
 for(const z of [132,156])box('trim',[280,16.1,z],[50,.5,1.5],true)
 for(const z of [96,174]){
  box('stone',[330,.5,z],[10,1.1,10],true);box('trim',[330,14,z],[2.5,28,2.5],true)
  for(let y=4;y<=28;y+=6)box('glow',[330,y,z],[3,.3,3])
  part('dome','glow',[330,28,z],[3,4,3])
 }
 // Conduits sit on raised piers, clear of ceremonial walking routes.
 for(const z of [108,148]){box('trim',[326,10,z],[1,20,1],true);box('glow',[308,20,z],[36,.3,.3]);box('trim',[290,10,z],[1,20,1],true)}
 for(const x of [230,242]){box('stone',[x,2.5,96],[.8,5,.8],true);part('dome','trim',[x,5.2,96],[1,.7,1])}
 box('light',[236,5.4,96],[18,.4,14],true);part('dome','trim',[236,5.7,96],[7,4,5])
 box('stone',[338,12,160],[10,24,12],true)
 box('glass',[333.02,12,160],[.08,23.8,8])
 for(let y=1;y<24;y+=3)box('glow',[332.94,y,160],[.12,.12,7.8])
 box('stone',[326,.12,160],[12,.32,14],true);box('glass',[326,.3,160],[11.5,.025,13.5])
 for(const z of [142,178]){box('stone',[326,.3,z],[5,.7,1.5],true);box('glow',[326,.75,z],[4,.1,1])}
}
