import {ACTIVITIES,activityReceipt} from './definitions.js'
// Only valid proximity/visibility observations advance objectives. The wallet is
// the persistent source of truth; partial trails survive travel within this app.
export function createExplorationActivities({wallet,onEvent=()=>{}}){
 const progress=new Map(),sequence=[0,2,1],emit=kind=>{try{onEvent(kind)}catch{/* Audio cannot invalidate earned progression. */}}
 function state(world){if(!ACTIVITIES[world])throw Error('Unknown activity world');if(!progress.has(world))progress.set(world,{relay:0,survey:[],earned:[],error:null});return progress.get(world)}
 function completed(world,kind){return wallet?.hasReceipt(activityReceipt(world,kind))??false}
 function reward(world,kind){const s=state(world);if(!s.earned.includes(kind))s.earned.push(kind);if(completed(world,kind))return;try{if(!wallet)throw Error('Crystal wallet unavailable');wallet.grant(activityReceipt(world,kind));s.error=null}catch(e){s.error=e.message;wallet?.reportError(e.message)}}
 function observe({world,kind,index=0,position,visible=true,enabled=true,interact=false}){
  const def=ACTIVITIES[world],s=state(world),points=kind==='discovery'?[def.discovery]:def[kind],at=points?.[index]
  if(!at||!position||!enabled||!visible||!Number.isFinite(position.x)||!Number.isFinite(position.y)||!Number.isFinite(position.z)||Math.hypot(position.x-at[0],position.z-at[2])>1.65||Math.abs(position.y-at[1])>.65)return {accepted:false}
  if(completed(world,kind))return {accepted:false,duplicate:true}
  if(kind==='discovery'){if(!s.earned.includes(kind))emit('discovery');reward(world,kind)}
  else if(kind==='survey'){if(!s.survey.includes(index)){s.survey.push(index);emit('survey')};if(s.survey.length===points.length)reward(world,kind)}
  else if(kind==='relay'){if(!interact)return {accepted:false};if(s.earned.includes(kind))reward(world,kind);else if(index===sequence[s.relay]){s.relay++;emit('relay');if(s.relay===sequence.length)reward(world,kind)}else{s.relay=0;emit('error');return {accepted:true,message:'Wrong relay order. Start again: 1 → 3 → 2.'}}}
  return {accepted:true,message:s.error?'Reward pending: '+s.error:completed(world,kind)?'Trail complete. Crystal reward saved.':kind==='relay'?'Relay '+s.relay+'/3. Sequence 1 → 3 → 2.':'Survey '+s.survey.length+'/3.'}
 }
 return {observe,snapshot(world){const s=state(world);return structuredClone({...s,completed:Object.keys({discovery:1,relay:1,survey:1}).filter(k=>completed(world,k))})}}
}
