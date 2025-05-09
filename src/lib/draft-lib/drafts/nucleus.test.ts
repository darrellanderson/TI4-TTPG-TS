import { MockCardHolder, MockGameObject } from "ttpg-mock";
import { NucleusDraft } from "./nucleus";
import { System } from "../../system-lib/system/system";

it("isEnabled", () => {
  const nucleus = new NucleusDraft();
  nucleus.isEnabled();
});

it("getDraftName", () => {
  const nucleus = new NucleusDraft();
  expect(nucleus.getDraftName()).toBe("Nucleus Draft");
});

it("getGenerateSlicesParams", () => {
  const nucleus = new NucleusDraft();
  const params = nucleus.getGenerateSlicesParams();
  expect(params).toBeDefined();
});

it("_getNucleusMapStringIndexes", () => {
  // Create card holder for TI4.playerSeats to use.
  for (const playerSlot of [10, 11, 12, 13, 14, 15]) {
    new MockCardHolder({
      templateMetadata: "card-holder:base/player-hand",
      owningPlayerSlot: playerSlot,
    });
  }

  const nucleus = new NucleusDraft();
  const indexes = nucleus._getNucleusMapStringIndexes();
  expect(indexes).toEqual([0, 1, 2, 3, 4, 5, 7, 9, 11, 13, 15, 17]);
});

it("_getNucleusMapStringIndexes (7p)", () => {
  TI4.config.setPlayerCount(7);

  // Create card holder for TI4.playerSeats to use.
  for (const playerSlot of [10, 11, 12, 13, 14, 15, 16]) {
    new MockCardHolder({
      templateMetadata: "card-holder:base/player-hand",
      owningPlayerSlot: playerSlot,
    });
  }

  const nucleus = new NucleusDraft();
  const indexes = nucleus._getNucleusMapStringIndexes();
  expect(indexes).toEqual([1, 2, 5, 6, 7, 9, 11, 12, 13, 14, 16, 17, 28, 35]);
});

it("_getNucleusMapStringIndexes (8p)", () => {
  TI4.config.setPlayerCount(8);

  // Create card holder for TI4.playerSeats to use.
  for (const playerSlot of [10, 11, 12, 13, 14, 15, 16, 17]) {
    new MockCardHolder({
      templateMetadata: "card-holder:base/player-hand",
      owningPlayerSlot: playerSlot,
    });
  }

  const nucleus = new NucleusDraft();
  const indexes = nucleus._getNucleusMapStringIndexes();
  expect(indexes).toEqual([
    2, 5, 6, 7, 8, 10, 11, 12, 13, 14, 16, 17, 19, 26, 28, 35,
  ]);
});

it("_getScattered", () => {
  const nucleus = new NucleusDraft();
  const mapStringIndexes = [0, 1, 2, 3, 4, 5, 7, 9, 11, 13, 15, 17];
  const copy = [...mapStringIndexes];
  const want = 3;
  const scattered = nucleus._getScattered(mapStringIndexes, want);
  expect(scattered.length).toBe(want);
  for (const index of scattered) {
    expect(copy).toContain(index);
    expect(mapStringIndexes).not.toContain(index); // removed from original
  }
});

it("_getScattered (too few entries)", () => {
  const nucleus = new NucleusDraft();
  const mapStringIndexes = [0];
  const want = 3;
  expect(() => {
    nucleus._getScattered(mapStringIndexes, want);
  }).toThrow();
});

it("_getAvailableWormholes", () => {
  MockGameObject.simple("tile.system:base/26"); // system must exist to find

  const system: System | undefined =
    TI4.systemRegistry.getBySystemTileNumber(26);
  expect(system?.getWormholes()).toContain("alpha");

  const nucleus = new NucleusDraft();
  const wormholes = nucleus._getAvailableWormholes();
  expect(wormholes).toHaveLength(1);
});

it("_getNonWormholeRedSystems", () => {
  MockGameObject.simple("tile.system:base/39"); // red wormhole
  MockGameObject.simple("tile.system:base/41"); // gravity rift

  const nucleus = new NucleusDraft();
  const nonWormholeRedSystems = nucleus._getNonWormholeRedSystems();
  expect(nonWormholeRedSystems).toHaveLength(1);
});

