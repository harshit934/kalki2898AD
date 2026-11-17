import assert from 'node:assert/strict'
import { scheduleMaterialWarmup } from '../src/game/shaderWarmup.js'
const frames=new Map(),cancelled=[];let next=0,calls=0,disposed=0;const errors=[]
const request=(fn)=>{frames.set(++next,fn);return next}
const cancel=(id)=>{cancelled.push(id);frames.delete(id)}
const objects={visible:false,dispose(){disposed++}},camera={},scene={}
let resolve;const pending=new Promise(r=>{resolve=r})
const renderer={compileAsync(o,c,s){assert.equal(o,objects);assert.equal(c,camera);assert.equal(s,scene);calls++;return pending}}
const setup=()=>scheduleMaterialWarmup(renderer,objects,camera,scene,{request,cancel,report:e=>errors.push(e)})
// React Strict Mode's initial setup -> cleanup -> setup must compile only the live setup.
const cleanupFirst=setup();cleanupFirst();const cleanupSecond=setup()
assert.equal(frames.size,1);const live=[...frames.values()][0];frames.clear();live()
assert.equal(calls,1);assert.equal(objects.visible,false);cleanupSecond();resolve();await pending;await Promise.resolve()
assert.equal(disposed,0,'borrowed R3F resources must not be disposed by an effect cleanup')
assert.deepEqual(errors,[]);assert.equal(cancelled.length,1)
// Real remount gets its own resources/setup; prior cleanup cannot cancel it.
const cleanupThird=setup();const again=[...frames.values()][0];frames.clear();again();cleanupThird();assert.equal(calls,2)
// Both synchronous and asynchronous shader failures remain visible.
const failure=new Error('synthetic shader failure')
for(const compileAsync of [()=>{throw failure},()=>Promise.reject(failure)]){
 const cleanup=scheduleMaterialWarmup({compileAsync},objects,camera,scene,{request,cancel,report:e=>errors.push(e)});const fn=[...frames.values()][0];frames.clear();fn();await Promise.resolve();await Promise.resolve();cleanup()
}
assert.deepEqual(errors,[failure,failure]);assert.equal(disposed,0)
let ready=false;const cleanupWaiting=scheduleMaterialWarmup(renderer,objects,camera,scene,{request,cancel,ready:()=>ready});let fn=[...frames.values()][0];frames.clear();fn();assert.equal(calls,2);assert.equal(frames.size,1);ready=true;fn=[...frames.values()][0];frames.clear();fn();assert.equal(calls,3);cleanupWaiting();
const beforeWaiting=calls;const stopWaiting=scheduleMaterialWarmup(renderer,objects,camera,scene,{request,cancel,ready:()=>false});let blocked=[...frames.values()][0];frames.clear();blocked();assert.equal(frames.size,1);const stale=[...frames.values()][0];stopWaiting();assert.equal(frames.size,0);stale();assert.equal(calls,beforeWaiting);
console.log('PASS: Strict Mode replay, pending completion after cleanup, remount, resource ownership, and visible shader failures.')
