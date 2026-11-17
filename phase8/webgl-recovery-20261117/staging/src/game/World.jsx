import { batchMission } from './chapters/batch20Content.js'
import { cityEnabled } from './phase54e/cityAssets.js'
import { Suspense, useLayoutEffect, useRef } from 'react'
import { Color, Object3D } from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import Gameplay from './Gameplay.jsx'
import TierCityAtmosphere from './TierCityAtmosphere.jsx'
import { makeTierSurface } from './TierCitySurfaces.js'
import { CAMERA_COLLIDER_GROUPS } from './collisionGroups.js'
import { getPlayerWorldPosition } from './gameplayStore.js'
import TierCityLighting from './TierCityLighting.jsx'
import GraphicsFoundation from './GraphicsFoundation.jsx'
import { useGroundDetail } from './groundDetail.js'
import KashiEnvironment from './KashiEnvironment.jsx'
import MissionOneRubble from './MissionOneRubble.jsx'

const rockFormations = [
  { position: [-11, 0.3, -9], scale: [2.4, 1.7, 2.2], rotation: [0.2, 0.4, -0.1] },
  { position: [10, 0.2, -13], scale: [3.2, 1.3, 2.4], rotation: [-0.1, 0.8, 0.1] },
  { position: [-16, 0.1, 3], scale: [2.8, 1.2, 3.4], rotation: [0.1, -0.5, 0] },
  { position: [15, 0.2, 5], scale: [2.2, 1.5, 2.6], rotation: [0, 0.6, 0.1] },
  { position: [-6, 0.1, -20], scale: [4, 1.6, 2.2], rotation: [0.2, -0.3, 0] },
  { position: [4, 0.2, 17], scale: [3.5, 1.3, 2.6], rotation: [-0.1, 0.2, 0] },
]

const monoliths = [
  { position: [-8, 0, -7], height: 6.4, rotation: -0.12 },
  { position: [9, 0, -12], height: 5, rotation: 0.16 },
  { position: [14, 0, 2], height: 5.6, rotation: 0.1 },
  { position: [-15, 0, 0], height: 6, rotation: -0.2 },
]

function Ground({ missionId }) {
  const detail = useGroundDetail()
  const material = useRef(null)
  useLayoutEffect(() => {
    if (missionId !== 'mission-5') return undefined
    const surface = makeTierSurface('street')
    const ground = material.current
    ground.map = surface
    ground.bumpMap = surface
    ground.bumpScale = 0.1
    ground.needsUpdate = true
    return () => {
      ground.map = ground.bumpMap = null
      ground.needsUpdate = true
      surface.dispose()
    }
  }, [missionId])
  const prismMission = missionId === 'mission-2'
  const groundColor = missionId === 'mission-3'
    ? '#494137'
    : missionId === 'mission-4'
      ? '#3b3d39'
      : missionId === 'mission-5'
        ? '#a98e79'
        : prismMission ? '#698b88' : '#b6a18a'
  return (
    <>
      <mesh
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
        position={missionId === 'mission-1' ? [44, -0.22, 0] : [0, -0.22, 0]}
      >
        <planeGeometry args={missionId === 'mission-1' ? [112, 200] : [200, 200]} />
        <meshStandardMaterial
          ref={material}
          map={missionId==='mission-5'?undefined:detail.color}
          normalMap={detail.normal}
          roughnessMap={detail.roughness}
          aoMap={detail.ao}
          aoMapIntensity={.4}
          color={groundColor}
          roughness={prismMission ? 0.48 : 0.96}
          metalness={prismMission ? 0.22 : 0}
        />
      </mesh>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={missionId==='mission-1'&&cityEnabled()?[56,.2,100]:[100,.2,100]} position={missionId==='mission-1'&&cityEnabled()?[44,-.42,0]:[0,-.42,0]} />
      </RigidBody>
    </>
  )
}

