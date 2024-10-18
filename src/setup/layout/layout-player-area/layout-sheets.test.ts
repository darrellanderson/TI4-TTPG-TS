import { Vector } from "@tabletop-playground/api";
import { LayoutSheets } from "./layout-sheets";

it("getLayout", () => {
  const pos: Vector = new Vector(0, 0, 0);
  const yaw: number = 0;
  new LayoutSheets(1).getLayout().doLayoutAtPoint(pos, yaw);
});
