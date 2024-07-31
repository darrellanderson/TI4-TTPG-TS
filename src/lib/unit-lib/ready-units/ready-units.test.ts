import { GameObject } from "@tabletop-playground/api";
import { Facing } from "ttpg-darrell";
import { MockGameObject } from "ttpg-mock";
import { ReadyUnits } from "./ready-units";

it("readyAllUnits", () => {
  const faceUp: GameObject = new MockGameObject({
    templateMetadata: "unit:base/dreadnought",
  });
  const faceDown: GameObject = new MockGameObject({
    templateMetadata: "unit:base/dreadnought",
    rotation: [0, 0, 180],
  });

  expect(Facing.isFaceUp(faceUp)).toBe(true);
  expect(Facing.isFaceUp(faceDown)).toBe(false);

  new ReadyUnits().readyAllUnits();

  expect(Facing.isFaceUp(faceUp)).toBe(true);
  expect(Facing.isFaceUp(faceDown)).toBe(true);
});
