import { GameObject } from "@tabletop-playground/api";
import { ReadyLib } from "./ready-lib";
import { MockGameObject } from "ttpg-mock";
import { Facing } from "ttpg-darrell";

it("constructor", () => {
  new ReadyLib();
});

it("ready units", () => {
  const faceUp: GameObject = new MockGameObject({
    templateMetadata: "unit:base/dreadnought",
  });
  const faceDown: GameObject = new MockGameObject({
    templateMetadata: "unit:base/dreadnought",
    rotation: [0, 0, 180],
  });

  expect(Facing.isFaceUp(faceUp)).toBe(true);
  expect(Facing.isFaceUp(faceDown)).toBe(false);

  new ReadyLib().readyAll();

  expect(Facing.isFaceUp(faceUp)).toBe(true);
  expect(Facing.isFaceUp(faceDown)).toBe(true);
});
