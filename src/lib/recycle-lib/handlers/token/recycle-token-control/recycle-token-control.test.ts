import { MockGameObject } from "ttpg-mock";
import { RecycleTokenControl } from "./recycle-token-control";
import { GameObject } from "@tabletop-playground/api";
import { GarbageHandler } from "ttpg-darrell";

it("recycle", () => {
  const token: GameObject = new MockGameObject({
    id: "my-token-id",
    templateMetadata: "token.control:base/sol",
    owningPlayerSlot: 1,
  });

  const recycle: GarbageHandler = new RecycleTokenControl();
  expect(recycle.canRecycle(token, undefined)).toBe(true);
  expect(recycle.recycle(token, undefined)).toBe(true);
});
