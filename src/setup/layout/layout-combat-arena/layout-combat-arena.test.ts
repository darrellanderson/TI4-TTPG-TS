import { Vector } from "@tabletop-playground/api";
import { LayoutCombatArena } from "./layout-combat-arena";

it("layout", () => {
  const pos: Vector = new Vector(0, 0, 0);
  const yaw: number = 0;
  new LayoutCombatArena().getLayout().doLayoutAtPoint(pos, yaw);
});
