import { batchMission } from './chapters/batch20Content.js'
import Batch20Gameplay from './chapters/Batch20Gameplay.jsx'
import {cityEnabled,finalCity} from './phase54e/cityAssets.js'
import { setGameTimeout, clearGameTimeout } from './gameClock.js'
import { useGameplayFrame } from './cinematics/useGameplayFrame.js'
import { Suspense, useEffect, useRef, useState } from 'react'
import MissionOneProp from './MissionOneProp.jsx'
import {
  BallCollider,
  CuboidCollider,
  RigidBody,
} from '@react-three/rapier'
import { getPlayerWorldPosition, useGameplayState } from './gameplayStore.js'
import CombatEnemies from './CombatEnemies.jsx'
import { useCombatState } from './combatSystem.js'
import BossEncounter from './BossEncounter.jsx'
import { useCampaignState } from './campaignSystem.js'
import { MISSION_TWO_CRYSTALS, MISSION_TWO_PYLONS } from './missionTwoContent.js'
import { crystals } from './missionOneCrystals.js'
import BujjiCompanion from './BujjiCompanion.jsx'
import MissionOneRelays from './MissionOneRelays.jsx'
import FirstUseMaterialWarmup from './FirstUseMaterialWarmup.jsx'
import CrystalLighting from './CrystalLighting.jsx'
import { EXPANSION_MISSIONS } from './missionExpansionContent.js'
import { useMissionTwoSequence } from './missionTwoSequence.js'

const barriers = [
  { position: [-4.5, -0.22, 0], phase: 0.2 },
  { position: [4.5, -0.22, -13], phase: 2.1 },
  { position: [-4.5, -0.22, -29], phase: 4.2 },
]

const energyBlades = [
  { position: [3.5, -0.22, -8] },
  { position: [-3.8, -0.22, -22] },
  { position: [2.2, -0.22, -37] },
]

const groundTraps = [
  { position: [-3.8, -0.22, -5] },
  { position: [4.1, -0.22, -17] },
  { position: [4.2, -0.22, -32] },
  { position: [5.5, -0.22, -44] },
]

function MovingBarrier({ position, phase }) {
  const bodyRef = useRef(null)
  const touchingRef = useRef(false)
  const roundId = useGameplayState((state) => state.roundId)
  const lastRoundId = useRef(roundId)

  useGameplayFrame(({ clock }) => {
    if (lastRoundId.current !== roundId) {
      lastRoundId.current = roundId
      touchingRef.current = false
    }

    const [centerX, baseY, z] = position
    const x = centerX + Math.sin(clock.elapsedTime * 0.9 + phase) * 0.8
    bodyRef.current?.setNextKinematicTranslation({ x, y: baseY, z })

    const player = getPlayerWorldPosition()
    const touching =
      Math.abs(player.x - x) < 1.98 &&
      Math.abs(player.z - z) < 0.82 &&
      player.y < baseY + 1.75 &&
      player.y + 1.78 > baseY + 0.78

    if (touching && !touchingRef.current) {
      useGameplayState.getState().takeDamage(14)
    }
    touchingRef.current = touching
  })

  return (
    <RigidBody
      ref={bodyRef}
      type="kinematicPosition"
      position={position}
      colliders={false}
      name="moving-energy-barrier"
    >
      <group position={[0,1.08,0]}><Suspense fallback={null}><MissionOneProp name="barrier-housing" /></Suspense></group>
      <mesh position={[0, 1.08, 0.29]}>
        <boxGeometry args={[2.8, 0.09, 0.035]} />
        <meshStandardMaterial
          color="#f07d43"
          emissive="#d44d20"
          emissiveIntensity={2.2}
          toneMapped={false}
        />
      </mesh>
      <CuboidCollider args={[1.65, 0.26, 0.26]} position={[0, 1.08, 0]} />
    </RigidBody>
  )
}

