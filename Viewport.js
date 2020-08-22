export class Viewport {
  constructor({minX, maxX, minY, maxY}) {
    this.minX = BigInt(minX)
    this.maxX = BigInt(maxX)
    this.minY = BigInt(minY)
    this.maxY = BigInt(maxX)
  }
}
