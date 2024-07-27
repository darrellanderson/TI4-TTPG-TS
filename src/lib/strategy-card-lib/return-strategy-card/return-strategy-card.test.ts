import { GameObject } from "@tabletop-playground/api";
import { ReturnStrategyCard } from "./return-strategy-card";
import { MockGameObject, MockSnapPoint } from "ttpg-mock";

it("consttructor", () => {
  new ReturnStrategyCard();
});

it("returnStrategyCard", () => {
  const obj: GameObject = MockGameObject.simple(
    "tile.strategy:base/leadership"
  );
  new MockGameObject({
    templateMetadata: "mat:base/strategy",
    snapPoints: [new MockSnapPoint()],
  });

  const returnStrategyCard = new ReturnStrategyCard();
  expect(returnStrategyCard.returnStrategyCard(obj)).toBe(true);
});
