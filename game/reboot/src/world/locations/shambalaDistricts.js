import {SHAMBALA_NETWORK,appendShambalaIntegration} from './shambalaIntegration.js'
import {SHAMBALA_PERIMETER,appendShambalaPerimeter} from './shambalaPerimeter.js'
import {SHAMBALA_PALACE,appendShambalaPalace} from './shambalaPalace.js'
import {createWorldArchitecture} from './phase6Architecture.js'
import {SHAMBALA_OUTER,appendShambalaOuter} from './shambalaOuter.js'
export const SHAMBALA_DISTRICT_REGIONS=[SHAMBALA_OUTER.bounds,SHAMBALA_PALACE.bounds,...SHAMBALA_PERIMETER.regions]
export function buildShambalaDistricts(args){
 const a=createWorldArchitecture({...args,id:'shambala-connected-districts',palette:{stone:'#c7c2a5',light:'#e4d8b5',dark:'#34474c',trim:'#b9a275',glow:'#78d9cb',glass:'#75b8c7'}})
 try{appendShambalaOuter(a,args.stage);if(args.stage>=3)appendShambalaPalace(a,args.stage);if(args.stage>=4)appendShambalaPerimeter(a);if(args.stage>=5)appendShambalaIntegration(a);const metrics=a.finish();const glow=a.group.children.find(m=>m.name.endsWith('box:glow'))?.material;let time=0;return {...a,metrics,network:args.stage>=5?SHAMBALA_NETWORK:[],tick(delta){if(args.stage>=5&&glow){time=(time+delta)%3600;glow.emissiveIntensity=.7+.1*Math.sin(time*1.5)}},areas:[...SHAMBALA_OUTER.areas,...(args.stage>=3?SHAMBALA_PALACE.areas:[]),...(args.stage>=4?SHAMBALA_PERIMETER.areas:[])]}}catch(e){a.release();throw e}
}
