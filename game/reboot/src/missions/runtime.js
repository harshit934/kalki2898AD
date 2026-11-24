import {applyJournalCommand} from '../campaign/story/journal.js'
import {belowWorld} from './worldFall.js'
import {createObjectiveOrchestrator} from './objectives.js'
import {createEncounterOrchestrator} from './encounters.js'
import {validateCheckpoint,validateResources} from './checkpoints.js'
import {clone,deepFreeze,requireCondition,validateRuntimeContent,validateSession,objectiveReady} from '../campaign/contracts.js'
export function createContentRegistry(catalogue){
 const entries=new Map()
 return Object.freeze({
  register(missionId,content,adapter){
   requireCondition(catalogue.canSelect(missionId),'UNKNOWN_MISSION','Unknown mission ID')
   requireCondition(content?.missionId===missionId,'CONTENT_MISMATCH','Runtime content belongs to another mission')
   requireCondition(!entries.has(missionId),'DUPLICATE_CONTENT','Mission content is already registered')
   validateRuntimeContent(content)
   requireCondition(typeof adapter?.prepare==='function'&&typeof adapter?.release==='function'&&typeof adapter?.pause==='function'&&typeof adapter?.resume==='function','MISSING_ADAPTER','Preparation and release adapters required')
   entries.set(missionId,Object.freeze({content:deepFreeze(clone(content)),adapter:Object.freeze({prepare:adapter.prepare,afterStart:adapter.afterStart,release:adapter.release,pause:adapter.pause,resume:adapter.resume,restore:adapter.restore,captureResources:adapter.captureResources,captureRevivePosition:adapter.captureRevivePosition,encounters:adapter.encounters})}))
  },
  get:id=>entries.get(id)??null,has:id=>entries.has(id),
 })
}
const LEGAL=Object.freeze({preparing:['active','concluding','failed','releasing'],active:['suspended','concluding','releasing'],suspended:['active','releasing'],concluding:['completed','releasing'],completed:['releasing'],failed:['releasing'],releasing:['failed']})
export function validateTransition(from,to){requireCondition(LEGAL[from]?.includes(to),'INVALID_TRANSITION',from+' cannot transition to '+to);return true}
export function createMissionRuntime({catalogue,registry,repository}){
 repository.setCheckpointValidator?.(checkpoint=>{
  const content=registry.get(checkpoint.missionId)?.content
  requireCondition(content,'MISSING_RUNTIME_CONTENT','Checkpoint requires its exact registered content')
  return validateCheckpoint(checkpoint,content,catalogue)
 })
 let progress=repository.load().progress,current=null,selectionSequence=0,reviving=false,revivalPosition=null
 const listeners=new Set(),diagnostics=[]
 let published
 const refresh=()=>{published=deepFreeze({progress:clone(progress),session:current?clone({...current.session,objectiveStates:current.objectives?.snapshot(),encounterStates:current.encounters?.snapshot(),actorStates:current.encounters?.actorSnapshot()}):null,diagnostics:clone(diagnostics)})}
 const snapshot=()=>published
 const notify=()=>{refresh();for(const listener of [...listeners]){try{listener()}catch(error){diagnostics.push({kind:'subscriber-failure',message:String(error)});refresh()}}}
 const record=(owner,kind,error)=>{diagnostics.push({sessionId:owner.session.id,kind,message:String(error?.message??error)});notify()}
 const transition=(owner,to)=>{validateTransition(owner.session.state,to);owner.session.state=to;notify()}
 function select(missionId){
  requireCondition(catalogue.canSelect(missionId),'UNKNOWN_MISSION','Unknown mission; no fallback')
  progress=repository.commit({...progress,selectedMissionId:missionId});selectionSequence++;notify();return snapshot()
 }
 function dispose(owner,fn){
  if(owner.disposed.has(fn))return Promise.resolve()
  owner.disposed.add(fn)
  return Promise.resolve().then(fn).catch(error=>record(owner,'cleanup-failure',error))
 }
 function release(owner,reason){
  if(owner.releasePromise)return owner.releasePromise
  owner.closed=true;owner.abort.abort();owner.cancel();owner.objectives?.release()
  owner.releasePromise=Promise.resolve().then(async()=>{
   await owner.encounters?.release()
   try{await owner.entry.adapter.release(owner.context,reason)}catch(error){record(owner,'cleanup-failure',error)}
   await Promise.all([...owner.resources].map(fn=>dispose(owner,fn)))
  })
  transition(owner,'releasing')
  return owner.releasePromise
 }
 async function start(missionId,{checkpoint=null,freshAttempt=false}={}){
  requireCondition(catalogue.canSelect(missionId),'UNKNOWN_MISSION','Unknown mission; no fallback')
  requireCondition(current?.session.state!=='preparing','SESSION_BUSY','Another mission is preparing')
  const entry=registry.get(missionId)
  requireCondition(entry,'MISSING_RUNTIME_CONTENT','Authored runtime content absent; nothing else was launched')
  validateRuntimeContent(entry.content)
  const restored=checkpoint===null?null:validateCheckpoint(checkpoint,entry.content,catalogue)
  if(restored&&entry.content.resources)requireCondition(Object.keys(entry.content.resources).every(key=>Number.isFinite(restored.resources[key])),'UNSUPPORTED_CHECKPOINT','Checkpoint lacks required authored player resources; original save retained');
  if(restored)requireCondition(typeof entry.adapter.restore==='function','MISSING_RESTORE_ADAPTER','Explicit semantic restore adapter required')
  requireCondition(!current||['completed','failed'].includes(current.session.state),'SESSION_ACTIVE','End the current attempt first')
  if(current){const previous=current;await release(previous,'replacement');if(current===previous)current=null}
  // Recheck after asynchronous disposal: only one caller may claim the slot.
  requireCondition(!current,'SESSION_BUSY','Another session claimed the runtime')
  const selectionAtStart=selectionSequence
  const owner={entry,session:validateSession({id:'session-'+globalThis.crypto.randomUUID(),missionId,state:'preparing',completedObjectiveIds:restored?.completedObjectiveIds??[],failedObjectiveIds:restored?.failedObjectiveIds??[],defeatedEncounterIds:restored?.defeatedEncounterIds??[],completedWaves:restored?.completedWaves??[],playerResources:restored?.resources??clone(validateResources(entry.content.resources??{})),conclusion:restored?.conclusion?{...restored.conclusion,id:globalThis.crypto.randomUUID()}:null,pauseReasons:[],controlError:null,episodeEquipment:clone(entry.content.episodeEquipment)}),abort:new AbortController(),resources:new Set(),disposed:new Set(),closed:false,releasePromise:null,eventIds:new Set(),playerDamageEvents:new Set(),playerInvulnerableUntil:0,playerDamageLastClock:0,controlBusy:false,controlError:null}
  const cancelled=new Promise(resolve=>{owner.cancel=()=>resolve({cancelled:true})});owner.cancelled=cancelled
  owner.context=Object.freeze({sessionId:owner.session.id,signal:owner.abort.signal,restoring:restored!==null,revivalPosition:reviving?clone(revivalPosition):null,
   own(disposer){requireCondition(typeof disposer==='function','INVALID_RESOURCE','Resource disposer required');owner.resources.add(disposer);if(owner.closed)void dispose(owner,disposer)},
   observe(event){return observe({...event,sessionId:owner.session.id})},
   deployEncounter(id){return deployEncounter(id,owner.session.id)},
   retryEncounter(id){return retryEncounter(id,owner.session.id)},
   reportDefeat(event){return reportDefeat({...event,sessionId:owner.session.id})},
   damageEnemy(event){return damageEnemy({...event,sessionId:owner.session.id})},
   sessionState(){owned(owner.session.id);return owner.session.state},
   readPlayerResources(){owned(owner.session.id);return {...owner.session.playerResources}},
   readSession(){owned(owner.session.id);return clone({...owner.session,objectiveStates:owner.objectives.snapshot(),encounterStates:owner.encounters.snapshot(),actorStates:owner.encounters.actorSnapshot()})},
   readActor(token){owned(owner.session.id);requireCondition(token.sessionId===owner.session.id,'SESSION_MISMATCH','Wrong actor reader');const actor=owner.encounters.actorSnapshot().find(a=>a.actorId===token.actorId&&a.instanceId===token.instanceId&&a.encounterId===token.encounterId);requireCondition(actor,'ACTOR_OWNERSHIP_MISMATCH','Unknown actor instance');return actor},
   damagePlayer(event){return damagePlayer({...event,sessionId:owner.session.id})},
   healPlayer(){
    owned(owner.session.id)
    if(!(owner.session.missionId==='mission-1'||owner.entry.content.allowHealing===true)||owner.session.state!=='active'||owner.controlBusy||owner.controlError)return false
    const resources=owner.session.playerResources
    if(!(resources.health>0&&resources.health<resources.maxHealth&&Number.isSafeInteger(resources.healingCharges)&&resources.healingCharges>0))return false
    resources.healingCharges--;resources.health=resources.maxHealth
    record(owner,'player-healed','H healing charge consumed');return true
   },
   reportPlayerFall(position){
    owned(owner.session.id)
    requireCondition(owner.session.state==='active'&&!owner.controlBusy&&!owner.controlError,'NO_ACTIVE_SESSION','Fall defeat requires an active owned session')
    requireCondition(belowWorld(position),'INVALID_WORLD_FALL','Player must be below the world fall plane')
    const resources=owner.session.playerResources
    requireCondition(Number.isFinite(resources.health)&&Number.isFinite(resources.maxHealth),'PLAYER_HEALTH_UNAVAILABLE','Player health not configured')
    if(resources.health<=0)return false
    resources.health=0
    record(owner,'player-fell-out-of-world',{position:{...position}});notify();return true
   },
   removeEnemy(event){return removeEnemy({...event,sessionId:owner.session.id})},
   suspend(reason){return suspend(reason,owner.session.id)},
   resume(reason){return resume(reason,owner.session.id)},
  })
  owner.objectives=createObjectiveOrchestrator(entry.content.objectives,{completed:owner.session.completedObjectiveIds,failed:owner.session.failedObjectiveIds})
  owner.pendingOutcomes=new Map();owner.routing=false
  owner.encounters=createEncounterOrchestrator({canDeploy:e=>(e.objectivePrerequisites??[]).every(id=>owner.session.completedObjectiveIds.includes(id)),sessionId:owner.session.id,definitions:entry.content.encounters??[],adapter:entry.adapter.encounters,signal:owner.abort.signal,restored:restored?.encounterState??[],onChange:()=>{if(current===owner&&!owner.closed)notify()},onError:(error,metadata)=>record(owner,metadata?.kind??'encounter-cleanup-failure',error),onOutcome:outcome=>{
   if(current!==owner||owner.closed)return
   if(!owner.session.completedWaves.some(w=>w.encounterId===outcome.encounterId&&w.waveId===outcome.waveId))owner.session.completedWaves.push({encounterId:outcome.encounterId,waveId:outcome.waveId})
   if(outcome.completed&&!owner.session.defeatedEncounterIds.includes(outcome.encounterId))owner.session.defeatedEncounterIds.push(outcome.encounterId)
   if(outcome.completed){owner.pendingOutcomes.set(outcome.encounterId,outcome);flushOutcomes(owner)}
  }})
  current=owner;notify()
  try{
   const preparation=Promise.resolve().then(()=>owner.closed?{cancelled:true}:entry.adapter.prepare(deepFreeze(clone(owner.session)),owner.context))
   const ready=await Promise.race([preparation,cancelled])
   requireCondition(!ready?.cancelled&&!owner.closed&&current===owner,'SESSION_CANCELLED','Preparation cancelled')
   requireCondition(ready?.ready===true,'CONTENT_NOT_READY','Adapter did not confirm readiness')
   if(restored){
    const result=await Promise.race([Promise.resolve().then(()=>owner.closed?{cancelled:true}:entry.adapter.restore(deepFreeze(clone(restored)),owner.context)),owner.cancelled])
    requireCondition(!owner.closed&&current===owner&&!result?.cancelled,'SESSION_CANCELLED','Restoration cancelled')
    requireCondition(result?.restored===true,'RESTORE_FAILED','Adapter did not acknowledge semantic restoration')
   }
   // A selection made during loading is independent; do not overwrite it.
   if(!reviving&&(selectionSequence===selectionAtStart||freshAttempt)){
    const next=clone(progress)
    if(selectionSequence===selectionAtStart)next.selectedMissionId=missionId
    if(freshAttempt&&next.missionCheckpoints)delete next.missionCheckpoints[missionId]
    progress=repository.commit(next)
   }
   owner.objectives.activateReady();transition(owner,restored?.phase==='concluding'?'concluding':'active');for(const e of owner.encounters.snapshot())if(e.state==='completed')owner.pendingOutcomes.set(e.id,e);flushOutcomes(owner);if(entry.adapter.afterStart)void Promise.resolve().then(()=>{if(!owner.closed)return entry.adapter.afterStart(owner.context,{restored:restored!==null})}).catch(error=>{if(!owner.closed)record(owner,'mission-introduction-failure',error)});return snapshot()
  }catch(error){
   if(!owner.closed){record(owner,'preparation-failure',error);transition(owner,'failed');await release(owner,'preparation-failure');if(current===owner)transition(owner,'failed')}
   throw error
  }
 }
 function flushOutcomes(owner){
  if(!owner||owner!==current||owner.closed||owner.routing||owner.session.state!=='active'||owner.controlBusy||owner.controlError)return
  owner.routing=true
  try{
   let advanced=true
   while(advanced&&current===owner&&!owner.closed){
    advanced=false
    for(const objective of owner.entry.content.objectives){
     if(!owner.pendingOutcomes.has(objective.targetId)||!['encounter-defeated','boss-defeated'].includes(objective.event)||owner.session.completedObjectiveIds.includes(objective.id)||owner.objectives.snapshot()[objective.id]!=='active')continue
     try{observe({sessionId:owner.session.id,eventId:'verified-outcome:'+owner.session.id+':'+objective.id,objectiveId:objective.id,type:objective.event,targetId:objective.targetId,source:objective.source});advanced=true}catch(error){record(owner,'outcome-evidence-rejected',error)}
    }
   }
  }finally{owner.routing=false}
 }
 function observe(event){try{return acceptEvidence(event)}catch(error){if(current&&event?.sessionId===current.session.id)record(current,'objective-evidence-rejected',error);throw error}}
 function acceptEvidence(event){
  requireCondition(current?.session.state==='active','NO_ACTIVE_SESSION','No active mission')
  requireCondition(event?.sessionId===current.session.id,'SESSION_MISMATCH','Evidence belongs to another attempt')
  requireCondition(!current.controlBusy&&!current.controlError,'CONTROL_UNCERTAIN','Adapter pause state must be resolved first')
  requireCondition(typeof event.eventId==='string'&&event.eventId.trim().length>0,'INVALID_EVENT_ID','Stable evidence event ID required')
  const objective=current.entry.content.objectives.find(o=>o.id===event.objectiveId&&o.event===event.type&&o.targetId===event.targetId)
  requireCondition(objective,'INVALID_EVIDENCE','Evidence does not match authored content')
  requireCondition(event.source===objective.source,'INVALID_EVIDENCE_SOURCE','Evidence subsystem does not match')
  requireCondition(objectiveReady(objective,current.session.completedObjectiveIds),'OBJECTIVE_NOT_READY','Objective prerequisites are incomplete')
  if(current.eventIds.has(event.eventId))return snapshot()
  const encounter=(current.entry.content.encounters??[]).find(e=>e.id===objective.targetId&&['encounter-defeated','boss-defeated'].includes(objective.event))
  if(encounter){
   requireCondition(current.encounters.snapshot().find(e=>e.id===encounter.id)?.state==='completed','INCOMPLETE_WAVES','Authoritative encounter outcomes required')
   requireCondition(encounter.waves.every(w=>current.session.completedWaves.some(row=>row.encounterId===encounter.id&&row.waveId===w.id)),'INCOMPLETE_WAVES','All authored waves require verified completion')
   if(!current.session.defeatedEncounterIds.includes(encounter.id))current.session.defeatedEncounterIds.push(encounter.id)
  }
  current.objectives.accept(objective.id)
  current.eventIds.add(event.eventId)
  if(!current.session.completedObjectiveIds.includes(objective.id))current.session.completedObjectiveIds.push(objective.id)
  notify();flushOutcomes(current);return snapshot()
 }
 function owned(sessionId){requireCondition(current&&!current.closed,'NO_ACTIVE_SESSION','No owned mission session');requireCondition(current.session.id===sessionId,'SESSION_MISMATCH','Wrong session owner');return current}
 function verifyCompletion(owner){
  requireCondition(!owner.controlBusy&&!owner.controlError,'CONTROL_UNCERTAIN','Adapter control must be resolved')
  if(Object.hasOwn(owner.session.playerResources,'health'))requireCondition(owner.session.playerResources.health>0,'PLAYER_DEFEATED','Defeated player cannot conclude a mission')
  requireCondition(owner.objectives.mandatoryReady(),'INCOMPLETE_OBJECTIVES','Required objective evidence missing')
  requireCondition((owner.entry.content.encounters??[]).filter(e=>e.required!==false).every(e=>owner.session.defeatedEncounterIds.includes(e.id)),'INCOMPLETE_ENCOUNTERS','Required encounter evidence missing')
 }
 function beginConclusion(sessionId=current?.session.id){
  const owner=owned(sessionId);requireCondition(owner.session.state==='active','INVALID_TRANSITION','Only an active session may begin conclusion');verifyCompletion(owner)
  owner.session.conclusion={id:globalThis.crypto.randomUUID(),accepted:false};transition(owner,'concluding');return snapshot()
 }
 function acceptConclusion({sessionId,conclusionId}){
  const owner=owned(sessionId);requireCondition(owner.session.state==='concluding'&&owner.session.conclusion?.id===conclusionId,'INVALID_CONCLUSION','Conclusion identity/state mismatch')
  verifyCompletion(owner);if(owner.session.conclusion.accepted)return snapshot();owner.session.conclusion.accepted=true;notify();return snapshot()
 }
 function complete(sessionId=current?.session.id){
  const owner=owned(sessionId)
  if(owner.session.state==='completed')return snapshot()
  requireCondition(['active','concluding'].includes(owner.session.state),'NO_ACTIVE_SESSION','Mission cannot complete in this state');verifyCompletion(owner)
  requireCondition(owner.session.state==='concluding'&&owner.session.conclusion?.accepted===true,'CONCLUSION_NOT_ACCEPTED','Explicit accepted conclusion required')
  const next=clone(progress),missionId=owner.session.missionId
  if(!next.completedMissionIds.includes(missionId)){
   next.completedMissionIds.push(missionId)
   for(const reward of owner.entry.content.rewards){const key=missionId+':'+reward.id;if(!Object.hasOwn(next.rewardReceipts,key)){next.rewardReceipts[key]={...reward,rewardId:reward.id,missionId};if(reward.kind==='score')next.score=(next.score??0)+reward.amount;else next.currency+=reward.amount}}
  }
  if(next.missionCheckpoints)delete next.missionCheckpoints[missionId]
  try{progress=repository.reconcileCommit?.(next)??repository.commit(next)}catch(error){record(owner,'completion-commit-failure',error);throw error}
  transition(owner,'completed');return snapshot()
 }
 function observeWave(){requireCondition(false,'AUTHORITATIVE_OUTCOME_REQUIRED','Wave completion must derive from registered combat defeats')}
 async function retryEncounter(id,sessionId=current?.session.id){const owner=owned(sessionId);requireCondition(owner.session.state==='active'&&!owner.controlBusy&&!owner.controlError,'NO_ACTIVE_SESSION','Recovery requires active owned session');return owner.encounters.retry(id)}
 async function deployEncounter(id,sessionId=current?.session.id){const owner=owned(sessionId);requireCondition(owner.session.state==='active'&&!owner.controlBusy&&!owner.controlError,'NO_ACTIVE_SESSION','Deployment requires active owned session');return owner.encounters.deploy(id)}
 async function reportDefeat(event){const owner=owned(event?.sessionId);requireCondition(owner.session.state==='active'&&!owner.controlBusy&&!owner.controlError,'NO_ACTIVE_SESSION','Defeat requires active owned session');return owner.encounters.death(event)}
 function damagePlayer(event){const owner=owned(event.sessionId);requireCondition(owner.session.state==='active'&&!owner.controlBusy&&!owner.controlError,'NO_ACTIVE_SESSION','Player damage requires active owned session');const actor=owner.encounters.actorSnapshot().find(a=>a.actorId===event.actorId&&a.instanceId===event.instanceId&&a.encounterId===event.encounterId);requireCondition(actor?.state==='active-combat'&&actor.health>0,'ACTOR_NOT_ACTIVE','Only living registered combat actors can damage player');requireCondition(event.source==='combat'&&typeof event.eventId==='string'&&event.eventId.length&&Number.isFinite(event.amount)&&event.amount>0,'INVALID_DAMAGE','Verified positive combat damage required');const resources=owner.session.playerResources;requireCondition(Number.isFinite(resources.health)&&Number.isFinite(resources.maxHealth),'PLAYER_HEALTH_UNAVAILABLE','Player health not configured');if(owner.playerDamageEvents.has(event.eventId)||resources.health<=0)return false;requireCondition(Number.isFinite(event.combatTime)&&event.combatTime>=owner.playerDamageLastClock,'INVALID_DAMAGE','Owned monotonic active combat clock required');const time=event.combatTime;owner.playerDamageEvents.add(event.eventId);owner.playerDamageLastClock=time;if(time<owner.playerInvulnerableUntil)return false;owner.playerInvulnerableUntil=time+1800;resources.health=Math.max(0,resources.health-event.amount);notify();return true}
 async function damageEnemy(event){const owner=owned(event?.sessionId);requireCondition(owner.session.state==='active'&&!owner.controlBusy&&!owner.controlError,'NO_ACTIVE_SESSION','Damage requires active owned session');return owner.encounters.damage(event)}
 async function removeEnemy(event){const owner=owned(event?.sessionId);requireCondition(owner.session.state==='active'&&!owner.controlBusy&&!owner.controlError,'NO_ACTIVE_SESSION','Removal requires active owned session');return owner.encounters.removeActor(event)}
 function failObjective(id,sessionId=current?.session.id){const owner=owned(sessionId);requireCondition(owner.session.state==='active','NO_ACTIVE_SESSION','Objective failure requires active session');owner.objectives.fail(id);owner.session.failedObjectiveIds.push(id);notify();return snapshot()}
 async function captureCheckpoint(checkpointId,sessionId=current?.session.id){
  const owner=owned(sessionId);requireCondition(['active','suspended','concluding'].includes(owner.session.state)&&!owner.controlBusy&&!owner.controlError,'INVALID_TRANSITION','Session cannot checkpoint now')
  requireCondition(owner.entry.content.contentVersion&&owner.entry.content.checkpointPolicy,'CHECKPOINT_UNSUPPORTED','Content must explicitly declare version and checkpoint policy')
  const resources=typeof owner.entry.adapter.captureResources==='function'?await owner.entry.adapter.captureResources(owner.context):owner.session.playerResources
  requireCondition(current===owner&&!owner.closed,'SESSION_CANCELLED','Capture belongs to released session')
  requireCondition(['active','suspended','concluding'].includes(owner.session.state)&&!owner.controlBusy&&!owner.controlError,'INVALID_TRANSITION','Capture no longer at a supported safe state')
  validateResources(resources)
  return validateCheckpoint({version:1,missionId:owner.session.missionId,contentVersion:owner.entry.content.contentVersion,checkpointId,completedObjectiveIds:clone(owner.session.completedObjectiveIds),failedObjectiveIds:clone(owner.session.failedObjectiveIds),encounterState:owner.encounters.semantic(),defeatedEncounterIds:clone(owner.session.defeatedEncounterIds),completedWaves:clone(owner.session.completedWaves),resources,policy:clone(owner.entry.content.checkpointPolicy),recovery:{createdAt:Date.now(),originSessionId:owner.session.id,mode:'explicit'},phase:owner.session.state==='concluding'?'concluding':'active',conclusion:clone(owner.session.conclusion)},owner.entry.content,catalogue)
 }
 async function saveCheckpoint(checkpointId,sessionId=current?.session.id){
  const checkpoint=await captureCheckpoint(checkpointId,sessionId)
  const owner=owned(sessionId);requireCondition(['active','suspended','concluding'].includes(owner.session.state),'INVALID_TRANSITION','Cannot save after completion or release');progress=repository.commit({...progress,missionCheckpoints:{...(progress.missionCheckpoints??{}),[checkpoint.missionId]:checkpoint}});notify();return snapshot()
 }
 function recover(missionId){const checkpoint=progress.missionCheckpoints?.[missionId];requireCondition(checkpoint,'MISSING_CHECKPOINT','No checkpoint; no fabricated recovery');return start(missionId,{checkpoint})}
 async function revive(){
  const owner=owned(current?.session.id)
  requireCondition(!reviving,'SESSION_BUSY','Revival already in progress')
  requireCondition(owner.session.missionId==='mission-1'&&['active','suspended'].includes(owner.session.state)&&owner.session.playerResources.health===0,'PLAYER_NOT_DEFEATED','Revive is available only after Mission 1 defeat')
  const anchor=owner.entry.content.entryPointId
  requireCondition(owner.entry.content.checkpointAnchors?.includes(anchor),'CHECKPOINT_UNSUPPORTED','Validated safe entry checkpoint required')
  reviving=true
  try{
   requireCondition(typeof owner.entry.adapter.captureRevivePosition==='function','REVIVE_POSITION_UNAVAILABLE','Owned death position required')
   const position=await owner.entry.adapter.captureRevivePosition(owner.context)
   requireCondition(position&&[position.x,position.y,position.z].every(Number.isFinite)&&!belowWorld(position),'REVIVE_POSITION_UNAVAILABLE','Valid death or last grounded position required')
   revivalPosition={...position}
   const checkpoint=await captureCheckpoint(anchor,owner.session.id)
   checkpoint.resources.health=checkpoint.resources.maxHealth
   checkpoint.resources.healingCharges=checkpoint.resources.healingCapacity
   validateCheckpoint(checkpoint,owner.entry.content,catalogue)
   await end()
   return await start(checkpoint.missionId,{checkpoint})
  }finally{reviving=false;revivalPosition=null}
 }
 async function restart(){const missionId=current?.session.missionId;requireCondition(missionId,'NO_ACTIVE_SESSION','No mission to restart');await end();return start(missionId,{freshAttempt:true})}
 function recoverCompletion(sessionId=current?.session.id){return complete(sessionId)}
 async function control(operation,reason,sessionId){
  requireCondition(current,'INVALID_TRANSITION','No session')
  const owner=current
  requireCondition(owner.session.id===sessionId,'SESSION_MISMATCH','Control belongs to another session')
  requireCondition(typeof reason==='string'&&reason.trim().length>0,'INVALID_PAUSE_REASON','Named pause reason required')
  requireCondition(!owner.closed&&['active','suspended'].includes(owner.session.state),'INVALID_TRANSITION','Session cannot change pause state')
  requireCondition(!owner.controlBusy,'CONTROL_BUSY','Another adapter operation is pending')
  const reasons=owner.session.pauseReasons
  if(operation==='pause'&&reasons.includes(reason))return snapshot()
  requireCondition(operation==='pause'||reasons.includes(reason),'UNKNOWN_PAUSE_REASON','Cannot remove another pause owner')
  if(operation==='pause'&&reasons.length){reasons.push(reason);notify();return snapshot()}
  if(operation==='resume'&&reasons.length>1){owner.session.pauseReasons=reasons.filter(r=>r!==reason);notify();return snapshot()}
  owner.controlBusy=true
  try{
   const result=await Promise.race([Promise.resolve().then(()=>owner.closed?{cancelled:true}:owner.entry.adapter[operation](owner.context,reason)),owner.cancelled])
   requireCondition(!owner.closed&&current===owner&&!result?.cancelled,'SESSION_CANCELLED','Session control cancelled')
   requireCondition(operation==='pause'?result?.paused===true:result?.resumed===true,'ADAPTER_CONTROL_FAILED','Adapter did not acknowledge '+operation)
   owner.controlError=null;owner.session.controlError=null
   owner.session.pauseReasons=operation==='pause'?[reason]:[]
   owner.controlBusy=false
   transition(owner,operation==='pause'?'suspended':'active');flushOutcomes(owner)
   return snapshot()
  }catch(error){
   if(!owner.closed&&current===owner){owner.controlError=operation;owner.session.controlError={operation,reason,message:String(error.message)};record(owner,'adapter-control-failure',error)}
   throw error
  }finally{owner.controlBusy=false}
 }
 function suspend(reason='manual',sessionId=current?.session.id){return control('pause',reason,sessionId)}
 function resume(reason='manual',sessionId=current?.session.id){return control('resume',reason,sessionId)}
 async function end(){const owner=current;if(!owner)return snapshot();await release(owner,'end');if(current===owner){current=null;notify()}return snapshot()}
 function recordCampaign(command){const next=applyJournalCommand(progress,command,catalogue);if(JSON.stringify(next)===JSON.stringify(progress))return snapshot();progress=repository.reconcileCommit?.(next)??repository.commit(next);notify();return snapshot()}
 refresh()
 return Object.freeze({recordCampaign,snapshot,subscribe(listener){requireCondition(typeof listener==='function','INVALID_SUBSCRIBER','Listener required');listeners.add(listener);return()=>listeners.delete(listener)},select,start,observe,observeWave,deployEncounter,retryEncounter,reportDefeat,damageEnemy,removeEnemy,failObjective,beginConclusion,acceptConclusion,complete,recoverCompletion,captureCheckpoint,saveCheckpoint,recover,revive,restart,suspend,resume,end})
}
