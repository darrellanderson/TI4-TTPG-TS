import { GameObject } from "@tabletop-playground/api";
import { ReturnStrategyCard } from "./return-strategy-card";
import {
  MockCard,
  MockCardHolder,
  MockGameObject,
  MockSnapPoint,
} from "ttpg-mock";

it("consttructor", () => {
  new ReturnStrategyCard();
});

it("returnAllStrategyCardsRespecingPoliticalStability (without political stability)", () => {
  const strategyCard: GameObject = MockGameObject.simple(
    "tile.strategy:base/leadership",
    { position: [-10, 0, 0] }
  );
  new MockGameObject({
    templateMetadata: "mat:base/strategy",
    position: [10, 0, 0],
    snapPoints: [new MockSnapPoint()],
  });

  new MockCardHolder({ position: [-10, 0, 0], owningPlayerSlot: 1 });

  const returnStrategyCard = new ReturnStrategyCard();
  returnStrategyCard.returnAllStrategyCardsRespecingPoliticalStability();
  expect(strategyCard.getPosition().toString()).toBe("(X=10,Y=0,Z=0)");
});

it("returnAllStrategyCardsRespecingPoliticalStability (with political stability)", () => {
  const strategyCard: GameObject = MockGameObject.simple(
    "tile.strategy:base/leadership",
    { position: [-10, 0, 0] }
  );
  new MockGameObject({
    templateMetadata: "mat:base/strategy",
    position: [10, 0, 0],
    snapPoints: [new MockSnapPoint()],
  });

  new MockCardHolder({ position: [-10, 0, 0], owningPlayerSlot: 1 });
  MockCard.simple("card.action:base/political-stability", {
    position: [-10, 0, 0],
  });

  const returnStrategyCard = new ReturnStrategyCard();
  returnStrategyCard.returnAllStrategyCardsRespecingPoliticalStability();
  expect(strategyCard.getPosition().toString()).toBe("(X=-10,Y=0,Z=0)");
});
