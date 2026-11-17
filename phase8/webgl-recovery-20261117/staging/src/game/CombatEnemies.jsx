import { setGameTimeout, clearGameTimeout } from './gameClock.js'
import { gameNow, gameTime } from './gameClock.js'
import { useGameplayFrame } from './cinematics/useGameplayFrame.js'
import { memo, Suspense, useEffect, useRef } from 'react'
import { Sparkles } from '@react-three/drei'
import {
  CapsuleCollider,
  RigidBody,
  useRapier,
} from '@react-three/rapier'
import { MathUtils } from 'three'
import { playGameSound } from '../audio/audioManager.js'
import {
  ENEMY_TYPES,
  getEnemyStats,
  enemyRuntime,
  getEnemySpawns,
  getEnemyBehavior,
  useCombatState,
} from './combatSystem.js'
import { useCampaignState } from './campaignSystem.js'
import { getPlayerWorldPosition, useGameplayState } from './gameplayStore.js'
import { GAMEPLAY_QUERY_GROUPS } from './collisionGroups.js'
import EnemyArmor from './EnemyArmor.jsx'
import RiggedEnemy from './RiggedEnemy.jsx'
import { movementWithPendingTarget } from './player/kinematicMovement.js'

function EnemyHealthBar({ id, type }) {
  const health = useCombatState((state) => state.enemyHealth[id])
  const targetEnemyId = useCombatState((state) => state.targetEnemyId)
  const visible = targetEnemyId === id || health < getEnemyStats(type).health
  const maximum = getEnemyStats(type).health
  const width = type === 'heavy' || type === 'glassBrute' ? 1.65 : 1.25

  return (
    <group
      position={[0, type === 'heavy' || type === 'glassBrute' ? 3.2 : 2.45, 0]}
      visible={visible && health > 0}
    >
      <mesh>
        <planeGeometry args={[width, 0.1]} />
        <meshBasicMaterial color="#101419" />
      </mesh>
      <mesh position={[-width * (1 - health / maximum) / 2, 0, 0.012]} scale={[health / maximum, 1, 1]}>
        <planeGeometry args={[width, 0.065]} />
        <meshBasicMaterial color={ENEMY_TYPES[type].color} toneMapped={false} />
      </mesh>
    </group>
  )
}

