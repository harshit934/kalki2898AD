import {requireCondition} from '../campaign/contracts.js'

// Persistent ownership used by Foundation; mission leases never own teardown.
// Factories must register partial allocations with own() before awaiting again.
export function createWorldOwner({createHost,prepareWorld,onError=()=>{}}){
 requireCondition(typeof createHost==='function','INVALID_WORLD_FACTORY','A concrete host factory is required')
 const lifetime=new AbortController(),resources=[],errors=[]
 let state='idle',host=null,initialization=null,shutdownPromise=null,mission=null,sequence=0
 const pauses=new Set(['owner'])
 function record(kind,error){const entry={kind,message:String(error?.message??error)};errors.push(entry);try{onError({...entry})}catch{/* Diagnostics must not interrupt cleanup. */}}
 function ledger(list,release,key=release){
  requireCondition(typeof release==='function','INVALID_RESOURCE','Cleanup function required')
  const existing=list.find(item=>item.original===key);if(existing)return existing.release
  let promise;const item={original:key,release:()=>promise??(promise=Promise.resolve().then(release))};list.push(item);return item.release
 }
 async function drain(list){for(const item of [...list].reverse())try{await item.release()}catch(error){record('cleanup-failure',error)}list.length=0}
 function healthy(){requireCondition(state==='ready','WORLD_NOT_READY','World is not ready')}
 function fault(error){
  if(['releasing','released'].includes(state))return
  record('host-failure',error);state='failed';try{host?.pause()}catch(cause){record('pause-failure',cause)}
 }
 function initialize({canvas,signal}={}){
  requireCondition(state==='idle','WORLD_ALREADY_INITIALIZED','Initialize exactly once; create a new owner after failure')
  state='preparing'
  const cancel=()=>{lifetime.abort();if(state==='preparing')state='failed'}
  signal?.addEventListener('abort',cancel,{once:true});if(signal?.aborted)cancel()
  initialization=Promise.resolve().then(async()=>{
   try{
    requireCondition(!lifetime.signal.aborted,'WORLD_CANCELLED','Initialization cancelled')
    const value=await createHost({canvas,signal:lifetime.signal,onError:fault,own(release){
     requireCondition(state==='preparing'&&!lifetime.signal.aborted,'WORLD_CANCELLED','Initialization no longer owns resources');return ledger(resources,release)
    }})
    requireCondition(typeof value?.release==='function','INVALID_WORLD_HOST','Host must provide cleanup')
    ledger(resources,()=>value.release(),value.release);host=value
    requireCondition(!lifetime.signal.aborted&&state==='preparing','WORLD_CANCELLED','Late host cannot become ready')
    for(const key of ['pause','resume','subscribeFrame','subscribeAfterPhysics'])requireCondition(typeof host[key]==='function','INVALID_WORLD_HOST','Host binding missing: '+key)
    host.pause()
    if(prepareWorld){const content=await prepareWorld({host,signal:lifetime.signal});requireCondition(typeof content?.release==='function','INVALID_WORLD_CONTENT','World content cleanup required');ledger(resources,()=>content.release());requireCondition(!lifetime.signal.aborted&&state==='preparing','WORLD_CANCELLED','Late world content released');requireCondition(content.ready===true,'WORLD_CONTENT_UNAVAILABLE','World content must be ready')}
    state='ready';return snapshot()
   }catch(error){if(state!=='releasing')state='failed';record('initialization-failure',error);await drain(resources);host=null;throw error}
   finally{signal?.removeEventListener('abort',cancel)}
  })
  return initialization
 }
 function acquireMission({sessionId,signal,kind='mission'}={}){
  healthy();requireCondition(typeof sessionId==='string'&&sessionId.length&&!signal?.aborted,'INVALID_WORLD_SESSION','Live session identity required')
  requireCondition(!mission,'WORLD_SESSION_BUSY','Release the existing mission before acquiring another')
  const owner={id:sessionId,kind,token:++sequence,closed:false,resources:[],releasePromise:null};mission=owner
  const live=()=>{healthy();requireCondition(mission===owner&&!owner.closed&&!signal?.aborted,'STALE_WORLD_SESSION','Mission lease has ended')}
  function release(){
   if(owner.releasePromise)return owner.releasePromise
   owner.closed=true;pauses.add('owner');signal?.removeEventListener('abort',abort)
   owner.releasePromise=Promise.resolve().then(async()=>{
    try{host?.pause()}catch(error){record('pause-failure',error);if(state==='ready')state='failed'}
    const count=errors.length;await drain(owner.resources)
    if(errors.length>count&&state==='ready')state='failed'
    if(mission===owner)mission=null
    return snapshot()
   });return owner.releasePromise
  }
  function abort(){void release()}
  signal?.addEventListener('abort',abort,{once:true})
  const guard=callback=>{live();requireCondition(typeof callback==='function','INVALID_CALLBACK','Callback required');return (...args)=>{if(state!=='ready'||mission!==owner||owner.closed||signal?.aborted)return;return callback(...args)}}
  function subscribe(method,callback){live();const stop=host[method](guard(callback));requireCondition(typeof stop==='function','INVALID_WORLD_HOST','Subscription cleanup required');return ledger(owner.resources,stop)}
  return Object.freeze({sessionId,token:owner.token,guard,release,
   hostBindings(){
    live()
    // Native handles are borrowed by trusted factories, never owned by them.
    return {scene:host.scene,world:host.world,rapier:host.rapier,renderer:host.renderer,camera:host.camera,
     gameTime:guard(()=>host.gameTime?.()),status:guard(()=>host.status?.()),
     pause(){live();return suspend('owner')},resume(){live();return resume('owner')},
     subscribeFrame:fn=>subscribe('subscribeFrame',fn),subscribeAfterPhysics:fn=>subscribe('subscribeAfterPhysics',fn)}
   },
   own(fn){live();return ledger(owner.resources,fn)},
   subscribeFrame:fn=>subscribe('subscribeFrame',fn),subscribeAfterPhysics:fn=>subscribe('subscribeAfterPhysics',fn),
   reportError:guard(fault)
  })
 }
 function suspend(reason){
  healthy();requireCondition(typeof reason==='string'&&reason.length,'INVALID_PAUSE_REASON','Pause reason required')
  if(pauses.has(reason))return snapshot()
  try{host.pause()}catch(error){record('pause-failure',error);throw error}pauses.add(reason);return snapshot()
 }
 function resume(reason){
  healthy();requireCondition(typeof reason==='string'&&reason.length,'INVALID_PAUSE_REASON','Pause reason required')
  if(!pauses.has(reason))return snapshot()
  if(pauses.size===1){requireCondition(mission&&!mission.closed,'WORLD_SESSION_REQUIRED','Resume requires a live mission');try{host.resume()}catch(error){record('resume-failure',error);throw error}}
  pauses.delete(reason);return snapshot()
 }
 function shutdown(){
  if(shutdownPromise)return shutdownPromise
  state='releasing';lifetime.abort()
  shutdownPromise=Promise.resolve().then(async()=>{
   try{await initialization}catch{/* Original error is already recorded. */}
   if(mission)await mission.leaseRelease()
   await drain(resources);host=null;pauses.clear();state='released';return snapshot()
  });return shutdownPromise
 }
 function snapshot(){return Object.freeze({state,ready:state==='ready',suspended:pauses.size>0, pauseReasons:Object.freeze([...pauses]),sessionId:mission?.kind==='mission'?mission.id:null,ownerId:mission?.id??null,ownerKind:mission?.kind??null,worldResources:resources.length,missionResources:mission?.resources.length??0,errors:Object.freeze(errors.map(e=>Object.freeze({...e})))})}
 // Keep shutdown access private; leases never receive raw host teardown methods.
 const acquire=options=>{const lease=acquireMission(options);mission.leaseRelease=lease.release;return lease}
 return Object.freeze({initialize,acquireMission:options=>acquire({...options,kind:'mission'}),acquireExploration:({ownerId,signal})=>acquire({sessionId:ownerId,signal,kind:'exploration'}),suspend,resume,shutdown,snapshot})
}
