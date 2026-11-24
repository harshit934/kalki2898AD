import {COMPLEX_DISTRICT_REGIONS} from './complexDistricts.js'
import {SHAMBALA_DISTRICT_REGIONS} from './shambalaDistricts.js'
import {COMPLEX_RESEARCH} from './complexResearch.js'
import {SHAMBALA_CITY} from './shambalaCity.js'
import {KASHI_RESIDENTIAL} from '../kashiResidential.js'
import {KASHI_TEMPLE_MARKET} from '../kashiTempleMarket.js'
import {KASHI_RIVERFRONT} from '../kashiRiverfront.js'
import {KASHI_STREETS} from '../kashiStreets.js'
import {BUILDINGS,interiorDefinition} from './buildings/definitions.js'
import {SHAMBALA_LAYOUT} from './shambalaLayout.js'
import {COMPLEX_LAYOUT} from './complexLayout.js'
import {KASHI_TOPOLOGY} from './kashiTopology.js'
import {deepFreeze,requireCondition} from '../../campaign/contracts.js'
export const LOCATION_SPACE=Object.freeze({units:'metres',upAxis:'Y',position:'local-to-location',maxCoordinate:1000000})
export const LOCATION_DEFINITIONS=deepFreeze([
 {id:'kashi',label:'Kashi',status:'available',space:LOCATION_SPACE,environment:'existing-phase3c-kashi',architecture:'Connected street district, east courts and Terrace Walk',regions:[...KASHI_TOPOLOGY.regions,KASHI_STREETS.bounds,...KASHI_RIVERFRONT.regions,...KASHI_TEMPLE_MARKET.regions,KASHI_RESIDENTIAL.bounds],spawns:[{id:'entry',position:KASHI_TOPOLOGY.spawn}],entrances:KASHI_TOPOLOGY.entrances,missionStarts:[{missionId:'mission-1',spawnId:'entry',status:'existing-menu-only'}],dependencies:[],future:['buildings','parking','travel']},
 {id:'complex',label:'The Complex',status:'available',space:LOCATION_SPACE,environment:'authored-complex-arrival-quarter',architecture:'Authored inverted citadel, bronze-finned towers and layered promenades',regions:[COMPLEX_LAYOUT.bounds,COMPLEX_RESEARCH.bounds,...COMPLEX_DISTRICT_REGIONS],spawns:[{id:'entry',position:COMPLEX_LAYOUT.spawn}],entrances:[{id:'return-kashi',position:COMPLEX_LAYOUT.exit}],missionStarts:[],dependencies:[],future:['buildings','parking','travel']},
 {id:'shambala',label:'Shambala',status:'available',space:LOCATION_SPACE,environment:'authored-shambala-valley',architecture:'Mountain valley, cedar forest, river bridges, waterfall and carved temple settlement',regions:[SHAMBALA_LAYOUT.bounds,...SHAMBALA_CITY.regions,...SHAMBALA_DISTRICT_REGIONS],spawns:[{id:'entry',position:SHAMBALA_LAYOUT.spawn}],entrances:[{id:'return-kashi',position:SHAMBALA_LAYOUT.exit}],missionStarts:[],dependencies:[],future:['buildings','parking','travel']},
 ...BUILDINGS.map(interiorDefinition),
].map(d=>({npcs:[],activities:[],parking:[],transitionPoints:[],...d})))
export const finitePosition=p=>Array.isArray(p)&&p.length===3&&p.every(v=>Number.isFinite(v)&&Math.abs(v)<=LOCATION_SPACE.maxCoordinate)
export const containsPosition=(location,p)=>finitePosition(p)&&location.regions.some(b=>p[0]>=b.minX&&p[0]<=b.maxX&&p[2]>=b.minZ&&p[2]<=b.maxZ)
export function validateLocations(definitions){
 requireCondition(Array.isArray(definitions)&&definitions.length>0,'INVALID_LOCATIONS','Location definitions required');const ids=new Set()
 for(const d of definitions){requireCondition(typeof d.id==='string'&&d.id.length&&!ids.has(d.id),'INVALID_LOCATIONS','Unique location ID required');ids.add(d.id);requireCondition(d.space?.units==='metres'&&d.space.upAxis==='Y'&&d.space.position==='local-to-location','INVALID_LOCATIONS','Explicit metre/Y-up local coordinates required');requireCondition(['available','planned'].includes(d.status)&&typeof d.architecture==='string'&&Array.isArray(d.regions)&&Array.isArray(d.spawns)&&Array.isArray(d.entrances)&&Array.isArray(d.missionStarts)&&Array.isArray(d.dependencies)&&['npcs','activities','parking','transitionPoints'].every(key=>Array.isArray(d[key])),'INVALID_LOCATIONS','Complete location contract required');for(const b of d.regions)requireCondition([b.minX,b.maxX,b.minZ,b.maxZ].every(Number.isFinite)&&b.minX<b.maxX&&b.minZ<b.maxZ,'INVALID_LOCATIONS','Ordered finite bounds required');const spawnIds=new Set();for(const s of d.spawns){requireCondition(typeof s.id==='string'&&!spawnIds.has(s.id)&&containsPosition(d,s.position),'INVALID_LOCATIONS','Unique bounded spawn required');spawnIds.add(s.id)}if(d.status==='available')requireCondition(typeof d.environment==='string'&&d.spawns.length>0&&d.regions.length>0,'INVALID_LOCATIONS','Available environment needs real spawn and bounds');else requireCondition(d.environment===null&&d.spawns.length===0,'INVALID_LOCATIONS','Planned locations cannot claim playable assets or spawns');for(const e of d.entrances)requireCondition(typeof e.id==='string'&&containsPosition(d,e.position),'INVALID_LOCATIONS','Entrance must belong to location');for(const m of d.missionStarts)requireCondition(typeof m.missionId==='string'&&spawnIds.has(m.spawnId),'INVALID_LOCATIONS','Mission origin needs defined spawn')}
 return deepFreeze(structuredClone(definitions))
}
validateLocations(LOCATION_DEFINITIONS)
