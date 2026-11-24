import {BoxGeometry,Group,HemisphereLight,Mesh,MeshStandardMaterial,Quaternion,Euler,LoadingManager} from 'three'
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js'
import {DRACOLoader} from 'three/addons/loaders/DRACOLoader.js'
import {ARCHITECTURE,BOUNDARIES,RAMPS,BUILDINGS} from '../../../phase9/phase9B-mission1-r8-20261118/staging/src/game/districtLayout.js'
import {MISSION1_ASSETS,validateMission1Assets} from '../content/mission1.js'
import {ROADSIDE_SHELTERS} from '../../../phase9/phase9B-mission1-r8-20261118/staging/src/game/healingPolicy.js'
import {shelterParts} from '../../../phase9/phase9B-mission1-r8-20261118/staging/src/game/shelterGeometry.js'
import {requireCondition} from '../campaign/contracts.js'
import {createMission1Navigation,validateMission1CityGeometry,CITY_CAPSULES} from './mission1Navigation.js'

// Original MissionOneDistrict collision footprints; they do not replace the
// expanded interior walls, which come directly from districtLayout's parts.
const frontage=[[-13,2,3,4,7.3],[13,-8,3.5,4.5,9],[-14,-25,3,5,9],[14,-35,3.5,4,11.5],[-14,-51,3.5,4.5,7.8],[14,-61,3.5,5,9.3],[-10,23,4,3,6.8],[10,23,4,3,6.8]]
const shelters=ROADSIDE_SHELTERS.flatMap(site=>shelterParts(site).map(p=>({...p,at:p.at.map((v,i)=>v+site.position[i])})))
export const MISSION1_COLLISION_PARTS=Object.freeze([
 {at:[0,-.42,0],size:[200,.4,200]},
 {at:[14,-.42,260.4],size:[48,.4,321.2]},
 ...ARCHITECTURE.filter(p=>p.solid),...BOUNDARIES,...RAMPS,...shelters,
 ...frontage.map(([x,z,w,d,h])=>({at:[x,h/2-.22,z],size:[w*2,h,d*2]})),
 {at:[-11.65,.23,-34],size:[.36,.9,88]},
 {at:[0,4.28,-91],size:[12,9,7]},
 ...[-5.4,5.4].map(x=>({at:[x,2.16,24],size:[1,4.76,1]})),
])
export function disposeMission1Asset(root){const gs=new Set(),ms=new Set(),ts=new Set();root.traverse(o=>{if(o.geometry)gs.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:o.material?[o.material]:[]){ms.add(m);for(const v of Object.values(m))if(v?.isTexture)ts.add(v)}});for(const t of ts)t.dispose();for(const m of ms)m.dispose();for(const g of gs)g.dispose()}
export function createMission1Loader(){const manager=new LoadingManager(),decoder=new DRACOLoader(manager);const map={'draco_decoder.js':MISSION1_ASSETS.dracoJS,'draco_wasm_wrapper.js':MISSION1_ASSETS.dracoWrapper,'draco_decoder.wasm':MISSION1_ASSETS.dracoWasm};manager.setURLModifier(url=>map[url.split('/').at(-1)]??url);decoder.setDecoderPath('mission1-local-decoder/');const loader=new GLTFLoader(manager).setDRACOLoader(decoder);return {load:url=>loader.loadAsync(url),release:()=>decoder.dispose()}}
export function createMission1Environment({probe,loadAsset}={}){
 return async function prepare({host,sessionId,signal,onError=()=>{}}){
  const root=new Group();root.name='kashi-mission1-'+sessionId;const bodies=[],assets=[];let loader,closed=false,inserted=false;const geometry=new BoxGeometry(1,1,1),materials=new Map()
  function release(){if(closed)return;closed=true;const errors=[];const attempt=fn=>{try{fn()}catch(error){errors.push(error);onError(error)}};attempt(()=>root.removeFromParent());for(const body of bodies)attempt(()=>host.world.removeRigidBody(body));for(const asset of assets)attempt(()=>disposeMission1Asset(asset.scene));attempt(()=>geometry.dispose());for(const m of materials.values())attempt(()=>m.dispose());attempt(()=>loader?.release());signal.removeEventListener('abort',abort);if(errors.length)throw new AggregateError(errors,'Mission 1 environment cleanup failed')}
  function abort(){try{release()}catch{}}
  function live(){requireCondition(!closed&&!signal.aborted,'SESSION_CANCELLED','Environment preparation cancelled')}
  function part(p){let material=materials.get(p.color??'#8b7960');if(!material){material=new MeshStandardMaterial({color:p.color??'#8b7960',roughness:.95});materials.set(p.color??'#8b7960',material)}const mesh=new Mesh(geometry,material);mesh.position.set(...p.at);mesh.scale.set(...p.size);if(p.rotation)mesh.rotation.set(...p.rotation);root.add(mesh)}
  signal.addEventListener('abort',abort,{once:true})
  try{
   await validateMission1Assets(probe,signal);live();if(!loadAsset)loader=createMission1Loader()
   for(const key of ['kashi','riverbank']){const asset=await (loadAsset??loader.load)(MISSION1_ASSETS[key]);if(closed||signal.aborted){if(asset?.scene)disposeMission1Asset(asset.scene);live()}requireCondition(asset?.scene?.isObject3D,'MISSING_MISSION_ASSET','Missing actual Kashi GLTF scene');assets.push(asset);root.add(asset.scene)}
   live();for(const p of [...ARCHITECTURE,...shelters])part(p);for(const p of [...BOUNDARIES,...RAMPS])part(p)
   // Actual connected terrain/road dimensions from World and DistrictExpansion.
   for(const p of [{at:[0,-.23,0],size:[112,.02,200]},{at:[14,-.23,260.4],size:[48,.02,321.2]},{at:[14,-.207,222.5],size:[8,.02,397]},{at:[7,-.205,24],size:[18,.02,5]}])part(p)
   root.add(new HemisphereLight('#c7ddeb','#514339',1.35))
   for(const p of MISSION1_COLLISION_PARTS){live();const body=host.world.createRigidBody(host.rapier.RigidBodyDesc.fixed().setTranslation(...p.at));bodies.push(body);let descriptor=host.rapier.ColliderDesc.cuboid(...p.size.map(n=>n/2));if(p.rotation){const q=new Quaternion().setFromEuler(new Euler(...p.rotation));descriptor=descriptor.setRotation(q)}host.world.createCollider(descriptor,body)}
   host.world.step();live();host.scene.add(root);inserted=true
   return {ready:true,collisionReady:true,legacyApproachSupported:true,sessionId,buildingIds:['roadside-aid',...BUILDINGS.map(b=>b.id)],collisionCount:bodies.length,release}
  }catch(error){try{release()}catch{}throw error}finally{if(!inserted&&signal.aborted)release()}
 }
}

