import {Group,Mesh,BoxGeometry,TorusGeometry,CylinderGeometry,MeshStandardMaterial} from 'three'
import {activityObjectiveId} from '../content/missionActivities.js'
import {resolveLocationSpawn} from '../world/locations/spawn.js'
import {LOCATION_DEFINITIONS} from '../world/locations/definitions.js'
import {requireCondition,deepFreeze} from '../campaign/contracts.js'

const choices={
 deduction:[{id:'copied',label:'The seal was copied: its dispatch times conflict.'},{id:'original',label:'Both records are the same original dispatch.'},{id:'weather',label:'Weather explains the two dispatch times.'}],
 isolate:[{id:'disconnect',label:'Disconnect supply'},{id:'vent',label:'Vent residual pressure'},{id:'earth',label:'Apply earth clamp'}]
}
export function createMissionActivities({host,content,context,getPlayer,canPlay=()=>true,save,onState=()=>{},audio}){
 const plan=content.activities,{sessionId,signal}=context,location=LOCATION_DEFINITIONS.find(l=>l.id===(content.worldId??'kashi'))
 requireCondition(plan?.stations?.length&&location,'MISSING_ACTIVITY_CONTENT','Registered mission activity and location required')
 const root=new Group(),geometry=new BoxGeometry(.65,1,.65),ringGeometry=new TorusGeometry(.46,.035,6,20),capGeometry=new CylinderGeometry(.28,.34,.12,12),bodies=[],materials=[],stations=[]
 root.name='mission-activity-'+sessionId
 let closed=false,paused=false,open=null,draft=0,scan=null,failures=0,busy=false,message='',elapsed=0,view=null,last=''
 const session=()=>context.readSession(),playable=()=>!closed&&!paused&&!signal.aborted&&session().state==='active'&&session().playerResources.health>0&&canPlay()
 function visible(at,p){const dx=at[0]-p.x,dz=at[2]-p.z,d=Math.hypot(dx,dz);if(d<.05)return true;const hit=host.world.castRay(new host.rapier.Ray({x:p.x,y:p.y+1.3,z:p.z},{x:dx/d,y:0,z:dz/d}),d,true,host.rapier.QueryFilterFlags.EXCLUDE_SENSORS|host.rapier.QueryFilterFlags.EXCLUDE_KINEMATIC|host.rapier.QueryFilterFlags.EXCLUDE_DYNAMIC);return !hit||hit.timeOfImpact>=d-.06}
 const near=s=>{const p=getPlayer().body.translation();return Math.hypot(p.x-s.at[0],p.z-s.at[2])<=2.2&&Math.abs(p.y-s.at[1])<.8&&visible(s.at,p)}
 const next=()=>stations.find(s=>session().objectiveStates[activityObjectiveId(s.id)]==='active')
 const stationFor=id=>stations.find(s=>s.id===id)
 function publish(){if(closed)return;const s=session(),p=getPlayer().body.translation(),current=next(),panel=stationFor(open),done=stations.filter(t=>s.completedObjectiveIds.includes(activityObjectiveId(t.id))).length
  const bearing=current?['north','north-east','east','south-east','south','south-west','west','north-west'][(Math.round(Math.atan2(current.at[0]-p.x,p.z-current.at[2])/(Math.PI/4))+8)%8]:null
  const state={title:plan.title,reward:plan.reward,completed:done,total:stations.length,finished:done===stations.length,unlocked:s.completedObjectiveIds.includes(plan.unlock),records:stations.filter(t=>s.completedObjectiveIds.includes(activityObjectiveId(t.id))).map(t=>({label:t.label,clue:t.clue})),next:current?{id:current.id,label:current.label,distance:Math.round(Math.hypot(p.x-current.at[0],p.z-current.at[2])),direction:bearing,at:current.at}:null,nearby:current&&near(current)?current.label:null,failures,failureLimit:3,message,busy,panel:panel?{id:panel.id,label:panel.label,mechanic:panel.mechanic,clue:panel.clue,draft,scan:scan?Math.min(1,scan.time/2):null,choices:choices[panel.mechanic]??[]}:null}
  const key=JSON.stringify(state);if(key!==last){last=key;view=deepFreeze(state);onState(view)}
 }
 function close(){open=null;scan=null;draft=0;publish()}
 async function reject(station){failures++;audio?.event('interact');message=`Rejected (${failures}/3). Read the station clue before confirming.`;if(failures>=3){scan=null;open=null;const objective=activityObjectiveId(station.id);await fail(objective)}publish();return {accepted:false,message}}
 async function fail(id){requireCondition(typeof context.failObjective==='function','ACTIVITY_FAILURE_UNAVAILABLE','Owned objective failure authority required');context.failObjective(id);await context.suspend('mission-activity-failed');message='Activity failed. Retry the saved checkpoint or restart the mission.'}
 async function accept(station){const id=activityObjectiveId(station.id);requireCondition(session().objectiveStates[id]==='active','OBJECTIVE_NOT_READY','Complete the previous activity first');context.observe({sessionId,eventId:globalThis.crypto.randomUUID(),objectiveId:id,type:'interaction',source:'interaction',targetId:station.id});open=null;scan=null;audio?.event(station.mechanic==='collect'?'survey':'interact');message=station.label+' verified. Saving milestone…';publish();try{await save();message=station.label+' saved.'}catch(e){message='Milestone recorded in this attempt; save failed: '+e.message+' Use Retry saving before leaving.'}publish();return {accepted:true}}
 async function act(action){requireCondition(playable(),'ACTIVITY_UNAVAILABLE','Resume a living on-foot mission to interact');if(action==='close'){close();return {accepted:true}}requireCondition(!busy,'INTERACTION_BUSY','Activity transaction in progress');const station=stationFor(open);requireCondition(station&&near(station),'ACTIVITY_OUT_OF_RANGE','Approach the open activity station');requireCondition(session().objectiveStates[activityObjectiveId(station.id)]==='active','OBJECTIVE_NOT_READY','Activity station is not active');busy=true
  try{
   if(station.mechanic==='survey'){requireCondition(action==='scan','INVALID_ACTIVITY_ACTION','Use the survey instrument');if(scan)return {accepted:false,message:'Scan already running'};scan={station:station.id,time:0};message='Scanning: remain within two metres.';return {accepted:true}}
   if(station.mechanic==='inspect'){requireCondition(action==='inspect','INVALID_ACTIVITY_ACTION','Inspect the evidence');return await accept(station)}
   if(station.mechanic==='collect'){requireCondition(action==='complete','INVALID_ACTIVITY_ACTION','Verify the recorded prerequisites');return await accept(station)}
   if(station.mechanic==='allocate'&&/^set:[0-3]$/.test(action)){draft=Number(action.at(-1));message='Allocation selected; confirm to test the circuit.';return {accepted:true}}
   if(station.mechanic==='allocate'){requireCondition(action==='confirm','INVALID_ACTIVITY_ACTION','Select an allocation then confirm');return draft===station.answer?await accept(station):await reject(station)}
   const selected=action.startsWith('choose:')?action.slice(7):null;requireCondition(choices[station.mechanic]?.some(c=>c.id===selected),'INVALID_ACTIVITY_ACTION','Choose a displayed station action');return selected===station.answer?await accept(station):await reject(station)
  }finally{busy=false;publish()}
 }
 function canInteract(){return playable()&&!busy&&Boolean(next()&&near(next()))}
 function interact(){requireCondition(canInteract(),'ACTIVITY_OUT_OF_RANGE','Approach an active activity station');const station=next();open=station.id;draft=0;message=station.clue;publish();return {accepted:true,activity:true}}
 async function tick(dt){if(closed)return;if(!playable()){if(open||scan)close();return}if(scan){const t=stationFor(scan.station);if(!t||!near(t)){scan=null;message='Scan interrupted: return to the instrument.'}else{scan.time+=dt;if(scan.time>=2&&!busy){busy=true;try{await accept(t)}finally{busy=false}}}}if(open&&!near(stationFor(open))){open=null;scan=null;message='Activity closed: return to the station.'}elapsed+=dt;if(elapsed>=.1){elapsed=0;for(const t of stations){const complete=session().completedObjectiveIds.includes(activityObjectiveId(t.id)),active=session().objectiveStates[activityObjectiveId(t.id)]==='active';t.material.color.set(complete?'#e8bc68':active?'#74daca':'#64736e');t.ring.rotation.y+=.06;t.ring.visible=!complete}publish()}}
 let stop
 function release(){if(closed)return;closed=true;stop?.();signal.removeEventListener('abort',release);root.removeFromParent();for(const b of bodies)host.world.removeRigidBody(b);geometry.dispose();ringGeometry.dispose();capGeometry.dispose();for(const m of materials)m.dispose()}
 try{
  for(const definition of plan.stations){const at=resolveLocationSpawn({host,location,position:definition.at}),group=new Group(),material=new MeshStandardMaterial({color:'#74daca',emissive:'#3b7067',emissiveIntensity:.35,roughness:.55,metalness:.35});materials.push(material);group.name='activity-station-'+definition.id;group.position.set(...at);const pedestal=new Mesh(geometry,material),ring=new Mesh(ringGeometry,material),cap=new Mesh(capGeometry,material);pedestal.position.y=.5;ring.position.y=1.2;cap.position.y=1;group.add(pedestal,ring,cap);root.add(group);const body=host.world.createRigidBody(host.rapier.RigidBodyDesc.fixed().setTranslation(...at));bodies.push(body);body.userData={missionActivity:definition.id};host.world.createCollider(host.rapier.ColliderDesc.cuboid(.325,.5,.325).setTranslation(0,.5,0),body);stations.push({...definition,at,material,ring})}
  host.scene.add(root);signal.addEventListener('abort',release,{once:true});stop=host.subscribeAfterPhysics(dt=>{void tick(dt).catch(e=>{message=e.message;publish()})});publish()
 }catch(e){release();throw e}
 return {snapshot:()=>view,canInteract,interact,act,pause(){paused=true;close()},resume(){paused=false;publish()},close,release}
}
