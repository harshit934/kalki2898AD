import {getMissionDeployment} from '../../../phase9/phase9B-mission1-r8-20261118/staging/src/game/buildingDeployment.js'
import {MISSION_ONE_BUILDINGS} from '../../../phase9/phase9B-mission1-r8-20261118/staging/src/game/buildingCampaign.js'
import {campaignEnemyCount} from '../../../phase9/phase9B-mission1-r8-20261118/staging/src/game/encounterWaves.js'
import {EARLY_MISSIONS} from '../../../phase9/phase9B-mission1-r8-20261118/staging/src/game/earlyMissionContent.js'
import {crystals} from '../../../phase9/phase9B-mission1-r8-20261118/staging/src/game/missionOneCrystals.js'
import {deepFreeze,requireCondition,validateRuntimeContent} from '../campaign/contracts.js'
import {MISSION1_CITY_PLACEMENTS} from './mission1Placements.js'

export {campaignEnemyCount}
export const MISSION1_ASSETS=Object.freeze({
 player:new URL('../../../public/models/bhairava-free-rig.glb',import.meta.url).href,
 soldier:new URL('../../../public/models/soldier-source.glb',import.meta.url).href,
 kashi:new URL('../../../public/environment/mission1/kashi-riverfront-v1.glb',import.meta.url).href,
 riverbank:new URL('../../../public/environment/mission531/riverbank-v1.glb',import.meta.url).href,
 wardenBody:new URL('../../../public/environment/mission1/warden-body-v1.glb',import.meta.url).href,
 wardenLeg:new URL('../../../public/environment/mission1/warden-leg-v1.glb',import.meta.url).href,
 wardenWeapon:new URL('../../../public/environment/mission1/warden-weapon-v1.glb',import.meta.url).href,
 bujji:new URL('../../../public/environment/mission1/bujji-field-scout-v1.glb',import.meta.url).href,
 relay:new URL('../../../public/environment/mission1/field-relay-v1.glb',import.meta.url).href,
 salvage:new URL('../../../public/environment/mission1/salvage-cell-v1.glb',import.meta.url).href,
 dracoJS:new URL('../../../public/environment/kashi/draco/draco_decoder.js',import.meta.url).href,
 dracoWrapper:new URL('../../../public/environment/kashi/draco/draco_wasm_wrapper.js',import.meta.url).href,
 dracoWasm:new URL('../../../public/environment/kashi/draco/draco_decoder.wasm',import.meta.url).href,
})
const deployment=getMissionDeployment(1)
export const MISSION1_ROSTER=deepFreeze(deployment.buildings.map((building,index)=>{
 const enemy=building.enemies[0],site=MISSION_ONE_BUILDINGS[index]
 return {...enemy,encounterId:site.id,buildingId:site.id,position:[...site.at],patrol:enemy.patrolRoute??site.route}
}))
const tasks=EARLY_MISSIONS['mission-1'].tasks
const objectives=[...tasks.map(t=>({id:t.id,event:'interaction',source:'interaction',targetId:t.id,label:t.label})),...crystals.slice(0,3).map(c=>({id:c.id,event:'interaction',source:'interaction',targetId:c.id,label:'Verify salvage crystal'})),...MISSION1_ROSTER.map(e=>({id:'clear-'+e.encounterId,event:'encounter-defeated',source:'encounters',targetId:e.encounterId})),{id:'defeat-warden',event:'boss-defeated',source:'combat',targetId:'warden'},{id:'recover-relic',event:'interaction',source:'interaction',targetId:'warden-relic',prerequisites:['defeat-warden']}]
const regular=MISSION1_ROSTER.map(e=>({id:e.encounterId,category:'regular',anchors:[e.buildingId],policy:{mode:'waves',maxActive:1},waves:[{id:'assigned-opponent',enemies:[{id:e.id,classId:e.type,anchorId:e.buildingId}]}]}))
export const MISSION1_CONTENT=deepFreeze({missionId:'mission-1',title:'A BOUNTY IN THE DUST',contentVersion:'kashi-reboot-registration-1',zoneId:'kashi-salvage-road',entryPointId:'salvage-road-entry',checkpointPolicy:{restart:'fresh-attempt',resume:'semantic'},episodeEquipment:{weaponIds:['melee'],abilityIds:[]},objectives,encounters:[...regular,{id:'warden',category:'boss',anchors:['warden-arena'],prerequisites:regular.map(e=>e.id),objectivePrerequisites:[...tasks.map(t=>t.id),...crystals.slice(0,3).map(c=>c.id)],policy:{mode:'waves',maxActive:1},waves:[{id:'warden-finale',enemies:[{id:'arena-warden',classId:'warden',anchorId:'warden-arena'}]}]}],
 // Existing boss/relic score values stay score; no currency or unlock conversion.
 rewards:[{id:'boss',kind:'score',amount:2500},{id:'relic',kind:'score',amount:750}],legacyScoreRewards:{boss:2500,relic:750},resources:{health:100,maxHealth:100,healingCharges:5,healingCapacity:5},maxActiveRegular:3,anchors:{'salvage-road-entry':[0,-.22,8],...Object.fromEntries(MISSION1_ROSTER.map(e=>[e.buildingId,e.position])),'warden-arena':[0,-.22,-69],...Object.fromEntries(tasks.map(t=>[t.id,t.at])),...Object.fromEntries(crystals.slice(0,3).map(c=>[c.id,c.position]))},checkpointAnchors:['salvage-road-entry','warden-arena']})
