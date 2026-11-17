import CityMenuScene from './phase54e/CityMenuScene.jsx'
import { cityEnabled } from './phase54e/cityAssets.js'
import { Suspense, useMemo, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import RiggedBhairava from './player/RiggedBhairava.jsx'
import { ContactShadows, Environment } from '@react-three/drei'
import KashiEnvironment from './KashiEnvironment.jsx'
import { Object3D } from 'three'

function SceneMotion({ location='kashi' }) {
  const reduced = useRef(matchMedia('(prefers-reduced-motion: reduce)').matches)
  const camera=useThree(s=>s.camera)
  useEffect(()=>{camera.fov=location==='complex'?44:location==='shambhala'?42:39;camera.updateProjectionMatrix()},[camera,location])
  useFrame(({ camera, clock }) => {
    if (!reduced.current) camera.position.x = 7.7 + Math.sin(clock.elapsedTime * .08) * .22
    camera.position.y=location==='complex'?4.3:3.4
    camera.position.z=location==='complex'?18:12.5
    camera.lookAt(0, location==='complex'?4.5:2.1, location==='complex'?-10:-1.2)
  })
  return null
}
function MenuFrameBudget({ visible }) {
  const invalidate=useThree(s=>s.invalidate)
  useEffect(()=>{
    if(!visible)return
    const interval=1000/30;let last=performance.now(),frame
    function tick(now){const elapsed=now-last;if(elapsed>=interval){last=now-elapsed%interval;invalidate()}frame=requestAnimationFrame(tick)}
    invalidate();frame=requestAnimationFrame(tick)
    return()=>cancelAnimationFrame(frame)
  },[visible,invalidate])
  return null
}
function MenuResolution() {
  const size=useThree(s=>s.size),setDpr=useThree(s=>s.setDpr)
  useEffect(()=>{
    const maxDpr=size.width<900?1:2
    setDpr(Math.max(.5,Math.min(devicePixelRatio,maxDpr,Math.sqrt(2073600/Math.max(1,size.width*size.height)))))
  },[size.width,size.height,setDpr])
  return null
}
function StaticSunShadow() {
  const gl=useThree(s=>s.gl),frames=useRef(0)
  useFrame(()=>{
    if(++frames.current===4){gl.shadowMap.autoUpdate=false;gl.shadowMap.needsUpdate=true}
  })
  useEffect(()=>()=>{gl.shadowMap.autoUpdate=true;gl.shadowMap.needsUpdate=true},[gl])
  return null
}
function KashiCourtyard({ location='kashi' }) {
  const stateRef=useRef({mode:'idle',speed:0})
  const target=useMemo(()=>{const o=new Object3D();o.position.set(0,2,-10);return o},[])
  return <>
    <color attach="background" args={['#b7a084']} /><fog attach="fog" args={['#b7a084',50,160]} />
    <hemisphereLight args={['#f4e7c8','#6b6256',.65]} />
    <primitive object={target} />
    <directionalLight target={target} position={[-10,18,8]} castShadow intensity={3.6} color="#ffd49e" shadow-mapSize={[1024,1024]} shadow-camera-left={-23} shadow-camera-right={23} shadow-camera-top={23} shadow-camera-bottom={-23} shadow-camera-near={.5} shadow-camera-far={90} shadow-bias={-.0002} shadow-normalBias={.035} />
    <directionalLight position={[8,6,-8]} intensity={.65} color="#94c9c2" />
    <Suspense fallback={null}>
      <Environment files="/environment/kashi/sunset-lighting.hdr" background backgroundBlurriness={.4} backgroundIntensity={.55} environmentIntensity={.6} />
      <KashiEnvironment key={`geometry-${location}`} assetPath={`/environment/previews/${location}.glb`} />
      <group position={[1.3,0,1]} scale={2.05} rotation={[0,2.4,0]}><RiggedBhairava stateRef={stateRef} /></group>
      <ContactShadows position={[1.3,.015,1]} frames={1} opacity={.42} scale={11} blur={2.5} far={5} resolution={512} color="#3b3128" />
      <StaticSunShadow key={`shadow-${location}`} />
    </Suspense>
    <SceneMotion location={location} />
  </>
}
export default function MenuScene({ location='kashi' }) {
  const [visible, setVisible] = useState(!document.hidden)
  useEffect(() => { const change=()=>setVisible(!document.hidden);document.addEventListener('visibilitychange',change);return()=>document.removeEventListener('visibilitychange',change) }, [])
  return <div className="menu-world" aria-hidden="true"><Canvas frameloop="demand" shadows="percentage" dpr={[.5, 2]} gl={{ antialias: true, powerPreference: 'high-performance' }} camera={{ position: [7.7, 3.4, 12.5], fov: 39,near:.1,far:180 }}>{cityEnabled()&&location==='kashi'?<CityMenuScene />:<KashiCourtyard key={location} location={location} />}<MenuFrameBudget visible={visible} /><MenuResolution /></Canvas></div>
}