const EnemyModel = memo(function EnemyModel({ type, rootRef, weaponRef, coreRef, motionRef, hitRef }) {
  const missionOne = useCampaignState(s=>s.selectedMissionId==='mission-1')
  const legs = useRef([])
  useGameplayFrame(({ clock }, delta) => {
    legs.current.forEach((leg, index) => {
      if (!leg) return
      const stride = Math.sin(clock.elapsedTime * (type === 'heavy' ? 5 : 8) + index * Math.PI)
      leg.rotation.x = MathUtils.damp(leg.rotation.x, stride * Math.min(0.42, motionRef.current * 0.18), 12, Math.min(delta, 0.05))
    })
  })
  const spec = ENEMY_TYPES[type]
  const heavy = type === 'heavy'
  const scout = type === 'scout'
  const glassEnemy = type === 'glassStalker' || type === 'glassBrute'
  const glassBrute = type === 'glassBrute'

  if (type === 'warrior' || heavy || (missionOne && scout)) {
    return (
      <group ref={rootRef}>
        <group ref={coreRef}>
          <Suspense fallback={null}>
            <RiggedEnemy type={type} motionRef={motionRef} hitRef={hitRef} />
          </Suspense>
        </group>
        <group ref={weaponRef} position={[heavy ? 0.76 : 0.52, heavy ? 1.45 : 1.12, 0]}>
          <mesh castShadow rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.25]}>
            <cylinderGeometry args={[0.045, 0.065, 0.75, 10]} />
            <meshStandardMaterial color="#43494b" metalness={0.8} roughness={0.35} />
          </mesh>
        </group>
      </group>
    )
  }

  return (
    <group ref={rootRef}>
      <group ref={coreRef}>
        <EnemyArmor type={type} />
        {glassEnemy ? (
          <>
            <mesh castShadow position={[0, glassBrute ? 1.45 : 1.1, 0]}>
              <octahedronGeometry args={glassBrute ? [0.92, 1] : [0.58, 1]} />
              <meshPhysicalMaterial
                color={glassBrute ? '#503454' : '#27515a'}
                emissive={spec.color}
                emissiveIntensity={0.45}
                metalness={0.42}
                roughness={0.18}
                transmission={0.18}
                thickness={0.6}
              />
            </mesh>
            <mesh castShadow position={[0, glassBrute ? 1.36 : 0.94, -0.43]} scale={glassBrute ? [1.12, 0.88, 0.48] : [0.56, 1.48, 0.52]}>
              <octahedronGeometry args={[glassBrute ? 0.62 : 0.42, 0]} />
              <meshStandardMaterial
                color={glassBrute ? '#674467' : '#28636b'}
                emissive={spec.color}
                emissiveIntensity={0.18}
                metalness={0.62}
                roughness={0.24}
              />
            </mesh>
            <mesh castShadow position={[0, glassBrute ? 2.37 : 1.78, -0.08]}>
              <octahedronGeometry args={glassBrute ? [0.48, 0] : [0.32, 0]} />
              <meshStandardMaterial color="#1c252d" metalness={0.7} roughness={0.22} />
            </mesh>
            <mesh castShadow position={[0, glassBrute ? 2.61 : 2.05, 0.05]} rotation={[0, 0, Math.PI]}>
              <coneGeometry args={[glassBrute ? 0.38 : 0.22, glassBrute ? 0.72 : 0.64, 5]} />
              <meshStandardMaterial
                color={glassBrute ? '#83599a' : '#45919a'}
                metalness={0.54}
                roughness={0.2}
                emissive={spec.color}
                emissiveIntensity={0.28}
              />
            </mesh>
            <mesh position={[0, glassBrute ? 2.38 : 1.8, -0.36]}>
              <boxGeometry args={[glassBrute ? 0.53 : 0.38, 0.1, 0.045]} />
              <meshStandardMaterial
                color={spec.color}
                emissive={spec.color}
                emissiveIntensity={3}
                toneMapped={false}
              />
            </mesh>
            {[-1, 1].map((side) => (
              <mesh
                key={side}
                castShadow
                position={[side * (glassBrute ? 0.88 : 0.57), glassBrute ? 1.72 : 1.32, 0]}
                rotation={[0, 0, side * 0.12]}
              >
                <coneGeometry args={[glassBrute ? 0.29 : 0.19, glassBrute ? 1.32 : 0.94, 5]} />
                <meshStandardMaterial
                  color={glassBrute ? '#815398' : '#347f87'}
                  metalness={0.56}
                  roughness={0.2}
                />
              </mesh>
            ))}
            {[-1, 1].map((side) => (
              <group key={`glass-limb-${side}`}>
                <mesh
                  castShadow
                  position={[side * (glassBrute ? 0.72 : 0.36), glassBrute ? 0.42 : 0.38, 0.02]}
                  rotation={[0, 0, side * -0.04]}
                >
                  <capsuleGeometry args={[glassBrute ? 0.2 : 0.105, glassBrute ? 0.52 : 0.72, 4, 6]} />
                  <meshStandardMaterial
                    color={glassBrute ? '#403248' : '#24454d'}
                    metalness={0.58}
                    roughness={0.3}
                  />
                </mesh>
                <mesh
                  castShadow
                  position={[side * (glassBrute ? 0.9 : 0.58), glassBrute ? 1.72 : 1.32, 0.02]}
                  rotation={[0, 0, side * 0.18]}
                >
                  <octahedronGeometry args={[glassBrute ? 0.42 : 0.2, 0]} />
                  <meshStandardMaterial
                    color={glassBrute ? '#765184' : '#347f87'}
                    metalness={0.7}
                    roughness={0.19}
                  />
                </mesh>
              </group>
            ))}
            {glassBrute && [-1, 0, 1].map((side) => (
              <mesh
                key={`brute-shard-${side}`}
                castShadow
                position={[side * 0.42, 2.92 - Math.abs(side) * 0.18, 0.28]}
                rotation={[0, 0, side * -0.22]}
              >
                <coneGeometry args={[0.26, 0.86, 5]} />
                <meshStandardMaterial
                  color="#765184"
                  metalness={0.62}
                  roughness={0.2}
                  emissive={spec.color}
                  emissiveIntensity={0.3}
                />
              </mesh>
            ))}
          </>
        ) : scout ? (
          <>
            <mesh castShadow position={[0, 1.16, 0]}>
              <icosahedronGeometry args={[0.56, 1]} />
              <meshStandardMaterial color="#1e4549" metalness={0.75} roughness={0.25} />
            </mesh>
            <mesh castShadow position={[0, 1.65, -0.06]}>
              <octahedronGeometry args={[0.32, 0]} />
              <meshStandardMaterial
                color="#a6fff1"
                emissive={spec.color}
                emissiveIntensity={2.2}
                toneMapped={false}
              />
            </mesh>
            {[-1, 1].map((side) => (
              <mesh
                key={side}
                castShadow
                position={[side * 0.72, 1.12, 0.05]}
                rotation={[0.12, 0, side * -0.3]}
              >
                <coneGeometry args={[0.22, 1.05, 5]} />
                <meshStandardMaterial color="#327e7b" metalness={0.65} roughness={0.27} />
              </mesh>
            ))}
            <mesh castShadow position={[0, 0.54, 0]}>
              <cylinderGeometry args={[0.25, 0.46, 0.42, 6]} />
              <meshStandardMaterial color="#273336" metalness={0.67} roughness={0.35} />
            </mesh>
            <mesh castShadow position={[0, 1.16, -0.47]} rotation={[0.16, 0, 0]}>
              <octahedronGeometry args={[0.28, 0]} />
              <meshStandardMaterial color="#367b78" metalness={0.68} roughness={0.24} />
            </mesh>
            {[-1, 1].map((side) => (
              <group key={`scout-guard-${side}`}>
                <mesh castShadow position={[side * 0.23, 0.72, -0.14]} rotation={[0, 0, side * 0.12]}>
                  <capsuleGeometry args={[0.12, 0.52, 4, 6]} />
                  <meshStandardMaterial color="#27373a" metalness={0.72} roughness={0.28} />
                </mesh>
                <mesh castShadow position={[side * 0.25, 0.31, -0.12]}>
                  <boxGeometry args={[0.2, 0.16, 0.32]} />
                  <meshStandardMaterial color="#3a5554" metalness={0.62} roughness={0.3} />
                </mesh>
              </group>
            ))}
            <mesh castShadow position={[0, 1.96, 0.08]} rotation={[0, 0, Math.PI]}>
              <coneGeometry args={[0.17, 0.62, 5]} />
              <meshStandardMaterial color="#4db9aa" metalness={0.62} roughness={0.22} />
            </mesh>
          </>
        ) : (
          <>
            <mesh castShadow position={[0, heavy ? 1.5 : 1.19, 0]}>
              {heavy ? (
                <dodecahedronGeometry args={[1.02, 1]} />
              ) : (
                <capsuleGeometry args={[0.42, 0.55, 5, 9]} />
              )}
              <meshStandardMaterial
                color={heavy ? '#403248' : '#51423a'}
                metalness={0.72}
                roughness={0.33}
              />
            </mesh>
            <mesh castShadow position={[0, heavy ? 2.38 : 1.95, -0.08]}>
              <boxGeometry args={heavy ? [0.72, 0.48, 0.56] : [0.5, 0.46, 0.45]} />
              <meshStandardMaterial color="#282c32" metalness={0.76} roughness={0.27} />
            </mesh>
            <mesh position={[0, heavy ? 2.4 : 1.98, -0.34]}>
              <boxGeometry args={[heavy ? 0.48 : 0.34, 0.1, 0.045]} />
              <meshStandardMaterial
                color={spec.color}
                emissive={spec.color}
                emissiveIntensity={2.4}
                toneMapped={false}
              />
            </mesh>
            {[-1, 1].map((side) => (
              <mesh
                key={side}
                castShadow
                position={[side * (heavy ? 0.82 : 0.56), heavy ? 1.75 : 1.36, 0]}
              >
                <boxGeometry
                  args={heavy ? [0.62, 0.72, 0.78] : [0.24, 0.72, 0.3]}
                />
                <meshStandardMaterial
                  color={heavy ? '#483849' : '#645044'}
                  metalness={0.7}
                  roughness={0.31}
                />
              </mesh>
            ))}
            {[-1, 1].map((side, index) => (
              <group key={`leg-${side}`} ref={(leg) => { legs.current[index] = leg }} position={[side * 0.27, 0.8, 0]}>
              <mesh castShadow position={[0, -0.42, 0]}>
                <capsuleGeometry args={[heavy ? 0.24 : 0.16, heavy ? 0.42 : 0.4, 4, 7]} />
                <meshStandardMaterial color="#2f3035" metalness={0.65} roughness={0.39} />
              </mesh>
              <mesh castShadow position={[0, -0.69, -0.12]}>
                <boxGeometry args={[heavy ? 0.42 : 0.27, 0.2, heavy ? 0.62 : 0.42]} />
                <meshStandardMaterial color="#424644" metalness={0.65} roughness={0.48} />
              </mesh>
              </group>
            ))}
            <mesh castShadow position={[0, heavy ? 1.52 : 1.22, -0.48]}>
              <boxGeometry args={heavy ? [1.02, 0.82, 0.16] : [0.58, 0.64, 0.13]} />
              <meshStandardMaterial
                color={heavy ? '#54415c' : '#765841'}
                metalness={0.64}
                roughness={0.34}
              />
            </mesh>
            <mesh position={[0, heavy ? 1.56 : 1.28, -0.575]}>
              <boxGeometry args={heavy ? [0.56, 0.15, 0.035] : [0.3, 0.12, 0.035]} />
              <meshStandardMaterial
                color={spec.color}
                emissive={spec.color}
                emissiveIntensity={1.8}
                toneMapped={false}
              />
            </mesh>
            {[-1, 1].map((side) => (
              <group key={`armor-detail-${side}`}>
                <mesh castShadow position={[side * (heavy ? 0.82 : 0.58), heavy ? 2.07 : 1.58, -0.06]} rotation={[0, 0, side * -0.16]}>
                  <boxGeometry args={heavy ? [0.9, 0.3, 0.76] : [0.32, 0.16, 0.42]} />
                  <meshStandardMaterial
                    color={heavy ? '#62506a' : '#77634d'}
                    metalness={0.76}
                    roughness={0.29}
                  />
                </mesh>
                <mesh castShadow position={[side * (heavy ? 0.34 : 0.28), 0.54, -0.2]}>
                  <boxGeometry args={heavy ? [0.38, 0.28, 0.12] : [0.24, 0.18, 0.1]} />
                  <meshStandardMaterial color="#4b4b4b" metalness={0.68} roughness={0.34} />
                </mesh>
              </group>
            ))}
            {heavy && [-1, 0, 1].map((side) => (
              <mesh
                key={`heavy-crest-${side}`}
                castShadow
                position={[side * 0.38, 2.72 - Math.abs(side) * 0.12, 0.04]}
                rotation={[0, 0, side * -0.18]}
              >
                <coneGeometry args={[0.23, 0.78, 5]} />
                <meshStandardMaterial color="#65526b" metalness={0.74} roughness={0.25} />
              </mesh>
            ))}
            {!heavy && (
              <mesh castShadow position={[0, 2.28, 0.02]} rotation={[0, 0, Math.PI]}>
                <coneGeometry args={[0.18, 0.54, 5]} />
                <meshStandardMaterial color="#8f6749" metalness={0.68} roughness={0.28} />
              </mesh>
            )}
          </>
        )}
      </group>

      <group ref={weaponRef} position={[heavy ? 0.76 : 0.52, heavy ? 1.45 : 1.12, 0]}>
        <mesh castShadow position={[0, -0.25, -0.02]}>
          <capsuleGeometry args={[heavy ? 0.17 : 0.095, heavy ? 0.75 : 0.46, 4, 7]} />
          <meshStandardMaterial color="#3a4144" metalness={0.78} roughness={0.25} />
        </mesh>
        <mesh castShadow position={[0, -0.58, 0]}>
          <octahedronGeometry args={[heavy ? 0.39 : 0.2, 0]} />
          <meshStandardMaterial
            color={spec.color}
            emissive={spec.color}
            emissiveIntensity={1.6}
            toneMapped={false}
          />
        </mesh>
      </group>

      <Sparkles
        count={heavy ? 7 : 4}
        scale={heavy ? 1.7 : 1}
        size={2}
        speed={0.35}
        color={spec.color}
        position={[0, heavy ? 1.5 : 1.2, 0]}
      />
    </group>
  )
})

