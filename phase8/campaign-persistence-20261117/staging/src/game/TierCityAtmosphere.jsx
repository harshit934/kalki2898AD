import { useLayoutEffect, useMemo, useRef } from 'react'
import { useGameplayFrame } from './cinematics/useGameplayFrame.js'
import { AdditiveBlending, CanvasTexture, Color, Object3D } from 'three'
import { makeTierSurface } from './TierCitySurfaces.js'
import TierCityArcades from './TierCityArcades.jsx'
import { BURN_SITES as burnSites } from './tierLightSources.js'

const districts = [-10, -26, -42, -56]
const sides = [-1, 1]

function BuildingDetails({ pieces, emissive = false }) {
  const mesh = useRef(null)
  useLayoutEffect(() => {
    const transform = new Object3D()
    const color = new Color()
    pieces.forEach(({ position, size, tint }, index) => {
      transform.position.set(...position)
      transform.scale.set(...size)
      transform.updateMatrix()
      mesh.current.setMatrixAt(index, transform.matrix)
      mesh.current.setColorAt(index, color.set(tint))
    })
    mesh.current.instanceMatrix.needsUpdate = true
    mesh.current.instanceColor.needsUpdate = true
    mesh.current.computeBoundingSphere()
  }, [pieces])
  useLayoutEffect(() => {
    if (emissive) return undefined
    const surface = makeTierSurface('wall')
    const material = mesh.current.material
    material.map = material.bumpMap = surface
    material.bumpScale = 0.08
    material.needsUpdate = true
    return () => {
      material.map = material.bumpMap = null
      material.needsUpdate = true
      surface.dispose()
    }
  }, [emissive])

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, pieces.length]} receiveShadow={!emissive}>
      <boxGeometry />
      {emissive ? <meshBasicMaterial /> : <meshStandardMaterial roughness={0.83} metalness={0.28} />}
    </instancedMesh>
  )
}

const structure = sides.flatMap((side) => districts.flatMap((z, index) => {
  const x = side * 10.2
  const height = 6.4 + index * 0.7
  const streetFace = x - side * 2.22
  return [
    { position: [x, height + 0.55, z], size: [3.5, 1.1, 3.65], tint: '#5e5047' },
    { position: [x + side, height + 1.8, z - 0.9], size: [0.22, 2.5, 0.22], tint: '#302a28' },
    { position: [x, height + 0.17, z], size: [4.65, 0.34, 5.03], tint: '#605046' },
    { position: [streetFace, 0.56, z], size: [0.28, 1.12, 4.85], tint: '#493d34' },
    ...[-1.55, 1.55].flatMap((offset) => [1.95, 3.75, 5.55].map((y) => ({
      position: [streetFace, y, z + offset],
      size: [0.38, 0.54, 0.66],
      tint: '#504740',
    }))),
    ...[-1.75, 0, 1.75].map((offset) => ({
      position: [streetFace, height / 2, z + offset],
      size: [0.31, height, 0.28],
      tint: '#766256',
    })),
    ...[0.9, 2.7, 4.5].map((y) => ({
      position: [streetFace, y, z],
      size: [0.36, 0.22, 4.85],
      tint: '#342d29',
    })),
    { position: [side * (19 + index * 3), 7 + index * 1.2, z - 7], size: [5, 14 + index * 2.4, 6], tint: '#64564e' },
    { position: [side * (28 + index * 2), 11, z - 14], size: [4.2, 22, 5], tint: '#78665a' },
  ]
}))

const windows = sides.flatMap((side) => districts.flatMap((z) =>
  [1.55, 3.35, 5.15].flatMap((y) => [-1.2, -0.55, 0.55, 1.2].map((offset) => ({
    position: [side * 7.96, y, z + offset],
    size: [0.09, 0.3, 0.19],
    tint: offset < 0 ? '#eab581' : '#83a8a7',
  }))),
))

function StreetDust() {
  const dust = useRef(null)
  const positions = useMemo(() => Float32Array.from({ length: 240 * 3 }, (_, index) => {
    const particle = Math.floor(index / 3)
    if (index % 3 === 0) return ((particle * 37) % 300) / 10 - 15
    if (index % 3 === 1) return ((particle * 23) % 56) / 10
    return 14 - ((particle * 71) % 880) / 10
  }), [])
  useGameplayFrame(({ clock }) => {
    dust.current.position.x = Math.sin(clock.elapsedTime * 0.25) * 1.8
    dust.current.position.y = Math.sin(clock.elapsedTime * 0.4) * 0.3
  })
  return (
    <points ref={dust}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#e8b482" size={0.065} opacity={0.48} transparent depthWrite={false} />
    </points>
  )
}


function BurnParticles({ smoke }) {
  const points = useRef(null)
  const count = burnSites.length * 22
  const positions = useMemo(() => new Float32Array(count * 3), [count])

  useLayoutEffect(() => {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 64
    const context = canvas.getContext('2d')
    const glow = context.createRadialGradient(32, 32, 2, 32, 32, 32)
    glow.addColorStop(0, 'white')
    glow.addColorStop(0.38, 'rgba(255,255,255,0.65)')
    glow.addColorStop(1, 'rgba(255,255,255,0)')
    context.fillStyle = glow
    context.fillRect(0, 0, 64, 64)
    const texture = new CanvasTexture(canvas)
    const material = points.current.material
    material.map = texture
    material.needsUpdate = true
    return () => {
      material.map = null
      material.needsUpdate = true
      texture.dispose()
    }
  }, [])

  useGameplayFrame(({ clock }) => {
    const time = clock.elapsedTime
    const attribute = points.current.geometry.attributes.position
    for (let i = 0; i < count; i += 1) {
      const [x, z] = burnSites[Math.floor(i / 22)]
      const age = (time * (smoke ? 0.24 : 0.85) + i * 0.618) % 1
      const spread = smoke ? 0.45 + age * 1.1 : 0.62 * (1 - age)
      attribute.setXYZ(
        i,
        x + Math.sin(i * 2.4 + age * 4) * spread + (smoke ? age * 1.8 : 0),
        (smoke ? 0.8 : 0.1) + age * (smoke ? 5.4 : 1.65),
        z + Math.cos(i * 1.8) * spread,
      )
    }
    attribute.needsUpdate = true
  })

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={smoke ? '#59463d' : '#ff7926'}
        size={smoke ? 2.4 : 0.72}
        opacity={smoke ? 0.15 : 0.82}
        blending={smoke ? undefined : AdditiveBlending}
        transparent
        depthWrite={false}
      />
    </points>
  )
}

export default function TierCityAtmosphere({ burnParticles = true }) {
  return (
    <>
      <TierCityArcades />
      <BuildingDetails pieces={structure} />
      <BuildingDetails pieces={windows} emissive />
      <StreetDust />
      {burnParticles && <BurnParticles smoke />}
      {burnParticles && <BurnParticles />}
    </>
  )
}
