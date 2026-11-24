import {withStoryBattle} from '../content/storyBattles.js'
import {createBattleArena} from './battleArena.js'
import {Group,Mesh,BoxGeometry,MeshStandardMaterial,TorusGeometry,OctahedronGeometry} from 'three'
import {STORY_MISSIONS,storyMission} from '../content/storyMissions.js'
import {withMissionActivities,STORY_PATROLS} from '../content/missionActivities.js'
import {createMission1Combat} from './mission1Combat.js'
import {resolveLocationSpawn} from '../world/locations/spawn.js'
import {LOCATION_DEFINITIONS} from '../world/locations/definitions.js'
import {createExplorationBujji} from '../world/explorationBujji.js'
import {requireCondition} from '../campaign/contracts.js'

export function registerStoryMissions(integration,{loadCombatAsset,loadCompanionAsset}={}){
 for(const original of STORY_MISSIONS){
  const content=withStoryBattle(withMissionActivities(original)),arenaState={disabled:false}
  const center=content.story.arena,arena={minX:center[0]-6,maxX:center[0]+6,minZ:center[2]-5,maxZ:center[2]+9}
  const combat=createMission1Combat({content,roster:[],autoSchedule:false,movementBounds:arena,loadAsset:loadCombatAsset})
  const enemies=async args=>{if(args.encounterId==='story-boss')return combat.createActor({...args,source:{id:args.descriptor.id,type:'warden',position:content.battle.position,bossProfile:content.battle,arenaState}});const first=args.descriptor.id.endsWith('-a'),index=first?'security-a':'security-b',profile=STORY_PATROLS[content.missionId][first?0:1];return combat.createActor({...args,source:{id:args.descriptor.id,type:profile.classId,position:content.anchors[index],patrol:[[content.anchors[index][0],content.anchors[index][2]],[content.anchors[index][0],content.anchors[index][2]+1.5]],phase:0,stats:{...profile}}})}
  enemies.assertAvailable=()=>true
  enemies.prepare=content.encounters.length?args=>combat.prepareCombat(args):async()=>({ready:true,release(){}})
  integration.register(content,{playerSpawn:content.anchors.entry,enemyFactory:enemies,prepareEnvironment:async({host,worldContent})=>{
   requireCondition(worldContent?.locationId===content.worldId,'MISSION_WORLD_MISMATCH','Travel to the correct story world before starting')
   const location=LOCATION_DEFINITIONS.find(l=>l.id===content.worldId),resolve=position=>resolveLocationSpawn({host,location,position})
   resolve(content.anchors.entry)
   for(const terminal of content.story.terminals)resolve(terminal.at)
   if(content.encounters.length)for(const id of ['security-a','security-b'])resolve(content.anchors[id])
   return {ready:true,resolvePlayerSpawn:resolve,release(){}}
  },prepareInteractions:args=>prepareStoryInteractions({...args,content,integration,loadCompanionAsset,arenaState})})
 }
 return STORY_MISSIONS
}

