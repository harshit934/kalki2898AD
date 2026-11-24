import assert from 'node:assert/strict'
import {createContentRegistry,createMissionRuntime} from '../src/missions/runtime.js'
import {createRepository,SAVE_KEY} from '../src/persistence/repository.js'
import {catalogue} from '../src/campaign/catalogue.js'
import {withCampaignRewards,CAMPAIGN_REWARDS} from '../src/content/campaignRewards.js'
import {createCrystalWallet} from '../src/economy/crystalWallet.js'
import {CRYSTAL_KEY} from '../src/economy/crystalPolicy.js'
import {bindMissionCrystalRewards} from '../src/economy/missionCrystalRewards.js'
import {bikeUnlocked,createCampaignRewardFeed} from '../src/economy/campaignRewardFeed.js'
const content=withCampaignRewards({missionId:'mission-2',zoneId:'reward-service-fixture',entryPointId:'entry',contentVersion:'reward-fixture-v1',checkpointAnchors:['entry'],checkpointPolicy:{restart:'fresh-attempt',resume:'semantic'},anchors:{entry:[0,0,0]},resources:{health:100,maxHealth:100},objectives:[{id:'defeat-story-boss',event:'boss-defeated',source:'combat',targetId:'story-boss'}],encounters:[{id:'story-boss',category:'boss',anchors:['entry'],policy:{mode:'waves',maxActive:1},waves:[{id:'principal',enemies:[{id:'boss',classId:'warden',anchorId:'entry'}]}]}],rewards:[{id:'story-contract',kind:'score',amount:1000}],episodeEquipment:{weaponIds:[],abilityIds:[]}})
function fixture(){const data=new Map([['personal-save-sentinel','unchanged']]),storage={blocked:null,getItem:k=>data.get(k)??null,setItem(k,v){if(k===this.blocked)throw Error('isolated failed write');data.set(k,v)}},registry=createContentRegistry(catalogue)
 registry.register('mission-2',content,{
  prepare:async()=>({ready:true}),release:async()=>{},pause:async()=>({paused:true}),resume:async()=>({resumed:true}),restore:async()=>({restored:true}),
  encounters:{deploy:async plan=>{
   for(const actor of plan.actors)plan.createActor({actorId:actor.id,maxHealth:100,release:async()=>{}}).register()
   return {actorIds:plan.actors.map(a=>a.id),release:async()=>{}}
  }}
 })
 const runtime=createMissionRuntime({catalogue,registry,repository:createRepository(storage,catalogue)}),wallet=createCrystalWallet({storage}),feed=createCampaignRewardFeed(wallet),binding=bindMissionCrystalRewards({runtime,wallet});return {data,storage,runtime,wallet,feed,binding,async close(){binding.release();feed.release();await runtime.end()}}}
async function defeat(f){await f.runtime.deployEncounter('story-boss');const actor=f.runtime.snapshot().session.actorStates[0];await f.runtime.damageEnemy({...actor,eventId:crypto.randomUUID(),source:'combat',amount:100});assert.ok(f.runtime.snapshot().session.completedObjectiveIds.includes('defeat-story-boss'))}
function conclude(f){f.runtime.beginConclusion();const s=f.runtime.snapshot().session;f.runtime.acceptConclusion({sessionId:s.id,conclusionId:s.conclusion.id});f.runtime.complete()}


export {fixture,defeat,conclude}
