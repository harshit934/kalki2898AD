import {strongholdPlacement} from '../content/mission1Stronghold.js'
import {requireCondition} from '../campaign/contracts.js'
import {MISSION1_CITY_PLACEMENTS,MISSION1_CITY_ROOMS,MISSION1_CITY_SEGMENTS,insideMission1City,validateMission1Placements} from '../content/mission1Placements.js'
import {createPatrol,patrolTarget} from '../../../phase9/phase9B-mission1-r8-20261118/staging/src/game/districtNavigation.js'
import {movementWithPendingTarget} from './nativeResources.js'

// Borrowed collider/controller dimensions from existing native implementations.
// The registry stores foot anchors, not blindly reused rigid-body translations.
export const CITY_CAPSULES=Object.freeze({
 player:Object.freeze({halfHeight:.55,radius:.34,offsetY:.89}),
 regular:Object.freeze({halfHeight:.48,radius:.43,offsetY:.91}),
 heavy:Object.freeze({halfHeight:.68,radius:.72,offsetY:1.4}),
 warden:Object.freeze({halfHeight:1.45,radius:1.3,offsetY:2.625}),
})
const identity={x:0,y:0,z:0,w:1},epsilon=1e-6
const bodyOwners=new WeakMap()
const point=p=>Array.isArray(p)?{x:p[0],y:p[1],z:p[2]}:p
const finite=p=>p&&[p.x,p.y,p.z].every(Number.isFinite)
const key=p=>p.x.toFixed(4)+','+p.z.toFixed(4)
const distance=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z)
const profileFor=p=>p.category==='boss'?CITY_CAPSULES.warden:p.classId==='heavy'?CITY_CAPSULES.heavy:CITY_CAPSULES.regular
const fixed=c=>!c.parent()||c.parent().isFixed()
const validProfile=p=>p&&[p.halfHeight,p.radius,p.offsetY].every(Number.isFinite)&&p.halfHeight>0&&p.radius>0

export function buildMission1CityGraph(){
 const nodes=new Map(),legs=[]
 const add=(x,z)=>{const p={x,y:-.175,z},id=key(p);if(!nodes.has(id))nodes.set(id,{...p,id,neighbors:new Set()});return nodes.get(id)}
 for(const segment of MISSION1_CITY_SEGMENTS)for(let i=1;i<segment.points.length;i++){
  const [ax,az]=segment.points[i-1],[bx,bz]=segment.points[i]
  requireCondition((ax===bx||az===bz)&&(ax!==bx||az!==bz),'INVALID_CITY_GRAPH','Nonzero axis-aligned authored segment required')
  legs.push({a:add(ax,az),b:add(bx,bz)})
 }
 const on=(p,l)=>Math.abs((l.b.x-l.a.x)*(p.z-l.a.z)-(l.b.z-l.a.z)*(p.x-l.a.x))<epsilon&&p.x>=Math.min(l.a.x,l.b.x)-epsilon&&p.x<=Math.max(l.a.x,l.b.x)+epsilon&&p.z>=Math.min(l.a.z,l.b.z)-epsilon&&p.z<=Math.max(l.a.z,l.b.z)+epsilon
 for(const a of legs)for(const b of legs){
  if(a.a.x===a.b.x&&b.a.z===b.b.z){const p={x:a.a.x,z:b.a.z};if(on(p,a)&&on(p,b))add(p.x,p.z)}
 }
 for(const leg of legs){const ordered=[...nodes.values()].filter(n=>on(n,leg)).sort((a,b)=>distance(a,leg.a)-distance(b,leg.a));for(let i=1;i<ordered.length;i++){ordered[i-1].neighbors.add(ordered[i].id);ordered[i].neighbors.add(ordered[i-1].id)}}
 return nodes
}

/** Session-owned navigation only. No scene insertion, frame loop, damage,
 * encounter deployment, campaign write or independent physics ownership. */
