// Metres; Y up. Existing arena is south (-Z). Expansion is north (+Z).
export const DISTRICT = Object.freeze({minX:-10,maxX:38,startZ:100,endZ:420,floorEndZ:421,groundY:-.22})
export const DISTRICTS=Object.freeze([{id:'original-north',start:100,end:300},{id:'exchange-quarter',start:300,end:360},{id:'signal-works',start:360,end:420}])
export const districtEnabled=id=>/^mission-[1-5]$/.test(id)
export const BUILDINGS=Object.freeze([
  {id:'residence',name:'Salvage residences',kind:'residential',x:-3,z:128,w:12,d:14,h:7,front:1,color:'#987455',interior:true},
  {id:'market',name:'Covered exchange',kind:'market',x:29,z:151,w:12,d:16,h:4,front:-1,color:'#a98151',interior:true},
  {id:'guard',name:'Road watch post',kind:'guard',x:-3,z:174,w:12,d:12,h:6,front:1,color:'#5e7067',interior:true},
  {id:'workshop',name:'Repair courtyard',kind:'workshop',x:29,z:202,w:12,d:18,h:5,front:-1,color:'#6b7373',interior:true},
  {id:'landmark',name:'Route hall',kind:'landmark',x:-3,z:232,w:12,d:18,h:10,front:1,color:'#b39a70',interior:true},
  {id:'terrace',name:'Terraced lodgings',kind:'residential',x:29,z:270,w:12,d:16,h:8,front:-1,color:'#917c69',interior:true},
  {id:'north-exchange',name:'North exchange',kind:'market',x:29,z:326,w:12,d:16,h:4,front:-1,color:'#89926b',interior:true},
  {id:'outer-residence',name:'Courtyard dwellings',kind:'residential',x:-3,z:338,w:12,d:14,h:6,front:1,color:'#a08972',interior:true},
  {id:'signal-post',name:'Signal watch post',kind:'guard',x:-3,z:386,w:12,d:12,h:6,front:1,color:'#667a7a',interior:true},
  {id:'signal-hall',name:'Signal hall',kind:'landmark',x:29,z:400,w:12,d:18,h:10,front:-1,color:'#ac9367',interior:true},
])

