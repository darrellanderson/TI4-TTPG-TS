import { Vector } from "@tabletop-playground/api";
import { LayoutSheets } from "./layout-sheets";

import { addObjectTemplatesToMockWorld } from "../../nsid/nsid-to-template-id.test";
beforeEach(() => {
  addObjectTemplatesToMockWorld();
});

it("getLayout", () => {
  const pos: Vector = new Vector(0, 0, 0);
  const yaw: number = 0;
  new LayoutSheets().getLayout().doLayoutAtPoint(pos, yaw);
});
