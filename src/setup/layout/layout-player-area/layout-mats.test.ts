import { LayoutMats } from "./layout-mats";
import { Vector } from "@tabletop-playground/api";

import { addObjectTemplatesToMockWorld } from "../../../nsid/nsid-to-template-id.test";
import { MockSnapPoint } from "ttpg-mock";
beforeEach(() => {
  addObjectTemplatesToMockWorld();
});

it("getLayout", () => {
  const pos: Vector = new Vector(0, 0, 0);
  const yaw: number = 0;
  new LayoutMats(1).getLayout().doLayoutAtPoint(pos, yaw);
});

it("_spawnTechDeck", () => {
  const snapPoint = new MockSnapPoint();
  new LayoutMats(1)._spawnTechDeck(snapPoint);
});

it("missing owner", () => {
  expect(() => new LayoutMats(-1)).toThrow();
});
