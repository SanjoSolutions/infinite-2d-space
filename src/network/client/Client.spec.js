import { describe, expect, it } from '@jest/globals'
import { createViewportFixture } from '../../../fixtures/createViewportFixture.js'
import { createPixelsFixture } from '../createPixelsFixture.js'
import { createPixelsOfViewportPacket } from '../createPixelsOfViewportPacket.js'
import { pixelPacketToArray } from '../pixelPacketToArray.js'
import { Client, createSendPixelsToServerPacket } from './Client.js'
import { WebSocketMock } from './WebSocketMock.js'

describe('client', () => {
  let originalWebSocket = null

  beforeEach(function () {
    originalWebSocket = WebSocket
    global.WebSocket = WebSocketMock
  })

  afterEach(function () {
    global.WebSocket = originalWebSocket
  })

  test('creating a client', () => {
    const client = new Client()
    expect(client).toBeInstanceOf(Client)
  })

  test('connecting to a server', async () => {
    const client = new Client()
    const serverUrl = 'wss://localhost:8080'
    await expect(() => client.connect(serverUrl)).not.toThrow()
  })

  test('sending a packet', async () => {
    const pixelsFixture = createPixelsFixture()
    const client = new Client()
    const serverUrl = 'wss://localhost:8080'
    await client.connect(serverUrl)
    // pixelsFixture
    client.connection.returnDataAfterNextSend({
      async arrayBuffer() {
        return createPixelsOfViewportPacket(pixelsFixture)
      }
    })
    const pixels = await client.requestPixelsForViewport(createViewportFixture())
    expect(pixels).toEqual(pixelsFixture)
  })

  describe('createSendPixelsToServerPacket', () => {
    it('creates a packet for sending pixels to the server', () => {
      const pixels = [
        { x: 1, y: 2 },
        { x: 3, y: 4 },
      ]
      const packet = createSendPixelsToServerPacket(pixels)
      const expectedPacket = new ArrayBuffer(21)
      const expectedPacketView = new DataView(expectedPacket)
      expectedPacketView.setUint8(0, 0)
      expectedPacketView.setUint32(1, pixels.length)
      expectedPacketView.setInt32(5, 1)
      expectedPacketView.setInt32(9, 2)
      expectedPacketView.setInt32(13, 3)
      expectedPacketView.setInt32(17, 4)
      expect(pixelPacketToArray(packet)).toEqual(
        pixelPacketToArray(expectedPacket),
      )
    })
  })
})