function RuinDressing({ tierCity }) {
  const debris = useRef(null)

  useLayoutEffect(() => {
    const fragment = new Object3D()
    const stone = new Color()
    for (let index = 0; index < debris.current.count; index += 1) {
      const size = 0.07 + (index % 11) * 0.022
      fragment.position.set(((index * 37) % 233) / 10 - 11.6, -0.21, 10 - ((index * 71) % 710) / 10)
      fragment.rotation.set(index * 0.7, index * 1.9, index * 0.4)
      fragment.scale.set(size * 1.7, size * 0.45, size)
      fragment.updateMatrix()
      debris.current.setMatrixAt(index, fragment.matrix)
      debris.current.setColorAt(index, stone.set(index % 3 ? '#77604d' : '#a38365'))
    }
    debris.current.instanceMatrix.needsUpdate = true
    debris.current.instanceColor.needsUpdate = true
  }, [])

  return (
    <>
      <instancedMesh ref={debris} args={[undefined, undefined, 220]} receiveShadow>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial roughness={1} flatShading />
      </instancedMesh>
      {tierCity && (
        <group position={[0, 0, -71]}>
          <mesh>
            <torusGeometry args={[12, 0.65, 8, 48, Math.PI]} />
            <meshStandardMaterial color="#685344" roughness={0.66} metalness={0.45} />
          </mesh>
          <mesh position={[0, 0, 0.5]}>
            <torusGeometry args={[11.85, 0.085, 6, 48, Math.PI]} />
            <meshStandardMaterial color="#ffb765" emissive="#f37c2e" emissiveIntensity={1.5} />
          </mesh>
        </group>
      )}
    </>
  )
}

function ExpansionLandmarks({ missionId }) {
  if (['mission-3', 'mission-6'].includes(missionId)) {
    return (
      <group>
        {[-8.5, 8.5].flatMap((side) => [-7, -22, -37, -52].map((z, index) => (
          <RigidBody key={`market-${side}-${z}`} type="fixed" colliders={false} position={[side, 0, z]}>
            <CuboidCollider args={[1.85, 2.2, 1.4]} position={[0, 2.2, 0]} />
            <CuboidCollider args={[2.1, 0.15, 1.75]} position={[-side * 0.2, 4.5, 0.2]} />
            <mesh castShadow position={[0, 2.2, 0]}>
              <boxGeometry args={[3.7, 4.4, 2.8]} />
              <meshStandardMaterial color={index % 2 ? '#64523f' : '#50463b'} roughness={0.94} />
            </mesh>
            <mesh castShadow position={[-side * 0.2, 4.5, 0.2]}>
              <boxGeometry args={[4.2, 0.3, 3.5]} />
              <meshStandardMaterial color={index % 2 ? '#bd8050' : '#8f6848'} roughness={0.88} />
            </mesh>
            <mesh position={[0, 1.2, side < 0 ? 1.43 : -1.43]}>
              <boxGeometry args={[2.8, 1.1, 0.09]} />
              <meshStandardMaterial color="#302d29" metalness={0.22} roughness={0.78} />
            </mesh>
          </RigidBody>
        )))}
      </group>
    )
  }

  if (['mission-4', 'mission-9', 'mission-10'].includes(missionId)) {
    return (
      <group>
        {[-1, 1].flatMap((side) => [-16, -39].map((z) => (
          <RigidBody key={`wreck-${side}-${z}`} type="fixed" colliders={false} position={[side * 7.8, 0.55, z]} rotation={[0, side * -0.18, side * 0.12]}>
            <CuboidCollider args={[2.35, 0.575, 1.4]} />
            <CuboidCollider args={[1.25, 0.375, 1.15]} position={[0, 0.9, -0.2]} rotation={[0, 0, -0.18]} />
            <mesh castShadow>
              <boxGeometry args={[4.7, 1.15, 2.8]} />
              <meshStandardMaterial color="#4b4b43" metalness={0.48} roughness={0.72} />
            </mesh>
            <mesh castShadow position={[0, 0.9, -0.2]} rotation={[0, 0, -0.18]}>
              <boxGeometry args={[2.5, 0.75, 2.3]} />
              <meshStandardMaterial color="#676052" metalness={0.42} roughness={0.68} />
            </mesh>
            {[-1, 1].map((wheel) => (
              <mesh key={wheel} castShadow rotation={[0, 0, Math.PI / 2]} position={[wheel * 1.7, -0.15, 1.3]}>
                <cylinderGeometry args={[0.52, 0.52, 0.28, 10]} />
                <meshStandardMaterial color="#202321" roughness={0.88} />
              </mesh>
            ))}
            <mesh position={[0, 0.15, 1.43]}>
              <boxGeometry args={[1.5, 0.12, 0.06]} />
              <meshBasicMaterial color="#f1a44f" toneMapped={false} />
            </mesh>
          </RigidBody>
        )))}
      </group>
    )
  }

  if (['mission-5', 'mission-7', 'mission-8'].includes(missionId)) {
    return (
      <group>
        <TierCityLighting fire={missionId === 'mission-5'} />
        {[-1, 1].flatMap((side) => [-10, -26, -42, -56].map((z, index) => (
          <group key={`tier-${side}-${z}`} position={[side * 10.2, 0, z]}>
              <RigidBody type="fixed" colliders={false}>
                <CuboidCollider
                  args={[2.2, 3.2 + index * 0.35, 2.4]}
                  position={[0, 3.2 + index * 0.35, 0]}
                />
              </RigidBody>
            <mesh castShadow receiveShadow position={[0, 3.2 + index * 0.35, 0]}>
              <boxGeometry args={[4.4, 6.4 + index * 0.7, 4.8]} />
              <meshStandardMaterial color={index % 2 ? '#48434e' : '#3b3c47'} metalness={0.34} roughness={0.72} />
            </mesh>
            {[1.4, 3.1, 4.8].map((y) => (
              <mesh key={y} position={[0, y, side < 0 ? 2.42 : -2.42]}>
                <boxGeometry args={[3.3, 0.09, 0.08]} />
                <meshBasicMaterial color="#db8b58" toneMapped={false} />
              </mesh>
            ))}
          </group>
        )))}
      </group>
    )
  }

  return null
}

