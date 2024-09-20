import { Vector } from "@tabletop-playground/api";
import { LayoutAgendaLawsMat } from "./layout-agenda-laws-mat";

import { addObjectTemplatesToMockWorld } from "../../../nsid/nsid-to-template-id.test";

beforeEach(() => {
  addObjectTemplatesToMockWorld();
});

it("constructor", () => {
  const pos: Vector = new Vector(0, 0, 0);
  const yaw: number = 0;
  new LayoutAgendaLawsMat().getLayout().doLayoutAtPoint(pos, yaw);
});
