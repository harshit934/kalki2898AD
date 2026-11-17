// Only the two establishing poses change. Timing, actors, cuts and handoff stay intact.
export function revisionOpening(original) {
  return {
    ...original,
    camera: original.camera.map((key, index) => index === 0
      ? { ...key, position: [-31, 4.2, 10], focus: [-22, 2.8, -22], fov: 52 }
      : index === 1 ? { ...key, position: [-30, 4.0, 6.5], focus: [-21.5, 2.5, -24], fov: 49 } : key),
  }
}
