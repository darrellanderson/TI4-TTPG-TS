import { Vector } from "@tabletop-playground/api";
import { LayoutTableContainers } from "./layout-table-containers";

it("constructor", () => {
  const pos: Vector = new Vector(0, 0, 0);
  const yaw: number = 0;
  new LayoutTableContainers().getLayout().doLayoutAtPoint(pos, yaw);
});
