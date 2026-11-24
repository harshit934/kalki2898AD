// Local world coordinates; old saves without a location belong to Kashi.
export const CRAFT_LOCATIONS=Object.freeze({
 kashi:Object.freeze({minX:108,maxX:364,minZ:-20,maxZ:116,maxY:54}),
 shambala:Object.freeze({minX:-55,maxX:445,minZ:-60,maxZ:238,maxY:90}),
 complex:Object.freeze({minX:-34,maxX:450,minZ:-190,maxZ:150,maxY:90})
})
export function craftLocation(saved){return saved?.locationId??'kashi'}
export function validCraftPosition(position,locationId='kashi'){
 const bounds=CRAFT_LOCATIONS[locationId]
 return Boolean(bounds&&Array.isArray(position)&&position.length===3&&position.every(Number.isFinite)&&position[0]>=bounds.minX&&position[0]<=bounds.maxX&&position[2]>=bounds.minZ&&position[2]<=bounds.maxZ&&position[1]>=-30&&position[1]<=bounds.maxY)
}
