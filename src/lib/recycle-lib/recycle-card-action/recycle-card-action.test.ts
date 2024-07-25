import { MockCard, MockGameObject, MockSnapPoint } from "ttpg-mock";
import { RecycleCardAction } from "./recycle-card-action";

it("recycle", () => {
  const card = MockCard.simple("card.action:my-source/my-name");
  const discardSnapPoint = new MockSnapPoint({ tags: ["discard-action"] });
  new MockGameObject({
    snapPoints: [discardSnapPoint],
  });

  expect(card.getSnappedToPoint()).toBeUndefined();

  const recycle = new RecycleCardAction();
  expect(recycle.canRecycle(card)).toBe(true);
  expect(recycle.recycle(card)).toBe(true);

  expect(card.getSnappedToPoint()).toEqual(discardSnapPoint);
});
