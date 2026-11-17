import { Suspense, useEffect, useMemo, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { Box3, Vector3 } from 'three'
import { clone } from 'three/addons/utils/SkeletonUtils.js'
import { BATCH_CONTENT, createBatchRun, freightPhase, freightSafe, stepBatch } from './batch20Content.js'
import { publishBatch, releaseBatch } from './batch20State.js'
import { getPlayerWorldPosition, useGameplayState } from '../gameplayStore.js'
import { useCampaignState } from '../campaignSystem.js'
import { useGameplayFrame } from '../cinematics/useGameplayFrame.js'
import KashiEnvironment from '../KashiEnvironment.jsx'
import BujjiCompanion from '../BujjiCompanion.jsx'

function Asset({ src, height, position = [0, 0, 0], rotation = 0 }) {
  const { scene } = useGLTF(src)
  const model = useMemo(() => {
    const object = clone(scene), box = new Box3().setFromObject(object)
    const scale = height / Math.max(.01, box.getSize(new Vector3()).y)
    object.scale.setScalar(scale)
    object.position.y = -box.min.y * scale
    object.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true } })
    return object
  }, [scene, height])
  return <group position={position} rotation={[0, rotation, 0]}><primitive object={model} /></group>
}
function Solid({ at, size, color = '#77614b', rotation = [0, 0, 0] }) {
  return <RigidBody type="fixed" colliders={false} position={at} rotation={rotation}>
    <mesh castShadow receiveShadow><boxGeometry args={size} /><meshStandardMaterial color={color} roughness={.9} metalness={.1} /></mesh>
    <CuboidCollider args={size.map(x => x / 2)} />
  </RigidBody>
}
function Freight({ run, lane }) {
  const body = useRef(null), signal = useRef(null)
  useGameplayFrame(() => {
    const phase = freightPhase(run.time, lane)
    body.current?.setNextKinematicTranslation({ x: phase < 7 ? -15 + phase * 30 / 7 : 18, y: .48, z: -16 - lane * 14 })
    if (signal.current) signal.current.color.set(freightSafe(run.time, lane) ? '#63e8ac' : '#f2a541')
  })
  return <>
    <RigidBody ref={body} type="kinematicPosition" colliders={false} position={[-15, .48, -16-lane*14]}>
      <Suspense fallback={null}><Asset src="/environment/mission1/barrier-housing-v1.glb" height={1.6} rotation={Math.PI/2} /></Suspense>
      <CuboidCollider args={[1.8, .8, .9]} position={[0,.3,0]} />
    </RigidBody>
    <mesh position={[5,2.2,-16-lane*14]}><cylinderGeometry args={[.28,.28,.18,16]} /><meshBasicMaterial ref={signal} color="#f2a541" /></mesh>
    {[-1,1].map(side=><Solid key={side} at={[side*8,.3,-16-lane*14]} size={[.2,1.1,5]} color="#294940" />)}
    {[-.65,.65].map(x=><mesh key={x} position={[0,-.195,-16-lane*14+x]}><boxGeometry args={[33,.035,.08]} /><meshStandardMaterial color="#424a45" metalness={.8} roughness={.5} /></mesh>)}
  </>
}

function SetPiece({ id, run }) {
  const resident = '/environment/phase54c-revision/civilian-merchant.glb'
  return <Suspense fallback={null}>
    {id==='mission-21' && <>
      <Solid at={[0,1.2,-10]} size={[7,2.8,.4]} color="#314b43" />
      <group position={[0,0,-10]}><KashiEnvironment assetPath="/environment/mission1/precinct-wall-v1.glb" /></group>
      {Array.from({length:14},(_,i)=><Solid key={i} at={[-6,-.22+(i+1)*.1,-10-i*.85]} size={[3,(i+1)*.2,.86]} />)}
      <Solid at={[-6,1.18,-25]} size={[6,2.8,8]} />
      <Solid at={[-9,3,-25]} size={[.2,.8,8]} color="#354a40" />
      <group position={[0,13,-55]} scale={[2,2,2]}><KashiEnvironment assetPath="/environment/previews/complex-frontage.glb" /></group>
    </>}
    {id==='mission-22' && <>
      <Asset src={resident} height={1.72} position={[-3,-.22,-7]} />
      <Asset src="/environment/phase54c-revision/civilian-porter.glb" height={1.75} position={[-5,-.22,-11]} />
      <Asset src="/environment/mission1/field-relay-v1.glb" height={2.5} position={[-5,-.22,-7]} />
      <Solid at={[-6,.3,-15]} size={[1,.8,15]} color="#386a61" />
      {[42,17].map((n,i)=><mesh key={n} position={[3+i*.55,-.13,-18]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.22,.22,.04,24]} /><meshStandardMaterial color={n===42?'#c6a164':'#9caaa1'} metalness={.8} roughness={.4} /></mesh>)}
    </>}
    {id==='mission-23' && <>
      <Asset src="/environment/mission1/field-relay-v1.glb" height={2} position={[1,-.22,-5]} />
      {[0,1].map(lane=><Freight key={lane} run={run} lane={lane} />)}
      <Asset src="/environment/mission1/field-relay-v1.glb" height={2} position={[1,-.22,-40]} />
      {[-1,1].map(side=><group key={side} position={[side*13,-.22,-24]} rotation={[0,side>0?Math.PI:0,0]}><KashiEnvironment assetPath="/environment/previews/complex-frontage.glb" /></group>)}
    </>}
    {id==='mission-24' && <>
      <Asset src={resident} height={1.72} position={[-3,-.22,-8]} />
      <Solid at={[-3,.45,-9]} size={[3,1.3,1]} />
      <Asset src="/environment/mission1/field-relay-v1.glb" height={2} position={[3,-.22,-22]} />
      <Solid at={[0,1.2,-27]} size={[12,2.8,.35]} color="#354d44" />
      <group position={[-9,-.22,-8]}><KashiEnvironment assetPath="/environment/previews/kashi-frontage.glb" /></group>
    </>}
  </Suspense>
}

export default function Batch20Gameplay({ id }) {
  const round = useGameplayState(s=>s.roundId)
  const run = useMemo(()=>createBatchRun(id,round),[id,round])
  const published = useRef(0)
  useEffect(()=>{publishBatch(run);return()=>releaseBatch(run)},[run])
  useGameplayFrame((_,dt)=>{
    if (useGameplayState.getState().gameOver) return
    stepBatch(run,getPlayerWorldPosition(),dt)
    if (run.completed && !run.rewardSaved) {
      run.rewardSaved = useCampaignState.getState().completeMission(id,'activity',BATCH_CONTENT[id].reward)
    }
    published.current += dt
    if (published.current>=.15 || run.completed) { published.current=0;publishBatch(run) }
  })
  return <group name={`batch54f-${id}`}><SetPiece id={id} run={run} /><BujjiCompanion /></group>
}
