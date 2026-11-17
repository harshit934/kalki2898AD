import { CAMERA_QUERY_GROUPS } from '../collisionGroups.js'
export const CAMERA_HIGH_LIFT = 3.1
export function cameraEscapeOffsets(distance, shoulder) {
  return [[0, 0.5, distance], [-shoulder, 0.5, distance],
    [2.8, 1.5, distance], [-2.8, 1.5, distance], [0, CAMERA_HIGH_LIFT, distance],
    // A wall immediately behind the player cannot be solved by zooming in or
    // raising a backwards ray. Temporarily orbit to either shoulder side.
    [distance, 0.3, 0], [-distance, 0.3, 0]]
}

// Sweep the camera's volume, including its near plane, rather than a single ray.
export function cameraClearance(world, rapier, origin, destination, playerCollider, playerBody, radius = 0.28) {
  const velocity = {
    x: destination.x - origin.x,
    y: destination.y - origin.y,
    z: destination.z - origin.z,
  }
  const hit = world.castShape(
    origin, { x: 0, y: 0, z: 0, w: 1 }, velocity, new rapier.Ball(radius),
    0.03, 1, false, rapier.QueryFilterFlags.EXCLUDE_SENSORS,
    CAMERA_QUERY_GROUPS, playerCollider, playerBody,
    // A nearby actor can overlap the look pivot. Casting from inside that
    // capsule must not collapse the camera into Bhairava's head. Walls remain
    // solid; only actor capsules containing the pivot are omitted.
    (collider) => !(collider.parent()?.userData?.cameraActor && collider.containsPoint(origin)),
  )
  return hit ? Math.max(0, Math.min(1, hit.time_of_impact - 0.025)) : 1
}
