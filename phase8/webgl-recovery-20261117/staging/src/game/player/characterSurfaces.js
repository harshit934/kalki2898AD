import { CanvasTexture, RepeatWrapping } from 'three'

// Neutral relief maps retain the costume colours while catching grazing light.
export function makeCharacterRelief(kind) {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 256
  const context = canvas.getContext('2d')
  const pixels = context.createImageData(256, 256)
  let seed = 2898
  for (let y = 0; y < 256; y += 1) {
    for (let x = 0; x < 256; x += 1) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
      const noise = seed / 4294967296
      const weave = kind === 'cloth'
        ? ((x % 4 < 2 ? 1 : -1) + (y % 4 < 2 ? 1 : -1)) * 9
        : kind === 'skin'
          ? noise * 18
          : Math.sin(x * 0.13 + Math.sin(y * 0.19)) * 12 + noise * 35
      const value = 128 + weave + (noise - 0.5) * 20
      const offset = (y * 256 + x) * 4
      pixels.data[offset] = pixels.data[offset + 1] = pixels.data[offset + 2] = value
      pixels.data[offset + 3] = 255
    }
  }
  context.putImageData(pixels, 0, 0)
  const texture = new CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = RepeatWrapping
  texture.repeat.setScalar(kind === 'skin' ? 2 : 3)
  return texture
}
