import { Vector } from "@tabletop-playground/api";
import { LayoutCombatArena } from "./layout-combat-arena";

import { addObjectTemplatesToMockWorld } from "../../../nsid/nsid-to-template-id.test";
beforeEach(() => {
  addObjectTemplatesToMockWorld();
});

it("layout", () => {
  const pos: Vector = new Vector(0, 0, 0);
  const yaw: number = 0;
  new LayoutCombatArena().getLayout().doLayoutAtPoint(pos, yaw);
});
