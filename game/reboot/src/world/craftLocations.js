import {LOCATION_DEFINITIONS} from './locations/definitions.js'
// Local world coordinates; old saves without a location belong to Kashi.
// Flight shares the full registered outdoor footprint instead of the old arrival quarter.
export const CRAFT_LOCATIONS=Object.freeze(Object.fromEntries(LOCATION_DEFINITIONS.filter(d=>['kashi','shambala','complex'].includes(d.id)).map(d=>[d.id,Object.freeze({minX:Math.min(...d.regions.map(r=>r.minX)),maxX:Math.max(...d.regions.map(r=>r.maxX)),minZ:Math.min(...d.regions.map(r=>r.minZ)),maxZ:Math.max(...d.regions.map(r=>r.maxZ)),maxY:160})])))
export function craftLocation(saved){return saved?.locationId??'kashi'}
export function validCraftPosition(position,locationId='kashi'){
 const bounds=CRAFT_LOCATIONS[locationId]
 return Boolean(bounds&&Array.isArray(position)&&position.length===3&&position.every(Number.isFinite)&&position[0]>=bounds.minX&&position[0]<=bounds.maxX&&position[2]>=bounds.minZ&&position[2]<=bounds.maxZ&&position[1]>=-30&&position[1]<=bounds.maxY)
}
