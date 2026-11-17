import { Suspense, useRef } from 'react'
import { useGameplayFrame } from './cinematics/useGameplayFrame.js'
import { bossRuntime, useBossState } from './bossSystem.js'
import { gameTime } from './gameClock.js'
import MissionOneProp from './MissionOneProp.jsx'

// The established Warden controller owns every hit, attack pattern, phase and reward.
export default function MissionOneWarden({bodyRef,weaponRef,coreRef,crownRef,phase,visible=true}){
  const left=useRef(null),right=useRef(null),previous=useRef({x:0,z:0,ready:false})
  const accent=phase===3?'#f18b69':phase===2?'#91d5b9':'#6dc8c4'
  useGameplayFrame((_,delta)=>{
    const p=bossRuntime.position,old=previous.current
    const speed=old.ready?Math.hypot(p.x-old.x,p.z-old.z)/Math.max(.001,delta):0
    old.x=p.x;old.z=p.z;old.ready=true
    const stride=useBossState.getState().status==='active'?Math.sin(gameTime()*.006)*Math.min(.2,speed*.065):0
    if(left.current)left.current.rotation.x=stride
    if(right.current)right.current.rotation.x=-stride
  })
  return <group ref={bodyRef} name="mission1-authored-warden">
    <group visible={visible}>
    <Suspense fallback={null}>
      <MissionOneProp name="warden-body" />
      <group ref={left} position={[-.49,1.6,0]}><MissionOneProp name="warden-leg" /></group>
      <group ref={right} position={[.49,1.6,0]}><MissionOneProp name="warden-leg" /></group>
      <group ref={weaponRef} position={[1.16,1.8,0]}><MissionOneProp name="warden-weapon" /></group>
    </Suspense>
    <group ref={coreRef} position={[0,2.45,-.49]}>
      <mesh><icosahedronGeometry args={[.22,1]} /><meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.1} metalness={.55} roughness={.3} /></mesh>
    </group>
    <group ref={crownRef} position={[0,3.82,0]}>
      <mesh rotation={[Math.PI/2,0,0]}><torusGeometry args={[.42,.035,10,40]} /><meshStandardMaterial color="#a28a55" metalness={.78} roughness={.45} /></mesh>
    </group>
    </group>
    <pointLight color={accent} intensity={visible ? 5 : 0} distance={7} position={[0,2.2,-.6]} />
    <pointLight color="#e5aa74" intensity={visible ? 2 : 0} distance={5} position={[0,3.2,.2]} />
  </group>
}