function SpinningBlade({ position }) {
  const finalVisual=cityEnabled()&&finalCity()
  const rotorRef = useRef(null)
  const touchingRef = useRef(false)
  const roundId = useGameplayState((state) => state.roundId)
  const lastRoundId = useRef(roundId)

  useGameplayFrame(({ clock }) => {
    if (lastRoundId.current !== roundId) {
      lastRoundId.current = roundId
      touchingRef.current = false
    }

    if (rotorRef.current) rotorRef.current.rotation.y = clock.elapsedTime * 2.2

    const player = getPlayerWorldPosition()
    const [x, baseY, z] = position
    const touching =
      Math.hypot(player.x - x, player.z - z) < 1.62 &&
      player.y < baseY + 1.95 &&
      player.y + 1.78 > baseY + 0.82

    if (touching && !touchingRef.current) {
      useGameplayState.getState().takeDamage(14)
    }
    touchingRef.current = touching
  })

  return (
    <RigidBody type="fixed" position={position} colliders={false} name="spinning-energy-blade">
      <mesh receiveShadow rotation={finalVisual?[0,0,0]:[-Math.PI / 2,0,0]} position={[0, 0.025, 0]}>
        <cylinderGeometry args={[0.72, 0.82, 0.12, 12]} />
        <meshStandardMaterial color="#343a3a" metalness={0.72} roughness={0.4} />
      </mesh>
      <group ref={rotorRef} position={[0, 1.12, 0]}>
        {finalVisual?<Suspense fallback={null}><MissionOneProp name="rotor"/></Suspense>:<>
        <mesh castShadow>
          <boxGeometry args={[2.75, 0.16, 0.32]} />
          <meshStandardMaterial color="#aeb6b2" metalness={0.88} roughness={0.22} />
        </mesh>
        <mesh castShadow rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[2.75, 0.16, 0.32]} />
          <meshStandardMaterial color="#858e8b" metalness={0.85} roughness={0.26} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.27, 12, 10]} />
          <meshStandardMaterial
            color="#ff9a4f"
            emissive="#e9541f"
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>
        </>}
      </group>
      <BallCollider args={[1.45]} position={[0, 1.12, 0]} sensor />
    </RigidBody>
  )
}

function GroundTrap({ position }) {
  const spikesRef = useRef(null)
  const touchingRef = useRef(false)
  const roundId = useGameplayState((state) => state.roundId)
  const lastRoundId = useRef(roundId)

  useGameplayFrame(({ clock }) => {
    if (lastRoundId.current !== roundId) {
      lastRoundId.current = roundId
      touchingRef.current = false
    }

    if (spikesRef.current) {
      const pulse = 0.72 + (Math.sin(clock.elapsedTime * 3.4) + 1) * 0.16
      spikesRef.current.scale.y = pulse
    }

    const player = getPlayerWorldPosition()
    const [x, y, z] = position
    const touching =
      Math.hypot(player.x - x, player.z - z) < 1.02 &&
      Math.abs(player.y - y) < 0.58

    if (touching && !touchingRef.current) {
      useGameplayState.getState().takeDamage(14)
    }
    touchingRef.current = touching
  })

  return (
    <RigidBody type="fixed" position={position} colliders={false} name="ground-energy-trap">
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.035, 0]}>
        <torusGeometry args={[0.78, 0.075, 8, 18]} />
        <meshStandardMaterial color="#555a56" metalness={0.8} roughness={0.34} />
      </mesh>
      <group ref={spikesRef} position={[0, 0.12, 0]}>
        {Array.from({ length: 8 }, (_, index) => {
          const angle = (index / 8) * Math.PI * 2
          return (
            <mesh
              key={index}
              castShadow
              position={[Math.cos(angle) * 0.63, 0.31, Math.sin(angle) * 0.63]}
              rotation={[0, -angle, 0]}
            >
              <coneGeometry args={[0.16, 0.58, 12]} />
              <meshStandardMaterial color="#9b6549" metalness={0.7} roughness={0.3} />
            </mesh>
          )
        })}
      </group>
      <CuboidCollider args={[0.86, 0.28, 0.86]} position={[0, 0.22, 0]} sensor />
    </RigidBody>
  )
}

