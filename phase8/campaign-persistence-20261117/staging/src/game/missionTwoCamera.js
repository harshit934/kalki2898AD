export function restoreCamera(camera, snapshot) {
  camera.position.copy(snapshot.position)
  camera.quaternion.copy(snapshot.quaternion)
  camera.fov = snapshot.fov
  camera.updateProjectionMatrix()
}
