import { Card, GameObject, SnapPoint } from "@tabletop-playground/api";
import {
  MockCard,
  MockCardDetails,
  MockGameObject,
  MockSnapPoint,
} from "ttpg-mock";
import { RecycleCardFactionReference } from "./recycle-card-faction-reference";

it("recycle", () => {
  const card: Card = new MockCard({
    cardDetails: [
      new MockCardDetails({
        metadata: "card.faction-reference:my-source/my-name",
        tags: ["card-faction-reference"],
      }),
    ],
  });
  const mat: GameObject = new MockGameObject({
    position: [10, 0, 0],
    snapPoints: [
      new MockSnapPoint({
        tags: ["deck-faction-reference", "card-faction-reference"],
      }),
    ],
  });

  let snapPoint: SnapPoint | undefined;
  let distance: number;

  snapPoint = card.getSnappedToPoint();
  distance = card.getPosition().distance(mat.getPosition());
  expect(snapPoint).toBeUndefined();
  expect(distance).toBeCloseTo(10);

  const recycle = new RecycleCardFactionReference();
  expect(recycle.canRecycle(card)).toBe(true);
  expect(recycle.recycle(card)).toBe(true);

  snapPoint = card.getSnappedToPoint();
  distance = card.getPosition().distance(mat.getPosition());
  expect(snapPoint).toBeDefined();
  expect(distance).toBeCloseTo(0);
});
