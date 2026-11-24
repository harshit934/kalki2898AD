import {campaignEnemyCount} from './encounterWaves.js'
import {BUILDINGS} from './districtLayout.js'

// Required counts are campaign configuration, not a claim of authored future content.
export const campaignBuildingCount=campaignEnemyCount
export const CAMPAIGN_BUILDING_REQUIREMENTS=Object.freeze(Array.from({length:100},(_,i)=>Object.freeze({missionId:`mission-${i+1}`,buildings:campaignBuildingCount(i+1),regularEnemies:campaignEnemyCount(i+1)})))
export const MISSION_ONE_BUILDINGS=Object.freeze([
  {id:'roadside-aid',label:'Roadside aid room',at:[2.5,-.22,-10.3],route:[[2.5,-10.3],[2.5,-12.0],[2.5,-10.3]]},
  ...BUILDINGS.map(b=>({id:b.id,label:b.name,at:[b.x+1,-.22,b.z+2],route:[[b.x+1,b.z+2],[b.x+1,b.z],[b.x+1,b.z+2]]})),
])
export function buildingClearance(roster,defeated){
  const cleared=new Set(defeated)
  return roster.map(e=>({id:e.encounterId,enemyId:e.id,label:e.location,at:e.homePosition??e.position,cleared:cleared.has(e.id)}))
}
