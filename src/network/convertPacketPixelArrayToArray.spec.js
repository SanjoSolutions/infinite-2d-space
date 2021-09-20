import { convertPacketPixelArrayToArray } from './convertPacketPixelArrayToArray.js'

describe('convertPacketPixelArrayToArray', () => {
  it('converts a packet pixel array to an array', () => {
    const data = new ArrayBuffer(4 + 2 * 2 * 4)
    const view = new DataView(data)
    view.setUint32(0, 2)
    view.setInt32(4 + 0 * 4, 1)
    view.setInt32(4 + 1 * 4, 2)
    view.setInt32(4 + 2 * 4, 3)
    view.setInt32(4 + 3 * 4, 4)

    const pixels = convertPacketPixelArrayToArray(data)

    expect(pixels).toEqual(
      [
        {
          x: 1,
          y: 2
        },
        {
          x: 3,
          y: 4
        }
      ]
    )
  })
})
