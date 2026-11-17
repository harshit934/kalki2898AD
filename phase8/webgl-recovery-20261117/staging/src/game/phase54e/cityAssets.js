import{prepareCrowdLods}from'./crowdLod.js'
import { Box3, Vector3 } from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
let core,opening,citizens;const details=new Map(),loader=new GLTFLoader()
export const firstCity=()=>typeof location!=='undefined'&&new URLSearchParams(location.search).get('cityVersion')==='first'
export const finalCity=()=>!firstCity()&&new URLSearchParams(location.search).get('cityVersion')!=='correction1'
const path=firstCity()?'/environment/phase54e/':finalCity()?'/environment/phase54e-final/':'/environment/phase54e-correction/'
const arenas=new Map(),props=new Map()
export function loadFinalProp(name){if(!props.has(name))props.set(name,loader.loadAsync('/environment/phase54e-final/'+name+'.glb').catch(e=>{props.delete(name);throw e}));return props.get(name)}
export function loadArena(mission){if(!arenas.has(mission))arenas.set(mission,loader.loadAsync(path+'arena-'+Number(mission.split('-')[1])+'.glb').catch(e=>{arenas.delete(mission);throw e}));return arenas.get(mission)}
export const cityEnabled=()=>typeof location!=='undefined'&&new URLSearchParams(location.search).get('environment54e')==='1'
export function loadCityCore(){return core??=(loader.loadAsync(path+(firstCity()?'riverfront-core.glb':'street-core.glb')).catch(e=>{core=null;throw e}))}
export function loadCityDetail(name){if(!details.has(name))details.set(name,loader.loadAsync(path+(firstCity()?name:'street-detail')+'.glb').catch(e=>{details.delete(name);throw e}));return details.get(name)}
export function loadCityCitizens(){return citizens??=Promise.all(['merchant','porter'].map(name=>loader.loadAsync('/environment/phase54c-revision/civilian-'+name+'.glb').then(async asset=>{const box=new Box3().setFromObject(asset.scene);if(!firstCity()&&new URLSearchParams(location.search).get('crowdLOD')==='1')await prepareCrowdLods(asset,name,1.72/box.getSize(new Vector3()).y);asset.scene.traverse(o=>{if(o.isSkinnedMesh){o.computeBoundingSphere();o.boundingSphere.radius*=2.8;o.computeBoundingBox();o.boundingBox.expandByScalar(1)}});return {asset,size:box.getSize(new Vector3()),center:box.getCenter(new Vector3()),minY:box.min.y}}))).catch(e=>{citizens=null;throw e})}
export function prepareCityOpening(){return opening??=Promise.all(firstCity()?[loadCityCore(),loadCityDetail('north-detail'),loadCityCitizens()]:[loadCityCore(),loadCityCitizens(),...(finalCity()?[loadFinalProp('barrier-housing'),loadFinalProp('rotor')]:[])]).catch(e=>{opening=null;throw e})}