// Borrows the actual persistent district. Never creates a second city, legacy
// floor, terrain GLTF, collision world or light. Lease shutdown retains the city.
export function createMission1CityEnvironment(){
 return async function prepare({host,worldContent,sessionId,signal}){
  requireCondition(!signal.aborted&&worldContent?.ready===true&&worldContent.root?.parent===host.scene&&worldContent.root.userData.worldOwned===true&&worldContent.allInteriors?.length===14&&worldContent.collisionCount>0,'CITY_ENVIRONMENT_UNAVAILABLE','Prepared persistent Kashi scene and collision are required')
  const navigation=createMission1Navigation({...host,sessionId,signal});let closed=false
  const release=()=>{if(closed)return;closed=true;navigation.release();signal.removeEventListener('abort',release)}
  signal.addEventListener('abort',release,{once:true})
  try{host.world.step();const resolved=validateMission1CityGeometry({navigation});return {ready:true,collisionReady:true,legacyApproachSupported:false,sessionId,navigation,resolved,borrowedRoot:worldContent.root,collisionCount:0,borrowedCollisionCount:worldContent.collisionCount,
   resolvePlayerSpawn(position){requireCondition(!closed&&!signal.aborted,'SESSION_CANCELLED','Mission city lease ended');const p=navigation.ground(position,CITY_CAPSULES.player).bodyPosition;return [p.x,p.y,p.z]},release}
  }catch(error){release();throw error}
 }
}
