// Runtime snapshots, never presentation clicks, authorize these grants.
export function bindMissionCrystalRewards({runtime,wallet}){
 let closed=false,busy=false
 function reconcile(){if(closed||busy||!wallet.snapshot().ready)return;busy=true;try{const {session,progress}=runtime.snapshot();const ids=[]
  if(progress.completedMissionIds.includes('mission-1'))ids.push('mission:mission-1:complete')
  if(session?.missionId==='mission-1')for(const id of ['crystal-01','crystal-02','crystal-03'])if(session.completedObjectiveIds.includes(id))ids.push('objective:mission-1:'+id)
  for(const id of ids)try{wallet.grant(id)}catch(error){wallet.reportError(error.message)}
 }finally{busy=false}}
 const stop=runtime.subscribe(reconcile);reconcile();return {retry:reconcile,release(){closed=true;stop()}}
}
