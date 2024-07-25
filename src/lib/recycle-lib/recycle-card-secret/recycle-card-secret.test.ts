import { MockCard, MockGameObject, MockSnapPoint } from "ttpg-mock";
import { RecycleCardAction } from "./recycle-card-secret";

it("recycle", () => {
  const card = MockCard.simple("card.secret:my-source/my-name");
  const discardSnapPoint = new MockSnapPoint({ tags: ["discard-secret"] });
  new MockGameObject({
    snapPoints: [discardSnapPoint],
  });

  expect(card.getSnappedToPoint()).toBeUndefined();

  const recycle = new RecycleCardAction();
  expect(recycle.canRecycle(card)).toBe(true);
  expect(recycle.recycle(card)).toBe(true);

  expect(card.getSnappedToPoint()).toEqual(discardSnapPoint);
});
