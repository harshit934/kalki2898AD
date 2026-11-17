import fs from 'node:fs'
import crypto from 'node:crypto'
import {
  BufferGeometry,
  CatmullRomCurve3,
  Float32BufferAttribute,
  Quaternion,
  SphereGeometry,
  TorusGeometry,
  Vector3,
} from 'three'

const root = 'phase3/likeness-sculpt'
const stage = process.argv.includes('--v06') ? 'v06' : process.argv.includes('--v05') ? 'v05' : 'v04'
const stageLabel = stage.toUpperCase()
const out = `${root}/${stage}`
const sourcePath = stage === 'v06'
  ? `${out}/rollback/v05-source-bhairava.glb`
  : stage === 'v05' ? `${out}/rollback/v04-source-bhairava.glb` : `${out}/rollback/v03-source-bhairava.glb`
const source = fs.readFileSync(sourcePath)
const jsonLength = source.readUInt32LE(12)
const doc = JSON.parse(source.subarray(20, 20 + jsonLength))
const sourceBin = source.subarray(28 + jsonLength)
const bin = Buffer.from(sourceBin)
const chunks = [bin]
let length = bin.length

for (const scene of doc.scenes) {
  scene.nodes = scene.nodes.filter((index) => (
    !doc.nodes[index]?.extras?.candidateOnly
    || (stage !== 'v04' && /^Bhairava_V04_Brow_[LR]$/.test(doc.nodes[index].name))
  ))
}

const componentSizes = { 5121: 1, 5123: 2, 5125: 4, 5126: 4 }
const componentCounts = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4, MAT4: 16 }
function values(accessorIndex) {
  const accessor = doc.accessors[accessorIndex]
  const view = doc.bufferViews[accessor.bufferView]
  const components = componentCounts[accessor.type]
  const size = componentSizes[accessor.componentType]
  const stride = view.byteStride || size * components
  const start = (view.byteOffset || 0) + (accessor.byteOffset || 0)
  const result = []
  for (let i = 0; i < accessor.count; i++) {
    for (let k = 0; k < components; k++) {
      const offset = start + i * stride + k * size
      result.push(accessor.componentType === 5126 ? bin.readFloatLE(offset)
        : accessor.componentType === 5125 ? bin.readUInt32LE(offset)
          : accessor.componentType === 5123 ? bin.readUInt16LE(offset)
            : bin.readUInt8(offset))
    }
  }
  return result
}

function writeFloat(accessorIndex, vertex, axis, value) {
  const accessor = doc.accessors[accessorIndex]
  const view = doc.bufferViews[accessor.bufferView]
  const stride = view.byteStride || componentCounts[accessor.type] * 4
  bin.writeFloatLE(value, (view.byteOffset || 0) + (accessor.byteOffset || 0) + vertex * stride + axis * 4)
}

function append(array, type, componentType = 5126, target = 34962) {
  const padding = Buffer.alloc((4 - length % 4) % 4)
  chunks.push(padding)
  length += padding.length
  const data = Buffer.from(array.buffer, array.byteOffset, array.byteLength)
  const bufferView = doc.bufferViews.length
  doc.bufferViews.push({ buffer: 0, byteOffset: length, byteLength: data.length, target })
  chunks.push(data)
  length += data.length
  const accessor = { bufferView, componentType, count: array.length / componentCounts[type], type }
  if (type === 'VEC3') {
    accessor.min = [Infinity, Infinity, Infinity]
    accessor.max = [-Infinity, -Infinity, -Infinity]
    for (let i = 0; i < array.length; i++) {
      const axis = i % 3
      accessor.min[axis] = Math.min(accessor.min[axis], array[i])
      accessor.max[axis] = Math.max(accessor.max[axis], array[i])
    }
  }
  doc.accessors.push(accessor)
  return doc.accessors.length - 1
}

const primary = doc.meshes[0].primitives[0]
const positions = values(primary.attributes.POSITION)
const joints = values(primary.attributes.JOINTS_0)
const weights = values(primary.attributes.WEIGHTS_0)
const skin = doc.skins[0]
const jointNames = skin.joints.map((index) => doc.nodes[index].name)
const headIndex = jointNames.indexOf('Head')
const headJoints = new Set(jointNames.map((name, index) => /Head|Eye|Jaw/.test(name) ? index : -1).filter((index) => index >= 0))
const influence = (id) => {
  let total = 0
  for (let k = 0; k < 4; k++) if (headJoints.has(joints[id * 4 + k])) total += weights[id * 4 + k]
  return total
}
const smooth = (lo, hi, value) => {
  const t = Math.min(1, Math.max(0, (value - lo) / (hi - lo)))
  return t * t * (3 - 2 * t)
}
const gaussian = (value, center, width) => Math.exp(-(((value - center) / width) ** 2))
const facialMaterials = new Set(['Skin', 'Skin details', 'Eyelashes'])
const basePrimitives = doc.meshes[0].primitives
const facialIds = new Set(basePrimitives
  .filter((primitive) => facialMaterials.has(doc.materials[primitive.material].name))
  .flatMap((primitive) => values(primitive.indices)))
