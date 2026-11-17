import { useEffect, useMemo, useRef } from 'react'
import { useGLTF, useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { CanvasTexture, DoubleSide, LOD, Object3D, RepeatWrapping, SRGBColorSpace } from 'three'
import { isGameTimeHeld } from '../gameClock.js'

export const KASHI_PROTOTYPE_ASSET = '/environment/phase54c/ghat-prototype-v2-draco.glb'
const SURFACES = ['stone-color.jpg', 'stone-normal.jpg', 'stone-roughness.jpg'].map(n => '/environment/kashi/' + n)
const AD_POSITIONS = [[17.9, 12.7, -9, -Math.PI / 2], [-24.8, 9, -4, Math.PI / 2]]

function noticeTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 1024; canvas.height = 512
  const c = canvas.getContext('2d')
  c.fillStyle = '#122a2b'; c.fillRect(0, 0, 1024, 512)
  c.strokeStyle = '#b39a68'; c.lineWidth = 4; c.strokeRect(22, 22, 980, 468)
  c.fillStyle = '#e3c98e'; c.font = '600 84px sans-serif'; c.fillText('కాశీ  /  KASHI', 58, 130)
  c.fillStyle = '#86c9bb'; c.font = '34px sans-serif'; c.fillText('GHAT 07   •   RIVER TRANSIT', 62, 213)
  c.fillStyle = '#d4c4a5'; c.font = '30px sans-serif'; c.fillText('SOLAR WATER EXCHANGE', 62, 295)
  c.fillStyle = '#b97855'; c.fillRect(62, 342, 320, 5)
  c.fillStyle = '#a3c5ba'; c.font = '26px sans-serif'; c.fillText('REFILL  /  REPAIR  /  RECHARGE', 62, 416)
  for (let y = 0; y < 512; y += 5) { c.fillStyle = '#06171920'; c.fillRect(0, y, 1024, 1) }
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  return texture
}

function PromenadePeople({ source, materials }) {
  const refs = useRef([]), time = useRef(0), dummy = useMemo(() => new Object3D(), [])
  const parts = source.children.filter(o => o.isMesh)
  useFrame((_, delta) => {
    if (!isGameTimeHeld()) time.current += Math.min(delta, .05)
    parts.forEach((_, part) => {
      const mesh = refs.current[part]
      if (!mesh) return
      for (let i = 0; i < 12; i++) {
        // Scenic promenade population only; never enters the combat corridor.
        const walking = i < 3, t = time.current * .23 + i * 1.4
        dummy.position.set(-20.8 + i % 3 * 1.05, 1.2 + (walking ? Math.sin(t * 7) * .015 : 0), walking ? 10 + Math.sin(t) * 6 : -2 + Math.floor(i / 3) * 5)
        dummy.rotation.set(0, walking ? Math.cos(t) > 0 ? 0 : Math.PI : i * 1.3, 0)
        dummy.scale.setScalar(.91 + i % 3 * .06); dummy.updateMatrix()
        mesh.setMatrixAt(i, dummy.matrix)
      }
      mesh.instanceMatrix.needsUpdate = true
    })
  })
  return <group name="54c-scenic-civilians" userData={{ nonInteractive: true }}>
    {parts.map((part, i) => <instancedMesh key={part.name} ref={node => { refs.current[i] = node }} args={[part.geometry, materials.get(part.material.name), 12]} receiveShadow />)}
  </group>
}

export default function KashiGhatPrototype() {
  const gltf = useGLTF(KASHI_PROTOTYPE_ASSET, '/environment/kashi/draco/')
  const maps = useTexture(SURFACES)
  const time = useRef(0), transitRef = useRef(null)
  const built = useMemo(() => {
    const textures = maps.map(t => t.clone())
    textures[0].colorSpace = SRGBColorSpace
    textures.forEach(t => { t.flipY = false; t.wrapS = t.wrapT = RepeatWrapping; t.anisotropy = 4 })
    const scene = gltf.scene.clone(true), materials = new Map(), groups = new Map()
    scene.traverse(o => {
      if (!o.isMesh) return
      if (!materials.has(o.material.name)) {
        const m = o.material.clone()
        if (/sandstone|plaster|basalt/.test(m.name)) {
          m.map = textures[0]; m.normalMap = textures[1]; m.normalScale.set(.3, .3); m.roughnessMap = textures[2]
        }
        if (/saffron|indigo/.test(m.name)) m.side = DoubleSide
        materials.set(m.name, m)
      }
      o.material = materials.get(o.material.name)
      // Only the nearby market contributes new dynamic shadow casters.
      o.castShadow = o.name.startsWith('ghat-market-lod0'); o.receiveShadow = true
    })
    const people = scene.getObjectByName('civilian-source')
    people.visible = false
    const transit = scene.getObjectByName('river-transit')
    for (const child of [...scene.children]) {
      const match = child.name.match(/^(.*)-lod([012])$/)
      if (!match) continue
      const base = match[1], level = Number(match[2])
      if (!groups.has(base)) {
        const lod = new LOD(); lod.name = '54c-' + base
        lod.position.copy(child.position); lod.quaternion.copy(child.quaternion)
        groups.set(base, lod)
      }
      child.position.set(0, 0, 0); child.rotation.set(0, 0, 0)
      groups.get(base).addLevel(child, [0, 55, 95][level])
    }
    groups.forEach(lod => scene.add(lod))
    return { scene, materials, textures, people, transit }
  }, [gltf, maps])
  const ad = useMemo(() => noticeTexture(), [])
  useEffect(() => () => {
    built.materials.forEach(m => m.dispose()); built.textures.forEach(t => t.dispose()); ad.dispose()
  }, [built, ad])
  useFrame((_, delta) => {
    if (!isGameTimeHeld()) time.current += Math.min(delta, .05)
    const transit = transitRef.current
    if (!transit) return
    transit.position.z = -28 + Math.sin(time.current * .065) * 35
    transit.position.y = .2 + Math.sin(time.current * .6) * .06
    transit.rotation.y = Math.cos(time.current * .065) > 0 ? 0 : Math.PI
  })
  return <group name="phase54c-opt-in-ghat" userData={{ prototype: true, collision: 'none; outside existing playable corridor' }}>
    <primitive object={built.scene} ref={node => { transitRef.current = node?.getObjectByName('river-transit') ?? null }} />
    <PromenadePeople source={built.people} materials={built.materials} />
    {AD_POSITIONS.map(([x, y, z, ry]) => <group key={x} position={[x, y, z]} rotation={[0, ry, 0]}>
      <mesh position={[0, 0, -.08]}><boxGeometry args={[3.8, 1.95, .14]} /><meshStandardMaterial color="#544d39" roughness={.47} metalness={.6} /></mesh>
      <mesh><planeGeometry args={[3.55, 1.77]} /><meshBasicMaterial map={ad} transparent opacity={.86} toneMapped={false} /></mesh>
    </group>)}
  </group>
}
