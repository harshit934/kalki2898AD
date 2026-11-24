import {requireCondition} from '../campaign/contracts.js'

// A single owner drives existing Three rendering and Rapier stepping. No world
// content is created here. Clock and RAF are injectable solely for headless tests.
export function createFrameHost({renderer,scene,camera,world,canvas,signal,onError=()=>{},requestFrame=fn=>requestAnimationFrame(fn),cancelFrame=id=>cancelAnimationFrame(id)}){
 const before=new Set(),after=new Set();let closed=false,running=false,frame=null,epoch=0,last=null,lost=false,elapsed=0
 function pause(){running=false;epoch++;if(frame!==null)cancelFrame(frame);frame=null;last=null}
 function fail(error){pause();onError(error)}
 function check(){requireCondition(!closed&&!signal.aborted,'SESSION_CANCELLED','Frame host released');requireCondition(!lost&&!renderer.getContext().isContextLost(),'RENDERER_UNAVAILABLE','WebGL context unavailable')}
 function resume(){check();if(running)return;running=true;const generation=++epoch;function tick(now){if(!running||closed||signal.aborted||generation!==epoch)return;frame=null;try{check();const delta=Math.min(.05,Math.max(.001,last===null?1/60:(now-last)/1000));last=now;elapsed+=delta*1000;for(const callback of [...before]){callback(delta);if(!running||generation!==epoch)return}world.timestep=delta;world.step();for(const callback of [...after]){callback(delta);if(!running||generation!==epoch)return}renderer.render(scene,camera);if(running&&generation===epoch)frame=requestFrame(tick)}catch(error){fail(error)}}frame=requestFrame(tick)}
 function subscribe(set,callback){check();requireCondition(typeof callback==='function','INVALID_FRAME_HOST','Frame callback required');set.add(callback);let done=false;return()=>{if(done)return;done=true;set.delete(callback)}}
 function contextLost(event){event.preventDefault();lost=true;fail(new Error('WEBGL_CONTEXT_LOST: host requires explicit recovery'))}
 function contextRestored(){lost=false} // Never silently resume combat.
 function release(){if(closed)return;closed=true;pause();before.clear();after.clear();canvas?.removeEventListener('webglcontextlost',contextLost);canvas?.removeEventListener('webglcontextrestored',contextRestored);signal.removeEventListener('abort',release)}
 canvas?.addEventListener('webglcontextlost',contextLost);canvas?.addEventListener('webglcontextrestored',contextRestored);signal.addEventListener('abort',release,{once:true})
 return Object.freeze({resume,pause,release,gameTime:()=>elapsed,subscribeFrame:fn=>subscribe(before,fn),subscribeAfterPhysics:fn=>subscribe(after,fn),status:()=>({running,closed,lost,before:before.size,after:after.size})})
}

export async function createBrowserHost({canvas,signal,onError}){
 requireCondition(canvas?.getContext,'RENDERER_UNAVAILABLE','Mounted canvas required')
 // Lazy: Foundation's catalogue never initializes WebGL or loads WASM/assets.
 const [THREE,{default:rapier}]=await Promise.all([import('three'),import('@dimforge/rapier3d-compat')]);await rapier.init();requireCondition(!signal.aborted,'SESSION_CANCELLED','Host preparation cancelled')
 let renderer,world,frames;try{
  renderer=new THREE.WebGLRenderer({canvas,antialias:false,powerPreference:'high-performance'});requireCondition(!renderer.getContext().isContextLost(),'RENDERER_UNAVAILABLE','Failed WebGL initialization');renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio||1,1));renderer.setSize(Math.max(1,canvas.clientWidth),Math.max(1,canvas.clientHeight),false)
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(42,Math.max(1,canvas.clientWidth)/Math.max(1,canvas.clientHeight),.1,180);camera.position.set(0,3.2,14.7);world=new rapier.World({x:0,y:-19,z:0});frames=createFrameHost({renderer,scene,camera,world,canvas,signal,onError});let closed=false
  const viewport=canvas.ownerDocument?.defaultView,resize=()=>{if(closed)return;const width=Math.max(1,canvas.clientWidth),height=Math.max(1,canvas.clientHeight);renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix()};viewport?.addEventListener('resize',resize)
  return {renderer,scene,camera,world,rapier,...frames,release(){if(closed)return;closed=true;viewport?.removeEventListener('resize',resize);frames.release();try{world.free()}finally{renderer.dispose()}}}
 }catch(error){frames?.release();try{world?.free()}finally{renderer?.dispose()}throw error}
}
