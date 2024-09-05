import { Vector } from "@tabletop-playground/api";
import { LayoutPlayerArea } from "./layout-player-area";

import { addObjectTemplatesToMockWorld } from "../../nsid/nsid-to-template-id.test";
beforeEach(() => {
  addObjectTemplatesToMockWorld();
});

it("layout", () => {
  const pos: Vector = new Vector(0, 0, 0);
  const yaw: number = 0;
  new LayoutPlayerArea(1).getLayout().doLayoutAtPoint(pos, yaw);
});
