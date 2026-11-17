import { arcBossFor } from '../phase54e/arcBosses.js'
import { gameNow } from '../gameClock.js'
import { markCinematicSpawnReady } from '../cinematics/controller.js'
import { useGameplayFrame } from '../cinematics/useGameplayFrame.js'
import { Suspense, useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import RiggedBhairava from './RiggedBhairava.jsx'
import { useFrame, useThree } from '@react-three/fiber'
import { CapsuleCollider, RigidBody, useRapier } from '@react-three/rapier'
import { DoubleSide, ExtrudeGeometry, LatheGeometry, MathUtils, PlaneGeometry, Shape, Vector2, Vector3 } from 'three'
import { setPlayerWorldPosition, useGameplayState } from '../gameplayStore.js'
import { enemyRuntime, useCombatState } from '../combatSystem.js'
import { bossRuntime, useBossState } from '../bossSystem.js'
import { useCampaignState } from '../campaignSystem.js'
import { EXPANSION_MISSIONS } from '../missionExpansionContent.js'
import { useNarrativeCueState } from '../narrativeCueSystem.js'
import {
  GAMEPLAY_QUERY_GROUPS,
} from '../collisionGroups.js'
import PlayerInput from './PlayerInput.jsx'
import { triggerPlayerAudioEvent } from './playerAudio.js'
import { makeCharacterRelief } from './characterSurfaces.js'
import BhairavaHead from './BhairavaHead.jsx'
import { cameraClearance, cameraEscapeOffsets } from './cameraCollision.js'
import { movementWithPendingTarget } from './kinematicMovement.js'
import { DODGE_ACTIVE_MS, DODGE_COOLDOWN_MS, resolveAttackInput } from './combatTiming.js'
import {
  consumePlayerAttack,
  consumePlayerDodge,
  consumePlayerJump,
  consumePlayerOverdrive,
  usePlayerInput,
} from './playerInputStore.js'

const PLAYER_START = [0, -0.22, 8]
const PLAYER_HEIGHT = 1.78
const PLAYER_RADIUS = 0.34
const WALK_SPEED = 4.5
const SPRINT_SPEED = 7
const JUMP_SPEED = 6.8
const GRAVITY = 19
const LANDING_DURATION = 0.24

function ProceduralCharacter({ stateRef }) {
  const groupRef = useRef(null)
  const blade = useMemo(() => {
    const outline = new Shape()
    outline.moveTo(-0.045, 0)
    outline.lineTo(0.045, 0)
    outline.lineTo(0.06, -0.48)
    outline.lineTo(0, -0.68)
    outline.lineTo(-0.06, -0.48)
    outline.closePath()
    return new ExtrudeGeometry(outline, {
      depth: 0.025, bevelEnabled: true, bevelSize: 0.008,
      bevelThickness: 0.008, bevelSegments: 1, steps: 1,
    })
  }, [])
  useEffect(() => () => blade.dispose(), [blade])
  const torso = useMemo(() => {
    const profile = [
      [0.22, -0.35], [0.25, -0.29], [0.27, -0.18], [0.32, 0],
      [0.38, 0.17], [0.37, 0.25], [0.23, 0.32], [0.14, 0.35],
    ]
    const geometry = new LatheGeometry(profile.map(([radius, y]) => new Vector2(radius, y)), 24)
    geometry.scale(1.14, 1, 0.75)
    return geometry
  }, [])
  useEffect(() => () => torso.dispose(), [torso])
  useLayoutEffect(() => {
    const maps = {
      skin: makeCharacterRelief('skin'),
      cloth: makeCharacterRelief('cloth'),
      leather: makeCharacterRelief('leather'),
    }
    const materials = new Map()
    groupRef.current.traverse((object) => {
      const material = object.material
      if (!material?.isMeshStandardMaterial || material.metalness > 0.3) return
      const colour = material.color
      const skin = colour.r > colour.g * 1.25 && colour.g > colour.b * 1.15 && colour.r > 0.3
      const kind = skin ? 'skin' : material.roughness > 0.9 ? 'cloth' : 'leather'
      materials.set(material, { bumpMap: material.bumpMap, bumpScale: material.bumpScale })
      material.bumpMap = maps[kind]
      material.bumpScale = skin ? 0.008 : 0.018
      material.needsUpdate = true
    })
    return () => {
      materials.forEach((previous, material) => {
        Object.assign(material, previous)
        material.needsUpdate = true
      })
      Object.values(maps).forEach((texture) => texture.dispose())
    }
  }, [groupRef])
  const scarf = useMemo(() => {
    const geometry = new PlaneGeometry(1, 1, 12, 16)
    const vertices = geometry.attributes.position
    for (let i = 0; i < vertices.count; i += 1) {
      const across = vertices.getX(i)
      const drop = 0.5 - vertices.getY(i)
      vertices.setXYZ(
        i,
        across * (0.33 + drop * 0.22) + drop * 0.13,
        -drop * (0.91 + across * 0.18),
        0.08 + drop * 0.22 + Math.sin(across * 24 + drop * 4) * (0.014 + drop * 0.025),
      )
    }
    geometry.computeVertexNormals()
    return geometry
  }, [])
  useEffect(() => () => scarf.dispose(), [scarf])
  const leftArm = useRef()
  const rightArm = useRef()
  const leftLeg = useRef()
  const rightLeg = useRef()
  const leftKnee = useRef()
  const rightKnee = useRef()
  const bodyBob = useRef()
  const gaitPhase = useRef(0)

  useGameplayFrame(({ clock }, rawDelta) => {
    const delta = Math.min(rawDelta, 1 / 30)
    const {
      mode = 'idle',
      speed = 0,
      verticalSpeed = 0,
      attackType = null,
      attackProgress = 0,
      landing = 0,
      guarding = false,
    } = stateRef.current
    const damageAge = gameNow() - useGameplayState.getState().damagedAt
    const hurt = damageAge >= 0 && damageAge < 360
      ? Math.sin((1 - damageAge / 360) * Math.PI) * (1 - damageAge / 360)
      : 0
    const defeated = mode === 'defeated'
    const moving = mode === 'walking' || mode === 'running' || mode === 'sprinting'
    const gaitAmount = moving ? Math.min(1, speed / SPRINT_SPEED) : 0
    gaitPhase.current += delta * (4 + gaitAmount * 9)
    const gait = gaitPhase.current
    const landingCompression = Math.sin(landing * Math.PI)

    if (leftArm.current && rightArm.current && leftLeg.current && rightLeg.current) {
      const airborne = mode === 'jumping'
      const attackArc = Math.sin(attackProgress * Math.PI)
      leftKnee.current.rotation.x = MathUtils.damp(leftKnee.current.rotation.x, airborne ? 0.85 : Math.max(0, -Math.sin(gait)) * gaitAmount * 1.2, 16, delta)
      rightKnee.current.rotation.x = MathUtils.damp(rightKnee.current.rotation.x, airborne ? 0.65 : Math.max(0, Math.sin(gait)) * gaitAmount * 1.2, 16, delta)
      const legSwing = Math.sin(gait) * 0.55 * gaitAmount
      const armSwing = Math.sin(gait) * 0.38 * gaitAmount
      const leftLegTarget = airborne ? -0.45 : legSwing
      const rightLegTarget = airborne ? 0.45 : Math.sin(gait + Math.PI) * 0.55 * gaitAmount
      const leftArmXTarget = airborne ? 0.35 : Math.sin(gait + Math.PI) * 0.38 * gaitAmount + hurt * 0.55 - Number(guarding) * 0.9
      const rightArmXTarget = airborne ? -0.35 : armSwing - hurt * 0.65 - attackArc * 0.55 - Number(guarding) * 0.7

      leftLeg.current.rotation.x = MathUtils.damp(leftLeg.current.rotation.x, leftLegTarget, 14, delta)
      rightLeg.current.rotation.x = MathUtils.damp(rightLeg.current.rotation.x, rightLegTarget, 14, delta)
      leftArm.current.rotation.x = MathUtils.damp(leftArm.current.rotation.x, leftArmXTarget, 12, delta)
      rightArm.current.rotation.x = MathUtils.damp(rightArm.current.rotation.x, rightArmXTarget, 12, delta)
      leftArm.current.rotation.y = MathUtils.damp(
        leftArm.current.rotation.y,
        attackType === 'heavy' ? -attackProgress * 0.95 : 0,
        15,
        delta,
      )
      rightArm.current.rotation.y = MathUtils.damp(
        rightArm.current.rotation.y,
        -attackProgress * (attackType === 'heavy' ? 1.8 : 1.45),
        15,
        delta,
      )
      rightArm.current.rotation.z = MathUtils.damp(
        rightArm.current.rotation.z,
        attackArc * (attackType === 'heavy' ? -1.3 : -0.9),
        15,
        delta,
      )
      leftArm.current.rotation.z = MathUtils.damp(
        leftArm.current.rotation.z,
        attackType === 'heavy' ? attackArc * 0.8 : 0,
        15,
        delta,
      )
      bodyBob.current.rotation.y = MathUtils.damp(
        bodyBob.current.rotation.y,
        attackArc * (attackType === 'heavy' ? 0.2 : 0.12) + (moving ? Math.sin(gait) * 0.025 : 0),
        12,
        delta,
      )
      bodyBob.current.rotation.z = MathUtils.damp(
        bodyBob.current.rotation.z,
        defeated ? -Math.PI * 0.48 : mode === 'sprinting' ? -0.035 : 0,
        8,
        delta,
      )
      bodyBob.current.position.y = MathUtils.damp(
        bodyBob.current.position.y,
        0.04 - (defeated ? 0.05 : landingCompression * 0.18) +
          (moving ? Math.abs(Math.sin(gait)) * 0.035 * gaitAmount : Math.sin(clock.elapsedTime * 2) * 0.008),
        12,
        delta,
      )
      const pitch = airborne
        ? MathUtils.clamp(-verticalSpeed * 0.035, -0.25, 0.25)
        : hurt * 0.12 + landingCompression * 0.24
      bodyBob.current.rotation.x = MathUtils.damp(bodyBob.current.rotation.x, pitch, 12, delta)
      if (bodyBob.current) {
        bodyBob.current.position.z = MathUtils.damp(
          bodyBob.current.position.z,
          attackProgress > 0 ? -Math.sin(attackProgress * Math.PI) * (attackType === 'heavy' ? 0.22 : 0.12) : 0,
          18,
          delta,
        )
      }
    }
  })

  return (
    <group ref={groupRef} position={PLAYER_START} name="player-procedural-loading-fallback">
      <group ref={bodyBob} position={[0, 0.04, 0]}>
        <mesh geometry={scarf} castShadow position={[-0.19, 1.52, 0.32]} rotation={[0, -0.16, -0.12]}>
          <meshStandardMaterial color="#49352b" roughness={0.96} side={DoubleSide} />
        </mesh>
        <mesh castShadow position={[0, 1.5, 0.03]} rotation={[1.35, 0, -0.12]} scale={[1.3, 0.8, 1.15]}>
          <torusGeometry args={[0.18, 0.063, 8, 20]} />
          <meshStandardMaterial color="#553728" roughness={0.98} />
        </mesh>
        {[-1, 1].map((side) => (
          <group key={side} position={[side * 0.28, 1.31, 0.26]} rotation={[0.18, side * 0.34, side * 0.16]}>
            <mesh castShadow>
              <boxGeometry args={[0.19, 0.29, 0.12]} />
              <meshStandardMaterial color="#514438" metalness={0.62} roughness={0.48} />
            </mesh>
            <mesh position={[0, 0.09, 0.068]}>
              <boxGeometry args={[0.16, 0.024, 0.022]} />
              <meshStandardMaterial color="#a67f55" metalness={0.58} roughness={0.52} />
            </mesh>
          </group>
        ))}
        {/* Bhairava: exposed, muscular arms under a worn sleeveless field vest. */}
        <mesh castShadow geometry={torso} position={[0, 1.18, 0.025]}>
          <meshStandardMaterial color="#353832" roughness={0.84} metalness={0.12} />
        </mesh>
        <mesh castShadow position={[0, 1.53, 0]}>
          <cylinderGeometry args={[0.13, 0.15, 0.19, 10]} />
          <meshStandardMaterial color="#a77b62" roughness={0.86} />
        </mesh>
        <mesh castShadow position={[0, 1.24, -0.32]} rotation={[0, 0, -0.08]}>
          <boxGeometry args={[0.46, 0.53, 0.055]} />
          <meshStandardMaterial color="#514a3c" roughness={0.85} />
        </mesh>
        <mesh castShadow position={[0, 1.22, 0.37]}>
          <boxGeometry args={[0.34, 0.5, 0.045]} />
          <meshStandardMaterial color="#454a42" roughness={0.93} />
        </mesh>
        <mesh castShadow position={[0, 1.34, 0.398]}>
          <boxGeometry args={[0.32, 0.055, 0.025]} />
          <meshStandardMaterial color="#6c624e" roughness={0.84} />
        </mesh>
        <mesh castShadow position={[0, 1.08, 0.398]}>
          <boxGeometry args={[0.32, 0.055, 0.025]} />
          <meshStandardMaterial color="#6c624e" roughness={0.84} />
        </mesh>
        <mesh castShadow position={[0, 1.29, 0.415]}>
          <boxGeometry args={[0.29, 0.24, 0.045]} />
          <meshStandardMaterial color="#353a36" metalness={0.32} roughness={0.72} />
        </mesh>
        {[-1, 1].map((side) => (
          <mesh
            key={`back-harness-${side}`}
            castShadow
            position={[side * 0.1, 1.29, 0.448]}
            rotation={[0, 0, side * -0.42]}
          >
            <boxGeometry args={[0.045, 0.34, 0.028]} />
            <meshStandardMaterial color="#b18b5d" roughness={0.78} />
          </mesh>
        ))}
        <mesh castShadow position={[0, 1.22, 0.404]}>
          <boxGeometry args={[0.13, 0.2, 0.035]} />
          <meshStandardMaterial color="#343733" metalness={0.18} roughness={0.78} />
        </mesh>
        <mesh position={[0, 1.22, 0.425]}>
          <octahedronGeometry args={[0.055, 0]} />
          <meshStandardMaterial color="#c18450" metalness={0.48} roughness={0.38} />
        </mesh>
        <mesh castShadow position={[0, 1.32, -0.37]}>
          <boxGeometry args={[0.43, 0.38, 0.055]} />
          <meshStandardMaterial color="#454a42" roughness={0.82} />
        </mesh>
        <mesh castShadow position={[0, 1.42, -0.405]}>
          <boxGeometry args={[0.3, 0.12, 0.045]} />
          <meshStandardMaterial color="#353832" metalness={0.16} roughness={0.76} />
        </mesh>
        {[-1, 1].map((side) => (
          <group key={`vest-panel-${side}`}>
            <mesh castShadow position={[side * 0.245, 1.13, -0.407]} rotation={[0, 0, side * -0.08]}>
              <boxGeometry args={[0.09, 0.31, 0.028]} />
              <meshStandardMaterial color="#625b49" roughness={0.88} />
            </mesh>
            <mesh castShadow position={[side * 0.22, 0.98, -0.425]}>
              <boxGeometry args={[0.19, 0.17, 0.055]} />
              <meshStandardMaterial color="#4b4639" metalness={0.08} roughness={0.86} />
            </mesh>
            <mesh position={[side * 0.22, 1.025, -0.457]}>
              <boxGeometry args={[0.11, 0.012, 0.012]} />
              <meshBasicMaterial color="#bd9665" toneMapped={false} />
            </mesh>
          </group>
        ))}
        {[-1, 1].map((side) => (
          <group key={`vest-strap-${side}`}>
            <mesh castShadow position={[side * 0.19, 1.2, 0.387]} rotation={[0, 0, side * 0.13]}>
              <boxGeometry args={[0.055, 0.56, 0.025]} />
              <meshStandardMaterial color="#b18b5d" roughness={0.78} />
            </mesh>
            <mesh castShadow position={[side * 0.19, 1.34, 0.411]}>
              <boxGeometry args={[0.078, 0.09, 0.025]} />
              <meshStandardMaterial color="#9b8058" metalness={0.62} roughness={0.38} />
            </mesh>
            <mesh position={[side * 0.19, 1.34, 0.427]}>
              <boxGeometry args={[0.035, 0.052, 0.008]} />
              <meshStandardMaterial color="#d1b078" metalness={0.58} roughness={0.36} />
            </mesh>
          </group>
        ))}
        <mesh position={[0, 1.22, 0.399]}>
          <boxGeometry args={[0.065, 0.4, 0.016]} />
          <meshBasicMaterial color="#c18450" toneMapped={false} />
        </mesh>
        <mesh castShadow position={[0, 0.83, -0.02]}>
          <boxGeometry args={[0.5, 0.16, 0.54]} />
          <meshStandardMaterial color="#292c2a" metalness={0.4} roughness={0.62} />
        </mesh>
        <mesh castShadow position={[0, 0.84, -0.31]}>
          <boxGeometry args={[0.16, 0.11, 0.06]} />
          <meshStandardMaterial color="#9c714e" metalness={0.42} roughness={0.5} />
        </mesh>
        <mesh castShadow position={[0, 0.73, -0.305]}>
          <boxGeometry args={[0.38, 0.07, 0.045]} />
          <meshStandardMaterial color="#8f704d" metalness={0.5} roughness={0.48} />
        </mesh>
        {[-1, 1].map((side) => (
          <group key={`belt-pouch-${side}`} position={[side * 0.28, 0.91, 0.36]}>
            <mesh castShadow>
              <boxGeometry args={[0.16, 0.19, 0.16]} />
              <meshStandardMaterial color="#514a3d" roughness={0.9} />
            </mesh>
            <mesh position={[0, 0.035, 0.09]}>
              <boxGeometry args={[0.075, 0.018, 0.012]} />
              <meshStandardMaterial color="#c09864" metalness={0.52} roughness={0.4} />
            </mesh>
          </group>
        ))}

        <BhairavaHead />

        <group ref={leftArm} position={[-0.39, 1.4, 0]}>
          <mesh castShadow position={[-0.045, -0.19, 0]} rotation={[0, 0, -0.1]}>
            <capsuleGeometry args={[0.135, 0.28, 8, 16]} />
            <meshStandardMaterial color="#a77b62" roughness={0.86} />
          </mesh>
          <mesh castShadow position={[0, -0.49, 0]} rotation={[0, 0, -0.08]}>
            <capsuleGeometry args={[0.135, 0.25, 6, 10]} />
            <meshStandardMaterial color="#303432" roughness={0.94} />
          </mesh>
          <mesh castShadow position={[0, -0.64, -0.02]}>
            <sphereGeometry args={[0.14, 12, 10]} />
            <meshStandardMaterial color="#202321" roughness={0.92} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.12, 0]}>
            <torusGeometry args={[0.16, 0.025, 6, 18]} />
            <meshStandardMaterial color="#292b29" metalness={0.42} roughness={0.58} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.17, 0]}>
            <torusGeometry args={[0.165, 0.018, 6, 18]} />
            <meshBasicMaterial color="#bd714d" toneMapped={false} />
          </mesh>
          <mesh castShadow position={[-0.045, -0.37, -0.12]} rotation={[0, 0, -0.12]}>
            <boxGeometry args={[0.24, 0.16, 0.055]} />
            <meshStandardMaterial color="#353936" metalness={0.5} roughness={0.5} />
          </mesh>
        </group>
        <group ref={rightArm} position={[0.39, 1.4, 0]}>
          <mesh castShadow position={[0.045, -0.19, 0]} rotation={[0, 0, 0.1]}>
            <capsuleGeometry args={[0.135, 0.28, 8, 16]} />
            <meshStandardMaterial color="#a77b62" roughness={0.86} />
          </mesh>
          <mesh castShadow position={[0, -0.49, 0]} rotation={[0, 0, 0.08]}>
            <capsuleGeometry args={[0.14, 0.25, 6, 10]} />
            <meshStandardMaterial color="#303432" roughness={0.94} />
          </mesh>
          <mesh castShadow position={[0, -0.64, -0.02]}>
            <sphereGeometry args={[0.14, 12, 10]} />
            <meshStandardMaterial color="#202321" roughness={0.92} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.16, 0]}>
            <torusGeometry args={[0.165, 0.022, 6, 18]} />
            <meshStandardMaterial color="#a78a5d" metalness={0.48} roughness={0.55} />
          </mesh>
          <mesh castShadow position={[0, -0.37, -0.12]} rotation={[0, 0, 0.12]}>
            <boxGeometry args={[0.24, 0.16, 0.055]} />
            <meshStandardMaterial color="#353936" metalness={0.5} roughness={0.5} />
          </mesh>
          <group position={[0.08, -0.65, -0.035]} rotation={[0.82, 0, 0.28]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.037, 0.045, 0.46, 8]} />
              <meshStandardMaterial color="#352c26" metalness={0.58} roughness={0.58} />
            </mesh>
            <mesh position={[0, -0.18, 0]}>
              <boxGeometry args={[0.19, 0.055, 0.105]} />
              <meshStandardMaterial color="#8e6550" metalness={0.67} roughness={0.4} />
            </mesh>
            <mesh geometry={blade} position={[0, -0.18, 0]} castShadow>
              <meshStandardMaterial color="#d7ac73" metalness={0.85} roughness={0.26} emissive="#ff620f" emissiveIntensity={0.65} />
            </mesh>
          </group>
        </group>
        <group ref={leftLeg} position={[-0.2, 0.65, 0]}>
          <mesh castShadow position={[0, -0.26, 0]}>
            <capsuleGeometry args={[0.145, 0.37, 8, 14]} />
            <meshStandardMaterial color="#514f3d" roughness={0.95} />
          </mesh>
          <mesh castShadow position={[-0.13, -0.28, 0.02]}>
            <boxGeometry args={[0.11, 0.22, 0.22]} />
            <meshStandardMaterial color="#686150" roughness={0.84} />
          </mesh>
          <mesh castShadow position={[0, -0.43, -0.15]} rotation={[0.12, 0, 0]}>
            <boxGeometry args={[0.25, 0.18, 0.1]} />
            <meshStandardMaterial color="#686150" metalness={0.36} roughness={0.7} />
          </mesh>
          <mesh castShadow position={[0.17, -0.31, -0.015]}>
            <boxGeometry args={[0.045, 0.2, 0.16]} />
            <meshStandardMaterial color="#80765e" roughness={0.8} />
          </mesh>
          <group ref={leftKnee} position={[0, -0.43, 0]}>
          <mesh castShadow position={[0, -0.2, -0.04]}>
            <capsuleGeometry args={[0.13, 0.23, 5, 8]} />
            <meshStandardMaterial color="#242827" roughness={0.9} />
          </mesh>
          <mesh castShadow position={[0, -0.34, -0.13]}>
            <boxGeometry args={[0.3, 0.15, 0.46]} />
            <meshStandardMaterial color="#353733" metalness={0.38} roughness={0.7} />
          </mesh>
          </group>
        </group>
        <group ref={rightLeg} position={[0.2, 0.65, 0]}>
          <mesh castShadow position={[0, -0.26, 0]}>
            <capsuleGeometry args={[0.145, 0.37, 8, 14]} />
            <meshStandardMaterial color="#514f3d" roughness={0.95} />
          </mesh>
          <mesh castShadow position={[0.13, -0.28, 0.02]}>
            <boxGeometry args={[0.11, 0.22, 0.22]} />
            <meshStandardMaterial color="#686150" roughness={0.84} />
          </mesh>
          <mesh castShadow position={[0, -0.43, -0.15]} rotation={[-0.12, 0, 0]}>
            <boxGeometry args={[0.25, 0.18, 0.1]} />
            <meshStandardMaterial color="#686150" metalness={0.36} roughness={0.7} />
          </mesh>
          <mesh castShadow position={[-0.17, -0.31, -0.015]}>
            <boxGeometry args={[0.045, 0.2, 0.16]} />
            <meshStandardMaterial color="#80765e" roughness={0.8} />
          </mesh>
          <group ref={rightKnee} position={[0, -0.43, 0]}>
          <mesh castShadow position={[0, -0.2, -0.04]}>
            <capsuleGeometry args={[0.13, 0.23, 5, 8]} />
            <meshStandardMaterial color="#242827" roughness={0.9} />
          </mesh>
          <mesh castShadow position={[0, -0.34, -0.13]}>
            <boxGeometry args={[0.3, 0.15, 0.46]} />
            <meshStandardMaterial color="#353733" metalness={0.38} roughness={0.7} />
          </mesh>
          </group>
        </group>
        <pointLight position={[0, 1.58, 0.72]} intensity={1.1} distance={4} color="#efaa72" />
      </group>
    </group>
  )
}

