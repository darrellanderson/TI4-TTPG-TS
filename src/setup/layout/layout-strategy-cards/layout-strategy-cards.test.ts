import { Vector } from "@tabletop-playground/api";
import { LayoutStrategyCards } from "./layout-strategy-cards";

import { addObjectTemplatesToMockWorld } from "../../../nsid/nsid-to-template-id.test";
beforeEach(() => {
  addObjectTemplatesToMockWorld();
});

it("constructor", () => {
  const pos: Vector = new Vector(0, 0, 0);
  const yaw: number = 0;
  new LayoutStrategyCards().getLayout().doLayoutAtPoint(pos, yaw);
});
