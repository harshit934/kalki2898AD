import {deepFreeze} from '../../campaign/contracts.js'

const routes=[
 {id:'temple-approach',points:[[0,18],[0,-18]]},
 {id:'river-circuit',points:[[0,18],[-25,18],[-25,-45],[49,-45],[49,12],[0,12],[0,18]]},
 {id:'cedar-walk',points:[[-25,8],[-48,8],[-48,-43],[-25,-43]]},
]
export function routeDistance(x,z){let best=Infinity;for(const route of routes)for(let i=1;i<route.points.length;i++){const a=route.points[i-1],b=route.points[i],dx=b[0]-a[0],dz=b[1]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*dx+(z-a[1])*dz)/(dx*dx+dz*dz)));best=Math.min(best,Math.hypot(x-a[0]-t*dx,z-a[1]-t*dz))}return best}
const smooth=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t)}
export const riverX=z=>24+2*Math.sin(z*.07)
export function terrainHeight(x,z){
 const flat=(Math.abs(x)<20&&z>-42&&z<20)||buildings.some(b=>b.id!=='waterfall-cliff'&&Math.abs(x-b.at[0])<b.size[0]/2+7&&Math.abs(z-b.at[2])<b.size[2]/2+4),route=smooth(2.2,6,routeDistance(x,z)),hill=(1.1+1.1*Math.sin(x*.105+z*.03)**2+1.8*Math.sin(z*.09-x*.035)**2)*smooth(15,35,Math.abs(x))
 let h=-.04+(flat?0:hill*route)
 const channel=Math.abs(x-riverX(z)),pond=Math.hypot(x-24,z+44),wet=Math.max(1-smooth(2.7,4.6,channel),1-smooth(4.6,6.3,pond))
 h=h*(1-wet)-.48*wet
 return h
}
export function landscapeHeight(x,z){const cx=Math.max(-55,Math.min(55,x)),cz=Math.max(-50,Math.min(24,z)),r=Math.hypot(x*.7,z+12),ridge=Math.max(0,r-64);return terrainHeight(cx,cz)-.08+Math.min(58,ridge*(.32+.5*Math.sin(x*.037+z*.021)**2+.25*Math.sin(z*.063-x*.017)**2))}
const buildings=[
 {id:'west-residence',at:[-9,3.8,-18],size:[7.5,7.6,11.3]},
 {id:'east-monastery',at:[10,5.6,-27],size:[8.5,11.2,12.3]},
 {id:'temple-sanctum',at:[1,6.5,-28],size:[6.5,13,6.5]},
 {id:'west-lodge',at:[-39,4.4,-29],size:[8.5,8.8,9.8]},
 {id:'grove-lodge',at:[38,4.4,-26],size:[8.5,8.8,9.8]},
 {id:'waterfall-cliff',at:[24,6.5,-51.5],size:[12,13,7.2]},
]
const forest=[]
for(let row=0;row<6;row++)for(const x of [-52,-43,-34,33,43,53]){const z=18-row*11+(Math.sin(row*3+x)*1.3);if(routeDistance(x,z)<3.5||Math.abs(x-riverX(z))<5||buildings.some(b=>Math.abs(x-b.at[0])<b.size[0]/2+3&&Math.abs(z-b.at[2])<b.size[2]/2+3))continue;forest.push({at:[x,terrainHeight(x,z)-.03,z],scale:.8+.3*(.5+.5*Math.sin(x+row)),yaw:row*1.73+x*.18})}
// Source generator seed 2898521 after four authored cedar canopies (1900 leaves, five random draws each).
const cairns=[[14.942099, -35.107372], [-14.98258, -10.139642], [10.680554, -25.413701], [-7.204596, -30.202463], [-16.257639, -23.15783], [15.944397, -17.783938], [15.352396, -13.938398], [9.988042, -27.199515], [8.475422, -32.83905], [8.206872, -20.893708]]
export const SHAMBALA_LAYOUT=deepFreeze({id:'shambala-valley',bounds:{minX:-55,maxX:55,minZ:-50,maxZ:24},spawn:[0,0,18],exit:[0,0,20],routes,buildings,forest,cairns,bridges:[{x:24,z:12},{x:24,z:-45}],frontages:[{at:[-39,0,-29],yaw:0},{at:[38,0,-26],yaw:Math.PI}],areas:[{label:'Arrival Meadow',at:[0,18]},{label:'Temple Court',at:[0,-18]},{label:'Cedar Grove',at:[-40,-20]},{label:'River and Falls',at:[30,-40]}]})
