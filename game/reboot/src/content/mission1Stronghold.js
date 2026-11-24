import {deepFreeze} from '../campaign/contracts.js'
import {MISSION1_CITY_PLACEMENTS,MISSION1_CITY_ROOMS} from './mission1Placements.js'

const room=MISSION1_CITY_ROOMS.find(r=>r.id==='weavers-court'),x=room.entry[0],z=room.entry[2]
// Existing court, existing entrance and market lane. No new world geometry.
const posts=[
 {position:[x-3,room.floor,z-7],patrol:[[x-5,z+3],[x-8,z+3]],role:'west entrance guard'},
 {position:[x,room.floor,z-7],patrol:[[x+5,z+3],[x+8,z+3]],role:'east entrance guard'},
 {position:[x+3,room.floor,z-7],patrol:[[x-6,z+9],[x+6,z+9]],role:'street patrol'},
]
export const MISSION1_STRONGHOLD=deepFreeze({buildingId:room.id,label:room.label,entry:[...room.entry],waves:[0,3,6,9].map((start,index)=>({id:'stronghold-wave-'+(index+1),members:MISSION1_CITY_PLACEMENTS.opponents.slice(start,start+3).map((p,slot)=>({actorId:p.actorId,encounterId:p.encounterId,classId:p.classId,roomId:room.id,...posts[slot]}))}))})
export const strongholdPlacement=id=>MISSION1_STRONGHOLD.waves.flatMap(w=>w.members).find(p=>p.actorId===id)??null
export function currentStrongholdWave(session){return MISSION1_STRONGHOLD.waves.find(w=>w.members.some(m=>!session.encounterStates?.some(e=>e.id===m.encounterId&&e.state==='completed')))??null}
export function strongholdContent(content){
 const anchors={...content.anchors}
 for(const e of content.encounters.filter(e=>e.category==='regular')){const p=MISSION1_CITY_PLACEMENTS.opponents.find(p=>p.encounterId===e.id),deployment=strongholdPlacement(p.actorId);anchors[e.anchors[0]]=[...deployment.position]}
 return deepFreeze({...content,anchors,stronghold:MISSION1_STRONGHOLD})
}
