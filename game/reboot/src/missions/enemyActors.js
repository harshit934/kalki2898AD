import {clone,requireCondition} from '../campaign/contracts.js'
/** Session-local actor and combat-health authority. No renderer or campaign store. */
export function createEnemyActors({sessionId,signal,onChange=()=>{},onError=()=>{}}){
 const actors=new Map(),receipts=new WeakSet(),damageEvents=new Set()
 let closed=false
 function live(){requireCondition(!closed&&!signal.aborted,'SESSION_CANCELLED','Actor session released')}
 function identity(event){live();requireCondition(event.sessionId===sessionId,'SESSION_MISMATCH','Wrong actor session');const actor=actors.get(event.actorId);requireCondition(actor&&actor.instanceId===event.instanceId&&actor.encounterId===event.encounterId,'ACTOR_OWNERSHIP_MISMATCH','Wrong actor instance/encounter');return actor}
 function request({actorId,encounterId,waveId,category}){live();requireCondition(!actors.has(actorId),'DUPLICATE_ACTOR','Actor already owned in this session');actors.set(actorId,{actorId,encounterId,waveId,category,sessionId,instanceId:globalThis.crypto.randomUUID(),state:'deployment-requested',health:null,maxHealth:null,cleanup:null,cleaned:false,damageIds:new Set(),receipt:null});onChange()}
 function createActor({actorId,maxHealth,release,sessionId:claimedSession=sessionId,encounterId:claimedEncounter}){
  live();requireCondition(claimedSession===sessionId,'SESSION_MISMATCH','Wrong creation session')
  const actor=actors.get(actorId);requireCondition(actor&&(!claimedEncounter||claimedEncounter===actor.encounterId),'ACTOR_OWNERSHIP_MISMATCH','Actor was not requested for this encounter')
  requireCondition(actor.state==='deployment-requested','DUPLICATE_ACTOR','Actor already created')
  requireCondition(Number.isFinite(maxHealth)&&maxHealth>0&&typeof release==='function','INVALID_ACTOR','Explicit health and cleanup required')
  actor.health=maxHealth;actor.maxHealth=maxHealth;actor.cleanup=release;actor.state='actor-created';onChange()
  const token={sessionId,actorId,encounterId:actor.encounterId,instanceId:actor.instanceId}
  return Object.freeze({...token,register(){const current=identity(token);requireCondition(current.state==='actor-created','DUPLICATE_REGISTRATION','Actor cannot register twice');current.state='actor-registered';onChange();return token}})
 }
 function activate(actorId){live();const actor=actors.get(actorId);requireCondition(actor?.state==='actor-registered','ACTOR_NOT_REGISTERED','Every deployed actor must register');actor.state='active-combat';onChange()}
 function damage(event,encounterActive=true){
  const actor=identity(event)
  requireCondition(event.source==='combat'&&typeof event.eventId==='string'&&event.eventId.trim().length&&Number.isFinite(event.amount)&&event.amount>0,'INVALID_DAMAGE','Explicit valid combat damage required')
  if(damageEvents.has(event.eventId))return null
  requireCondition(encounterActive,'ENCOUNTER_NOT_ACTIVE','Damage requires active encounter ownership')
  requireCondition(actor.state==='active-combat','ACTOR_NOT_ACTIVE','Despawned, defeated or unregistered actor cannot take damage')
  damageEvents.add(event.eventId);actor.damageIds.add(event.eventId);actor.health=Math.max(0,actor.health-event.amount)
  if(actor.health===0){actor.state='defeated';const receipt=Object.freeze({sessionId,actorId:actor.actorId,instanceId:actor.instanceId,encounterId:actor.encounterId,waveId:actor.waveId,category:actor.category,eventId:'death:'+actor.instanceId,type:'enemy-defeated',source:'combat'});receipts.add(receipt);actor.receipt=receipt;onChange();return receipt}
  onChange();return null
 }
 function verified(receipt){const actor=actors.get(receipt?.actorId);return Boolean(receipt&&receipts.has(receipt)&&actor?.receipt===receipt&&actor.health===0&&['defeated','removed'].includes(actor.state))}
 async function remove(actorId){const actor=actors.get(actorId);if(!actor||actor.cleaned)return;actor.cleaned=true;actor.state='removed';onChange();try{await actor.cleanup?.()}catch(error){onError(error,actor)}}
 function forgetRemoved(ids){live();for(const id of ids){const actor=actors.get(id);requireCondition(!actor||(actor.state==='removed'&&actor.receipt===null),'ACTOR_RECOVERY_BLOCKED','Only cleaned surviving actors can be retried')}for(const id of ids)actors.delete(id)}
 async function removeOwned(event){identity(event);return remove(event.actorId)}
 function snapshot(){return [...actors.values()].map(({actorId,encounterId,waveId,category,sessionId,instanceId,state,health,maxHealth})=>clone({actorId,encounterId,waveId,category,sessionId,instanceId,state,health,maxHealth}))}
 async function release(){closed=true;await Promise.all([...actors.keys()].map(remove))}
 return Object.freeze({request,createActor,activate,damage,verified,remove,removeOwned,forgetRemoved,snapshot,release})
}
