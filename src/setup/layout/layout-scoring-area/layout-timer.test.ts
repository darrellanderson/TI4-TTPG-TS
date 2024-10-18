import { Vector } from "@tabletop-playground/api";
import { LayoutTimer } from "./layout-timer";

it("constructor", () => {
  const pos: Vector = new Vector(0, 0, 0);
  const yaw: number = 0;
  new LayoutTimer().getLayout().doLayoutAtPoint(pos, yaw);
});