export function validateMission1(content=MISSION1_CONTENT){
 validateRuntimeContent(content);requireCondition(content.missionId==='mission-1'&&content.zoneId==='kashi-salvage-road','CONTENT_MISMATCH','No alternate mission fallback');const regular=content.encounters.filter(e=>e.category==='regular');for(const encounter of regular){const source=MISSION1_ROSTER.find(e=>e.encounterId===encounter.id),actor=encounter.waves[0]?.enemies[0];requireCondition(source&&actor?.id===source.id&&actor.classId===source.type&&actor.anchorId===source.buildingId,'INVALID_DEPLOYMENT','Mission 1 actor identity/class/building mismatch')}const warden=content.encounters.find(e=>e.id==='warden');requireCondition(warden&&warden.prerequisites.length===11&&regular.every(e=>warden.prerequisites.includes(e.id)),'INVALID_DEPLOYMENT','Warden must require every building');requireCondition(regular.length===campaignEnemyCount(1)&&regular.every(e=>e.waves.length===1&&e.waves[0].enemies.length===1),'INVALID_DEPLOYMENT','Mission 1 needs one unique assigned enemy per building');requireCondition(new Set(regular.map(e=>e.id)).size===11&&content.maxActiveRegular===3,'INVALID_DEPLOYMENT','Stable building IDs and active budget required');for(const e of content.encounters)for(const anchor of e.anchors)requireCondition(Array.isArray(content.anchors[anchor])&&content.anchors[anchor].length===3&&content.anchors[anchor].every(Number.isFinite),'MISSING_WORLD_CONTENT','Missing finite deployment anchor');requireCondition(content.encounters.filter(e=>e.category==='boss').length===1&&content.encounters.find(e=>e.id==='warden')?.waves[0].enemies[0].classId==='warden','INVALID_DEPLOYMENT','Warden identity must remain separate');return content
}
export const MISSION1_CITY_REQUIRED_ASSETS=Object.freeze(Object.keys(MISSION1_ASSETS).filter(key=>!['kashi','riverbank'].includes(key)))
// Historical definitions above remain immutable for compatibility checks. Only
// this city content is registered by the application; there is no legacy fallback.
export const MISSION1_CITY_ROSTER=deepFreeze(MISSION1_ROSTER.map(source=>{
 const p=MISSION1_CITY_PLACEMENTS.opponents.find(p=>p.actorId===source.id)
 return {...source,position:[...p.position],homePosition:[...p.position],spawnPosition:[...p.position],patrol:p.patrol,patrolRoute:p.patrol,cityRoomId:p.roomId}
}))
export const MISSION1_CITY_CONTENT=deepFreeze({...MISSION1_CONTENT,objectives:MISSION1_CONTENT.objectives.map(o=>o.id.startsWith('crystal-')?{...o,required:false}:o),encounters:MISSION1_CONTENT.encounters.map(e=>e.id==='warden'?{...e,objectivePrerequisites:e.objectivePrerequisites.filter(id=>!id.startsWith('crystal-'))}:e),contentVersion:'kashi-phase3c-relocation-1',zoneId:'kashi-phase3c-city',
 anchors:{...MISSION1_CONTENT.anchors,...Object.fromEntries(MISSION1_CITY_ROSTER.map(e=>[e.buildingId,e.position])),...Object.fromEntries(MISSION1_CITY_PLACEMENTS.objectives.map(o=>[o.objectiveId,o.position])),'salvage-road-entry':MISSION1_CITY_PLACEMENTS.player.position,'warden-arena':MISSION1_CITY_PLACEMENTS.warden.position,'warden-relic':MISSION1_CITY_PLACEMENTS.relic.position},
})
validateRuntimeContent(MISSION1_CITY_CONTENT)
export async function validateMission1Assets(probe=async url=>{const response=await fetch(url,{method:'HEAD'});return response.ok},signal,assets=MISSION1_ASSETS,keys=Object.keys(MISSION1_ASSETS)){for(const key of keys){requireCondition(!signal?.aborted,'SESSION_CANCELLED','Asset validation cancelled');requireCondition(typeof assets[key]==='string'&&await probe(assets[key]),'MISSING_MISSION_ASSET','Mission 1 asset unavailable: '+key)}requireCondition(!signal?.aborted,'SESSION_CANCELLED','Asset validation cancelled');return true}
validateMission1()
