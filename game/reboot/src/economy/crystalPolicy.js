import {CAMPAIGN_CRYSTAL_GRANTS} from '../content/campaignRewards.js'
import {ACTIVITY_GRANTS} from '../world/activities/definitions.js'
import {MISSION_ACTIVITY_GRANTS} from '../content/missionActivities.js'
import {HOUSE_CRYSTALS} from './kashiHouseCrystals.js'
export const CRYSTAL_KEY='kalki:phase5-staging:phase5g-crystals:v1'
// Initial isolated balance tuning, separate from the existing campaign score.
export const WORLD_CRYSTALS=Object.freeze([
 ...HOUSE_CRYSTALS,
 {id:'kashi-street-01',locationId:'kashi',position:[162,.8,61],amount:25},
 {id:'kashi-street-02',locationId:'kashi',position:[162,.8,56],amount:25},
 {id:'kashi-street-03',locationId:'kashi',position:[158,.8,84],amount:25},
 {id:'complex-plaza-01',locationId:'complex',position:[0,.9,8],amount:25},
 {id:'shambala-meadow-01',locationId:'shambala',position:[0,.9,13],amount:25}
].map(row=>Object.freeze({...row,position:Object.freeze(row.position)})))
export const CRYSTAL_GRANTS=Object.freeze(Object.fromEntries([
 ...Object.entries(ACTIVITY_GRANTS),
 ...Object.entries(MISSION_ACTIVITY_GRANTS),
 ...WORLD_CRYSTALS.map(c=>['world:'+c.id,{amount:c.amount,label:'Crystal collected'}]),
 ...['crystal-01','crystal-02','crystal-03'].map(id=>['objective:mission-1:'+id,{amount:50,label:'Optional crystal reward'}]),
 ...Object.entries(CAMPAIGN_CRYSTAL_GRANTS)
].map(([id,row])=>[id,Object.freeze(row)])))
