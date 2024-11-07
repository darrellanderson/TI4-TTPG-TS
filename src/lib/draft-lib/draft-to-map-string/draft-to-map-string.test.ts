import { MockCardHolder } from "ttpg-mock";
import { Faction } from "../../faction-lib/faction/faction";
import { MILTY_SLICE_SHAPE } from "../drafts/milty";
import { SliceTiles } from "../generate-slices/generate-slices";
import { DraftToMapString } from "./draft-to-map-string";
import { MapHomeSystemLocations } from "../../map-string-lib/map-home-system-locations";

beforeEach(() => {
  // Create card hol
  for (const playerSlot of [10, 11, 12, 13, 14, 15]) {
    new MockCardHolder({
      templateMetadata: "card-holder:base/player-hand",
      owningPlayerSlot: playerSlot,
    });
  }
});

it("beforeEach: player seats", () => {
  expect(TI4.playerSeats.getAllSeats().length).toBe(6);
});

it("beforeEach: home system locations", () => {
  const homeSystemLocs = new MapHomeSystemLocations();
  for (const playerSlot of [10, 11, 12, 13, 14, 15]) {
    expect(homeSystemLocs.get(playerSlot)).toBeDefined();
  }
});

it("map string", () => {
  const seatIndexToSliceTiles: Map<number, SliceTiles> = new Map();
  const seatIndexToFaction: Map<number, Faction> = new Map();
  const setIndexToPlayerName: Map<number, string> = new Map();

  seatIndexToSliceTiles.set(4, [21, 22, 23, 24, 25]);

  const arborec = TI4.factionRegistry.getByNsid("faction:base/arborec")!;
  if (!arborec) {
    throw new Error("arborec not found");
  }
  seatIndexToFaction.set(4, arborec);

  const { mapString } = new DraftToMapString(MILTY_SLICE_SHAPE).buildMapString(
    seatIndexToSliceTiles,
    seatIndexToFaction,
    setIndexToPlayerName
  );

  expect(mapString).toBe(
    "{18} 25 -115 -110 -111 -112 -113 22 24 -115 -115 -110 -110 -111 -111 -112 -112 -113 -113 5 21 -115 -115 -115 -110 -110 -110 -111 -111 -111 -112 -112 -112 -113 -113 -113 23"
  );
});
