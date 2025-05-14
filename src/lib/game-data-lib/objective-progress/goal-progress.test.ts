import { MockCardHolder } from "ttpg-mock";
import { GoalProgress, toSeats } from "./goal-progress";
import { PlayerSlot } from "ttpg-darrell";

beforeEach(() => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 11,
    position: [0, 10, 0],
  });
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 12,
    position: [0, -10, 0],
  });
});

it("toSeats", () => {
  const playerSlotToNumber: Map<PlayerSlot, number> = new Map();
  playerSlotToNumber.set(12, 1);
  playerSlotToNumber.set(10, 2);
  playerSlotToNumber.set(11, 3);

  const result: Array<number> = toSeats(playerSlotToNumber);
  expect(result).toEqual([1, 2, 3]);
});

it("constructor", () => {
  new GoalProgress();
});
