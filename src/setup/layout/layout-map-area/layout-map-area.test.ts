import { Vector } from "@tabletop-playground/api";
import { LayoutMapArea } from "./layout-map-area";

import { addObjectTemplatesToMockWorld } from "../../../nsid/nsid-to-template-id.test";
beforeEach(() => {
  addObjectTemplatesToMockWorld();
});

it("constructor", () => {
  const pos: Vector = new Vector(0, 0, 0);
  const yaw: number = 0;
  new LayoutMapArea(3).getLayout().doLayoutAtPoint(pos, yaw);
});
