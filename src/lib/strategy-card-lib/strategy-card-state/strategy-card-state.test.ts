import { GameObject, Player } from "@tabletop-playground/api";
import { PlayerSlot } from "ttpg-darrell";
import { MockGameObject, MockPlayer } from "ttpg-mock";
import { StrategyCardState } from "./strategy-card-state";

it("static strategyCardToNumber", () => {
  const leadership: GameObject = MockGameObject.simple(
    "tile.strategy-card:base/leadership"
  );
  expect(StrategyCardState.strategyCardToNumber(leadership)).toEqual(1);

  const diplomacy: GameObject = MockGameObject.simple(
    "tile.strategy-card:base/diplomacy"
  );
  expect(StrategyCardState.strategyCardToNumber(diplomacy)).toEqual(2);

  const politics: GameObject = MockGameObject.simple(
    "tile.strategy-card:base/politics"
  );
  expect(StrategyCardState.strategyCardToNumber(politics)).toEqual(3);

  const construction: GameObject = MockGameObject.simple(
    "tile.strategy-card:base/construction"
  );
  expect(StrategyCardState.strategyCardToNumber(construction)).toEqual(4);

  const trade: GameObject = MockGameObject.simple(
    "tile.strategy-card:base/trade"
  );
  expect(StrategyCardState.strategyCardToNumber(trade)).toEqual(5);

  const warfare: GameObject = MockGameObject.simple(
    "tile.strategy-card:base/warfare"
  );
  expect(StrategyCardState.strategyCardToNumber(warfare)).toEqual(6);

  const technology: GameObject = MockGameObject.simple(
    "tile.strategy-card:base/technology"
  );
  expect(StrategyCardState.strategyCardToNumber(technology)).toEqual(7);

  const imperial: GameObject = MockGameObject.simple(
    "tile.strategy-card:base/imperial"
  );
  expect(StrategyCardState.strategyCardToNumber(imperial)).toEqual(8);

  const unknown: GameObject = MockGameObject.simple(
    "tile.strategy-card:base/unknown"
  );
  expect(StrategyCardState.strategyCardToNumber(unknown)).toBeUndefined();

  const invalid: GameObject = MockGameObject.simple("_not_nsid_");
  expect(StrategyCardState.strategyCardToNumber(invalid)).toBeUndefined();
});

it("constructor/destroy", () => {
  new StrategyCardState("@test/test").destroy();
});

it("event", () => {
  new StrategyCardState("@test/test");

  const strategyCard: GameObject = MockGameObject.simple(
    "tile.strategy-card:base/leadership"
  );
  const player: Player = new MockPlayer();
  TI4.events.onStrategyCardPlayed.trigger(strategyCard, player);
});

it("add/active/remove", () => {
  const strategyCardState = new StrategyCardState("@test/test");
  const playerSlot: PlayerSlot = 10;

  const active = strategyCardState.active(playerSlot);
  expect(active).toEqual([]);

  strategyCardState.addOrUpdate(playerSlot, 1, "1-state");
  strategyCardState.addOrUpdate(playerSlot, 2, "2-state");
  expect(strategyCardState.active(playerSlot)).toEqual([
    { number: 1, state: "1-state" },
    { number: 2, state: "2-state" },
  ]);

  // Update
  strategyCardState.addOrUpdate(playerSlot, 1, "1-state-updated");
  expect(strategyCardState.active(playerSlot)).toEqual([
    { number: 1, state: "1-state-updated" },
    { number: 2, state: "2-state" },
  ]);

  // Second player slot.
  const playerSlot2: PlayerSlot = 20;
  strategyCardState.addOrUpdate(playerSlot2, 1, "1-state-player2");
  expect(strategyCardState.active(playerSlot2)).toEqual([
    { number: 1, state: "1-state-player2" },
  ]);

  const loadFromPersistence = new StrategyCardState("@test/test");
  expect(loadFromPersistence.active(playerSlot)).toEqual([
    { number: 1, state: "1-state-updated" },
    { number: 2, state: "2-state" },
  ]);
  expect(loadFromPersistence.active(playerSlot2)).toEqual([
    { number: 1, state: "1-state-player2" },
  ]);

  strategyCardState.remove(playerSlot, 1);
  expect(strategyCardState.active(playerSlot)).toEqual([
    { number: 2, state: "2-state" },
  ]);

  strategyCardState.remove(playerSlot, 2);
  expect(strategyCardState.active(playerSlot)).toEqual([]);
});
