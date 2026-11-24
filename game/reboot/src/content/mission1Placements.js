import {deepFreeze,requireCondition} from '../campaign/contracts.js'
import {getMissionDeployment} from '../../../phase9/phase9B-mission1-r8-20261118/staging/src/game/buildingDeployment.js'
import {EARLY_MISSIONS} from '../../../phase9/phase9B-mission1-r8-20261118/staging/src/game/earlyMissionContent.js'
import {crystals} from '../../../phase9/phase9B-mission1-r8-20261118/staging/src/game/missionOneCrystals.js'
import {KASHI_DISTRICT,KASHI_INTERIORS} from '../world/kashiDistrict.js'
import {KASHI_APPROACHES} from '../world/districtRefinement.js'
import {KASHI_NEIGHBORHOOD,NEIGHBORHOOD_INTERIORS} from '../world/kashiNeighborhood.js'
import {TERRACE_WALK,TERRACE_INTERIORS} from '../world/kashiTerraceWalk.js'

// Proposed spatial contract only. Not imported by live Mission 1 or persistence.
// Do not import mission1.js here: Batch 2 can consume this without a cycle.
const source=getMissionDeployment(1).buildings
export const MISSION1_CITY_ROOMS=deepFreeze([...KASHI_INTERIORS,...NEIGHBORHOOD_INTERIORS,...TERRACE_INTERIORS])
const buildings=[...KASHI_DISTRICT.buildings,...KASHI_NEIGHBORHOOD.buildings,...TERRACE_WALK.buildings]
const bindings=[
 ['roadside-aid','sandstone-arcade',2,'z'],['residence','indigo-court',-2,'z'],
 ['market','stepped-tower',0,'z'],['guard','split-spire',0,'z'],
 ['workshop','copper-market',0,'z'],['landmark','weavers-court',0,'x'],
 ['terrace','sun-clock',0,'z'],['north-exchange','archive-house',0,'z'],
 ['outer-residence','transit-lodge',0,'z'],['signal-post','terrace-arcade',0,'z'],
 ['signal-hall','terrace-hall',0,'z'],
]
const opponents=bindings.map(([id,roomId,offset,axis])=>{
 const b=buildings.find(b=>b.id===roomId),room=MISSION1_CITY_ROOMS.find(r=>r.id===roomId),enemy=source.find(s=>s.buildingId===id).enemies[0]
 const position=[b.x,room.floor,b.z+offset],patrol=axis==='x'?[[b.x-2,b.z],[b.x+2,b.z]]:[[b.x,b.z-2],[b.x,b.z+2]]
 return {encounterId:id,actorId:enemy.id,classId:enemy.type,roomId,position,patrol,activationRadius:44,grounding:'native-support',category:'regular'}
})
const shift=[KASHI_DISTRICT.spawn[0],0,KASHI_DISTRICT.spawn[2]-8]
const translate=p=>p.map((v,i)=>v+shift[i])
const objectives=[...EARLY_MISSIONS['mission-1'].tasks.map(t=>({objectiveId:t.id,targetId:t.id,position:translate(t.at),kind:'interaction'})),...crystals.slice(0,3).map(c=>({objectiveId:c.id,targetId:c.id,position:translate(c.position),kind:'crystal'}))]
const wardenPosition=[buildings.find(b=>b.id==='stepped-tower').x,KASHI_DISTRICT.spawn[1],KASHI_DISTRICT.roads.find(r=>r.id==='landmark-walk').z]
const dx=wardenPosition[0],dz=wardenPosition[2]+69
export const MISSION1_CITY_PLACEMENTS=deepFreeze({
 version:1,id:'mission1-phase3c-placement-1',missionId:'mission-1',maxActiveRegular:3,
 player:{anchorId:'salvage-road-entry',position:[...KASHI_DISTRICT.spawn],grounding:'native-support'},objectives,opponents,
 warden:{actorId:'arena-warden',encounterId:'warden',category:'boss',position:wardenPosition,grounding:'native-support',
  trigger:{minX:dx-8.6,maxX:dx+8.6,minZ:dz-77,entranceZ:dz-58.2},movement:{minX:dx-7.6,maxX:dx+7.6,minZ:dz-76,maxZ:dz-60.2}},
 relic:{objectiveId:'recover-relic',targetId:'warden-relic',position:[wardenPosition[0],1.15,wardenPosition[2]],followVerifiedDeath:true},
 checkpoints:[{id:'salvage-road-entry',position:[...KASHI_DISTRICT.spawn]},{id:'warden-arena',position:[...wardenPosition]}],
})

