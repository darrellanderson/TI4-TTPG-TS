import { PlayerSlot } from "ttpg-darrell";
import { StrategyCardState } from "./strategy-card-state";

it("constructor", () => {
  new StrategyCardState("@test/test");
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
