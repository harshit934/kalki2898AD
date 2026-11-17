import fs from 'node:fs'
import crypto from 'node:crypto'
import { Vector3, SphereGeometry, TubeGeometry, TorusGeometry, CatmullRomCurve3, BufferGeometry, Float32BufferAttribute } from 'three'

const out='phase3/likeness-sculpt', source=fs.readFileSync(`${out}/rollback/original-bhairava.glb`)
// Keep every candidate revision before authoring another one.
for(const name of ['bhairava-clay-candidate.glb','bhairava-head-working-copy.glb','sculpt-v01.json'])if(fs.existsSync(`${out}/work/${name}`)&&!fs.existsSync(`${out}/rollback/v01-${name}`))fs.copyFileSync(`${out}/work/${name}`,`${out}/rollback/v01-${name}`)
const jsonLength=source.readUInt32LE(12), original=JSON.parse(source.subarray(20,20+jsonLength)), originalBin=source.subarray(28+jsonLength)
const doc=structuredClone(original), bin=Buffer.from(originalBin), chunks=[bin]
let length=bin.length
const sizes={5121:1,5123:2,5125:4,5126:4},components={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT4:16}
function values(index){const a=doc.accessors[index],v=doc.bufferViews[a.bufferView],n=components[a.type],stride=v.byteStride||sizes[a.componentType]*n,start=(v.byteOffset||0)+(a.byteOffset||0),result=[];for(let i=0;i<a.count;i++)for(let k=0;k<n;k++){const offset=start+i*stride+k*sizes[a.componentType];result.push(a.componentType===5126?bin.readFloatLE(offset):a.componentType===5125?bin.readUInt32LE(offset):a.componentType===5123?bin.readUInt16LE(offset):bin.readUInt8(offset))}return result}
function writeFloat(index,vertex,axis,value){const a=doc.accessors[index],v=doc.bufferViews[a.bufferView],stride=v.byteStride||components[a.type]*4;bin.writeFloatLE(value,(v.byteOffset||0)+(a.byteOffset||0)+vertex*stride+axis*4)}
function append(array,type,componentType=5126,target=34962){const padding=Buffer.alloc((4-length%4)%4);chunks.push(padding);length+=padding.length;const data=Buffer.from(array.buffer,array.byteOffset,array.byteLength),view=doc.bufferViews.length;doc.bufferViews.push({buffer:0,byteOffset:length,byteLength:data.length,target});chunks.push(data);length+=data.length;const accessor={bufferView:view,componentType,count:array.length/components[type],type};if(type==='VEC3'){accessor.min=[Infinity,Infinity,Infinity];accessor.max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<array.length;i++) {const axis=i%3;accessor.min[axis]=Math.min(accessor.min[axis],array[i]);accessor.max[axis]=Math.max(accessor.max[axis],array[i])}}doc.accessors.push(accessor);return doc.accessors.length-1}
const p=doc.meshes[0].primitives[0],positions=values(p.attributes.POSITION),normals=values(p.attributes.NORMAL),joints=values(p.attributes.JOINTS_0),weights=values(p.attributes.WEIGHTS_0)
const skin=doc.skins[0],names=skin.joints.map(id=>doc.nodes[id].name),headIndex=names.indexOf('Head'),headJoints=new Set(names.map((name,i)=>/Head|Eye|Jaw/.test(name)?i:-1).filter(i=>i>=0))
const influence=id=>{let value=0;for(let k=0;k<4;k++)if(headJoints.has(joints[id*4+k]))value+=weights[id*4+k];return value}
const smooth=(lo,hi,x)=>{const t=Math.min(1,Math.max(0,(x-lo)/(hi-lo)));return t*t*(3-2*t)}
const g=(x,c,s)=>Math.exp(-(((x-c)/s)**2))
const facialMaterials=new Set(['Skin','Skin details','Eyebrows','Eyelashes'])
const facialIds=new Set(doc.meshes[0].primitives.filter(pr=>facialMaterials.has(doc.materials[pr.material].name)).flatMap(pr=>values(pr.indices)))
const edited=[]
// Explicit regional displacement brushes on a working copy. Body, neck seam,
// eyeballs, teeth, tongue, all indices, UVs and skin weights remain unchanged.
for(const id of facialIds){const x=positions[id*3],y=positions[id*3+1],z=positions[id*3+2],ax=Math.abs(x)
 const mask=smooth(1.632,1.668,y)*smooth(.45,.95,influence(id))
 if(!mask||ax>.083)continue
 const front=smooth(.025,.105,z), sign=Math.sign(x)
 let dx=sign*(.0075*g(y,1.675,.034)*smooth(.014,.055,ax)*front + .0042*g(y,1.728,.022)*g(ax,.052,.026)*front + .0018*g(y,1.805,.04)*g(ax,.067,.026))
 let dy=.0018*g(y,1.845,.04)-.0016*g(y,1.765,.009)*g(ax,.031,.018)*front
 let dz=(.006*g(y,1.658,.023)*g(ax,0,.038)+.0055*g(y,1.729,.020)*g(ax,.052,.023)+.0048*g(y,1.779,.014)*g(ax,.035,.032)+.0065*g(y,1.744,.019)*g(ax,.0,.013)+.0028*g(y,1.758,.006)*g(ax,.031,.019)+.0038*g(y,1.773,.010)*g(ax,.034,.027))*front
 dx+=sign*.0038*g(y,1.744,.015)*g(ax,.014,.013)*front
 const delta=[dx*mask,dy*mask,dz*mask]
 if(Math.hypot(...delta)<.000001)continue
 for(let axis=0;axis<3;axis++)writeFloat(p.attributes.POSITION,id,axis,positions[id*3+axis]+delta[axis])
 edited.push({id,delta})
}
const newPositions=values(p.attributes.POSITION)
// Recompute only head-region normals; no body/neck normal bytes are rewritten.
const sums=new Float64Array(positions.length),a=new Vector3(),b=new Vector3(),c=new Vector3(),ab=new Vector3(),ac=new Vector3()
for(const primitive of doc.meshes[0].primitives.filter(pr=>facialMaterials.has(doc.materials[pr.material].name))){const ids=values(primitive.indices);for(let i=0;i<ids.length;i+=3){a.fromArray(newPositions,ids[i]*3);b.fromArray(newPositions,ids[i+1]*3);c.fromArray(newPositions,ids[i+2]*3);ab.subVectors(b,a);ac.subVectors(c,a);ab.cross(ac);for(const id of ids.slice(i,i+3))for(let k=0;k<3;k++)sums[id*3+k]+=ab.getComponent(k)}}
for(const {id} of edited){a.fromArray(sums,id*3).normalize();for(let k=0;k<3;k++)writeFloat(p.attributes.NORMAL,id,k,a.getComponent(k))}
doc.materials.push({name:'Clay_Hair_Volume',pbrMetallicRoughness:{baseColorFactor:[.23,.225,.21,1],metallicFactor:0,roughnessFactor:.9}})
const hairMaterial=doc.materials.length-1
const added=[]
function mesh(name,geometry,material=hairMaterial,weightSource=null){const pos=geometry.attributes.position.array,normal=geometry.attributes.normal.array,count=pos.length/3,j=new Uint16Array(count*4),w=new Float32Array(count*4)
 for(let i=0;i<count;i++){if(weightSource){const id=weightSource[i];for(let k=0;k<4;k++){j[i*4+k]=joints[id*4+k];w[i*4+k]=weights[id*4+k]}}else{j[i*4]=headIndex;w[i*4]=1}}
 const attrs={POSITION:append(new Float32Array(pos),'VEC3'),NORMAL:append(new Float32Array(normal),'VEC3'),JOINTS_0:append(j,'VEC4',5123),WEIGHTS_0:append(w,'VEC4')}
 const idx=geometry.index?.array||Uint32Array.from({length:count},(_,i)=>i)
 const primitive={attributes:attrs,indices:append(Uint32Array.from(idx),'SCALAR',5125,34963),material}
 const meshIndex=doc.meshes.length;doc.meshes.push({name,primitives:[primitive]});const nodeIndex=doc.nodes.length;doc.nodes.push({name,mesh:meshIndex,skin:0,extras:{candidateOnly:true}});doc.scenes[doc.scene||0].nodes.push(nodeIndex);added.push({name,vertices:count,triangles:idx.length/3});geometry.dispose()
}
// Closed, swept scalp volume with a receding temple boundary and pulled-back
// curvature. Clumps are geometry, not repeated textured alpha cards.
const scalp=new SphereGeometry(1,72,36),scalpPositions=scalp.attributes.position
for(let i=0;i<scalpPositions.count;i++){const x=scalpPositions.getX(i),y=scalpPositions.getY(i),z=scalpPositions.getZ(i),phi=Math.acos(Math.max(-1,Math.min(1,y))),az=Math.atan2(x,z),front=Math.max(0,Math.cos(az)),maxPhi=1.62-front*.38+.032*Math.sin(az*2.7)+.014*Math.sin(az*5.1),angle=phi/Math.PI*maxPhi,ridge=1+.009*Math.cos(az*4+angle*2)+.004*Math.sin(az*7-angle*4),baseY=1.794+Math.cos(angle)*.106,backSweep=Math.exp(-(((baseY-1.864)/.034)**2))*.012
 scalpPositions.setXYZ(i,Math.sin(az)*Math.sin(angle)*.085*ridge,baseY,.045+Math.cos(az)*Math.sin(angle)*.109*ridge-backSweep)}
