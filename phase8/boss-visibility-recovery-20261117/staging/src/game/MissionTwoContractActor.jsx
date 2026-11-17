import { usePauseState } from './pauseSystem.js'
import { useCinematic } from './cinematics/controller.js'
import { useEffect, useMemo, useRef } from 'react'
import { useFrame, createPortal } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { AnimationMixer, Box3, MathUtils, Vector3 } from 'three'
import { clone } from 'three/addons/utils/SkeletonUtils.js'
import { applyBhairavaAppearance } from './player/bhairavaAppearance.js'
import { prepareCharacterClips } from './player/characterAnimation.js'
import BhairavaWeapon from './player/BhairavaWeapon.jsx'
export default function ContractActor({ source, hero = false, runtime, enabled, cinematicSession }) {
  const asset = useGLTF(source), group = useRef(null), baton = useRef(null), weaponMaterial = useRef(null)
  const model = useMemo(() => {
    const scene = clone(asset.scene)
    // This source's bind matrices are not a standing measurement. Prime its
    // existing idle pose and skin bounds before normalising this private clone.
    const prime = new AnimationMixer(scene), clip = asset.animations.find(c => c.name === (hero ? 'Sword idle (guard)' : 'Idle'))
    if (clip) prime.clipAction(clip).play()
    prime.update(0); scene.updateMatrixWorld(true)
    scene.traverse(o => { if (o.isSkinnedMesh) { o.skeleton.update(); o.computeBoundingBox() } })
    const box = new Box3().setFromObject(scene), scale = (hero ? 1.78 : 2.1) / box.getSize(new Vector3()).y
    prime.stopAllAction(); prime.uncacheRoot(scene)
    scene.scale.setScalar(scale); scene.position.y = -box.min.y * scale; scene.rotation.y = Math.PI
    scene.traverse(o => { if (o.isMesh) o.castShadow = o.receiveShadow = true })
    return scene
  }, [asset, hero])
  const animation = useRef(null)
  useEffect(() => {
    const restore = hero ? applyBhairavaAppearance(model) : null, mixer = new AnimationMixer(model)
    const clips = hero ? prepareCharacterClips(asset.animations) : asset.animations
    animation.current = { mixer, actions: Object.fromEntries(clips.map(c => [c.name, mixer.clipAction(c)])), current: null }
    return () => { mixer.stopAllAction(); mixer.uncacheRoot(model); restore?.(); animation.current = null }
  }, [asset, hero, model])
  useFrame((_, delta) => {
    if (usePauseState.getState().paused || !enabled || (useCinematic.getState().session && !cinematicSession) || !group.current || !animation.current) return
    const s = runtime.current, a = animation.current
    group.current.position.set(hero ? s.x : s.enemyX, hero && s.jumpUntil > s.time ? Math.sin((.65 - s.jumpUntil + s.time) / .65 * Math.PI) * 1.1 : 0, hero ? s.z : s.enemyZ)
    group.current.rotation.y = hero ? s.yaw : Math.atan2(s.enemyX - s.x, s.enemyZ - s.z)
    if (cinematicSession?.config.id === 'm2-bounty-finish') group.current.rotation.x = -Math.PI / 2 * MathUtils.clamp((cinematicSession.time - 1.7) / .8, 0, 1)
    const attack = hero && s.time - s.attackTime < .65
    const name = hero ? attack ? 'Sword slash' : s.guarded ? 'Sword block' : s.jumpUntil > s.time ? 'Jump (in air)' : s.speed > .1 ? 'Run' : 'Sword idle (guard)' : !cinematicSession && s.enemyStage === 'approach' ? 'Run' : 'Idle'
    if (name !== a.current) { a.actions[a.current]?.fadeOut(.12); a.actions[name]?.reset().fadeIn(.12).play(); a.current = name }
    if (hero && attack && a.sequence !== s.attackSequence) { a.actions[name]?.reset().play(); a.sequence = s.attackSequence }
    a.mixer.update(Math.min(delta, .05))
    if (!hero) {
      const tell = s.enemyStage === 'telegraph', strike = s.enemyStage === 'strike'
      const lean = strike ? Math.sin(s.stageTime * 9) * .12 : tell ? -.06 : 0
      group.current.rotation.z = MathUtils.damp(group.current.rotation.z, lean, 12, delta)
      if (baton.current) {
        const swing = strike ? Math.sin(Math.min(1, s.stageTime / .2) * Math.PI) * 1.6 : tell ? -.65 : -.15
        baton.current.rotation.z = MathUtils.damp(baton.current.rotation.z, swing, 18, delta)
      }
    }
  })
  return <group ref={group}>
    <primitive object={model} />
    {hero && model.getObjectByName('WeaponR') && createPortal(<BhairavaWeapon bladeMaterialRef={weaponMaterial} />, model.getObjectByName('WeaponR'))}
    {!hero && <mesh ref={baton} position={[.65, 1.2, 0]} rotation={[0, 0, -.45]}><boxGeometry args={[.09, 1.2, .09]} /><meshStandardMaterial color="#e5a65d" metalness={.7} roughness={.3} /></mesh>}
  </group>
}

