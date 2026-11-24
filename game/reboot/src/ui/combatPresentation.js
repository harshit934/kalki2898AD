export function boundedHealth(value,max){return Number.isFinite(value)&&Number.isFinite(max)&&max>0?Math.max(0,Math.min(max,value)):0}
export function formatHealth(value,max){const health=boundedHealth(value,max);return health>0&&health<.1?'<0.1':health.toLocaleString('en-US',{maximumFractionDigits:1})}
export function combatStateLabel(session,action){if(session.playerResources.health<=0)return 'Defeated';if(session.state==='suspended')return 'Paused';if(session.state==='concluding')return 'Finalising mission';return ({ready:'Ready',attacking:'Attacking',blocking:'Blocking',dodging:'Dodging',airborne:'Airborne'})[action]??'Ready'}
// Deltas describe authoritative snapshots, not input intent or synthetic hits.
export function combatFeedback(previous,next){
 if(!previous||previous.id!==next?.id||previous.state!=='active'||next.state!=='active')return []
 const messages=[],before=previous.playerResources?.health,after=next.playerResources?.health
 if(Number.isFinite(before)&&Number.isFinite(after)&&before!==after)messages.push(after<before?`Health lost: ${formatHealth(before-after,previous.playerResources.maxHealth)}`:`Health restored: ${formatHealth(after-before,next.playerResources.maxHealth)}`)
 const old=new Map((previous.actorStates??[]).map(a=>[a.instanceId,a]))
 for(const actor of next.actorStates??[]){const prior=old.get(actor.instanceId);if(!prior||!Number.isFinite(actor.health)||!Number.isFinite(prior.health)||actor.health>=prior.health)continue;messages.push(actor.health<=0?`${actor.category==='boss'?'Warden':actor.actorId} defeated`:`${actor.category==='boss'?'Warden':actor.actorId} health lost: ${formatHealth(prior.health-actor.health,prior.maxHealth)}`)}
 return messages.slice(0,3)
}
