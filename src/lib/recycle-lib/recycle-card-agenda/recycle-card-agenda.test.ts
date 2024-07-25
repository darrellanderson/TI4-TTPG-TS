import { SnapPoint, StaticObject } from "@tabletop-playground/api";
import { MockCard, MockGameObject, MockSnapPoint } from "ttpg-mock";
import { RecycleCardAgenda } from "./recycle-card-agenda";

it("recycle", () => {
  const card = MockCard.simple("card.agenda:my-source/my-name");
  new MockGameObject({
    id: "discard-mat",
    snapPoints: [new MockSnapPoint({ tags: ["discard-agenda"] })],
  });

  expect(card.getSnappedToPoint()).toBeUndefined();

  const recycle = new RecycleCardAgenda();
  expect(recycle.canRecycle(card)).toBe(true);
  expect(recycle.recycle(card)).toBe(true);

  const snapPoint: SnapPoint | undefined = card.getSnappedToPoint();
  expect(snapPoint).toBeDefined();

  const mat: StaticObject | undefined = snapPoint?.getParentObject();
  expect(mat).toBeDefined();

  expect(mat?.getId()).toEqual("discard-mat");
});
