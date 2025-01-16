import { MockCardHolder } from "ttpg-mock";
import { PlayerSeats, PlayerSeatType } from "./player-seats";

it("constructor", () => {
  new PlayerSeats();
});

it("getAllSeats", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 1,
    position: [-10, 10, 0],
  });
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 2,
    position: [-10, -10, 0],
  });
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 3,
    position: [10, -10, 0],
  });
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 4,
    position: [10, 10, 0],
  });

  const playerSeats: PlayerSeats = new PlayerSeats();
  const seats: Array<PlayerSeatType> = playerSeats.getAllSeats();
  expect(seats.map((seat) => seat.playerSlot)).toEqual([1, 2, 3, 4]);
});

it("getAllSeats (empty)", () => {
  const playerSeats = new PlayerSeats();
  const seats = playerSeats.getAllSeats();
  expect(seats).toEqual([]);
});

it("getPlayerSlotBySeatIndex", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 1,
  });

  const playerSeats = new PlayerSeats();
  expect(playerSeats.getPlayerSlotBySeatIndex(0)).toBe(1);
  expect(playerSeats.getPlayerSlotBySeatIndex(1)).toBe(-1);
});

it("getSeatIndexByPlayerSlot", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 1,
  });

  const playerSeats = new PlayerSeats();
  expect(playerSeats.getSeatIndexByPlayerSlot(1)).toBe(0);
  expect(playerSeats.getSeatIndexByPlayerSlot(2)).toBe(-1);
});
