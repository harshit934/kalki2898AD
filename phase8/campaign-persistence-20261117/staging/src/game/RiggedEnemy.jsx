import { gameNow } from './gameClock.js'
import { useGameplayFrame } from './cinematics/useGameplayFrame.js'
import { useEffect, useMemo, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { AnimationMixer, Box3, Vector3 } from 'three'
import { clone } from 'three/addons/utils/SkeletonUtils.js'
import EnemyArmor from './EnemyArmor.jsx'

export default function RiggedEnemy({ type, motionRef, hitRef }) {
  const asset = useGLTF('/models/soldier-source.glb')
  const heavy = type === 'heavy'
  const currentAction = useRef(null)
  const animation = useRef(null)
  const model = useMemo(() => {
    const scene = clone(asset.scene)
    scene.updateMatrixWorld(true)
    const bounds = new Box3().setFromObject(scene)
    const height = bounds.getSize(new Vector3()).y
    scene.scale.setScalar((heavy ? 2.65 : 2.1) / height)
    scene.position.y = -bounds.min.y * scene.scale.y
    scene.rotation.y = Math.PI
    scene.traverse((object) => {
      if (!object.isMesh) return
      object.castShadow = object.receiveShadow = true
    })
    return { scene }
  }, [asset, heavy])
  useEffect(() => {
    const materials = []
    model.scene.traverse((object) => {
      if (!object.isMesh) return
      const original = object.material
      const owned = original.clone()
      if (owned.name.includes('Body')) {
        owned.color.set(heavy ? '#ae9979' : '#d1c4a7')
        owned.roughness = 0.65
      }
      object.material = owned
      materials.push({ object, original, owned })
    })
    const mixer = new AnimationMixer(model.scene)
    const actions = Object.fromEntries(asset.animations.map((clip) => [clip.name, mixer.clipAction(clip)]))
    animation.current = { mixer, actions }
    currentAction.current = null
    return () => {
      animation.current = null
      currentAction.current = null
      mixer.stopAllAction()
      mixer.uncacheRoot(model.scene)
      for (const { object, original, owned } of materials) {
        // Detach only our clone; cached asset materials are never disposed here.
        if (object.material === owned) object.material = original
        owned.dispose()
      }
    }
  }, [asset, heavy, model])
  useGameplayFrame((_, delta) => {
    const runtime = animation.current
    if (!runtime) return
    const speed = motionRef.current
    const action = runtime.actions[speed > 2.5 ? 'Run' : speed > 0.15 ? 'Walk' : 'Idle']
    if (action && action !== currentAction.current) {
      currentAction.current?.fadeOut(0.18)
      action.reset().fadeIn(0.18).play()
      currentAction.current = action
    }
    // Briefly hold only the visual pose on impact; AI, physics and attack
    // timers keep running. The parent supplies the existing recoil motion.
    const hitAge = gameNow() - (hitRef?.current || 0)
    runtime.mixer.update(Math.min(delta, 0.05) * (hitAge >= 0 && hitAge < 80 ? 0.12 : 1))
  })
  return (
    <>
      <primitive object={model.scene} />
      {heavy && <EnemyArmor type={type} />}
    </>
  )
}
