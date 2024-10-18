import { Vector } from "@tabletop-playground/api";
import { LayoutUnitBoxes } from "./layout-unit-boxes";

it("getLayout", () => {
  const pos: Vector = new Vector(0, 0, 0);
  const yaw: number = 0;
  new LayoutUnitBoxes(1).getLayout().doLayoutAtPoint(pos, yaw);
});
