import {deepFreeze} from '../../campaign/contracts.js'
// Existing authored Complex generator: Blender X/Y/Z exported as Three X/Y/-Z.
const cores=[[-10,-13,7,8,9],[10,-19,8,8,13],[-10,-30,7,8,16],[14,-35,8,10,20]]
const colliders=[{id:'ground',at:[0,-.225,-28.5],size:[68,.4,97]}]
for(const [x,z,w,d,h]of cores){colliders.push({id:'core-'+x+'-'+z,at:[x,h/2,z],size:[w-1,h,d-1]});for(const side of [-1,1])colliders.push({id:'pier-'+x+'-'+z+'-'+side,at:[x+side*w/2,h/2,z+d/2],size:[.4,h+.8,.6]});for(const y of [1.2,3.8,6.4,9,11.6,14.2,16.8,19.4])if(y<=h)colliders.push({id:'balcony-'+x+'-'+z+'-'+y,at:[x,y,z+d/2+.3],size:[w+1,.24,1.7]})}
for(const x of [-17,18])for(const [z,h]of [[-40,24],[-52,30],[-65,34]])colliders.push({id:'sky-core-'+x+'-'+z,at:[x,h/2,z],size:[7,h,8]})
for(const x of [-7,7])colliders.push({id:'citadel-support-'+x,at:[x,4,-27],size:[2.8,8,4.5]})
for(const x of [-4.8,4.8])for(const z of [-5,-12])colliders.push({id:'promenade-column-'+x+'-'+z,at:[x,2.3,z],size:[.96,4.6,.96]})
for(let i=0;i<11;i++)colliders.push({id:'citadel-crown-'+i,at:[0,8+i*.68,-28],size:[6+i*1.35,.48,9+i*.6]})
for(const [x,z]of [[-6,-5],[7,-10],[-8,-19]])colliders.push({id:'pedestal-'+x,at:[x,.55,z],size:[1.6,1.1,1.6]})
for(const x of [-24,24])colliders.push({id:'arrival-frontage-'+x,at:[x,6.85,7],size:[8.1,13.7,10.1]})
for(const x of [-34,34])colliders.push({id:'edge-x-'+x,at:[x,2,-28.5],size:[.5,4,97]})
for(const z of [-77,20])colliders.push({id:'edge-z-'+z,at:[0,2,z],size:[68,4,.5]})
export const COMPLEX_LAYOUT=deepFreeze({id:'complex-arrival-quarter',bounds:{minX:-34,maxX:34,minZ:-77,maxZ:20},spawn:[0,0,13],exit:[0,0,16],colliders,frontages:[{at:[-24,0,7],yaw:Math.PI/2,scale:1.2},{at:[24,0,7],yaw:-Math.PI/2,scale:1.2},{at:[-45,0,-100],yaw:0,scale:4},{at:[45,0,-110],yaw:0,scale:5},{at:[-25,0,-145],yaw:0,scale:6},{at:[24,0,-150],yaw:0,scale:7}],routes:[{id:'central-promenade',points:[[0,13],[0,-70]]},{id:'east-walk',points:[[0,15.5],[30,15.5],[30,-70],[0,-70]]},{id:'west-walk',points:[[0,15.5],[-30,15.5],[-30,-70],[0,-70]]}],areas:[{id:'arrival-plaza',at:[0,12],label:'Arrival Plaza'},{id:'citadel-concourse',at:[0,-28],label:'Citadel Concourse'},{id:'northern-belvedere',at:[0,-70],label:'Northern Belvedere'}]})