const edited = new Map()

for (const id of facialIds) {
  const x = positions[id * 3]
  const y = positions[id * 3 + 1]
  const z = positions[id * 3 + 2]
  const ax = Math.abs(x)
  const mask = smooth(1.632, 1.668, y) * smooth(0.45, 0.95, influence(id))
  if (!mask || ax > 0.083) continue
  const front = smooth(0.025, 0.105, z)
  const side = Math.sign(x)
  let delta
  if (stage === 'v05') {
    const forehead = gaussian(y, 1.802, 0.024) * gaussian(ax, 0.048, 0.034) * front * mask
    const cheek = gaussian(y, 1.723, 0.023) * gaussian(ax, 0.052, 0.024) * front * mask
    const jaw = gaussian(y, 1.675, 0.025) * smooth(0.020, 0.050, ax) * front * mask
    const brow = gaussian(y, 1.776, 0.013) * gaussian(ax, 0.035, 0.029) * front * mask
    const upperLid = gaussian(y, 1.769, 0.006) * gaussian(ax, 0.031, 0.015) * front * mask
    const lowerLid = gaussian(y, 1.754, 0.006) * gaussian(ax, 0.031, 0.015) * front * mask
    const bridge = gaussian(y, 1.746, 0.024) * gaussian(ax, 0.013, 0.016) * front * mask
    const tip = gaussian(y, 1.716, 0.013) * gaussian(ax, 0.0, 0.024) * front * mask
    const ala = gaussian(y, 1.710, 0.009) * gaussian(ax, 0.021, 0.010) * front * mask
    delta = [
      side * (0.0030 * cheek + 0.0032 * jaw + 0.0014 * ala),
      0.0005 * forehead - 0.0008 * gaussian(y, 1.765, 0.009) * gaussian(ax, 0.013, 0.011) * front * mask,
      0.0012 * forehead + 0.0032 * cheek + 0.0024 * jaw + 0.0030 * brow
        + 0.0018 * upperLid - 0.0010 * lowerLid + 0.0035 * bridge + 0.0040 * tip + 0.0020 * ala,
    ]
  } else if (stage === 'v06') {
    const forehead = gaussian(y, 1.802, 0.024) * gaussian(ax, 0.048, 0.034) * front * mask
    const cheek = gaussian(y, 1.723, 0.023) * gaussian(ax, 0.052, 0.024) * front * mask
    const jaw = gaussian(y, 1.675, 0.025) * smooth(0.020, 0.050, ax) * front * mask
    const brow = gaussian(y, 1.776, 0.013) * gaussian(ax, 0.035, 0.029) * front * mask
    const bridge = gaussian(y, 1.746, 0.024) * gaussian(ax, 0.013, 0.016) * front * mask
    const tip = gaussian(y, 1.716, 0.013) * gaussian(ax, 0.0, 0.024) * front * mask
    const ala = gaussian(y, 1.710, 0.009) * gaussian(ax, 0.021, 0.010) * front * mask
    delta = [
      side * (0.0012 * cheek + 0.0010 * jaw + 0.0007 * ala),
      0.0003 * forehead,
      0.0004 * forehead + 0.0012 * cheek + 0.0008 * jaw + 0.0007 * brow
        + 0.0009 * bridge + 0.0010 * tip + 0.0007 * ala,
    ]
  } else {
    const cheek = gaussian(y, 1.723, 0.026) * gaussian(ax, 0.051, 0.022) * front * mask
    const jaw = gaussian(y, 1.675, 0.027) * smooth(0.018, 0.052, ax) * front * mask
    const brow = gaussian(y, 1.776, 0.010) * gaussian(ax, 0.035, 0.027) * front * mask
    const bridge = gaussian(y, 1.746, 0.021) * gaussian(ax, 0.012, 0.014) * front * mask
    const tip = gaussian(y, 1.716, 0.014) * gaussian(ax, 0.0, 0.022) * front * mask
    delta = [
      side * (0.0020 * cheek + 0.0014 * jaw),
      0.0007 * gaussian(y, 1.761, 0.012) * gaussian(ax, 0.032, 0.018) * front * mask,
      0.0018 * cheek + 0.0012 * jaw + 0.0012 * brow + 0.0018 * bridge + 0.0015 * tip,
    ]
  }
  if (Math.hypot(...delta) < 0.000001) continue
  for (let axis = 0; axis < 3; axis++) {
    writeFloat(primary.attributes.POSITION, id, axis, positions[id * 3 + axis] + delta[axis])
  }
  edited.set(id, delta)
}

const eyeIds = new Set(basePrimitives
  .filter((primitive) => doc.materials[primitive.material].name === 'Eyes')
  .flatMap((primitive) => values(primitive.indices)))
