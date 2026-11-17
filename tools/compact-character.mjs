// Strip unrelated export clips and compact their now-unused binary storage.
// Usage: node tools/compact-character.mjs source.glb target.glb
import { readFileSync, writeFileSync } from 'node:fs'
const [, , source, destination] = process.argv
const input = readFileSync(source)
const jsonLength = input.readUInt32LE(12)
const doc = JSON.parse(input.subarray(20, 20 + jsonLength))
const binary = input.subarray(28 + jsonLength)
const clips = new Set(['Walk', 'Run', 'Jump (in air)', 'Sword idle (guard)', 'Sword slash', 'Sword block', 'Death (fall backward)'])
doc.animations = doc.animations.filter((clip) => clips.has(clip.name))
const used = new Set()
for (const mesh of doc.meshes) for (const primitive of mesh.primitives) {
  Object.values(primitive.attributes).forEach((i) => used.add(i))
  if (primitive.indices !== undefined) used.add(primitive.indices)
  for (const target of primitive.targets || []) Object.values(target).forEach((i) => used.add(i))
}
for (const skin of doc.skins || []) if (skin.inverseBindMatrices !== undefined) used.add(skin.inverseBindMatrices)
for (const clip of doc.animations) for (const sampler of clip.samplers) { used.add(sampler.input); used.add(sampler.output) }
const accessors = [...used].sort((a, b) => a - b)
const remap = new Map(accessors.map((old, index) => [old, index]))
for (const mesh of doc.meshes) for (const p of mesh.primitives) {
  for (const key in p.attributes) p.attributes[key] = remap.get(p.attributes[key])
  if (p.indices !== undefined) p.indices = remap.get(p.indices)
  for (const target of p.targets || []) for (const key in target) target[key] = remap.get(target[key])
}
for (const skin of doc.skins || []) if (skin.inverseBindMatrices !== undefined) skin.inverseBindMatrices = remap.get(skin.inverseBindMatrices)
for (const clip of doc.animations) for (const sampler of clip.samplers) { sampler.input = remap.get(sampler.input); sampler.output = remap.get(sampler.output) }
doc.accessors = accessors.map((i) => doc.accessors[i])
if (doc.accessors.some((a) => a.sparse)) throw Error('Sparse accessors require additional handling')
const views = new Set(doc.accessors.map((a) => a.bufferView).filter((i) => i !== undefined))
for (const image of doc.images || []) if (image.bufferView !== undefined) views.add(image.bufferView)
const viewIds = [...views].sort((a, b) => a - b)
const viewMap = new Map(viewIds.map((old, index) => [old, index]))
const parts = []; let length = 0
doc.bufferViews = viewIds.map((i) => {
  const view = doc.bufferViews[i]
  const data = binary.subarray(view.byteOffset || 0, (view.byteOffset || 0) + view.byteLength)
  const offset = length; const padding = Buffer.alloc((4 - data.length % 4) % 4)
  parts.push(data, padding); length += data.length + padding.length
  return { ...view, buffer: 0, byteOffset: offset }
})
for (const accessor of doc.accessors) if (accessor.bufferView !== undefined) accessor.bufferView = viewMap.get(accessor.bufferView)
for (const image of doc.images || []) if (image.bufferView !== undefined) image.bufferView = viewMap.get(image.bufferView)
doc.buffers = [{ byteLength: length }]
const text = Buffer.from(JSON.stringify(doc)); const padded = Buffer.concat([text, Buffer.alloc((4 - text.length % 4) % 4, 32)])
const header = Buffer.alloc(20); header.write('glTF'); header.writeUInt32LE(2, 4); header.writeUInt32LE(28 + padded.length + length, 8); header.writeUInt32LE(padded.length, 12); header.writeUInt32LE(0x4e4f534a, 16)
const binHeader = Buffer.alloc(8); binHeader.writeUInt32LE(length); binHeader.writeUInt32LE(0x004e4942, 4)
writeFileSync(destination, Buffer.concat([header, padded, binHeader, ...parts]))
console.log(JSON.stringify({ bytesBefore: input.length, bytesAfter: 28 + padded.length + length, clips: doc.animations.map((a) => a.name) }))
