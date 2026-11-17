import fs from 'node:fs'
import assert from 'node:assert/strict'
import { AnimationClip, AnimationMixer, LoopOnce, Object3D, QuaternionKeyframeTrack, VectorKeyframeTrack } from 'three'
import { prepareCharacterClips } from '../src/game/player/characterAnimation.js'
import { makeBladeGeometry } from '../src/game/player/bladeGeometry.js'

const buffer = fs.readFileSync('public/models/bhairava-free-rig.glb')
const jsonLength = buffer.readUInt32LE(12)
const doc = JSON.parse(buffer.subarray(20, 20 + jsonLength))
const binary = buffer.subarray(28 + jsonLength)
function floats(index) {
  const accessor = doc.accessors[index], view = doc.bufferViews[accessor.bufferView]
  assert.equal(accessor.componentType, 5126)
  assert.ok(!view.byteStride && !accessor.sparse)
  const width = { SCALAR: 1, VEC3: 3, VEC4: 4 }[accessor.type]
  return new Float32Array(binary.buffer, binary.byteOffset + (view.byteOffset || 0) + (accessor.byteOffset || 0), accessor.count * width).slice()
}
const source = doc.animations.map((animation) => new AnimationClip(animation.name, -1, animation.channels.map((channel) => {
  const sampler = animation.samplers[channel.sampler]
  assert.ok(!sampler.interpolation || sampler.interpolation === 'LINEAR')
  const path = { rotation: 'quaternion', translation: 'position', scale: 'scale' }[channel.target.path]
  const Track = path === 'quaternion' ? QuaternionKeyframeTrack : VectorKeyframeTrack
  return new Track(`${doc.nodes[channel.target.node].name}.${path}`, floats(sampler.input), floats(sampler.output))
})))
const clips = prepareCharacterClips(source)
const grip = clips.find((clip) => clip.name === 'Sword idle (guard)')
let fingerTracks = 0
for (const clip of clips.filter((c) => ['Walk', 'Run', 'Jump (in air)'].includes(c.name))) {
  for (const track of clip.tracks.filter((t) => /^RightHand(Thumb|Index|Middle|Ring|Pinky)\d\.quaternion$/.test(t.name))) {
    const expected = grip.tracks.find((t) => t.name === track.name).values.slice(0, 4)
    for (let i = 0; i < track.values.length; i += 4) assert.deepEqual(track.values.slice(i, i + 4), expected)
    fingerTracks++
  }
}
assert.ok(fingerTracks >= 45, 'closed grip in every locomotion clip')
const objects = doc.nodes.map((node) => {
  const object = new Object3D(); object.name = node.name || ''
  if (node.translation) object.position.fromArray(node.translation)
  if (node.rotation) object.quaternion.fromArray(node.rotation)
  return object
})
doc.nodes.forEach((node, index) => (node.children || []).forEach((child) => objects[index].add(objects[child])))
const root = new Object3D()
doc.scenes[doc.scene || 0].nodes.forEach((index) => root.add(objects[index]))
const mixer = new AnimationMixer(root)
const slash = clips.find((clip) => clip.name === 'Sword slash')
const action = mixer.clipAction(slash).setLoop(LoopOnce, 1).setEffectiveTimeScale(0).play()
action.clampWhenFinished = true
const hips = root.getObjectByName('Hips')
const rotationTrack = slash.tracks.find((track) => track.name === 'Hips.quaternion')
for (const time of [0.15, 0.65, 0.05]) {
  action.time = time
  mixer.update(1 / 60)
  const expected = rotationTrack.createInterpolant().evaluate(time)
  hips.quaternion.toArray().forEach((value, index) => assert.ok(Math.abs(value - expected[index]) < 0.00001, 'same-frame attack pose, including rewind'))
}
const geometry = makeBladeGeometry()
assert.ok(geometry.boundingBox.min.y > 0.08 && geometry.boundingBox.max.y > 0.89)
assert.ok(geometry.boundingBox.max.x < 0.01)
geometry.dispose()
console.log(JSON.stringify({ actualAsset: 'PASS', embeddedClips: clips.length, closedGripTracks: fingerTracks, slashPoseAndRewind: 'PASS', weaponSocketAxis: '+Y PASS' }, null, 2))