for (const id of eyeIds) {
  if (influence(id) < 0.65) continue
  const x = positions[id * 3]
  const y = positions[id * 3 + 1]
  const z = positions[id * 3 + 2]
  const side = Math.sign(x)
  if (Math.abs(x) < 0.012 || y < 1.744 || y > 1.780 || z < 0.115) continue
  const centerX = side * 0.027
  const centerY = 1.762
  const eyeFactor = stage === 'v04' ? 0.035 : stage === 'v05' ? 0.06 : 0.045
  const lidFactor = stage === 'v04' ? -0.12 : stage === 'v05' ? -0.16 : -0.13
  const dx = (x - centerX) * eyeFactor
  const dy = (y - centerY) * lidFactor + smooth(0.024, 0.043, Math.abs(x)) * 0.00035
  const dz = -0.00045
  const delta = [dx, dy, dz]
  for (let axis = 0; axis < 3; axis++) {
    writeFloat(primary.attributes.POSITION, id, axis, positions[id * 3 + axis] + delta[axis])
  }
  edited.set(id, delta)
}

const newPositions = values(primary.attributes.POSITION)
const normalAccessor = primary.attributes.NORMAL
const sums = new Float64Array(positions.length)
const a = new Vector3(), b = new Vector3(), c = new Vector3(), ab = new Vector3(), ac = new Vector3()
for (const primitive of basePrimitives.filter((item) => facialMaterials.has(doc.materials[item.material].name))) {
  const indices = values(primitive.indices)
  for (let i = 0; i < indices.length; i += 3) {
    a.fromArray(newPositions, indices[i] * 3)
    b.fromArray(newPositions, indices[i + 1] * 3)
    c.fromArray(newPositions, indices[i + 2] * 3)
    ab.subVectors(b, a)
    ac.subVectors(c, a)
    ab.cross(ac)
    for (const id of indices.slice(i, i + 3)) {
      for (let axis = 0; axis < 3; axis++) sums[id * 3 + axis] += ab.getComponent(axis)
    }
  }
}
for (const id of edited.keys()) {
  if (!facialIds.has(id)) continue
  a.fromArray(sums, id * 3).normalize()
  for (let axis = 0; axis < 3; axis++) writeFloat(normalAccessor, id, axis, a.getComponent(axis))
}

const clayMaterial = doc.materials.findIndex((material) => material.name === 'Clay_Hair_Volume')
if (clayMaterial < 0) throw new Error('V03 clay groom material not found')
const added = []
function addSkinnedMesh(name, geometry, weightSource = null) {
  const positionsArray = geometry.attributes.position.array
  const normalsArray = geometry.attributes.normal.array
  const count = positionsArray.length / 3
  const meshJoints = new Uint16Array(count * 4)
  const meshWeights = new Float32Array(count * 4)
  for (let i = 0; i < count; i++) {
    const sourceId = weightSource ? weightSource[i] : -1
    if (sourceId >= 0) {
      for (let k = 0; k < 4; k++) {
        meshJoints[i * 4 + k] = joints[sourceId * 4 + k]
        meshWeights[i * 4 + k] = weights[sourceId * 4 + k]
      }
    } else {
      meshJoints[i * 4] = headIndex
      meshWeights[i * 4] = 1
    }
  }
  const attributes = {
    POSITION: append(new Float32Array(positionsArray), 'VEC3'),
    NORMAL: append(new Float32Array(normalsArray), 'VEC3'),
    JOINTS_0: append(meshJoints, 'VEC4', 5123),
    WEIGHTS_0: append(meshWeights, 'VEC4'),
  }
  const indices = geometry.index?.array || Uint32Array.from({ length: count }, (_, index) => index)
  const primitive = {
    attributes,
    indices: append(Uint32Array.from(indices), 'SCALAR', 5125, 34963),
    material: clayMaterial,
  }
  const meshIndex = doc.meshes.length
  doc.meshes.push({ name, primitives: [primitive] })
  const nodeIndex = doc.nodes.length
  doc.nodes.push({ name, mesh: meshIndex, skin: 0, extras: { candidateOnly: true, stage } })
  doc.scenes[doc.scene || 0].nodes.push(nodeIndex)
  added.push({ name, vertices: count, triangles: indices.length / 3 })
  geometry.dispose()
}

