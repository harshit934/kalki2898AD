import assert from 'node:assert/strict'
import {performance} from 'node:perf_hooks'
import {withWorldSystems} from '../src/world/worldSystems.js'
import {createWorldAudio} from '../src/audio/worldAudio.js'
import {prepareKashiCity} from '../src/world/kashiDistrict.js'
import {prepareShambalaComplete} from '../src/world/locations/shambalaEnvironment.js'
import {prepareComplexComplete} from '../src/world/locations/complexEnvironment.js'
import {worldFixture,walker} from './world6-native-fixture.js'
import {AudioContextRecorder} from './world-audio-fixture.js'
export const audioPreparations={kashi:prepareKashiCity,shambala:prepareShambalaComplete,complex:prepareComplexComplete}
export const audioRoutes={kashi:[[162,168],[162,196],[162,294],[162,334],[194,334],[194,430],[194,334],[162,334],[162,65]],shambala:[[0,12],[16,12],[32,12],[49,12],[76,12],[76,44],[76,84],[116,84],[116,128],[116,84],[76,84],[76,12],[49,12],[32,12],[16,12],[0,12],[0,18]],complex:[[0,15.5],[30,15.5],[42,15.5],[178,15.5],[210,12],[210,-100],[210,12],[178,12],[42,12],[30,15.5],[0,15.5],[0,13]]}
export async function traverseAudioWorld(world,extra={}){const f=await worldFixture(world,audioPreparations[world]),context=new AudioContextRecorder(),audio=createWorldAudio({contextFactory:()=>context}),start=performance.now();let w;const content=withWorldSystems(f.content,{host:f.host,signal:f.abort.signal,locationId:world,readPlayer:()=>w?.body.translation()??null,audio,...extra});await audio.unlock();f.beforePhysics=dt=>{for(const fn of f.before)fn(dt)};f.afterPhysics=dt=>{for(const fn of f.after)fn(dt);context.advance(dt)};w=walker(f);const trace=[];try{for(const [x,z]of audioRoutes[world])trace.push(w.walk(x,z));assert.equal(audio.snapshot().world,world);assert.equal(audio.snapshot().loops,7);assert.ok(context.sources.size<=13);const result={trace,...w.stats(),cpuMs:performance.now()-start,rssMiB:process.memoryUsage().rss/1048576,audio:audio.diagnostics(),loadMs:f.loadMs};w.release();w=null;content.release();assert.equal(f.frames.size,0);assert.equal(f.world.bodies.len(),0);assert.equal(context.sources.size,0);await audio.release();assert.equal(context.activeConnections(),0);return result}finally{w?.release();content.release();await audio.release();f.release()}}
