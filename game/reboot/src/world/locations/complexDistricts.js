import {COMPLEX_ENERGY,COMPLEX_NETWORK,appendComplexEnergy} from './complexEnergyFacility.js'
import {COMPLEX_CONTAINMENT,appendComplexContainment} from './complexContainment.js'
import {COMPLEX_PRODUCTION,appendComplexProduction} from './complexProduction.js'
import {createWorldArchitecture} from './phase6Architecture.js'
import {COMPLEX_ADVANCED,appendComplexAdvanced} from './complexAdvanced.js'
export const COMPLEX_DISTRICT_REGIONS=[COMPLEX_ADVANCED.bounds,COMPLEX_PRODUCTION.bounds,COMPLEX_CONTAINMENT.bounds,COMPLEX_ENERGY.bounds]
export function buildComplexDistricts(args){
 const a=createWorldArchitecture({...args,id:'complex-connected-districts',palette:{stone:'#75868e',light:'#c7d6d8',dark:'#293b49',trim:'#b68b58',glow:'#ffbf70',glass:'#77b9c7'}})
 try{appendComplexAdvanced(a,args.stage);if(args.stage>=3)appendComplexProduction(a,args.stage);if(args.stage>=4)appendComplexContainment(a);if(args.stage>=5)appendComplexEnergy(a);const metrics=a.finish();const glow=a.group.children.find(m=>m.name.endsWith('box:glow'))?.material;let time=0;return {...a,metrics,network:args.stage>=5?COMPLEX_NETWORK:[],tick(delta){if(args.stage>=5&&glow){time=(time+delta)%3600;glow.emissiveIntensity=.7+.1*Math.sin(time*1.4)}},areas:[...COMPLEX_ADVANCED.areas,...(args.stage>=3?COMPLEX_PRODUCTION.areas:[]),...(args.stage>=4?COMPLEX_CONTAINMENT.areas:[]),...(args.stage>=5?COMPLEX_ENERGY.areas:[])]}}catch(e){a.release();throw e}
}