const skinIndices = values(primary.indices)
const skinIds = [...new Set(skinIndices)].filter((id) => positions[id * 3 + 1] > 1.65 && positions[id * 3 + 2] > 0.07)
const currentNormals = values(normalAccessor)
function nearestSkin(x, y) {
  let best = Infinity
  let nearest = skinIds[0]
  for (const id of skinIds) {
    const dx = newPositions[id * 3] - x
    const dy = newPositions[id * 3 + 1] - y
    const distance = dx * dx + dy * dy
    if (distance < best) {
      best = distance
      nearest = id
    }
  }
  return nearest
}
function interpolatedSkinDepth(x, y) {
  const nearest = []
  for (const id of skinIds) {
    const dx = newPositions[id * 3] - x
    const dy = newPositions[id * 3 + 1] - y
    const distance = dx * dx + dy * dy
    if (distance < 1e-12) return newPositions[id * 3 + 2]
    let index = nearest.length
    while (index > 0 && nearest[index - 1].distance > distance) index--
    if (index < 6) {
      nearest.splice(index, 0, { id, distance })
      if (nearest.length > 6) nearest.pop()
    }
  }
  let total = 0
  let weighted = 0
  for (const point of nearest) {
    const weight = 1 / (point.distance * point.distance)
    total += weight
    weighted += newPositions[point.id * 3 + 2] * weight
  }
  return weighted / total
}
function transferWeights(geometry) {
  const attribute = geometry.attributes.position
  const ids = []
  for (let i = 0; i < attribute.count; i++) ids.push(nearestSkin(attribute.getX(i), attribute.getY(i)))
  return ids
}
function ellipsoidPoint(azimuth, phi, offset = 0) {
  const radius = 1 + 0.004 * Math.cos(azimuth * 3 + phi * 2)
  return new Vector3(
    Math.sin(azimuth) * Math.sin(phi) * 0.085 * radius,
    1.795 + Math.cos(phi) * 0.106,
    0.045 + Math.cos(azimuth) * Math.sin(phi) * 0.109 * radius - offset,
  )
}

