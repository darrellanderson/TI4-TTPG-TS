import { Vector } from "@tabletop-playground/api";
import { LayoutSystemContainer } from "./layout-system-container";

it("getLayout", () => {
  const pos: Vector = new Vector(0, 0, 0);
  const yaw: number = 0;
  new LayoutSystemContainer().getLayout().doLayoutAtPoint(pos, yaw);
});
