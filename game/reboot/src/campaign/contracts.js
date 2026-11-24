import {validateDeploymentDefinitions} from '../missions/encounters.js'
export const SCHEMA_VERSION=1
export const SESSION_STATES=Object.freeze(['preparing','active','suspended','concluding','completed','failed','releasing'])
export class CampaignError extends Error {
  constructor(code,message){super(message);this.name='CampaignError';this.code=code}
}
export function requireCondition(condition,code,message){if(!condition)throw new CampaignError(code,message)}
export const clone=value=>JSON.parse(JSON.stringify(value))
export const OBJECTIVE_SOURCES=Object.freeze({'interaction':'interaction','encounter-defeated':'encounters','boss-defeated':'combat','story-event':'story'})
export function validateObjectiveGraph(objectives){
  const map=new Map(objectives.map(o=>[o.id,o]))
  requireCondition(map.size===objectives.length,'INVALID_OBJECTIVE','Duplicate objective IDs')
  for(const objective of objectives){
    const prerequisites=objective.prerequisites??[]
    requireCondition(Array.isArray(prerequisites)&&new Set(prerequisites).size===prerequisites.length,'INVALID_DEPENDENCY','Prerequisites must be unique IDs')
    for(const id of prerequisites)requireCondition(typeof id==='string'&&map.has(id)&&id!==objective.id,'INVALID_DEPENDENCY','Missing or self-referencing prerequisite')
  }
  const visiting=new Set(),visited=new Set()
  function visit(id){requireCondition(!visiting.has(id),'DEPENDENCY_CYCLE','Objective dependency cycle');if(visited.has(id))return;visiting.add(id);for(const dep of map.get(id).prerequisites??[])visit(dep);visiting.delete(id);visited.add(id)}
  for(const id of map.keys())visit(id)
}
export function objectiveReady(objective,completedIds){return (objective.prerequisites??[]).every(id=>completedIds.includes(id))}
export function deepFreeze(value){if(value&&typeof value==='object'){Object.freeze(value);Object.values(value).forEach(deepFreeze)}return value}
export function validateMissionDefinition(mission){
  requireCondition(mission&&Number.isInteger(mission.number)&&mission.number>=1&&mission.number<=100,'INVALID_MISSION','Mission number must be 1–100')
  requireCondition(mission.id===`mission-${mission.number}`&&mission.arcId===Math.ceil(mission.number/10),'INVALID_MISSION','Mission identity/arc mismatch')
  requireCondition(typeof mission.title==='string'&&mission.title.trim().length>0,'INVALID_MISSION','Mission title is required')
  requireCondition(typeof mission.designSource==='string'&&mission.designSource.length>0,'INVALID_MISSION','Design provenance is required')
  return mission
}
/** Runtime content contract. References belong to the future world adapter; no default zone or enemy roster. */
export function validateRuntimeContent(content){
  requireCondition(content&&typeof content.zoneId==='string'&&content.zoneId.length>0&&typeof content.entryPointId==='string'&&content.entryPointId.length>0,'MISSING_WORLD_CONTENT','Zone and entry point are required')
  requireCondition(Array.isArray(content.objectives)&&content.objectives.length>0,'MISSING_OBJECTIVES','Playable content needs actual objective definitions')
  const ids=new Set()
  for(const objective of content.objectives){
    requireCondition(objective&&typeof objective.id==='string'&&objective.id.length>0&&!ids.has(objective.id),'INVALID_OBJECTIVE','Objective IDs must be unique')
    requireCondition(['interaction','encounter-defeated','boss-defeated','story-event'].includes(objective.event),'INVALID_OBJECTIVE','Unsupported objective event')
    requireCondition(typeof objective.targetId==='string'&&objective.targetId.length>0,'INVALID_OBJECTIVE','An explicit objective target is required')
    requireCondition(objective.source===OBJECTIVE_SOURCES[objective.event],'INVALID_EVIDENCE_SOURCE','Objective requires its gameplay subsystem; presentation is not evidence')
    ids.add(objective.id)
  }
  validateObjectiveGraph(content.objectives)
  for(const objective of content.objectives)if(objective.required!==undefined)requireCondition(typeof objective.required==='boolean','INVALID_OBJECTIVE','Required must be boolean')
  if(content.contentVersion!==undefined)requireCondition(typeof content.contentVersion==='string'&&content.contentVersion.length>0,'INVALID_CONTENT_VERSION','Content version must be explicit')
  if(content.encounters!==undefined){
    requireCondition(Array.isArray(content.encounters),'INVALID_ENCOUNTER','Encounter definitions must be an array')
    const encounterIds=new Set()
    for(const encounter of content.encounters){
      requireCondition(encounter&&typeof encounter.id==='string'&&encounter.id.length&&!encounterIds.has(encounter.id)&&Array.isArray(encounter.waves)&&encounter.waves.length>0,'INVALID_ENCOUNTER','Invalid or duplicate encounter')
      encounterIds.add(encounter.id)
      requireCondition(Array.isArray(encounter.objectivePrerequisites??[])&&new Set(encounter.objectivePrerequisites??[]).size===(encounter.objectivePrerequisites??[]).length&&(encounter.objectivePrerequisites??[]).every(id=>ids.has(id)),'INVALID_DEPENDENCY','Encounter objective prerequisites must reference unique known objectives')
      const waveIds=encounter.waves.map(w=>w.id)
      requireCondition(waveIds.every(id=>typeof id==='string'&&id.length)&&new Set(waveIds).size===waveIds.length,'INVALID_ENCOUNTER','Invalid or duplicate wave')
      requireCondition(content.objectives.some(o=>o.event===(encounter.category==='boss'?'boss-defeated':'encounter-defeated')&&o.targetId===encounter.id),'INVALID_ENCOUNTER','Encounter requires an explicit completion objective')
    }
  }
  validateDeploymentDefinitions(content.encounters??[])
  const dependencies=new Map(content.objectives.map(o=>['objective:'+o.id,(o.prerequisites??[]).map(id=>'objective:'+id)]))
  for(const e of content.encounters??[]){dependencies.set('encounter:'+e.id,[...(e.prerequisites??[]).map(id=>'encounter:'+id),...(e.objectivePrerequisites??[]).map(id=>'objective:'+id)]);for(const o of content.objectives)if(['encounter-defeated','boss-defeated'].includes(o.event)&&o.targetId===e.id)dependencies.get('objective:'+o.id).push('encounter:'+e.id)}
  const checking=new Set(),checked=new Set()
  function visitDependency(id){requireCondition(!checking.has(id),'DEPENDENCY_CYCLE','Combined encounter/objective dependency cycle');if(checked.has(id))return;checking.add(id);for(const dependency of dependencies.get(id)??[])visitDependency(dependency);checking.delete(id);checked.add(id)}
  for(const id of dependencies.keys())visitDependency(id)
  requireCondition(Array.isArray(content.rewards),'INVALID_REWARDS','Rewards must be explicitly declared')
  const rewardIds=new Set()
  for(const reward of content.rewards){
    requireCondition(reward&&typeof reward.id==='string'&&reward.id.length>0&&!rewardIds.has(reward.id),'INVALID_REWARDS','Reward IDs must be unique')
    requireCondition(['currency','score'].includes(reward.kind)&&Number.isFinite(reward.amount)&&reward.amount>=0,'INVALID_REWARDS','Only declared currency or score rewards are supported')
    rewardIds.add(reward.id)
  }
  requireCondition(content.episodeEquipment&&Array.isArray(content.episodeEquipment.weaponIds)&&Array.isArray(content.episodeEquipment.abilityIds),'INVALID_EPISODE_EQUIPMENT','Episode equipment must be explicit')
  for(const ids of Object.values(content.episodeEquipment))requireCondition(Array.isArray(ids)&&ids.every(id=>typeof id==='string'&&id.length>0),'INVALID_EPISODE_EQUIPMENT','Equipment IDs must be strings')
  return content
}
/** MissionSession: one attempt, explicit state, immutable episode loadout, earned inventory stored elsewhere. */
export function validateSession(session){
  requireCondition(session&&typeof session.id==='string'&&typeof session.missionId==='string'&&SESSION_STATES.includes(session.state),'INVALID_SESSION','Invalid session contract')
  requireCondition(Array.isArray(session.completedObjectiveIds),'INVALID_SESSION','Objective state must be explicit')
  return session
}