if (stage === 'v04') {
  const scalp = new SphereGeometry(1, 112, 64)
  const scalpPositions = scalp.attributes.position
  for (let i = 0; i < scalpPositions.count; i++) {
    const x = scalpPositions.getX(i)
    const y = scalpPositions.getY(i)
    const z = scalpPositions.getZ(i)
    const phi = Math.acos(Math.max(-1, Math.min(1, y)))
    const azimuth = Math.atan2(x, z)
    const front = Math.max(0, Math.cos(azimuth))
    const hairline = 1.50 - front * 0.36 + 0.018 * Math.sin(azimuth * 3.2) + 0.009 * Math.sin(azimuth * 6.1)
    const angle = phi / Math.PI * hairline
    const ripple = 1 + 0.003 * Math.sin(azimuth * 2.8 + angle * 3)
    const base = ellipsoidPoint(azimuth, angle)
    scalpPositions.setXYZ(i, base.x * ripple, base.y, base.z)
  }
  scalp.computeVertexNormals()
  addSkinnedMesh('Bhairava_V04_SweptHair_Base', scalp)
} else if (stage === 'v05') {
  const scalpIds = [...new Set(skinIndices)].filter(id => (
    influence(id) >= 0.55 && newPositions[id * 3 + 1] > 1.76
  ))
  function closestScalp(point) {
    const nearest = []
    for (const id of scalpIds) {
      const dx = newPositions[id * 3] - point.x
      const dy = newPositions[id * 3 + 1] - point.y
      const dz = newPositions[id * 3 + 2] - point.z
      const distance = dx * dx + dy * dy + dz * dz
      let index = nearest.length
      while (index > 0 && nearest[index - 1].distance > distance) index--
      if (index < 4) {
        nearest.splice(index, 0, { id, distance })
        if (nearest.length > 4) nearest.pop()
      }
    }
    let total = 0
    const position = new Vector3()
    const normal = new Vector3()
    for (const vertex of nearest) {
      const weight = 1 / Math.max(vertex.distance, 1e-10)
      total += weight
      position.x += newPositions[vertex.id * 3] * weight
      position.y += newPositions[vertex.id * 3 + 1] * weight
      position.z += newPositions[vertex.id * 3 + 2] * weight
      normal.x += currentNormals[vertex.id * 3] * weight
      normal.y += currentNormals[vertex.id * 3 + 1] * weight
      normal.z += currentNormals[vertex.id * 3 + 2] * weight
    }
    return {
      position: position.multiplyScalar(1 / total),
      normal: normal.normalize(),
      id: nearest[0].id,
    }
  }
  function hairlineY(x, z) {
    const front = smooth(-0.035, 0.11, z)
    const temple = smooth(0.018, 0.075, Math.abs(x))
    return 1.785 + 0.033 * front - 0.045 * temple + 0.002 * Math.sin(x * 72)
  }
  const hairPositions = []
  const hairNormals = []
  const hairWeights = []
  const hairIndices = []
  for (let offset = 0; offset < skinIndices.length; offset += 3) {
    const triangle = skinIndices.slice(offset, offset + 3)
    if (triangle.some(id => influence(id) < 0.72)) continue
    let polygon = triangle.map(id => ({
      position: newPositions.slice(id * 3, id * 3 + 3),
      normal: currentNormals.slice(id * 3, id * 3 + 3),
      id,
    }))
    const clipped = []
    for (let i = 0; i < polygon.length; i++) {
      const current = polygon[i]
      const next = polygon[(i + 1) % polygon.length]
      const a = hairlineY(current.position[0], current.position[2]) - current.position[1]
      const b = hairlineY(next.position[0], next.position[2]) - next.position[1]
      if (a <= 0) clipped.push(current)
      if ((a <= 0) !== (b <= 0)) {
        const t = a / (a - b)
        clipped.push({
          position: current.position.map((value, axis) => value + (next.position[axis] - value) * t),
          normal: current.normal.map((value, axis) => value + (next.normal[axis] - value) * t),
          id: t < 0.5 ? current.id : next.id,
        })
      }
    }
    polygon = clipped
    if (polygon.length < 3) continue
    const start = hairPositions.length / 3
    for (const vertex of polygon) {
      const normal = new Vector3(...vertex.normal).normalize()
      hairPositions.push(
        vertex.position[0] + normal.x * 0.0025,
        vertex.position[1] + normal.y * 0.0025,
        vertex.position[2] + normal.z * 0.0025,
      )
      hairNormals.push(normal.x, normal.y, normal.z)
      hairWeights.push(vertex.id)
    }
    for (let i = 1; i < polygon.length - 1; i++) hairIndices.push(start, start + i, start + i + 1)
  }
  const hairBase = new BufferGeometry()
  hairBase.setAttribute('position', new Float32BufferAttribute(hairPositions, 3))
  hairBase.setAttribute('normal', new Float32BufferAttribute(hairNormals, 3))
  hairBase.setIndex(hairIndices)
  addSkinnedMesh('Bhairava_V05_SweptHair_Base', hairBase, hairWeights)

  for (const [lane, startX] of [-0.06, -0.02, 0.024, 0.062].entries()) {
    const points = []
    for (let step = 0; step <= 48; step++) {
      const u = step / 48
      const x = startX * (1 - smooth(0.12, 0.92, u))
      const z = 0.15 - 0.215 * u
      const startY = hairlineY(startX, 0.15)
      const y = startY + (1.83 - startY) * u + 0.07 * Math.sin(Math.PI * u)
      const scalp = closestScalp(new Vector3(x, y, z))
      points.push(scalp.position.addScaledVector(scalp.normal, 0.003))
    }
    const center = new CatmullRomCurve3(points)
    const positionsArray = []
    const normalArray = []
    const weightIds = []
    const indices = []
    const rows = 48
    const columns = 12
    for (let row = 0; row <= rows; row++) {
      const u = row / rows
      const point = center.getPoint(u)
      const tangent = new Vector3().subVectors(
        center.getPoint(Math.min(1, u + 0.004)),
        center.getPoint(Math.max(0, u - 0.004)),
      ).normalize()
      const surface = closestScalp(point)
      const across = new Vector3().crossVectors(surface.normal, tangent).normalize()
      const taper = 0.45 + 0.55 * Math.pow(Math.sin(Math.PI * u), 0.45)
      const width = (lane === 1 || lane === 2 ? 0.022 : 0.019) * taper
      for (let column = 0; column <= columns; column++) {
        const v = (column / columns - 0.5) * 2
        const projected = closestScalp(point.clone().addScaledVector(across, v * width))
        const lift = 0.003 + 0.006 * (1 - v * v) * taper
        positionsArray.push(
          projected.position.x + projected.normal.x * lift,
          projected.position.y + projected.normal.y * lift,
          projected.position.z + projected.normal.z * lift,
        )
        normalArray.push(projected.normal.x, projected.normal.y, projected.normal.z)
        weightIds.push(projected.id)
      }
    }
    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        const index = row * (columns + 1) + column
        const next = index + columns + 1
        indices.push(index, next, index + 1, next, next + 1, index + 1)
      }
    }
    const lock = new BufferGeometry()
    lock.setAttribute('position', new Float32BufferAttribute(positionsArray, 3))
    lock.setAttribute('normal', new Float32BufferAttribute(normalArray, 3))
    lock.setIndex(indices)
    addSkinnedMesh(`Bhairava_V05_SweptLock_${lane + 1}`, lock, weightIds)
  }

  const tieSurface = closestScalp(new Vector3(0, 1.825, -0.07))
  const tieCenter = tieSurface.position.addScaledVector(tieSurface.normal, 0.004)
  const knot = new SphereGeometry(1, 48, 32)
  const knotPositions = knot.attributes.position
  for (let i = 0; i < knotPositions.count; i++) {
    const x = knotPositions.getX(i)
    const y = knotPositions.getY(i)
    const z = knotPositions.getZ(i)
    const fold = 1 + 0.025 * Math.sin(Math.atan2(y, x) * 3 + z * 2)
    knotPositions.setXYZ(
      i,
      tieCenter.x + x * 0.014 * fold,
      tieCenter.y + y * 0.013 * fold,
      tieCenter.z + z * 0.018 * fold,
    )
  }
  knot.computeVertexNormals()
  addSkinnedMesh('Bhairava_V05_IntegratedRearTie', knot)
  const tie = new TorusGeometry(0.010, 0.002, 12, 48)
  tie.translate(
    tieCenter.x + tieSurface.normal.x * 0.006,
    tieCenter.y + tieSurface.normal.y * 0.006,
    tieCenter.z + tieSurface.normal.z * 0.006,
  )
  addSkinnedMesh('Bhairava_V05_RearTieBand', tie)
} else {
  const scalpIds = [...new Set(skinIndices)].filter(id => (
    influence(id) >= 0.55 && newPositions[id * 3 + 1] > 1.76
  ))
  function closestScalp(point) {
    const nearest = []
    for (const id of scalpIds) {
      const dx = newPositions[id * 3] - point.x
      const dy = newPositions[id * 3 + 1] - point.y
      const dz = newPositions[id * 3 + 2] - point.z
      const distance = dx * dx + dy * dy + dz * dz
      let index = nearest.length
      while (index > 0 && nearest[index - 1].distance > distance) index--
      if (index < 4) {
        nearest.splice(index, 0, { id, distance })
        if (nearest.length > 4) nearest.pop()
      }
    }
    if (!nearest.length) throw new Error('V06 scalp surface vertices were not found')
    let total = 0
    const position = new Vector3()
    const normal = new Vector3()
    for (const vertex of nearest) {
      const weight = 1 / Math.max(vertex.distance, 1e-10)
      total += weight
      position.x += newPositions[vertex.id * 3] * weight
      position.y += newPositions[vertex.id * 3 + 1] * weight
      position.z += newPositions[vertex.id * 3 + 2] * weight
      normal.x += currentNormals[vertex.id * 3] * weight
      normal.y += currentNormals[vertex.id * 3 + 1] * weight
      normal.z += currentNormals[vertex.id * 3 + 2] * weight
    }
    return {
      position: position.multiplyScalar(1 / total),
      normal: normal.normalize(),
      id: nearest[0].id,
    }
  }
  const laneCount = 56
  for (let lane = 0; lane < laneCount; lane++) {
    const side = lane % 2 === 0 ? -1 : 1
    const laneInSide = Math.floor(lane / 2)
    const fraction = (laneInSide + 0.5) / (laneCount / 2)
    const startAzimuth = side * (0.03 + fraction * 0.92)
    const startPhi = 1.03 + fraction * 0.37 + 0.018 * Math.sin(lane * 2.17)
    const endAzimuth = side * (Math.PI - 0.08 - fraction * 0.18)
    const phase = lane * 1.61803398875
    const samples = []
    for (let step = 0; step <= 36; step++) {
      const u = step / 36
      const azimuth = startAzimuth + (endAzimuth - startAzimuth) * u
      const sweep = Math.sin(Math.PI * u)
      const phi = startPhi + (1.22 - startPhi) * u - 0.66 * sweep
        + 0.025 * Math.sin(phase + u * 7.4) * sweep
      const base = ellipsoidPoint(azimuth, phi)
      const fitted = closestScalp(base)
      samples.push(fitted.position)
    }
    const center = new CatmullRomCurve3(samples)
    const positionsArray = []
    const normalsArray = []
    const sourceIds = []
    const indices = []
    const rows = 36
    const radialSegments = 6
    const radius = 0.002 + 0.0018 * (0.5 + 0.5 * Math.sin(phase * 2.3))
    for (let row = 0; row <= rows; row++) {
      const u = row / rows
      const point = center.getPoint(u)
      const tangent = new Vector3().subVectors(
        center.getPoint(Math.min(1, u + 0.003)),
        center.getPoint(Math.max(0, u - 0.003)),
      ).normalize()
      const fitted = closestScalp(point)
      const across = new Vector3().crossVectors(fitted.normal, tangent).normalize()
      const binormal = new Vector3().crossVectors(tangent, across).normalize()
      const taper = 0.12 + 0.88 * Math.pow(Math.sin(Math.PI * u), 0.35)
      const localRadius = radius * taper
      const lift = localRadius * 0.72 + 0.0006
      for (let column = 0; column <= radialSegments; column++) {
        const angle = column / radialSegments * Math.PI * 2
        const radial = fitted.normal.clone().multiplyScalar(Math.cos(angle) * 0.72)
          .addScaledVector(across, Math.cos(angle) * 0.55)
          .addScaledVector(binormal, Math.sin(angle)).normalize()
        positionsArray.push(
          point.x + fitted.normal.x * lift + across.x * Math.cos(angle) * localRadius * 0.55 + binormal.x * Math.sin(angle) * localRadius,
          point.y + fitted.normal.y * lift + across.y * Math.cos(angle) * localRadius * 0.55 + binormal.y * Math.sin(angle) * localRadius,
          point.z + fitted.normal.z * lift + across.z * Math.cos(angle) * localRadius * 0.55 + binormal.z * Math.sin(angle) * localRadius,
        )
        normalsArray.push(radial.x, radial.y, radial.z)
        sourceIds.push(fitted.id)
      }
    }
    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < radialSegments; column++) {
        const index = row * (radialSegments + 1) + column
        const next = index + radialSegments + 1
        indices.push(index, next, index + 1, next, next + 1, index + 1)
      }
    }
    const fibers = new BufferGeometry()
    fibers.setAttribute('position', new Float32BufferAttribute(positionsArray, 3))
    fibers.setAttribute('normal', new Float32BufferAttribute(normalsArray.map(Number), 3))
    fibers.setIndex(indices)
    addSkinnedMesh(`Bhairava_V06_SweptFiber_${String(lane + 1).padStart(2, '0')}`, fibers, sourceIds)
  }

  const tieSurface = closestScalp(ellipsoidPoint(Math.PI, 1.2))
  const tieCenter = tieSurface.position.addScaledVector(tieSurface.normal, 0.003)
  const knot = new SphereGeometry(1, 32, 24)
  const knotPositions = knot.attributes.position
  for (let i = 0; i < knotPositions.count; i++) {
    const x = knotPositions.getX(i)
    const y = knotPositions.getY(i)
    const z = knotPositions.getZ(i)
    const pleat = 1 + 0.035 * Math.sin(Math.atan2(y, x) * 4 + z * 3)
    knotPositions.setXYZ(
      i,
      tieCenter.x + x * 0.009 * pleat,
      tieCenter.y + y * 0.008 * pleat,
      tieCenter.z + z * 0.012 * pleat,
    )
  }
  knot.computeVertexNormals()
  addSkinnedMesh('Bhairava_V06_IntegratedRearTie', knot, Array(knot.attributes.position.count).fill(tieSurface.id))
  const tie = new TorusGeometry(0.008, 0.0012, 8, 32)
  tie.applyQuaternion(new Quaternion().setFromUnitVectors(new Vector3(0, 0, 1), tieSurface.normal))
  tie.translate(
    tieCenter.x + tieSurface.normal.x * 0.006,
    tieCenter.y + tieSurface.normal.y * 0.006,
    tieCenter.z + tieSurface.normal.z * 0.006,
  )
  addSkinnedMesh('Bhairava_V06_RearTieBand', tie, Array(tie.attributes.position.count).fill(tieSurface.id))
}

