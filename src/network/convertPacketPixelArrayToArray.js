import { readPixel } from './readPixel.js'

export function convertPacketPixelArrayToArray(data) {
  const view = new DataView(data)
  const length = view.getUint32(0)
  const pixels = new Array(length)
  for (let index = 0; index < length; index++) {
    const byteOffset = 4 + index * 2 * 4
    pixels[index] = readPixel(view, byteOffset)
  }
  return pixels
}
