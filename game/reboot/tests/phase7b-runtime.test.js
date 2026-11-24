import test from 'node:test'
import assert from 'node:assert/strict'
import R from '@dimforge/rapier3d-compat'
import {Group,Scene,PerspectiveCamera,Mesh,BoxGeometry,MeshStandardMaterial,AnimationClip} from 'three'
import {createTravelFoundation} from '../src/gameplay/travelFoundation.js'
import {createFrameHost} from '../src/gameplay/frameHost.js'
import {createRepository} from '../src/persistence/repository.js'
import {createJourneyMemory} from '../src/world/locations/journeyMemory.js'
import {createCrystalWallet} from '../src/economy/crystalWallet.js'
import {catalogue} from '../src/campaign/catalogue.js'
import {registerMission1} from '../src/gameplay/mission1Registration.js'
import {AudioContextRecorder} from './world-audio-fixture.js'
await R.init()
test('failed mission checkpoint write leaves the menu-suspended mission intact instead of opening another world',async()=>{
 const f=await fixture()
 try{
  await f.app.startMission('mission-1');await f.settle();await f.app.runtime.suspend('menu')
  const original=f.data.set;f.data.set=function(){throw new Error('storage unavailable')}
  try{await assert.rejects(f.app.exploreLocation('complex'),{code:'SAVE_FAILED'})}finally{f.data.set=original}
  assert.equal(f.app.runtime.snapshot().session.state,'suspended');assert.equal(f.app.locationSnapshot().locationId,'kashi')
  await f.app.exploreLocation('complex');await f.settle();assert.equal(f.app.locationSnapshot().locationId,'complex')
 }finally{await f.app.release()}
})
test('explicit Explore after a menu-suspended mission opens Shambala while preserving its checkpoint',async()=>{
 const f=await fixture()
 try{
  await f.app.startMission('mission-1');await f.settle()
  await assert.rejects(f.app.exploreLocation('complex'),{code:'SESSION_ACTIVE'})
  await f.app.runtime.suspend('menu')
  await f.app.runtime.saveCheckpoint('salvage-road-entry')
  const checkpoint=structuredClone(f.app.runtime.snapshot().progress.missionCheckpoints['mission-1'])
  assert.ok(checkpoint)
  await f.app.exploreLocation('shambala');await f.settle()
  assert.equal(f.app.runtime.snapshot().session,null)
  assert.equal(f.app.locationSnapshot().locationId,'shambala')
  const saved=f.app.runtime.snapshot().progress.missionCheckpoints['mission-1']
  assert.deepEqual(saved.completedObjectiveIds,checkpoint.completedObjectiveIds)
  assert.deepEqual(saved.resources,checkpoint.resources)
  assert.equal(saved.checkpointId,checkpoint.checkpointId)
  assert.ok(f.app.explorationPose())
  await f.app.travel('kashi');await f.app.closeWorldView();await f.app.runtime.recover('mission-1');await f.settle()
  assert.equal(f.app.runtime.snapshot().session.state,'active')
 }finally{await f.app.release()}
})
async function fixture(){const data=new Map([['kalki-reboot:campaign:v1','personal-sentinel']]),reads=[],storage={getItem:k=>{reads.push(k);return data.get(k)??null},setItem:(k,v)=>data.set(k,v)},wallet=createCrystalWallet({storage}),context=new AudioContextRecorder(),target=new EventTarget(),asset=async()=>{const material=new MeshStandardMaterial();material.name='Green patina';return {scene:new Group().add(new Mesh(new BoxGeometry(.8,8,.8).translate(-9,4,-6),material)),animations:['Idle','Walk','Run','Sword idle (guard)'].map(n=>new AnimationClip(n,1,[]))}};let host,queue=new Map(),id=0,time=0;const events=[],app=createTravelFoundation({catalogue,campaignEnabled:true,repository:createRepository(storage,catalogue),currency:wallet,positionMemory:createJourneyMemory({storage}),audioContextFactory:()=>context,audioTarget:target,canvas:()=>null,onState:s=>events.push(s),loadPlayerAsset:asset,loadComplexAsset:asset,loadShambalaAsset:asset,createHost:async({signal,onError})=>{const native={world:new R.World({x:0,y:-19,z:0}),rapier:R,scene:new Scene(),camera:new PerspectiveCamera(),renderer:{isWebGLRenderer:true,shadowMap:{enabled:false},domElement:{dataset:{},ownerDocument:{defaultView:target}},getContext:()=>({isContextLost:()=>false}),render(){}}},frames=createFrameHost({...native,signal,onError,requestFrame:fn=>{queue.set(++id,fn);return id},cancelFrame:i=>queue.delete(i)});host={...native,...frames,release(){frames.release();native.world.free()}};return host}});registerMission1(app,{environment:{probe:async()=>true},combat:{stronghold:true,loadAsset:asset},interactions:{loadAsset:asset}});async function settle(n=80){for(let i=0;i<n;i++){await new Promise(r=>setImmediate(r));const next=queue.entries().next().value;if(next){queue.delete(next[0]);next[1](time+=1000/60);context.advance(1/60)}}}return {app,context,settle,target,data,reads,events,get host(){return host}}}
test('7B application registers campaign immediately, integrates story dialogue with active Mission1 and preserves room/return flow',async()=>{const f=await fixture(),storyEvents=[];const stop=f.app.subscribeStory(e=>storyEvents.push(e));try{assert.equal(f.app.campaign.snapshot().missions[0].registered,true);await f.app.openWorld({intro:false});await f.settle();for(const world of ['shambala','complex','kashi']){await f.app.travel(world);await f.settle();assert.ok(f.host.scene.getObjectByName('phase7b-story-'+world));assert.equal(f.app.locationSnapshot().loadedLocations,1)}await f.app.startMission('mission-1');await f.settle();const session=f.app.runtime.snapshot().session;assert.equal(session.state,'active');assert.equal(f.app.campaign.snapshot().missions[0].state,'active');let player,npc;const pose=f.app.storyPose().position;f.host.world.forEachRigidBody(body=>{if(body.userData?.roleId==='market-archivist')npc=body;if(body.isKinematic()&&!body.collider(0)?.isSensor()&&Math.hypot(body.translation().x-pose.x,body.translation().z-pose.z)<.01)player=body});assert.ok(player&&npc);const target=npc.translation(),at={x:target.x+1.5,y:target.y,z:target.z};player.setTranslation(at,true);player.setNextKinematicTranslation(at);const result=await f.app.interact(session.id);assert.equal(result.accepted,true);assert.match(f.app.campaign.snapshot().conversation.text,/contract is still active/);assert.equal(f.app.storyChoice('briefing').accepted,true);assert.equal(storyEvents.at(-1).missionId,'mission-1');assert.ok(f.app.campaign.snapshot().characters['market-archivist'].flags.includes('contract-reviewed'));await f.app.runtime.suspend('test');assert.equal(f.app.storyChoice('directions').accepted,false);await f.app.runtime.resume('test');f.app.storyChoice('close');await f.app.visitRoom();await f.settle();assert.equal(f.app.runtime.snapshot().session.state,'suspended');await f.app.returnFromMissionRoom();await f.settle();assert.equal(f.app.runtime.snapshot().session.state,'active');assert.equal(f.app.campaign.snapshot().characters['market-archivist'].met,true);await f.app.runtime.end();await f.app.openWorld({intro:false});await f.settle();assert.ok(f.app.explorationPose());assert.equal(f.data.get('kalki-reboot:campaign:v1'),'personal-sentinel');assert.ok(!f.reads.includes('kalki-reboot:campaign:v1'))}finally{stop();await f.app.release();assert.equal(f.context.sources.size,0)}})
