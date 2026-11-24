import {clone,requireCondition,objectiveReady} from '../campaign/contracts.js'
import {wavePrerequisites} from './encounters.js'
const plain=value=>value&&typeof value==='object'&&Object.getPrototypeOf(value)===Object.prototype
export function assertSerializable(value,seen=new Set()){
 if(value===null||typeof value==='string'||typeof value==='boolean')return
 if(typeof value==='number'){requireCondition(Number.isFinite(value),'INVALID_CHECKPOINT','Non-finite checkpoint number');return}
 requireCondition((Array.isArray(value)||plain(value))&&!seen.has(value),'INVALID_CHECKPOINT','Only acyclic plain JSON data can be checkpointed')
 seen.add(value);for(const key of Reflect.ownKeys(value)){if(Array.isArray(value)&&key==='length')continue;requireCondition(typeof key==='string'&&!['__proto__','prototype','constructor'].includes(key),'INVALID_CHECKPOINT','Unsafe checkpoint key');const descriptor=Object.getOwnPropertyDescriptor(value,key);requireCondition(descriptor&&Object.hasOwn(descriptor,'value'),'INVALID_CHECKPOINT','Checkpoint accessors are forbidden');assertSerializable(descriptor.value,seen)}seen.delete(value)
}
function keys(value,allowed){requireCondition(plain(value)&&Object.keys(value).every(key=>allowed.includes(key)),'INVALID_CHECKPOINT','Unsupported checkpoint fields')}
function ids(value){requireCondition(Array.isArray(value)&&value.every(id=>typeof id==='string'&&id.trim().length)&&new Set(value).size===value.length,'INVALID_CHECKPOINT','Checkpoint IDs must be unique strings')}
export function validateResources(resources){
 assertSerializable(resources)
 keys(resources,['health','maxHealth','healingCharges','healingCapacity'])
 for(const value of Object.values(resources))requireCondition(Number.isFinite(value)&&value>=0,'INVALID_CHECKPOINT','Invalid player resource')
 if(Object.hasOwn(resources,'health'))requireCondition(Number.isFinite(resources.maxHealth)&&resources.health<=resources.maxHealth,'INVALID_CHECKPOINT','Health exceeds declared maximum')
 if(Object.hasOwn(resources,'healingCharges'))requireCondition(Number.isSafeInteger(resources.healingCharges)&&Number.isSafeInteger(resources.healingCapacity)&&resources.healingCharges<=resources.healingCapacity,'INVALID_CHECKPOINT','Invalid healing inventory')
 return resources
}
export function validateCheckpointEnvelope(checkpoint,catalogue){
 assertSerializable(checkpoint)
 keys(checkpoint,['version','missionId','contentVersion','checkpointId','completedObjectiveIds','defeatedEncounterIds','completedWaves','resources','policy','recovery','phase','conclusion','failedObjectiveIds','encounterState'])
 requireCondition(checkpoint.version===1,'UNSUPPORTED_CHECKPOINT','Unsupported checkpoint version')
 requireCondition(catalogue.canSelect(checkpoint.missionId),'UNKNOWN_MISSION','Unknown checkpoint mission')
 requireCondition(typeof checkpoint.contentVersion==='string'&&checkpoint.contentVersion.length&&typeof checkpoint.checkpointId==='string'&&checkpoint.checkpointId.length,'INVALID_CHECKPOINT','Checkpoint identity/version missing')
 ids(checkpoint.completedObjectiveIds);ids(checkpoint.defeatedEncounterIds)
 requireCondition(Array.isArray(checkpoint.completedWaves),'INVALID_CHECKPOINT','Wave state must be explicit')
 const waveKeys=[];for(const wave of checkpoint.completedWaves){keys(wave,['encounterId','waveId']);ids([wave.encounterId]);ids([wave.waveId]);waveKeys.push(JSON.stringify([wave.encounterId,wave.waveId]))}ids(waveKeys)
 if(checkpoint.failedObjectiveIds!==undefined){ids(checkpoint.failedObjectiveIds);requireCondition(!checkpoint.failedObjectiveIds.some(id=>checkpoint.completedObjectiveIds.includes(id)),'INVALID_CHECKPOINT','Failed/completed objectives overlap')}
 if(checkpoint.encounterState!==undefined){requireCondition(Array.isArray(checkpoint.encounterState),'INVALID_CHECKPOINT','Encounter semantic state must be an array');ids(checkpoint.encounterState.map(e=>e.encounterId));for(const row of checkpoint.encounterState){keys(row,['encounterId','defeatedActorIds','failed']);ids(row.defeatedActorIds);requireCondition(typeof row.failed==='boolean','INVALID_CHECKPOINT','Explicit encounter failure state required')}}
 validateResources(checkpoint.resources)
 keys(checkpoint.policy,['restart','resume']);requireCondition(checkpoint.policy.restart==='fresh-attempt'&&checkpoint.policy.resume==='semantic','UNSUPPORTED_CHECKPOINT','Unsupported checkpoint policy')
 keys(checkpoint.recovery,['createdAt','originSessionId','mode']);requireCondition(Number.isSafeInteger(checkpoint.recovery.createdAt)&&checkpoint.recovery.createdAt>=0&&typeof checkpoint.recovery.originSessionId==='string'&&checkpoint.recovery.mode==='explicit','INVALID_CHECKPOINT','Invalid recovery metadata')
 requireCondition(['active','concluding'].includes(checkpoint.phase),'INVALID_CHECKPOINT','Invalid checkpoint phase')
 if(checkpoint.conclusion!==null){keys(checkpoint.conclusion,['id','accepted']);requireCondition(typeof checkpoint.conclusion.id==='string'&&typeof checkpoint.conclusion.accepted==='boolean','INVALID_CHECKPOINT','Invalid conclusion metadata')}
 requireCondition(checkpoint.phase==='concluding'?checkpoint.conclusion!==null:checkpoint.conclusion===null,'INVALID_CHECKPOINT','Checkpoint conclusion/phase mismatch')
 return clone(checkpoint)
}
export function validateCheckpoint(checkpoint,content,catalogue){
 // Additive upgrade: validate the exact old graph first. Preserve every earned
 // outcome; only an empty pending encounter is introduced. No fabricated kills.
 if(content.legacyBattleContent&&checkpoint.encounterState&&!checkpoint.encounterState.some(e=>e.encounterId==='story-boss')){
  const previous=validateCheckpoint(checkpoint,content.legacyBattleContent,catalogue)
  checkpoint={...previous,encounterState:[...previous.encounterState,{encounterId:'story-boss',defeatedActorIds:[],failed:false}],phase:'active',conclusion:null}
 }
 const cp=validateCheckpointEnvelope(checkpoint,catalogue)
 requireCondition(cp.missionId===content.missionId,'CHECKPOINT_MISSION_MISMATCH','Checkpoint belongs to another mission')
 requireCondition(cp.contentVersion===content.contentVersion,'CONTENT_VERSION_MISMATCH','Checkpoint requires explicit compatible content; no reset or fallback')
 requireCondition(cp.policy.restart===content.checkpointPolicy?.restart&&cp.policy.resume===content.checkpointPolicy?.resume,'UNSUPPORTED_CHECKPOINT','Checkpoint policy differs from content')
 const objectives=new Map(content.objectives.map(o=>[o.id,o])),encounters=new Map((content.encounters??[]).map(e=>[e.id,e]))
 for(const id of cp.completedObjectiveIds){const objective=objectives.get(id);requireCondition(objective&&objectiveReady(objective,cp.completedObjectiveIds),'INVALID_CHECKPOINT','Unknown objective or incomplete prerequisites')}
 for(const id of cp.failedObjectiveIds??[])requireCondition(objectives.has(id),'INVALID_CHECKPOINT','Unknown failed objective')
 for(const row of cp.encounterState??[]){const encounter=encounters.get(row.encounterId);requireCondition(encounter&&row.defeatedActorIds.every(id=>encounter.waves.some(w=>w.enemies.some(a=>a.id===id))),'INVALID_CHECKPOINT','Unknown defeated actor')}
 for(const encounter of content.encounters??[]){const row=cp.encounterState?.find(e=>e.encounterId===encounter.id);requireCondition(row,'INVALID_CHECKPOINT','Explicit actor outcome state required');for(const wave of encounter.waves){const complete=wave.enemies.every(a=>row.defeatedActorIds.includes(a.id));requireCondition(complete===cp.completedWaves.some(w=>w.encounterId===encounter.id&&w.waveId===wave.id),'INVALID_CHECKPOINT','Wave/actor semantic state disagrees')}requireCondition(encounter.waves.every(w=>cp.completedWaves.some(saved=>saved.encounterId===encounter.id&&saved.waveId===w.id))===cp.defeatedEncounterIds.includes(encounter.id),'INVALID_CHECKPOINT','Encounter completion/actor state disagrees')}
 for(const wave of cp.completedWaves)requireCondition(encounters.get(wave.encounterId)?.waves.some(w=>w.id===wave.waveId),'INVALID_CHECKPOINT','Unknown encounter wave')
 for(const e of content.encounters??[]){const row=cp.encounterState?.find(saved=>saved.encounterId===e.id);if(row?.defeatedActorIds.length){requireCondition((e.prerequisites??[]).every(id=>cp.defeatedEncounterIds.includes(id))&&(e.objectivePrerequisites??[]).every(id=>cp.completedObjectiveIds.includes(id)),'INVALID_CHECKPOINT','Encounter evidence precedes its prerequisites');for(const wave of e.waves)if(wave.enemies.some(a=>row.defeatedActorIds.includes(a.id)))requireCondition(wavePrerequisites(e,wave).every(id=>cp.completedWaves.some(w=>w.encounterId===e.id&&w.waveId===id)),'INVALID_CHECKPOINT','Defeats precede wave prerequisites')}}
 for(const id of cp.defeatedEncounterIds){const encounter=encounters.get(id);requireCondition(encounter&&encounter.waves.every(w=>cp.completedWaves.some(row=>row.encounterId===id&&row.waveId===w.id)),'INVALID_CHECKPOINT','Unknown encounter or missing verified waves')}
 for(const objective of content.objectives)if(['encounter-defeated','boss-defeated'].includes(objective.event)&&encounters.has(objective.targetId))requireCondition(!cp.completedObjectiveIds.includes(objective.id)||cp.defeatedEncounterIds.includes(objective.targetId),'INVALID_CHECKPOINT','Objective/encounter state disagrees')
 if(cp.phase==='concluding')requireCondition(content.objectives.filter(o=>o.required!==false).every(o=>cp.completedObjectiveIds.includes(o.id))&&(content.encounters??[]).filter(e=>e.required!==false).every(e=>cp.defeatedEncounterIds.includes(e.id)),'INVALID_CHECKPOINT','Conclusion checkpoint lacks required evidence')
 return cp
}