it("_getNonWormholeBlueSystems", () => {
  MockGameObject.simple("tile.system:base/19");

  const nucleus = new NucleusDraft();
  const nonWormholeBlueSystems = nucleus._getNonWormholeBlueSystems();
  expect(nonWormholeBlueSystems).toHaveLength(1);
});

it("_fillEntriesOrThrow", () => {
  const nucleus = new NucleusDraft();
  const mapStringIndexes: Array<number> = [0, 1];
  const fillValues: Array<number> = [10, 11];
  const entries: Array<number> = [1, 1];
  nucleus._fillEntriesOrThrow(mapStringIndexes, fillValues, entries);
  expect(entries).toEqual([10, 11]);
});

it("_fillEntriesOrThrow (too few values)", () => {
  const nucleus = new NucleusDraft();
  const mapStringIndexes: Array<number> = [0, 1];
  const fillValues: Array<number> = [];
  const entries: Array<number> = [1, 1];
  expect(() => {
    nucleus._fillEntriesOrThrow(mapStringIndexes, fillValues, entries);
  }).toThrow();
});

it("_fillEntriesOrThrow (non-1 entry))", () => {
  const nucleus = new NucleusDraft();
  const mapStringIndexes: Array<number> = [0, 1];
  const fillValues: Array<number> = [0, 0];
  const entries: Array<number> = [2, 2];
  expect(() => {
    nucleus._fillEntriesOrThrow(mapStringIndexes, fillValues, entries);
  }).toThrow();
});

it("createEmptyDraftState", () => {
  // Create card holder for TI4.playerSeats to use.
  for (const playerSlot of [10, 11, 12, 13, 14, 15]) {
    new MockCardHolder({
      templateMetadata: "card-holder:base/player-hand",
      owningPlayerSlot: playerSlot,
    });
  }

  // Systems must exist for registry to know about them.
  for (const tile of TI4.systemRegistry.getAllSystemTileNumbers()) {
    const nsid: string | undefined =
      TI4.systemRegistry.tileNumberToSystemTileObjNsid(tile);
    if (nsid) {
      MockGameObject.simple(nsid);
    }
  }

  const nucleus = new NucleusDraft();
  const draftState = nucleus.createEmptyDraftState("@test/test");
  expect(draftState).toBeDefined();
});

it("createEmptyDraftState (7p)", () => {
  TI4.config.setPlayerCount(7);

  // Create card holder for TI4.playerSeats to use.
  for (const playerSlot of [10, 11, 12, 13, 14, 15, 16]) {
    new MockCardHolder({
      templateMetadata: "card-holder:base/player-hand",
      owningPlayerSlot: playerSlot,
    });
  }

  // Systems must exist for registry to know about them.
  for (const tile of TI4.systemRegistry.getAllSystemTileNumbers()) {
    const nsid: string | undefined =
      TI4.systemRegistry.tileNumberToSystemTileObjNsid(tile);
    if (nsid) {
      MockGameObject.simple(nsid);
    }
  }

  const nucleus = new NucleusDraft();
  const draftState = nucleus.createEmptyDraftState("@test/test");
  expect(draftState).toBeDefined();
});

it("createEmptyDraftState (8p)", () => {
  TI4.config.setPlayerCount(8);

  // Create card holder for TI4.playerSeats to use.
  for (const playerSlot of [10, 11, 12, 13, 14, 15, 16, 17]) {
    new MockCardHolder({
      templateMetadata: "card-holder:base/player-hand",
      owningPlayerSlot: playerSlot,
    });
  }

  // Systems must exist for registry to know about them.
  for (const tile of TI4.systemRegistry.getAllSystemTileNumbers()) {
    const nsid: string | undefined =
      TI4.systemRegistry.tileNumberToSystemTileObjNsid(tile);
    if (nsid) {
      MockGameObject.simple(nsid);
    }
  }

  const nucleus = new NucleusDraft();
  const draftState = nucleus.createEmptyDraftState("@test/test");
  expect(draftState).toBeDefined();
});