// The renderer, collision and navigation consume the same architectural parts.
export function buildingParts(b){
  const parts=[]
  const add=(x,y,z,w,h,d,color=b.color,groundBlock=true,solid=true)=>parts.push({at:[b.x+x,DISTRICT.groundY+y,b.z+z],size:[w,h,d],color,groundBlock,solid})
  add(-b.front*b.w/2,b.h/2,0,.3,b.h,b.d)
  add(0,b.h/2,-b.d/2,b.w,b.h,.3)
  add(0,b.h/2,b.d/2,b.w,b.h,.3)
  if(!['market','workshop'].includes(b.kind)){
    const sideLength=b.d/2-1.5
    for(const sign of [-1,1])add(b.front*b.w/2,b.h/2,sign*(b.d/4+.75),.3,b.h,sideLength)
    add(b.front*b.w/2,b.h-.5,0,.3,1,3,b.color,false)
  }
  add(0,b.h,0,b.w+.6,.25,b.d+.6,b.kind==='market'?'#69534c':'#4c5c55',false)
  // Windows and horizontal facade bands are geometry, not textured billboards.
  for(const z of [-b.d*.3,b.d*.3])add(-b.front*(b.w/2+.17),2,z,.04,1.2,1.5,'#30443f',false,false)
  if(b.kind==='residential'){
    add(b.front*(b.w/2+.35),3.6,0,1.2,.2,5,'#635a48',false)
    add(0,b.h+.7,-b.d*.25,2,1.4,2,'#66716b',false)
  }
  if(b.kind==='market'){
    for(const z of [-5,5])add(1,.6,z,4,1.2,1.4,'#72563b')
    add(-b.w/2-1,3.2,0,2.5,.15,b.d,'#b4824a',false)
  }
  if(b.kind==='workshop'){
    add(1,.55,-6,4,1.1,2,'#526b62')
    add(3,1,5,2,2,3,'#655543')
  }
  if(b.kind==='guard'){
    for(const z of [-4.5,4.5])add(-2,b.h+.6,z,1.2,1.2,1.2,'#af995b',false)
    // Roof landing joins the walkable ramp at x6, z174.
    add(4.8,b.h,0,4.8,.25,3,'#6d776a',false)
  }
  if(b.kind==='landmark'){
    for(const z of [-6,6])add(b.front*(b.w/2+1),3,z,.7,6,.7,'#c3ae80')
    add(b.front*(b.w/2+1),6,0,1.2,.5,14,'#88714d',false)
  }
  return parts
}
export const ARCHITECTURE=Object.freeze(BUILDINGS.flatMap(buildingParts))
export const RAMP=Object.freeze({at:[6,2.78,163],size:[2, .2,Math.hypot(22,6)],rotation:[-Math.atan2(6,22),0,0]})
export const RAMPS=Object.freeze([RAMP,Object.freeze({...RAMP,at:[6,2.78,375]})])
export const BOUNDARIES=Object.freeze([
  {at:[-9.85,1,260.5],size:[.3,3,321]},
  {at:[37.85,1,260.5],size:[.3,3,321]},
  {at:[14,1,420.85],size:[48,3,.3]},
])
export const NAV_OBSTACLES=Object.freeze([
  ...ARCHITECTURE.filter(p=>p.solid&&p.groundBlock).map(p=>({minX:p.at[0]-p.size[0]/2,maxX:p.at[0]+p.size[0]/2,minZ:p.at[2]-p.size[2]/2,maxZ:p.at[2]+p.size[2]/2})),
  {minX:5,maxX:7,minZ:152,maxZ:174.5},
  {minX:5,maxX:7,minZ:364,maxZ:386.5},
])
export const DISTRICT_AID=Object.freeze([
  {id:'residence-aid',position:[-3,-.22,128]},
  {id:'workshop-cache',position:[29,-.22,202]},
  {id:'watch-roof-cache',position:[0,5.92,174]},
  {id:'outer-home-cache',position:[0,-.22,338]},
  {id:'signal-roof-cache',position:[0,5.92,386]},
])
export const PEOPLE=Object.freeze([
  {id:'resident',role:'Civilian',asset:'porter',route:[[0,124],[0,131],[0,124]],speed:.75,message:'The main street connects the exchange, repair courtyard and route hall.'},
  {id:'vendor',role:'Merchant',asset:'merchant',route:[[28,151]],speed:0,message:'Green caches refill one healing charge when you have space. Each cache is limited.'},
  {id:'porter',role:'Civilian',asset:'porter',route:[[19,139],[19,159],[19,139]],speed:.85,message:'Watch the road: patrols can hear the fight and see you through open approaches.'},
  {id:'watch',role:'Guard',asset:'porter',route:[[8,179],[8,190],[14,190],[8,190],[8,179]],speed:.9,message:'The watch-post ramp leads to its roof. The boss arena remains on the original south road.'},
  {id:'mechanic',role:'Merchant',asset:'merchant',route:[[28,200],[28,205],[28,200]],speed:.6,message:'The courtyard has a finite healing cache. It cannot provide unlimited supplies.'},
  {id:'steward',role:'Route steward',asset:'merchant',route:[[0,232]],speed:0,message:'These are exploration routes, not new campaign objectives. Return south to finish your current mission.'},
  {id:'broker',role:'Merchant',asset:'merchant',route:[[28,326]],speed:0,message:'This exchange contains limited ammunition. Patrols can occupy the entrance and side room.'},
  {id:'signal-worker',role:'Civilian',asset:'porter',route:[[28,398],[28,403],[28,398]],speed:.7,message:'The signal-post roof overlooks the street. Use the courtyard walls as cover and watch for a firing tell.'},
])

export function sampleRoute(route,distance,out){
  if(route.length===1){out.x=route[0][0];out.z=route[0][1];out.yaw=0;return out}
  let length=0
  for(let i=1;i<route.length;i++)length+=Math.hypot(route[i][0]-route[i-1][0],route[i][1]-route[i-1][1])
  let remaining=length?((distance%length)+length)%length:0
  for(let i=1;i<route.length;i++){
    const a=route[i-1],b=route[i],d=Math.hypot(b[0]-a[0],b[1]-a[1])
    if(remaining<=d&&d){const t=remaining/d;out.x=a[0]+(b[0]-a[0])*t;out.z=a[1]+(b[1]-a[1])*t;out.yaw=Math.atan2(b[0]-a[0],b[1]-a[1]);return out}
    remaining-=d
  }
  out.x=route[0][0];out.z=route[0][1];out.yaw=0;return out
}