const glassFormations = [
  { position: [-8.7, 0, -7], height: 7.4, rotation: 0.25, color: '#655c91' },
  { position: [8.6, 0, -12], height: 6.1, rotation: -0.3, color: '#72648f' },
  { position: [-8.8, 0, -23], height: 8.2, rotation: -0.18, color: '#505d89' },
  { position: [8.8, 0, -31], height: 7, rotation: 0.2, color: '#665485' },
  { position: [-8.5, 0, -41], height: 6.5, rotation: 0.32, color: '#5b558e' },
  { position: [8.6, 0, -49], height: 8.4, rotation: -0.25, color: '#71608d' },
]

function GlassWasteFormation({ position, height, rotation, color, index }) {
  const visualRef = useRef(null)
  const cameraColliderRef = useRef(null)
  const { camera } = useThree()

  useFrame(() => {
    const player = getPlayerWorldPosition()
    const distance = Math.hypot(player.x - position[0], player.z - position[2])
    const cameraDistance = Math.hypot(camera.position.x - position[0], camera.position.z - position[2])
    if (visualRef.current) {
      const visible =
        distance > height * 0.58 + 5.5 && cameraDistance > height * 0.58 + 2.5
      visualRef.current.visible = visible
      // Decorative formations already disappear near the player/camera. Their
      // camera-only volume must disappear too, or an invisible crystal forces
      // the camera into Bhairava even though the view is visually unobstructed.
      const cameraCollider = cameraColliderRef.current
      if (cameraCollider && cameraCollider.isEnabled() !== visible) {
        cameraCollider.setEnabled(visible)
      }
    }
  })

  return (
    <RigidBody
      type="fixed"
      colliders={false}
      position={position}
      rotation={[0, rotation, 0]}
    >
      <CuboidCollider
        ref={cameraColliderRef}
        args={[height * 0.35, height * 0.3, height * 0.35]}
        position={[0, height * 0.62, 0]}
        collisionGroups={CAMERA_COLLIDER_GROUPS}
      />
      <group ref={visualRef}>
        <mesh castShadow receiveShadow position={[0, height * 0.38, 0]}>
          <octahedronGeometry args={[height * 0.43, 1]} />
          <meshPhysicalMaterial
            color={color}
            metalness={0.38}
            roughness={0.16}
            transmission={0.12}
            thickness={1.2}
          />
        </mesh>
        <mesh castShadow position={[0.72, height * 0.27, -0.18]} rotation={[0.12, 0.2, -0.16]}>
          <coneGeometry args={[0.9, height * 0.82, 5]} />
          <meshPhysicalMaterial
            color={index % 2 === 0 ? '#3d9dba' : '#9272ca'}
            emissive={index % 2 === 0 ? '#267a99' : '#6846a7'}
            emissiveIntensity={0.42}
            metalness={0.48}
            roughness={0.14}
            transmission={0.16}
            thickness={0.8}
          />
        </mesh>
        <mesh position={[-0.42, height * 0.32, 0.48]} rotation={[0.08, -0.4, 0.2]}>
          <coneGeometry args={[0.48, height * 0.67, 5]} />
          <meshStandardMaterial
            color="#b4a1db"
            emissive="#6c54a6"
            emissiveIntensity={0.85}
            metalness={0.62}
            roughness={0.22}
          />
        </mesh>
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.08, 0]}>
          <circleGeometry args={[2.8, 7]} />
          <meshStandardMaterial color="#302d3c" metalness={0.38} roughness={0.62} />
        </mesh>
      </group>
    </RigidBody>
  )
}

