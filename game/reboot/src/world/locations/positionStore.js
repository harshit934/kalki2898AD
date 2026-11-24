import {requireCondition} from '../../campaign/contracts.js'
import {containsPosition} from './definitions.js'
export const STAGING_LOCATION_KEY='kalki:phase5-staging:locations:v1'
// Explicit injected storage only. Never opens window.localStorage or campaign keys.
export function createLocationPositionStore({storage,definitions,key=STAGING_LOCATION_KEY}){
 requireCondition(typeof storage?.getItem==='function'&&typeof storage?.setItem==='function'&&typeof key==='string'&&key.startsWith('kalki:phase5-staging:')&&!key.includes('campaign'),'INVALID_LOCATION_STORAGE','Dedicated staging storage required');const byId=new Map(definitions.map(d=>[d.id,d]))
 function validate(value){requireCondition(value?.version===1&&Array.isArray(value.positions)&&Object.keys(value).every(k=>['version','positions'].includes(k)),'INVALID_LOCATION_SAVE','Versioned position records required');const seen=new Set();for(const p of value.positions){const d=byId.get(p?.locationId);requireCondition(d?.status==='available'&&!seen.has(p.locationId)&&containsPosition(d,p.position)&&Number.isFinite(p.heading),'INVALID_LOCATION_SAVE','Unique finite positions in available locations required');seen.add(p.locationId);requireCondition(Object.keys(p).every(k=>['locationId','position','heading'].includes(k)),'INVALID_LOCATION_SAVE','Unexpected player data')}return structuredClone(value)}
 return Object.freeze({load(){const raw=storage.getItem(key);if(raw===null)return {version:1,positions:[]};let value;try{value=JSON.parse(raw)}catch{requireCondition(false,'INVALID_LOCATION_SAVE','Malformed location save; original data preserved')}return validate(value)},save(value){const valid=validate(value);storage.setItem(key,JSON.stringify(valid));return valid}})
}
