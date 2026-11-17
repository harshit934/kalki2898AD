import ArcBossFight from './phase54e/ArcBossFight.jsx'
import { arcBossFor } from './phase54e/arcBosses.js'
import { setGameTimeout, clearGameTimeout } from './gameClock.js'
import { gameNow, gameTime } from './gameClock.js'
import { useGameplayFrame } from './cinematics/useGameplayFrame.js'
import { Suspense, useEffect, useRef } from 'react'
import MissionOneWarden from './MissionOneWarden.jsx'
import MissionOneProp from './MissionOneProp.jsx'
import { Sparkles } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { scheduleMaterialWarmup } from './shaderWarmup.js'
import { useCinematic } from './cinematics/controller.js'
import {
  CapsuleCollider,
  CuboidCollider,
  RigidBody,
  useRapier,
} from '@react-three/rapier'
import { MathUtils } from 'three'
import { playGameSound } from '../audio/audioManager.js'
import { getPlayerWorldPosition, useGameplayState } from './gameplayStore.js'
import { getEnemySpawns, useCombatState } from './combatSystem.js'
import {
  BOSS_ARENA,
  bossRuntime,
  getBossPhases,
  useBossState,
} from './bossSystem.js'
import { useCampaignState } from './campaignSystem.js'
import { MISSION_TWO_PYLONS } from './missionTwoContent.js'
import { MISSION_TWO_ENEMY_SPAWNS } from './combatSystem.js'
import { EXPANSION_MISSIONS } from './missionExpansionContent.js'
import { GAMEPLAY_QUERY_GROUPS } from './collisionGroups.js'
import { BOSS_MELEE_RADIUS, bossMeleeContains } from './bossHitZones.js'
import { movementWithPendingTarget } from './player/kinematicMovement.js'

const BOSS_DAMAGE = 10
const BOSS_HEIGHT = 4.5