function clipPolygon(polygon, plane) {
  const result = []
  for (let i = 0; i < polygon.length; i++) {
    const current = polygon[i]
    const next = polygon[(i + 1) % polygon.length]
    const a = plane(current.position)
    const b = plane(next.position)
    if (a <= 0) result.push(current)
    if ((a <= 0) !== (b <= 0)) {
      const t = a / (a - b)
      result.push({
        position: current.position.map((value, axis) => value + (next.position[axis] - value) * t),
        normal: current.normal.map((value, axis) => value + (next.normal[axis] - value) * t),
        id: t < 0.5 ? current.id : next.id,
      })
    }
  }
  return result
}

function facePatch(name, region, offset) {
  const vertices = []
  const normals = []
  const sourceIds = []
  const indices = []
  for (let i = 0; i < skinIndices.length; i += 3) {
    const triangle = skinIndices.slice(i, i + 3)
    if (triangle.some((id) => influence(id) < 0.72)) continue
    let polygon = triangle.map((id) => ({
      position: newPositions.slice(id * 3, id * 3 + 3),
      normal: currentNormals.slice(id * 3, id * 3 + 3),
      id,
    }))
    for (const plane of region) {
      polygon = clipPolygon(polygon, plane)
      if (polygon.length < 3) break
    }
    if (polygon.length < 3) continue
    const start = sourceIds.length
    for (const vertex of polygon) {
      const normal = new Vector3(...vertex.normal).normalize()
      vertices.push(
        vertex.position[0] + normal.x * offset,
        vertex.position[1] + normal.y * offset,
        vertex.position[2] + normal.z * offset,
      )
      normals.push(normal.x, normal.y, normal.z)
      sourceIds.push(vertex.id)
    }
    for (let i = 1; i < polygon.length - 1; i++) indices.push(start, start + i, start + i + 1)
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3))
  geometry.setAttribute('normal', new Float32BufferAttribute(normals, 3))
  geometry.setIndex(indices)
  addSkinnedMesh(name, geometry, sourceIds)
}

