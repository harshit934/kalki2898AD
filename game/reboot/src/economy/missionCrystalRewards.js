import {MISSION_ACTIVITY_GRANTS} from '../content/missionActivities.js'
// Runtime snapshots, never presentation clicks, authorize these grants.
export function bindMissionCrystalRewards({runtime,wallet}){
 let closed=false,busy=false
 function reconcile(){if(closed||busy||!wallet.snapshot().ready)return;busy=true;try{const {session,progress}=runtime.snapshot();const ids=[]
  for(const n of [1,2,3,4])if(progress.completedMissionIds.includes('mission-'+n))ids.push('mission:mission-'+n+':complete')
  if(session?.missionId==='mission-1')for(const id of ['crystal-01','crystal-02','crystal-03'])if(session.completedObjectiveIds.includes(id))ids.push('objective:mission-1:'+id)
  for(const [mission,objectives]of Object.entries(progress.objectiveRecords??{}))for(const objective of objectives){const id='objective:'+mission+':'+objective;if(Object.hasOwn(MISSION_ACTIVITY_GRANTS,id))ids.push(id)}
  for(const id of ids)try{wallet.grant(id)}catch(error){wallet.reportError(error.message)}
 }finally{busy=false}}
 const stop=runtime.subscribe(reconcile);reconcile();return {retry:reconcile,release(){closed=true;stop()}}
}
