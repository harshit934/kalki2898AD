import { usePauseState } from './pauseSystem.js'
import { useShallow } from 'zustand/react/shallow'
import { restoreCamera } from './missionTwoCamera.js'
import ContractActor from './MissionTwoContractActor.jsx'
import { contractCinematic } from './missionTwoContractConfig.js'
import { Suspense, useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3 } from 'three'
import { useMissionTwoSequence, createDuel, stepDuel, createChase, stepChase, PATTERNS, TRACK_LENGTH, TRACK_OBSTACLES } from './missionTwoSequence.js'
import { usePlayerInput, consumePlayerAttack, consumePlayerDodge, consumePlayerJump, clearPlayerInput } from './player/playerInputStore.js'
import { startCinematic, stopCinematic, useCinematic } from './cinematics/controller.js'
import { playGameSound } from '../audio/audioManager.js'

const contractRuntime = { duel: null, chase: null, cameraRestored: true }
const nextPhase = { intro: 'duel', finish: 'chaseIntro', chaseIntro: 'chase', outro: 'handoff' }
// Follow the same safe lane through each solid obstacle; blend only in clear gaps.
function courierLane(z) {
  const next = TRACK_OBSTACLES.find(o => o.z + 4 > z)
  if (!next) return 0
  const previous = TRACK_OBSTACLES[next.id - 1]
  const lane = next.x >= 0 ? -3.9 : 3.9
  const from = previous ? previous.x >= 0 ? -3.9 : 3.9 : 0
  const t = Math.max(0, Math.min(1, (z - (previous ? previous.z + 4 : 0)) / 7))
  return from + (lane - from) * t * t * (3 - 2 * t)
}
function GroundVehicle({ vehicleRef, courier = false }) {
  return <group ref={vehicleRef}>
    <mesh castShadow position={[0, .65, 0]}><boxGeometry args={[1.7, .6, 2.8]} /><meshStandardMaterial color={courier ? '#a74653' : '#c27733'} metalness={.65} roughness={.45} /></mesh>
    <mesh castShadow position={[0, 1.15, -.1]}><sphereGeometry args={[.82, 16, 10]} /><meshStandardMaterial color="#25535f" metalness={.8} roughness={.25} /></mesh>
    {[-1, 1].flatMap(side => [-.9, .9].map(z => <mesh key={`${side}-${z}`} position={[side * 1.1, .42, z]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[.48, .48, .35, 12]} /><meshStandardMaterial color="#171b23" roughness={.95} /></mesh>))}
    <mesh position={[0, .8, -1.45]}><boxGeometry args={[1.1, .12, .05]} /><meshBasicMaterial color="#71ecf4" /></mesh>
  </group>
}

export default function MissionTwoSequence({ enabled }) {
  const session = useMissionTwoSequence(useShallow(s => ({ phase: s.phase, origin: s.origin, runId: s.runId })))
  // Reset atomically removes the session; its renderer never receives a null origin.
  if (session.phase === 'idle' || !session.origin) return null
  return <ContractSession key={session.runId} {...session} enabled={enabled} />
}