const beardRegion = [
  (point) => 1.638 - point[1],
  (point) => 0.062 - point[2],
  (point) => Math.abs(point[0]) - 0.083,
  (point) => point[1] - (stage !== 'v04'
    ? 1.708 + 0.022 * smooth(0.012, 0.08, Math.abs(point[0]))
    : 1.698 + 0.028 * smooth(0.012, 0.08, Math.abs(point[0]))),
]
facePatch(`Bhairava_${stageLabel}_NaturalBeard`, beardRegion, stage !== 'v04' ? 0.0045 : 0.0032)
for (const side of [-1, 1]) {
  facePatch(`Bhairava_${stageLabel}_Moustache_${side < 0 ? 'L' : 'R'}`, [
    (point) => 0.096 - point[2],
    (point) => 0.001 - side * point[0],
    (point) => side * point[0] - 0.051,
    (point) => 1.691 - point[1],
    (point) => point[1] - (1.713 - 0.006 * Math.pow(Math.abs(point[0]) / 0.051, 1.4)),
  ], 0.004)
}

function surfaceRibbon(name, side, centerY, length, width, materialOffset) {
  const rows = 30
  const columns = 8
  const ribbonPositions = []
  const ribbonIndices = []
  for (let row = 0; row <= rows; row++) {
    const u = row / rows
    const x = side * (0.012 + u * length)
    const yCenter = centerY + 0.004 * Math.sin(Math.PI * u) - 0.002 * u
    const halfWidth = 0.0008 + width * Math.pow(Math.sin(Math.PI * u), 0.7)
    for (let column = 0; column <= columns; column++) {
      const v = (column / columns - 0.5) * 2
      const y = yCenter + v * halfWidth
      const nearest = nearestSkin(x, y)
      const depth = stage === 'v05' ? interpolatedSkinDepth(x, y) : newPositions[nearest * 3 + 2]
      ribbonPositions.push(x, y, depth + materialOffset)
    }
  }
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const i = row * (columns + 1) + column
      const next = i + columns + 1
      ribbonIndices.push(i, next, i + 1, next, next + 1, i + 1)
    }
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(ribbonPositions, 3))
  geometry.setIndex(ribbonIndices)
  geometry.computeVertexNormals()
  addSkinnedMesh(name, geometry, transferWeights(geometry))
}
if (stage === 'v04') {
  surfaceRibbon(`Bhairava_${stageLabel}_Brow_L`, -1, 1.778, 0.050, 0.0036, 0.002)
  surfaceRibbon(`Bhairava_${stageLabel}_Brow_R`, 1, 1.778, 0.050, 0.0036, 0.002)
}

