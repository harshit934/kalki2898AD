import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { RepeatWrapping, SRGBColorSpace, TextureLoader } from 'three'

const ROOT = '/environment/phase54c-revision/'
const draco = new DRACOLoader().setDecoderPath('/environment/kashi/draco/').setWorkerLimit(2)
const loader = new GLTFLoader().setDRACOLoader(draco)
const textures = new TextureLoader(), requests = new Map()
let basePromise, nearPromise
function request(url, kind) {
  if (!requests.has(url)) {
    const promise = kind === 'texture' ? textures.loadAsync(url) : loader.loadAsync(url)
    requests.set(url, promise.catch(error => { requests.delete(url); throw error }))
  }
  return requests.get(url)
}
async function surfaces() {
  const maps = await Promise.all(['stone-color.jpg', 'stone-normal.jpg', 'stone-roughness.jpg'].map(n => request('/environment/kashi/' + n, 'texture')))
  maps[0].colorSpace = SRGBColorSpace
  maps.forEach(t => { t.flipY = false; t.wrapS = t.wrapT = RepeatWrapping; t.anisotropy = 4 })
  return maps
}
export function loadRevisionBase() {
  if (!basePromise) basePromise = Promise.all([request(ROOT + 'block-base.glb'), surfaces()]).then(([model, maps]) => ({ model, maps })).catch(e => { basePromise = null; throw e })
  return basePromise
}
export function loadRevisionNear() {
  if (!nearPromise) nearPromise = Promise.all([
    request(ROOT + 'block-detail.glb'), request(ROOT + 'civilian-merchant.glb'), request(ROOT + 'civilian-porter.glb'), surfaces(),
  ]).then(([model, merchant, porter, maps]) => ({ model, merchant, porter, maps })).catch(e => { nearPromise = null; throw e })
  return nearPromise
}
// The first authored camera is near the block. Far-only inspection never calls this.
export function prepareRevisionOpening() { return Promise.all([loadRevisionBase(), loadRevisionNear()]) }
