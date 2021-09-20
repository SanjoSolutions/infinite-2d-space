import { convertPacketPixelArrayToArray } from '../convertPacketPixelArrayToArray.js'
import { PacketType } from '../PacketType.js'

export class Client {
  constructor() {
    this.connection = null
    this._resolve = null
    this._reject = null
  }

  async connect(serverUrl) {
    this.connection = new WebSocket(serverUrl)

    this.connection.addEventListener('open', function (event) {

    })

    this.connection.addEventListener('message', async (event) => {
      const data = await event.data.arrayBuffer()
      const view = new DataView(data)
      const code = view.getUint8(0)
      switch (code) {
        case PacketType.PixelsOfViewport:
          this._onReceivePixelsForViewport(data)
          return
        case PacketType.ReceivePixelsDrawnByOtherUserFromServer:
          onReceivePixelsDrawnByOtherUser(data)
          return
        default:
          console.error(`Handler for code ${ code } not implemented.`)
      }
    })
  }

  _onReceivePixelsForViewport(data) {
    const pixels = convertPacketPixelArrayToArray(data.slice(1))
    this._resolve(pixels)
  }

  async requestPixelsForViewport({ minX, minY, maxX, maxY }) {
    const data = createRequestPixelsForViewportPacket({ minX, maxX, minY, maxY })
    this.connection.send(data)
    return new Promise((resolve, reject) => {
      this._resolve = resolve
      this._reject = reject
    })
  }
}

function sendPixelsToServer(pixels) {
  const data = createSendPixelsToServerPacket(pixels)
  socket.send(data)
}

export function createSendPixelsToServerPacket(pixels) {
  const data = new ArrayBuffer(1 + 4 + pixels.length * 2 * 4)
  const view = new DataView(data)
  view.setUint8(0, PacketType.SendPixelsToServer)
  view.setUint32(1, pixels.length)
  for (let index = 0; index < pixels.length; index++) {
    const { x, y } = pixels[index]
    view.setInt32(1 + 4 + index * 2 * 4, x)
    view.setInt32(1 + 4 + index * 2 * 4 + 4, y)
  }
  return data
}

export function createRequestPixelsForViewportPacket({
  minX,
  minY,
  maxX,
  maxY,
}) {
  const data = new ArrayBuffer(1 + 4 * 4)
  const view = new DataView(data)
  view.setUint8(0, PacketType.RequestPixelsForViewportFromServer)
  view.setInt32(1 + 0 * 4, minX)
  view.setInt32(1 + 1 * 4, minY)
  view.setInt32(1 + 2 * 4, maxX)
  view.setInt32(1 + 3 * 4, maxY)
  return data
}

function onReceivePixelsDrawnByOtherUser(data) {
  const pixels = convertPacketPixelArrayToArray(data.slice(1))
  // TODO: Put pixels on canvas
}
