import {clone,requireCondition} from '../campaign/contracts.js'
import {createEnemyActors} from './enemyActors.js'
export function wavePrerequisites(encounter,wave){const index=encounter.waves.findIndex(w=>w.id===wave.id);return wave.prerequisites??(index>0?[encounter.waves[index-1].id]:[])}
export function validateDeploymentDefinitions(encounters){
 const ids=new Set(),actors=new Set()
 for(const e of encounters){
  requireCondition(e&&typeof e.id==='string'&&e.id.length&&!ids.has(e.id),'INVALID_ENCOUNTER','Encounter IDs must be unique');ids.add(e.id)
  requireCondition(['regular','boss'].includes(e.category)&&Array.isArray(e.anchors)&&e.anchors.length&&e.anchors.every(id=>typeof id==='string'&&id.length)&&new Set(e.anchors).size===e.anchors.length,'INVALID_DEPLOYMENT','Explicit encounter category and anchors required')
  requireCondition(e.policy?.mode==='waves'&&Number.isSafeInteger(e.policy.maxActive)&&e.policy.maxActive>0,'INVALID_DEPLOYMENT','Explicit positive deployment budget required')
  requireCondition(Array.isArray(e.waves)&&e.waves.length,'INVALID_DEPLOYMENT','At least one wave required')
  const waveIds=new Set()
  for(const w of e.waves){
   requireCondition(typeof w.id==='string'&&w.id.length&&!waveIds.has(w.id)&&Array.isArray(w.enemies)&&w.enemies.length&&w.enemies.length<=e.policy.maxActive,'INVALID_DEPLOYMENT','Unique waves require explicit bounded enemy assignments');waveIds.add(w.id)
   for(const a of w.enemies){requireCondition(typeof a.id==='string'&&a.id.length&&!actors.has(a.id)&&typeof a.classId==='string'&&a.classId.length&&e.anchors.includes(a.anchorId),'INVALID_DEPLOYMENT','Unique actor ID, class and valid anchor required');actors.add(a.id)}
  }
  const checking=new Set(),checked=new Set()
  function visitWave(id){requireCondition(waveIds.has(id)&&!checking.has(id),'INVALID_WAVE_DEPENDENCY','Unknown or cyclic wave prerequisite');if(checked.has(id))return;checking.add(id);const wave=e.waves.find(w=>w.id===id),deps=wavePrerequisites(e,wave);requireCondition(Array.isArray(deps)&&new Set(deps).size===deps.length,'INVALID_WAVE_DEPENDENCY','Unique wave prerequisites required');for(const dep of deps)visitWave(dep);checking.delete(id);checked.add(id)}
  for(const id of waveIds)visitWave(id)
  requireCondition(e.category!=='boss'||e.waves.reduce((n,w)=>n+w.enemies.length,0)===1,'INVALID_DEPLOYMENT','Boss encounter must declare its separate principal actor')
  requireCondition(Array.isArray(e.prerequisites??[])&&new Set(e.prerequisites??[]).size===(e.prerequisites??[]).length,'INVALID_DEPLOYMENT','Prerequisites must be unique encounter IDs')
 }
 const visiting=new Set(),visited=new Set(),map=new Map(encounters.map(e=>[e.id,e]))
 function visit(id){requireCondition(map.has(id)&&!visiting.has(id),'INVALID_DEPLOYMENT','Missing or cyclic encounter dependency');if(visited.has(id))return;visiting.add(id);for(const dep of map.get(id).prerequisites??[])visit(dep);visiting.delete(id);visited.add(id)}
 for(const id of ids)visit(id)
}
export function createEncounterOrchestrator({sessionId,definitions,adapter,signal,restored=[],canDeploy=()=>true,onChange=()=>{},onOutcome=()=>{},onError=()=>{}}){
 validateDeploymentDefinitions(definitions)
 const map=new Map(definitions.map(e=>[e.id,e])),records=new Map(definitions.map(e=>{const saved=restored.find(s=>s.encounterId===e.id);return [e.id,{state:saved?.failed?'failed':'pending',defeated:new Set(saved?.defeatedActorIds??[]),completedWaves:new Set(),active:null,promise:null}]})),events=new Set()
 let closed=false,releasePromise=null
 const actorLifecycle=createEnemyActors({sessionId,signal,onChange,onError:(error,actor)=>{if(actor)records.get(actor.encounterId).cleanupFailed=true;onError(error)}})
 let cancelResolve
 const cancelled=new Promise(resolve=>{cancelResolve=resolve})
 const abort=()=>{closed=true;cancelResolve({cancelled:true})}
 signal.addEventListener('abort',abort,{once:true})
 for(const e of definitions){const r=records.get(e.id);for(const w of e.waves)if(w.enemies.every(a=>r.defeated.has(a.id)))r.completedWaves.add(w.id);if(r.completedWaves.size===e.waves.length)r.state='completed'}
 function owned(event){requireCondition(!closed&&!signal.aborted,'SESSION_CANCELLED','Encounter owner released');requireCondition(event.sessionId===sessionId,'SESSION_MISMATCH','Wrong encounter session')}
 function semantic(){return definitions.map(e=>({encounterId:e.id,defeatedActorIds:[...records.get(e.id).defeated],failed:records.get(e.id).state==='failed'}))}
 function snapshot(){return definitions.map(e=>{const r=records.get(e.id);return {id:e.id,category:e.category,state:r.state,completedWaves:[...r.completedWaves],defeatedActorIds:[...r.defeated],activeActorIds:r.active?r.active.wave.enemies.filter(a=>!r.defeated.has(a.id)).map(a=>a.id):[],regularDefeats:e.category==='regular'?r.defeated.size:0,bossDefeats:e.category==='boss'?r.defeated.size:0}})}
 async function cleanup(active){if(!active||active.cleaned)return;active.cleaned=true;await Promise.all((active.actorIds??[]).map(id=>actorLifecycle.remove(id)));try{await active.release?.()}catch(error){if(active.encounterId)records.get(active.encounterId).cleanupFailed=true;onError(error)}}
 async function deploy(id){
  owned({sessionId});const e=map.get(id),r=records.get(id);requireCondition(e,'UNKNOWN_ENCOUNTER','No encounter fallback')
  if(r.promise)return r.promise
  if(r.state==='completed'||r.state==='active')return snapshot()
  requireCondition(r.state==='pending'&&(e.prerequisites??[]).every(dep=>records.get(dep).state==='completed')&&canDeploy(e),'ENCOUNTER_NOT_READY','Encounter prerequisites or state prevent deployment')
  requireCondition(typeof adapter?.deploy==='function','MISSING_DEPLOYMENT_ADAPTER','Explicit encounter deployment adapter required')
  const wave=e.waves.find(w=>!r.completedWaves.has(w.id)&&wavePrerequisites(e,w).every(dep=>r.completedWaves.has(dep)))
  requireCondition(wave,'WAVE_NOT_READY','No eligible wave; recovery requires explicit compatible state')
  const actors=wave.enemies.filter(a=>!r.defeated.has(a.id))
  r.state='deploying';onChange()
  for(const actor of actors)actorLifecycle.request({actorId:actor.id,encounterId:id,waveId:wave.id,category:e.category})
  const work=Promise.resolve().then(async()=>{
   let active
   try{
    owned({sessionId})
    const pending=Promise.resolve(adapter.deploy(Object.freeze({sessionId,encounterId:id,waveId:wave.id,category:e.category,actors:clone(actors),signal,createActor(options){requireCondition(actors.some(a=>a.id===options.actorId),'ACTOR_OWNERSHIP_MISMATCH','Actor is outside this deployment plan');return actorLifecycle.createActor({...options,encounterId:options.encounterId??id})}}))).then(result=>{
     const handle={wave,encounterId:id,actorIds:actors.map(a=>a.id),release:result?.release,cleaned:false}
     if(closed)void cleanup(handle)
     return {result,handle}
    })
    const deployment=await Promise.race([pending,cancelled]);owned({sessionId})
    const result=deployment.result;active=deployment.handle
    requireCondition(typeof result?.release==='function'&&Array.isArray(result.actorIds)&&result.actorIds.length===actors.length&&new Set(result.actorIds).size===actors.length&&actors.every(a=>result.actorIds.includes(a.id)),'DEPLOYMENT_FAILED','Adapter must register exactly the requested actors and cleanup')
    owned({sessionId});for(const actor of actors)actorLifecycle.activate(actor.id);r.active=active;r.state='active';onChange();return snapshot()
   }catch(error){await cleanup(active);await Promise.all(actors.map(a=>actorLifecycle.remove(a.id)));if(!closed){r.state='failed';onError(error,{kind:'deployment-failure',encounterId:id});onChange()}throw error}
   finally{r.promise=null}
  });r.promise=work;return work
 }
 async function death(event){
  owned(event);requireCondition(event.type==='enemy-defeated'&&event.source==='combat'&&typeof event.eventId==='string'&&event.eventId.trim().length,'INVALID_DEFEAT','Authoritative combat/death event required')
  requireCondition(actorLifecycle.verified(event),'UNCONFIRMED_DEATH','Only a receipt from confirmed combat health depletion is authoritative')
  const e=map.get(event.encounterId),r=records.get(event.encounterId),wave=e?.waves.find(w=>w.id===event.waveId)
  requireCondition(wave?.enemies.some(a=>a.id===event.actorId),'UNKNOWN_ACTOR','Actor does not belong to encounter/wave')
  if(events.has(event.eventId)||r.defeated.has(event.actorId))return snapshot()
  requireCondition(r.state==='active'&&r.active?.wave.id===wave.id,'ENCOUNTER_NOT_ACTIVE','Actor must be registered in active wave')
  events.add(event.eventId);r.defeated.add(event.actorId);onChange()
  if(wave.enemies.every(a=>r.defeated.has(a.id))){
   r.state='resolving';onChange();await cleanup(r.active);r.active=null;owned(event)
   r.completedWaves.add(wave.id);r.state=r.completedWaves.size===e.waves.length?'completed':'pending'
   onOutcome({encounterId:e.id,waveId:wave.id,completed:r.state==='completed',category:e.category});onChange()
  }
  return snapshot()
 }
 async function damage(event){owned(event);const r=records.get(event.encounterId);requireCondition(r,'UNKNOWN_ENCOUNTER','Unknown combat encounter');const receipt=actorLifecycle.damage(event,r.state==='active');if(receipt)return death(receipt);return snapshot()}
 async function removeActor(event){owned(event);requireCondition(['despawn','unload','reset','destroy'].includes(event.reason),'INVALID_REMOVAL','Explicit non-death removal reason required');const r=records.get(event.encounterId);requireCondition(r,'UNKNOWN_ENCOUNTER','Unknown encounter');await actorLifecycle.removeOwned(event);r.state='failed';await cleanup(r.active);r.active=null;onChange();return snapshot()}
 async function retry(id){owned({sessionId});const e=map.get(id),r=records.get(id);requireCondition(e&&r.state==='failed'&&!r.promise,'INVALID_RECOVERY','Only settled failed encounters can retry');requireCondition(!r.cleanupFailed,'CLEANUP_UNRESOLVED','Cleanup failed; automatic recovery is unsafe');actorLifecycle.forgetRemoved(e.waves.flatMap(w=>w.enemies).filter(a=>!r.defeated.has(a.id)).map(a=>a.id));r.active=null;r.state='pending';onChange();return deploy(id)}
 function release(){if(releasePromise)return releasePromise;closed=true;cancelResolve({cancelled:true});signal.removeEventListener('abort',abort);releasePromise=Promise.all([...records.values()].map(r=>cleanup(r.active))).then(async()=>{await actorLifecycle.release();for(const r of records.values())r.active=null});return releasePromise}
 return Object.freeze({deploy,retry,death,damage,removeActor,actorSnapshot:actorLifecycle.snapshot,semantic,snapshot,release})
}
