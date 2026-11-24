import test from 'node:test'
import assert from 'node:assert/strict'
import {createElement} from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
import {Scene,Group,Mesh,BoxGeometry,MeshBasicMaterial,AnimationClip,PerspectiveCamera} from 'three'
import RAPIER from '@dimforge/rapier3d-compat'
import {createFrameHost} from '../src/gameplay/frameHost.js'
import {createWorldExplorer} from '../src/world/worldExploration.js'
import {prepareKashiDistrict} from '../src/world/kashiDistrict.js'
import {createPersonalCraft} from '../src/world/personalCraft.js'
import {createCrystalWallet} from '../src/economy/crystalWallet.js'
import {EquipmentPanelView,bindEquipmentEscape} from '../src/ui/EquipmentPanel.js'
import {WEAPON_SHOP} from '../src/world/weaponShop.js'
await RAPIER.init()
const tick=()=>new Promise(resolve=>setImmediate(resolve))
function asset(){const scene=new Group();scene.add(new Mesh(new BoxGeometry(1,2,1),new MeshBasicMaterial()));return {scene,animations:['Sword idle (guard)','Idle','Walk','Run'].map(name=>new AnimationClip(name,1,[]))}}
function key(target,type,value){const event=new Event(type,{cancelable:true});Object.defineProperties(event,{key:{value},repeat:{value:false}});target.dispatchEvent(event)}
async function fixture(storage){
 const lifetime=new AbortController(),abort=new AbortController(),world=new RAPIER.World({x:0,y:-19,z:0}),scene=new Scene(),camera=new PerspectiveCamera(42,16/9,.1,180),target=new EventTarget(),queue=new Map(),captured=[],errors=[],states=[]
 let next=0,time=0
 const renderer={isWebGLRenderer:true,shadowMap:{enabled:false},domElement:{ownerDocument:{defaultView:target}},getContext:()=>({isContextLost:()=>false}),render(){}}
 const frames=createFrameHost({world,scene,camera,renderer,signal:lifetime.signal,onError:e=>errors.push(e),requestFrame:fn=>{queue.set(++next,fn);return next},cancelFrame:id=>queue.delete(id)})
 const host={...frames,world,scene,camera,renderer,rapier:RAPIER,subscribeFrame(fn){captured.push(fn);return frames.subscribeFrame(fn)}}
 const content=await prepareKashiDistrict({host,signal:lifetime.signal}),cleanups=[]
 const explorer=await createWorldExplorer({host,signal:abort.signal,ownerId:'flight-test',position:[126,-.175,25],own:fn=>cleanups.push(fn),loadPlayerAsset:async()=>asset(),worldContent:content,currency:createCrystalWallet({storage}),personalCraft:createPersonalCraft({storage}),onError:e=>errors.push(e),onWorldState:s=>states.push(s)})
 let player;world.forEachRigidBody(body=>{if(body.isKinematic())player=body})
 host.resume()
 const f={host,world,scene,camera,target,content,explorer,abort,errors,states,player,captured,
  run(count){for(let i=0;i<count;i++){const value=queue.entries().next().value;assert.ok(value,'existing frame loop active');queue.delete(value[0]);value[1](time+=1000/60)}},
  async press(value){key(target,'keydown',value);await tick()},up:value=>key(target,'keyup',value),
  async release(){await explorer.release();abort.abort();content.release();frames.release();world.free()}}
 f.run(5);return f
}
test('House01 native E interaction opens shop, freezes stale movement, closes cleanly and restores fresh movement',async()=>{const data=new Map(),storage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v)},f=await fixture(storage);try{assert.equal(WEAPON_SHOP.number,1);assert.ok(f.scene.getObjectByName('bhairava-weapon-shop'));f.run(15);assert.equal(f.states.at(-1).weaponShop.nearby,true);await f.press('e');f.up('e');assert.equal(f.states.at(-1).weaponShop.open,true);const p={...f.player.translation()};await f.press('w');f.run(45);f.up('w');assert.deepEqual({...f.player.translation()},p);assert.throws(()=>f.explorer.personalVehicle('summon'),{code:'SHOP_OPEN'});const detach=bindEquipmentEscape({target:f.target,shopOpen:true,onCloseShop:()=>f.explorer.closeWeaponShop()});await f.press('Escape');f.up('Escape');detach();assert.equal(f.explorer.closeWeaponShop(),false);assert.equal(f.states.at(-1).weaponShop.open,false);await f.press('w');f.run(30);f.up('w');assert.ok(Math.hypot(f.player.translation().x-p.x,f.player.translation().z-p.z)>.3);assert.deepEqual(f.errors,[]);await f.explorer.release();assert.equal(f.scene.getObjectByName('bhairava-weapon-shop'),undefined)}finally{await f.release()}})
test('shop is not available remotely or through the vehicle panel and modal has a pinned close command',()=>{const view={weapons:[{id:'sunblade',name:'Sunblade',price:120,owned:false}],ready:true},onClose=()=>{};const vehicle=renderToStaticMarkup(createElement(EquipmentPanelView,{view,open:true,shop:{distance:55,direction:'south-west'}}));assert.match(vehicle,/House 01/);assert.doesNotMatch(vehicle,/Purchase|Upgrade|Bhairava Weapon Shop/);const shop=EquipmentPanelView({view,shopOpen:true,onCloseShop:onClose});assert.equal(shop.type,'dialog');assert.equal(shop.props.children[0].props.children[1].props.onClick,onClose);assert.equal(shop.props.children[0].props.style.position,'sticky');assert.match(renderToStaticMarkup(shop),/Close · Esc/);assert.doesNotMatch(renderToStaticMarkup(shop),/>summon</)})

test('Escape binding closes vehicle controls once per event and releases its listener',()=>{const target=new EventTarget();let calls=0;const release=bindEquipmentEscape({target,shopOpen:false,vehicleOpen:true,onCloseVehicle:()=>calls++}),event=()=>{const e=new Event('keydown',{cancelable:true});Object.defineProperty(e,'key',{value:'Escape'});return e};target.dispatchEvent(event());assert.equal(calls,1);release();target.dispatchEvent(event());assert.equal(calls,1)})
