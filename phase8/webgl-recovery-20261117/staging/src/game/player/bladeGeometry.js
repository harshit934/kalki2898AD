import { BufferGeometry, Float32BufferAttribute } from 'three'

export function makeBladeGeometry() {
  const positions = [], indices = []
  const sections = [[0.085, 0.024, 0.0045], [0.18, 0.03, 0.005], [0.64, 0.023, 0.004], [0.82, 0.012, 0.003], [0.90, 0.0001, 0.0001]]
  sections.forEach(([y, width, thickness]) => {
    positions.push(thickness, y, 0, 0, y, width, -thickness, y, 0, 0, y, -width)
  })
  for (let ring = 0; ring < sections.length - 1; ring++) {
    for (let edge = 0; edge < 4; edge++) {
      const a = ring * 4 + edge, b = ring * 4 + (edge + 1) % 4
      indices.push(a, a + 4, b, b, a + 4, b + 4)
    }
  }
  indices.push(0, 1, 2, 0, 2, 3, 16, 18, 17, 16, 19, 18)
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  geometry.computeBoundingBox()
  return geometry
}

