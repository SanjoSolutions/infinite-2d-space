import { describe, it } from "@jest/globals";
import { createRequestPixelsForViewportPacket } from "./client.js";
import { convertRequestPixelsForViewportPacketToArray } from "./convertRequestPixelsForViewportPacketToArray.js";
import { convertViewportToArray } from "./convertViewportToArray.js";
import { createViewportFixture } from "./fixtures/createViewportFixture.js";

describe("createRequestPixelsForViewportPacket", () => {
  it("creates a packet for requesting pixels for a viewport", () => {
    const viewport = createViewportFixture();
    const packet = createRequestPixelsForViewportPacket(viewport);
    expect(convertRequestPixelsForViewportPacketToArray(packet)).toEqual(
      [1, convertViewportToArray(viewport)].flat()
    );
  });
});
