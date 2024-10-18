import { Vector } from "@tabletop-playground/api";
import { LayoutAgendaLawsMat } from "./layout-agenda-laws-mat";

it("constructor", () => {
  const pos: Vector = new Vector(0, 0, 0);
  const yaw: number = 0;
  new LayoutAgendaLawsMat().getLayout().doLayoutAtPoint(pos, yaw);
});
