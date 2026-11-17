// Defeat changes only these local visual transforms; physics owns world position.
export function resetBossPresentation(model) {
  if (!model) return
  model.rotation.x = 0
  model.position.y = 0
  model.scale.setScalar(1)
}
