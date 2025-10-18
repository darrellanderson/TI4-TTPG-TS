import { Card, GameObject, SnapPoint, Vector } from "@tabletop-playground/api";
import {
  MockCard,
  MockCardDetails,
  MockCardHolder,
  MockGameObject,
  MockSnapPoint,
} from "ttpg-mock";
import { RecycleCardAction } from "./recycle-card-action";
import { Find, PlayerSlot } from "ttpg-darrell";

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
  expect(recycle.canRecycle(card, undefined)).toBe(true);
  expect(recycle.recycle(card, undefined)).toBe(true);

  snapPoint = card.getSnappedToPoint();
  distance = card.getPosition().distance(mat.getPosition());
  expect(snapPoint).toBeDefined();
  expect(distance).toBeCloseTo(0);
});

it("_getExistingActionCard", () => {
  const recycle = new RecycleCardAction();
  const actionCard: Card = MockCard.simple("card.action:my-source/my-name");
  const pos: Vector = actionCard.getPosition();
  expect(recycle._getExistingActionCard(pos)).toBe(actionCard);
});

it("_isActionPhase", () => {
  const recycle = new RecycleCardAction();
  expect(recycle._isActionPhase()).toBe(false);

  let pos: Vector = new Vector(0, 0, 0);
  let playerSlot: number = 10;

  const add = (nsidName: string): void => {
    MockGameObject.simple(`tile.strategy-card:base/${nsidName}`, {
      position: pos,
    });
    new MockCardHolder({
      templateMetadata: "card-holder:base/player-hand",
      owningPlayerSlot: playerSlot,
      position: pos,
    });
    pos = pos.add(new Vector(10, 0, 0));
    playerSlot += 1;
  };

  add("leadership");
  add("diplomacy");
  add("politics");
  add("construction");
  add("trade");
  add("warfare");

  expect(recycle._isActionPhase()).toBe(true);
});

it("recycle (data skimmer)", () => {
  const recycle = new RecycleCardAction();
  const skimmerPos: Vector = new Vector(10, 0, 0);
  MockCard.simple("card.breakthrough:thunders-edge/data-skimmer", {
    position: skimmerPos,
  });
  process.flushTicks(); // necessary for OnCardBecameSingletonOrDeck handler to run
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 1,
    position: skimmerPos,
  });

  const owner: PlayerSlot = new Find().closestOwnedCardHolderOwner(skimmerPos);
  expect(owner).toBe(1);

  let card: Card;
  let success: boolean;

  card = MockCard.simple("card.action:my-source/my-name");
  success = recycle.recycle(card, undefined);
  expect(success).toBe(false);

  let pos: Vector = new Vector(0, 0, 0);
  let playerSlot: number = 10;

  const add = (nsidName: string): void => {
    MockGameObject.simple(`tile.strategy-card:base/${nsidName}`, {
      position: pos,
    });
    new MockCardHolder({
      templateMetadata: "card-holder:base/player-hand",
      owningPlayerSlot: playerSlot,
      position: pos,
    });
    pos = pos.add(new Vector(10, 0, 0));
    playerSlot += 1;
  };

  add("leadership");
  add("diplomacy");
  add("politics");
  add("construction");
  add("trade");
  add("warfare");

  card = MockCard.simple("card.action:my-source/my-name");
  success = recycle.recycle(card, undefined);
  expect(success).toBe(true);
});
