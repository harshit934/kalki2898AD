import assert from 'node:assert/strict'
import { characterActionName, characterAttackTime } from '../src/game/player/characterAnimation.js'
import { resolveAttackInput } from '../src/game/player/combatTiming.js'

// A press just before recovery ends fires exactly once at the existing deadline.
let result = resolveAttackInput(null, 'basic', 935, 1000, true)
assert.equal(result.attack, null)
result = resolveAttackInput(result.pending, null, 999, 1000, true)
assert.equal(result.attack, null)
result = resolveAttackInput(result.pending, null, 1000, 1000, true)
assert.equal(result.attack, 'basic')
assert.deepEqual(resolveAttackInput(result.pending, null, 1001, 1000, true), { pending: null, attack: null })
const tooEarly = resolveAttackInput(null, 'heavy', 800, 1000, true)
assert.equal(resolveAttackInput(tooEarly.pending, null, 1000, 1000, true).attack, null)
for (const allowed of [false]) {
  const pending = resolveAttackInput(null, 'basic', 935, 1000, true).pending
  assert.deepEqual(resolveAttackInput(pending, null, 1000, 1000, allowed), { pending: null, attack: null })
}
// The recovery half of a slash must move toward the end pose, not rewind.
const phases = [0, 0.2, 0.5, 0.75, 0.99]
const times = phases.map(attackPhase => characterAttackTime({ attackPhase, attackProgress: Math.sin(attackPhase * Math.PI) }, 1))
assert.ok(times.every((time, i) => !i || time > times[i - 1]))
assert.equal(characterAttackTime({ attackPhase: 2 }, 1), 1)
assert.equal(characterActionName({ mode: 'defeated', attackType: 'basic' }), 'Death (fall backward)')
assert.equal(characterActionName({ mode: 'idle', attackType: 'basic', attackPhase: 0 }), 'Sword slash')
assert.equal(characterActionName({ mode: 'idle', guarding: true }), 'Sword block')
assert.equal(characterActionName({ mode: 'jumping' }), 'Jump (in air)')
assert.equal(characterActionName({ speed: 4.5 }, 'Run'), 'Run')
assert.equal(characterActionName({ speed: 4.5 }, 'Walk'), 'Walk')
assert.equal(characterActionName({ speed: 0.12 }, 'Walk'), 'Walk')
assert.equal(characterActionName({ speed: 0.12 }, 'Sword idle (guard)'), 'Sword idle (guard)')
assert.equal(characterActionName({ speed: 7 }), 'Run')
console.log(JSON.stringify({ boundedInputBuffer: 'PASS', cooldownBoundaryAndSingleConsumption: 'PASS', staleAndBlockedInputDiscarded: 'PASS', attackRecoveryMovesForward: 'PASS', actionPrioritiesAndLocomotionHysteresis: 'PASS' }, null, 2))