doc.meshes[0].primitives = doc.meshes[0].primitives.filter((primitive) => (
  !['Hair', 'Beard', 'Eyebrows'].includes(doc.materials[primitive.material].name)
))
doc.extras = {
  ...doc.extras,
  bhairavaClayCandidate: {
    stage: `${stage} review only`,
    sourceSha256: crypto.createHash('sha256').update(source).digest('hex'),
    vertexTopologyPreserved: true,
    textureAuthoringStarted: false,
    productionIntegration: false,
  },
}

function save(path, data = doc) {
  const all = Buffer.concat(chunks)
  const binary = Buffer.concat([all, Buffer.alloc((4 - all.length % 4) % 4)])
  data.buffers = [{ byteLength: binary.length }]
  const json = Buffer.from(JSON.stringify(data))
  const paddedJson = Buffer.concat([json, Buffer.alloc((4 - json.length % 4) % 4, 32)])
  const header = Buffer.alloc(20)
  const binaryHeader = Buffer.alloc(8)
  header.write('glTF')
  header.writeUInt32LE(2, 4)
  header.writeUInt32LE(28 + paddedJson.length + binary.length, 8)
  header.writeUInt32LE(paddedJson.length, 12)
  header.writeUInt32LE(0x4e4f534a, 16)
  binaryHeader.writeUInt32LE(binary.length)
  binaryHeader.writeUInt32LE(0x004e4942, 4)
  fs.writeFileSync(path, Buffer.concat([header, paddedJson, binaryHeader, binary]))
}

save(`${out}/work/bhairava-clay-candidate.glb`)
const headDoc = structuredClone(doc)
headDoc.meshes[0].primitives = headDoc.meshes[0].primitives
  .filter((primitive) => ['Skin', 'Skin details', 'Eyes', 'Eyelashes', 'Teeth', 'Tongue'].includes(doc.materials[primitive.material].name))
  .map((primitive) => {
    const indices = values(primitive.indices)
    const head = []
    for (let i = 0; i < indices.length; i += 3) {
      if (indices.slice(i, i + 3).every((id) => influence(id) >= 0.5)) head.push(...indices.slice(i, i + 3))
    }
    return { ...primitive, indices: append(Uint32Array.from(head), 'SCALAR', 5125, 34963) }
  })
headDoc.accessors = structuredClone(doc.accessors)
headDoc.bufferViews = structuredClone(doc.bufferViews)
save(`${out}/work/bhairava-head-working-copy.glb`, headDoc)

const sculptReport = {
  stage,
  method: stage === 'v06'
    ? 'V05-derived same-topology facial refinement with individual head-conforming swept fibers and rear tie; isolated review copy only.'
    : stage === 'v05'
      ? 'V04-derived same-topology proportional sculpt and separate swept-volume groom; isolated review copy only.'
      : 'V03-derived regional same-topology sculpt and reworked clay groom; review copy only.',
  sourceSha256: crypto.createHash('sha256').update(source).digest('hex'),
  editedVertexCount: edited.size,
  editedVertexIds: [...edited.keys()],
  boneJointNames: jointNames,
  maxAdditionalDisplacementMetres: Math.max(...[...edited.values()].map((delta) => Math.hypot(...delta))),
  addedGeometry: added,
  originalBoneCount: jointNames.length,
  originalClipNames: doc.animations.map((animation) => animation.name),
  texturesAuthored: false,
  productionIntegrated: false,
  limitations: [
    'Clay candidate only; likeness requires user visual approval.',
    'Authorized references do not provide matched neutral front, three-quarter, and profile views.',
    'No facial animation or blendshape system was added.',
  ],
}
fs.writeFileSync(`${out}/work/sculpt-${stage}.json`, JSON.stringify(sculptReport, null, 2))
console.log(JSON.stringify({ ...sculptReport, addedGeometry: added.length }, null, 2))