scalp.computeVertexNormals();mesh('Bhairava_SweptHair_Clay',scalp)
for(let i=0;i<7;i++){const t=i/6,x0=(t-.5)*.139,phase=Math.sin(t*5.1),points=[];for(let j=0;j<=16;j++){const u=j/16,angle=1.24+.055*phase-u*(2.04+.09*Math.sin(t*4.7)),x=x0*(1-u*.52)+.0027*Math.sin(u*Math.PI)*phase,section=Math.sqrt(Math.max(.08,1-(x/.087)**2)),y=1.794+.108*Math.cos(angle)*section,z=.045+.111*Math.sin(angle)*section-.012*Math.exp(-(((y-1.864)/.034)**2));points.push(new Vector3(x,y,z))}const curve=new CatmullRomCurve3(points)
 mesh(`Bhairava_SweptLock_${i+1}`,new TubeGeometry(curve,48,.0010+.00035*Math.sin(t*Math.PI),7,false))}
const bun=new SphereGeometry(1,40,24),bp=bun.attributes.position
for(let i=0;i<bp.count;i++){const x=bp.getX(i),y=bp.getY(i),z=bp.getZ(i),wave=1+.012*Math.cos(Math.atan2(y,x)*7+z*5);bp.setXYZ(i,x*.016*wave,1.856+y*.016*wave,-.049+z*.023*wave)}bun.computeVertexNormals();mesh('Bhairava_TiedRearHair_Clay',bun)
mesh('Bhairava_HairTie_Clay',new TorusGeometry(.012,.0012,8,40).translate(0,1.856,-.056))
// Beard follows a shell of the sculpted skin and copies those exact skin
// weights. A shaped cheek boundary and mouth opening replace the card carpet.
const skinIndices=values(p.indices),beardIds=[],beardIndices=[]
const facialSkinIds=[...new Set(skinIndices)].filter(id=>positions[id*3+1]>1.65&&positions[id*3+2]>.07)
const beardPos=[],beardNorm=[]
const newNormals=values(p.attributes.NORMAL)
function clip(poly,f){const result=[];for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],fa=f(a.p),fb=f(b.p);if(fa<=0)result.push(a);if((fa<=0)!==(fb<=0)){const t=fa/(fa-fb);result.push({p:a.p.map((v,k)=>v+(b.p[k]-v)*t),n:a.n.map((v,k)=>v+(b.n[k]-v)*t),id:t<.5?a.id:b.id})}}return result}
for(let i=0;i<skinIndices.length;i+=3){const ids=skinIndices.slice(i,i+3);if(ids.some(id=>influence(id)<.75))continue;let polygon=ids.map(id=>({p:newPositions.slice(id*3,id*3+3),n:newNormals.slice(id*3,id*3+3),id}));for(const f of [p=>1.638-p[1],p=>.062-p[2],p=>Math.abs(p[0])-.082,p=>p[1]-(1.694+smooth(.018,.078,Math.abs(p[0]))*.021)]){polygon=clip(polygon,f);if(!polygon.length)break}if(polygon.length<3)continue
 const cx=polygon.reduce((s,v)=>s+v.p[0],0)/polygon.length,cy=polygon.reduce((s,v)=>s+v.p[1],0)/polygon.length;if((cx/.027)**2+((cy-1.688)/.010)**2<1)continue
 const start=beardIds.length;for(const vertex of polygon){const [x,y,z]=vertex.p,n=new Vector3(...vertex.n).normalize(),chin=g(y,1.655,.024)*g(x,0,.05),relief=.0035+.004*chin;beardIds.push(vertex.id);beardPos.push(x+n.x*relief,y+n.y*relief-.004*chin,z+n.z*relief);beardNorm.push(n.x,n.y,n.z)}for(let k=1;k<polygon.length-1;k++)beardIndices.push(start,start+k,start+k+1)
}
const beard=new BufferGeometry();beard.setAttribute('position',new Float32BufferAttribute(beardPos,3));beard.setAttribute('normal',new Float32BufferAttribute(beardNorm,3));beard.setIndex(beardIndices);mesh('Bhairava_ShapedBeard_Clay',beard,hairMaterial,beardIds)
function closestWeights(geometry){const pos=geometry.attributes.position,ids=[];for(let i=0;i<pos.count;i++){let best=Infinity,nearest=facialSkinIds[0];for(const id of facialSkinIds){const distance=(newPositions[id*3]-pos.getX(i))**2+(newPositions[id*3+1]-pos.getY(i))**2+(newPositions[id*3+2]-pos.getZ(i))**2;if(distance<best){best=distance;nearest=id}}ids.push(nearest)}return ids}
for(const side of [-1,1]){const mustachePos=[],mustacheIndices=[],nx=28,ny=8
 for(let ix=0;ix<=nx;ix++){const u=ix/nx,x=side*(.0015+u*.041),top=1.711-.006*u,bottom=1.695-.010*u**1.4
  for(let iy=0;iy<=ny;iy++){const v=iy/ny,y=bottom+(top-bottom)*v,u=Math.abs(x)/.044
    mustachePos.push(x,y,.161-.016*u**1.25+.001*Math.sin(v*Math.PI))}}
 for(let ix=0;ix<nx;ix++)for(let iy=0;iy<ny;iy++){const a=ix*(ny+1)+iy,b=a+ny+1;mustacheIndices.push(a,b,a+1,b,b+1,a+1)}
  const mustache=new BufferGeometry();mustache.setAttribute('position',new Float32BufferAttribute(mustachePos,3));mustache.setIndex(mustacheIndices);mustache.computeVertexNormals();mesh(`Bhairava_Moustache_${side<0?'L':'R'}_Clay`,mustache,hairMaterial,closestWeights(mustache))
 const browCurve=new CatmullRomCurve3([new Vector3(side*.012,1.779,.157),new Vector3(side*.025,1.783,.157),new Vector3(side*.042,1.782,.153),new Vector3(side*.057,1.778,.146),new Vector3(side*.064,1.774,.139)]),brow=new TubeGeometry(browCurve,28,.0025,9,false);mesh(`Bhairava_Brow_${side<0?'L':'R'}_Clay`,brow,hairMaterial,closestWeights(brow))}