export function insideMission1City(p){return [KASHI_DISTRICT,KASHI_NEIGHBORHOOD,TERRACE_WALK].some(({bounds:b})=>p.x>=b.minX&&p.x<=b.maxX&&p.z>=b.minZ&&p.z<=b.maxZ)}
const finitePosition=p=>Array.isArray(p)&&p.length===3&&p.every(Number.isFinite)&&insideMission1City({x:p[0],z:p[2]})
export function validateMission1Placements(value=MISSION1_CITY_PLACEMENTS,{roster,content}={}){
 requireCondition(value?.version===1&&value.missionId==='mission-1'&&value.maxActiveRegular===3,'INVALID_CITY_PLACEMENT','Mission identity, placement version and budget required')
 requireCondition(Array.isArray(value.opponents)&&value.opponents.length===11,'INVALID_CITY_PLACEMENT','Exactly eleven assigned opponents required')
 const ids=new Set(),actors=new Set(),rooms=new Set()
 for(const p of value.opponents){
  const expected=source.find(s=>s.buildingId===p.encounterId)?.enemies[0],room=MISSION1_CITY_ROOMS.find(r=>r.id===p.roomId)
  requireCondition(expected&&room&&!ids.has(p.encounterId)&&!actors.has(p.actorId)&&!rooms.has(p.roomId)&&p.actorId===expected.id&&p.classId===expected.type&&p.category==='regular'&&p.activationRadius===44,'INVALID_CITY_PLACEMENT','Unique existing encounter/actor/room ownership required')
  requireCondition(finitePosition(p.position)&&p.position[0]>room.bounds.minX&&p.position[0]<room.bounds.maxX&&p.position[2]>room.bounds.minZ&&p.position[2]<room.bounds.maxZ,'INVALID_CITY_PLACEMENT','Spawn must be finite and inside assigned room')
  requireCondition(Array.isArray(p.patrol)&&p.patrol.length>=2&&p.patrol.every(q=>Array.isArray(q)&&q.length===2&&q.every(Number.isFinite)&&q[0]>room.bounds.minX&&q[0]<room.bounds.maxX&&q[1]>room.bounds.minZ&&q[1]<room.bounds.maxZ),'INVALID_CITY_PLACEMENT','Patrol must remain inside assigned room')
  requireCondition(p.patrol.every((q,i)=>Math.hypot(q[0]-p.patrol[(i+1)%p.patrol.length][0],q[1]-p.patrol[(i+1)%p.patrol.length][1])>1.5),'INVALID_CITY_PLACEMENT','Distinct usable patrol waypoints required')
  if(roster)requireCondition(roster.some(r=>r.id===p.actorId&&r.encounterId===p.encounterId&&r.type===p.classId),'INVALID_CITY_PLACEMENT','Live actor identity mismatch')
  ids.add(p.encounterId);actors.add(p.actorId);rooms.add(p.roomId)
 }
 const expectedObjectives=[...EARLY_MISSIONS['mission-1'].tasks.map(t=>t.id),...crystals.slice(0,3).map(c=>c.id)]
 requireCondition(Array.isArray(value.objectives)&&value.objectives.length===5&&new Set(value.objectives.map(o=>o.objectiveId)).size===5&&value.objectives.every(o=>expectedObjectives.includes(o.objectiveId)&&o.targetId===o.objectiveId&&finitePosition(o.position)),'INVALID_CITY_PLACEMENT','Five existing objective anchors required')
 requireCondition(value.player?.anchorId==='salvage-road-entry'&&finitePosition(value.player.position),'INVALID_CITY_PLACEMENT','Finite city entry required')
 const w=value.warden,t=w?.trigger,m=w?.movement
 requireCondition(w?.actorId==='arena-warden'&&w.encounterId==='warden'&&w.category==='boss'&&!actors.has(w.actorId)&&finitePosition(w.position),'INVALID_CITY_PLACEMENT','Separate authored Warden required')
 requireCondition(t&&m&&[t.minX,t.maxX,t.minZ,t.entranceZ,m.minX,m.maxX,m.minZ,m.maxZ].every(Number.isFinite)&&t.minX<m.minX&&m.minX<m.maxX&&m.maxX<t.maxX&&t.minZ<m.minZ&&m.minZ<m.maxZ&&m.maxZ<t.entranceZ&&w.position[0]>m.minX&&w.position[0]<m.maxX&&w.position[2]>m.minZ&&w.position[2]<m.maxZ,'INVALID_CITY_PLACEMENT','Finite nested arena bounds required')
 requireCondition(value.relic?.objectiveId==='recover-relic'&&value.relic.targetId==='warden-relic'&&value.relic.followVerifiedDeath===true&&finitePosition(value.relic.position),'INVALID_CITY_PLACEMENT','Existing verified-death relic required')
 requireCondition(Array.isArray(value.checkpoints)&&value.checkpoints.length===2&&new Set(value.checkpoints.map(c=>c.id)).size===2&&value.checkpoints.every(c=>['salvage-road-entry','warden-arena'].includes(c.id)&&finitePosition(c.position)),'INVALID_CITY_PLACEMENT','Existing checkpoint anchor identities required')
 if(content)requireCondition(content.missionId===value.missionId&&[...value.objectives,value.relic].every(o=>content.objectives.some(c=>c.id===o.objectiveId&&c.targetId===o.targetId))&&value.opponents.every(p=>content.encounters.some(e=>e.id===p.encounterId&&e.category==='regular')),'INVALID_CITY_PLACEMENT','Live mission contract mismatch')
 return value
}
validateMission1Placements()

