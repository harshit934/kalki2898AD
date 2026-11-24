// One serialized safe-checkpoint writer per mission owner. Failed objectives
// never overwrite the last good milestone; storage errors require explicit retry.
const signature=s=>JSON.stringify([s.completedObjectiveIds,s.defeatedEncounterIds,s.completedWaves])
export function createMissionCheckpoint({runtime,sessionId,anchor,onState=()=>{}}){
 let closed=false,working=null,queued=false,error=null,last=null,view=Object.freeze({status:'waiting',error:null})
 const session=()=>{const s=runtime.snapshot().session;return s?.id===sessionId&&['active','suspended'].includes(s.state)&&s.playerResources.health>0&&!s.failedObjectiveIds.length?s:null}
 const publish=status=>{view=Object.freeze({status,error,savedObjectives:runtime.snapshot().progress.missionCheckpoints?.[session()?.missionId]?.completedObjectiveIds.length??0});if(!closed)onState(view)}
 function existing(s){const c=runtime.snapshot().progress.missionCheckpoints?.[s.missionId];return c&&!c.failedObjectiveIds?.length&&c.resources.health>0?signature(c):null}
 async function flush(){queued=false;const s=session();if(closed||!s||error)return;if(existing(s)===signature(s)){last=signature(s);publish('saved');return}if(working)return working
  working=(async()=>{publish('saving');try{await runtime.saveCheckpoint(anchor,sessionId);last=existing(s);error=null;publish('saved')}catch(e){if(!closed){error=e.message;publish('error')}}finally{working=null;if(!closed&&!error&&session()&&signature(session())!==last)request()}})();return working
 }
 function request(){const s=session();if(closed||!s||error||working||queued)return;if(signature(s)===last)return;queued=true;queueMicrotask(()=>{void flush()})}
 const stop=runtime.subscribe(request);request()
 return {snapshot:()=>view,async retry(){if(closed)return;error=null;last=null;return flush()},async settle(){if(queued)await flush();if(working)await working;return view},release(){if(closed)return;closed=true;stop()}}
}
