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

it("recycle (not a strategy card)", () => {
  const obj: GameObject = MockGameObject.simple("other:base/other");
  const recycle: GarbageHandler = new RecycleStrategyCard();
  expect(recycle.canRecycle(obj)).toBe(false);
  expect(recycle.recycle(obj)).toBe(false);
});

it("recycle (invalid nsid)", () => {
  const obj: GameObject = MockGameObject.simple("tile.strategy:");
  const recycle: GarbageHandler = new RecycleStrategyCard();
  expect(recycle.canRecycle(obj)).toBe(true);
  expect(recycle.recycle(obj)).toBe(false);
});

it("recycle (unknown card)", () => {
  const obj: GameObject = MockGameObject.simple(
    "tile.strategy:base/__unknown__"
  );
  new MockGameObject({
    templateMetadata: "mat:base/strategy",
    snapPoints: [new MockSnapPoint()],
  });
  const recycle: GarbageHandler = new RecycleStrategyCard();
  expect(recycle.canRecycle(obj)).toBe(true);
  expect(recycle.recycle(obj)).toBe(false);
});

it("recycle (missing mat)", () => {
  const obj: GameObject = MockGameObject.simple(
    "tile.strategy:base/leadership"
  );
  const recycle: GarbageHandler = new RecycleStrategyCard();
  expect(recycle.canRecycle(obj)).toBe(true);
  expect(recycle.recycle(obj)).toBe(false);
});

it("recycle (missing snap point)", () => {
  const obj: GameObject = MockGameObject.simple(
    "tile.strategy:base/leadership"
  );
  new MockGameObject({
    templateMetadata: "mat:base/strategy",
  });
  const recycle: GarbageHandler = new RecycleStrategyCard();
  expect(recycle.canRecycle(obj)).toBe(true);
  expect(recycle.recycle(obj)).toBe(false);
});
