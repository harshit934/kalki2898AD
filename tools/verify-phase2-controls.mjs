import assert from 'node:assert/strict'
import R from '@dimforge/rapier3d-compat'
import { movementWithPendingTarget } from '../src/game/player/kinematicMovement.js'
import { DODGE_ACTIVE_MS } from '../src/game/player/combatTiming.js'
import { useGameplayState } from '../src/game/gameplayStore.js'
import { usePlayerInput } from '../src/game/player/playerInputStore.js'

await R.init()
function movementTrial(fps, obstacle) {
  const world = new R.World({ x: 0, y: 0, z: 0 })
  const body = world.createRigidBody(R.RigidBodyDesc.kinematicPositionBased())
  const collider = world.createCollider(R.ColliderDesc.cuboid(0.3, 0.9, 0.3), body)
  const controller = world.createCharacterController(0.02)
  if (obstacle) {
    const wall = world.createRigidBody(R.RigidBodyDesc.fixed().setTranslation(2.5, 0, 0))
    world.createCollider(R.ColliderDesc.cuboid(0.2, 2, 5).setSensor(obstacle === 'sensor'), wall)
  }
  world.step()
  let accumulator = 0, pending = null
  function travel(velocity, seconds) {
    for (let frame = 0; frame < Math.round(fps * seconds); frame++) {
      accumulator += 1 / fps
      while (accumulator + 1e-9 >= 1 / 60) { world.step(); accumulator -= 1 / 60 }
      const current = body.translation()
      controller.computeColliderMovement(collider, movementWithPendingTarget(current, pending, {
        x: velocity.x / fps, y: 0, z: velocity.z / fps,
      }), R.QueryFilterFlags.EXCLUDE_SENSORS)
      const delta = controller.computedMovement()
      pending = { x: current.x + delta.x, y: current.y + delta.y, z: current.z + delta.z }
      body.setNextKinematicTranslation(pending)
    }
    world.step()
    return { ...body.translation() }
  }
  const forward = travel({ x: 4.5, z: 0 }, 1)
  if (obstacle === 'wall') {
    assert.ok(forward.x < 2.05 && forward.x > 1.9, `wall blocking at ${fps} FPS`)
    const escape = travel({ x: 0, z: 4.5 }, 1)
    assert.ok(escape.z > 4.4, `wall sliding/recovery at ${fps} FPS`)
  } else assert.ok(Math.abs(forward.x - 4.5) < 0.005, `speed at ${fps} FPS: ${forward.x}`)
  // A mission reset must discard any old pending target.
  body.setTranslation({ x: 0, y: 0, z: 0 }, true)
  body.setNextKinematicTranslation({ x: 0, y: 0, z: 0 })
  pending = null
  const restarted = travel({ x: 0, z: -4.5 }, 1)
  assert.ok(Math.abs(restarted.x) < 0.01 && restarted.z < -4.4, 'restart target reset')
  world.free()
  return { fps, obstacle: obstacle || 'none', metresInOneSecond: forward.x }
}
const movement = [30, 60, 144].flatMap((fps) => [undefined, 'sensor', 'wall'].map((kind) => movementTrial(fps, kind)))

// Actual production damage store; isolated Node process, no browser or save writes.
const realNow = Date.now
try {
  let time = 10000
  Date.now = () => time
  usePlayerInput.setState({ blocking: false })
  useGameplayState.setState({ health: 100, gameOver: false, invulnerableUntil: time + DODGE_ACTIVE_MS })
  time += DODGE_ACTIVE_MS - 1
  assert.equal(useGameplayState.getState().takeDamage(13), false, 'last protected millisecond')
  assert.equal(useGameplayState.getState().health, 100)
  time += 1
  assert.equal(useGameplayState.getState().takeDamage(13), true, 'exact dodge expiry')
  assert.equal(useGameplayState.getState().health, 87)
  useGameplayState.setState({ health: 100, invulnerableUntil: 0 })
  usePlayerInput.setState({ blocking: true })
  useGameplayState.getState().takeDamage(13)
  assert.equal(useGameplayState.getState().health, 96.1, 'block damage factor')
} finally { Date.now = realNow }
console.log(JSON.stringify({ movement, dodgeBoundary: 'PASS', blocking: 'PASS', reset: 'PASS' }, null, 2))