export async function prepareStoryInteractions({host,worldContent,context,playCinematic,getPlayer,onVictory,onState=()=>{},onError=()=>{},content,integration,loadCompanionAsset,arenaState}){
 worldContent.story?.choose('close')
 const location=LOCATION_DEFINITIONS.find(l=>l.id===content.worldId),groundedTerminals=content.story.terminals.map(t=>({...t,at:resolveLocationSpawn({host,location,position:t.at})})),optionalPosition=resolveLocationSpawn({host,location,position:content.story.optional}),bodies=[]
 const {signal,sessionId}=context,root=new Group(),geometry=new BoxGeometry(.65,1.1,.65),ringGeometry=new TorusGeometry(.48,.045,6,24),crystalGeometry=new OctahedronGeometry(.3),materials=[],terminals=[]
 const battle=content.battle?createBattleArena({host,context,content,getPlayer,onState,shared:arenaState}):null
 root.name='story-objectives-'+sessionId
 let closed=false,active=true,busy=false,failures=0,stop,unsubscribe,companion,elapsed=0,message=content.story.clue,finishing=false,lastState=''
 const live=()=>!closed&&!signal.aborted
 const state=()=>context.readSession()
 const mat=color=>{const m=new MeshStandardMaterial({color,emissive:color,emissiveIntensity:.3,roughness:.5});materials.push(m);return m}
 const glow=mat('#7be1d1'),stone=mat('#7d8e87'),optionalMat=mat('#d5b474')
 for(const [index,terminal]of groundedTerminals.entries()){
  const group=new Group(),pedestal=new Mesh(geometry,stone),ring=new Mesh(ringGeometry,glow);pedestal.position.y=.55;ring.position.y=1.25;group.position.set(...terminal.at);group.add(pedestal,ring)
  // Numbered light bands are the in-world puzzle labels; they are not evidence.
  for(let n=0;n<=index;n++){const band=new Mesh(geometry,glow);band.scale.set(1.1,.04,1.1);band.position.y=.25+n*.17;group.add(band)}
  group.name='story-terminal-'+index;root.add(group);terminals.push(group);const body=host.world.createRigidBody(host.rapier.RigidBodyDesc.fixed().setTranslation(...terminal.at));bodies.push(body);body.userData={storyTerminal:true};host.world.createCollider(host.rapier.ColliderDesc.cuboid(.325,.55,.325).setTranslation(0,.55,0),body)
 }
 const notes=new Mesh(crystalGeometry,optionalMat);notes.position.set(optionalPosition[0],optionalPosition[1]+1,optionalPosition[2]);notes.name='story-field-notes';root.add(notes);host.scene.add(root)
 function visible(at,p){const dx=at[0]-p.x,dz=at[2]-p.z,length=Math.hypot(dx,dz);if(length<.05)return true;const hit=host.world.castRay(new host.rapier.Ray({x:p.x,y:p.y+1.1,z:p.z},{x:dx/length,y:0,z:dz/length}),length,true,host.rapier.QueryFilterFlags.EXCLUDE_SENSORS|host.rapier.QueryFilterFlags.EXCLUDE_KINEMATIC|host.rapier.QueryFilterFlags.EXCLUDE_DYNAMIC,undefined,undefined,undefined,c=>{const body=c.parent(),q=body?.translation();return !(body?.userData?.storyTerminal&&q&&Math.hypot(q.x-at[0],q.z-at[2])<.1)});return !hit||hit.timeOfImpact>=length-.08}
 const near=(at,p,r=2)=>Math.hypot(at[0]-p.x,at[2]-p.z)<=r&&Math.abs(at[1]-p.y)<1&&visible(at,p)
 function nextObjective(s){return content.objectives.find(o=>o.required!==false&&s.objectiveStates[o.id]==='active')}
 function targetFor(o){if(!o)return null;if(o.event==='story-event'){const actor=worldContent.story?.snapshot().characters.find(a=>a.role===o.targetId);return actor?[actor.position.x,actor.position.y,actor.position.z]:null}if(o.id==='defeat-story-boss')return content.battle.position;if(o.id==='clear-security')return content.story.arena;if(o.id==='field-notes')return content.story.optional;const index=Number(o.targetId.split('-').at(-1));return groundedTerminals[index]?.at??null}
 function publish(){if(!live())return;const s=state(),p=getPlayer().body.translation(),objective=nextObjective(s),at=targetFor(objective),world=worldContent.updateFocus?.({position:p,body:getPlayer().body})??{}
  const nearby=groundedTerminals.findIndex(t=>near(t.at,p)),notesNear=near(content.story.optional,p),prompt=nearby>=0?'Synchronize '+groundedTerminals[nearby].label:notesNear&&!s.completedObjectiveIds.includes('field-notes')?'Inspect field notes':world.prompt
  const dx=at?at[0]-p.x:0,dz=at?at[2]-p.z:0,directions=['north','north-east','east','south-east','south','south-west','west','north-west'],direction=directions[(Math.round(Math.atan2(dx,-dz)/(Math.PI/4))+8)%8]
  const patch={missionGuidance:{title:objective?.label??'Report complete',detail:message,distance:at?Math.round(Math.hypot(dx,dz)):null,direction},interaction:prompt?{id:'story-interaction',label:prompt}:null,combatLocation:world.insideLabel,combatAction:getPlayer().combatStatus?.().state??'ready'}
  const key=JSON.stringify(patch);if(key!==lastState){lastState=key;onState(patch)}
 }
 async function scene(kind,characterId){if(!playCinematic||state().state!=='active')return;const briefing=content.story.briefings[characterId];return playCinematic({kind:kind==='dialogue'&&characterId!==content.story.introCharacter?'revelation':kind,characterId,title:kind==='intro'?'Contract briefing':kind==='ending'?'Contract verified':briefing.name,text:kind==='intro'?content.description:briefing.text,duration:kind==='dialogue'?5:6,onCue:()=>integration.audio?.event(kind==='ending'?'survey':kind==='intro'?'cinematic':'interact')})}
 async function save(){await integration.runtime.saveCheckpoint('entry',sessionId)}
 async function accept(objective){context.observe({sessionId,eventId:globalThis.crypto.randomUUID(),objectiveId:objective.id,type:objective.event,source:objective.source,targetId:objective.targetId});await save();publish()}
 async function finishIfReady(){const s=state();if(!finishing&&!busy&&s.state==='active'&&content.objectives.filter(o=>o.required!==false).every(o=>s.completedObjectiveIds.includes(o.id))){finishing=true;try{await save();await scene('ending',content.story.finalCharacter);if(live()&&state().state==='active')await onVictory(sessionId);else finishing=false}catch(error){finishing=false;message='Completion not saved: '+error.message;publish()}}}
 async function storyEvent(event){if(!live()||!active||busy||event.missionId!==content.missionId||event.kind!=='briefing'||state().state!=='active')return;const objective=content.objectives.find(o=>o.event==='story-event'&&o.targetId===event.characterId&&state().objectiveStates[o.id]==='active');if(!objective)return;if(objective.id==='report'&&content.battle&&!state().completedObjectiveIds.includes('defeat-story-boss')){message='Defeat '+content.battle.name+' before reporting.';publish();return}busy=true;try{await accept(objective);message=objective.id==='evidence'?content.story.clue:'Briefing recorded. Follow the next mission objective.'}catch(error){message='Progress not saved: '+error.message;onError(error)}finally{busy=false;publish()}if(objective.id!=='report')await scene('dialogue',event.characterId);await finishIfReady()}
 async function interact(){requireCondition(live()&&active&&state().state==='active','INTERACTION_UNAVAILABLE','Active story mission required');if(busy)return {accepted:false,code:'INTERACTION_BUSY'};const arenaAction=battle?.interact();if(arenaAction)return arenaAction;const s=state(),p=getPlayer().body.translation(),index=groundedTerminals.findIndex(t=>near(t.at,p));if(index<0){if(near(content.story.optional,p)&&s.objectiveStates['field-notes']==='active'){busy=true;try{await accept(content.objectives.find(o=>o.id==='field-notes'));message='Field notes: '+content.story.clue;notes.visible=false;return {accepted:true,message}}finally{busy=false}}const response=worldContent.interact?.({position:p,body:getPlayer().body});publish();return response??{accepted:false,message:'Approach a marked console or character.'}}
  const objective=nextObjective(s);if(!objective?.id.startsWith('align-'))return {accepted:false,message:'Complete the current briefing or encounter first.'}
  busy=true;try{const expected=content.story.order[Number(objective.id.split('-')[1])];if(index!==expected){failures++;message=`Calibration rejected (${failures}/${content.story.failureLimit}). `+content.story.clue;if(failures>=content.story.failureLimit){integration.runtime.failObjective(objective.id,sessionId);await save();await integration.runtime.suspend('story-objective-failed',sessionId)}return {accepted:false,message}}
   await accept(objective);message='Relay verified. '+content.story.clue;return {accepted:true,message}
  }catch(error){message='Progress not saved: '+error.message;throw error}finally{busy=false;publish()}
 }
 async function tick(delta){if(!live()||!active||state().state!=='active')return;elapsed+=delta;if(elapsed<.15)return;elapsed=0;const s=state();for(const [i,terminal]of terminals.entries()){const completed=content.story.order.some((n,stage)=>n===i&&s.completedObjectiveIds.includes('align-'+stage));terminal.children[1].rotation.y+=.1;terminal.children[1].visible=!completed}notes.visible=!s.completedObjectiveIds.includes('field-notes');if(content.encounters.some(e=>e.id==='security')&&s.completedObjectiveIds.includes('align-2')&&s.encounterStates.find(e=>e.id==='security')?.state==='pending'&&!busy){busy=true;try{await context.deployEncounter('security')}catch(error){message=error.message;onError(error)}finally{busy=false}}if(content.battle&&s.objectiveStates['defeat-story-boss']==='active'&&s.encounterStates.find(e=>e.id==='story-boss')?.state==='pending'&&!busy){busy=true;try{await context.deployEncounter('story-boss');message=content.battle.intro}catch(error){message=error.message;onError(error)}finally{busy=false}}publish();await finishIfReady()}
 function release(){if(closed)return;closed=true;signal.removeEventListener('abort',release);stop?.();unsubscribe?.();battle?.release();companion?.release();root.removeFromParent();for(const body of bodies)host.world.removeRigidBody(body);geometry.dispose();ringGeometry.dispose();crystalGeometry.dispose();materials.forEach(m=>m.dispose())}
 signal.addEventListener('abort',release,{once:true})
 try{companion=await createExplorationBujji({host,signal,player:getPlayer(),loadAsset:loadCompanionAsset});if(!live()){release();return {ready:false,release}}unsubscribe=integration.subscribeStory(e=>{void storyEvent(e).catch(onError)});stop=host.subscribeAfterPhysics(delta=>{void tick(delta).catch(onError)});return {ready:true,interact,pause(){active=false},resume(){active=true;publish()},async afterStart({restored}={}){await save();if(!restored)await scene('intro',content.story.introCharacter)},release}}catch(error){release();throw error}
}

export {storyMission}
