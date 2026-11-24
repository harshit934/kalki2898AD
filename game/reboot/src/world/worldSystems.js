import {createStoryCharacters} from './story/characterField.js'
import {createWorldEffects} from './effects/worldEffects.js'
import {createActivityField} from './activities/field.js'
import {requireCondition} from '../campaign/contracts.js'
import kashi from './life/kashi.js'
import shambala from './life/shambala.js'
import complex from './life/complex.js'
import {createPopulation} from './life/population.js'
import {createEnvironmentLife} from './life/environment.js'
export const WORLD_LIFE_PROFILES=Object.freeze({kashi,shambala,complex})
export function withWorldSystems(content,{host,signal,own=()=>{},locationId,readPlayer=()=>null,isActive=()=>true,clock=null,activities=null,canPlay=()=>true,audio=null,campaign=null,onStoryEvent,readStoryPlayer=readPlayer,canStoryPlay=canPlay}){
 const profile=WORLD_LIFE_PROFILES[locationId];if(!profile)return content
 requireCondition(!signal.aborted&&!host.scene.getObjectByName('phase6d-population-'+locationId),'WORLD_SYSTEMS_UNAVAILABLE','Live unique world-system owner required')
 let population,environment,activity,effects,audioLayer,story,stopBefore,stopAfter,closed=false,audioElapsed=0
 const releaseSystems=()=>{if(closed)return;closed=true;stopBefore?.();stopAfter?.();story?.release();audioLayer?.release();effects?.release();activity?.release();population?.release();environment?.release();signal.removeEventListener('abort',releaseSystems)}
 own(releaseSystems);signal.addEventListener('abort',releaseSystems,{once:true})
 try{
  population=createPopulation({host,profile,readPlayer});environment=createEnvironmentLife({host,content,profile,clock})
  if(activities)activity=createActivityField({host,world:locationId,service:activities,canPlay})
  audioLayer=audio?.attach(locationId)
  effects=createWorldEffects({host,world:locationId,environment,readPlayer})
  if(campaign)story=createStoryCharacters({host,world:locationId,campaign,readPlayer:readStoryPlayer,canPlay:canStoryPlay,audio,onStoryEvent})
  stopBefore=host.subscribeFrame(delta=>{if(closed||signal.aborted)return;const active=isActive();population.tick(delta,active);environment.tick(delta,active);story?.tick(delta,active)})
  stopAfter=(host.subscribeAfterPhysics??host.subscribeFrame)(delta=>{if(!closed&&!signal.aborted){population.draw();story?.draw();effects.tick(delta,isActive());if(audioLayer){audioElapsed+=delta;if(audioElapsed+1e-9>=.1){const fx=effects.snapshot();audioLayer.tick({delta:audioElapsed,onFoot:canPlay(),position:readPlayer(),environment:environment.snapshot(),population:population.snapshot(),covered:fx.covered,eventActive:fx.eventActive});audioElapsed=0}}}})
  const life={audio:()=>audioLayer?.snapshot()??null,effects:()=>effects.snapshot(),activities:()=>activity?.snapshot()??null,snapshot:()=>({population:population.snapshot(),environment:environment.snapshot()}),release:releaseSystems}
  return {...content,life,story,updateFocus(args){const base=content.updateFocus?.(args)??{},person=story?.focus(args.position),exploration=activity?.focus(args.position);if(!base.prompt&&person)return {...base,...person};if(!base.prompt&&exploration?.prompt)return {...base,...exploration};if(exploration?.message&&!base.prompt)base.message=exploration.message;return !base.prompt&&environment.near(args.position)?{...base,prompt:locationId==='complex'?'Toggle ventilation boost':'Toggle route lanterns',message:'E at the environmental control panel.'}:base},interact(args){const base=content.updateFocus?.(args);if(!base?.prompt){const person=story?.interact(args.position);if(person?.accepted)return person;const result=activity?.interact(args.position);if(result?.accepted)return result}if(!base?.prompt&&environment.near(args.position)){const result=environment.interact(args.position);if(result.accepted)audio?.event('interact');return result}const result=content.interact?.(args)??{accepted:false};if(result.accepted)audio?.event('interact');return result},setLighting(mode){content.setLighting?.(mode);environment.setLighting(mode)},release(){releaseSystems();return content.release()}}
 }catch(error){releaseSystems();throw error}
}


