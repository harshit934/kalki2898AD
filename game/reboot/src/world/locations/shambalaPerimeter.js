import {deepFreeze} from '../../campaign/contracts.js'
export const SHAMBALA_PERIMETER=deepFreeze({regions:[
 {minX:345,maxX:385,minZ:124,maxZ:132},{minX:385,maxX:425,minZ:110,maxZ:150},
 {minX:401,maxX:409,minZ:150,maxZ:222},{minX:409,maxX:445,minZ:166,maxZ:174},
 {minX:212,maxX:409,minZ:222,maxZ:230},{minX:192,maxX:212,minZ:222,maxZ:238},
 {minX:192,maxX:200,minZ:190,maxZ:222}],areas:[{label:'High Mountain Transit Terrace',at:[405,128]},{label:'Secluded Cliff Viewpoint',at:[440,170]},{label:'Himalayan Span',at:[300,226]}]})
export function appendShambalaPerimeter(a){
 const {box,part,floor,rail,stair}=a
 // The valley bed anchors visible cliff supports without becoming a playable floor.
 box('dark',[280,-25,160],[400,2,320])
 stair({start:345,end:385,fixed:128,width:8,from:-.04,to:12,steps:121})
 floor(405,130,40,40,12)
 rail('z',385,110,124,12);rail('z',385,132,150,12);rail('z',425,110,150,12)
 rail('x',110,385,425,12);rail('x',150,385,401,12);rail('x',150,409,425,12)
 floor(405,186,8,72,12);rail('z',401,150,222,12)
 rail('z',409,150,166,12);rail('z',409,174,222,12)
 floor(427,170,36,8,12);for(const z of [166,174])rail('x',z,409,445,12);rail('z',445,166,174,12)
 floor(310.5,226,197,8,12);rail('x',222,212,401,12);rail('x',230,212,409,12);rail('z',409,222,230,12)
 floor(202,230,20,16,12);rail('x',222,200,212,12);rail('x',238,192,212,12);rail('z',192,222,238,12);rail('z',212,230,238,12)
 stair({axis:'z',start:190,end:222,fixed:196,width:8,from:-.04,to:12,steps:121})
 for(const [x,z,w,d]of [[386,112,2,2],[424,148,2,2],[405,180,8,8],[405,210,8,8],[440,170,10,8],[250,226,4,6],[320,226,4,6],[380,226,4,6]])box('stone',[x,-6,z],[w,36,d],true)
 for(const [x,z]of [[392,116],[418,144]]){box('light',[x,15,z],[1,6,1],true);part('dome','trim',[x,18.2,z],[1.3,1,1.3])}
 box('trim',[405,18.5,116],[27,.5,2],true)
 for(const x of [220,260,300,340,380]){box('trim',[x,14.4,229],[.14,4.8,.14],true);box('glow',[x,16.8,229],[1,.25,1])}
 for(const z of [164,196,216])box('glow',[405,12.025,z],[.25,.02,2])
 box('stone',[440,12.4,171.8],[3,.8,.8],true)
 for(const [x,y,z,w,h,d]of [[500,26,180,40,60,70],[420,36,300,60,70,45],[250,20,290,60,50,35]])part('rock','light',[x,y,z],[w,h,d])
}
