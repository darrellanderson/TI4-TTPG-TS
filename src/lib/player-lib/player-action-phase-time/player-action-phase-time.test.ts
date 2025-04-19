import { DirectionType } from "ttpg-darrell";
import { MockCardHolder } from "ttpg-mock";
import { GameData } from "../../game-data-lib/game-data/game-data";
import { PlayerActionPhaseTime } from "./player-action-phase-time";

it("constructor/init/destroy", () => {
  const playerActionPhaseTime = new PlayerActionPhaseTime(undefined);
  playerActionPhaseTime.init();
  playerActionPhaseTime.destroy();
});

it("event, interval", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });

  jest.useFakeTimers();

  const timerValue: number = 0;
  const timerDirection: DirectionType = 1;
  TI4.timer.start(timerValue, timerDirection);
  expect(TI4.timer.export().active).toBe(true);

  TI4.turnOrder.setTurnOrder([10], "forward", 10);

  const playerActionPhaseTime = new PlayerActionPhaseTime("@test/test");
  playerActionPhaseTime.init();

  expect(playerActionPhaseTime.isActiveActionPhase()).toBe(false);

  const gameData: GameData = {
    round: 1,
    players: [{ strategyCards: ["1", "2", "3", "4", "5", "6"] }],
  };
  TI4.events.onGameData.trigger(gameData);
  TI4.events.onGameData.trigger(gameData); // again
  expect(playerActionPhaseTime.getRound()).toBe(1);
  expect(playerActionPhaseTime.isActiveActionPhase()).toBe(true);
  expect(playerActionPhaseTime.getSeconds(1, 0)).toBe(0);

  jest.runOnlyPendingTimers();
  jest.runOnlyPendingTimers(); // again

  expect(playerActionPhaseTime.isActiveActionPhase()).toBe(true);
  expect(playerActionPhaseTime.getSeconds(1, 0)).toBe(2);

  // Again with a < 5 player count.
  TI4.config.setPlayerCount(4);
  TI4.events.onGameData.trigger(gameData);

  // Also send an empty event.
  const emptyGameData: GameData = { players: [] };
  TI4.events.onGameData.trigger(emptyGameData);
  expect(playerActionPhaseTime.isActiveActionPhase()).toBe(false);

  playerActionPhaseTime.destroy();
  TI4.timer.stop();

  // Reload with same namespaceId.
  const playerActionPhaseTime2 = new PlayerActionPhaseTime("@test/test");
  expect(playerActionPhaseTime2.getSeconds(1, 0)).toBe(2);
});
