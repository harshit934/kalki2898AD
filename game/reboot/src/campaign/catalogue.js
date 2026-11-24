import rows from '../content/missions.json' with {type:'json'}
import {clone,deepFreeze,requireCondition,validateMissionDefinition} from './contracts.js'

export const STORY_AUTHORITY=deepFreeze({source:'phase8/mission91-100-story-investigation/campaign-story-reconciliation-and-approval.md',characterBible:'external-authority-required-before-character-implementation',milestones:{firstKarnaAwakening:50,adultKalkiPlayable:60,horizonKeeper:70,supremeYaskin:100}})
export function createCatalogue(definitions){
  requireCondition(Array.isArray(definitions)&&definitions.length===100,'INVALID_CATALOGUE','Exactly 100 mission definitions are required')
  const map=new Map()
  for(const row of definitions){validateMissionDefinition(row);requireCondition(!map.has(row.id),'DUPLICATE_MISSION','Duplicate mission ID');map.set(row.id,deepFreeze({...clone(row),availability:'independent',implementation:'designed-only'}))}
  for(let number=1;number<=100;number++)requireCondition(map.has(`mission-${number}`),'MISSING_MISSION','Missing mission slot')
  return Object.freeze({list:()=>[...map.values()].sort((a,b)=>a.number-b.number),get:id=>map.get(id)??null,canSelect:id=>map.has(id)})
}
export const catalogue=createCatalogue(rows)
