import { BoxGeometry, DataTexture, Group, Mesh, MeshStandardMaterial, RGBAFormat, SRGBColorSpace, RepeatWrapping } from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'

function armorWearTexture() {
  const size = 128, pixels = new Uint8Array(size * size * 4)
  let seed = 2898
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
    const noise = seed / 4294967296
    const scratch = (x + y * 3) % 47 === 0 && noise > 0.35
    const value = scratch ? 225 : 195 + Math.round(noise * 8 + Math.sin(x * 0.12) * 10)
    const i = (y * size + x) * 4
    pixels.set([value, value, value, 255], i)
  }
  const texture = new DataTexture(pixels, size, size, RGBAFormat)
  texture.colorSpace = SRGBColorSpace
  texture.wrapS = texture.wrapT = RepeatWrapping
  texture.repeat.set(3, 3)
  texture.needsUpdate = true
  return texture
}

// Only the cloned rig is changed. Cleanup restores borrowed GLTF resources so
// React Strict Mode can safely run setup -> cleanup -> setup on the same clone.
export function applyBhairavaAppearance(scene) {
  const owned = [], wear = armorWearTexture(), detail = new Group()
  detail.name = 'bhairava-costume-fasteners'
  scene.traverse(object => {
    // Portal-mounted weapon materials belong to their React component/ref.
    // Only customize the imported, skinned GLTF primitives.
    if (!object.isSkinnedMesh) return
    const original = object.material
    const material = original.clone()
    object.material = material
    owned.push({ object, original, material })
    const name = material.name
    if (name === 'Skin') { material.color.set('#cfb399'); material.roughness = 0.82 }
    if (name === 'Hair') { material.color.set('#362e26'); material.roughness = 0.88 }
    if (name === 'Beard') { material.color.set('#44362a'); material.roughness = 0.92 }
    if (/titanium/.test(name)) {
      material.map = wear
      material.color.set(name === 'Weathered titanium plates' ? '#b4ad98' : '#8d8979')
      material.metalness = 0.58
      material.roughness = 0.67
    }
    if (/straps|Straps|Utility belt|Pouches/.test(name)) material.roughness = 0.82
    if (name === 'Buckle') { material.color.set('#9a8767'); material.roughness = 0.58 }
    if (name === 'Weathered titanium plates' || name === 'Crossed straps') {
      const geometry = object.geometry.clone(), positions = geometry.attributes.position
      // Flatten only this armor primitive's referenced vertices, retaining the
      // existing topology, skin weights and articulated fit. The cached mesh
      // and the anatomy under the cuirass remain untouched.
      for (const index of new Set(geometry.index.array)) {
        const x = positions.getX(index), y = positions.getY(index)
        const front = 0.19 - Math.abs(x) * 0.13 + (y - 1.44) * 0.025
        if (name === 'Weathered titanium plates') positions.setZ(index, front)
        else if (y > 1.29 && y < 1.6 && positions.getZ(index) > 0.03) positions.setZ(index, Math.max(positions.getZ(index), front + 0.019))
      }
      positions.needsUpdate = true
      geometry.computeVertexNormals()
      owned.at(-1).geometry = object.geometry
      object.geometry = geometry
    }
  })
  const pieces = []
  function plate(x, y, z, width, height, depth) {
    pieces.push(new BoxGeometry(width, height, depth).translate(x, y, z))
  }
  // Small riveted strap keepers; their muted finish follows the reference's
  // salvaged metal/leather costume rather than adding a new armor silhouette.
  for (const [x, y] of [[-0.075, 1.54], [-0.04, 1.46], [0.035, 1.40]]) {
    plate(x - 0.014, y, 0.213, 0.004, 0.025, 0.006)
    plate(x + 0.014, y, 0.213, 0.004, 0.025, 0.006)
    plate(x, y - 0.011, 0.213, 0.028, 0.004, 0.006)
    plate(x, y + 0.011, 0.213, 0.028, 0.004, 0.006)
  }
  const fasteners = new Mesh(mergeGeometries(pieces), new MeshStandardMaterial({ color: '#91816a', metalness: 0.65, roughness: 0.67 }))
  pieces.forEach(g => g.dispose())
  fasteners.castShadow = true
  detail.add(fasteners)
  const marks = [new BoxGeometry(0.013, 0.035, 0.004).translate(-0.012, 1.515, 0.204), new BoxGeometry(0.013, 0.035, 0.004).translate(0.012, 1.515, 0.204), new BoxGeometry(0.037, 0.01, 0.004).translate(0, 1.499, 0.204)]
  detail.add(new Mesh(mergeGeometries(marks), new MeshStandardMaterial({ color: '#8e4d2c', roughness: 0.91 })))
  marks.forEach(g => g.dispose())
  scene.add(detail)
  scene.updateMatrixWorld(true)
  scene.getObjectByName('Spine2')?.attach(detail)
  return () => {
    detail.removeFromParent()
    detail.traverse(o => { if (o.isMesh) { o.geometry.dispose(); o.material.dispose() } })
    for (const { object, original, material, geometry } of owned) {
      if (object.material === material) object.material = original
      material.dispose()
      if (geometry) { object.geometry.dispose(); object.geometry = geometry }
    }
    wear.dispose()
  }
}
