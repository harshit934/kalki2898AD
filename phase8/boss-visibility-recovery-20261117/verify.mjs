import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { Group } from 'three'
import { resetBossPresentation } from './staging/src/game/bossPresentation.js'
const base=path.dirname(fileURLToPath(import.meta.url)),results=[]
function test(name,fn){fn();results.push({name,status:'PASS'})}
const model=new Group();model.position.set(0,-1.8,0);model.rotation.set(1.25,2,0);model.scale.setScalar(.5)
test('Reproduce old reset: changing parent world position leaves sunk and tilted visual',()=>{const physicsParent=new Group();physicsParent.add(model);physicsParent.position.set(0,-.22,-69);assert.equal(model.position.y,-1.8);assert.equal(model.rotation.x,1.25)})
test('New round restores local height, tilt and scale',()=>{resetBossPresentation(model);assert.equal(model.position.y,0);assert.equal(model.rotation.x,0);assert.deepEqual(model.scale.toArray(),[1,1,1])})
test('Facing and physics parent position are preserved',()=>{assert.equal(model.rotation.y,2);assert.deepEqual(model.parent.position.toArray(),[0,-.22,-69])})
test('Repeated resets and missing model are safe',()=>{resetBossPresentation(null);resetBossPresentation(model);assert.equal(model.position.y,0)})
test('Reset is wired to the existing round-change branch',()=>assert.match(fs.readFileSync(base+'/staging/src/game/BossEncounter.jsx','utf8'),/if \(lastRoundId.current !== roundId\) \{\s+resetBossPresentation\(modelRef.current\)/))
const digest=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'),hashes=[]
function scan(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())scan(p);else{const rel=path.relative(base+'/rollback',p);hashes.push({path:rel,before:digest(p),after:digest(path.resolve(base,'../..',rel))})}}}scan(base+'/rollback')
test('Production source/configuration match untouched rollback',()=>assert.ok(hashes.every(r=>r.before===r.after)))
fs.writeFileSync(base+'/test-results.json',JSON.stringify({results,hashes,browser:'NOT RUN; visual acceptance pending'},null,2))
console.log(JSON.stringify({passed:results.length,failed:0,protectedHashes:hashes.length,differences:hashes.filter(r=>r.before!==r.after).length}))
