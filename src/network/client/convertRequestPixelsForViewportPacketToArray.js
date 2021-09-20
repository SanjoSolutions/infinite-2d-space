export function convertRequestPixelsForViewportPacketToArray(packet) {
  const view = new DataView(packet);
  return [
    view.getUint8(0),
    view.getInt32(1),
    view.getInt32(1 + 1 * 4),
    view.getInt32(1 + 2 * 4),
    view.getInt32(1 + 3 * 4),
  ];
}
