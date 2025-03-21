import { Player } from "@tabletop-playground/api";
import { MockCardHolder, MockGameObject, MockPlayer } from "ttpg-mock";
import { OnStrategyCardPlayed } from "./on-strategy-card-played";

it("constructor/init", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });
  new MockGameObject(); // existed before init
  new OnStrategyCardPlayed().init();
});

it("custom action name", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });

  const strategyCard: MockGameObject = MockGameObject.simple(
    "tile.strategy-card:base/leadership"
  );
  new OnStrategyCardPlayed().init();

  const player: Player = new MockPlayer();
  const identifier: string = OnStrategyCardPlayed.ACTION_NAME;
  strategyCard._customActionAsPlayer(player, identifier);
  strategyCard._customActionAsPlayer(player, identifier); // again
});