function CrystalBurst({ startedAt }) {
  const particlesRef = useRef([])

  useGameplayFrame(({ clock }) => {
    const age = Math.max(0, clock.elapsedTime - startedAt)
    particlesRef.current.forEach((particle, index) => {
      if (!particle) return
      const angle = (index / 8) * Math.PI * 2
      const distance = age * (1.3 + (index % 3) * 0.35)
      particle.position.set(
        Math.cos(angle) * distance,
        Math.sin(angle) * distance + age * 1.2,
        Math.sin(angle * 2) * distance * 0.3,
      )
      particle.scale.setScalar(Math.max(0.01, 0.13 * (1 - age / 0.7)))
      particle.material.opacity = Math.max(0, 1 - age / 0.7)
    })
  })

  return (
    <group>
      {Array.from({ length: 8 }, (_, index) => (
        <mesh
          key={index}
          ref={(mesh) => {
            particlesRef.current[index] = mesh
          }}
        >
          <icosahedronGeometry args={[1, 0]} />
          <meshBasicMaterial color="#90fff2" transparent opacity={1} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

function EnergyCrystal({ id, position, enemyDrop = false, prism = false }) {
  const productionCell = useCampaignState(s=>s.selectedMissionId==='mission-1')
  const crystalRef = useRef(null)
  const collected = useGameplayState((state) => state.collectedCrystalIds.includes(id))
  const [showBurst, setShowBurst] = useState(false)
  const [burstStartedAt, setBurstStartedAt] = useState(0)
  const burstTimer = useRef(null)

  useEffect(
    () => () => {
      clearGameTimeout(burstTimer.current)
    },
    [],
  )

  useGameplayFrame(({ clock }) => {
    if (collected) return

    if (crystalRef.current) {
      crystalRef.current.rotation.y = clock.elapsedTime * 1.4
      crystalRef.current.position.y =
        Math.sin(clock.elapsedTime * 2.4 + position[2]) * 0.14
    }

    const player = getPlayerWorldPosition()
    const distanceX = player.x - position[0]
    const distanceY = player.y + 0.9 - position[1]
    const distanceZ = player.z - position[2]
    if (distanceX ** 2 + distanceY ** 2 + distanceZ ** 2 < 1.45 ** 2) {
      const didCollect = useGameplayState.getState().collectCrystal(id)
      if (didCollect) {
        if (enemyDrop) useCombatState.getState().collectDroppedCrystal(id)
        setBurstStartedAt(clock.elapsedTime)
        setShowBurst(true)
        clearGameTimeout(burstTimer.current)
        burstTimer.current = setGameTimeout(() => setShowBurst(false), 700)
      }
    }
  })

  return (
    <group position={position}>
      {!collected && (
        <group ref={crystalRef}>
          {productionCell ? <Suspense fallback={null}><MissionOneProp name="salvage-cell" /></Suspense> : <group>
          <mesh castShadow>
            <octahedronGeometry args={[0.48, 0]} />
            <meshStandardMaterial
              color={prism ? '#e5c7ff' : '#b4fff5'}
              emissive={prism ? '#9c61ff' : '#32d9c6'}
              emissiveIntensity={2.4}
              metalness={0.48}
              roughness={0.18}
              toneMapped={false}
            />
          </mesh>
          <mesh rotation={[0, Math.PI / 4, 0]}>
            <torusGeometry args={[0.67, 0.025, 6, 24]} />
            <meshBasicMaterial color={prism ? '#c694ff' : '#77fff0'} transparent opacity={0.72} />
          </mesh>
          </group>}
        </group>
      )}
      {showBurst && <CrystalBurst startedAt={burstStartedAt} />}
    </group>
  )
}

function ResonancePylon({ id, position }) {
  const pylonRef = useRef(null)
  const activated = useGameplayState((state) => state.activatedPylonIds.includes(id))

  useGameplayFrame(({ clock }) => {
    if (!pylonRef.current) return
    pylonRef.current.rotation.y = clock.elapsedTime * 0.3
    const player = getPlayerWorldPosition()
    if (
      !activated &&
      Math.hypot(player.x - position[0], player.z - position[2]) < 2.5
    ) {
      useGameplayState.getState().activatePylon(id)
    }
  })

  return (
    <group position={position}>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.95, 1.15, 0.16, 8]} />
        <meshStandardMaterial color="#25252f" metalness={0.72} roughness={0.3} />
      </mesh>
      <group ref={pylonRef} position={[0, 1.18, 0]}>
        <mesh castShadow>
          <octahedronGeometry args={[0.72, 0]} />
          <meshPhysicalMaterial
            color={activated ? '#d9fff8' : '#7147a6'}
            emissive={activated ? '#65fff0' : '#7b3bdb'}
            emissiveIntensity={activated ? 3.2 : 1.7}
            metalness={0.3}
            roughness={0.12}
            transmission={0.2}
            thickness={0.8}
            toneMapped={false}
          />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <torusGeometry args={[1.02, 0.045, 8, 28]} />
          <meshBasicMaterial color={activated ? '#92fff2' : '#bc8aff'} toneMapped={false} />
        </mesh>
        <pointLight
          color={activated ? '#64fff0' : '#aa65ff'}
          intensity={activated ? 5 : 2.8}
          distance={activated ? 8 : 5}
        />
      </group>
      <mesh position={[0, 2.7, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.42, 0.045, 6, 20]} />
        <meshBasicMaterial
          color={activated ? '#92fff2' : '#bc8aff'}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, 2.7, 0]}>
        <octahedronGeometry args={[0.16, 0]} />
        <meshBasicMaterial
          color={activated ? '#92fff2' : '#bc8aff'}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

function MissionObjective({ objective }) {
  const markerRef = useRef(null)
  const complete = useGameplayState((state) => state.missionObjectiveIds.includes(objective.id))
  const missionId = useCampaignState((state) => state.selectedMissionId)

  useGameplayFrame(({ clock }) => {
    if (!markerRef.current) return
    markerRef.current.rotation.y = clock.elapsedTime * 0.65
    markerRef.current.position.y = Math.sin(clock.elapsedTime * 1.7 + objective.position[2]) * 0.12
    const player = getPlayerWorldPosition()
    const withinPickupRange = Math.hypot(player.x - objective.position[0], player.z - objective.position[2]) < 2.35
    const crossedMissionThreeRouteMarker = missionId === 'mission-3' && player.z <= objective.position[2] + 2
    if (!complete && (withinPickupRange || crossedMissionThreeRouteMarker)) {
      useGameplayState.getState().completeMissionObjective(objective.id)
    }
  })

  return (
    <group position={objective.position}>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.78, 0]}>
        <cylinderGeometry args={[0.72, 0.92, 0.16, 8]} />
        <meshStandardMaterial color="#393d3c" metalness={0.65} roughness={0.38} />
      </mesh>
      <group ref={markerRef} position={[0, 0, 0]}>
        <mesh castShadow>
          <octahedronGeometry args={[0.48, 0]} />
          <meshStandardMaterial
            color={complete ? '#a9fff0' : '#eca95d'}
            emissive={complete ? '#52dec1' : '#b65c27'}
            emissiveIntensity={complete ? 2.5 : 1.8}
            metalness={0.42}
            roughness={0.2}
            toneMapped={false}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.7, 0.035, 8, 24]} />
          <meshBasicMaterial color={complete ? '#8cfff0' : '#ffc27b'} toneMapped={false} />
        </mesh>
        <pointLight color={complete ? '#6affdc' : '#ffb36c'} intensity={complete ? 3.2 : 2.1} distance={5} />
      </group>
    </group>
  )
}

