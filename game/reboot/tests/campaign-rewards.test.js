import test from 'node:test'
import assert from 'node:assert/strict'
import {createElement} from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
import {createContentRegistry,createMissionRuntime} from '../src/missions/runtime.js'
import {createRepository,SAVE_KEY} from '../src/persistence/repository.js'
import {catalogue} from '../src/campaign/catalogue.js'
import {withCampaignRewards,CAMPAIGN_REWARDS} from '../src/content/campaignRewards.js'
import {createCrystalWallet} from '../src/economy/crystalWallet.js'
import {CRYSTAL_KEY} from '../src/economy/crystalPolicy.js'
import {bindMissionCrystalRewards} from '../src/economy/missionCrystalRewards.js'
import {bikeUnlocked,createCampaignRewardFeed} from '../src/economy/campaignRewardFeed.js'
import {CampaignRewardsView} from '../src/ui/CampaignRewards.js'

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

test('genuine boss -> persisted bonus -> mission reward -> bike entitlement survives replay and reload',async()=>{
 const f=fixture();try{await f.runtime.start('mission-2');assert.equal(f.wallet.snapshot().balance,0);assert.equal(bikeUnlocked(f.wallet),false);assert.throws(()=>f.runtime.beginConclusion());await defeat(f);assert.equal(f.wallet.snapshot().balance,0,'Unsaved actor outcomes do not pay');await f.runtime.saveCheckpoint('entry');assert.equal(f.wallet.snapshot().balance,60);assert.equal(bikeUnlocked(f.wallet),false);conclude(f);assert.equal(f.wallet.snapshot().balance,260);assert.equal(bikeUnlocked(f.wallet),true);assert.deepEqual(f.feed.snapshot().queue.map(n=>[n.amount,n.bike]),[[60,false],[200,true]])
  const before=f.data.get(CRYSTAL_KEY);await f.runtime.end();await f.runtime.start('mission-2');await defeat(f);conclude(f);f.binding.retry();assert.equal(f.data.get(CRYSTAL_KEY),before);assert.equal(f.feed.snapshot().queue.length,2);const reload=createCrystalWallet({storage:f.storage});assert.equal(reload.snapshot().balance,260);assert.equal(bikeUnlocked(reload),true);assert.equal(createCampaignRewardFeed(reload).snapshot().queue.length,0,'Restart cannot replay unlock announcement');assert.equal(f.data.get('personal-save-sentinel'),'unchanged')
 }finally{await f.close()}
})
test('failed campaign and wallet writes cannot manufacture rewards or unlocks; explicit retry recovers once',async()=>{
 const f=fixture();try{await f.runtime.start('mission-2');await defeat(f);f.storage.blocked=SAVE_KEY;await assert.rejects(f.runtime.saveCheckpoint('entry'));assert.equal(f.wallet.snapshot().balance,0);f.storage.blocked=CRYSTAL_KEY;await f.runtime.saveCheckpoint('entry');assert.equal(f.wallet.snapshot().balance,0);assert.ok(f.wallet.snapshot().error);f.storage.blocked=null;f.binding.retry();assert.equal(f.wallet.snapshot().balance,60);f.binding.retry();assert.equal(f.wallet.snapshot().balance,60);f.runtime.beginConclusion();const s=f.runtime.snapshot().session;f.runtime.acceptConclusion({sessionId:s.id,conclusionId:s.conclusion.id});f.storage.blocked=SAVE_KEY;assert.throws(()=>f.runtime.complete());assert.equal(bikeUnlocked(f.wallet),false);f.storage.blocked=null;f.runtime.complete();assert.equal(f.wallet.snapshot().balance,260);assert.equal(bikeUnlocked(f.wallet),true)
 }finally{f.storage.blocked=null;await f.close()}
})
test('reward UI presents configured amounts, saved unlock feedback and previously earned replay status',()=>{
 const html=renderToStaticMarkup(createElement(CampaignRewardsView,{notice:{sequence:1,amount:200,label:'Mission 2 crystal reward',bike:true},wallet:{hasReceipt:()=>true},completedMissionId:'mission-2',bike:true}));for(const text of ['+200 crystals','Surya motorcycle unlocked','Already earned','Boss: 60'])assert.ok(html.includes(text));assert.deepEqual(Object.values(CAMPAIGN_REWARDS).map(r=>r.completion),[200,200,200,200])
})
