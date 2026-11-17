import { Box3, InterpolateDiscrete, InterpolateLinear, Matrix4, PropertyBinding, Sphere, Vector3 } from 'three'
import { clone } from 'three/addons/utils/SkeletonUtils.js'
import { applyBhairavaAppearance } from '../player/bhairavaAppearance.js'
import { missionOneEnding } from '../cinematics/missionOneEnding.js'

const cache = new WeakMap()
export const endingActor = missionOneEnding.actors[0]
export function endingPreparationEnabled() {
  const params = new URLSearchParams(location.search)
  // The original Mission 1 route now prepares this same actor before gameplay.
  const originalEnvironment = params.get('environment54e') !== '1' && params.get('kashiPrototype') !== 'revision'
  return originalEnvironment || params.get('kashiPrototype') === 'revision' ||
    (params.get('environment54e') === '1' && !['first', 'correction1'].includes(params.get('cityVersion')))
}
export function usesPreparedEnding(session) {
  return endingPreparationEnabled() && session.config === missionOneEnding
}
export function preparedEnding(asset) { return cache.get(asset)?.value }
const yieldLoading = () => new Promise(resolve => setTimeout(resolve, 0))
function linearNorm(matrix) {
  const e = matrix.elements, columns = [new Vector3(e[0], e[1], e[2]), new Vector3(e[4], e[5], e[6]), new Vector3(e[8], e[9], e[10])]
  const lengths = columns.map(v => v.length())
  if (columns.every((v, i) => columns.every((w, j) => i === j || Math.abs(v.dot(w)) <= 1e-8 * Math.max(1, lengths[i] * lengths[j])))) return Math.max(...lengths) * (1 + 1e-8)
  return Math.hypot(...lengths) // Frobenius norm is an upper bound even with shear.
}
function transformedRadius(matrix, radius) {
  return linearNorm(matrix) * radius + new Vector3().setFromMatrixPosition(matrix).length()
}

// This bounds ALL unit-quaternion rotations, not just sampled/bind poses. For
// each hierarchy edge |T + RSv| <= |T| + max(|S|)|v|. Linear/discrete key extrema
// bound translations/scales throughout the clip, including between keyframes.
function hierarchyLimits(root, clip) {
  const limits = new Map()
  root.traverse(node => limits.set(node, { translation: node.position.length(), scale: Math.max(...node.scale.toArray().map(Math.abs)) }))
  for (const track of clip.tracks) {
    const parsed = PropertyBinding.parseTrackName(track.name), node = PropertyBinding.findNode(root, parsed.nodeName)
    if (!node || parsed.objectName || !['position', 'scale', 'quaternion'].includes(parsed.propertyName)) throw new Error('Unsupported ending bounds track: ' + track.name)
    if (parsed.propertyName === 'quaternion') continue // Any normalized rotation is already covered.
    if (![InterpolateLinear, InterpolateDiscrete].includes(track.getInterpolation()) || track.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline) throw new Error('Unsupported bounds interpolation: ' + track.name)
    const limit = limits.get(node)
    for (let i = 0; i < track.values.length; i += 3) {
      if (parsed.propertyName === 'position') limit.translation = Math.max(limit.translation, Math.hypot(...track.values.slice(i, i + 3)))
      else limit.scale = Math.max(limit.scale, ...track.values.slice(i, i + 3).map(Math.abs))
    }
    if (!node.isBone) throw new Error('Animated non-bone transform needs a separate bounds derivation: ' + track.name)
  }
  function radiusToRoot(bone, radius) {
    for (let node = bone; node !== root; node = node.parent) {
      if (!node || !limits.has(node)) throw new Error('Ending bone outside actor root')
      const limit = limits.get(node); radius = limit.translation + limit.scale * radius
    }
    return radius
  }
  return radiusToRoot
}

