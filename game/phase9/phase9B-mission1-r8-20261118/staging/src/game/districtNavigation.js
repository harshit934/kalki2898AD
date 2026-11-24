import {NAV_OBSTACLES} from './districtLayout.js'
const MIN_X=-10,MAX_X=38,MAX_Z=420,WIDTH=MAX_X-MIN_X+1,SIZE=WIDTH*(MAX_Z+1)
const queue=new Int32Array(SIZE),parent=new Int32Array(SIZE)
export function walkable(x,z,radius=.85){
  if(x<MIN_X+.3+radius||x>MAX_X-.3-radius||z<0||z>420)return false
  if(z<100)return true // Existing-world collision remains Rapier's authority.
  return !NAV_OBSTACLES.some(b=>x>b.minX-radius&&x<b.maxX+radius&&z>b.minZ-radius&&z<b.maxZ+radius)
}
export function clearSegment(a,b,radius=.85){
  const length=Math.hypot(b.x-a.x,b.z-a.z),steps=Math.max(1,Math.ceil(length/.4))
  for(let i=0;i<=steps;i++)if(!walkable(a.x+(b.x-a.x)*i/steps,a.z+(b.z-a.z)*i/steps,radius))return false
  return true
}
// Static occupancy is shared by all three patrols. Bake once, not per query.
const blocked=new Uint8Array(SIZE)
for(let z=0;z<=MAX_Z;z++)for(let x=MIN_X;x<=MAX_X;x++)blocked[z*WIDTH+x-MIN_X]=walkable(x,z)?0:1
// Bounded four-neighbour grid. Called only on a changed/blocked route, not per frame.
export function findDistrictPath(from,to){
  const start={x:Math.round(from.x),z:Math.round(from.z)},end={x:Math.round(to.x),z:Math.round(to.z)}
  if(!walkable(start.x,start.z)||!walkable(end.x,end.z))return []
  const key=p=>p.z*WIDTH+p.x-MIN_X,source=key(start),goal=key(end)
  parent.fill(-1);parent[source]=source;queue[0]=source;let head=0,tail=1
  while(head<tail&&parent[goal]===-1){
    const at=queue[head++],x=at%WIDTH+MIN_X,z=Math.floor(at/WIDTH)
    for(let direction=0;direction<4;direction++){
      const nx=x+(direction===0?1:direction===1?-1:0),nz=z+(direction===2?1:direction===3?-1:0)
      if(nx<MIN_X||nx>MAX_X||nz<0||nz>MAX_Z)continue
      const next=nz*WIDTH+nx-MIN_X
      if(blocked[next]||parent[next]!==-1)continue
      parent[next]=at;queue[tail++]=next
    }
  }
  if(parent[goal]===-1)return []
  const raw=[];let at=goal
  while(at!==source){raw.push({x:at%WIDTH+MIN_X,z:Math.floor(at/WIDTH)});at=parent[at]}
  raw.reverse()
  // Collapse straight grid runs before visibility smoothing. Testing every
  // increasingly long raw prefix would perform quadratic ray sampling.
  const corners=[]
  for(let i=0;i<raw.length;i++){
    const before=i?raw[i-1]:start,next=raw[i+1],p=raw[i]
    if(!next||(p.x-before.x)!==(next.x-p.x)||(p.z-before.z)!==(next.z-p.z))corners.push(p)
  }
  const path=[];let anchor=from
  for(let i=0;i<corners.length;i++){
    if(i+1<corners.length&&clearSegment(anchor,corners[i+1]))continue
    path.push(corners[i]);anchor=corners[i]
  }
  return path
}

export function createPatrol(spawn,variant=0,customRoute=null){
  const lane=12+(variant%3)*2
  const interior=variant%3===0?{x:0,z:128}:variant%3===1?{x:28,z:202}:{x:0,z:174}
  return {mode:'patrol',index:0,lastSeen:null,searchUntil:0,path:[],pathAt:0,replanAt:0,goalX:Infinity,goalZ:Infinity,
    route:customRoute?.length?customRoute.map(p=>({x:p[0],z:p[1]})):[{x:spawn[0],z:spawn[2]},{x:0,z:24},{x:lane,z:24},{x:lane,z:110},{x:lane,z:128},interior,{x:lane,z:202},{x:lane,z:282},{x:lane,z:326},{x:lane,z:386},{x:lane,z:410},{x:lane,z:326},{x:lane,z:202},{x:lane,z:128},{x:lane,z:24},{x:0,z:24}]}
}
export function patrolTarget(state,position,player,canSee,alive,now,range){
  const distance=Math.hypot(position.x-player.x,position.z-player.z)
  if(alive&&canSee&&distance<=range*(state.mode==='combat'?1.25:1)){
    state.mode='combat';state.lastSeen??={x:0,z:0};state.lastSeen.x=player.x;state.lastSeen.z=player.z;return player
  }
  if(state.mode==='combat'){state.mode='search';state.searchUntil=now+2500}
  if(state.mode==='search'){
    if(now<state.searchUntil&&state.lastSeen&&Math.hypot(position.x-state.lastSeen.x,position.z-state.lastSeen.z)>.6)return state.lastSeen
    state.mode='return';let best=Infinity
    state.route.forEach((p,i)=>{const d=Math.hypot(position.x-p.x,position.z-p.z);if(d<best){best=d;state.index=i}})
  }
  const target=state.route[state.index]
  if(Math.hypot(position.x-target.x,position.z-target.z)<.75){state.index=(state.index+1)%state.route.length;state.mode='patrol'}
  return state.route[state.index]
}
export function routeWaypoint(state,position,goal,now){
  if(position.z<1||goal.z<1)return goal
  if(clearSegment(position,goal)){state.path=[];return goal}
  if(now>=state.replanAt&&(Math.hypot(goal.x-state.goalX,goal.z-state.goalZ)>2||!state.path.length||state.pathAt>=state.path.length)){
    state.path=findDistrictPath(position,goal);state.pathAt=0;state.replanAt=now+1000;state.goalX=goal.x;state.goalZ=goal.z
  }
  while(state.pathAt<state.path.length&&Math.hypot(position.x-state.path[state.pathAt].x,position.z-state.path[state.pathAt].z)<.65)state.pathAt++
  return state.path[state.pathAt]??position // No route: wait/replan, never tunnel through a wall.
}
