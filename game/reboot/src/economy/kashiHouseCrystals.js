import {KASHI_INTERIORS} from '../world/kashiDistrict.js'
import {NEIGHBORHOOD_INTERIORS} from '../world/kashiNeighborhood.js'
import {TERRACE_INTERIORS} from '../world/kashiTerraceWalk.js'
// One optional reward on the clear exterior approach of every numbered building.
// Reuse authored entrance/floor coordinates; no new colliders, doors or objectives.
export const HOUSE_CRYSTALS=Object.freeze([...KASHI_INTERIORS,...NEIGHBORHOOD_INTERIORS,...TERRACE_INTERIORS].map(room=>Object.freeze({id:'kashi-house-'+room.id,houseId:room.id,number:room.number,locationId:'kashi',position:Object.freeze([room.entry[0],room.floor+.975,room.entry[2]+room.front*3]),amount:25})))
