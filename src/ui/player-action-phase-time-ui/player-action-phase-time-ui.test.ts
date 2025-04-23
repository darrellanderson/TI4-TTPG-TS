import { MockCardHolder } from "ttpg-mock";
import { PlayerActionPhaseTimeUI } from "./player-action-phase-time-ui";

it("constructor/destroy", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 11,
  });

  const scale: number = 1;
  const playerActionPhaseTimeUI: PlayerActionPhaseTimeUI =
    new PlayerActionPhaseTimeUI(scale);
  expect(playerActionPhaseTimeUI).toBeDefined();
  playerActionPhaseTimeUI.destroy();
});

it("update", () => {
  const scale: number = 1;
  const playerActionPhaseTimeUI: PlayerActionPhaseTimeUI =
    new PlayerActionPhaseTimeUI(scale);
  playerActionPhaseTimeUI._updateRoundAndSeatIndex(0, 0);
  playerActionPhaseTimeUI._updateRoundAndSeatIndex(0, 10);
  playerActionPhaseTimeUI._updateRoundAndSeatIndex(10, 0);
  playerActionPhaseTimeUI._updateRoundAndSeatIndex(10, 10);
  playerActionPhaseTimeUI.destroy();
});

it("onInterval", () => {
  const scale: number = 1;
  const playerActionPhaseTimeUI: PlayerActionPhaseTimeUI =
    new PlayerActionPhaseTimeUI(scale);
  playerActionPhaseTimeUI._onInterval();
  playerActionPhaseTimeUI.destroy();
});

it("formatTime", () => {
  const scale: number = 1;
  const playerActionPhaseTimeUI: PlayerActionPhaseTimeUI =
    new PlayerActionPhaseTimeUI(scale);
  expect(PlayerActionPhaseTimeUI._formatTime(0)).toBe("0:00");
  expect(PlayerActionPhaseTimeUI._formatTime(1)).toBe("0:01");
  expect(PlayerActionPhaseTimeUI._formatTime(59)).toBe("0:59");
  expect(PlayerActionPhaseTimeUI._formatTime(60)).toBe("1:00");
  expect(PlayerActionPhaseTimeUI._formatTime(61)).toBe("1:01");
  expect(PlayerActionPhaseTimeUI._formatTime(119)).toBe("1:59");
  expect(PlayerActionPhaseTimeUI._formatTime(120)).toBe("2:00");
  expect(PlayerActionPhaseTimeUI._formatTime(121)).toBe("2:01");
  expect(PlayerActionPhaseTimeUI._formatTime(3599)).toBe("59:59");
  expect(PlayerActionPhaseTimeUI._formatTime(3600)).toBe("1:00:00");
  expect(PlayerActionPhaseTimeUI._formatTime(3601)).toBe("1:00:01");
  playerActionPhaseTimeUI.destroy();
});
