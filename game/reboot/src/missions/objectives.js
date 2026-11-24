import {clone,requireCondition,objectiveReady} from '../campaign/contracts.js'
export function createObjectiveOrchestrator(definitions,{completed=[],failed=[]}={}){
 const states=new Map(definitions.map(o=>[o.id,completed.includes(o.id)?'completed':failed.includes(o.id)?'failed':'locked']))
 let closed=false
 function refresh(){for(const o of definitions)if(['locked','ready'].includes(states.get(o.id)))states.set(o.id,objectiveReady(o,completedIds())?'ready':'locked')}
 const completedIds=()=>[...states].filter(([,state])=>state==='completed').map(([id])=>id)
 function activateReady(){requireCondition(!closed,'ORCHESTRATION_RELEASED','Objective owner released');refresh();for(const [id,state] of states)if(state==='ready')states.set(id,'active')}
 function accept(id){requireCondition(!closed,'ORCHESTRATION_RELEASED','Objective owner released');requireCondition(states.get(id)==='active'||states.get(id)==='completed','INVALID_OBJECTIVE_TRANSITION','Objective is not active');states.set(id,'completed');activateReady()}
 function fail(id){requireCondition(!closed,'ORCHESTRATION_RELEASED','Objective owner released');requireCondition(states.get(id)==='active','INVALID_OBJECTIVE_TRANSITION','Only active objective can fail');states.set(id,'failed')}
 function snapshot(){return clone(Object.fromEntries(states))}
 function mandatoryReady(){return definitions.filter(o=>o.required!==false).every(o=>states.get(o.id)==='completed')}
 refresh()
 return Object.freeze({activateReady,accept,fail,snapshot,completedIds,mandatoryReady,release(){closed=true}})
}