function BossModel({ bodyRef, weaponRef, coreRef, crownRef, phase = 1, prismBoss = false, missionId,visible=true }) {
  if(missionId==='mission-1')return <MissionOneWarden bodyRef={bodyRef} weaponRef={weaponRef} coreRef={coreRef} crownRef={crownRef} phase={phase} visible={visible} />
  const armor = prismBoss ? '#39314f' : '#292b39'
  const brightArmor = prismBoss ? '#665384' : '#4c4a60'
  const expansionAccent = missionId === 'mission-3'
    ? '#f0a75c'
    : missionId === 'mission-4'
      ? '#e37a49'
      : '#91c5d0'
  const emissive = prismBoss
    ? phase === 3 ? '#ff8bdf' : '#a990ff'
    : phase === 3 ? '#ff7a6c' : phase === 2 ? '#70f5cf' : '#55e8df'
  const glowIntensity = 1 + (phase - 1) * 0.7

  return (
    <group ref={bodyRef}>
      <group visible={visible}>
      <group ref={coreRef} visible={!prismBoss}>
        <mesh castShadow position={[0, 2.15, 0]}>
          <dodecahedronGeometry args={[1.18, 1]} />
          <meshStandardMaterial color={armor} metalness={0.82} roughness={0.25} />
        </mesh>
        <mesh castShadow position={[0, 2.65, -0.02]}>
          <boxGeometry args={[1.25, 0.72, 0.86]} />
          <meshStandardMaterial color={brightArmor} metalness={0.88} roughness={0.22} />
        </mesh>
        <mesh castShadow position={[0, 3.13, -0.1]}>
          <dodecahedronGeometry args={[0.54, 1]} />
          <meshStandardMaterial color="#333846" metalness={0.76} roughness={0.24} />
        </mesh>
        <mesh position={[0, 3.15, -0.52]}>
          <boxGeometry args={[0.65, 0.13, 0.08]} />
          <meshStandardMaterial
            color={phase === 3 ? '#ff8e74' : '#ff6a73'}
            emissive={phase === 3 ? '#ff5b42' : '#ff354c'}
            emissiveIntensity={2.2 * glowIntensity}
            toneMapped={false}
          />
        </mesh>
        <mesh castShadow position={[0, 2.13, -0.95]}>
          <octahedronGeometry args={[0.64, 1]} />
          <meshStandardMaterial
            color="#d5fff8"
            emissive={emissive}
            emissiveIntensity={3.5 * glowIntensity}
            metalness={0.42}
            roughness={0.16}
            toneMapped={false}
          />
        </mesh>
        <mesh position={[0, 2.13, -0.97]} rotation={[0, 0, Math.PI / 4]}>
          <torusGeometry args={[0.88, 0.07, 8, 24]} />
          <meshBasicMaterial color="#79fff2" toneMapped={false} />
        </mesh>
        {[-1, 1].map((side) => (
          <group key={side}>
            <mesh castShadow position={[side * 1.25, 2.82, 0.05]} rotation={[0, 0, side * -0.12]}>
              <boxGeometry args={[1.02, 0.88, 1.08]} />
              <meshStandardMaterial color={brightArmor} metalness={0.79} roughness={0.3} />
            </mesh>
            <mesh position={[side * 1.3, 2.8, -0.53]}>
              <boxGeometry args={[0.76, 0.1, 0.06]} />
              <meshStandardMaterial
                color={emissive}
                emissive={emissive}
                  emissiveIntensity={1.8 * glowIntensity}
                toneMapped={false}
              />
            </mesh>
            <mesh castShadow position={[side * 1.82, 1.57, 0.03]}>
              <capsuleGeometry args={[0.31, 0.88, 5, 9]} />
              <meshStandardMaterial color={armor} metalness={0.78} roughness={0.33} />
            </mesh>
            <mesh castShadow position={[side * 0.6, 0.65, 0.04]}>
              <capsuleGeometry args={[0.36, 0.74, 5, 9]} />
              <meshStandardMaterial color={armor} metalness={0.76} roughness={0.33} />
            </mesh>
            <mesh castShadow position={[side * 0.6, 0.2, -0.17]}>
              <boxGeometry args={[0.85, 0.32, 1.18]} />
              <meshStandardMaterial color="#202430" metalness={0.7} roughness={0.4} />
            </mesh>
            <mesh castShadow position={[side * 1.36, 2.08, 0.15]} rotation={[0, 0, side * 0.22]}>
              <coneGeometry args={[0.36, 1.36, 5]} />
              <meshStandardMaterial color="#5b5063" metalness={0.81} roughness={0.22} />
            </mesh>
          </group>
        ))}
        <mesh ref={crownRef} castShadow position={[0, 3.77, 0.12]}>
          <cylinderGeometry args={[0.38, 0.68, 0.54, 8]} />
          <meshStandardMaterial color="#343947" metalness={0.84} roughness={0.22} />
        </mesh>
        {[-1, 0, 1].map((index) => (
          <mesh key={`crest-${index}`} castShadow position={[index * 0.42, 4.22 + (index === 0 ? 0.28 : 0), 0.12]}>
            <coneGeometry args={[0.2, index === 0 ? 1.12 : 0.78, 5]} />
            <meshStandardMaterial color="#6e5967" metalness={0.75} roughness={0.23} />
          </mesh>
        ))}
        {missionId === 'mission-3' && (
          <group>
            <mesh castShadow position={[0, 2.45, -1.03]} rotation={[0.05, 0, 0]}>
              <boxGeometry args={[1.3, 0.92, 0.18]} />
              <meshStandardMaterial color="#69513f" metalness={0.7} roughness={0.4} />
            </mesh>
            <mesh position={[0, 2.48, -1.135]}>
              <boxGeometry args={[0.88, 0.11, 0.035]} />
              <meshStandardMaterial
                color={expansionAccent}
                emissive={expansionAccent}
                emissiveIntensity={1.5}
                toneMapped={false}
              />
            </mesh>
            {[-1, 1].map((side) => (
              <mesh key={`contract-pauldron-${side}`} castShadow position={[side * 1.3, 3.16, -0.03]} rotation={[0, 0, side * -0.18]}>
                <boxGeometry args={[1.05, 0.34, 0.84]} />
                <meshStandardMaterial color="#786048" metalness={0.66} roughness={0.38} />
              </mesh>
            ))}
          </group>
        )}
        {missionId === 'mission-4' && (
          <group>
            <mesh castShadow position={[0, 2.18, -1.18]} rotation={[0, 0, Math.PI / 2]}>
              <coneGeometry args={[0.56, 1.82, 6]} />
              <meshStandardMaterial color="#57515a" metalness={0.82} roughness={0.3} />
            </mesh>
            {[-1, 1].map((side) => (
              <group key={`convoy-engine-${side}`} position={[side * 1.45, 3.12, 0.12]}>
                <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[0.34, 0.42, 1.12, 8]} />
                  <meshStandardMaterial color="#55505b" metalness={0.78} roughness={0.34} />
                </mesh>
                <mesh position={[side * 0.58, 0, 0]}>
                  <torusGeometry args={[0.28, 0.055, 6, 12]} />
                  <meshStandardMaterial color={expansionAccent} emissive={expansionAccent} emissiveIntensity={1.1} />
                </mesh>
              </group>
            ))}
          </group>
        )}
        {missionId === 'mission-5' && (
          <group>
            {[-1, 1].map((side) => (
              <group key={`tier-array-${side}`} position={[side * 1.95, 3.28, 0.16]}>
                <mesh castShadow rotation={[0, 0, side * -0.12]}>
                  <boxGeometry args={[0.26, 1.68, 0.3]} />
                  <meshStandardMaterial color="#465c66" metalness={0.76} roughness={0.3} />
                </mesh>
                <mesh position={[0, 0.15, -0.18]}>
                  <boxGeometry args={[0.08, 1.28, 0.045]} />
                  <meshBasicMaterial color={expansionAccent} toneMapped={false} />
                </mesh>
              </group>
            ))}
            <mesh castShadow position={[0, 4.82, 0.12]}>
              <coneGeometry args={[0.26, 1.18, 6]} />
              <meshStandardMaterial color="#71838a" metalness={0.78} roughness={0.24} />
            </mesh>
          </group>
        )}
      </group>

      {prismBoss && (
        <group>
          <mesh castShadow position={[0, 2.35, 0]}>
            <octahedronGeometry args={[1.62, 1]} />
            <meshPhysicalMaterial
              color="#7561a5"
              emissive={emissive}
              emissiveIntensity={1.05 * glowIntensity}
              metalness={0.38}
              roughness={0.11}
              transmission={0.17}
              thickness={1.4}
            />
          </mesh>
          <mesh castShadow position={[0, 2.42, -0.88]}>
            <octahedronGeometry args={[0.72, 0]} />
            <meshStandardMaterial
              color="#e0d2ff"
              emissive={emissive}
              emissiveIntensity={3.4 * glowIntensity}
              metalness={0.24}
              roughness={0.12}
              toneMapped={false}
            />
          </mesh>
          <mesh position={[0, 2.42, -0.95]} rotation={[0, 0, Math.PI / 4]}>
            <torusGeometry args={[0.98, 0.075, 8, 24]} />
            <meshBasicMaterial color="#d5c5ff" toneMapped={false} />
          </mesh>
          {[-1, 1].map((side) => (
            <group key={side} position={[side * 1.45, 2.35, 0.04]}>
              <mesh castShadow rotation={[0.18, 0, side * -0.24]}>
                <octahedronGeometry args={[0.72, 0]} />
                <meshStandardMaterial
                  color={side === -1 ? '#4e7892' : '#805e9c'}
                  metalness={0.62}
                  roughness={0.18}
                />
              </mesh>
              <mesh position={[0, -0.68, 0]} rotation={[0, 0, side * 0.2]}>
                <coneGeometry args={[0.25, 1.18, 5]} />
                <meshStandardMaterial
                  color="#c5afff"
                  emissive={emissive}
                  emissiveIntensity={1.5 * glowIntensity}
                  metalness={0.48}
                  roughness={0.17}
                />
              </mesh>
            </group>
          ))}
          {[-1, 1].map((side) => (
            <mesh
              key={`crest-${side}`}
              castShadow
              position={[side * 0.66, 3.86, 0.06]}
              rotation={[0, 0, side * -0.12]}
            >
              <coneGeometry args={[0.32, 1.25, 5]} />
              <meshStandardMaterial color="#a28acb" metalness={0.65} roughness={0.2} />
            </mesh>
          ))}
          <mesh castShadow position={[0, 0.64, 0.04]} rotation={[0, 0, Math.PI / 2]}>
            <coneGeometry args={[0.48, 1.58, 6]} />
            <meshStandardMaterial color="#403650" metalness={0.7} roughness={0.24} />
          </mesh>
          <mesh position={[0, 0.32, -0.3]}>
            <torusGeometry args={[1.25, 0.045, 6, 32]} />
            <meshBasicMaterial color="#b4a1ff" toneMapped={false} />
          </mesh>
        </group>
      )}
      {!prismBoss && <group ref={weaponRef} position={[2.15, 2.25, -0.05]}>
        <mesh castShadow position={[0.14, -0.2, 0]}>
          <capsuleGeometry args={[0.2, 1.35, 5, 8]} />
          <meshStandardMaterial color="#444755" metalness={0.88} roughness={0.22} />
        </mesh>
        <mesh castShadow position={[0.18, -1.02, -0.02]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.62, 1.75, 5]} />
          <meshStandardMaterial
            color="#a9fff5"
            emissive={emissive}
            emissiveIntensity={1.6}
            metalness={0.52}
            roughness={0.18}
            toneMapped={false}
          />
        </mesh>
        <mesh castShadow position={[0.14, -0.2, -0.03]}>
          <torusGeometry args={[0.4, 0.055, 6, 14]} />
          <meshBasicMaterial color="#8ffff1" toneMapped={false} />
        </mesh>
      </group>}
      <Sparkles count={prismBoss ? 32 : 18} scale={prismBoss ? [5.4, 5.2, 3] : [4.5, 4.6, 2.5]} size={2.1} speed={0.35} color={emissive} position={[0, 2.2, 0]} />
      </group>
      <pointLight color={emissive} intensity={visible ? 7 * glowIntensity : 0} distance={9} position={[0, 2.2, 1.1]} />
      <pointLight color="#ff5c69" intensity={visible ? 3 * glowIntensity : 0} distance={5} position={[0, 3.2, 0.2]} />
    </group>
  )
}

