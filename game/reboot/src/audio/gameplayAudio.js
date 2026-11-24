// Observes authoritative combat and mission state. Never submits game evidence.
export function bindGameplayAudio(runtime,audio){
 let old=runtime.snapshot().session,lastCompleted=new Set(runtime.snapshot().progress.completedMissionIds??[])
 const sync=()=>{const snap=runtime.snapshot(),s=snap.session
  if(s&&(s.id!==old?.id||old?.state==='preparing')&&s.state==='active')audio.event('mission-start')
  if(s&&old?.id===s.id){
   if(s.playerResources.health<old.playerResources.health)audio.event('impact')
   for(const actor of s.actorStates??[]){const previous=old.actorStates?.find(a=>a.actorId===actor.actorId);if(previous&&actor.health<previous.health)audio.event(actor.health<=0?'defeat':'impact');if(!previous&&/warden|boss/.test(actor.actorId??''))audio.event('boss')}
   if(s.state==='failed'&&old.state!=='failed')audio.event('defeat')
  }
  const done=new Set(snap.progress.completedMissionIds??[]);for(const id of done)if(!lastCompleted.has(id))audio.event('mission-complete');lastCompleted=done
  audio.setIntensity?.((s?.actorStates??[]).some(a=>a.health>0&&a.state==='active-combat')?'combat':'exploration');old=s
 };return runtime.subscribe(sync)
}

