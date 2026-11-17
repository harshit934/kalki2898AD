import{BufferGeometry,Uint32BufferAttribute}from'three'
const prepared=new WeakMap()
export function crowdLods(geometry){return prepared.get(geometry)}
export async function prepareCrowdLods(asset,role,normalizationScale){
 const path='/environment/phase54e-correction/crowd-'+role+'-lod'
 const responses=await Promise.all([fetch(path+'.json'),fetch(path+'.bin')]);if(responses.some(r=>!r.ok))throw new Error('Civilian detail levels could not load')
 const [manifest,buffer]=await Promise.all([responses[0].json(),responses[1].arrayBuffer()]);const meshes=[];asset.scene.traverse(o=>{if(o.isSkinnedMesh)meshes.push(o)})
 if(meshes.length!==manifest.parts.length)throw new Error('Civilian detail-level manifest mismatch')
 asset.scene.updateMatrixWorld(true)
 for(let i=0;i<meshes.length;i++){const mesh=meshes[i],full=mesh.geometry,p=manifest.parts[i];if(full.attributes.position.count!==p.vertices||full.index.count!==p.originalIndices)throw new Error('Civilian source geometry differs from its verified LOD')
  const scale=mesh.getWorldScale(mesh.position.clone()).toArray(),worldScale=Math.max(...scale.map(Math.abs))*normalizationScale
  const levels=p.levels.map((level,n)=>{const g=new BufferGeometry();for(const[name,attribute]of Object.entries(full.attributes))g.setAttribute(name,attribute);g.setIndex(new Uint32BufferAttribute(new Uint32Array(buffer,level.offset,level.indices),1));g.boundingBox=full.boundingBox?.clone()??null;g.boundingSphere=full.boundingSphere?.clone()??null;g.name='crowd-lod-'+(n+1);return{geometry:g,worldError:level.errorLocal*worldScale,originalVerticesPreserved:true}})
  prepared.set(full,levels)
 }
 return {sourceSHA256:manifest.sourceSHA256,parts:manifest.parts.length,alphaLayersUnchanged:true}
}
