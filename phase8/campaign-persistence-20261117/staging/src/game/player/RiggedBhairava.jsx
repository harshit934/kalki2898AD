import { gameNow } from '../gameClock.js'
import { useGameplayFrame } from '../cinematics/useGameplayFrame.js'
import { useEffect, useMemo, useRef } from 'react'
import { createPortal } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { AnimationMixer, Box3, Vector3, LoopOnce, LoopRepeat } from 'three'
import { clone } from 'three/addons/utils/SkeletonUtils.js'
import BhairavaWeapon from './BhairavaWeapon.jsx'
import { prepareCharacterClips, characterActionName, characterAttackTime, characterBlendDuration } from './characterAnimation.js'
import { applyBhairavaAppearance } from './bhairavaAppearance.js'
import { createFacialExpressions } from './facialExpressions.js'
import { dressMissionOne } from './missionOneCostume.js'
import { useCampaignState } from '../campaignSystem.js'

// Visual-only adapter: the existing Player owns all movement, hits and collision.
export default function RiggedBhairava({ groupRef, stateRef }) {
  const missionOne = useCampaignState(s=>s.selectedMissionId==='mission-1')
  const asset = useGLTF('/models/bhairava-free-rig.glb?v=4')
  const active = useRef(null)
  const animation = useRef(null)
  const attackSequence = useRef(-1)
  const recoilRef = useRef(null)
  const bladeMaterial = useRef(null)
  const model = useMemo(() => {
    const scene = clone(asset.scene)
    scene.updateMatrixWorld(true)
    const box = new Box3().setFromObject(scene)
    const scale = 1.78 / box.getSize(new Vector3()).y
    scene.scale.setScalar(scale)
    scene.position.y = -box.min.y * scale
    scene.rotation.y = Math.PI
    scene.traverse((object) => {
      if (object.isMesh) object.castShadow = object.receiveShadow = true
    })
    return { scene, hand: scene.getObjectByName('WeaponR') || scene.getObjectByName('RightHand') }
  }, [asset])
  useEffect(() => {
    const restoreAppearance = applyBhairavaAppearance(model.scene)
    const restoreCostume = missionOne ? dressMissionOne(model.scene) : null
    // Setup must rebuild everything cleanup uncaches (including Strict Mode replay).
    const mixer = new AnimationMixer(model.scene)
    const actions = Object.fromEntries(prepareCharacterClips(asset.animations).map((clip) => {
      const action = mixer.clipAction(clip)
      action.clampWhenFinished = clip.name.startsWith('Death') || clip.name === 'Sword slash' || clip.name === 'Sword block'
      return [clip.name, action]
    }))
    const face = createFacialExpressions(model.scene)
    animation.current = { mixer, actions, face }
    active.current = actions['Sword idle (guard)']?.play() ?? null
    mixer.update(0)
    attackSequence.current = -1
    return () => {
      animation.current = null
      active.current = null
      face?.reset()
      mixer.stopAllAction()
      mixer.uncacheRoot(model.scene)
      restoreCostume?.()
      restoreAppearance()
    }
  }, [asset, model, missionOne])
  useGameplayFrame((_, delta) => {
    const runtime = animation.current
    if (!runtime) return
    const s = stateRef.current
    const name = characterActionName(s, active.current?.getClip().name)
    const action = runtime.actions[name]
    const nextAttack = name === 'Sword slash' && s.attackSequence !== attackSequence.current
    if (action && (action !== active.current || nextAttack)) {
      const blend = characterBlendDuration(name)
      if (active.current !== action) active.current?.fadeOut(blend)
      const once = name.startsWith('Death') || name === 'Sword slash' || name === 'Sword block'
      action.stopFading().reset().setLoop(once ? LoopOnce : LoopRepeat, once ? 1 : Infinity)
      action.setEffectiveTimeScale(name === 'Sword slash' ? 0 : 1)
      action.setEffectiveWeight(1)
      action.fadeIn(blend).play()
      active.current = action
      if (name === 'Sword slash') attackSequence.current = s.attackSequence
    }
    if (name === 'Sword slash' && action) {
      // Three.js actions are imperative runtime objects, not React state.
      // eslint-disable-next-line react/immutability
      action.time = characterAttackTime(s, action.getClip().duration)
    }
    // Evaluate the requested attack pose in this frame, not one frame later.
    runtime.face?.restoreJaw()
    runtime.mixer.update(Math.min(delta, 0.05))
    runtime.face?.advance(missionOne ? {...s,personality:'mission1'} : s, delta, gameNow())
    const hitAge = gameNow() - (s.hitConfirmedAt || 0)
    if (bladeMaterial.current) bladeMaterial.current.emissiveIntensity = hitAge >= 0 && hitAge < 120 ? (1 - hitAge / 120) * 0.45 : 0
    if (recoilRef.current) {
      const age = gameNow() - (s.damagedAt || 0)
      const recoil = s.mode !== 'defeated' && age >= 0 && age < 240 ? Math.sin(age / 240 * Math.PI) : 0
      const evade = missionOne && s.dodging ? Math.sin((s.dodgeProgress || 0)*Math.PI) : 0
      const swing = missionOne && s.attackType ? Math.sin((s.attackPhase || 0)*Math.PI) : 0
      recoilRef.current.rotation.x = -recoil * (missionOne ? .11 : .07) + evade*.12
      recoilRef.current.rotation.z = missionOne ? evade*.14 + swing*(s.attackType==='heavy' ? -.07 : (s.attackSequence%2 ? .045 : -.045)) : 0
      recoilRef.current.position.y = -recoil * .015 - evade*.12
    }
  })
  return <group ref={groupRef}>
    <group ref={recoilRef}>
      <primitive object={model.scene} />
      {model.hand && createPortal(<BhairavaWeapon bladeMaterialRef={bladeMaterial} />, model.hand)}
    </group>
  </group>
}
