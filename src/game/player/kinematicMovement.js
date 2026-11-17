// Rapier may step less often than React renders. Preserve movement queued since
// the last physics step rather than overwriting it with only this frame's delta.
export function movementWithPendingTarget(current, pending, increment) {
  return {
    x: increment.x + (pending ? pending.x - current.x : 0),
    y: increment.y + (pending ? pending.y - current.y : 0),
    z: increment.z + (pending ? pending.z - current.z : 0),
  }
}