function ContractSession({ enabled, phase, origin, runId }) {
  const getThree = useThree(s => s.get), savedCamera = useRef(null), vehicle = useRef(null), courier = useRef(null), warning = useRef(null), impact = useRef(null), partner = useRef(null)
  const duel = useRef(createDuel()), chase = useRef(createChase()), publication = useRef(0), lastSound = useRef(-1), lifecycle = useRef(0), handoffTime = useRef(0)
  const originVector = useMemo(() => new Vector3(origin.x, origin.y, origin.z), [origin])
  useEffect(() => {
    const camera = getThree().camera
    const lifetime = lifecycle
    const generation = ++lifetime.current
    savedCamera.current ??= { position: camera.position.clone(), quaternion: camera.quaternion.clone(), fov: camera.fov }
    const snapshot = savedCamera.current
    contractRuntime.cameraRestored = false
    return () => { queueMicrotask(() => {
      if (lifetime.current !== generation) return
      if (useCinematic.getState().session?.config.contractRunId === runId) stopCinematic('sequence-exit', true)
      restoreCamera(camera, snapshot)
      clearPlayerInput(); contractRuntime.cameraRestored = true
    }) }
  }, [getThree, runId])
  useEffect(() => {
    const camera = getThree().camera
    if (!Object.hasOwn(nextPhase, phase)) return
    clearPlayerInput()
    const expectedRun = useMissionTwoSequence.getState().runId
    if (useCinematic.getState().session?.config.id === `m2-bounty-${phase}`) return
    const config = { ...contractCinematic(phase, duel.current), contractRunId: runId }
    if (phase === 'outro') {
      // Hold the actual chase camera. Do not fly 180 m back through the course.
      const position = camera.position.clone().sub(originVector).toArray(), rotation = [camera.rotation.x, camera.rotation.y, camera.rotation.z]
      config.camera = [{ at: 0, position, rotation, fov: camera.fov }, { at: config.duration, position, rotation, fov: camera.fov }]
    }
    const started = startCinematic(config, origin, reason => {
      const store = useMissionTwoSequence.getState()
      if (store.runId !== expectedRun || store.phase !== phase) return
      clearPlayerInput()
      if (['completed', 'skipped'].includes(reason)) {
        store.transition(phase, nextPhase[phase])
      } else store.reset()
    })
    if (!started) useMissionTwoSequence.getState().reset()
  }, [phase, origin, getThree, originVector, runId])
  useFrame((state, rawDelta) => {
    const camera = state.camera
    if (usePauseState.getState().paused || !enabled || useCinematic.getState().session) return
    if (phase === 'handoff') {
      handoffTime.current += Math.min(rawDelta, .05)
      restoreCamera(camera, savedCamera.current)
      useMissionTwoSequence.setState({ live: { fade: Math.max(0, 1 - handoffTime.current / .85) } })
      if (handoffTime.current >= .85) useMissionTwoSequence.getState().reset()
      return
    }
    if (!['duel', 'chase'].includes(phase)) return
    const dt = Math.min(rawDelta, .05), input = usePlayerInput.getState()
    if (phase === 'duel') {
      const jump = input.jumpQueued
      consumePlayerJump()
      duel.current = stepDuel(duel.current, { ...input, attack: consumePlayerAttack(), dodge: consumePlayerDodge(), jump }, dt)
      const s = duel.current
      contractRuntime.duel = s
      if (impact.current) {
        const age = s.time - s.enemyHitAt, visible = s.enemyHitAt > 0 && age < .24
        impact.current.visible = visible
        if (visible) {
          impact.current.position.set(s.enemyX, 1.1, s.enemyZ)
          impact.current.quaternion.copy(camera.quaternion)
          impact.current.scale.setScalar(.35 + age * 3)
          impact.current.material.opacity = (1 - age / .24) * .85
        }
      }
      if (s.enemyHitAt > lastSound.current) { lastSound.current = s.enemyHitAt; void playGameSound('bossDamage') }
      if (s.hp <= 0) { clearPlayerInput(); useMissionTwoSequence.getState().fail('The claimant won. Retry without losing campaign progress.'); return }
      if (s.enemyHp <= 0) { clearPlayerInput(); useMissionTwoSequence.getState().transition('duel', 'finish'); return }
      const target = originVector.clone().add(new Vector3(s.x * .5, 6.3, s.z + 10.5))
      camera.position.lerp(target, 1 - Math.exp(-dt * 4)); camera.lookAt(originVector.clone().add(new Vector3((s.x + s.enemyX) / 2, .9, (s.z + s.enemyZ) / 2)))
      if (warning.current) { warning.current.position.set(s.enemyX, .025, s.enemyZ); warning.current.material.color.set(s.enemyStage === 'telegraph' ? '#ff9e45' : s.enemyStage === 'strike' ? '#f04444' : '#76e9dc'); warning.current.scale.setScalar(PATTERNS[s.pattern].range / 2.5) }
      if (partner.current) partner.current.position.set(s.x + 1.6, 2.2 + Math.sin(s.time * 3) * .1, s.z + .5)
    } else {
      consumePlayerAttack(); consumePlayerDodge(); consumePlayerJump()
      chase.current = stepChase(chase.current, input, dt)
      const s = chase.current; contractRuntime.chase = s
      if (vehicle.current) { vehicle.current.position.set(s.x, 0, s.z); vehicle.current.rotation.y = Math.PI - input.moveX * .12 }
      if (courier.current) { courier.current.position.set(courierLane(s.targetZ), 0, s.targetZ); courier.current.rotation.y = Math.PI }
      const target = originVector.clone().add(new Vector3(s.x * .45, 5.5, s.z - 11))
      camera.position.lerp(target, 1 - Math.exp(-dt * 5)); camera.lookAt(originVector.clone().add(new Vector3(s.x * .7, .8, s.z + 9)))
      if (s.integrity <= 0) { clearPlayerInput(); useMissionTwoSequence.getState().fail('Bujji needs a clear line. Retry the contract; your campaign save is unchanged.'); return }
      if (s.lost) { clearPlayerInput(); useMissionTwoSequence.getState().fail('The courier escaped sensor range. Retry or return to the pylons.'); return }
      if (s.z >= TRACK_LENGTH) { clearPlayerInput(); useMissionTwoSequence.getState().complete({ counterHits: duel.current.counterHits, collisions: s.collisions, time: s.time }); return }
    }
    if (camera.fov !== 48) { camera.fov = 48; camera.updateProjectionMatrix() }
    publication.current += dt
    if (publication.current >= .1) { publication.current = 0; useMissionTwoSequence.setState({ live: phase === 'duel' ? { hp: duel.current.hp, enemyHp: duel.current.enemyHp, tell: duel.current.enemyStage, pattern: PATTERNS[duel.current.pattern].name } : { integrity: chase.current.integrity, distance: chase.current.z, speed: chase.current.speed, gap: Math.max(0, chase.current.targetZ - chase.current.z) } }) }
  })
  return <group position={[origin.x, origin.y, origin.z]}>
    {phase === 'duel' && <Suspense fallback={null}>
      <ContractActor source="/models/bhairava-free-rig.glb?v=4" hero runtime={duel} enabled={enabled} />
      <ContractActor source="/models/soldier-source.glb" runtime={duel} enabled={enabled} />
      <mesh ref={warning} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[2.35, 2.5, 32]} /><meshBasicMaterial color="#ff9e45" transparent opacity={.65} /></mesh>
      <mesh ref={impact} visible={false}><ringGeometry args={[.75, 1, 16]} /><meshBasicMaterial color="#ffe0a0" transparent opacity={0} depthWrite={false} /></mesh>
      <mesh ref={partner}><sphereGeometry args={[.16, 12, 8]} /><meshStandardMaterial color="#70f5e8" emissive="#70baba" emissiveIntensity={1} /></mesh>
    </Suspense>}
    {['chaseIntro', 'chase', 'outro'].includes(phase) && <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -.02, TRACK_LENGTH / 2]} receiveShadow><planeGeometry args={[14, TRACK_LENGTH + 35]} /><meshStandardMaterial color="#39394b" roughness={.75} /></mesh>
      <GroundVehicle vehicleRef={vehicle} />
      <GroundVehicle vehicleRef={courier} courier />
      {Array.from({ length: 24 }, (_, i) => <group key={`road-${i}`} position={[0, 0, i * 8]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, .005, 0]}><planeGeometry args={[.12, 3]} /><meshStandardMaterial color="#a4a08b" roughness={1} /></mesh>
        {[-1, 1].map(side => <mesh key={side} position={[side * (8 + i % 3), .8 + i % 2, 0]} rotation={[.2, i * .7, side * .3]} castShadow><octahedronGeometry args={[1 + (i % 3) * .3, 0]} /><meshStandardMaterial color={i % 2 ? '#566b79' : '#776852'} metalness={.35} roughness={.75} /></mesh>)}
      </group>)}
      {TRACK_OBSTACLES.map(o => <mesh key={o.id} position={[o.x, .7, o.z]} castShadow><boxGeometry args={[o.halfX * 2, 1.4, o.halfZ * 2]} /><meshStandardMaterial color="#b87748" roughness={.8} /></mesh>)}
      {[-1, 1].map(side => <mesh key={side} position={[side * 6.7, .2, TRACK_LENGTH / 2]}><boxGeometry args={[.2, .4, TRACK_LENGTH + 15]} /><meshStandardMaterial color="#7f9bcb" emissive="#1a304c" /></mesh>)}
      <mesh position={[0, 2, TRACK_LENGTH]}><boxGeometry args={[12, .2, .2]} /><meshBasicMaterial color="#6deacb" /></mesh>
    </>}
  </group>
}
