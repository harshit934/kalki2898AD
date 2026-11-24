import {requireCondition} from '../campaign/contracts.js'
export const CRAFT_KEY='kalki:phase5-staging:personal-skimmer:v1'
export function createPersonalCraft({storage}){
 let state,raw,error=null
 function valid(v){return v?.version===1&&v.owned===true&&typeof v.summoned==='boolean'&&(v.position===null||(Array.isArray(v.position)&&v.position.length===3&&v.position.every(Number.isFinite)&&v.position[0]>=108&&v.position[0]<=364&&v.position[2]>=-20&&v.position[2]<=116&&v.position[1]>=-10&&v.position[1]<=54))&&Number.isFinite(v.yaw)}
 function reload(){try{raw=storage.getItem(CRAFT_KEY);state=raw===null?{version:1,owned:true,summoned:false,position:null,yaw:Math.PI}:JSON.parse(raw);requireCondition(valid(state),'INVALID_CRAFT_SAVE','Personal craft save invalid; preserved');error=null}catch(e){state=null;error=e.message}return snapshot()}
 function snapshot(){return {ready:Boolean(state),error,...structuredClone(state??{})}}
 function commit(patch){requireCondition(state,'CRAFT_UNAVAILABLE','Personal craft save unavailable');requireCondition(storage.getItem(CRAFT_KEY)===raw,'CRAFT_SAVE_CONFLICT','Craft state changed; reload before retry');const next={...state,...patch},text=JSON.stringify(next);requireCondition(valid(next),'INVALID_CRAFT_STATE','Invalid personal craft state');try{try{storage.setItem(CRAFT_KEY,text)}catch(e){if(storage.getItem(CRAFT_KEY)!==text)throw e}requireCondition(storage.getItem(CRAFT_KEY)===text,'CRAFT_SAVE_FAILED','Craft save verification failed');state=next;raw=text;error=null;return snapshot()}catch(e){error=e.message;throw e}}
 reload();return Object.freeze({snapshot,reload,commit})
}
