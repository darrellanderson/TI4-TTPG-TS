import { Vector } from "@tabletop-playground/api";
import { LayoutAll } from "./layout-all";

import { setupTestTableDeckSnapPoints } from "../layout-table-decks/layout-table-decks.test";
import { setupTestObjectivesSnapPoints } from "../layout-scoring-area/layout-objectives.test";

it("constructor", () => {
  setupTestObjectivesSnapPoints();
  setupTestTableDeckSnapPoints();

  const pos: Vector = new Vector(0, 0, 0);
  const yaw: number = 0;
  new LayoutAll(6).getLayout().doLayoutAtPoint(pos, yaw);
});

it("constructor (7p)", () => {
  setupTestObjectivesSnapPoints();
  setupTestTableDeckSnapPoints();

  const pos: Vector = new Vector(0, 0, 0);
  const yaw: number = 0;
  new LayoutAll(7).getLayout().doLayoutAtPoint(pos, yaw);
});