export function prepareEndingBounds(asset) {
  if (cache.has(asset)) return cache.get(asset).promise
  const entry = {}
  entry.promise = (async () => {
    const start = performance.now(), root = clone(asset.scene)
    root.updateMatrixWorld(true)
    // Exact original height/foot normalization, computed once behind the gate.
    const normalization = new Box3().setFromObject(root), meshes = []
    root.traverse(o => { if (o.isSkinnedMesh) meshes.push(o) })
    const bindBoxes = meshes.map(o => o.boundingBox.clone())
    const height = normalization.getSize(new Vector3()).y
    if (!(height > 0)) throw new Error('Invalid ending actor height')
    root.scale.setScalar(endingActor.height / height); root.position.y = -normalization.min.y * root.scale.y
    const restore = applyBhairavaAppearance(root)
    try {
      root.updateMatrixWorld(true)
      const clip = asset.animations.find(c => c.name === endingActor.actions[0].clip)
      if (!clip) throw new Error('Ending guard clip missing')
      const radiusToRoot = hierarchyLimits(root, clip), inverseRoot = root.matrixWorld.clone().invert(), bounds = []
      for (let m = 0; m < meshes.length; m++) {
        const mesh = meshes[m], geometry = mesh.geometry, positions = geometry.attributes.position, weights = geometry.attributes.skinWeight
        if (mesh.bindMode !== 'attached') throw new Error('Unsupported ending skin bind mode')
        if (mesh.morphTargetInfluences?.some(w => !Number.isFinite(w) || w < 0 || w > 1)) throw new Error('Unsupported ending morph weight')
        let positionRadius = 0, maxWeightSum = 0
        const point = new Vector3()
        for (let i = 0; i < positions.count; i++) {
          positionRadius = Math.max(positionRadius, point.fromBufferAttribute(positions, i).length())
          let weightSum = 0
          for (let j = 0; j < 4; j++) { const w = weights.getComponent(i, j); if (w < 0 || !Number.isFinite(w)) throw new Error('Invalid skin weight'); weightSum += w }
          maxWeightSum = Math.max(maxWeightSum, weightSum)
          if (i % 8192 === 0) await yieldLoading()
        }
        // Facial weights are clamped to [0,1]. Sum displacement radii to cover
        // simultaneous morphs, including their full ranges, not only blink samples.
        for (const morph of geometry.morphAttributes.position || []) {
          let displacement = 0
          for (let i = 0; i < positions.count; i++) {
            point.fromBufferAttribute(morph, i)
            if (!geometry.morphTargetsRelative) point.sub(new Vector3().fromBufferAttribute(positions, i))
            displacement = Math.max(displacement, point.length())
            if (i % 8192 === 0) await yieldLoading()
          }
          positionRadius += displacement
        }
        const boundInput = transformedRadius(mesh.bindMatrix, positionRadius)
        let rootRadius = 0
        for (let i = 0; i < mesh.skeleton.bones.length; i++) {
          const local = transformedRadius(mesh.skeleton.boneInverses[i], boundInput)
          rootRadius = Math.max(rootRadius, radiusToRoot(mesh.skeleton.bones[i], local))
        }
        const meshRelative = new Matrix4().multiplyMatrices(inverseRoot, mesh.matrixWorld)
        const radius = transformedRadius(meshRelative.invert(), rootRadius * maxWeightSum) * 1.01 + 1e-4
        if (!Number.isFinite(radius) || radius <= 0) throw new Error('Invalid conservative ending sphere')
        bounds.push({ name: mesh.name, box: bindBoxes[m], sphere: new Sphere(new Vector3(), radius), vertices: positions.count })
      }
      entry.value = { normalization, bounds, preparationMs: performance.now() - start }
      return entry.value
    } finally { restore() }
  })().catch(error => { cache.delete(asset); throw error })
  cache.set(asset, entry)
  return entry.promise
}

export function applyEndingBounds(object, asset) {
  const prepared = preparedEnding(asset)
  if (!prepared) throw new Error('Ending bounds were not prepared during loading')
  let index = 0
  object.traverse(mesh => {
    if (!mesh.isSkinnedMesh) return
    const item = prepared.bounds[index++]
    if (!item || mesh.name !== item.name) throw new Error('Ending mesh cache mismatch')
    // Keep the exact bind boxes for costume's existing height query; culling uses
    // the separate conservative sphere. Never replace these with a giant box.
    mesh.boundingBox = item.box.clone(); mesh.boundingSphere = item.sphere.clone()
  })
  if (index !== prepared.bounds.length) throw new Error('Ending mesh count changed')
  return prepared.normalization
}
