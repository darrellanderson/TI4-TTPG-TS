import { Vector } from "@tabletop-playground/api";
import { LayoutExplorationContainer } from "./layout-exploration-container";

it("getLayout", () => {
  const pos: Vector = new Vector(0, 0, 0);
  const yaw: number = 0;
  new LayoutExplorationContainer().getLayout().doLayoutAtPoint(pos, yaw);
});
