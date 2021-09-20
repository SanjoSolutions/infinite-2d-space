import { createPixelsFixture } from './createPixelsFixture.js'
import { createPixelsOfViewportPacket } from './createPixelsOfViewportPacket.js'
import { PacketType } from './PacketType.js'
import { pixelPacketToArray } from './pixelPacketToArray.js'

describe('createPixelsOfViewportPacket', () => {
  it('creates a packet for sending pixels of a viewport', () => {
    const pixels = createPixelsFixture()
    const packet = createPixelsOfViewportPacket(pixels)
    expect(pixelPacketToArray(packet)).toEqual([
      PacketType.PixelsOfViewport,
      3,
      -1,
      1,
      0,
      0,
      1,
      -1
    ])
  })
})
