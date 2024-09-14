import { Vector } from "@tabletop-playground/api";
import { LayoutExplorationContainer } from "./layout-exploration-container";

import { addObjectTemplatesToMockWorld } from "../../../nsid/nsid-to-template-id.test";
beforeEach(() => {
  addObjectTemplatesToMockWorld();
});

it("getLayout", () => {
  const pos: Vector = new Vector(0, 0, 0);
  const yaw: number = 0;
  new LayoutExplorationContainer().getLayout().doLayoutAtPoint(pos, yaw);
});
