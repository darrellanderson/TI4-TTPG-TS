import { Card, GameObject, SnapPoint } from "@tabletop-playground/api";
import {
  MockCard,
  MockCardDetails,
  MockGameObject,
  MockSnapPoint,
} from "ttpg-mock";
import { RecycleCardAction } from "./recycle-card-action";

it("recycle", () => {
  const card: Card = new MockCard({
    cardDetails: [
      new MockCardDetails({
        metadata: "card.action:my-source/my-name",
        tags: ["card-action"],
      }),
    ],
  });
  const mat: GameObject = new MockGameObject({
    position: [10, 0, 0],
    snapPoints: [
      new MockSnapPoint({ tags: ["discard-action", "card-action"] }),
    ],
  });

  let snapPoint: SnapPoint | undefined;
  let distance: number;

  snapPoint = card.getSnappedToPoint();
  distance = card.getPosition().distance(mat.getPosition());
  expect(snapPoint).toBeUndefined();
  expect(distance).toBeCloseTo(10);

  const recycle = new RecycleCardAction();
  expect(recycle.canRecycle(card)).toBe(true);
  expect(recycle.recycle(card)).toBe(true);

  snapPoint = card.getSnappedToPoint();
  distance = card.getPosition().distance(mat.getPosition());
  expect(snapPoint).toBeDefined();
  expect(distance).toBeCloseTo(0);
});
