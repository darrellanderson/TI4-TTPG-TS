import { Card, GameObject, SnapPoint } from "@tabletop-playground/api";
import {
  MockCard,
  MockCardDetails,
  MockGameObject,
  MockSnapPoint,
} from "ttpg-mock";
import { RecycleCardLegendaryPlanet } from "./recycle-card-legendary-planet";

it("recycle", () => {
  const card: Card = new MockCard({
    cardDetails: [
      new MockCardDetails({
        metadata: "card.legendary-planet:my-source/my-name",
        tags: ["card-legendary-planet"],
      }),
    ],
  });
  const mat: GameObject = new MockGameObject({
    position: [10, 0, 0],
    snapPoints: [
      new MockSnapPoint({
        tags: ["deck-legendary-planet", "card-legendary-planet"],
      }),
    ],
  });

  let snapPoint: SnapPoint | undefined;
  let distance: number;

  snapPoint = card.getSnappedToPoint();
  distance = card.getPosition().distance(mat.getPosition());
  expect(snapPoint).toBeUndefined();
  expect(distance).toBeCloseTo(10);

  const recycle = new RecycleCardLegendaryPlanet();
  expect(recycle.canRecycle(card)).toBe(true);
  expect(recycle.recycle(card)).toBe(true);

  snapPoint = card.getSnappedToPoint();
  distance = card.getPosition().distance(mat.getPosition());
  expect(snapPoint).toBeDefined();
  expect(distance).toBeCloseTo(0);
});
