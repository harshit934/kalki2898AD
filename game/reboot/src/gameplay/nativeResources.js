import {requireCondition} from '../campaign/contracts.js'
export {movementWithPendingTarget} from '../../../src/game/player/kinematicMovement.js'
export {resolveAttackInput} from '../../../src/game/player/combatTiming.js'

// Wrap initialized host resources; never create a second world or renderer.
export function createSceneAdapter({scene,renderer,sessionId,signal}){
 const objects=new Set();let closed=false
 const live=()=>requireCondition(!closed&&!signal.aborted,'SESSION_CANCELLED','Scene owner released')
 function ready(){live();requireCondition(scene?.isScene&&renderer?.isWebGLRenderer&&renderer.getContext()&&!renderer.getContext().isContextLost(),'RENDERER_UNAVAILABLE','An initialized, operational Three.js renderer is required');return true}
 return Object.freeze({sessionId,ready,insert(object){ready();requireCondition(object?.isObject3D&&!object.parent&&!objects.has(object),'INVALID_SCENE_ACTOR','Object must be unparented and uniquely owned');scene.add(object);objects.add(object)},remove(object){if(objects.delete(object))scene.remove(object)},release(){if(closed)return;closed=true;for(const object of objects)scene.remove(object);objects.clear()}})
}

export function createPhysicsAdapter({world,sessionId,signal,onError=()=>{}}){
 const actors=new Map();let closed=false
 const live=()=>requireCondition(!closed&&!signal.aborted,'SESSION_CANCELLED','Physics owner released')
 function ready(){live();requireCondition(world&&typeof world.createCharacterController==='function'&&typeof world.removeCharacterController==='function'&&typeof world.getRigidBody==='function','PHYSICS_UNAVAILABLE','Initialized Rapier world required');return true}
 function remove(id){const actor=actors.get(id);if(!actor)return;actors.delete(id);try{world.removeCharacterController(actor.controller)}catch(error){onError(error);throw error}}
 return Object.freeze({sessionId,ready,register({actorId,encounterId=null,body}){ready();requireCondition(typeof actorId==='string'&&!actors.has(actorId)&&body&&world.getRigidBody(body.handle)===body,'INVALID_PHYSICS_ACTOR','Body must belong to this world and unique actor');let controller;try{controller=world.createCharacterController(.03);controller.enableAutostep(.3,.2,false);controller.enableSnapToGround(.3);actors.set(actorId,{controller,body,encounterId});return controller}catch(error){if(controller)try{world.removeCharacterController(controller)}catch(cleanupError){onError(cleanupError)}throw error}},remove,release(){if(closed)return;closed=true;const errors=[];for(const id of [...actors.keys()])try{remove(id)}catch(error){errors.push(error)}if(errors.length)throw new AggregateError(errors,'Physics cleanup failed')},snapshot(){return [...actors].map(([actorId,a])=>({sessionId,actorId,encounterId:a.encounterId}))}})
}
