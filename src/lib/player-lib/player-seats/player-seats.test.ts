import { MockCardHolder, Vector } from "ttpg-mock";
import { PlayerSeats, PlayerSeatType } from "./player-seats";

it("constructor/init", () => {
  new PlayerSeats().init();
  TI4.events.onStartGameComplete.trigger();
});

it("getDealPosition", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 1,
    position: [10, 10, 0],
  });
  const pos: Vector = new PlayerSeats().getDealPosition(1);
  expect(pos.toString()).toBe("(X=6,Y=10,Z=3)");
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

it("getPlayerSlotBySeatIndexOrThrow", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 1,
  });

  const playerSeats = new PlayerSeats();
  expect(playerSeats.getPlayerSlotBySeatIndexOrThrow(0)).toBe(1);
  expect(() => playerSeats.getPlayerSlotBySeatIndexOrThrow(1)).toThrow();
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

it("getSeatIndexByPlayerSlotOrThrow", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 1,
  });

  const playerSeats = new PlayerSeats();
  expect(playerSeats.getSeatIndexByPlayerSlotOrThrow(1)).toBe(0);
  expect(() => playerSeats.getSeatIndexByPlayerSlotOrThrow(2)).toThrow();
});

it("getCardHolderByPlayerSlot", () => {
  const cardHolder = new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 1,
  });
  const playerSeats = new PlayerSeats();
  expect(playerSeats.getCardHolderByPlayerSlot(1)).toBe(cardHolder);
  expect(playerSeats.getCardHolderByPlayerSlot(2)).toBeUndefined();
});

it("getCardHolderByPlayerSlotOrThrow", () => {
  const cardHolder = new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 1,
  });
  const playerSeats = new PlayerSeats();
  expect(playerSeats.getCardHolderByPlayerSlotOrThrow(1)).toBe(cardHolder);
  expect(() => playerSeats.getCardHolderByPlayerSlotOrThrow(2)).toThrow();
});
