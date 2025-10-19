import { Container, GameObject } from "@tabletop-playground/api";
import { GarbageHandler } from "ttpg-darrell";
import { MockContainer, MockGameObject } from "ttpg-mock";
import { RecycleFactionExtra } from "./recycle-faction-extra";

it("recycle", () => {
  const token: GameObject = new MockGameObject({
    id: "my-token-id",
    templateMetadata: "token.attachment.system:thunders-edge/crimson-sever",
    owningPlayerSlot: 1,
  });
  const container: Container = new MockContainer({
    templateMetadata: "container:base/faction-extras",
    owningPlayerSlot: 1,
  });

  const recycle: GarbageHandler = new RecycleFactionExtra();
  expect(recycle.canRecycle(token, undefined)).toBe(true);
  expect(recycle.recycle(token, undefined)).toBe(true);
  expect(container.getItems().map((x) => x.getId())).toEqual(["my-token-id"]);
});

it("recycle (container owner mismatch)", () => {
  const token: GameObject = new MockGameObject({
    id: "my-token-id",
    templateMetadata: "token.attachment.system:thunders-edge/crimson-sever",
    owningPlayerSlot: 1,
  });
  const container: Container = new MockContainer({
    templateMetadata: "container:base/faction-extras",
    owningPlayerSlot: 2,
  });

  const recycle: GarbageHandler = new RecycleFactionExtra();
  expect(recycle.canRecycle(token, undefined)).toBe(true);
  expect(recycle.recycle(token, undefined)).toBe(false);
  expect(container.getItems().map((x) => x.getId())).toEqual([]);
});