function BossEffect({ effect }) {
  const particles = useRef([])

  useEffect(() => {
    const timer = setGameTimeout(
      () => useBossState.getState().removeEffect(effect.id),
      effect.duration * 1000,
    )
    return () => clearGameTimeout(timer)
  }, [effect.duration, effect.id])

  useGameplayFrame(() => {
    const progress = Math.min(
      1,
      Math.max(0, (gameTime() / 1000 - effect.createdAt) / effect.duration),
    )
    particles.current.forEach((particle, index) => {
      if (!particle) return
      const angle = (index / particles.current.length) * Math.PI * 2
      const radius = progress * (effect.type === 'defeat' ? 3.2 : 1.1)
      particle.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle * 2) * radius * 0.45 + progress * 1.8,
        Math.sin(angle) * radius,
      )
      particle.scale.setScalar(Math.max(0.01, (1 - progress) * 0.28))
      particle.material.opacity = 1 - progress
    })
  })

  const count = effect.type === 'defeat' ? 24 : 12
  return (
    <group position={[effect.position.x, effect.position.y, effect.position.z]}>
      {Array.from({ length: count }, (_, index) => (
        <mesh
          key={index}
          ref={(mesh) => {
            particles.current[index] = mesh
          }}
        >
          <icosahedronGeometry args={[1, 0]} />
          <meshBasicMaterial color={effect.color} transparent opacity={1} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

function BossWarning({ attack }) {
  const warningRef = useRef(null)
  const pulseRef = useRef(null)
  const lineRef = useRef(null)

  useGameplayFrame(({ clock }) => {
    if (!attack) return
    const progress = MathUtils.clamp(
      (clock.elapsedTime - attack.startedAt) / (attack.telegraphMs / 1000),
      0,
      1,
    )
    const pulse = 0.65 + Math.sin(clock.elapsedTime * 14) * 0.18
    if (lineRef.current) lineRef.current.material.opacity = 0.5 + pulse * 0.3
    if (!warningRef.current) return
    warningRef.current.material.opacity = 0.45 + pulse * 0.22
    if (attack.type === 'shockwave') {
      const radius = 0.7 + progress * 5.5
      warningRef.current.scale.set(radius, radius, 1)
      if (pulseRef.current) {
        const secondaryRadius = 1.2 + progress * 5.1
        pulseRef.current.scale.set(secondaryRadius, secondaryRadius, 1)
        pulseRef.current.material.opacity = 0.18 + (1 - progress) * 0.34
      }
    } else if (attack.type === 'prism-pulse') {
      warningRef.current.scale.setScalar(1 + pulse * 0.04)
      if (pulseRef.current) pulseRef.current.material.opacity = 0.16 + (1 - progress) * 0.3
    } else if (attack.type === 'melee') {
      // The strike is radial around the locked boss origin, not around the
      // player's old position. Keep its outer edge equal to the damage radius.
      warningRef.current.scale.setScalar(BOSS_MELEE_RADIUS / 1.08)
      if (pulseRef.current) pulseRef.current.scale.setScalar((BOSS_MELEE_RADIUS / 0.7) * progress)
    } else if (attack.type !== 'needle-line') {
      warningRef.current.scale.set(1 + progress * 2.2, 1 + progress * 2.2, 1)
      if (pulseRef.current) {
        pulseRef.current.scale.set(1.5 + progress * 2.5, 1.5 + progress * 2.5, 1)
        pulseRef.current.material.opacity = 0.14 + (1 - progress) * 0.22
      }
    }
  })

  if (!attack) return null
  const areaAttack = attack.type === 'shockwave' || attack.type === 'prism-pulse'
  const needleAttack = attack.type === 'needle-line'
  const position = areaAttack || attack.type === 'melee'
    ? [attack.origin.x, 0.02, attack.origin.z]
    : needleAttack
      ? [attack.origin.x, 0.03, attack.origin.z]
      : [attack.target.x, 0.02, attack.target.z]

  return (
    <group
      position={position}
      rotation={needleAttack ? [0, attack.angle, 0] : undefined}
      renderOrder={2}
    >
      {needleAttack ? (
        <mesh ref={lineRef} position={[0, 0, (attack.length ?? 8) / 2]}>
          <boxGeometry args={[0.42, 0.045, attack.length ?? 8]} />
          <meshBasicMaterial
            color="#8cf8ff"
            transparent
            opacity={0.75}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      ) : (
        <>
      <mesh
        ref={warningRef}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={attack.type === 'shockwave' ? [0.7, 0.7, 1] : [1, 1, 1]}
      >
        <ringGeometry
          args={attack.type === 'shockwave'
            ? [0.82, 1, 48]
            : attack.type === 'prism-pulse'
              ? [3.05, 3.35, 48]
              : [0.82, 1.08, 32]}
        />
        <meshBasicMaterial
          color={attack.type === 'shockwave'
            ? '#ff874f'
            : attack.type === 'prism-pulse'
              ? '#d4a0ff'
              : '#ff5269'}
          transparent
          opacity={0.55}
          depthWrite={false}
          depthTest={false}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={pulseRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry
          args={attack.type === 'prism-pulse'
            ? [6.25, 6.55, 48]
            : [0.52, 0.7, 32]}
        />
        <meshBasicMaterial
          color={attack.type === 'shockwave'
            ? '#ffd2a1'
            : attack.type === 'prism-pulse'
              ? '#96f6ff'
              : '#ffc9d9'}
          transparent
          opacity={0.22}
          depthWrite={false}
          depthTest={false}
          toneMapped={false}
        />
      </mesh>
        </>
      )}
    </group>
  )
}

function BossProjectile({ projectile, onDone,lightRef }) {
  const meshRef = useRef(null)
  const position = useRef({ ...projectile.position })
  const resolved = useRef(false)
  const remaining = useRef(projectile.remaining)

  useGameplayFrame(({ clock }, rawDelta) => {
    const mesh = meshRef.current
    if (!mesh || resolved.current) return
    const delta = Math.min(rawDelta, 1 / 30)
    position.current.x += projectile.velocity.x * delta
    position.current.y += projectile.velocity.y * delta
    position.current.z += projectile.velocity.z * delta
    mesh.position.set(position.current.x, position.current.y, position.current.z)
    lightRef?.current?.position.copy(mesh.position)
    mesh.scale.setScalar(0.92 + Math.sin(clock.elapsedTime * 18) * 0.18)

    const player = getPlayerWorldPosition()
    const distance = Math.hypot(
      player.x - position.current.x,
      player.y + 1 - position.current.y,
      player.z - position.current.z,
    )
    if (distance < 1.2) {
      resolved.current = true
      useGameplayState.getState().takeDamage(projectile.damage, 'boss-projectile')
      onDone(projectile.id)
    } else if (remaining.current <= delta) {
      resolved.current = true
      onDone(projectile.id)
    }
    remaining.current -= delta
  })

  return (
    <mesh ref={meshRef} position={[projectile.position.x, projectile.position.y, projectile.position.z]}>
      <icosahedronGeometry args={[0.45, 1]} />
      <meshStandardMaterial
        color="#ffd5fb"
        emissive="#ee46ff"
        emissiveIntensity={3.6}
        toneMapped={false}
      />
    </mesh>
  )
}

function BossArena() {
  const encounterRef = useRef(false)
  const { world, rapier } = useRapier()
  const missionId = useCampaignState((state) => state.selectedMissionId)
  const prismBoss = missionId === 'mission-2'
  const firstExpansionBoss = missionId === 'mission-3'
  const expansionMission = EXPANSION_MISSIONS[missionId]
  const applyBossDamage = (damage) => useGameplayState.getState().takeDamage(
    prismBoss || firstExpansionBoss ? Math.max(1, Math.round(damage * 0.55)) : damage,
    `boss-${useBossState.getState().attack?.type ?? 'impact'}`,
  )
  const activatedPylonIds = useGameplayState((state) => state.activatedPylonIds)
  const missionObjectiveIds = useGameplayState((state) => state.missionObjectiveIds)
  const defeatedEnemyIds = useCombatState((state) => state.defeatedEnemyIds)
  const missionObjectivesComplete = missionId === 'mission-1'
    ? getEnemySpawns(missionId).every(({id})=>defeatedEnemyIds.includes(id))
    : missionId === 'mission-2'
    ? MISSION_TWO_PYLONS.every(({ id }) => activatedPylonIds.includes(id)) &&
      MISSION_TWO_ENEMY_SPAWNS.every(({ id }) => defeatedEnemyIds.includes(id))
    : expansionMission
      ? expansionMission.objectives.every(({ id }) => missionObjectiveIds.includes(id)) &&
        (missionId === 'mission-3' || getEnemySpawns(missionId).every(({ id }) => defeatedEnemyIds.includes(id)))
      : true
  const status = useBossState((state) => state.status)
  const bossPhase = useBossState((state) => state.phase)
  const attack = useBossState((state) => state.attack)
  const effects = useBossState((state) => state.effects)
  const roundId = useBossState((state) => state.roundId)
  const lastRoundId = useRef(roundId)
  const bodyRef = useRef(null)
  const modelRef = useRef(null)
  const weaponRef = useRef(null)
  const coreRef = useRef(null)
  const crownRef = useRef(null)
  const relicLight = useRef(null)
  const projectileLight = useRef(null)
  const introPresentation = useRef({startedAt:null,elapsed:0})
  const renderer = useThree(state=>state.gl)
  const camera = useThree(state=>state.camera)
  const scene = useThree(state=>state.scene)
  const controllerRef = useRef(null)
  const pendingTranslation = useRef(null)
  const nextAttackAt = useRef(0)
  const attackSequence = useRef(0)
  const defeatStartedAt = useRef(0)
  const relicCollected = useBossState((state) => state.relicCollected)
  const projectile = useBossState((state) => state.projectile)

  useEffect(()=>scheduleMaterialWarmup(renderer,modelRef.current,camera,scene,{
    ready:()=>{
      if(!modelRef.current||useCinematic.getState().phase!=='idle'||scene.getObjectByName('player-procedural-loading-fallback'))return false
      let count=0;modelRef.current.traverse(o=>{if(o.isMesh)count++})
      return count>=6
    },
  }),[renderer,camera,scene,missionId])

  useEffect(() => {
    const controller = world.createCharacterController(0.05)
    controller.enableAutostep(0.32, 0.2, false)
    controller.enableSnapToGround(0.18)
    controllerRef.current = controller
    bossRuntime.body = bodyRef.current
    return () => {
      world.removeCharacterController(controller)
      controllerRef.current = null
      bossRuntime.body = null
    }
  }, [world])

  useEffect(
    () => useGameplayState.subscribe((state, previousState) => {
      if (state.roundId !== previousState.roundId) {
        encounterRef.current = false
        defeatStartedAt.current = 0
        nextAttackAt.current = 0
        attackSequence.current = 0
        useBossState.getState().reset()
      }
    }),
    [],
  )

  useGameplayFrame(({ clock }, rawDelta) => {
    const now = clock.elapsedTime
    const delta = Math.min(rawDelta, 1 / 30)
    const player = getPlayerWorldPosition()
    if(relicLight.current){
      const boss=useBossState.getState()
      relicLight.current.position.set(bossRuntime.position.x,1.15+Math.sin(clock.elapsedTime*2.2)*.16,bossRuntime.position.z)
      relicLight.current.intensity=boss.status==='defeated'&&!boss.relicCollected?5:0
    }
    if (lastRoundId.current !== roundId) {
      pendingTranslation.current = null
      lastRoundId.current = roundId
      bodyRef.current?.setTranslation(
        {
          x: BOSS_ARENA.bossPosition[0],
          y: BOSS_ARENA.bossPosition[1],
          z: BOSS_ARENA.bossPosition[2],
        },
        true,
      )
    }

    const bossTriggerReached = firstExpansionBoss
      ? missionObjectivesComplete
      : player.z <= BOSS_ARENA.entranceZ && missionObjectivesComplete
    if (!encounterRef.current && bossTriggerReached) {
      encounterRef.current = true
      useBossState.getState().beginEncounter()
    }

    const boss = useBossState.getState()
    if (boss.status === 'intro') {
      if (modelRef.current) {
        modelRef.current.rotation.y = MathUtils.damp(
          modelRef.current.rotation.y,
          Math.PI,
          1.5,
          delta,
        )
      }
      // The camera and actor pose integrate capped frame delta. A blocked render
      // must not consume the whole introduction while those poses cannot move.
      if(introPresentation.current.startedAt!==boss.introStartedAt)introPresentation.current={startedAt:boss.introStartedAt,elapsed:0}
      introPresentation.current.elapsed+=delta
      if (introPresentation.current.elapsed >= 2.2) {
        useBossState.getState().beginFight()
        nextAttackAt.current = now + 1.2
      }
    }

    const body = bodyRef.current
    const controller = controllerRef.current
    const model = modelRef.current
    if (body && controller && model && boss.status === 'active') {
      const current = body.translation()
      bossRuntime.position.x = current.x
      bossRuntime.position.y = current.y
      bossRuntime.position.z = current.z
      const dx = player.x - current.x
      const dz = player.z - current.z
      const distance = Math.hypot(dx, dz)
      const currentMissionId = useCampaignState.getState().selectedMissionId
      const phaseInfo = getBossPhases(currentMissionId)[boss.phase - 1]
      const speed = phaseInfo.speed
      const stopDistance = boss.phase === 1 ? 3.5 : 4
      const canMove = distance > stopDistance
      let moveX = 0
      let moveZ = 0
      if (canMove && !boss.attack) {
        moveX = (dx / Math.max(distance, 0.001)) * speed
        moveZ = (dz / Math.max(distance, 0.001)) * speed
      } else if (boss.phase === 3 && distance <= stopDistance + 1.4 && !boss.attack) {
        // In its final phase the Warden circles at close range instead of
        // freezing in place, while telegraphs still leave a clear dodge window.
        const orbitDirection = Math.sin(now * 0.9 + attackSequence.current) >= 0 ? 1 : -1
        moveX = (-dz / Math.max(distance, 0.001)) * speed * 0.48 * orbitDirection
        moveZ = (dx / Math.max(distance, 0.001)) * speed * 0.48 * orbitDirection
      }

      model.rotation.y = MathUtils.damp(model.rotation.y, Math.atan2(-dx, -dz), 5, delta)
      const collider = body.collider(0)
      controller.computeColliderMovement(
        collider,
        movementWithPendingTarget(current, pendingTranslation.current, { x: moveX * delta, y: 0, z: moveZ * delta }),
        undefined,
        undefined,
        (obstacle) => obstacle.handle !== collider.handle,
      )
      const movement = controller.computedMovement()
      const nextPosition = {
        x: MathUtils.clamp(current.x + movement.x, BOSS_ARENA.minX + 1, BOSS_ARENA.maxX - 1),
        y: current.y + movement.y,
        z: MathUtils.clamp(current.z + movement.z, BOSS_ARENA.minZ + 1, BOSS_ARENA.entranceZ - 2),
      }
      pendingTranslation.current = nextPosition
      body.setNextKinematicTranslation(nextPosition)
      bossRuntime.position.x = nextPosition.x
      bossRuntime.position.y = nextPosition.y
      bossRuntime.position.z = nextPosition.z

      const hitAge = gameNow() - useBossState.getState().hitAt
      const pulse = hitAge >= 0 && hitAge < 260
        ? Math.sin((hitAge / 260) * Math.PI) * 0.11
        : 0
      model.scale.setScalar(1 + pulse)
      if (coreRef.current) {
        coreRef.current.rotation.y = now * (boss.phase === 3 ? 1.7 : 0.8)
      }
      if (crownRef.current) crownRef.current.rotation.y = -now * 0.55
      if (weaponRef.current) {
        const swing = boss.attack?.type === 'melee'
          ? Math.sin(Math.min(1, (now - boss.attack.startedAt) / (boss.attack.telegraphMs / 1000)) * Math.PI)
          : 0
        weaponRef.current.rotation.z = -swing * 1.25
        weaponRef.current.rotation.x = swing * 0.3
      }

      if (!boss.attack && now >= nextAttackAt.current) {
        const prismPatterns = boss.phase === 1
          ? ['needle-line']
          : boss.phase === 2
            ? ['prism-pulse', 'needle-line']
            : ['needle-line', 'prism-pulse', 'needle-line']
        const phaseAttack = prismBoss
          ? prismPatterns[attackSequence.current % prismPatterns.length]
          : boss.phase === 1
            ? 'melee'
            : boss.phase === 2
              ? (attackSequence.current % 2 === 0 ? 'shockwave' : 'bolt')
              : ['melee', 'shockwave', 'bolt'][attackSequence.current % 3]
        const telegraphMs = phaseAttack === 'melee'
          ? (boss.phase === 3 ? 740 : 1050)
          : phaseAttack === 'shockwave'
            ? (boss.phase === 3 ? 950 : 1350)
            : phaseAttack === 'prism-pulse'
              ? (boss.phase === 3 ? 1000 : 1400)
              : phaseAttack === 'needle-line'
                ? (boss.phase === 3 ? 780 : 1150)
                : (boss.phase === 3 ? 800 : 1150)
        const targetDx = player.x - nextPosition.x
        const targetDz = player.z - nextPosition.z
        const targetAngle = Math.atan2(targetDx, targetDz)
        const warning = {
          id: ++attackSequence.current,
          type: phaseAttack,
          startedAt: now,
          telegraphMs,
          origin: { x: nextPosition.x, y: nextPosition.y, z: nextPosition.z },
          target: { x: player.x, y: player.y + 1.1, z: player.z },
          angle: targetAngle,
          length: Math.min(9.5, Math.hypot(targetDx, targetDz) + 1.5),
          phase: boss.phase,
        }
        useBossState.getState().setAttack(warning)
        void playGameSound('bossAttack')
      }

      const activeAttack = useBossState.getState().attack
      if (activeAttack && now - activeAttack.startedAt >= activeAttack.telegraphMs / 1000) {
        useBossState.getState().setAttack(null)
        nextAttackAt.current = now + phaseInfo.cooldown / 1000
        if (activeAttack.type === 'melee') {
          const attackDistance = Math.hypot(player.x - nextPosition.x, player.z - nextPosition.z)
          if (bossMeleeContains(player, activeAttack.origin)) {
            const directionY = player.y + 1.1 - (nextPosition.y + 2.1)
            const rayLength = Math.hypot(attackDistance, directionY) || 1
            const ray = new rapier.Ray(
              { x: nextPosition.x, y: nextPosition.y + 2.1, z: nextPosition.z },
              {
                x: (player.x - nextPosition.x) / rayLength,
                y: directionY / rayLength,
                z: (player.z - nextPosition.z) / rayLength,
              },
            )
            const hit = world.castRay(
              ray,
              rayLength,
              true,
              undefined,
              GAMEPLAY_QUERY_GROUPS,
              collider,
              body,
            )
            if (!hit || hit.timeOfImpact >= rayLength - 0.55) {
              applyBossDamage(
                activeAttack.phase === 3 ? BOSS_DAMAGE + 3 : BOSS_DAMAGE,
              )
            }
          }
        } else if (activeAttack.type === 'shockwave') {
          const blastDistance = Math.hypot(
            player.x - activeAttack.origin.x,
            player.z - activeAttack.origin.z,
          )
          const groundedAtImpact = player.y <= activeAttack.origin.y + 0.8
          if (groundedAtImpact && blastDistance >= 2.25 && blastDistance <= 6.35) {
            applyBossDamage(activeAttack.phase === 3 ? 14 : 10)
          }
        } else if (activeAttack.type === 'needle-line') {
          const length = activeAttack.length
          const dx = Math.sin(activeAttack.angle)
          const dz = Math.cos(activeAttack.angle)
          const relativeX = player.x - activeAttack.origin.x
          const relativeZ = player.z - activeAttack.origin.z
          const along = relativeX * dx + relativeZ * dz
          const across = Math.abs(relativeX * dz - relativeZ * dx)
          if (along >= 0 && along <= length && across <= 0.9) {
            applyBossDamage(activeAttack.phase === 3 ? 19 : 14)
          }
        } else if (activeAttack.type === 'prism-pulse') {
          const radius = Math.hypot(
            player.x - activeAttack.origin.x,
            player.z - activeAttack.origin.z,
          )
          if (
            (radius >= 3 && radius <= 3.9) ||
            (radius >= 6.2 && radius <= 7.15)
          ) {
            applyBossDamage(activeAttack.phase === 3 ? 18 : 13)
          }
        } else {
          const offset = {
            x: activeAttack.target.x - activeAttack.origin.x,
            y: activeAttack.target.y - (activeAttack.origin.y + 2.5),
            z: activeAttack.target.z - activeAttack.origin.z,
          }
          const length = Math.hypot(offset.x, offset.y, offset.z) || 1
          const velocity = activeAttack.phase === 3 ? 11 : 8
          useBossState.getState().setProjectile({
            id: activeAttack.id,
            position: {
              x: activeAttack.origin.x,
              y: activeAttack.origin.y + 2.5,
              z: activeAttack.origin.z,
            },
            velocity: {
              x: (offset.x / length) * velocity,
              y: (offset.y / length) * velocity,
              z: (offset.z / length) * velocity,
            },
            remaining: Math.min(3.2, length / velocity + 0.5),
            damage: prismBoss
              ? Math.max(1, Math.round((activeAttack.phase === 3 ? 14 : 10) * 0.6))
              : activeAttack.phase === 3 ? 14 : 10,
          })
        }
      }
    }

    if (status === 'defeated') {
      if (!defeatStartedAt.current) {
        defeatStartedAt.current = now
      }
      const elapsed = now - defeatStartedAt.current
      if (modelRef.current) {
        modelRef.current.rotation.x = Math.min(1.25, elapsed * 0.9)
        modelRef.current.position.y = -Math.min(1.8, elapsed * 1.2)
        modelRef.current.scale.setScalar(Math.max(0.01, 1 - elapsed * 0.22))
      }
    }
  })

  const statusCurrent = useBossState((state) => state.status)
  const defeated = statusCurrent === 'defeated'
  const active = statusCurrent === 'active' || statusCurrent === 'defeated'
  const wallsVisible = statusCurrent === 'active' && !firstExpansionBoss

  return (
    <group>
      <mesh receiveShadow position={[0, -0.14, -67]}>
        <cylinderGeometry args={[10.8, 10.8, 0.12, 48]} />
        <meshStandardMaterial
          color={prismBoss ? '#302b43' : '#24292c'}
          metalness={prismBoss ? 0.58 : 0.48}
          roughness={prismBoss ? 0.42 : 0.64}
        />
      </mesh>
      {[7.8, 9.4].map((radius) => (
        <mesh
          key={radius}
          receiveShadow
          position={[0, -0.065, -67]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <torusGeometry args={[radius, 0.075, 8, 64]} />
          <meshStandardMaterial
            color={prismBoss ? '#a58bff' : '#e45f49'}
            emissive={prismBoss ? '#684cbd' : '#9e3228'}
            emissiveIntensity={prismBoss ? 1.1 : 0.7}
            metalness={0.65}
            roughness={0.32}
          />
        </mesh>
      ))}
      {[-1, 1].map((side) => (
        <RigidBody
          key={`arena-wall-${side}`}
          type="fixed"
          position={[side * 9, 1.7, -67]}
          colliders={false}
        >
          {missionId==='mission-1' ? <group rotation={[0,side*Math.PI/2,0]} scale={[22/19,1,1]}><Suspense fallback={null}><MissionOneProp name="precinct-wall" /></Suspense></group> : <>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.8, 3.8, 22]} />
            <meshStandardMaterial
              color={prismBoss ? '#403852' : '#292e32'}
              metalness={0.68}
              roughness={0.45}
            />
          </mesh>
          </>}
          <CuboidCollider args={[0.4, 1.9, 11]} />
        </RigidBody>
      ))}
      <RigidBody type="fixed" position={[0, 1.7, -78]} colliders={false}>
        {missionId==='mission-1' ? <Suspense fallback={null}><MissionOneProp name="precinct-wall" /></Suspense> : <>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[19, 3.8, 0.8]} />
          <meshStandardMaterial
            color={prismBoss ? '#403852' : '#292e32'}
            metalness={0.68}
            roughness={0.45}
          />
        </mesh>
        </>}
        <CuboidCollider args={[9.5, 1.9, 0.4]} />
      </RigidBody>

      {wallsVisible && (
        <RigidBody type="fixed" position={[0, 1.8, -57.2]} colliders={false}>
          {missionId==='mission-1' ? <group scale={[18/19,4.2/3.8,.5/.8]}><Suspense fallback={null}><MissionOneProp name="precinct-wall" /></Suspense></group> : <>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[18, 4.2, 0.5]} />
            <meshStandardMaterial
              color={prismBoss ? '#574669' : '#34383c'}
              emissive={prismBoss ? '#7a55c7' : '#b34534'}
              emissiveIntensity={prismBoss ? 0.8 : 0.45}
              metalness={0.7}
              roughness={0.35}
            />
          </mesh>
          </>}
          <CuboidCollider args={[9, 2.1, 0.32]} />
        </RigidBody>
      )}

      <mesh castShadow position={[-8.75, 2.4, -57.1]}>
        <boxGeometry args={[0.8, 4.8, 0.8]} />
        <meshStandardMaterial color={prismBoss ? '#58466f' : '#4b3935'} metalness={0.7} roughness={0.32} />
      </mesh>
      <mesh castShadow position={[8.75, 2.4, -57.1]}>
        <boxGeometry args={[0.8, 4.8, 0.8]} />
        <meshStandardMaterial color={prismBoss ? '#58466f' : '#4b3935'} metalness={0.7} roughness={0.32} />
      </mesh>

      <RigidBody
        ref={bodyRef}
        type="kinematicPosition"
        position={BOSS_ARENA.bossPosition}
        colliders={false}
        enabledRotations={[false, false, false]}
        name={prismBoss ? 'prism-sovereign' : 'arena-warden'}
        userData={{ cameraActor: true }}
      >
        <CapsuleCollider
          sensor={statusCurrent === 'defeated' || statusCurrent === 'dormant'}
          args={[1.45, 1.3]}
          position={[0, BOSS_HEIGHT / 2 + 0.375, 0]}
          collisionGroups={0x00040001}
        />
          <BossModel
            bodyRef={modelRef}
            weaponRef={weaponRef}
            coreRef={coreRef}
            crownRef={crownRef}
            phase={bossPhase}
            prismBoss={prismBoss}
            missionId={missionId}
            visible={statusCurrent !== 'dormant'}
          />
      </RigidBody>

      {active && <BossWarning attack={attack} bossPosition={bossRuntime.position} />}

      {projectile && (
        <BossProjectile
          key={projectile.id}
          projectile={projectile}
          lightRef={projectileLight}
          onDone={(id) => {
            useBossState.getState().removeProjectile(id)
          }}
        />
      )}

      <pointLight ref={relicLight} color={prismBoss ? '#a979ff' : '#ffca65'} intensity={0} distance={7} />
      {prismBoss && <pointLight ref={projectileLight} position={projectile ? [projectile.position.x,projectile.position.y,projectile.position.z] : [0,-100,0]} color="#e54dff" intensity={projectile ? 5 : 0} distance={4} />}
      {defeated && !relicCollected && <BossRelic />}
      {effects.map((effect) => <BossEffect key={effect.id} effect={effect} />)}

    </group>
  )
}

function BossRelic() {
  const relicRef = useRef(null)
  const collected = useBossState((state) => state.relicCollected)
  const prismRelic = useCampaignState((state) => state.selectedMissionId === 'mission-2')

  useGameplayFrame(({ clock }) => {
    if (!relicRef.current || collected) return
    relicRef.current.rotation.y = clock.elapsedTime * 1.35
    relicRef.current.position.y = 1.15 + Math.sin(clock.elapsedTime * 2.2) * 0.16

    const player = getPlayerWorldPosition()
    const { x, z } = bossRuntime.position
    if (Math.hypot(player.x - x, player.z - z) < 1.6) {
      useBossState.getState().collectRelic()
    }
  })

  if (collected) return null
  return (
    <group ref={relicRef} position={[bossRuntime.position.x, 1.15, bossRuntime.position.z]}>
      <mesh castShadow>
        <octahedronGeometry args={[0.75, 1]} />
        <meshStandardMaterial
          color={prismRelic ? '#e3d4ff' : '#fff4ba'}
          emissive={prismRelic ? '#a979ff' : '#ffba45'}
          emissiveIntensity={3.2}
          metalness={0.48}
          roughness={0.14}
          toneMapped={false}
        />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 4]}>
        <torusGeometry args={[1, 0.045, 8, 32]} />
        <meshBasicMaterial color={prismRelic ? '#c29dff' : '#ffd26f'} toneMapped={false} />
      </mesh>
    </group>
  )
}

function BossEncounter() {
  const missionId=useCampaignState(s=>s.selectedMissionId)
  const round=useGameplayState(s=>s.roundId)
  const profile=arcBossFor(missionId)
  return profile ? <ArcBossFight key={`${missionId}-${round}`} profile={profile} relic={<BossRelic />} /> : <BossArena />
}
export default BossEncounter
