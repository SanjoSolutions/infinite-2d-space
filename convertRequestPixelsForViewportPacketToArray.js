import { littleEndian } from "./littleEndian.js";

export function convertRequestPixelsForViewportPacketToArray(packet) {
  const view = new DataView(packet);
  return [
    view.getUint8(0),
    view.getInt32(1, littleEndian),
    view.getInt32(1 + 1 * 4, littleEndian),
    view.getInt32(1 + 2 * 4, littleEndian),
    view.getInt32(1 + 3 * 4, littleEndian),
  ];
}
