import { Vector } from "@tabletop-playground/api";
import { LayoutQuickRoller } from "./layout-quick-roller";

it("constructor", () => {
  const pos: Vector = new Vector(0, 0, 0);
  const yaw: number = 0;
  new LayoutQuickRoller().getLayout().doLayoutAtPoint(pos, yaw);
});