export function createMission1Navigation({sessionId,signal,world,rapier,placements=MISSION1_CITY_PLACEMENTS}){
 requireCondition(typeof sessionId==='string'&&sessionId.length&&signal&&!signal.aborted,'SESSION_CANCELLED','Live navigation owner required')
 requireCondition(world?.castRayAndGetNormal&&world?.castShape&&world?.intersectionWithShape&&rapier?.Capsule,'NAVIGATION_UNAVAILABLE','Existing initialized native collision world required')
 validateMission1Placements(placements)
 const graph=buildMission1CityGraph(),actors=new Map(),issued=new WeakSet();let closed=false
 function live(id=sessionId){requireCondition(!closed&&!signal.aborted,'SESSION_CANCELLED','Navigation owner released');requireCondition(id===sessionId,'SESSION_MISMATCH','Navigation belongs to another mission session')}
 const flags=rapier.QueryFilterFlags.EXCLUDE_SENSORS
 function support(position){
  const p=point(position);requireCondition(finite(p)&&insideMission1City(p),'INVALID_CITY_POSITION','Finite supported city coordinate required')
  const ray=new rapier.Ray({x:p.x,y:p.y+.45,z:p.z},{x:0,y:-1,z:0}),hit=world.castRayAndGetNormal(ray,2,true,flags,undefined,undefined,undefined,fixed)
  requireCondition(hit&&hit.normal.y>=.65,'CITY_GROUND_UNAVAILABLE','No walkable native ground at '+key(p))
  const ground=ray.origin.y-hit.timeOfImpact
  requireCondition(ground>=-.3&&ground<=.45,'CITY_GROUND_UNAVAILABLE','Not a ground-floor support surface')
  return {x:p.x,y:ground,z:p.z}
 }
 function ground(position,profile=CITY_CAPSULES.regular){
  live();requireCondition(validProfile(profile),'INVALID_NAVIGATION_PROFILE','Finite existing capsule dimensions required')
  const floor=support(position),center={x:floor.x,y:floor.y+profile.halfHeight+profile.radius+.035,z:floor.z},shape=new rapier.Capsule(profile.halfHeight,profile.radius)
  requireCondition(!world.intersectionWithShape(center,identity,shape,flags,undefined,undefined,undefined,fixed),'CITY_POSITION_BLOCKED','Capsule overlaps existing architecture at '+key(floor))
  return {support:floor,bodyPosition:{x:floor.x,y:floor.y-(profile.offsetY-profile.halfHeight-profile.radius),z:floor.z}}
 }
 function segmentClear(from,to,profile=CITY_CAPSULES.regular){
  live();requireCondition(validProfile(profile),'INVALID_NAVIGATION_PROFILE','Finite existing capsule dimensions required');const a=point(from),b=point(to);requireCondition(finite(a)&&finite(b),'INVALID_CITY_POSITION','Finite route endpoints required')
  const steps=Math.max(1,Math.ceil(distance(a,b)/.5));requireCondition(steps<=900,'NAVIGATION_BUDGET_EXCEEDED','Route exceeds bounded sampling distance')
  const shape=new rapier.Capsule(profile.halfHeight,profile.radius);let previous=null
  try{for(let i=0;i<=steps;i++){
   const t=i/steps,p=ground({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t,z:a.z+(b.z-a.z)*t},profile).support
   if(previous){if(Math.abs(p.y-previous.y)>.3)return false
    // Lift the sweep by the existing controller's autostep allowance. Full
    // capsule fit and support are separately checked at every <=0.5m sample.
    const center={x:previous.x,y:previous.y+profile.halfHeight+profile.radius+.3,z:previous.z},velocity={x:p.x-previous.x,y:p.y-previous.y,z:p.z-previous.z}
    if(world.castShape(center,identity,velocity,shape,0,1,true,flags,undefined,undefined,undefined,fixed))return false
   }previous=p
  }}catch(error){if(['CITY_GROUND_UNAVAILABLE','CITY_POSITION_BLOCKED','INVALID_CITY_POSITION'].includes(error.code))return false;throw error}
  return true
 }
 function path({sessionId:id,from,to,profile=CITY_CAPSULES.regular}){
  live();requireCondition(id===sessionId,'SESSION_MISMATCH','Explicit current session required');const a=point(from),b=point(to);requireCondition(finite(a)&&finite(b),'INVALID_CITY_POSITION','Finite path endpoints required')
  // Cache only within this synchronous query; opening/closing a door must
  // immediately affect the next query. Never cache a closed-door bypass.
  const memo=new Map();let queries=0
  const clear=(p,q)=>{const k=[key(p),key(q)].sort().join('|');if(!memo.has(k)){requireCondition(++queries<=1000,'NAVIGATION_BUDGET_EXCEEDED','Bounded graph query exhausted');memo.set(k,segmentClear(p,q,profile))}return memo.get(k)}
  if(clear(a,b))return {status:'ready',points:[{...a},{...b}],queries}
  const nodes=new Map(graph);nodes.set('$start',{...a,id:'$start',neighbors:new Set()});nodes.set('$goal',{...b,id:'$goal',neighbors:new Set()})
  const links=new Map()
  for(const endpoint of ['$start','$goal']){
   const p=nodes.get(endpoint),closest=[...graph.values()].sort((x,y)=>distance(p,x)-distance(p,y));let connected=0
   for(const n of closest){if(distance(p,n)>55)break;if(clear(p,n)){p.neighbors.add(n.id);if(!links.has(n.id))links.set(n.id,new Set());links.get(n.id).add(endpoint);if(++connected===8)break}}
  }
  const open=new Set(['$start']),cost=new Map([['$start',0]]),parents=new Map()
  while(open.size){
   let id;for(const candidate of open)if(id===undefined||cost.get(candidate)+distance(nodes.get(candidate),b)<cost.get(id)+distance(nodes.get(id),b))id=candidate
   open.delete(id);if(id==='$goal'){const points=[];for(let at=id;at;at=parents.get(at))points.unshift({...nodes.get(at)});return {status:'ready',points:points.map(({x,y,z})=>({x,y,z})),queries}}
   const n=nodes.get(id)
   for(const next of new Set([...n.neighbors,...(links.get(id)??[])])){
    const q=nodes.get(next);if(!clear(n,q))continue;const score=cost.get(id)+distance(n,q)
    if(score<(cost.get(next)??Infinity)){cost.set(next,score);parents.set(next,id);open.add(next)}
   }
  }
  return {status:'blocked',reason:'No collision-clear room/street route; door may be closed',points:[],queries}
 }
 function register({sessionId:id,actorId,encounterId,body,controller,deployment=null}){
  live();requireCondition(id===sessionId,'SESSION_MISMATCH','Explicit current session required');const p=placements.opponents.find(p=>p.actorId===actorId)??(actorId===placements.warden.actorId?placements.warden:null)
  requireCondition(p&&p.encounterId===encounterId&&!actors.has(actorId),'ACTOR_OWNERSHIP_MISMATCH','Unique authored actor and encounter required')
  requireCondition(p.category!=='regular'||[...actors.values()].filter(a=>a.placement.category==='regular').length<3,'ENEMY_BUDGET_EXCEEDED','At most three regular navigation actors')
  requireCondition(body&&world.getRigidBody(body.handle)===body&&body.collider(0)&&controller?.computeColliderMovement&&controller?.computedMovement,'NAVIGATION_ACTOR_UNAVAILABLE','Borrowed live body and existing controller required')
  const shape=body.collider(0).shape,profile=profileFor(p),offset=body.collider(0).translation().y-body.translation().y
  requireCondition(!bodyOwners.has(body)&&shape.type===rapier.ShapeType.Capsule&&Math.abs(shape.halfHeight-profile.halfHeight)<1e-5&&Math.abs(shape.radius-profile.radius)<1e-5&&Math.abs(offset-profile.offsetY)<1e-5&&insideMission1City(body.translation()),'NAVIGATION_ACTOR_UNAVAILABLE','Unique body with the authored native capsule required')
  requireCondition(!deployment||deployment===strongholdPlacement(actorId),'INVALID_CITY_PLACEMENT','Only the authored stronghold deployment may override patrols')
  const entry={placement:p,body,controller,pending:null,token:Object.freeze({sessionId,actorId,encounterId}),patrol:p.category==='regular'?createPatrol(deployment?.position??p.position,0,deployment?.patrol??p.patrol):null};actors.set(actorId,entry);bodyOwners.set(body,entry.token);issued.add(entry.token)
  return entry.token
 }
 function actor(token){live(token?.sessionId);const a=actors.get(token?.actorId);requireCondition(a&&a.token===token,'STALE_NAVIGATION_ACTOR','Actor registration was replaced or released');return a}
 function patrolGoal(token,{player,visible,alive,now,detectionRange}){
  const a=actor(token);requireCondition(a.patrol&&finite(player)&&typeof visible==='boolean'&&typeof alive==='boolean'&&Number.isFinite(now)&&now>=0&&Number.isFinite(detectionRange)&&detectionRange>0,'INVALID_PATROL_INPUT','Actual detection inputs required')
  const goal=patrolTarget(a.patrol,a.body.translation(),player,visible,alive,now,detectionRange)
  return {goal:{x:goal.x,y:a.body.translation().y,z:goal.z},mode:a.patrol.mode}
 }
 function route(token,goal){const a=actor(token);return path({sessionId,from:a.body.translation(),to:goal,profile:profileFor(a.placement)})}
 function move(token,movement){
  const a=actor(token);requireCondition(finite(movement)&&Math.hypot(movement.x,movement.y,movement.z)<=2,'INVALID_NAVIGATION_MOVE','Finite bounded per-frame controller displacement required')
  const collider=a.body.collider(0);a.controller.computeColliderMovement(collider,movementWithPendingTarget(a.body.translation(),a.pending,movement),flags,undefined,c=>c.handle!==collider.handle)
  const delta=a.controller.computedMovement(),current=a.body.translation();a.pending={x:current.x+delta.x,y:current.y+delta.y,z:current.z+delta.z};requireCondition(finite(a.pending),'INVALID_NAVIGATION_MOVE','Controller produced non-finite translation');a.body.setNextKinematicTranslation(a.pending);return {...a.pending}
 }
 function remove(token){live(token?.sessionId);requireCondition(token&&issued.has(token),'STALE_NAVIGATION_ACTOR','Unknown registration');const a=actors.get(token.actorId);if(!a)return false;requireCondition(a.token===token,'STALE_NAVIGATION_ACTOR','Actor registration replaced');if(bodyOwners.get(a.body)===token)bodyOwners.delete(a.body);actors.delete(token.actorId);return true}
 function release(){if(closed)return;closed=true;for(const a of actors.values())if(bodyOwners.get(a.body)===a.token)bodyOwners.delete(a.body);actors.clear();graph.clear();signal.removeEventListener('abort',release)}
 signal.addEventListener('abort',release,{once:true})
 return Object.freeze({sessionId,ground,segmentClear,path,register,patrolGoal,route,move,remove,release,snapshot(){return {sessionId,closed,nodes:graph.size,actors:actors.size,regularActors:[...actors.values()].filter(a=>a.placement.category==='regular').length}}})
}

