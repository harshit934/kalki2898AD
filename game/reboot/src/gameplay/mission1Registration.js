import {MISSION1_STRONGHOLD,strongholdContent} from '../content/mission1Stronghold.js'
import {CITY_CAPSULES} from './mission1Navigation.js'
import {MISSION1_CONTENT,MISSION1_ROSTER,MISSION1_CITY_CONTENT,MISSION1_CITY_ROSTER,MISSION1_CITY_REQUIRED_ASSETS,validateMission1Assets} from '../content/mission1.js'
import {createMission1CityEnvironment} from './mission1Environment.js'
import {createMission1Interactions} from './mission1Interactions.js'
import {createMission1Combat} from './mission1Combat.js'
import {requireCondition} from '../campaign/contracts.js'

/** This ownership bridge only accepts a real, initialized legacy extraction.
 * It never substitutes new AI or a soldier mesh for the Warden controller. */
export function createMission1EnemyHost({createActor,prepareCombat,probe,roster=MISSION1_ROSTER,content=MISSION1_CONTENT}={}){
 const sessions=new Map()
 const available=()=>requireCondition(typeof createActor==='function'&&typeof prepareCombat==='function','MISSION1_COMBAT_UNAVAILABLE','Legacy CombatEnemies/Boss controllers still require session-safe AI, damage, Warden and reward extraction')
 const factory=async options=>{available();const {descriptor,encounterId,sessionId,signal}=options,regular=roster.find(e=>e.id===descriptor.id),warden=descriptor.id==='arena-warden'&&descriptor.classId==='warden'&&encounterId==='warden',owner=sessions.get(sessionId);requireCondition(owner&&!owner.closed&&!signal.aborted,'SESSION_CANCELLED','Mission 1 combat owner not prepared');requireCondition((regular&&regular.encounterId===encounterId&&regular.type===descriptor.classId)||warden,'ACTOR_OWNERSHIP_MISMATCH','Unknown Mission 1 actor/encounter');requireCondition(!owner.actors.has(descriptor.id),'DUPLICATE_ACTOR','Enemy already requested');requireCondition(!regular||[...owner.actors.values()].filter(a=>a.regular).length<3,'ENEMY_BUDGET_EXCEEDED','Maximum three active regular actors');const reservation={regular:Boolean(regular)};owner.actors.set(descriptor.id,reservation);try{const actor=await createActor({...options,sessionId,source:regular??{id:'arena-warden',type:'warden',health:720,position:content.anchors['warden-arena']}});requireCondition(typeof actor?.release==='function','ENEMY_UNAVAILABLE','Actor cleanup required');let done=false;const release=async()=>{if(done)return;done=true;try{await actor.release()}finally{owner.actors.delete(descriptor.id)}};reservation.release=release;if(owner.closed||signal.aborted){await release();requireCondition(false,'SESSION_CANCELLED','Late actor released')}return {...actor,release}}catch(error){owner.actors.delete(descriptor.id);throw error}}
 factory.assertAvailable=available
 factory.prepare=async options=>{available();requireCondition(!sessions.has(options.sessionId),'DUPLICATE_SESSION','Combat session already prepared');await validateMission1Assets(probe,options.signal,undefined,content.zoneId==='kashi-phase3c-city'?MISSION1_CITY_REQUIRED_ASSETS:undefined);const resources=await prepareCombat({...options,roster,maxActiveRegular:3,wardenId:'arena-warden'});requireCondition(typeof resources?.release==='function','ENEMY_UNAVAILABLE','Combat preparation cleanup required');if(options.signal.aborted){await resources.release();requireCondition(false,'SESSION_CANCELLED','Combat preparation cancelled')}const owner={closed:false,actors:new Map()};sessions.set(options.sessionId,owner);return {ready:resources.ready===true,async release(){if(owner.closed)return;owner.closed=true;try{for(const actor of owner.actors.values())await actor.release?.()}finally{sessions.delete(options.sessionId);await resources.release()}}}}
 return factory
}
export function registerMission1(integration,options={}){
 const useStronghold=options.combat?.stronghold===true,content=useStronghold?strongholdContent(MISSION1_CITY_CONTENT):MISSION1_CITY_CONTENT,prepareCity=createMission1CityEnvironment()
 integration.register(content,{playerSpawn:content.anchors['salvage-road-entry'],prepareEnvironment:async args=>{
  const environment=await prepareCity(args)
  try{if(useStronghold)for(const member of MISSION1_STRONGHOLD.waves.flatMap(w=>w.members)){
   const profile=member.classId==='heavy'?CITY_CAPSULES.heavy:CITY_CAPSULES.regular,nav=environment.navigation
   nav.ground(member.position,profile)
   for(const [x,z]of member.patrol)nav.ground([x,member.position[1],z],profile)
   requireCondition(nav.segmentClear([member.patrol[0][0],member.position[1],member.patrol[0][1]],[member.patrol[1][0],member.position[1],member.patrol[1][1]],profile),'INVALID_STRONGHOLD','Stronghold patrol is blocked')
   requireCondition(nav.path({sessionId:args.sessionId,from:{x:member.position[0],y:member.position[1],z:member.position[2]},to:{x:member.patrol[0][0],y:member.position[1],z:member.patrol[0][1]},profile}).status==='ready','INVALID_STRONGHOLD','No route from muster to guard post')
  }return environment}catch(error){environment.release();throw error}
 },prepareInteractions:createMission1Interactions({...options.interactions,content}),enemyFactory:options.enemyFactory??createMission1EnemyHost({...createMission1Combat({...options.combat,content,roster:MISSION1_CITY_ROSTER,city:true}),probe:options.environment?.probe,content,roster:MISSION1_CITY_ROSTER})})
 return content
}