function Enemy({ enemy }) {
  const { id, type, position: spawnPosition, phase } = enemy
  const spec = getEnemyStats(type)
  const bodyRef = useRef(null)
  const modelRef = useRef(null)
  const windupRing = useRef(null)
  const glowRef = useRef(null)
  const weaponRef = useRef(null)
  const coreRef = useRef(null)
  const controllerRef = useRef(null)
  const nextAttackAt = useRef(0)
  const attackStateRef = useRef({
    phase: 'idle',
    startedAt: 0,
    strikeAt: 0,
    recoverAt: 0,
    damageApplied: false,
  })
  const wasDetected = useRef(false)
  const defeatedAt = useRef(null)
  const pendingTranslation = useRef(null)
  const motionRef = useRef(0)
  const hitRef = useRef(0)
  const lastRoundId = useRef(useCombatState.getState().roundId)
  const { world, rapier } = useRapier()
  const defeated = useCombatState((state) => state.defeatedEnemyIds.includes(id))
  const roundId = useCombatState((state) => state.roundId)

  function updateGlow(model) {
    const glow = glowRef.current
    if (!glow) return
    // Keep the shader light count fixed when the defeated model disappears.
    // The sibling light follows exactly the former model-local transform.
    model.updateMatrix()
    glow.position.set(0, 1.65, 0).applyMatrix4(model.matrix)
    glow.intensity = model.visible ? (type === 'glassBrute' ? 2.2 : 1.2) : 0
  }

  useEffect(() => {
    const controller = world.createCharacterController(0.03)
    controller.enableAutostep(0.3, 0.2, false)
    controller.enableSnapToGround(0.18)
    controllerRef.current = controller
    enemyRuntime.set(id, {
      id,
      type,
      position: { x: spawnPosition[0], y: spawnPosition[1], z: spawnPosition[2] },
      alive: true,
    })

    return () => {
      world.removeCharacterController(controller)
      controllerRef.current = null
      enemyRuntime.delete(id)
    }
  }, [id, spawnPosition, type, world])

  useGameplayFrame(({ clock }, rawDelta) => {
    const body = bodyRef.current
    const controller = controllerRef.current
    const model = modelRef.current
    if (!body || !controller || !model) return
    if (defeated) {
      if (windupRing.current) windupRing.current.visible = false
      pendingTranslation.current = null
      motionRef.current = 0
      defeatedAt.current ??= clock.elapsedTime
      const age = clock.elapsedTime - defeatedAt.current
      const fall = Math.min(1, age / 0.75)
      model.rotation.z = -Math.PI * 0.46 * fall * fall
      model.position.y = -fall * 0.25
      model.visible = age < 1.3
      updateGlow(model)
      return
    }

    if (lastRoundId.current !== roundId) {
      pendingTranslation.current = null
      lastRoundId.current = roundId
      body.setTranslation(
        { x: spawnPosition[0], y: spawnPosition[1], z: spawnPosition[2] },
        true,
      )
      nextAttackAt.current = 0
      attackStateRef.current = {
        phase: 'idle',
        startedAt: 0,
        strikeAt: 0,
        recoverAt: 0,
        damageApplied: false,
      }
      wasDetected.current = false
      defeatedAt.current = null
      model.visible = true
      model.position.set(0, 0, 0)
      model.scale.setScalar(1)
      model.rotation.set(0, 0, 0)
    }

    const delta = Math.min(rawDelta, 1 / 30)
    const current = body.translation()
    const player = getPlayerWorldPosition()
    const dx = player.x - current.x
    const dz = player.z - current.z
    const distance = Math.hypot(dx, dz)
    const playerAlive = !useGameplayState.getState().gameOver
    const behavior = getEnemyBehavior(type, distance, playerAlive)
    const detected = behavior !== 'patrol'
    const chasing = behavior === 'chase'
    const now = gameNow()

    if (detected && !wasDetected.current) void playGameSound('enemyEncounter')
    wasDetected.current = detected

    let moveX = 0
    let moveZ = 0
    if (chasing) {
      const safeDistance = Math.max(distance, 0.001)
      const orbit = type === 'glassStalker' && distance < 8
        ? Math.sin(clock.elapsedTime * 1.35 + phase) * 0.42
        : 0
      moveX = (dx / safeDistance - (dz / safeDistance) * orbit) * spec.speed
      moveZ = (dz / safeDistance + (dx / safeDistance) * orbit) * spec.speed

      // Keep groups from collapsing into a single pile while they converge.
      let separationX = 0
      let separationZ = 0
      for (const [otherId, other] of enemyRuntime) {
        if (otherId === id || !other.alive) continue
        const awayX = current.x - other.position.x
        const awayZ = current.z - other.position.z
        const awayDistance = Math.hypot(awayX, awayZ)
        if (awayDistance > 0.001 && awayDistance < 1.8) {
          const strength = (1.8 - awayDistance) / 1.8
          separationX += (awayX / awayDistance) * strength
          separationZ += (awayZ / awayDistance) * strength
        }
      }
      moveX += separationX * spec.speed * 0.72
      moveZ += separationZ * spec.speed * 0.72
      const moveLength = Math.hypot(moveX, moveZ)
      const maxMoveSpeed = spec.speed * 1.3
      if (moveLength > maxMoveSpeed) {
        moveX = (moveX / moveLength) * maxMoveSpeed
        moveZ = (moveZ / moveLength) * maxMoveSpeed
      }
      model.rotation.y = MathUtils.damp(model.rotation.y, Math.atan2(-dx, -dz), 10, delta)
    } else if (!chasing) {
      const patrolX =
        spawnPosition[0] + Math.sin(clock.elapsedTime * 0.42 + phase) * spec.patrolRadius
      const patrolZ =
        spawnPosition[2] + Math.cos(clock.elapsedTime * 0.29 + phase) * spec.patrolRadius * 0.32
      const patrolXDelta = patrolX - current.x
      const patrolZDelta = patrolZ - current.z
      const patrolDistance = Math.hypot(patrolXDelta, patrolZDelta)
      if (patrolDistance > 0.12) {
        moveX = (patrolXDelta / patrolDistance) * spec.speed * 0.48
        moveZ = (patrolZDelta / patrolDistance) * spec.speed * 0.48
        model.rotation.y = MathUtils.damp(
          model.rotation.y,
          Math.atan2(-patrolXDelta, -patrolZDelta),
          5,
          delta,
        )
      }
    }

    const bodyCollider = body.collider(0)
    motionRef.current = Math.hypot(moveX, moveZ)
    controller.computeColliderMovement(
      bodyCollider,
      movementWithPendingTarget(current, pendingTranslation.current, { x: moveX * delta, y: 0, z: moveZ * delta }),
      undefined,
      undefined,
      (obstacle) => obstacle.handle !== bodyCollider.handle,
    )
    const movement = controller.computedMovement()
    const nextPosition = {
      x: current.x + movement.x,
      y: current.y + movement.y,
      z: current.z + movement.z,
    }
    pendingTranslation.current = nextPosition
    body.setNextKinematicTranslation(nextPosition)

    let runtime = enemyRuntime.get(id)
    if (!runtime) {
      runtime = { id, type, position: { x: 0, y: 0, z: 0 }, alive: true }
      enemyRuntime.set(id, runtime)
    }
    runtime.position.x = nextPosition.x
    runtime.position.y = nextPosition.y
    runtime.position.z = nextPosition.z

    if (modelRef.current) {
      const hitAge = now - (useCombatState.getState().enemyHitAt[id] ?? 0)
      hitRef.current = useCombatState.getState().enemyHitAt[id] ?? 0
      const hitPulse = hitAge >= 0 && hitAge < 220
        ? Math.sin((hitAge / 220) * Math.PI) * 0.14
        : 0
      modelRef.current.position.y =
        Math.sin(clock.elapsedTime * (chasing ? 7 : 3) + phase) * 0.035
      modelRef.current.position.x = MathUtils.damp(modelRef.current.position.x, 0, 12, delta)
      modelRef.current.rotation.x = -hitPulse * 1.3
    }

    const attackState = attackStateRef.current
    if (windupRing.current) {
      windupRing.current.visible = useCampaignState.getState().selectedMissionId === 'mission-1' && attackState.phase === 'windup'
      windupRing.current.material.opacity = .2 + .35*Math.min(1,(now-attackState.startedAt)/Math.max(1,spec.attackCooldown*.38))
    }
    const attackPrepMs = Math.max(200, spec.attackCooldown * 0.38)
    const attackRecoveryMs = 180

    if (behavior === 'attack') {
      if (attackState.phase === 'idle' && now >= nextAttackAt.current) {
        attackState.phase = 'windup'
        attackState.startedAt = now
        attackState.strikeAt = now + attackPrepMs
        attackState.recoverAt = attackState.strikeAt + attackRecoveryMs
        attackState.damageApplied = false
      }

      if (attackState.phase === 'windup' && now >= attackState.strikeAt) {
        attackState.phase = 'strike'
      }

      if (attackState.phase === 'strike' && !attackState.damageApplied) {
        const originY = current.y + (type === 'heavy' ? 1.5 : 1.15)
        const directionY = player.y + 1.12 - originY
        const rayDistance = Math.hypot(distance, directionY)
        const directionLength = rayDistance || 1
        const ray = new rapier.Ray(
          { x: current.x, y: originY, z: current.z },
          { x: dx / directionLength, y: directionY / directionLength, z: dz / directionLength },
        )
        const obstruction = world.castRay(
          ray,
          rayDistance,
          true,
          undefined,
          GAMEPLAY_QUERY_GROUPS,
          bodyCollider,
          body,
        )
        const lineClear = !obstruction || obstruction.timeOfImpact >= rayDistance - 0.42
        if (lineClear) {
          useGameplayState.getState().takeDamage(spec.attackDamage)
          if (modelRef.current) {
            modelRef.current.position.x = current.x + (dx / Math.max(distance, 0.001)) * 0.24
          }
        }
        attackState.damageApplied = true
      }

      if (attackState.phase === 'strike' && now >= attackState.recoverAt) {
        attackState.phase = 'recover'
      }

      if (attackState.phase === 'recover' && now >= attackState.recoverAt + 220) {
        attackState.phase = 'idle'
        nextAttackAt.current = now + spec.attackCooldown
      }
    } else {
      attackState.phase = 'idle'
      attackState.damageApplied = false
      nextAttackAt.current = Math.max(nextAttackAt.current, now + 80)
    }

    if (weaponRef.current) {
      let swingStrength = 0
      if (attackState.phase === 'windup') {
        const phase = Math.min(1, (now - attackState.startedAt) / Math.max(1, attackPrepMs))
        swingStrength = Math.sin(phase * Math.PI)
      } else if (attackState.phase === 'strike') {
        swingStrength = 1
      } else if (attackState.phase === 'recover') {
        const phase = Math.min(1, (now - attackState.recoverAt) / attackRecoveryMs)
        swingStrength = Math.sin((1 - phase) * Math.PI)
      }
      weaponRef.current.rotation.z = -swingStrength * (type === 'heavy' ? 1.3 : 0.95)
      weaponRef.current.rotation.x = swingStrength * 0.42
    }

    updateGlow(model)
  })

  return (
    <RigidBody
      ref={bodyRef}
      type="kinematicPosition"
      position={spawnPosition}
      colliders={false}
      enabledRotations={[false, false, false]}
      name={`enemy-${type}`}
      userData={{ cameraActor: true }}
    >
      <CapsuleCollider
        enabled={!defeated}
        args={[
          type === 'heavy' || type === 'glassBrute' ? 0.68 : 0.48,
          type === 'heavy' || type === 'glassBrute' ? 0.72 : 0.43,
        ]}
        position={[0, type === 'heavy' || type === 'glassBrute' ? 1.4 : 0.91, 0]}
        collisionGroups={0x00020001}
        friction={0}
      />
      <EnemyModel
        type={type}
        rootRef={modelRef}
        weaponRef={weaponRef}
        coreRef={coreRef}
        motionRef={motionRef}
        hitRef={hitRef}
      />
      <mesh ref={windupRing} visible={false} rotation={[-Math.PI/2,0,0]} position={[0,.035,0]}>
        <ringGeometry args={[spec.attackRange*.88,spec.attackRange,40]} />
        <meshBasicMaterial color="#e9ad5b" transparent opacity={.35} depthWrite={false} toneMapped={false} />
      </mesh>
      {type !== 'warrior' && type !== 'heavy' && (
        <pointLight
          ref={glowRef}
          color={spec.color}
          intensity={type === 'glassBrute' ? 2.2 : 1.2}
          distance={type === 'glassBrute' ? 4 : 2.8}
          position={[0, 1.65, 0]}
        />
      )}
      <EnemyHealthBar id={id} type={type} />
    </RigidBody>
  )
}

