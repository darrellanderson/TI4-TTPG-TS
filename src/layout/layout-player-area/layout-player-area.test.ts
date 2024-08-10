import { Vector } from "@tabletop-playground/api";
import { LayoutPlayerArea } from "./layout-player-area";

it("layout", () => {
  const pos: Vector = new Vector(0, 0, 0);
  const yaw: number = 0;
  new LayoutPlayerArea(1).getLayout().doLayoutAtPoint(pos, yaw);
});
