import assert from 'node:assert/strict'
import { Timer } from 'three'
import R from '@dimforge/rapier3d-compat'
const timer=new Timer();const compatible=['start','stop','getElapsedTime'].map(name=>({name,present:typeof timer[name]==='function'}));assert.ok(compatible.every(x=>!x.present),'Recheck Fiber compatibility if Timer API changes');timer.update();assert.ok(Number.isFinite(timer.getDelta()));timer.dispose()
await R.init();const world=new R.World({x:0,y:-9.81,z:0});const body=world.createRigidBody(R.RigidBodyDesc.dynamic().setTranslation(0,3,0));world.createCollider(R.ColliderDesc.ball(.2),body);world.step();assert.ok(body.translation().y<3);world.free();console.log(JSON.stringify({timerIsDropInForFiber:false,missingClockMethods:compatible,rapierInitAndStepPassed:true,dependenciesModified:false}))
