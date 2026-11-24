import {bikeUnlocked} from '../economy/campaignRewardFeed.js'
import {validCraftPosition,CRAFT_LOCATIONS} from './craftLocations.js'
import {requireCondition} from '../campaign/contracts.js'
export const BIKE_KEY='kalki:campaign:surya-bike:v1'
export function createPersonalBike({storage,wallet}){
 let raw,state,error=null
 const valid=v=>v?.version===1&&Boolean(CRAFT_LOCATIONS[v.locationId])&&typeof v.summoned==='boolean'&&(v.position===null||validCraftPosition(v.position,v.locationId))&&Number.isFinite(v.yaw)
 const snapshot=()=>({...structuredClone(state??{}),ready:Boolean(state),unlocked:bikeUnlocked(wallet),error})
 function reload(){try{raw=storage.getItem(BIKE_KEY);state=raw===null?{version:1,locationId:'kashi',summoned:false,position:null,yaw:0}:JSON.parse(raw);requireCondition(valid(state),'INVALID_BIKE_SAVE','Bike save invalid; original bytes retained');error=null}catch(e){state=null;error=e.message}return snapshot()}
 function commit(patch){requireCondition(bikeUnlocked(wallet),'BIKE_LOCKED','Complete Mission 2 to unlock the Surya motorcycle');requireCondition(state,'BIKE_UNAVAILABLE','Bike save unavailable');requireCondition(storage.getItem(BIKE_KEY)===raw,'BIKE_SAVE_CONFLICT','Bike changed in another session');const next={...state,...patch};requireCondition(valid(next),'INVALID_BIKE_STATE','Invalid bike position');const text=JSON.stringify(next);try{try{storage.setItem(BIKE_KEY,text)}catch(e){if(storage.getItem(BIKE_KEY)!==text)throw e}requireCondition(storage.getItem(BIKE_KEY)===text,'BIKE_SAVE_FAILED','Bike parking save failed');state=next;raw=text;error=null;return snapshot()}catch(e){error=e.message;throw e}}
 reload();return {snapshot,reload,commit}
}
