import { Vector } from "@tabletop-playground/api";
import { MockGameObject, MockSnapPoint } from "ttpg-mock";

import { LayoutObjectives } from "./layout-objectives";

export function setupTestObjectivesSnapPoints() {
  new MockGameObject({
    snapPoints: [
      new MockSnapPoint({
        tags: ["deck-objective-1", "deck-objective-2"],
      }),
    ],
  });
}

it("constructor", () => {
  setupTestObjectivesSnapPoints();

  const pos: Vector = new Vector(0, 0, 0);
  const yaw: number = 0;
  new LayoutObjectives().getLayout().doLayoutAtPoint(pos, yaw);
});

it("getScoreboard", () => {
  new LayoutObjectives().getScoreboard();
});
