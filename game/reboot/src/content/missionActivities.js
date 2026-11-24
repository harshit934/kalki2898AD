import {deepFreeze} from '../campaign/contracts.js'

const station=(id,label,at,mechanic,clue,answer=null)=>({id,label,at,mechanic,clue,answer})
export const STORY_PATROLS=deepFreeze({
 'mission-2':[{classId:'scout',health:90,speed:2.2,detectionRange:16,attackRange:1.8,attackDamage:6,attackCooldown:1100},{classId:'warrior',health:105,speed:1.7,detectionRange:16,attackRange:2,attackDamage:8,attackCooldown:1500}],
 'mission-4':[{classId:'heavy',health:150,speed:1.1,detectionRange:16,attackRange:2.3,attackDamage:12,attackCooldown:1900},{classId:'elite',health:120,speed:1.9,detectionRange:16,attackRange:2.2,attackDamage:7,attackCooldown:1450}]
})
// Original mission activities in existing traversable districts. All dimensions
// are metres, Y-up. Optional evidence never substitutes for mandatory combat.
export const MISSION_ACTIVITIES=deepFreeze({
 'mission-1':{title:'The scout’s map',unlock:'accept-contract',reward:25,stations:[
  station('survey-road','Survey the salvage avenue',[158,-.1925,74],'survey','Remain beside the survey instrument for two seconds. Moving away interrupts the scan.'),
  station('survey-crossing','Survey the eastern crossing',[194,-.1925,60],'survey','Record the open approach to the stronghold. Keep the instrument in range.'),
  station('survey-entrance','Survey the stronghold approach',[228,-.1925,40],'survey','The opening lies east along this cross street. Scan the approach before recovering the cache.'),
  station('scout-cache','Recover the mapped supply cache',[230,-.1925,44],'collect','All three survey records are required to identify this cache.')
 ]},
 'mission-2':{title:'The copied seal',unlock:'evidence',reward:40,stations:[
  station('seal-original','Inspect the market shipping seal',[194,-.22,344],'inspect','Seal A / original dispatch / timestamp 09:00. Record this before comparing the relay copy.'),
  station('seal-copy','Inspect the copied relay seal',[228,-.22,354],'inspect','Seal A / claimed original dispatch / timestamp 12:00. The same original cannot carry two dispatch times.'),
  station('seal-deduction','Compare the two dispatch records',[194,-.22,350],'deduction','Compare the recorded seal and timestamps. Select the conclusion supported by both records.','copied')
 ]},
 'mission-3':{title:'Balance the terrace network',unlock:'evidence',reward:50,stations:[
  station('energy-trading','Allocate trading-court energy',[116,-.04,120],'allocate','The public diagram assigns TWO units to the trading court.',2),
  station('energy-bridge','Allocate bridge energy',[196,-.04,128],'allocate','The bridge stabilizer needs ONE unit.',1),
  station('energy-palace','Allocate palace energy',[210,-.04,148],'allocate','The palace lift needs THREE units. The whole network may use only six.',3),
  station('energy-close','Close the balanced energy circuit',[268,8,148],'collect','Trading 2 + bridge 1 + palace 3 = 6. Close the circuit only after every allocation is verified.')
 ]},
 'mission-4':{title:'Make the service line safe',unlock:'evidence',reward:60,stations:[
  station('isolate-main','Open the service isolator',[210,-.025,36],'isolate','First disconnect the supply. Do not ground or vent a live feed.','disconnect'),
  station('isolate-pressure','Bleed residual pressure',[178,-.025,80],'isolate','The supply is isolated. Vent the stored pressure before applying the earth clamp.','vent'),
  station('isolate-earth','Apply the earth clamp',[110,-.025,106],'isolate','Supply isolated; pressure zero. Now ground the service line.','earth'),
  station('isolate-certify','Certify the safe maintenance route',[178,-.025,136],'collect','Verify isolate → vent → earth before certifying the line safe.')
 ]}
})
export const activityObjectiveId=id=>'activity-'+id
export function activityObjectives(missionId){const plan=MISSION_ACTIVITIES[missionId];if(!plan)return [];return plan.stations.map((s,i)=>({id:activityObjectiveId(s.id),label:s.label,event:'interaction',source:'interaction',targetId:s.id,required:false,prerequisites:[plan.unlock,...(i?[activityObjectiveId(plan.stations[i-1].id)]:[])]}))}
export function withMissionActivities(content){const plan=MISSION_ACTIVITIES[content.missionId];if(!plan||content.activities)return content;const patrol=STORY_PATROLS[content.missionId];return {...content,activities:plan,objectiveRewards:[activityObjectiveId(plan.stations.at(-1).id)],objectives:[...content.objectives,...activityObjectives(content.missionId)],encounters:patrol?content.encounters.map(e=>e.id==='security'?{...e,waves:e.waves.map(w=>({...w,enemies:w.enemies.map((enemy,i)=>({...enemy,classId:patrol[i].classId}))}))}:e):content.encounters}}
export const MISSION_ACTIVITY_GRANTS=deepFreeze(Object.fromEntries(Object.entries(MISSION_ACTIVITIES).map(([id,p])=>['objective:'+id+':'+activityObjectiveId(p.stations.at(-1).id),{amount:p.reward,label:p.title+' completed'}])))
