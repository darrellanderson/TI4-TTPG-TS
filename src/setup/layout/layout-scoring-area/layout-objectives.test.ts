import { Vector } from "@tabletop-playground/api";
import { LayoutObjectives } from "./layout-objectives";

import { addObjectTemplatesToMockWorld } from "../../../nsid/nsid-to-template-id.test";
import { MockGameObject, MockSnapPoint } from "ttpg-mock";
beforeEach(() => {
  addObjectTemplatesToMockWorld();
});

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
