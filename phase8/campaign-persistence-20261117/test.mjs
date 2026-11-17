import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import { createCampaignPersistence, CAMPAIGN_SAVE_KEY as KEY, CAMPAIGN_BACKUP_KEY as BACKUP } from './staging/src/game/campaignStorage.js'
const base=path.dirname(fileURLToPath(import.meta.url)),disk=base+'/disposable-storage.json'
const mode=process.argv[2]
function diskStorage(){return {getItem(k){const d=fs.existsSync(disk)?JSON.parse(fs.readFileSync(disk)):{};return d[k]??null},setItem(k,v){const d=fs.existsSync(disk)?JSON.parse(fs.readFileSync(disk)):{};d[k]=v;fs.writeFileSync(disk,JSON.stringify(d))}}}
if(mode){
 globalThis.window={localStorage:diskStorage()}
 const {useCampaignState:store}=await import('./staging/src/game/campaignSystem.js')
 if(mode==='complete-five'){
  for(let i=1;i<=5;i++){assert.equal(store.getState().selectMission('mission-'+i),true);assert.equal(store.getState().startMission(),true);assert.equal(store.getState().completeMission('mission-'+i,'boss',i*100),true);assert.equal(store.getState().recordMissionReward('mission-'+i,'relic',50),true)}
  assert.equal(store.getState().flushProgress(),true)
 }else{
  assert.equal(store.getState().selectedMissionId,'mission-5');assert.equal(store.getState().completedMissionIds.length,5);assert.ok(store.getState().unlockedMissionIds.includes('mission-6'));assert.equal(store.getState().campaignScore,1750)
  const before=window.localStorage.getItem(KEY);assert.equal(store.getState().newCampaign(false),false);assert.equal(window.localStorage.getItem(KEY),before)
  store.getState().completeMission('mission-5','boss',99999);assert.equal(store.getState().rewards['mission-5'].boss,500);assert.equal(store.getState().recordMissionReward('mission-5','relic',50),false)
  assert.equal(store.getState().saveStatus,'saved')
 }
 console.log('PASS '+mode);process.exit(0)
}
if(fs.existsSync(disk))throw Error('Disposable result already exists; refuse overwrite')
const results=[];function test(name,fn){fn();results.push({name,status:'PASS'})}
const missions=Array.from({length:7},(_,i)=>({id:'mission-'+(i+1),playable:true}))
function memory(seed={}){const data=new Map(Object.entries(seed));return{data,getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v)}}
test('Legacy fields preserved on save without rewriting during load',()=>{const raw=JSON.stringify({completedMissionIds:['mission-1'],unlockedMissionIds:['mission-1','mission-2'],selectedMissionId:'mission-2',rewards:{},health:118,inventory:{healing:2},characterProgression:{rank:3}});const s=memory({[KEY]:raw}),p=createCampaignPersistence(s,missions);p.load();assert.equal(s.getItem(KEY),raw);assert.equal(p.commit({selectedMissionId:'mission-2'}).ok,true);const saved=JSON.parse(s.getItem(KEY));assert.equal(saved.health,118);assert.equal(saved.inventory.healing,2);assert.equal(saved.characterProgression.rank,3)})
test('Corrupt primary recovers backup and archives original before writing',()=>{const s=memory({[KEY]:'broken',[BACKUP]:JSON.stringify({completedMissionIds:['mission-1'],rewards:{},selectedMissionId:'mission-2'})}),p=createCampaignPersistence(s,missions);assert.equal(p.load().status,'recovered');assert.equal(s.getItem(KEY),'broken');assert.equal(p.commit({}).ok,true);assert.ok([...s.data].some(([k,v])=>k.includes('-archive-')&&v==='broken'))})
test('Unrecoverable corrupt record cannot be silently replaced',()=>{const s=memory({[KEY]:'broken'}),p=createCampaignPersistence(s,missions);assert.equal(p.load().status,'corrupt');assert.equal(p.commit({}).ok,false);assert.equal(s.getItem(KEY),'broken')})
test('Unavailable storage reports failure',()=>{const p=createCampaignPersistence({getItem(){throw Error('denied')},setItem(){throw Error('denied')}},missions);assert.equal(p.load().status,'unavailable');assert.equal(p.commit({}).ok,false)})
test('Write failure preserves valid primary',()=>{const raw=JSON.stringify({rewards:{},selectedMissionId:'mission-5',unlockedMissionIds:['mission-5']});const s=memory({[KEY]:raw}),p=createCampaignPersistence(s,missions);p.load();s.setItem=()=>{throw Error('quota')};assert.equal(p.commit({selectedMissionId:'mission-1'}).ok,false);assert.equal(s.getItem(KEY),raw)})
test('Another tab update is not overwritten',()=>{const s=memory(),p=createCampaignPersistence(s,missions);p.load();s.setItem(KEY,JSON.stringify({rewards:{},selectedMissionId:'mission-2'}));assert.equal(p.commit({}).status,'conflict')})
test('Explicit new campaign archives old data',()=>{const raw=JSON.stringify({rewards:{},selectedMissionId:'mission-5',unlockedMissionIds:['mission-5']});const s=memory({[KEY]:raw}),p=createCampaignPersistence(s,missions);p.load();assert.equal(p.commit({completedMissionIds:[],unlockedMissionIds:['mission-1'],selectedMissionId:'mission-1',rewards:{}},true).ok,true);assert.ok([...s.data].some(([k,v])=>k.includes('-archive-')&&v===raw))})
for(const step of ['complete-five','reopen-after-process-exit','reload-again'])test('Real Node process and disk persistence: '+step,()=>{const r=spawnSync(process.execPath,[fileURLToPath(import.meta.url),step],{encoding:'utf8'});assert.equal(r.status,0,r.stderr);console.log(r.stdout.trim())})
const hashes=[],sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);if(e.isDirectory())walk(p);else{const rel=path.relative(base+'/rollback',p);hashes.push({path:rel,before:sha(p),after:sha(path.resolve(base,'../..',rel))})}}}walk(base+'/rollback')
test('Production matches pre-change backup',()=>assert.ok(hashes.every(r=>r.before===r.after)))
fs.writeFileSync(base+'/test-results.json',JSON.stringify({results,hashes,browser:'BLOCKED; 120MiB available RAM. Node/disk test is not a browser or Vite restart test.'},null,2));console.log(JSON.stringify({passed:results.length,failed:0,protected:hashes.length}))
