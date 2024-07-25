import { MockCard, MockGameObject, MockSnapPoint } from "ttpg-mock";
import { RecycleCardAgenda } from "./recycle-card-agenda";

it("recycle", () => {
  const card = MockCard.simple("card.agenda:my-source/my-name");
  const discardSnapPoint = new MockSnapPoint({ tags: ["discard-agenda"] });
  new MockGameObject({
    snapPoints: [discardSnapPoint],
  });

  expect(card.getSnappedToPoint()).toBeUndefined();

  const recycle = new RecycleCardAgenda();
  expect(recycle.canRecycle(card)).toBe(true);
  expect(recycle.recycle(card)).toBe(true);

  expect(card.getSnappedToPoint()).toEqual(discardSnapPoint);
});
