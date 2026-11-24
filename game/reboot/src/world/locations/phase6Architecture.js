import {Group,BoxGeometry,CylinderGeometry,SphereGeometry,IcosahedronGeometry,MeshStandardMaterial,InstancedMesh,Matrix4,Quaternion,Vector3} from 'three'

// Static extension owned by its existing environment. No new world or frame loop.
export function createWorldArchitecture({host,root,body,id,palette}){
 const group=new Group();group.name=id;root.add(group)
 const batches=new Map(),geometries=new Map(),materials=new Map(),surfaces=[],solids=[];let closed=false
 const part=(shape,mat,at,size,solid=false)=>{
  const key=shape+':'+mat;if(!batches.has(key))batches.set(key,{shape,mat,parts:[]});batches.get(key).parts.push({at,size})
  if(solid){solids.push({at,size});host.world.createCollider(host.rapier.ColliderDesc.cuboid(...size.map(v=>v/2)).setTranslation(...at),body)}
 }
 const box=(mat,at,size,solid=false)=>part('box',mat,at,size,solid)
 const floor=(x,z,w,d,y)=>{box('stone',[x,y-.3,z],[w,.6,d],true);surfaces.push({x,z,w,d,y})}
 function stair({axis='x',start,end,fixed,width,from,to,steps}){
  const run=(end-start)/steps
  for(let i=0;i<steps;i++){
   const along=start+(i+.5)*run,y=from+(to-from)*(i+1)/steps,at=axis==='x'?[along,y-.25,fixed]:[fixed,y-.25,along],size=axis==='x'?[Math.abs(run)+.02,.5,width]:[width,.5,Math.abs(run)+.02]
   box('light',at,size,true)
   for(const side of [-1,1])box('trim',axis==='x'?[along,y+1.1,fixed+side*(width/2-.1)]:[fixed+side*(width/2-.1),y+1.1,along],axis==='x'?[Math.abs(run)+.02,2.2,.18]:[.18,2.2,Math.abs(run)+.02],true)
  }
 }
 const rail=(axis,fixed,a,b,y)=>box('trim',axis==='x'?[(a+b)/2,y+1.1,fixed]:[fixed,y+1.1,(a+b)/2],axis==='x'?[b-a,2.2,.2]:[.2,2.2,b-a],true)
 function block({x,z,w,d,h,y=0,mat='stone',style='tiered'}){
  box(mat,[x,y+h/2,z],[w,h,d],true)
  for(let level=3;level<h;level+=4){box('trim',[x,y+level+.8,z-d/2-.1],[w+.3,.16,.4]);for(const dx of [-.3,0,.3])box('glass',[x+dx*w,y+level,z-d/2-.05],[w*.2,1.2,.1])}
  for(let i=0;i<3;i++)box(i%2?'trim':'light',[x,y+h+i*1.4,z],[w*(1-i*.17),1.2,d*(1-i*.17)],true)
  if(style==='dome')part('dome','trim',[x,y+h+3,z],[w*.25,3,d*.25])
  else box('glow',[x,y+h+3.7,z],[w*.4,.16,d*.4])
  box('dark',[x,y+1.5,z-d/2-.06],[2.4,3,.12])
 }
 const finish=()=>{
  for(const [key,batch]of batches){
   if(!geometries.has(batch.shape))geometries.set(batch.shape,batch.shape==='box'?new BoxGeometry(1,1,1):batch.shape==='cylinder'?new CylinderGeometry(.5,.5,1,16):batch.shape==='rock'?new IcosahedronGeometry(1,1):new SphereGeometry(1,16,8,0,Math.PI*2,0,Math.PI/2))
   if(!materials.has(batch.mat)){const color=palette[batch.mat];materials.set(batch.mat,new MeshStandardMaterial({color,roughness:batch.mat==='trim'?.42:.82,metalness:batch.mat==='trim'?.65:.15,...(batch.mat==='glow'?{emissive:color,emissiveIntensity:.7}:{}),...(batch.mat==='glass'?{transparent:true,opacity:.5}:{})}))}
   const mesh=new InstancedMesh(geometries.get(batch.shape),materials.get(batch.mat),batch.parts.length),matrix=new Matrix4();mesh.name=id+'/'+key
   batch.parts.forEach((p,i)=>{matrix.compose(new Vector3(...p.at),new Quaternion(),new Vector3(...p.size));mesh.setMatrixAt(i,matrix)});mesh.computeBoundingSphere();mesh.receiveShadow=true;group.add(mesh)
  }
  return {batches:batches.size,instances:[...batches.values()].reduce((n,b)=>n+b.parts.length,0),colliders:solids.length,surfaces}
 }
 function release(){if(closed)return;closed=true;group.removeFromParent();group.traverse(o=>o.isInstancedMesh&&o.dispose());for(const g of geometries.values())g.dispose();for(const m of materials.values())m.dispose()}
 return {part,box,floor,stair,rail,block,finish,release,group}
}
