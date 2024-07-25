import { SnapPoint, StaticObject } from "@tabletop-playground/api";
import { MockCard, MockGameObject, MockSnapPoint } from "ttpg-mock";
import { RecycleCardAction } from "./recycle-card-action";

it("recycle", () => {
  const card = MockCard.simple("card.action:my-source/my-name");
  new MockGameObject({
    id: "discard-mat",
    snapPoints: [new MockSnapPoint({ tags: ["discard-action"] })],
  });

  expect(card.getSnappedToPoint()).toBeUndefined();

  const recycle = new RecycleCardAction();
  expect(recycle.canRecycle(card)).toBe(true);
  expect(recycle.recycle(card)).toBe(true);

  const snapPoint: SnapPoint | undefined = card.getSnappedToPoint();
  expect(snapPoint).toBeDefined();

  const mat: StaticObject | undefined = snapPoint?.getParentObject();
  expect(mat).toBeDefined();

  expect(mat?.getId()).toEqual("discard-mat");
});
