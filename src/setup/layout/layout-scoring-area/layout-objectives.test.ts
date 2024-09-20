import { Vector } from "@tabletop-playground/api";
import { LayoutObjectives } from "./layout-objectives";

import { addObjectTemplatesToMockWorld } from "../../../nsid/nsid-to-template-id.test";
beforeEach(() => {
  addObjectTemplatesToMockWorld();
});

it("constructor", () => {
  const pos: Vector = new Vector(0, 0, 0);
  const yaw: number = 0;
  new LayoutObjectives().getLayout().doLayoutAtPoint(pos, yaw);
});

it("getScoreboard", () => {
  new LayoutObjectives().getScoreboard();
});
