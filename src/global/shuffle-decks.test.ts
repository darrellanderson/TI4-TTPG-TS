import { Card, GameObject, SnapPoint } from "@tabletop-playground/api";
import { MockCard, MockGameObject, MockSnapPoint } from "ttpg-mock";
import { ShuffleDecks } from "./shuffle-decks";

it("shuffle", () => {
  const deck: Card = MockCard.simple("card.action:my-source/my-name");
  const snapPoint: SnapPoint = new MockSnapPoint({
    tags: ["deck-action"],
    snappedObject: deck,
  });
  const mat: GameObject = new MockGameObject({ snapPoints: [snapPoint] });
  expect(mat).toBeDefined();

  new ShuffleDecks().init();
});
