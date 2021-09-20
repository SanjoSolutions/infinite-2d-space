import { describe, it } from "@jest/globals";
import { createSendPixelsToServerPacket } from "./client.js";
import { pixelPacketToArray } from "./pixelPacketToArray.js";

describe("pixelPacketToArray", () => {
  it("converts a pixel packet to an array", () => {
    const pixels = [
      { x: 1, y: 2 },
      { x: 3, y: 4 },
    ];
    const pixelPacket = createSendPixelsToServerPacket(pixels);
    const pixelPacketArray = pixelPacketToArray(pixelPacket);
    expect(pixelPacketArray).toEqual([0, 2, 1, 2, 3, 4]);
  });
});
