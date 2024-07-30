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

it("returnOneStrategyCard", () => {
  const strategyCard: GameObject = MockGameObject.simple(
    "tile.strategy:base/leadership"
  );
  new MockGameObject({
    templateMetadata: "mat:base/strategy",
    position: [10, 0, 0],
    snapPoints: [new MockSnapPoint()],
  });
  const returnStrategyCard = new ReturnStrategyCard();
  expect(returnStrategyCard.returnOneStrategyCard(strategyCard)).toBe(true);
  expect(strategyCard.getPosition().toString()).toBe("(X=10,Y=0,Z=0)");
});

it("returnOneStrategyCard (missing mat)", () => {
  const strategyCard: GameObject = MockGameObject.simple(
    "tile.strategy:base/leadership"
  );
  const returnStrategyCard = new ReturnStrategyCard();
  expect(returnStrategyCard.returnOneStrategyCard(strategyCard)).toBe(false);
});

it("returnOneStrategyCard (mat, but no snap points)", () => {
  const strategyCard: GameObject = MockGameObject.simple(
    "tile.strategy:base/leadership"
  );
  new MockGameObject({
    templateMetadata: "mat:base/strategy",
    position: [10, 0, 0],
  });
  const returnStrategyCard = new ReturnStrategyCard();
  expect(returnStrategyCard.returnOneStrategyCard(strategyCard)).toBe(false);
});

it("returnOneStrategyCard (not a strategy card)", () => {
  const obj: GameObject = MockGameObject.simple("other:base/other");
  const returnStrategyCard = new ReturnStrategyCard();
  expect(returnStrategyCard.returnOneStrategyCard(obj)).toBe(false);
});

it("returnOneStrategyCard (invalid nsid)", () => {
  const obj: GameObject = MockGameObject.simple("tile.strategy:@@invalid");
  const returnStrategyCard = new ReturnStrategyCard();
  expect(returnStrategyCard.returnOneStrategyCard(obj)).toBe(false);
});

it("returnOneStrategyCard (unknown name)", () => {
  const obj: GameObject = MockGameObject.simple(
    "tile.strategy:base/__unknown__"
  );
  const returnStrategyCard = new ReturnStrategyCard();
  expect(returnStrategyCard.returnOneStrategyCard(obj)).toBe(false);
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
