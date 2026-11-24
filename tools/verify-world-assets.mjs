import {readFileSync,readdirSync,existsSync} from 'node:fs'
import {resolve,dirname,extname} from 'node:path'
import assert from 'node:assert/strict'
import {createHash} from 'node:crypto'

function files(root){return readdirSync(root,{withFileTypes:true}).filter(e=>e.name!=='tests').flatMap(e=>e.isDirectory()?files(resolve(root,e.name)):[resolve(root,e.name)])}
let references=0,models=0
const referenced=new Set()
for(const file of files('game').filter(p=>['.js','.jsx'].includes(extname(p)))){
 const source=readFileSync(file,'utf8')
 assert.ok(!/['"]\/(?:environment|models)\/[^'"]+['"]/.test(source),`Unbundled root asset URL: ${file}`)
 for(const match of source.matchAll(/new\s+URL\(\s*['"]([^'"]+)['"]\s*,\s*import\.meta\.url/g)){
  if(!match[1].startsWith('.'))continue
  const asset=resolve(dirname(file),match[1])
  assert.ok(existsSync(asset),`Missing imported asset: ${asset}`)
  references++;referenced.add(asset)
 }
}
for(const asset of referenced){
 if(extname(asset)!=='.glb')continue
 const bytes=readFileSync(asset)
 assert.equal(bytes.toString('ascii',0,4),'glTF',`Invalid GLB signature: ${asset}`)
 assert.equal(bytes.readUInt32LE(4),2,`Unsupported GLB version: ${asset}`)
 assert.equal(bytes.readUInt32LE(8),bytes.length,`Truncated GLB: ${asset}`)
 models++
}
for(const world of ['complex','shambala']){
 const source=readFileSync(`game/reboot/src/world/locations/${world}Environment.js`,'utf8')
 assert.ok(source.includes('new URL('),`${world} must use bundled asset URLs`)
 assert.ok(source.includes("import.meta.env.BASE_URL+'environment/kashi/draco/'"),`${world} decoder must respect deployment base`)
}
const baseline=JSON.parse(readFileSync('tools/menu-baseline.json','utf8'))
for(const [name,expected] of Object.entries(baseline.hashes))assert.equal(createHash('sha256').update(readFileSync('game/reboot/src/ui/'+name)).digest('hex'),expected,`Protected menu changed: ${name}`)
console.log(`World asset checks passed: ${references} relative references, ${models} valid GLB models; no unbundled root asset URLs.`)
