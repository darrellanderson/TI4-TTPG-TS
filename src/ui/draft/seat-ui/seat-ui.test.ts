import { Widget } from "@tabletop-playground/api";
import { SeatUI } from "./seat-ui";
import { MockCardHolder } from "ttpg-mock";

it("_getPlayerSlotOrThrow", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
    position: [-10, 10, 0],
  });

  const seatIndex: number = 0;
  const playerSlot: number = SeatUI._getPlayerSlotOrThrow(seatIndex);
  expect(playerSlot).toBeDefined();

  expect(() => {
    SeatUI._getPlayerSlotOrThrow(1);
  }).toThrow();
});

it("_getLabelOrThrow", () => {
  const seatIndex: number = 0;
  const speakerSeatIndex: number = 0;
  const label: string = SeatUI._getLabelOrThrow(seatIndex, speakerSeatIndex);
  expect(label).toBeDefined();

  expect(() => {
    SeatUI._getLabelOrThrow(100, speakerSeatIndex);
  }).toThrow();

  expect(() => {
    SeatUI._getLabelOrThrow(-100, speakerSeatIndex);
  }).toThrow();
});

it("getWidget", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
    position: [-10, 10, 0],
  });
  expect(TI4.playerSeats.getAllSeats().length).toBeGreaterThan(0);

  const scale: number = 1;
  const seatIndex: number = 0;
  const speakerSeatIndex: number = 0;
  const widget: Widget = new SeatUI(
    seatIndex,
    speakerSeatIndex,
    scale
  ).getWidget();
  expect(widget).toBeDefined();
});

it("getSize", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
    position: [-10, 10, 0],
  });
  expect(TI4.playerSeats.getAllSeats().length).toBeGreaterThan(0);

  const scale: number = 1;
  const seatIndex: number = 0;
  const speakerSeatIndex: number = 0;
  const size = new SeatUI(seatIndex, speakerSeatIndex, scale).getSize();
  expect(size).toBeDefined();
});
