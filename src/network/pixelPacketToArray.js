import { readPixel } from './readPixel.js'

export function pixelPacketToArray(pixelPacket) {
  const view = new DataView(pixelPacket)
  const type = view.getUint8(0)
  const length = view.getUint32(1)
  const pixels = new Array(length * 2)
  for (let index = 0; index < length; index++) {
    const byteOffset = 1 + 4 + index * 2 * 4
    const { x, y } = readPixel(view, byteOffset)
    pixels[index * 2] = x
    pixels[index * 2 + 1] = y
  }
  return [type, length].concat(pixels)
}