function Player({ showAvatar = true, active = true }) {
  const bodyRef = useRef(null)
  const pendingTranslation = useRef(null)
  const avatarRootRef = useRef(null)
  const controllerRef = useRef(null)
  const verticalSpeedRef = useRef(0)
  const groundedRef = useRef(true)
  const landedAt = useRef(-Infinity)
  const yawRef = useRef(0)
  const stateRef = useRef({
    mode: 'idle',
    speed: 0,
    verticalSpeed: 0,
    attackType: null,
    attackProgress: 0,
  })
  const { world, rapier } = useRapier()
  const { camera, size } = useThree()
  const cameraTarget = useRef(new Vector3())
  const cameraPosition = useRef(new Vector3())
  const desiredCameraPosition = useRef(new Vector3())
  const playerPosition = useRef(new Vector3())
  const lookTarget = useRef(new Vector3())
  const cameraShoulder = useRef(1)
  const stagingArenaCamera = useRef(false)
  const alternativeCamera = useRef(new Vector3())
  const movementVelocityRef = useRef(new Vector3())
  const rayOrigin = useRef(new Vector3())
  const observedRoundId = useRef(null)
  const resetThisFrame = useRef(false)
  const attackReadyAt = useRef(0)
  const attackRef = useRef({ type: null, startedAt: 0, duration: 0 })
  const pendingAttack = useRef(null)
  const attackSequence = useRef(0)
  const hitConfirmedAt = useRef(0)
  const dodgeVelocity = useRef(new Vector3())
  const dodgeUntil = useRef(0)
  const dodgeReadyAt = useRef(0)
  const nextTargetCheckAt = useRef(0)

  useEffect(() => {
    const controller = world.createCharacterController(0.02)
    controller.enableAutostep(0.32, 0.18, false)
    controller.enableSnapToGround(0.2)
    controllerRef.current = controller

    return () => {
      world.removeCharacterController(controller)
      controllerRef.current = null
    }
  }, [world])

  // Initialize the spawn and follow camera before the cinematic captures them.
  useFrame(() => {
    resetThisFrame.current = false
    const body = bodyRef.current
    const visual = avatarRootRef.current
    const { roundId } = useGameplayState.getState()
    if (!body || !visual || observedRoundId.current === roundId) return
    resetThisFrame.current = true
    pendingTranslation.current = null
    observedRoundId.current = roundId
    body.setTranslation(
      { x: PLAYER_START[0], y: PLAYER_START[1], z: PLAYER_START[2] },
      true,
    )
    avatarRootRef.current?.position.set(...PLAYER_START)
    verticalSpeedRef.current = 0
    groundedRef.current = true
    landedAt.current = -Infinity
    stateRef.current = { mode: 'idle' }
    movementVelocityRef.current.set(0, 0, 0)
    yawRef.current = 0
    attackReadyAt.current = 0
    attackRef.current = { type: null, startedAt: 0, duration: 0 }
    pendingAttack.current = null
    attackSequence.current = 0
    hitConfirmedAt.current = 0
    consumePlayerAttack()
    consumePlayerDodge()
    dodgeUntil.current = 0
    dodgeReadyAt.current = 0
    visual.rotation.y = 0
    cameraPosition.current.set(0, PLAYER_START[1] + 3.3, PLAYER_START[2] + 6.7)
    cameraTarget.current.set(0, PLAYER_START[1] + 1.15, PLAYER_START[2])
    camera.position.copy(cameraPosition.current)
    cameraShoulder.current = 1
    stagingArenaCamera.current = false
    camera.lookAt(cameraTarget.current)
    setPlayerWorldPosition(PLAYER_START[0], PLAYER_START[1], PLAYER_START[2])
    markCinematicSpawnReady()
  }, -2)

  useGameplayFrame(({ clock }, rawDelta) => {
    const body = bodyRef.current
    const controller = controllerRef.current
    const visual = avatarRootRef.current
    if (!body || !controller || !visual || resetThisFrame.current) return

    const gameplayState = useGameplayState.getState()
    const { gameOver } = gameplayState
    const overdriveActive = gameplayState.isOverdriveActive()
    const bossState = useBossState.getState()
    if (
      gameOver ||
      (bossState.status === 'defeated' && (!bossState.victoryReady || (bossState.relicCollected && !bossState.victoryDismissed)))
    ) {
      stateRef.current = { mode: gameOver ? 'defeated' : 'idle' }
      pendingAttack.current = null
      consumePlayerAttack()
      pendingTranslation.current = null
      const position = body.translation()
      movementVelocityRef.current.set(0, 0, 0)
      setPlayerWorldPosition(position.x, position.y, position.z)
      return
    }

    const delta = Math.min(rawDelta, 1 / 30)
    const input = usePlayerInput.getState()
    const moveMagnitude = Math.min(1, Math.hypot(input.moveX, input.moveY))
    const speed = (input.blocking ? WALK_SPEED * 0.5 : input.sprint ? SPRINT_SPEED : WALK_SPEED) * (overdriveActive ? 1.4 : 1)
    // Keep steering aligned with the follow camera's stable view of the level.
    // Avatar turns and camera collision must not rotate the input axes.
    const inputScale = speed / Math.max(1, Math.hypot(input.moveX, input.moveY))
    const targetMoveX = input.moveX * inputScale
    const targetMoveZ = -input.moveY * inputScale
    const acceleration = !groundedRef.current
      ? 5
      : moveMagnitude > 0
        ? input.sprint ? 10 : 8
        : 16
    movementVelocityRef.current.x = MathUtils.damp(
      movementVelocityRef.current.x,
      targetMoveX,
      acceleration,
      delta,
    )
    movementVelocityRef.current.z = MathUtils.damp(
      movementVelocityRef.current.z,
      targetMoveZ,
      acceleration,
      delta,
    )
    const actionTime = gameNow()
    if (consumePlayerDodge() && groundedRef.current && actionTime >= dodgeReadyAt.current) {
      if (moveMagnitude > 0.08) dodgeVelocity.current.set(targetMoveX, 0, targetMoveZ)
      else dodgeVelocity.current.set(Math.sin(yawRef.current), 0, Math.cos(yawRef.current))
      dodgeVelocity.current.normalize().multiplyScalar(10.5)
      dodgeUntil.current = actionTime + DODGE_ACTIVE_MS
      dodgeReadyAt.current = actionTime + DODGE_COOLDOWN_MS
      useGameplayState.setState({
        invulnerableUntil: Math.max(gameplayState.invulnerableUntil, dodgeUntil.current),
      })
    }
    const dodging = actionTime < dodgeUntil.current
    const velocity = dodging ? dodgeVelocity.current : movementVelocityRef.current
    const moveX = velocity.x
    const moveZ = velocity.z

    if (input.jumpQueued) {
      consumePlayerJump()
      if (groundedRef.current) {
        verticalSpeedRef.current = JUMP_SPEED
        triggerPlayerAudioEvent('jump')
      }
    }

    if (consumePlayerOverdrive()) {
      const activated = useGameplayState.getState().activateOverdrive()
      if (activated && visual) {
        visual.scale.setScalar(1.08)
      }
    }

    if (groundedRef.current && verticalSpeedRef.current < 0) {
      verticalSpeedRef.current = -0.5
    } else {
      verticalSpeedRef.current -= GRAVITY * delta
    }

    const currentPosition = body.translation()
    const collider = body.collider(0)
    controller.computeColliderMovement(
      collider,
      movementWithPendingTarget(currentPosition, pendingTranslation.current, {
        x: moveX * delta,
        y: verticalSpeedRef.current * delta,
        z: moveZ * delta,
      }),
      rapier.QueryFilterFlags.EXCLUDE_SENSORS,
      undefined,
      (obstacle) => obstacle.handle !== collider.handle,
    )
    const movement = controller.computedMovement()
    const nextPosition = {
      x: currentPosition.x + movement.x,
      y: currentPosition.y + movement.y,
      z: currentPosition.z + movement.z,
    }

    pendingTranslation.current = nextPosition
    body.setNextKinematicTranslation(nextPosition)
    avatarRootRef.current?.position.set(nextPosition.x, nextPosition.y, nextPosition.z)
    setPlayerWorldPosition(nextPosition.x, nextPosition.y, nextPosition.z)
    // Keep Bhairava visible during invulnerability. The old blink could hide
    // the small third-person avatar for half of every damage window.
    visual.visible = true
    const grounded = controller.computedGrounded()
    if (grounded && !groundedRef.current && verticalSpeedRef.current < -2) {
      landedAt.current = clock.elapsedTime
    }
    groundedRef.current = grounded
    if (groundedRef.current && verticalSpeedRef.current < 0) {
      verticalSpeedRef.current = 0
    }

    const horizontalSpeed = Math.hypot(moveX, moveZ)
    if (horizontalSpeed > 0.08) {
      yawRef.current = Math.atan2(-moveX, -moveZ)
    }

    const now = gameNow()
    const bufferedAttack = resolveAttackInput(pendingAttack.current, consumePlayerAttack(), now, attackReadyAt.current, active && !input.blocking && !dodging)
    pendingAttack.current = bufferedAttack.pending
    const attackType = bufferedAttack.attack
    if (attackType) {
      const duration = attackType === 'heavy' ? 0.72 : 0.42
      const cooldown = attackType === 'heavy' ? 900 : 420
      attackReadyAt.current = now + cooldown
      attackSequence.current += 1
      attackRef.current = {
        type: attackType,
        startedAt: clock.elapsedTime,
        duration,
      }
      triggerPlayerAudioEvent('playerAttack')

      const missionTwo = useCampaignState.getState().selectedMissionId === 'mission-2'
      const missionThree = useCampaignState.getState().selectedMissionId === 'mission-3'
      const assistedCombat = missionTwo || Boolean(EXPANSION_MISSIONS[useCampaignState.getState().selectedMissionId])
      const attackRange = assistedCombat
        ? missionThree ? attackType === 'heavy' ? 5.2 : 4.6 : attackType === 'heavy' ? 3.8 : 3.35
        : attackType === 'heavy' ? 2.85 : 2.35
      const minimumFacing = assistedCombat ? 0.05 : 0.16
      const damage = (attackType === 'heavy' ? 48 : 24) * (overdriveActive ? 1.35 : 1)
      let nearestEnemyForAim = null
      let nearestEnemyDistance = attackRange + 0.75
      if (assistedCombat) {
        for (const [enemyId, enemy] of enemyRuntime) {
          if (!enemy.alive || useCombatState.getState().defeatedEnemyIds.includes(enemyId)) continue
          const distance = Math.hypot(
            enemy.position.x - nextPosition.x,
            enemy.position.z - nextPosition.z,
          )
          if (distance < nearestEnemyDistance) {
            nearestEnemyForAim = enemy
            nearestEnemyDistance = distance
          }
        }
      }
      if (nearestEnemyForAim) {
        yawRef.current = Math.atan2(
          nextPosition.x - nearestEnemyForAim.position.x,
          nextPosition.z - nearestEnemyForAim.position.z,
        )
      }
      let forwardX = -Math.sin(yawRef.current)
      let forwardZ = -Math.cos(yawRef.current)
      let target = null
      let targetDistance = attackRange
      let targetIsBoss = false

      for (const [enemyId, enemy] of enemyRuntime) {
        if (!enemy.alive || useCombatState.getState().defeatedEnemyIds.includes(enemyId)) continue
        const offsetX = enemy.position.x - nextPosition.x
        const offsetZ = enemy.position.z - nextPosition.z
        const distance = Math.hypot(offsetX, offsetZ)
        if (distance > targetDistance || distance < 0.001) continue

        const facing = (offsetX * forwardX + offsetZ * forwardZ) / distance
        if (facing < minimumFacing) continue

        const direction = new Vector3(
          offsetX / distance,
          (enemy.position.y - nextPosition.y) / distance,
          offsetZ / distance,
        ).normalize()
        const ray = new rapier.Ray(
          { x: nextPosition.x, y: nextPosition.y + 1.18, z: nextPosition.z },
          { x: direction.x, y: direction.y, z: direction.z },
        )
        const obstruction = world.castRay(
          ray,
          distance,
          true,
          undefined,
          GAMEPLAY_QUERY_GROUPS,
          collider,
          body,
        )
        // The attack ray ends on the enemy's near surface. Large bodies need a
        // larger allowance or their own collider is mistaken for cover.
        const targetColliderRadius = enemy.type === 'glassBrute'
          ? 1.05
          : enemy.type === 'heavy'
            ? 0.8
            : 0.5
        if (obstruction && obstruction.timeOfImpact < distance - targetColliderRadius) continue

        target = enemy
        targetIsBoss = false
        targetDistance = distance
      }

      const currentBoss = useBossState.getState()
      if (currentBoss.status === 'active') {
        const boss = bossRuntime.position
        const offsetX = boss.x - nextPosition.x
        const offsetZ = boss.z - nextPosition.z
        const distance = Math.hypot(offsetX, offsetZ)
        const bossRange = attackRange + (assistedCombat ? 3.8 : 1.65)
        if (distance <= bossRange && distance > 0.001) {
          if (assistedCombat) {
            yawRef.current = Math.atan2(
              nextPosition.x - boss.x,
              nextPosition.z - boss.z,
            )
            forwardX = -Math.sin(yawRef.current)
            forwardZ = -Math.cos(yawRef.current)
          }
          const facing = (offsetX * forwardX + offsetZ * forwardZ) / distance
          if (facing >= minimumFacing && (!target || distance < targetDistance)) {
            const direction = new Vector3(
              offsetX / distance,
              (boss.y - nextPosition.y) / distance,
              offsetZ / distance,
            ).normalize()
            const ray = new rapier.Ray(
              { x: nextPosition.x, y: nextPosition.y + 1.18, z: nextPosition.z },
              { x: direction.x, y: direction.y, z: direction.z },
            )
            const obstruction = world.castRay(
              ray,
              distance,
              true,
              undefined,
              GAMEPLAY_QUERY_GROUPS,
              collider,
              body,
            )
            if (!obstruction || obstruction.timeOfImpact >= distance - 2.2) {
              target = { id: 'arena-warden', position: boss }
              targetIsBoss = true
              targetDistance = distance
            }
          }
        }
      }

      if (target) {
        useNarrativeCueState.getState().announceFightDialogue('playerHit')
        const landed = targetIsBoss
          ? useBossState.getState().damageBoss(damage, target.position)
          : useCombatState.getState().damageEnemy(target.id, damage, target.position)
        if (landed) hitConfirmedAt.current = now
      }
    }

    const attackElapsed = clock.elapsedTime - attackRef.current.startedAt
    const attackProgress =
      attackRef.current.type && attackElapsed < attackRef.current.duration
        ? Math.sin(Math.min(1, attackElapsed / attackRef.current.duration) * Math.PI)
        : 0
    if (attackRef.current.type && attackProgress === 0 && attackElapsed >= attackRef.current.duration) {
      attackRef.current.type = null
    }
    const activeAttackType = attackRef.current.type && attackElapsed < attackRef.current.duration ? attackRef.current.type : null

    if (now >= nextTargetCheckAt.current) {
      nextTargetCheckAt.current = now + 180
      let nearestId = null
      let nearestDistance = 8
      for (const [enemyId, enemy] of enemyRuntime) {
        if (!enemy.alive || useCombatState.getState().defeatedEnemyIds.includes(enemyId)) continue
        const distance = Math.hypot(
          enemy.position.x - nextPosition.x,
          enemy.position.z - nextPosition.z,
        )
        if (distance < nearestDistance) {
          nearestDistance = distance
          nearestId = enemyId
        }
      }
      useCombatState.getState().setTargetEnemyId(nearestId)
      const boss = useBossState.getState()
      if (
        boss.status === 'active' &&
        Math.hypot(
          bossRuntime.position.x - nextPosition.x,
          bossRuntime.position.z - nextPosition.z,
        ) < nearestDistance
      ) {
        useCombatState.getState().setTargetEnemyId(null)
        useBossState.getState().setTargetEnemyId('arena-warden')
      } else {
        useBossState.getState().setTargetEnemyId(null)
      }
    }

    visual.rotation.y = MathUtils.damp(visual.rotation.y, yawRef.current, 12, delta)
    const targetScale = overdriveActive ? 1.08 : 1
    visual.scale.lerp(new Vector3(targetScale, targetScale, targetScale), 0.18)
    const mode = !groundedRef.current
      ? 'jumping'
      : horizontalSpeed < 0.08
        ? 'idle'
        : input.sprint || dodging
          ? 'sprinting'
          : horizontalSpeed < WALK_SPEED * 0.65
            ? 'walking'
            : 'running'
    stateRef.current = {
      mode,
        dodging,
        dodgeProgress: dodging ? 1 - (dodgeUntil.current - actionTime) / DODGE_ACTIVE_MS : 0,
      speed: horizontalSpeed,
      verticalSpeed: verticalSpeedRef.current,
      attackType: activeAttackType,
      attackProgress,
      attackPhase: activeAttackType ? Math.min(1, Math.max(0, attackElapsed / attackRef.current.duration)) : 0,
      attackSequence: attackSequence.current,
      hitConfirmedAt: hitConfirmedAt.current,
      damagedAt: gameplayState.damagedAt,
      guarding: input.blocking && !dodging,
      landing: grounded ? Math.max(0, 1 - (clock.elapsedTime - landedAt.current) / LANDING_DURATION) : 0,
    }

    playerPosition.current.set(nextPosition.x, nextPosition.y, nextPosition.z)
    rayOrigin.current.set(nextPosition.x, nextPosition.y + 1.3, nextPosition.z)

    const cameraMission=useCampaignState.getState().selectedMissionId
    const preserveCameraContinuity=cameraMission==='mission-1'||cameraMission==='mission-2'
    const arcFraming=Boolean(arcBossFor(cameraMission))
    const bossFraming=(preserveCameraContinuity||arcFraming)&&bossState.status!=='dormant'&&!bossState.victoryDismissed
    const aspect = size.width / Math.max(1, size.height)
    const portrait = aspect < 0.75
    const cameraDistance = portrait ? (bossFraming&&arcFraming?8.8:6.8) : bossFraming ? (arcFraming?8.6:6.2) : 4.15
    const cameraHeight = portrait ? (bossFraming&&arcFraming?4.8:3.6) : bossFraming ? (arcFraming?4.3:3.0) : 2.45
    const shoulderOffset = MathUtils.clamp((aspect - 0.75) * 1.25, 0, 1.55)
    const shoulderX = nextPosition.x + shoulderOffset
    lookTarget.current.set(shoulderX, nextPosition.y + 1.25, nextPosition.z)
    if(bossFraming)lookTarget.current.set(
      (nextPosition.x+bossRuntime.position.x)*.5+shoulderOffset*.2,
      nextPosition.y+2.0,
      (nextPosition.z+bossRuntime.position.z)*.5,
    )
    desiredCameraPosition.current.set(
      shoulderX,
      nextPosition.y + cameraHeight,
      nextPosition.z + cameraDistance,
    )

    // Both existing arenas seal after the 2.2s presented introduction.
    // Ease onto its interior side while the passage is still open, so closing
    // it cannot cut the smoothed rear-camera ray down into the player's body.
    // CinematicStage remains the sole camera owner during authored cinematics.
    if (preserveCameraContinuity && bossState.status === 'intro') {
      if (!stagingArenaCamera.current) cameraShoulder.current = nextPosition.x > 0 ? -1 : 1
      stagingArenaCamera.current = true
      desiredCameraPosition.current.set(nextPosition.x + cameraDistance * cameraShoulder.current, nextPosition.y + cameraHeight + 0.3, nextPosition.z)
    } else stagingArenaCamera.current = false

    const damageAge = gameplayState.damagedAt ? gameNow() - gameplayState.damagedAt : Infinity
    if (damageAge < 420) {
      const shakeStrength = (1 - damageAge / 420) * 0.28
      desiredCameraPosition.current.x += (Math.random() - 0.5) * shakeStrength
      desiredCameraPosition.current.y += (Math.random() - 0.5) * shakeStrength * 0.7
      desiredCameraPosition.current.z += (Math.random() - 0.5) * shakeStrength
    }

    let clearance = cameraClearance(world, rapier, rayOrigin.current, desiredCameraPosition.current, collider, body, 0.45)
    if (clearance < 0.95) {
      const bestCamera = desiredCameraPosition.current.clone()
      let closestClearDistance=Infinity
      for (const [offsetX, lift, offsetZ] of cameraEscapeOffsets(cameraDistance, shoulderOffset)) {
        alternativeCamera.current.set(
          nextPosition.x + offsetX,
          nextPosition.y + cameraHeight + lift,
          nextPosition.z + offsetZ,
        )
        const alternativeClearance = cameraClearance(world, rapier, rayOrigin.current, alternativeCamera.current, collider, body, 0.45)
        const clearCandidate=preserveCameraContinuity&&alternativeClearance>=.95
        const continuityDistance=clearCandidate?cameraPosition.current.distanceToSquared(alternativeCamera.current):Infinity
        // Keep a clear side view instead of briefly selecting the first high
        // candidate and immediately dropping back down once the rear ray clears.
        if ((clearCandidate&&continuityDistance<closestClearDistance) ||
            (!clearCandidate&&closestClearDistance===Infinity&&alternativeClearance>clearance+.15)) {
          clearance = alternativeClearance
          bestCamera.copy(alternativeCamera.current)
          if(clearCandidate)closestClearDistance=continuityDistance
        }
      }
      desiredCameraPosition.current.copy(bestCamera)
    }
    const zoom = cameraClearance(world, rapier, rayOrigin.current, desiredCameraPosition.current, collider, body, 0.45)
    desiredCameraPosition.current.lerpVectors(rayOrigin.current, desiredCameraPosition.current, zoom)

    const followBlend = 1 - Math.exp(-7 * delta)
    cameraPosition.current.lerp(desiredCameraPosition.current, followBlend)
    // Recheck the smoothed path. Lerp alone can cross walls when the target turns.
    const safeBlend = cameraClearance(world, rapier, rayOrigin.current, cameraPosition.current, collider, body, 0.18)
    cameraPosition.current.lerpVectors(rayOrigin.current, cameraPosition.current, safeBlend)
    cameraTarget.current.lerp(lookTarget.current, followBlend)
    camera.position.copy(cameraPosition.current)
    camera.lookAt(cameraTarget.current)
  })

  return (
    <>
      <PlayerInput active={active} />
      <RigidBody
        ref={bodyRef}
        type="kinematicPosition"
        position={PLAYER_START}
        colliders={false}
        enabledRotations={[false, false, false]}
        name="player"
      >
        <CapsuleCollider
          args={[(PLAYER_HEIGHT - PLAYER_RADIUS * 2) / 2, PLAYER_RADIUS]}
          position={[0, PLAYER_HEIGHT / 2, 0]}
          collisionGroups={0x00010001}
          friction={0}
          name="player-capsule"
        />
      </RigidBody>
      <group ref={avatarRootRef} visible={showAvatar}>
        <Suspense fallback={<ProceduralCharacter stateRef={stateRef} />}>
          <RiggedBhairava stateRef={stateRef} />
        </Suspense>
      </group>
    </>
  )
}

export default Player
