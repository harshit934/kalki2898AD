import {validateJournal} from './story/journal.js'
import {SCHEMA_VERSION,clone,requireCondition} from './contracts.js'
import {validateCheckpointEnvelope} from '../missions/checkpoints.js'
export function newProgress(){return {schemaVersion:SCHEMA_VERSION,revision:0,selectedMissionId:'mission-1',completedMissionIds:[],rewardReceipts:{},currency:0,score:0,permanentInventory:{weaponIds:[],abilityIds:[],upgrades:{}},storyHistory:[],legacy:null}}
export function validateProgress(value,catalogue){
  requireCondition(value&&value.schemaVersion===SCHEMA_VERSION,'INVALID_SAVE','Unsupported or corrupt reboot save')
  requireCondition(Number.isSafeInteger(value.revision)&&value.revision>=0,'INVALID_SAVE','Invalid save revision')
  requireCondition(catalogue.canSelect(value.selectedMissionId),'INVALID_SAVE','Unknown selected mission')
  requireCondition(Array.isArray(value.completedMissionIds)&&value.completedMissionIds.every(id=>catalogue.canSelect(id))&&new Set(value.completedMissionIds).size===value.completedMissionIds.length,'INVALID_SAVE','Invalid completion history')
  requireCondition(value.rewardReceipts&&typeof value.rewardReceipts==='object'&&!Array.isArray(value.rewardReceipts),'INVALID_SAVE','Invalid reward receipts')
  for(const [key,receipt] of Object.entries(value.rewardReceipts))requireCondition(receipt&&catalogue.canSelect(receipt.missionId)&&value.completedMissionIds.includes(receipt.missionId)&&typeof receipt.rewardId==='string'&&key===`${receipt.missionId}:${receipt.rewardId}`&&['currency','score'].includes(receipt.kind)&&Number.isFinite(receipt.amount)&&receipt.amount>=0,'INVALID_SAVE','Invalid reward receipt')
  if(Object.hasOwn(value,'score'))requireCondition(Number.isFinite(value.score)&&value.score>=0,'INVALID_SAVE','Invalid campaign score')
  requireCondition(!Object.values(value.rewardReceipts).some(r=>r.kind==='score')||Number.isFinite(value.score),'INVALID_SAVE','Score receipts require an explicit score total')
  requireCondition(Number.isFinite(value.currency)&&value.currency>=0,'INVALID_SAVE','Invalid currency')
  requireCondition(value.permanentInventory&&Array.isArray(value.permanentInventory.weaponIds)&&Array.isArray(value.permanentInventory.abilityIds)&&[...value.permanentInventory.weaponIds,...value.permanentInventory.abilityIds].every(id=>typeof id==='string'),'INVALID_SAVE','Invalid permanent inventory')
  requireCondition(Array.isArray(value.storyHistory),'INVALID_SAVE','Invalid story history')
  if(Object.hasOwn(value,'missionCheckpoints')){
    requireCondition(value.missionCheckpoints&&typeof value.missionCheckpoints==='object'&&!Array.isArray(value.missionCheckpoints),'INVALID_CHECKPOINT','Invalid checkpoint map')
    for(const [id,checkpoint] of Object.entries(value.missionCheckpoints)){requireCondition(id===checkpoint?.missionId,'CHECKPOINT_MISSION_MISMATCH','Checkpoint map key mismatch');validateCheckpointEnvelope(checkpoint,catalogue)}
  }
  if(Object.hasOwn(value,'campaignJournal'))validateJournal(value.campaignJournal,catalogue)
  if(Object.hasOwn(value,'objectiveRecords')){
    requireCondition(value.objectiveRecords&&typeof value.objectiveRecords==='object'&&!Array.isArray(value.objectiveRecords),'INVALID_SAVE','Invalid objective reward records')
    for(const [mission,ids]of Object.entries(value.objectiveRecords))requireCondition(catalogue.canSelect(mission)&&Array.isArray(ids)&&ids.length<=100&&new Set(ids).size===ids.length&&ids.every(id=>typeof id==='string'&&/^[a-z][a-z0-9-]{0,99}$/.test(id)),'INVALID_SAVE','Invalid persisted objective milestone')
  }
  return clone(value)
}
