import { useLayoutEffect, useMemo, useRef, useEffect } from 'react'
import { useTexture } from '@react-three/drei'
import { Color, IcosahedronGeometry, Object3D, RepeatWrapping, SRGBColorSpace } from 'three'

// Smooth, irregular stone fragments share geometry/maps in one instanced draw.
// Decorative only: the accepted route and physics colliders stay unchanged.
export default function MissionOneRubble() {
  const instances=useRef(null)
  const maps=useTexture(['/environment/kashi/stone-color.jpg','/environment/kashi/stone-normal.jpg','/environment/kashi/stone-roughness.jpg'])
  const resources=useMemo(()=>{
    const geometry=new IcosahedronGeometry(1,2),p=geometry.attributes.position
    for(let i=0;i<p.count;i++){
      const x=p.getX(i),y=p.getY(i),z=p.getZ(i)
      const erosion=1+.13*Math.sin(x*5.2+z*2.1)*Math.cos(y*4.3)+.06*Math.sin(z*8+x*3)
      p.setXYZ(i,x*erosion,y*erosion,z*erosion)
    }
    geometry.computeVertexNormals()
    // Icosahedron UV seams duplicate vertices; average coincident normals while
    // keeping their distinct UVs rather than reintroducing flat triangular faces.
    const normals=geometry.attributes.normal,average=new Map()
    const key=i=>`${p.getX(i).toFixed(5)}/${p.getY(i).toFixed(5)}/${p.getZ(i).toFixed(5)}`
    for(let i=0;i<p.count;i++){const k=key(i),n=average.get(k)||[0,0,0];n[0]+=normals.getX(i);n[1]+=normals.getY(i);n[2]+=normals.getZ(i);average.set(k,n)}
    for(let i=0;i<p.count;i++){const n=average.get(key(i)),length=Math.hypot(...n);normals.setXYZ(i,n[0]/length,n[1]/length,n[2]/length)}
    const textures=maps.map(t=>t.clone());textures[0].colorSpace=SRGBColorSpace
    for(const t of textures){t.wrapS=t.wrapT=RepeatWrapping;t.repeat.set(1.5,1.5);t.anisotropy=4}
    return {geometry,textures}
  },[maps])
  useLayoutEffect(()=>{
    const fragment=new Object3D(),color=new Color()
    for(let i=0;i<220;i++){
      const size=.07+(i%11)*.022
      fragment.position.set(((i*37)%233)/10-11.6,-.21,10-((i*71)%710)/10)
      fragment.rotation.set(i*.7,i*1.9,i*.4)
      fragment.scale.set(size*1.7,size*.45,size);fragment.updateMatrix()
      instances.current.setMatrixAt(i,fragment.matrix)
      instances.current.setColorAt(i,color.setHSL(.075+(i%5)*.008,.16+(i%4)*.03,.50+(i%7)*.025))
    }
    instances.current.instanceMatrix.needsUpdate=true
    instances.current.instanceColor.needsUpdate=true
  },[])
  useEffect(()=>()=>{resources.geometry.dispose();resources.textures.forEach(t=>t.dispose())},[resources])
  return <instancedMesh ref={instances} args={[resources.geometry,undefined,220]} receiveShadow>
    <meshStandardMaterial map={resources.textures[0]} normalMap={resources.textures[1]} roughnessMap={resources.textures[2]} roughness={.95} />
  </instancedMesh>
}
