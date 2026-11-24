import {DISTRICT_AID} from './districtLayout.js'
export const MISSION_HEALING_CHARGES=5
export const HEALING_CAP=5
export const ROADSIDE_SHELTERS=Object.freeze([
  Object.freeze({id:'roadside-aid',position:Object.freeze([5.3,-.22,-12]),variant:'aid'}),
  Object.freeze({id:'courtyard-cache',position:Object.freeze([-5.3,-.22,-33]),variant:'cache'}),
])

export const EXPLORATION_SHELTERS=Object.freeze([...ROADSIDE_SHELTERS,...DISTRICT_AID])
