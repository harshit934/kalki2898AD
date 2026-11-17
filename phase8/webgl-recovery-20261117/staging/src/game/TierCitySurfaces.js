import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from 'three'

export function makeTierSurface(kind) {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 256
  const context = canvas.getContext('2d')
  const pixels = context.createImageData(256, 256)
  let seed = 2898
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
    return seed / 4294967296
  }
  const street = kind === 'street'
  for (let y = 0; y < 256; y += 1) {
    for (let x = 0; x < 256; x += 1) {
      const offset = (y * 256 + x) * 4
      const seam = street && (y % 64 < 2 || (x + (Math.floor(y / 64) % 2) * 64) % 128 < 2)
      const mottling = 13 * Math.sin(x * Math.PI / 32) * Math.sin(y * Math.PI / 64)
      const grain = (random() - 0.5) * 42
      const value = (seam ? 65 : 150) + mottling + grain
      pixels.data[offset] = value + 15
      pixels.data[offset + 1] = value + 3
      pixels.data[offset + 2] = value - 10
      pixels.data[offset + 3] = 255
    }
  }
  context.putImageData(pixels, 0, 0)
  for (let index = 0; index < 170; index += 1) {
    const x = random() * 256
    const y = random() * 256
    context.fillStyle = index % 2 ? 'rgba(28, 20, 14, 0.18)' : 'rgba(244, 216, 170, 0.19)'
    context.fillRect(x, y, 1 + random() * 4, 2 + random() * (street ? 3 : 26))
  }
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.wrapS = texture.wrapT = RepeatWrapping
  texture.repeat.setScalar(street ? 38 : 1)
  texture.anisotropy = 4
  return texture
}
