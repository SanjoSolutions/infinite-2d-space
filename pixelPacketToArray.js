import { littleEndian } from "./littleEndian.js";

export function pixelPacketToArray(pixelPacket) {
  const view = new DataView(pixelPacket);
  return [view.getUint8(0), view.getUint32(1, littleEndian)].concat(
    Array.from(new Int32Array(pixelPacket.slice(5)))
  );
}
