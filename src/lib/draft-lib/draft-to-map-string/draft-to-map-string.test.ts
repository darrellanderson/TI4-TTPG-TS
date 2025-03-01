import { MockCardHolder, MockPlayer } from "ttpg-mock";

import { DraftState } from "../draft-state/draft-state";
import {
  DraftToMapString,
  MapStringAndHexToPlayerName,
} from "./draft-to-map-string";
import { Faction } from "../../faction-lib/faction/faction";
import { MapHomeSystemLocations } from "../../map-string-lib/map-home-system-locations/map-home-system-locations";
import { MILTY_SLICE_SHAPE, MILTY_SLICE_SHAPE_ALT } from "../drafts/milty";
import { SliceTiles } from "../generate-slices/generate-slices";

beforeEach(() => {
  // Create card holder for TI4.playerSeats to use.
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
  const seatIndexToPlayerName: Map<number, string> = new Map();

  seatIndexToSliceTiles.set(4, [21, 22, 23, 24, 25]);

  const arborec = TI4.factionRegistry.getByNsid("faction:base/arborec")!;
  if (!arborec) {
    throw new Error("arborec not found");
  }
  seatIndexToFaction.set(4, arborec);

  const sol = TI4.factionRegistry.getByNsid("faction:base/sol")!;
  if (!sol) {
    throw new Error("sol not found");
  }
  seatIndexToFaction.set(5, sol);

  seatIndexToPlayerName.set(4, "MyName");

  const { mapString, hexToPlayerName } = new DraftToMapString(
    MILTY_SLICE_SHAPE
  ).buildMapString(
    seatIndexToSliceTiles,
    seatIndexToFaction,
    seatIndexToPlayerName
  );

  expect(mapString).toBe(
    "{18} 25 -115 -110 -111 -112 -113 22 24 -115 -115 -110 -110 -111 -111 -112 -112 -113 -113 5 21 -115 1 -115 -110 -110 -110 -111 -111 -111 -112 -112 -112 -113 -113 -113 23"
  );
  expect(Array.from(hexToPlayerName.keys()).join(",")).toBe("<3,0,-3>");
  expect(hexToPlayerName.get("<3,0,-3>")).toBe("MyName");
});

it("overrideSliceShape", () => {
  const draftToMapString = new DraftToMapString(MILTY_SLICE_SHAPE);

  expect(draftToMapString._getSliceShape(0)).toEqual(MILTY_SLICE_SHAPE);

  draftToMapString.overrideSliceShape(0, MILTY_SLICE_SHAPE_ALT);
  expect(draftToMapString._getSliceShape(0)).toEqual(MILTY_SLICE_SHAPE_ALT);
});

it("_fillMissingMapStringEntries", () => {
  const draftToMapString = new DraftToMapString(MILTY_SLICE_SHAPE);
  const entries: Array<string> = ["{18}"];
  entries[2] = "1";
  draftToMapString._fillMissingMapStringEntries(entries);
  expect(entries).toEqual(["{18}", "-1", "1"]);
});

it("static map string", () => {
  new MockPlayer({ name: "MyName", slot: 1 });

  const state: DraftState = new DraftState("@test/draft-state")
    .setSliceShape(["<0,0,0>", "<1,0,-1>", "<2,0,-2>"])
    .setSlices([
      [1, 2],
      [3, 4],
      [5, 6],
    ])
    .setFactions(
      ["faction:base/arborec", "faction:base/sol", "faction:pok/ul"].map(
        (nsidName) => TI4.factionRegistry.getByNsidOrThrow(nsidName)
      )
    )
    .setSpeakerIndex(2)
    .setSliceIndexToPlayerSlot(0, 1)
    .setFactionIndexToPlayerSlot(0, 1)
    .setSeatIndexToPlayerSlot(0, 1);

  const mapStringAndHexToPlayerName: MapStringAndHexToPlayerName =
    DraftToMapString.fromDraftState(state);

  const mapString: string = mapStringAndHexToPlayerName.mapString;
  expect(mapString).toBe(
    "{18} -114 -115 2 -111 -112 -113 -114 -1 -115 -1 1 -1 -111 -1 -112 -1 -113 -1 -114 -1 -1 -115 -1 -1 5 -1 -1 -111 -1 -1 -112 -1 -1 -113"
  );
});
