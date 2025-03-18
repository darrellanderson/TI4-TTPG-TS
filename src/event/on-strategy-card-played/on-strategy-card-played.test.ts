import { Player } from "@tabletop-playground/api";
import { MockGameObject, MockPlayer } from "ttpg-mock";
import { OnStrategyCardPlayed } from "./on-strategy-card-played";

it("constructor/init", () => {
  new MockGameObject(); // existed before init
  new OnStrategyCardPlayed().init();
});

it("custom action name", () => {
  // Use the OnStrategyCardPlayed registered in global.
  const strategyCard: MockGameObject = MockGameObject.simple(
    "tile.strategy-card:base/leadership"
  );

  let eventCount: number = 0;
  TI4.events.onStrategyCardPlayed.add(() => {
    eventCount++;
  });
  expect(eventCount).toEqual(0);

  const player: Player = new MockPlayer();
  const identifier: string = OnStrategyCardPlayed.ACTION_NAME;
  strategyCard._customActionAsPlayer(player, identifier);
  expect(eventCount).toEqual(1);
});
