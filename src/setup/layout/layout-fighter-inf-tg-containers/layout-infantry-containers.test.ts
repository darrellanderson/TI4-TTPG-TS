import { Vector } from "@tabletop-playground/api";
import { LayoutInfantryContainers } from "./layout-infantry-containers";

it("getLayout", () => {
  const pos: Vector = new Vector(0, 0, 0);
  const yaw: number = 0;
  new LayoutInfantryContainers().getLayout().doLayoutAtPoint(pos, yaw);
});
