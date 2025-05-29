import { Vector } from "@tabletop-playground/api";
import { MockGameObject, MockSnapPoint } from "ttpg-mock";
import { LayoutTableDecks } from "./layout-table-decks";

export function setupTestTableDeckSnapPoints() {
  new MockGameObject({
    snapPoints: [
      new MockSnapPoint({
        tags: [
          "deck-action",
          "deck-agenda",
          "deck-objective-secret",
          "deck-planet",
          "deck-legendary-planet",
          "deck-faction-reference",
          "deck-exploration-cultural",
          "deck-exploration-industrial",
          "deck-exploration-hazardous",
          "deck-exploration-frontier",
          "deck-event",
          "deck-relic",
        ],
      }),
    ],
  });
}

it("constructor", () => {
  const pos: Vector = new Vector(0, 0, 0);
  const yaw: number = 0;

  expect(() => {
    new LayoutTableDecks().getLayout().doLayoutAtPoint(pos, yaw);
  }).toThrow();

  setupTestTableDeckSnapPoints();

  new LayoutTableDecks().getLayout().doLayoutAtPoint(pos, yaw);
});
