import { Card, GameObject, SnapPoint } from "@tabletop-playground/api";
import {
  MockCard,
  MockCardDetails,
  MockGameObject,
  MockSnapPoint,
} from "ttpg-mock";
import { RecycleCardObjectiveStage2 } from "./recycle-card-objective-stage-2";

it("recycle", () => {
  const card: Card = new MockCard({
    cardDetails: [
      new MockCardDetails({
        metadata: "card.objective.public-2:my-source/my-name",
        tags: ["card-objective-2"],
      }),
    ],
  });
  const mat: GameObject = new MockGameObject({
    position: [10, 0, 0],
    snapPoints: [
      new MockSnapPoint({
        tags: ["deck-objective-2", "card-objective-2"],
      }),
    ],
  });

  let snapPoint: SnapPoint | undefined;
  let distance: number;

  snapPoint = card.getSnappedToPoint();
  distance = card.getPosition().distance(mat.getPosition());
  expect(snapPoint).toBeUndefined();
  expect(distance).toBeCloseTo(10);

  const recycle = new RecycleCardObjectiveStage2();
  expect(recycle.canRecycle(card)).toBe(true);
  expect(recycle.recycle(card)).toBe(true);

  snapPoint = card.getSnappedToPoint();
  distance = card.getPosition().distance(mat.getPosition());
  expect(snapPoint).toBeDefined();
  expect(distance).toBeCloseTo(0);
});
