import { GameObject } from "@tabletop-playground/api";
import { MockGameObject } from "ttpg-mock";
import { GlowingToken } from "./glowing-token";

it("constructor", () => {
  const token: GameObject = new MockGameObject();
  new GlowingToken(token);
  new GlowingToken(token); // again, removes old line
});
