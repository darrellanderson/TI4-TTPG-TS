import { Vector } from "@tabletop-playground/api";
import { LayoutFighterContainers } from "./layout-fighter-containers";

it("getLayout", () => {
  const pos: Vector = new Vector(0, 0, 0);
  const yaw: number = 0;
  new LayoutFighterContainers().getLayout().doLayoutAtPoint(pos, yaw);
});
