import { GameObject, world } from "@tabletop-playground/api";
import { MockGameObject } from "ttpg-mock";
import { NSID } from "ttpg-darrell";
import { PlaceTgsUnpicked } from "./place-tgs-unpicked";

it("constructor", () => {
  new PlaceTgsUnpicked();
});

it("_getUnpickedStrategyCards", () => {
  MockGameObject.simple("mat:base/strategy-card");
  MockGameObject.simple("tile.strategy-card:base/leadership");
  MockGameObject.simple("tile.strategy-card:base/diplomacy", {
    position: [10, 0, 0],
  });

  const placeTgsUnpicked = new PlaceTgsUnpicked();
  const unpicked: Array<GameObject> =
    placeTgsUnpicked._getUnpickedStrategyCards();

  expect(unpicked.map((strategyCard) => NSID.get(strategyCard))).toEqual([
    "tile.strategy-card:base/leadership",
  ]);
});

it("_getUnpickedStrategyCards (missing mat)", () => {
  const placeTgsUnpicked = new PlaceTgsUnpicked();
  const unpicked: Array<GameObject> =
    placeTgsUnpicked._getUnpickedStrategyCards();
  expect(unpicked.length).toBe(0);
});

it("_placeTradeGood", () => {
  const diplomacy = MockGameObject.simple("tile.strategy-card:base/diplomacy");

  const placeTgsUnpicked = new PlaceTgsUnpicked();
  const success: boolean = placeTgsUnpicked._placeTradeGood(diplomacy);
  expect(success).toBe(true);

  const tgs: Array<GameObject> = world.getAllObjects().filter((obj) => {
    const nsid: string = NSID.get(obj);
    return nsid === "token:base/tradegood-commodity-1";
  });
  expect(tgs.length).toBe(1);
});

it("placeTgsUnpicked", () => {
  MockGameObject.simple("mat:base/strategy-card");
  MockGameObject.simple("tile.strategy-card:base/leadership");
  const placeTgsUnpicked = new PlaceTgsUnpicked();
  placeTgsUnpicked.placeTgsUnpicked();
});
