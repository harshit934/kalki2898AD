import test from 'node:test'
import assert from 'node:assert/strict'
import {Group} from 'three'
import {STORY_BATTLES,withStoryBattle} from '../src/content/storyBattles.js'
import {STORY_MISSIONS} from '../src/content/storyMissions.js'
import {withMissionActivities} from '../src/content/missionActivities.js'
import {createStoryBattleBrain,storyBattlePhase} from '../src/gameplay/storyBattleBrain.js'
import {createCombatTactics} from '../src/gameplay/combatTactics.js'
import {validateRuntimeContent} from '../src/campaign/contracts.js'
import {validateCheckpoint} from '../src/missions/checkpoints.js'
import {catalogue} from '../src/campaign/catalogue.js'
import {createElement} from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
import BattleEncounter from '../src/ui/BattleEncounter.js'

test('boss HUD formats actual health, phase, telegraph and story feedback without replacing menu screens',()=>{
 const html=renderToStaticMarkup(createElement(BattleEncounter,{battle:{name:'Terrace Sentinel',active:true,defeated:false,health:180,maxHealth:420,phase:2,attack:'ring',hint:'Hazards suppressed',message:'The relays expose the malfunction.'}}))
 for(const value of ['Terrace Sentinel','Phase 2 / 3','180 / 420','Hazards suppressed','The relays expose the malfunction.','R special'])assert.ok(html.includes(value))
 assert.equal(renderToStaticMarkup(createElement(BattleEncounter,{battle:null})), '')
})

test('each story battle has its own patterns and preserves IDs, rewards, legacy graph and optional contracts',()=>{
 for(const base of STORY_MISSIONS){const old=withMissionActivities(base),c=withStoryBattle(old);validateRuntimeContent(c);assert.equal(c.missionId,old.missionId);assert.deepEqual(c.rewards,old.rewards);assert.deepEqual(c.activities,old.activities);assert.deepEqual(c.legacyBattleContent,old);assert.equal(c.encounters.filter(e=>e.category==='boss').length,1);assert.equal(withStoryBattle(c),c)}
 assert.equal(new Set(Object.values(STORY_BATTLES).map(p=>JSON.stringify(p.patterns))).size,3)
 assert.equal(STORY_BATTLES['mission-5'],undefined)
})

test('real battle brains advance phases, select distinct attacks, respect arena bounds, suppression and cancellation',()=>{
 const seen=[]
 for(const profile of Object.values(STORY_BATTLES)){
  let health=profile.health,p={x:profile.position[0],y:profile.position[1],z:profile.position[2]},target={x:p.x+3,y:p.y,z:p.z,alive:true},movement={x:0,y:0,z:0};const calls=[],abort=new AbortController(),shared={disabled:false},collider={handle:1},body={translation:()=>({...p}),collider:()=>collider,setNextKinematicTranslation:v=>{p=v}},controller={computeColliderMovement:(c,v)=>{movement=v},computedMovement:()=>movement}
  const brain=createStoryBattleBrain({source:{bossProfile:profile,arenaState:shared},body,object:new Group(),controller,player:()=>target,canSee:()=>true,attack:r=>calls.push(r),readHealth:()=>health,signal:abort.signal})
  const phases=new Set(),patterns=new Set()
  for(const ratio of [1,.6,.3]){health=profile.health*ratio;for(let n=0;n<1500;n++){brain.tick(1/60);const s=brain.snapshot();phases.add(s.phase);if(s.attack)patterns.add(s.attack.type);assert.ok(p.x>=profile.bounds.minX&&p.x<=profile.bounds.maxX&&p.z>=profile.bounds.minZ&&p.z<=profile.bounds.maxZ)}}
  assert.deepEqual([...phases],[1,2,3]);assert.ok(calls.length>0);assert.ok(patterns.size>=3);seen.push([...patterns].sort().join(','))
  const before=calls.length;shared.disabled=true;for(let n=0;n<1500;n++)brain.tick(1/60);assert.ok(calls.slice(before).every(c=>!['ring','thermal'].includes(c.kind)))
  target={...target,alive:false};brain.tick(1/60);assert.equal(brain.snapshot().intent,'idle');abort.abort();assert.throws(()=>brain.tick(1/60));assert.throws(()=>storyBattlePhase(-1,profile.health))
 }
 assert.ok(new Set(seen).size>1)
})

test('block creates one bounded counter; special has an eight-second cooldown and pause clears stale counters',()=>{
 const t=createCombatTactics();assert.equal(t.attack('heavy',0,48).damage,48);t.block(100);assert.equal(t.attack('heavy',400,48).damage,72);assert.equal(t.attack('heavy',401,48).damage,48);t.block(500);assert.equal(t.attack('heavy',1401,48).counter,false)
 assert.equal(t.attack('special',1500,48).damage,81.6);assert.equal(t.attack('special',9499,48).accepted,false);assert.equal(t.attack('special',9500,48).accepted,true);t.block(9600);t.reset();assert.equal(t.attack('heavy',9601,48).counter,false);assert.equal(t.attack('special',9601,48).accepted,false)
})

test('legacy checkpoint upgrade preserves earned evidence and resources and creates only a pending boss',()=>{
 for(const base of STORY_MISSIONS){const old=withMissionActivities(base),content=withStoryBattle(old),checkpoint={version:1,missionId:old.missionId,contentVersion:old.contentVersion,checkpointId:'entry',completedObjectiveIds:[],failedObjectiveIds:[],encounterState:old.encounters.map(e=>({encounterId:e.id,defeatedActorIds:[],failed:false})),defeatedEncounterIds:[],completedWaves:[],resources:{...old.resources},policy:{...old.checkpointPolicy},recovery:{createdAt:1,originSessionId:'old-attempt',mode:'explicit'},phase:'active',conclusion:null},copy=structuredClone(checkpoint),next=validateCheckpoint(checkpoint,content,catalogue)
  assert.deepEqual(checkpoint,copy);assert.deepEqual(next.resources,checkpoint.resources);assert.deepEqual(next.completedObjectiveIds,[]);assert.deepEqual(next.encounterState.at(-1),{encounterId:'story-boss',defeatedActorIds:[],failed:false});assert.deepEqual(next.defeatedEncounterIds,[])
  assert.throws(()=>validateCheckpoint({...checkpoint,completedObjectiveIds:['defeat-story-boss']},content,catalogue),'Forged boss evidence cannot be upgraded')
 }
})
