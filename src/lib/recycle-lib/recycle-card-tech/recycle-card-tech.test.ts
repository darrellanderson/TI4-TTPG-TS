import { Card, GameObject, SnapPoint } from "@tabletop-playground/api";
import { Find, GarbageHandler } from "ttpg-darrell";
import {
  MockCard,
  MockCardDetails,
  MockGameObject,
  MockSnapPoint,
} from "ttpg-mock";
import { RecycleCardTech } from "./recycle-card-tech";

it("recycle", () => {
  const techDeck: Card = new MockCard({ cardDetails: [new MockCardDetails()] });
  expect(techDeck.getStackSize()).toBe(1);

  const snapPointTag: string = "deck-tech";
  const playerSlot: number = 1;
  const snapPoint: SnapPoint = new MockSnapPoint({
    tags: [snapPointTag],
    snappedObject: techDeck,
  });
  const _mat: GameObject = new MockGameObject({
    owningPlayerSlot: playerSlot,
    snapPoints: [snapPoint],
  });
  expect(new Find().findSnapPointByTag(snapPointTag, playerSlot)).toBeDefined();

  const card: Card = new MockCard({
    cardDetails: [
      new MockCardDetails({
        metadata: "card.technology.red:my-source/my-name",
      }),
    ],
    owningPlayerSlot: playerSlot,
  });

  const recycle: GarbageHandler = new RecycleCardTech();
  expect(recycle.canRecycle(card)).toBe(true);
  expect(recycle.recycle(card)).toBe(true);
});

it("recycle (not a card)", () => {
  const recycle: GarbageHandler = new RecycleCardTech();
  expect(recycle.canRecycle(new MockGameObject())).toBe(false);
  expect(recycle.recycle(new MockGameObject())).toBe(false);
});