function CombatEffect({ effect }) {
  const particlesRef = useRef([])

  useEffect(() => {
    const timer = setGameTimeout(
      () => useCombatState.getState().removeEffect(effect.id),
      effect.duration * 1000,
    )
    return () => clearGameTimeout(timer)
  }, [effect.duration, effect.id])

  useGameplayFrame(() => {
    const age = Math.max(0, gameTime() / 1000 - effect.createdAt)
    const progress = Math.min(1, age / effect.duration)
    particlesRef.current.forEach((particle, index) => {
      if (!particle) return
      const angle = (index / particlesRef.current.length) * Math.PI * 2
      const speed = effect.type === 'defeat' ? 1.8 : 1.25
      const distance = progress * speed * (0.65 + (index % 3) * 0.2)
      particle.position.set(
        Math.cos(angle) * distance,
        Math.sin(angle * 2) * distance * 0.55 + progress * 0.8,
        Math.sin(angle) * distance,
      )
      particle.scale.setScalar(Math.max(0.01, (1 - progress) * 0.17))
      particle.material.opacity = 1 - progress
    })
  })

  const particleCount = effect.type === 'defeat' ? 14 : 8
  return (
    <group position={[effect.position.x, effect.position.y, effect.position.z]}>
      {Array.from({ length: particleCount }, (_, index) => (
        <mesh
          key={index}
          ref={(mesh) => {
            particlesRef.current[index] = mesh
          }}
        >
          <icosahedronGeometry args={[1, 0]} />
          <meshBasicMaterial
            color={effect.color}
            transparent
            opacity={1}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  )
}

function CombatEnemies() {
  const effects = useCombatState((state) => state.effects)
  const missionId = useCampaignState((state) => state.selectedMissionId)
  const enemySpawns = getEnemySpawns(missionId)

  useEffect(() => {
    return useGameplayState.subscribe((state, previousState) => {
      if (state.roundId !== previousState.roundId) {
        useCombatState.getState().restart()
      }
    })
  }, [])

  return (
    <group>
      {enemySpawns.map((enemy) => (
        <Enemy key={enemy.id} enemy={enemy} />
      ))}
      {effects.map((effect) => (
        <CombatEffect key={effect.id} effect={effect} />
      ))}
    </group>
  )
}

export default CombatEnemies
