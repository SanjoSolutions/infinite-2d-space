// TODO: Use BigInt for get, set etc.

import { convertNumbeToBigInt } from './convertNumberToBigInt.js'

export class Space {
  constructor (viewport) {
    this.viewport = viewport
    this.data = new ArrayBuffer(Number(this.width * this.height))
    this.view = new Uint8Array(this.data)
  }

  get width () {
    return (
      this.viewport.maxX - this.viewport.minX + 1n
    ) / 8n * 8n
  }

  get height () {
    return (
      this.viewport.maxY - this.viewport.minY + 1n
    ) / 8n * 8n
  }

  _getIndex ({ x, y }) {
    x = convertNumbeToBigInt(x)
    y = convertNumbeToBigInt(y)
    const index = (
      (
        this.viewport.maxY - y
      ) *
      this.width +
      (
        this.viewport.minX - x
      )
    )
    const dataIndex = index / 8n
    const bitIndex = Number(index % 8n)
    return { dataIndex, bitIndex }
  }

  get ({ x, y }) {
    x = convertNumbeToBigInt(x)
    y = convertNumbeToBigInt(y)
    const { dataIndex, bitIndex } = this._getIndex({ x, y })
    return Boolean((
      this.view[dataIndex] >> bitIndex
    ) & 1)
  }

  set ({ x, y }, value) {
    x = convertNumbeToBigInt(x)
    y = convertNumbeToBigInt(y)
    const { dataIndex, bitIndex } = this._getIndex({ x, y })
    if (value) {
      this.view[dataIndex] =
        this.view[dataIndex] |
        (
          1 << bitIndex
        )
    } else {
      this.view[dataIndex] =
        this.view[dataIndex] &
        (
          0b11111111 ^
          (
            1 << bitIndex
          )
        )
    }
  }
}
