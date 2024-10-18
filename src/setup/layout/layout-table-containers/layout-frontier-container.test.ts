import { Vector } from "@tabletop-playground/api";
import { LayoutFrontierContainer } from "./layout-frontier-container";

it("getLayout", () => {
  const pos: Vector = new Vector(0, 0, 0);
  const yaw: number = 0;
  new LayoutFrontierContainer().getLayout().doLayoutAtPoint(pos, yaw);
});
