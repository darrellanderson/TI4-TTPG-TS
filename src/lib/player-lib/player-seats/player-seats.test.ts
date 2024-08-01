import { MockCardHolder } from "ttpg-mock";
import { PlayerSeats, PlayerSeatType } from "./player-seats";

it("constructor", () => {
  new PlayerSeats();
});

it("getAllSeats", () => {
  new MockCardHolder({ owningPlayerSlot: 1, position: [10, 0, 0] });
  new MockCardHolder({ owningPlayerSlot: 2, position: [20, 0, 0] });

  const playerSeats: PlayerSeats = new PlayerSeats();
  const seats: Array<PlayerSeatType> = playerSeats.getAllSeats();
  expect(seats.map((seat) => seat.playerSlot)).toEqual([1, 2]);
});

it("getAllSeats (empty)", () => {
  const playerSeats = new PlayerSeats();
  const seats = playerSeats.getAllSeats();
  expect(seats).toEqual([]);
});
