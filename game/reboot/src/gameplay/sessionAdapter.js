import {requireCondition} from '../campaign/contracts.js'
import {createPhysicsAdapter,createSceneAdapter,resolveAttackInput} from './nativeResources.js'
import {belowWorld,watchWorldFall} from '../missions/worldFall.js'

/** Production bridge. Missing host bindings fail closed, never a test fallback.
 * Host mounts the existing visual/animation implementation; bridge owns lifetime.
 * Weapon hits must come from the host's collision/target validation, not UI data.
 */
export function createGameplayAdapter({host,onError=()=>{}}={}){
 const owners=new Map()
 function owned(ctx){const owner=owners.get(ctx.sessionId);requireCondition(owner&&!owner.closed&&!ctx.signal.aborted,'SESSION_CANCELLED','Gameplay session no longer owns resources');return owner}
 function error(owner,kind,cause){owner.errors.push({kind,message:String(cause.message??cause)});onError({sessionId:owner.ctx.sessionId,kind,error:cause})}
 function own(owner,fn){let done=false;const release=async()=>{if(done)return;done=true;try{await fn()}catch(cause){error(owner,'cleanup-failure',cause);throw cause}};owner.cleanups.push(release);return release}
 async function release(ctx){const owner=owners.get(ctx.sessionId);if(!owner)return;owner.closed=true;owner.attackEpoch++;owner.pendingAttack=null;if(owner.releasing)return owner.releasing;owner.releasing=(async()=>{for(const fn of [...owner.cleanups].reverse())try{await fn()}catch{}owners.delete(ctx.sessionId)})();return owner.releasing}
 async function resource(owner,promise,validate){const value=await promise;requireCondition(typeof value?.release==='function','INVALID_RESOURCE','Host resource requires cleanup');const cleanup=own(owner,()=>value.release());if(owner.closed||owner.ctx.signal.aborted){await cleanup();requireCondition(false,'SESSION_CANCELLED','Late host resource released')}try{validate(value)}catch(cause){try{await cleanup()}catch{}throw cause}return {...value,release:cleanup}}
 async function prepare(session,ctx){
  requireCondition(!owners.has(ctx.sessionId),'DUPLICATE_SESSION','Already prepared')
  const owner={ctx,closed:false,cleanups:[],actors:new Map(),ready:false,paused:true,errors:[],nextAttack:0,attackEpoch:0,pendingAttack:null};owners.set(ctx.sessionId,owner);ctx.own(()=>release(ctx))
  try{
   requireCondition(session.id===ctx.sessionId,'SESSION_MISMATCH','Preparation owner mismatch')
   for(const method of ['createPlayer','createEnemy','bindControls','resolvePlayerHit'])requireCondition(typeof host?.[method]==='function','GAMEPLAY_UNAVAILABLE','Missing concrete host binding: '+method)
   owner.scene=createSceneAdapter({scene:host.scene,renderer:host.renderer,sessionId:ctx.sessionId,signal:ctx.signal});own(owner,()=>owner.scene.release());owner.scene.ready()
   owner.physics=createPhysicsAdapter({world:host.world,sessionId:ctx.sessionId,signal:ctx.signal,onError:cause=>error(owner,'physics-cleanup-failure',cause)});own(owner,()=>owner.physics.release());owner.physics.ready()
   owner.player=await resource(owner,host.createPlayer({sessionId:ctx.sessionId,signal:ctx.signal}),player=>requireCondition(player.ready===true&&player.object?.isObject3D&&player.body&&typeof player.setActive==='function','PLAYER_UNAVAILABLE','Player model, physics and activation must be ready'))
   owner.player.isAlive=()=>{const health=(ctx.readPlayerResources?.()??ctx.readSession?.().playerResources)?.health;return health===undefined||health>0};owner.playerController=owner.physics.register({actorId:'player',body:owner.player.body});owner.scene.insert(owner.player.object);own(owner,async()=>{try{owner.scene.remove(owner.player.object);owner.physics.remove('player')}finally{await owner.player.release()}})
   owner.lastGrounded=owner.player.body.translation?{...owner.player.body.translation()}:null
   if(typeof host.subscribeAfterPhysics==='function'&&typeof owner.player.body.translation==='function'&&typeof owner.playerController.computedGrounded==='function'){
    const stop=host.subscribeAfterPhysics(()=>{if(owner.closed||owner.paused||!owner.player.isAlive())return;const p=owner.player.body.translation();if([p.x,p.y,p.z].every(Number.isFinite)&&!belowWorld(p)&&owner.playerController.computedGrounded())owner.lastGrounded={...p}})
    own(owner,stop)
   }
   owner.controls=await resource(owner,host.bindControls({sessionId:ctx.sessionId,signal:ctx.signal,player:owner.player,controller:owner.playerController,combatActions:true,heal:()=>{const o=owned(ctx);return !o.paused&&o.player.isAlive()&&ctx.healPlayer()},readGameplayState:()=>{const state=ctx.readSession?.();return state?{state:state.state,health:state.playerResources?.health,actors:state.actorStates?.map(a=>({actorId:a.actorId,instanceId:a.instanceId,health:a.health,state:a.state}))}:null},attack:async type=>{const o=owned(ctx);return o.player.isAlive()?attack(ctx,type):{hit:false,code:'PLAYER_DEFEATED'}},interact:()=>{const o=owned(ctx);requireCondition(!o.paused&&o.player.isAlive(),'INTERACTION_UNAVAILABLE','Player must be active and alive');requireCondition(typeof host.interact==='function','INTERACTION_UNAVAILABLE','Mission interaction host missing');return host.interact()}}),controls=>requireCondition(controls.ready===true&&typeof controls.pause==='function'&&typeof controls.resume==='function','CONTROLS_UNAVAILABLE','Camera and input must be initialized'))
   if(typeof host.subscribeAfterPhysics==='function'&&typeof ctx.reportPlayerFall==='function'){
    const fall=watchWorldFall({host,signal:ctx.signal,active:()=>!owner.closed&&!owner.paused&&ctx.sessionState()==='active'&&owner.player.isAlive(),player:()=>owner.player,report:position=>{owner.controls.recordDiagnostic?.('player-fell-out-of-world',{position});return ctx.reportPlayerFall(position)}})
    own(owner,()=>fall.release())
   }
   owned(ctx);await owner.player.setActive(true);await owner.controls.activate?.();owned(ctx);owner.paused=false;owner.ready=true;return {ready:true}
  }catch(cause){error(owner,'preparation-failure',cause);await release(ctx);throw cause}
 }
 async function attack(ctx,type){
  const o=owned(ctx);requireCondition(!o.paused,'GAMEPLAY_PAUSED','Controls suspended');requireCondition(o.player.isAlive(),'PLAYER_DEFEATED','Defeated player cannot attack');requireCondition(['light','heavy'].includes(type),'INVALID_ATTACK','Unknown attack')
  const stance=o.controls.combatState?.(),now=host.gameTime?.()??performance.now()
  if(stance?.guarding||stance?.dodging||o.pendingAttack)return {hit:false}
  if(!resolveAttackInput(null,type,now,o.nextAttack,true).attack)return {hit:false}
  // Existing production attack durations and cooldowns; no unapproved clip or
  // contact metadata. One physics query per swing, including misses.
  const weapon=host.readWeapon?.(),damage=weapon?.[type]??(type==='heavy'?48:24);requireCondition(Number.isFinite(damage)&&damage>0&&damage<=1000,'INVALID_WEAPON_DAMAGE','Bounded equipped weapon damage required')
  const swing={epoch:o.attackEpoch,expires:now+(type==='heavy'?720:420)}
  o.nextAttack=now+(type==='heavy'?900:420);o.pendingAttack=swing
  try{
   o.controls.recordDiagnostic?.('combat-attack',{type,epoch:o.attackEpoch});o.player.notifyAttack?.(type)
   const candidates=[...o.actors.values()].filter(a=>a.canTakeDamage?.()!==false)
   const hit=await host.resolvePlayerHit({sessionId:ctx.sessionId,signal:ctx.signal,player:o.player,type,actors:candidates.map(a=>({actorId:a.token.actorId,instanceId:a.token.instanceId,sessionId:a.token.sessionId,object:a.object,body:a.body,collider:a.collider}))})
   owned(ctx);if(o.paused||swing.epoch!==o.attackEpoch){o.controls.recordDiagnostic?.('stale-hit-rejected',{epoch:swing.epoch,currentEpoch:o.attackEpoch});return {hit:false}}
   const current=o.controls.combatState?.(),time=host.gameTime?.()??performance.now()
   if(swing.epoch!==o.attackEpoch||time>=swing.expires||!o.player.isAlive()||current?.guarding||current?.dodging||!hit)return {hit:false}
   const actor=o.actors.get(hit.actorId)
   requireCondition(actor&&candidates.includes(actor)&&hit.confirmed===true&&(!hit.instanceId||hit.instanceId===actor.token.instanceId)&&(!hit.sessionId||hit.sessionId===ctx.sessionId),'INVALID_HIT','Hit must identify an owned registered target from this swing')
   if(actor.canTakeDamage?.()===false)return {hit:false}
   o.controls.recordDiagnostic?.('combat-hit',{actorId:actor.token.actorId,amount:damage});await ctx.damageEnemy({...actor.token,eventId:globalThis.crypto.randomUUID(),source:'combat',amount:damage})
   return {hit:true}
  }finally{if(o.pendingAttack===swing)o.pendingAttack=null}
 }
 async function deploy(plan){const o=owners.get(plan.sessionId);requireCondition(o&&!o.closed&&!o.paused&&!plan.signal.aborted,'SESSION_CANCELLED','No active gameplay owner');const disposers=[];try{for(const descriptor of plan.actors){const enemy=await resource(o,host.createEnemy({sessionId:plan.sessionId,signal:plan.signal,descriptor,encounterId:plan.encounterId}),a=>requireCondition(a.ready===true&&a.object?.isObject3D&&a.body&&Number.isFinite(a.maxHealth)&&a.maxHealth>0&&typeof a.setActive==='function','ENEMY_UNAVAILABLE','Enemy model, physics and health must be ready'));owned(o.ctx);requireCondition(!o.paused,'GAMEPLAY_PAUSED','Deployment suspended');const id=descriptor.id;requireCondition(!o.actors.has(id),'DUPLICATE_ACTOR','Actor already mounted');const cleanup=own(o,async()=>{const savedActor=o.actors.get(id);o.actors.delete(id);try{let defeated=false;try{defeated=Boolean(savedActor&&o.ctx.readActor?.({sessionId:plan.sessionId,actorId:id,encounterId:plan.encounterId,instanceId:savedActor?.token.instanceId})?.health===0)}catch{}if(defeated)enemy.onDefeat?.();o.scene.remove(enemy.object);o.physics.remove(id)}finally{await enemy.release()}});disposers.push(cleanup);const controller=o.physics.register({actorId:id,encounterId:plan.encounterId,body:enemy.body});o.scene.insert(enemy.object);const actor=plan.createActor({actorId:id,maxHealth:enemy.maxHealth,release:cleanup});const token=Object.freeze(actor.register());o.actors.set(id,{token,object:enemy.object,body:enemy.body,collider:enemy.collider,setActive:enemy.setActive,canTakeDamage:enemy.canTakeDamage});enemy.bindCombat?.({controller,token,readHealth:()=>o.ctx.readActor(token).health,isActive:()=>o.ctx.readActor(token).state==='active-combat',onPlayerHit(receipt){owned(o.ctx);requireCondition(!o.paused,'GAMEPLAY_PAUSED','Attack belongs to suspended AI');requireCondition(receipt?.sessionId===token.sessionId&&receipt?.instanceId===token.instanceId&&receipt?.actorId===token.actorId&&receipt?.encounterId===token.encounterId&&enemy.verifyHit?.(receipt),'UNCONFIRMED_HIT','Native physics-backed attack receipt required');const stance=o.controls.combatState?.();if(stance?.dodging){o.controls.recordDiagnostic?.('damage-dodged',{actorId:token.actorId});return false}o.controls.recordDiagnostic?.('player-damage',{actorId:token.actorId,eventId:receipt.eventId,amount:receipt.amount*(stance?.guarding?.3:1)});return o.ctx.damagePlayer({...receipt,source:'combat',amount:receipt.amount*(stance?.guarding?.3:1)})}});await enemy.setActive(true);owned(o.ctx);if(o.paused){await enemy.setActive(false);requireCondition(false,'GAMEPLAY_PAUSED','Deployment suspended')}}return {actorIds:plan.actors.map(a=>a.id),release:async()=>{for(const fn of disposers)await fn()}}}catch(cause){error(o,'deployment-failure',cause);for(const fn of disposers.reverse())await fn();throw cause}}
 async function control(ctx,paused){const o=owned(ctx);o.paused=true;o.attackEpoch++;o.pendingAttack=null;try{if(paused)await o.controls.pause();for(const actor of [o.player,...o.actors.values()])await actor.setActive(!paused);if(!paused)await o.controls.resume();owned(ctx);o.paused=paused;return paused?{paused:true}:{resumed:true}}catch(cause){error(o,'control-failure',cause);throw cause}}
 return Object.freeze({prepare,release,playerResource:ctx=>owned(ctx).player,captureResources:ctx=>owned(ctx).ctx.readSession().playerResources,captureRevivePosition(ctx){const o=owned(ctx),p=o.player.body.translation();return {...(belowWorld(p)?o.lastGrounded:p)}},pause:ctx=>control(ctx,true),resume:ctx=>control(ctx,false),encounters:{deploy},status:sessionId=>{const o=owners.get(sessionId);return o?{sessionId,ready:o.ready&&!o.closed,paused:o.paused,errors:[...o.errors]}:{sessionId,ready:false,state:'unavailable'}}})
}
