import { Vector } from "@tabletop-playground/api";
import { LayoutScoringArea } from "./layout-scoring-area";

import { setupTestObjectivesSnapPoints } from "./layout-objectives.test";

it("constructor", () => {
  setupTestObjectivesSnapPoints();

  const pos: Vector = new Vector(0, 0, 0);
  const yaw: number = 0;
  new LayoutScoringArea(4).getLayout().doLayoutAtPoint(pos, yaw);
});
