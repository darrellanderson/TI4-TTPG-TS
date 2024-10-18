import { Vector } from "@tabletop-playground/api";
import { LayoutFighterInfTgContainers } from "./layout-fighter-inf-tg-containers";

it("getLayout", () => {
  const pos: Vector = new Vector(0, 0, 0);
  const yaw: number = 0;
  new LayoutFighterInfTgContainers().getLayout().doLayoutAtPoint(pos, yaw);
});
