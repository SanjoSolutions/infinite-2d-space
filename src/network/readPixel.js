export function readPixel(view, byteOffset) {
  const x = view.getInt32(byteOffset)
  const y = view.getInt32(byteOffset + 4)
  return { x, y }
}
