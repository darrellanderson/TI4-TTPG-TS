import { MockCardHolder } from "ttpg-mock";
import { DraftStateTF, OpaqueTFSchemaType } from "./draft-state-tf";
import { PlayerSeatType } from "../../player-lib/player-seats/player-seats";

it("constructor", () => {
  new DraftStateTF("@test/test");
});

it("_clearFactionRefNumber", () => {
  const draftStateTF: DraftStateTF = new DraftStateTF("@test/test");
  const opaqueData: OpaqueTFSchemaType = {
    s: 1,
    h: 2,
    u: 3,
  };

  draftStateTF._clearFactionRefNumber(opaqueData, 2);
  expect(opaqueData).toEqual({
    s: 1,
    u: 3,
  });

  draftStateTF._clearFactionRefNumber(opaqueData, 1);
  expect(opaqueData).toEqual({
    u: 3,
  });

  draftStateTF._clearFactionRefNumber(opaqueData, 3);
  expect(opaqueData).toEqual({});
});

it("speaker priority", () => {
  const draftStateTF: DraftStateTF = new DraftStateTF("@test/test");
  const playerSlot: number = 10;
  const speakerPriority: number = 5;

  expect(draftStateTF.getSpeakerPriority(playerSlot)).toBe(-1);
  expect(draftStateTF.setSpeakerPriority(speakerPriority, playerSlot)).toBe(
    false
  ); // no opaque for player

  draftStateTF.setOpaques(["{}"]);
  draftStateTF.setOpaqueToPlayerSlot(0, playerSlot);

  expect(draftStateTF.getSpeakerPriority(playerSlot)).toBe(-1);
  expect(draftStateTF.setSpeakerPriority(speakerPriority, playerSlot)).toBe(
    true
  );
  expect(draftStateTF.getSpeakerPriority(playerSlot)).toBe(speakerPriority);
});

it("home system", () => {
  const draftStateTF: DraftStateTF = new DraftStateTF("@test/test");
  const playerSlot: number = 10;
  const homeSystem: number = 42;

  expect(draftStateTF.getHomeSystem(playerSlot)).toBe(-1);
  expect(draftStateTF.setHomeSystem(homeSystem, playerSlot)).toBe(false); // no opaque for player

  draftStateTF.setOpaques(["{}"]);
  draftStateTF.setOpaqueToPlayerSlot(0, playerSlot);

  expect(draftStateTF.getHomeSystem(playerSlot)).toBe(-1);
  expect(draftStateTF.setHomeSystem(homeSystem, playerSlot)).toBe(true);
  expect(draftStateTF.getHomeSystem(playerSlot)).toBe(homeSystem);
});

it("starting units", () => {
  const draftStateTF: DraftStateTF = new DraftStateTF("@test/test");
  const playerSlot: number = 10;
  const startingUnits: number = 7;

  expect(draftStateTF.getStartingUnits(playerSlot)).toBe(-1);
  expect(draftStateTF.setStartingUnits(startingUnits, playerSlot)).toBe(false); // no opaque for player

  draftStateTF.setOpaques(["{}"]);
  draftStateTF.setOpaqueToPlayerSlot(0, playerSlot);

  expect(draftStateTF.getStartingUnits(playerSlot)).toBe(-1);
  expect(draftStateTF.setStartingUnits(startingUnits, playerSlot)).toBe(true);
  expect(draftStateTF.getStartingUnits(playerSlot)).toBe(startingUnits);
});

it("_isOpaqueDataComplete", () => {
  const draftStateTF: DraftStateTF = new DraftStateTF("@test/test");

  const playerSlot: number = 10;

  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: playerSlot,
  });

  expect(draftStateTF._isOpaqueDataComplete()).toBe(false);
  draftStateTF.setOpaques(["{}", "{}"]);
  draftStateTF.setOpaqueToPlayerSlot(0, playerSlot);
  draftStateTF.setSpeakerPriority(1, playerSlot);
  draftStateTF.setHomeSystem(10, playerSlot);
  draftStateTF.setStartingUnits(5, playerSlot);
  expect(draftStateTF._isOpaqueDataComplete()).toBe(true);
});

it("_maybeSetSeats", () => {
  // Need seats for player slots.
  for (const playerSlot of [10, 11, 12, 13, 14, 15]) {
    new MockCardHolder({
      templateMetadata: "card-holder:base/player-hand",
      owningPlayerSlot: playerSlot,
    });
  }
  const playerSlots: Array<number> = TI4.playerSeats
    .getAllSeats()
    .map((seat: PlayerSeatType): number => seat.playerSlot);
  expect(playerSlots.length).toBe(6);
  expect(playerSlots).toEqual([10, 11, 12, 13, 14, 15]);

  const draftStateTF: DraftStateTF = new DraftStateTF("@test/test");
  draftStateTF.setSpeakerIndex(0); // for test
  expect(draftStateTF._maybeSetSeats()).toBe(false);

  playerSlots.forEach((playerSlot: number, seatIndex: number) => {
    draftStateTF.setOpaqueToPlayerSlot(seatIndex, playerSlot); // must have opaque to set speaker
    draftStateTF.setSpeakerPriority(seatIndex, playerSlot);
    expect(draftStateTF.hasSpeakerPriority(playerSlot)).toBe(true);
    expect(draftStateTF.getSpeakerPriority(playerSlot)).toBe(seatIndex);
    if (seatIndex < playerSlots.length - 1) {
      expect(draftStateTF._maybeSetSeats()).toBe(false);
    }
  });
  expect(draftStateTF._maybeSetSeats()).toBe(true);
  expect(draftStateTF.getSeatIndexToPlayerSlot(0)).toBe(10);
  expect(draftStateTF.getSeatIndexToPlayerSlot(1)).toBe(11);
  expect(draftStateTF.getSeatIndexToPlayerSlot(2)).toBe(12);
  expect(draftStateTF.getSeatIndexToPlayerSlot(3)).toBe(13);
  expect(draftStateTF.getSeatIndexToPlayerSlot(4)).toBe(14);
  expect(draftStateTF.getSeatIndexToPlayerSlot(5)).toBe(15);
});
