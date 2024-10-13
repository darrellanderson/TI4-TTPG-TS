import { GameObject, world } from "@tabletop-playground/api";
import { PlaceTgsUnpicked } from "./place-tgs-unpicked";
import { MockGameObject, mockWorld } from "ttpg-mock";
import { NSID, Spawn } from "ttpg-darrell";

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
  mockWorld._reset({
    _templateIdToMockGameObjectParams: {
      __tg__: {
        templateMetadata: "token:base/tradegood-commodity-1",
      },
    },
  });
  Spawn.inject({
    "token:base/tradegood-commodity-1": "__tg__",
  });

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