export function validateMission1CityGeometry({navigation,placements=MISSION1_CITY_PLACEMENTS}){
 validateMission1Placements(placements)
 const resolved={player:navigation.ground(placements.player.position,CITY_CAPSULES.player),objectives:[],opponents:[],warden:[]}
 for(const o of placements.objectives)resolved.objectives.push({objectiveId:o.objectiveId,...navigation.ground(o.position,CITY_CAPSULES.player)})
 for(const p of placements.opponents){const profile=profileFor(p);const position=navigation.ground(p.position,profile);for(let i=0;i<p.patrol.length;i++){const a=p.patrol[i],b=p.patrol[(i+1)%p.patrol.length];requireCondition(navigation.segmentClear([a[0],p.position[1],a[1]],[b[0],p.position[1],b[1]],profile),'INVALID_CITY_PATROL','Patrol intersects city collision: '+p.encounterId)}resolved.opponents.push({actorId:p.actorId,encounterId:p.encounterId,...position})}
 const w=placements.warden
 for(const x of [w.movement.minX,w.position[0],w.movement.maxX])for(const z of [w.movement.minZ,w.position[2],w.movement.maxZ])resolved.warden.push(navigation.ground([x,w.position[1],z],CITY_CAPSULES.warden))
 requireCondition(MISSION1_CITY_ROOMS.length===14,'INVALID_CITY_PLACEMENT','Existing fourteen rooms required')
 return resolved
}
