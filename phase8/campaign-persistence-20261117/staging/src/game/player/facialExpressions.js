import { Quaternion, Vector3 } from 'three'

export const FACE_TARGETS = [
  'BlinkLeft', 'BlinkRight', 'FocusedBrow', 'Squint',
  'SmirkLeft', 'Grimace', 'LipOpenCorrective',
]

const clamp = value => Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0))
const zero = () => Object.fromEntries(FACE_TARGETS.map(name => [name, 0]))
const jawAxis = new Vector3(1, 0, 0)

export function expressionGoals(state, now) {
  const guard = state.mode !== 'defeated' && state.guarding ? 1 : 0
  const phase = clamp(state.attackPhase ?? state.attackProgress ?? 0)
  const attack = state.mode !== 'defeated' && state.attackType
    ? Math.sin(Math.PI * phase)
    : 0
  const heavy = state.attackType === 'heavy' ? attack : 0
  const age = now - (state.damagedAt || 0)
  const hurt = state.mode !== 'defeated' && age >= 0 && age < 500
    ? Math.sin(Math.PI * age / 500) : 0
  const relaxed = state.personality === 'mission1' && state.mode !== 'defeated' && !state.attackType && !guard && !hurt
  return {
    FocusedBrow: Math.max(guard * 0.64, attack * 0.52),
    Squint: Math.max(guard * 0.38, heavy * 0.45, hurt * 0.48),
    SmirkLeft: state.attackType === 'basic' && phase > 0.58
      ? attack * (1 - hurt) * 0.19 : relaxed ? .055 : 0,
    Grimace: Math.max(attack * 0.27, heavy * 0.53, hurt * 0.76),
    jaw: Math.max(attack * 0.30, heavy * 0.67, hurt * 0.64),
  }
}

export function createFacialExpressions(scene) {
  const bindings = []
  const available = new Set()
  scene.traverse(object => {
    if (!object.morphTargetInfluences || !object.morphTargetDictionary) return
    for (const name of FACE_TARGETS) {
      const index = object.morphTargetDictionary[name]
      if (!Number.isInteger(index)) continue
      available.add(name)
      bindings.push({ name, index, influences: object.morphTargetInfluences })
    }
  })
  const jaw = scene.getObjectByName('Jaw')
  if (!jaw || !FACE_TARGETS.every(name => available.has(name))) return null
  const animatedJaw = new Quaternion()
  const offset = new Quaternion()
  const values = zero()
  let jawWeight = 0
  let hadOffset = false
  let untilBlink = 2.7
  let blinkTime = -1

  function restoreJaw() {
    if (hadOffset) jaw.quaternion.copy(animatedJaw)
    hadOffset = false
  }

  function advance(state, delta, now) {
    const dt = Math.max(0, Math.min(delta, 0.05))
    const goals = expressionGoals(state, now)
    const alpha = 1 - Math.exp(-16 * dt)
    for (const name of ['FocusedBrow', 'Squint', 'SmirkLeft', 'Grimace']) {
      values[name] += (clamp(goals[name]) - values[name]) * alpha
      if (!goals[name] && values[name] < 0.001) values[name] = 0
    }
    jawWeight += (clamp(goals.jaw) - jawWeight) * alpha
    if (!goals.jaw && jawWeight < 0.001) jawWeight = 0
    untilBlink -= dt
    if (untilBlink <= 0 && state.mode !== 'defeated') {
      blinkTime = 0
      untilBlink = 3.4 + Math.random() * 1.8
    }
    if (blinkTime >= 0) blinkTime += dt
    if (blinkTime >= 0.19 || state.mode === 'defeated') blinkTime = -1
    const blink = blinkTime < 0 ? 0 : clamp(Math.min(blinkTime / 0.065, (0.19 - blinkTime) / 0.085))
    values.BlinkLeft = values.BlinkRight = blink
    apply(values, jawWeight)
  }

  function apply(weights, opening = 0) {
    restoreJaw()
    const jawAmount = clamp(opening)
    for (const {name, index, influences} of bindings) {
      const weight = name === 'LipOpenCorrective' ? jawAmount : clamp(weights[name] ?? 0)
      influences[index] = name === 'Squint'
        ? weight * (1 - Math.max(clamp(weights.BlinkLeft ?? 0), clamp(weights.BlinkRight ?? 0))) : weight
    }
    animatedJaw.copy(jaw.quaternion)
    jaw.quaternion.premultiply(offset.setFromAxisAngle(jawAxis, 0.17 * jawAmount))
    hadOffset = true
  }

  function reset() {
    restoreJaw()
    for (const {index, influences} of bindings) influences[index] = 0
    for (const name of FACE_TARGETS) values[name] = 0
    jawWeight = 0
    blinkTime = -1
    untilBlink = 2.7
  }

  return { restoreJaw, advance, apply, reset }
}
