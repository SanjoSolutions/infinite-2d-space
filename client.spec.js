import { describe, it } from "@jest/globals";
import { createSendPixelsToServerPacket } from "./client.js";
import { littleEndian } from "./littleEndian.js";
import { pixelPacketToArray } from "./pixelPacketToArray.js";
import { pixelPacketEquals } from "./pixelsPacketEquals.js";

describe("client", () => {
  describe("createSendPixelsToServerPacket", () => {
    it("creates a packet for sending pixels to the server", () => {
      const pixels = [
        { x: 1, y: 2 },
        { x: 3, y: 4 },
      ];
      const packet = createSendPixelsToServerPacket(pixels);
      const expectedPacket = new ArrayBuffer(21);
      const expectedPacketView = new DataView(expectedPacket);
      expectedPacketView.setUint8(0, 0);
      expectedPacketView.setUint32(1, pixels.length, littleEndian);
      expectedPacketView.setInt32(5, 1, littleEndian);
      expectedPacketView.setInt32(9, 2, littleEndian);
      expectedPacketView.setInt32(13, 3, littleEndian);
      expectedPacketView.setInt32(17, 4, littleEndian);
      expect(pixelPacketToArray(packet)).toEqual(
        pixelPacketToArray(expectedPacket)
      );
    });
  });
});
