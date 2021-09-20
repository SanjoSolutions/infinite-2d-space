import { PacketType } from './PacketType.js'

export function createPixelsOfViewportPacket(pixels) {
  const data = new ArrayBuffer(1 + 4 + pixels.length * 2 * 4)
  const view = new DataView(data)
  view.setUint8(0, PacketType.PixelsOfViewport)
  view.setUint32(1, pixels.length)
  for (let index = 0; index < pixels.length; index++) {
    const { x, y } = pixels[index]
    view.setInt32(1 + 4 + index * 2 * 4, x)
    view.setInt32(1 + 4 + index * 2 * 4 + 4, y)
  }
  return data
}
