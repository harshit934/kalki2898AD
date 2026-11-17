import { usePauseState } from '../pauseSystem.js'
import { Component, Suspense, useEffect, useMemo, useRef } from 'react'
import { createPortal, useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { AnimationMixer, Box3, Euler, Matrix4, Quaternion, Vector3 } from 'three'
import { clone } from 'three/addons/utils/SkeletonUtils.js'
import { applyBhairavaAppearance } from '../player/bhairavaAppearance.js'
import { dressMissionOne } from '../player/missionOneCostume.js'
import { createFacialExpressions } from '../player/facialExpressions.js'
import { prepareCharacterClips } from '../player/characterAnimation.js'
import BhairavaWeapon from '../player/BhairavaWeapon.jsx'
import { advanceCinematic, finishCinematic, stopCinematic, useCinematic } from './controller.js'
import { applyEndingBounds, usesPreparedEnding } from '../kashiRevision/endingBounds.js'

const ease = t => t * t * (3 - 2 * t)
const up = new Vector3(0, 1, 0)
const clamp = n => Math.min(1, Math.max(0, n))

function markPosition(value, session, target) {
  return target.fromArray(value).add(new Vector3(session.origin.x, session.origin.y, session.origin.z))
}

function cameraPose(key, session, camera) {
  const position = markPosition(key.position, session, new Vector3())
  const quaternion = new Quaternion()
  if (key.rotation) quaternion.setFromEuler(new Euler(...key.rotation))
  else {
    const actor = session.config.actors?.find(item => item.id === key.focusActor)
    const focus = markPosition(key.focus ?? [0, 1.3, 0], session, new Vector3())
    if (actor) focus.add(new Vector3(...actorPosition(actor, session.time)))
    quaternion.setFromRotationMatrix(new Matrix4().lookAt(position, focus, up))
  }
  return { position, quaternion, fov: key.fov ?? camera.fov }
}

function segment(keys, time) {
  const index = keys.findIndex(key => key.at > time)
  if (index === -1) return [keys.at(-1), keys.at(-1), 0]
  if (!index) return [keys[0], keys[0], 0]
  const a = keys[index - 1], b = keys[index]
  return [a, b, b.transition === 'cut' ? 0 : ease(clamp((time - a.at) / (b.at - a.at)))]
}

function actorPosition(actor, time) {
  if (!actor.path?.length) return actor.position ?? [0, 0, 0]
  const [a, b, t] = segment(actor.path, time)
  return a.position.map((value, axis) => value + (b.position[axis] - value) * t)
}

function snapshot(camera) {
  return { position: camera.position.clone(), quaternion: camera.quaternion.clone(), fov: camera.fov }
}

function applyCamera(camera, a, b, t) {
  camera.position.copy(a.position).lerp(b.position, t)
  camera.quaternion.copy(a.quaternion).slerp(b.quaternion, t)
  const fov = a.fov + (b.fov - a.fov) * t
  if (camera.fov !== fov) {
    camera.fov = fov
    camera.updateProjectionMatrix()
  }
}

function CinematicActor({ actor, session }) {
  const asset = useGLTF(actor.src)
  const group = useRef(null)
  const runtime = useRef(null)
  const bladeMaterial = useRef(null)
  const preparedEnding = usesPreparedEnding(session)
  const model = useMemo(() => {
    const object = clone(asset.scene)
    if (actor.height) {
      const box = preparedEnding ? applyEndingBounds(object, asset) : new Box3().setFromObject(object)
      const scale = actor.height / box.getSize(new Vector3()).y
      object.scale.setScalar(scale)
      object.position.y = -box.min.y * scale
    }
    object.traverse(child => { if (child.isMesh) child.castShadow = child.receiveShadow = true })
    return object
  }, [asset, actor.height, preparedEnding])

  useEffect(() => {
    const restore = actor.appearance === 'bhairava' ? applyBhairavaAppearance(model) : undefined
    const restoreCostume = actor.appearance === 'bhairava' && session.config.presentation === 'kashi' ? dressMissionOne(model) : undefined
    const mixer = new AnimationMixer(model)
    const clips = actor.appearance === 'bhairava' ? prepareCharacterClips(asset.animations) : asset.animations
    const actions = new Map(clips.map(clip => [clip.name, mixer.clipAction(clip)]))
    const face=actor.appearance==='bhairava'&&session.config.presentation==='kashi'?createFacialExpressions(model):null
    runtime.current = { mixer, actions, face }
    session.readyActors.add(actor.id)
    return () => {
      session.readyActors.delete(actor.id)
      face?.reset()
      runtime.current = null
      mixer.stopAllAction()
      mixer.uncacheRoot(model)
      restoreCostume?.()
      restore?.()
    }
  }, [actor, asset, model, session])

  useFrame((_, delta) => {
    const node = group.current, player = runtime.current
    if (!node || !player) return
    const time = session.time
    node.visible = time >= (actor.enterAt ?? 0) && time < (actor.exitAt ?? Infinity)
    if (!node.visible) return
    markPosition(actorPosition(actor, time), session, node.position)
    node.rotation.set(...(actor.rotation ?? [0, 0, 0]))
    const events = actor.actions ?? []
    const index = events.findLastIndex(event => event.at <= time)
    const current = events[index], previous = events[index - 1]
    const blend = previous && current.fade ? clamp((time - current.at) / current.fade) : 1
    for (const action of player.actions.values()) action.setEffectiveWeight(0)
    function sample(event, weight) {
      const action = player.actions.get(event?.clip)
      if (!action || !weight) return
      const duration = action.getClip().duration
      const elapsed = Math.max(0, (time - event.at) * (event.speed ?? 1))
      action.enabled = true
      action.paused = true
      action.time = event.loop === false ? Math.min(elapsed, duration) : elapsed % (duration || 1)
      action.setEffectiveWeight(weight).play()
    }
    if (previous?.clip !== current?.clip) sample(previous, 1 - blend)
    sample(current, previous?.clip === current?.clip ? 1 : blend)
    player.face?.restoreJaw()
    player.mixer.update(0)
    player.face?.advance({mode:'idle',personality:'mission1',damagedAt:-Infinity},delta,session.time*1000)
  })

  const hand = actor.weapon && model.getObjectByName('WeaponR')
  return <group ref={group} visible={false}>
    <primitive object={model} />
    {hand && createPortal(<BhairavaWeapon bladeMaterialRef={bladeMaterial} />, hand)}
  </group>
}

function CameraDirector({ session }) {
  const camera = useThree(state => state.camera)
  const original = useRef(null)
  const ending = useRef(null)
  const returnTime = useRef(0)
  useEffect(() => {
    return () => {
      if (original.current) applyCamera(camera, original.current, original.current, 1)
    }
  }, [camera, session])

  useFrame((_, rawDelta) => {
    if (usePauseState.getState().paused) return
    if (session.config.waitForSpawn && !session.spawnReady) return
    original.current ??= snapshot(camera)
    const delta = Math.min(rawDelta, 0.1)
    const { phase } = useCinematic.getState()
    if (phase === 'returning') {
      ending.current ??= snapshot(camera)
      returnTime.current += delta
      const t = clamp(returnTime.current / (session.config.returnDuration || 0.65))
      applyCamera(camera, ending.current, original.current, ease(t))
      if (t === 1) finishCinematic()
      return
    }
    if (phase !== 'playing' || (session.readyActors?.size ?? 0) < (session.config.actors?.length ?? 0)) return
    advanceCinematic(delta)
    if (useCinematic.getState().phase === 'returning') return
    const keys = session.config.camera ?? []
    if (!keys.length) return
    const [a, b, t] = segment(keys, session.time)
    const first = cameraPose(a, session, original.current)
    const second = cameraPose(b, session, original.current)
    const target = {
      position: first.position.lerp(second.position, t),
      quaternion: first.quaternion.slerp(second.quaternion, t),
      fov: first.fov + (second.fov - first.fov) * t,
    }
    applyCamera(camera, original.current, target, ease(clamp(session.time / (session.config.enterDuration || 0.55))))
  })
  return null
}

class ActorLoadBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch() {
    stopCinematic('asset-error')
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}

let cinematicStageOwner = null

export default function CinematicStage() {
  const session = useCinematic(state => state.session)
  const phase = useCinematic(state => state.phase)
  useEffect(() => {
    const owner = {}
    cinematicStageOwner = owner
    return () => { queueMicrotask(() => {
      // Strict Mode setup/cleanup/setup and a replacement stage retain ownership.
      if (cinematicStageOwner !== owner) return
      cinematicStageOwner = null
      stopCinematic('unmounted', true)
    }) }
  }, [])
  if (!session) return null
  const SceneSet = session.config.Set
  return <>
    <CameraDirector key={`camera-${session.id}`} session={session} />
    {phase !== 'returning' && <ActorLoadBoundary key={`actors-${session.id}`}>
      <Suspense fallback={null}>
        {SceneSet && <group position={[session.origin.x, session.origin.y, session.origin.z]}>
          <SceneSet session={session} />
        </group>}
        {session.config.actors?.map(actor => <CinematicActor key={actor.id} actor={actor} session={session} />)}
      </Suspense>
    </ActorLoadBoundary>}
  </>
}

