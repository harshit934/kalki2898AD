import { Suspense, use, useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { AnimationMixer, Box3, DataTexture, RGBAFormat, RepeatWrapping, Vector3 } from 'three'
import { clone } from 'three/addons/utils/SkeletonUtils.js'
import { isGameTimeHeld } from '../gameClock.js'
import { loadRevisionBase, loadRevisionNear } from './revisionAssets.js'
import { useGameplayState } from '../gameplayStore.js'

function useMasonry(asset) {
  const prepared = useMemo(() => {
    const scene = asset.model.scene.clone(true), owned = new Map()
    scene.traverse(o => {
      if (!o.isMesh) return
      const source = o.material
      if (!owned.has(source)) {
        const m = source.clone()
        if (/sandstone|basalt/.test(m.name)) { m.map = asset.maps[0]; m.normalMap = asset.maps[1]; m.normalScale.set(.28, .28); m.roughnessMap = asset.maps[2] }
        // Lime plaster stays visually distinct from the sandstone masonry.
        if (/plaster/.test(m.name)) { m.color.set('#c7c5aa'); m.roughness = .96; m.normalMap = asset.maps[1]; m.normalScale.set(.10, .10) }
        owned.set(source, m)
      }
      o.material = owned.get(source); o.receiveShadow = true
      o.castShadow = o.name.startsWith('detail-market')
    })
    return { scene, owned }
  }, [asset])
  useEffect(() => () => prepared.owned.forEach(m => m.dispose()), [prepared])
  return prepared.scene
}
function Civilian({ asset, position, rotation = 0, height, phase = 0, tint }) {
  const actor = useMemo(() => {
    const root = clone(asset.scene), bounds = new Box3().setFromObject(root), center = bounds.getCenter(new Vector3()), scale = height / bounds.getSize(new Vector3()).y
    root.scale.setScalar(scale); root.position.set(-center.x * scale, -bounds.min.y * scale, -center.z * scale)
    const owned = []
    root.traverse(o => {
      if (!o.isMesh) return
      const m = o.material.clone(); owned.push(m); o.material = m
      m.metalness = 0; m.roughness = /body|skin/i.test(m.name) ? .67 : .86
      if (tint && /tunic/i.test(m.name)) m.color.set(tint)
      o.castShadow = false; o.receiveShadow = true
    })
    const mixer = new AnimationMixer(root), clip = asset.animations.find(c => c.name === 'Idle')
    if (!clip) throw new Error('Licensed civilian idle clip missing')
    return { root, owned, mixer, clip }
  }, [asset, height, tint])
  useEffect(() => {
    const action = actor.mixer.clipAction(actor.clip); action.reset().play(); action.time = phase; actor.mixer.update(0)
    return () => { actor.mixer.stopAllAction(); actor.mixer.uncacheRoot(actor.root); actor.owned.forEach(m => m.dispose()) }
  }, [actor, phase])
  const mixer = useRef(actor.mixer)
  useEffect(() => { mixer.current = actor.mixer }, [actor])
  useFrame((_, delta) => { if (!isGameTimeHeld()) mixer.current.update(Math.min(delta, .05) * .75) })
  return <group position={position} rotation={[0, rotation, 0]} name="revision-licensed-civilian"><primitive object={actor.root} /></group>
}
function NearBlock() {
  const asset = use(loadRevisionNear()), scene = useMasonry(asset)
  return <group name="revision-near-ready">
    <primitive object={scene} />
    <Civilian asset={asset.merchant} position={[-22.5, -.12, -3.8]} rotation={-1.5} height={1.69} phase={.4} />
    <Civilian asset={asset.porter} position={[-25, -.12, -11]} rotation={.35} height={1.76} phase={1.8} />
    <Civilian asset={asset.merchant} position={[-22.6, -.12, -28]} rotation={-1.2} height={1.71} phase={2.7} tint="#c9b795" />
  </group>
}
function NearShoreWater() {
  const surface = useRef(null)
  const normal = useMemo(() => {
    const size = 128, data = new Uint8Array(size * size * 4)
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
      const a = x / size * Math.PI * 2, b = y / size * Math.PI * 2, i = (y * size + x) * 4
      data.set([128 + Math.round(12 * Math.cos(a * 4 + b)), 128 + Math.round(14 * Math.sin(b * 7 + a)), 251, 255], i)
    }
    const t = new DataTexture(data, size, size, RGBAFormat); t.wrapS = t.wrapT = RepeatWrapping; t.repeat.set(6, 20); t.needsUpdate = true; return t
  }, [])
  useEffect(() => () => normal.dispose(), [normal])
  useFrame((_, delta) => {
    if (!isGameTimeHeld() && surface.current?.normalMap) surface.current.normalMap.offset.y += Math.min(delta, .05) * .015
  })
  return <mesh position={[-35, -1.68, -19]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
    <planeGeometry args={[12, 65]} /><meshStandardMaterial ref={surface} color="#496a60" roughness={.37} metalness={.16} normalMap={normal} transparent opacity={.8} />
  </mesh>
}
export default function KashiRevision() {
  const base = use(loadRevisionBase()), scene = useMasonry(base), camera = useThree(s => s.camera)
  const [near, setNear] = useState(() => camera.position.distanceTo(new Vector3(-21, 0, -18)) < 50)
  const nearRef = useRef(near), sent = useRef(false), target = useMemo(() => new Vector3(-21, 0, -18), [])
  const roundId = useGameplayState(s => s.roundId)
  useEffect(() => { sent.current = false }, [roundId])
  useFrame(() => {
    const distance = camera.position.distanceTo(target), next = nearRef.current ? distance < 62 : distance < 48
    if (next !== nearRef.current) { nearRef.current = next; setNear(next) }
  })
  // After the existing RenderCadence submission, never a timer-based readiness bypass.
  useFrame(({ gl, scene: world }) => {
    if (sent.current || !world.getObjectByName('revision-near-ready') || gl.info.render.calls === 0) return
    sent.current = true
    queueMicrotask(() => window.dispatchEvent(new CustomEvent('kashi-revision-frame-ready', { detail: { roundId } })))
  }, 2)
  return <group name="phase54c-revision-block" userData={{ optIn: true, collision: 'unchanged; scenic bank remains outside the existing barrier' }}>
    <primitive object={scene} />
    <NearShoreWater />
    {near && <Suspense fallback={null}><NearBlock /></Suspense>}
  </group>
}
