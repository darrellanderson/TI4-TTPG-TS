import { GameObject } from "@tabletop-playground/api";
import { GarbageHandler } from "ttpg-darrell";
import { MockGameObject, MockSnapPoint } from "ttpg-mock";

import { RecycleStrategyCard } from "./recycle-strategy-card";

it("recycle", () => {
  const obj: GameObject = MockGameObject.simple(
    "tile.strategy:base/leadership"
  );
  new MockGameObject({
    templateMetadata: "mat:base/strategy",
    snapPoints: [new MockSnapPoint()],
  });

  const recycle: GarbageHandler = new RecycleStrategyCard();
  expect(recycle.canRecycle(obj)).toBe(true);
  expect(recycle.recycle(obj)).toBe(true);
});
