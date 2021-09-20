import { describe, it } from "@jest/globals";
import { PacketType } from '../PacketType.js'
import { createRequestPixelsForViewportPacket } from "./Client.js";
import { convertRequestPixelsForViewportPacketToArray } from "./convertRequestPixelsForViewportPacketToArray.js";
import { convertViewportToArray } from "../../convertViewportToArray.js";
import { createViewportFixture } from "../../../fixtures/createViewportFixture.js";

describe("createRequestPixelsForViewportPacket", () => {
  it("creates a packet for requesting pixels for a viewport", () => {
    const viewport = createViewportFixture();
    const packet = createRequestPixelsForViewportPacket(viewport);
    expect(convertRequestPixelsForViewportPacketToArray(packet)).toEqual(
      [PacketType.RequestPixelsForViewportFromServer, convertViewportToArray(viewport)].flat()
    );
  });
});
