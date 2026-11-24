import {BufferGeometry,Float32BufferAttribute,Matrix3,Vector3} from 'three'

export function terrainGeometry(bounds,nx,nz,height,exclude){
 const positions=[],uv=[],indices=[]
 for(let j=0;j<=nz;j++)for(let i=0;i<=nx;i++){const x=bounds.minX+(bounds.maxX-bounds.minX)*i/nx,z=bounds.minZ+(bounds.maxZ-bounds.minZ)*j/nz;positions.push(x,height(x,z),z);uv.push(x*.08,z*.08)}
 for(let j=0;j<nz;j++)for(let i=0;i<nx;i++){const a=j*(nx+1)+i,b=a+1,c=a+nx+1,d=c+1;if(exclude&&positions[b*3]>exclude.minX&&positions[a*3]<exclude.maxX&&positions[c*3+2]>exclude.minZ&&positions[a*3+2]<exclude.maxZ)continue;indices.push(a,c,b,b,c,d)}
 const geometry=new BufferGeometry();geometry.setAttribute('position',new Float32BufferAttribute(positions,3));geometry.setAttribute('uv',new Float32BufferAttribute(uv,2));geometry.setIndex(indices);geometry.computeVertexNormals();return geometry
}

// A spatially isolated, source-authored cedar in shambhala.glb. No original asset
// is rewritten. Compact remapping keeps only that tree's attributes/triangles.
export function extractCedar(scene){
 const parts=[];scene.updateMatrixWorld(true)
 scene.traverse(mesh=>{if(!mesh.isMesh)return;const input=mesh.geometry,p=input.getAttribute('position'),index=input.index,triangles=[],points=new Map(),v=new Vector3()
  function included(i){if(!points.has(i)){v.fromBufferAttribute(p,i).applyMatrix4(mesh.matrixWorld);points.set(i,v.clone())}const q=points.get(i);return q.x>=-13.3&&q.x<=-4.7&&q.z>=-10.3&&q.z<=-1.7&&q.y>=-.005}
  for(let i=0,n=index?.count??p.count;i<n;i+=3){const a=index?index.getX(i):i,b=index?index.getX(i+1):i+1,c=index?index.getX(i+2):i+2;if(included(a)&&included(b)&&included(c))triangles.push(a,b,c)}
  if(!triangles.length)return
  const remap=new Map(),old=[],next=triangles.map(i=>{if(!remap.has(i)){remap.set(i,old.length);old.push(i)}return remap.get(i)}),g=new BufferGeometry(),normalMatrix=new Matrix3().getNormalMatrix(mesh.matrixWorld)
  for(const [name,attribute]of Object.entries(input.attributes)){const values=[];for(const i of old){if(name==='position'){const q=points.get(i);values.push(q.x+9,q.y,q.z+6)}else if(name==='normal'){v.fromBufferAttribute(attribute,i).applyMatrix3(normalMatrix).normalize();values.push(v.x,v.y,v.z)}else for(let k=0;k<attribute.itemSize;k++)values.push(attribute.getComponent(i,k))}g.setAttribute(name,new Float32BufferAttribute(values,attribute.itemSize))}
  g.setIndex(next);if(!g.getAttribute('normal'))g.computeVertexNormals();g.computeBoundingSphere();parts.push({geometry:g,material:mesh.material})
 });return parts
}
