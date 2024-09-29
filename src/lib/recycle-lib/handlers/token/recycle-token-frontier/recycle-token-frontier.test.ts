import { GameObject } from "@tabletop-playground/api";
import { GarbageHandler } from "ttpg-darrell";
import { MockGameObject } from "ttpg-mock";
import { RecycleTokenFrontier } from "./recycle-token-frontier";

it("recycle", () => {
  const obj: GameObject = MockGameObject.simple(
    "token.attachment.system:pok/frontier",
  );

  const recycle: GarbageHandler = new RecycleTokenFrontier();
  expect(obj.isValid()).toBe(true);

  expect(recycle.canRecycle(obj)).toBe(true);
  expect(recycle.recycle(obj)).toBe(true);

  expect(obj.isValid()).toBe(false);
});