function Gameplay() {
  const sequence = useMissionTwoSequence(state => state.phase !== 'idle')
  const droppedEnemyCrystals = useCombatState((state) => state.droppedEnemyCrystals)
  const missionId = useCampaignState((state) => state.selectedMissionId)
  const missionCrystals = missionId === 'mission-2' ? MISSION_TWO_CRYSTALS : crystals
  const expansionMission = EXPANSION_MISSIONS[missionId]

  if (batchMission(missionId)) return <Batch20Gameplay id={missionId} />
  return (
    <group>
      <CrystalLighting crystals={[...missionCrystals, ...droppedEnemyCrystals]} prism={missionId === 'mission-2'} />
      <FirstUseMaterialWarmup missionId={missionId} />
      <CombatEnemies />
      <BossEncounter />
      {missionId==='mission-1' && <MissionOneRelays />}
      <group visible={!sequence}><BujjiCompanion /></group>
      {missionId === 'mission-1' && barriers.map((barrier) => (
        <MovingBarrier key={`barrier-${barrier.position[2]}`} {...barrier} />
      ))}
      {missionId === 'mission-1' && energyBlades.map(({ position }) => (
        <SpinningBlade key={`blade-${position[2]}`} position={position} />
      ))}
      {missionId === 'mission-1' && groundTraps.map(({ position }) => (
        <GroundTrap key={`trap-${position[2]}`} position={position} />
      ))}
      {missionId === 'mission-2' && MISSION_TWO_PYLONS.map((pylon) => (
        <ResonancePylon key={pylon.id} {...pylon} />
      ))}
      {expansionMission?.objectives.map((objective) => (
        <MissionObjective key={objective.id} objective={objective} />
      ))}
      {missionCrystals.map((crystal) => (
        <EnergyCrystal key={crystal.id} {...crystal} prism={missionId === 'mission-2'} />
      ))}
      {droppedEnemyCrystals.map((crystal) => (
        <EnergyCrystal key={crystal.id} {...crystal} enemyDrop />
      ))}
    </group>
  )
}

export default Gameplay