function GlassWasteFormations() {
  return glassFormations.map((formation, index) => (
    <GlassWasteFormation key={`glass-formation-${index}`} {...formation} index={index} />
  ))
}

function ResonanceArch({ position, rotation = 0 }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh castShadow position={[-2.8, 2.9, 0]}>
        <boxGeometry args={[0.55, 5.8, 0.65]} />
        <meshStandardMaterial color="#464153" metalness={0.64} roughness={0.34} />
      </mesh>
      <mesh castShadow position={[2.8, 2.9, 0]}>
        <boxGeometry args={[0.55, 5.8, 0.65]} />
        <meshStandardMaterial color="#464153" metalness={0.64} roughness={0.34} />
      </mesh>
      <mesh castShadow position={[0, 5.65, 0]}>
        <boxGeometry args={[6.4, 0.55, 0.65]} />
        <meshStandardMaterial color="#5e526f" metalness={0.72} roughness={0.28} />
      </mesh>
      <mesh position={[0, 5.65, 0.36]}>
        <boxGeometry args={[3.9, 0.12, 0.08]} />
        <meshStandardMaterial
          color="#bca2ff"
          emissive="#8159e8"
          emissiveIntensity={2.2}
          toneMapped={false}
        />
      </mesh>
      <pointLight position={[0, 5, 0]} color="#987aff" intensity={5} distance={14} />
    </group>
  )
}

function GlassWasteLandmarks() {
  return (
    <group>
      <GlassWasteFormations />
      <ResonanceArch position={[0, 0, -57]} rotation={Math.PI} />
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 12.5, 0, -18 - (side + 1) * 9]}>
          <mesh castShadow position={[0, 2.6, 0]} rotation={[0.1, side * 0.3, 0.18]}>
            <octahedronGeometry args={[2.6, 1]} />
            <meshPhysicalMaterial
              color="#756ba1"
              emissive="#504183"
              emissiveIntensity={0.5}
              metalness={0.42}
              roughness={0.17}
              transmission={0.16}
              thickness={1}
            />
          </mesh>
          <pointLight position={[0, 2.2, 0]} color="#896eff" intensity={3} distance={9} />
        </group>
      ))}
    </group>
  )
}

function RockFormations() {
  return rockFormations.map(({ position, scale, rotation }, index) => (
    <RigidBody
      key={`rock-${index}`}
      type="fixed"
      position={position}
      rotation={rotation}
      colliders={false}
    >
      <group scale={scale}><Suspense fallback={null}><KashiEnvironment assetPath="/environment/mission1/weathered-boulder-v1.glb" /></Suspense></group>
      <CuboidCollider
        args={[scale[0] * 0.72, scale[1] * 0.68, scale[2] * 0.72]}
      />
    </RigidBody>
  ))
}

function Monoliths() {
  return monoliths.map(({ position, height, rotation }, index) => (
    <RigidBody
      key={`monolith-${index}`}
      type="fixed"
      position={position}
      rotation={[0, rotation, 0]}
      colliders={false}
    >
      <group>
        <Suspense fallback={null}><group scale={[1,height/6.28,1]}><KashiEnvironment assetPath="/environment/previews/carved-monolith.glb" /></group></Suspense>
        <mesh position={[0, height / 2, 0.47]}>
          <boxGeometry args={[0.045, height * 0.72, 0.035]} />
          <meshStandardMaterial
            color="#e78a4b"
            emissive="#b84120"
            emissiveIntensity={1.4}
            toneMapped={false}
          />
        </mesh>
        <CuboidCollider args={[0.65, height / 2, 0.55]} position={[0, height / 2, 0]} />
      </group>
    </RigidBody>
  ))
}

function World({ missionId, burnParticles }) {
  const prismMission = missionId === 'mission-2'

  return (
    <group>
      <Ground missionId={missionId} />
      <GraphicsFoundation missionId={missionId} />
      {prismMission ? (
        <GlassWasteLandmarks />
      ) : missionId === 'mission-1' && !cityEnabled() ? (
        <>
          <RockFormations />
          <Monoliths />
        </>
      ) : null}
      <ExpansionLandmarks missionId={missionId} />
      {missionId === 'mission-5' && <TierCityAtmosphere burnParticles={burnParticles} />}
      {missionId==='mission-1' ? !cityEnabled()&&<Suspense fallback={null}><MissionOneRubble /></Suspense> : !prismMission && !batchMission(missionId) && <RuinDressing tierCity={missionId === 'mission-5'} />}
      <Gameplay />
    </group>
  )
}

export default World