// The old hair/card beard are removed from the candidate only; rollback keeps
// the entire original asset, and their original buffers are not overwritten.
doc.meshes[0].primitives=doc.meshes[0].primitives.filter(pr=>!['Hair','Beard','Eyebrows'].includes(doc.materials[pr.material].name))
doc.extras={...doc.extras,bhairavaClayCandidate:{stage:'likeness correction v03 review only',sourceSha256:crypto.createHash('sha256').update(source).digest('hex'),vertexTopologyPreserved:true,textureAuthoringStarted:false,productionIntegration:false}}
function save(name,data=doc){const all=Buffer.concat(chunks),padding=Buffer.alloc((4-all.length%4)%4),binary=Buffer.concat([all,padding]);data.buffers=[{byteLength:binary.length}];const json=Buffer.from(JSON.stringify(data)),jp=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,32)]),header=Buffer.alloc(20),bh=Buffer.alloc(8);header.write('glTF');header.writeUInt32LE(2,4);header.writeUInt32LE(28+jp.length+binary.length,8);header.writeUInt32LE(jp.length,12);header.writeUInt32LE(0x4e4f534a,16);bh.writeUInt32LE(binary.length);bh.writeUInt32LE(0x004e4942,4);fs.writeFileSync(`${out}/work/${name}`,Buffer.concat([header,jp,bh,binary]))}
save('bhairava-clay-candidate.glb')
const headDoc=structuredClone(doc)
headDoc.meshes[0].primitives=headDoc.meshes[0].primitives.filter(pr=>['Skin','Skin details','Eyes','Eyelashes','Teeth','Tongue'].includes(doc.materials[pr.material].name)).map(pr=>{const indices=values(pr.indices),head=[];for(let i=0;i<indices.length;i+=3)if(indices.slice(i,i+3).every(id=>influence(id)>=.5))head.push(...indices.slice(i,i+3));return {...pr,indices:append(Uint32Array.from(head),'SCALAR',5125,34963)}})
// append() updated the shared accessor/view arrays after the clone above.
headDoc.accessors=structuredClone(doc.accessors);headDoc.bufferViews=structuredClone(doc.bufferViews)
save('bhairava-head-working-copy.glb',headDoc)
const report={stage:'likeness-correction-v03',method:'Regional vertex-displacement sculpt on a separate copy of the existing topology, plus revised custom hair/groom geometry. Not an AI image or a texture-only modification.',editedSkinVertices:edited.length,maxDisplacementMetres:Math.max(...edited.map(e=>Math.hypot(...e.delta))),edited,addedGeometry:added,originalBoneCount:names.length,originalClipNames:original.animations.map(a=>a.name),texturesAuthored:false,productionIntegrated:false,limitations:['Clay candidate, not a claim of final or accepted likeness.','The two released references do not provide matched neutral front, three-quarter and profile views.','No new facial expression/blendshape system; existing skeleton deformation only.']}
fs.writeFileSync(`${out}/work/sculpt-v03.json`,JSON.stringify(report,null,2))
console.log(JSON.stringify({...report,edited:undefined},null,2))
