import { Box3, CatmullRomCurve3, ExtrudeGeometry, Float32BufferAttribute, Group, Mesh, MeshStandardMaterial, Shape, SphereGeometry, TubeGeometry, Vector3 } from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { makeCharacterRelief } from './characterSurfaces.js'

// Original removable presentation layers on a skeleton clone. Source GLB/groom never change.
export function dressMissionOne(scene) {
  const relief = makeCharacterRelief('cloth'), skin = makeCharacterRelief('skin'), changed = [], groups = []
  scene.traverse(o => {
    if (!o.isSkinnedMesh) return
    const m=o.material
    changed.push({m,roughness:m.roughness,bumpMap:m.bumpMap,bumpScale:m.bumpScale,envMapIntensity:m.envMapIntensity})
    if (m.name==='Skin') {m.roughness=.72;m.envMapIntensity=.55;if(o.geometry.attributes.uv){m.bumpMap=skin;m.bumpScale=.0012}}
    if (/Hair|Beard/.test(m.name)){m.roughness=.78;m.envMapIntensity=.35}
    if (/straps|Straps|Pouches|Cloth|Trouser/.test(m.name)&&o.geometry.attributes.uv){m.bumpMap=relief;m.bumpScale=.003}
    m.needsUpdate=true
  })
  const armor=new Group();armor.name='mission1-original-segmented-cuirass'
  const metal=new MeshStandardMaterial({color:'#8f8271',metalness:.65,roughness:.48,bumpMap:relief,bumpScale:.0015})
  const fasteners=new MeshStandardMaterial({color:'#b19458',metalness:.75,roughness:.4})
  const seams=new MeshStandardMaterial({color:'#5d4938',metalness:.25,roughness:.85})
  function plate(points,z,mat){const shape=new Shape();points.forEach(([x,y],i)=>i?shape.lineTo(x,y):shape.moveTo(x,y));shape.closePath();const geometry=new ExtrudeGeometry(shape,{depth:.012,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.004,bevelThickness:.003});const p=geometry.attributes.position;for(let i=0;i<p.count;i++)p.setZ(i,p.getZ(i)-.07*Math.pow(Math.abs(p.getX(i))/.2,1.4));geometry.computeVertexNormals();const mesh=new Mesh(geometry,mat);mesh.position.z=z;mesh.castShadow=mesh.receiveShadow=true;armor.add(mesh)}
  const rivets=[]
  for(const side of [-1,1]){
    plate([[side*.012,1.55],[side*.10,1.58],[side*.18,1.52],[side*.15,1.40],[side*.015,1.37]],.202,metal)
    plate([[side*.018,1.355],[side*.145,1.39],[side*.13,1.30],[side*.04,1.265]],.195,seams)
    for(const [x,y] of [[.04,1.53],[.10,1.55],[.15,1.50],[.13,1.43],[.045,1.4],[.07,1.31]]){
      const rivet=new SphereGeometry(.005,8,6)
      rivet.translate(side*x,y,.218-.07*Math.pow(x/.2,1.4));rivets.push(rivet)
    }
  }
  const rivetMesh=new Mesh(mergeGeometries(rivets),fasteners);rivets.forEach(g=>g.dispose());rivetMesh.castShadow=true;armor.add(rivetMesh)
  scene.add(armor);scene.updateMatrixWorld(true);scene.getObjectByName('Spine2')?.attach(armor);groups.push(armor)
  const head=scene.getObjectByName('Head')
  if(head){
    const hair=new Group();hair.name='mission1-original-swept-hair-detail';const pieces=[]
    scene.updateMatrixWorld(true)
    const bounds=new Box3().setFromObject(scene),centre=head.getWorldPosition(new Vector3())
    const top=scene.worldToLocal(new Vector3(centre.x,bounds.max.y,centre.z))
    for(let i=0;i<96;i++){
      const x=(i/95-.5)*.20+.002*Math.sin(i*7.1),drop=Math.abs(x)*.32,lift=.004+.008*(1+Math.sin(i*2.4)),wave=.009*Math.sin(i*1.7)
      const strand=new TubeGeometry(new CatmullRomCurve3([new Vector3(top.x+x,top.y-.045-drop,top.z+.065),new Vector3(top.x+x*.94+wave,top.y+lift-drop,top.z+.005),new Vector3(top.x+x*.82-wave,top.y-.02-drop,top.z-.075),new Vector3(top.x+x*.7,top.y-.065-drop,top.z-.115)]),10,.0016,3,false)
      const colors=new Float32Array(strand.attributes.position.count*3),shade=.055+(Math.sin(i*5.4)+1)*.018
      for(let j=0;j<colors.length;j+=3){colors[j]=shade;colors[j+1]=shade*.78;colors[j+2]=shade*.6}
      strand.setAttribute('color',new Float32BufferAttribute(colors,3));pieces.push(strand)
    }
    const mesh=new Mesh(mergeGeometries(pieces),new MeshStandardMaterial({color:'#ffffff',vertexColors:true,roughness:.74}));pieces.forEach(g=>g.dispose());mesh.castShadow=true;hair.add(mesh);scene.add(hair);scene.updateMatrixWorld(true);head.attach(hair);groups.push(hair)
  }
  return()=>{
    for(const g of groups){g.removeFromParent();g.traverse(o=>{if(o.isMesh)o.geometry.dispose()})}
    const hairMaterial=groups[1]?.children[0]?.material;hairMaterial?.dispose();metal.dispose();seams.dispose();fasteners.dispose()
    for(const{m,...saved}of changed){Object.assign(m,saved);m.needsUpdate=true}
    relief.dispose();skin.dispose()
  }
}
