import {createLocationPositionStore} from './positionStore.js'
import {LOCATION_DEFINITIONS} from './definitions.js'
import {requireCondition} from '../../campaign/contracts.js'
export const JOURNEY_KEY='kalki:phase5-staging:journey:v1'
export function createJourneyMemory({storage}){
 let observed=storage.getItem(JOURNEY_KEY)
 const guarded={getItem:key=>storage.getItem(key),setItem(key,text){requireCondition(storage.getItem(key)===observed,'JOURNEY_SAVE_CONFLICT','Travel memory changed; reload before retry');try{storage.setItem(key,text)}catch(e){if(storage.getItem(key)!==text)throw e}requireCondition(storage.getItem(key)===text,'JOURNEY_SAVE_FAILED','Travel memory write verification failed');observed=text}}
 const store=createLocationPositionStore({storage:guarded,definitions:LOCATION_DEFINITIONS,key:JOURNEY_KEY})
 return Object.freeze({load:store.load,save:store.save})
}