// Centre lines derived from the existing authored roads, plazas and approaches.
// They are candidate connections, never permission to bypass collision.
const line=r=>r.w>=r.d?[[r.x-r.w/2,r.z],[r.x+r.w/2,r.z]]:[[r.x,r.z-r.d/2],[r.x,r.z+r.d/2]]
const roads=[...KASHI_DISTRICT.roads,...KASHI_NEIGHBORHOOD.roads,...TERRACE_WALK.roads,...TERRACE_WALK.paths]
const approach=[...KASHI_APPROACHES,...KASHI_NEIGHBORHOOD.approaches,...TERRACE_WALK.approaches]
export const MISSION1_CITY_SEGMENTS=deepFreeze([
 ...roads.map(r=>({id:r.id,points:line(r)})),
 ...[KASHI_NEIGHBORHOOD.plaza,TERRACE_WALK.plaza].flatMap((p,i)=>[{id:'plaza-x-'+i,points:[[p.x-p.w/2,p.z],[p.x+p.w/2,p.z]]},{id:'plaza-z-'+i,points:[[p.x,p.z-p.d/2],[p.x,p.z+p.d/2]]}]),
 ...approach.map(a=>({id:'approach-'+a.buildingId,points:a.points})),
 ...MISSION1_CITY_ROOMS.map(r=>({id:'room-'+r.id,roomId:r.id,door:r.door,points:[[r.entry[0],r.entry[2]],[(r.bounds.minX+r.bounds.maxX)/2,(r.bounds.minZ+r.bounds.maxZ)/2]]})),
])
