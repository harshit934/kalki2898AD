import CityEnvironment, { CityCollisions } from './phase54e/CityEnvironment.jsx'
import { cityEnabled } from './phase54e/cityAssets.js'
import { lazy, Suspense, useEffect, useMemo } from 'react'
import { DataTexture, RepeatWrapping, RGBAFormat, Vector2 } from 'three'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import KashiEnvironment from './KashiEnvironment.jsx'
import { useGLTF } from '@react-three/drei'

// Outer building footprints; the original encounters, traps and route remain authoritative.
const buildings = [[-13, 2, 3, 4, 7.3], [13, -8, 3.5, 4.5, 9], [-14, -25, 3, 5, 9], [14, -35, 3.5, 4, 11.5], [-14, -51, 3.5, 4.5, 7.8], [14, -61, 3.5, 5, 9.3],[-10,23,4,3,6.8],[10,23,4,3,6.8]]
const rippleScale=new Vector2(.35,.35)
const KashiGhatPrototype = lazy(() => import('./kashi54c/KashiGhatPrototype.jsx'))
const KashiRevision = lazy(() => import('./kashiRevision/KashiRevision.jsx'))

function riverNormals(){
  const n=128,data=new Uint8Array(n*n*4)
  for(let y=0;y<n;y++)for(let x=0;x<n;x++){
    const a=x/n*Math.PI*2,b=y/n*Math.PI*2,nx=.12*Math.cos(a*3+b)*Math.cos(b*5),ny=.18*Math.sin(b*5+a),i=(y*n+x)*4
    data.set([Math.round(128+nx*127),Math.round(128+ny*127),250,255],i)
  }
  const texture=new DataTexture(data,n,n,RGBAFormat);texture.wrapS=texture.wrapT=RepeatWrapping;texture.repeat.set(64,240);texture.needsUpdate=true;return texture
}

export default function MissionOneDistrict() {
  const normals=useMemo(()=>riverNormals(),[])
  useEffect(()=>()=>normals.dispose(),[normals])
  useEffect(()=>{for(const name of ['warden-body','warden-leg','warden-weapon','precinct-wall'])useGLTF.preload(`/environment/mission1/${name}-v1.glb`,'/environment/kashi/draco/')},[])
  if(cityEnabled())return <group name="54e-playable-district"><Suspense fallback={null}><CityEnvironment /></Suspense><CityCollisions /></group>
  return <group name="mission1-kashi-riverfront">
    {new URLSearchParams(location.search).get('kashiPrototype') === '54c' && <Suspense fallback={null}><KashiGhatPrototype /></Suspense>}
    {new URLSearchParams(location.search).get('kashiPrototype') === 'revision' && <Suspense fallback={null}><KashiRevision /></Suspense>}
    <Suspense fallback={null}>
      <KashiEnvironment assetPath="/environment/mission1/kashi-riverfront-v1.glb" />
      <KashiEnvironment assetPath="/environment/mission531/riverbank-v1.glb" castShadow={false} />
    </Suspense>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-140, -1.7, 0]} receiveShadow>
      <planeGeometry args={[256, 1200]} />
      <meshStandardMaterial color="#315d5b" roughness={0.3} metalness={0.28} envMapIntensity={0.65} normalMap={normals} normalScale={rippleScale} />
    </mesh>
    <RigidBody type="fixed" colliders={false} name="kashi-riverfront-collision">
      {buildings.map(([x,z,w,d,h]) => <CuboidCollider key={`${x}/${z}`} position={[x,h/2-.22,z]} args={[w,h/2,d]} />)}
      <CuboidCollider position={[-11.65,.23,-34]} args={[.18,.45,44]} />
      <CuboidCollider position={[0,4.28,-91]} args={[6,4.5,3.5]} />
      {[-5.4,5.4].map(x=><CuboidCollider key={x} position={[x,2.16,24]} args={[.5,2.38,.5]} />)}
    </RigidBody>
  </group>
}
