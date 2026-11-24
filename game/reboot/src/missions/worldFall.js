import {requireCondition} from '../campaign/contracts.js'

// Kashi's lowest authored walking surface is above -0.5m. This plane is well
// below steps and normal jumps; it is not an invisible replacement floor.
export const PLAYER_VOID_Y=-12
export function belowWorld(position){
 return position&&[position.x,position.y,position.z].every(Number.isFinite)&&position.y<PLAYER_VOID_Y
}

export function watchWorldFall({host,signal,active,player,report}){
 requireCondition(typeof host.subscribeAfterPhysics==='function'&&typeof report==='function','FALL_GUARD_UNAVAILABLE','Owned physics observation and defeat reporter required')
 let closed=false,reported=false
 const stop=host.subscribeAfterPhysics(()=>{
  if(closed||reported||signal.aborted||!active())return
  const actor=player(),position=actor.body.translation()
  if(!belowWorld(position))return
  if(report({...position})!==false)reported=true
 })
 function release(){if(closed)return;closed=true;stop();signal.removeEventListener('abort',release)}
 signal.addEventListener('abort',release,{once:true})
 return {release}
}
