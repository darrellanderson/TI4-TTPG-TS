import { Vector } from "@tabletop-playground/api";
import { LayoutTokenContainers } from "./layout-token-containers";

it("layout", () => {
  const pos: Vector = new Vector(0, 0, 0);
  const yaw: number = 0;
  new LayoutTokenContainers(1).getLayout().doLayoutAtPoint(pos, yaw);
});
