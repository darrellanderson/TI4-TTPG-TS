import { MockCardHolder, MockGameObject } from "ttpg-mock";
import { UnpackHomeSystem } from "./unpack-home-system";
import { Faction } from "../../faction/faction";
import { GameObject } from "@tabletop-playground/api";
import { SourceAndPackageIdSchemaType } from "../../../system-lib/schema/basic-types-schema";
import { FactionSchemaType } from "../../../faction-lib/schema/faction-schema";

it("unpack/remove (arborec)", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const playerSlot: number = 10;

  new MockGameObject({
    templateMetadata: "sheet.faction:base/arborec",
    owningPlayerSlot: playerSlot,
  });
  MockGameObject.simple("tile.system:base/0", { owningPlayerSlot: playerSlot });
  MockGameObject.simple("tile.system:base/10");

  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: playerSlot,
  });

  const unpack = new UnpackHomeSystem(faction, playerSlot);
  unpack.unpack();
  unpack.remove();
});

it("unpack/remove (creuss)", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/creuss"
  )!;
  const playerSlot: number = 10;

  new MockGameObject({
    templateMetadata: "sheet.faction:base/creuss",
    owningPlayerSlot: playerSlot,
  });
  MockGameObject.simple("tile.system:base/0", { owningPlayerSlot: playerSlot });
  MockGameObject.simple("tile.system:base/10");

  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: playerSlot,
  });

  const unpack = new UnpackHomeSystem(faction, playerSlot);
  unpack.unpack();
  unpack.remove();
});

it("_findGenericHomeSystemTileOrThrow", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const playerSlot: number = 10;

  const generic: GameObject = MockGameObject.simple("tile.system:base/0", {
    owningPlayerSlot: playerSlot,
  });

  const unpack = new UnpackHomeSystem(faction, playerSlot);
  const obj = unpack._findGenericHomeSystemTileOrThrow();
  expect(obj).toBe(generic);
});

it("_findGenericHomeSystemTileOrThrow (missing)", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const playerSlot: number = 10;

  const unpack = new UnpackHomeSystem(faction, playerSlot);
  expect(() => unpack._findGenericHomeSystemTileOrThrow()).toThrow();
});

it("_findFactionSheetOrThrow", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const playerSlot: number = 10;

  const factionSheet: GameObject = MockGameObject.simple(
    "sheet.faction:base/arborec",
    {
      owningPlayerSlot: playerSlot,
    }
  );

  const unpack = new UnpackHomeSystem(faction, playerSlot);
  const obj = unpack._findFactionSheetOrThrow();
  expect(obj).toBe(factionSheet);
});

it("_findFactionSheetOrThrow (missing)", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const playerSlot: number = 10;

  const unpack = new UnpackHomeSystem(faction, playerSlot);
  expect(() => unpack._findFactionSheetOrThrow()).toThrow();
});

it("_spawnGenericHomeSystemTileOrThrow", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const playerSlot: number = 10;

  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: playerSlot,
  });

  const unpack = new UnpackHomeSystem(faction, playerSlot);
  const obj = unpack._spawnGenericHomeSystemTileOrThrow();
  expect(obj.getOwningPlayerSlot()).toBe(playerSlot);
});

it("_spawnGenericHomeSystemTileOrThrow (missing player seat)", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const playerSlot: number = 10;

  const unpack = new UnpackHomeSystem(faction, playerSlot);
  expect(() => {
    unpack._spawnGenericHomeSystemTileOrThrow();
  }).toThrow();
});

it("_getHomeSystemTileNsid", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const playerSlot: number = 10;

  const unpack = new UnpackHomeSystem(faction, playerSlot);
  const nsid = unpack._getHomeSystemTileNsid();
  expect(nsid).toBe("tile.system:base/5");
});

it("_spawnHomeSystemTile", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const playerSlot: number = 10;

  const unpack = new UnpackHomeSystem(faction, playerSlot);
  const obj = unpack._spawnHomeSystemTile();
  expect(obj.getOwningPlayerSlot()).toBe(playerSlot);
});

it("_findHomeSystemTileOrThrow", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const playerSlot: number = 10;

  const home: GameObject = MockGameObject.simple("tile.system:base/5", {
    owningPlayerSlot: playerSlot,
  });

  const unpack = new UnpackHomeSystem(faction, playerSlot);
  const obj = unpack._findHomeSystemTileOrThrow();
  expect(obj).toBe(home);
});

it("_findHomeSystemTileOrThrow (missing)", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const playerSlot: number = 10;

  const unpack = new UnpackHomeSystem(faction, playerSlot);
  expect(() => unpack._findHomeSystemTileOrThrow()).toThrow();
});

it("_findHomeSystemTileOrThrow (bad tile number)", () => {
  const sourceAndPackageId: SourceAndPackageIdSchemaType = {
    source: "my-source",
    packageId: "my-package-id",
  };
  const factionParams: FactionSchemaType = {
    nsidName: "my-nsid-name",
    name: "my-name",
    abbr: "my-abbr",
    abilities: [],
    commodities: 1,
    home: -9892,
    leaders: {
      agents: [],
      commanders: [],
      heroes: [],
      mechs: [],
    },
    promissories: [],
    startingTechs: [],
    startingUnits: { carrier: 3 },
    factionTechs: [],
    unitOverrides: [],
    extras: [],
  };

  const faction: Faction = new Faction(sourceAndPackageId, factionParams);
  const playerSlot: number = 10;

  const unpack = new UnpackHomeSystem(faction, playerSlot);
  expect(() => unpack._findHomeSystemTileOrThrow()).toThrow();
});

it("_getSurrogateSystemTileNsid (arborec)", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const playerSlot: number = 10;

  const unpack = new UnpackHomeSystem(faction, playerSlot);
  const nsid: string | undefined = unpack._getSurrogateSystemTileNsid();
  expect(nsid).toBeUndefined();
});

it("_getSurrogateSystemTileNsid (creuss)", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/creuss"
  )!;
  const playerSlot: number = 10;

  const unpack = new UnpackHomeSystem(faction, playerSlot);
  const nsid: string | undefined = unpack._getSurrogateSystemTileNsid();
  expect(nsid).toBe("tile.system:base/17");
});

it("_spawnSurrogateSystemTile (arborec)", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const playerSlot: number = 10;

  const unpack = new UnpackHomeSystem(faction, playerSlot);
  const obj: GameObject | undefined = unpack._spawnSurrogateSystemTile();
  expect(obj).toBeUndefined();
});

it("_spawnSurrogateSystemTile (creuss)", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/creuss"
  )!;
  const playerSlot: number = 10;

  const unpack = new UnpackHomeSystem(faction, playerSlot);
  const obj: GameObject | undefined = unpack._spawnSurrogateSystemTile();
  expect(obj).toBeDefined();
});

it("_findSurrogateSystemTile (creuss)", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/creuss"
  )!;
  const playerSlot: number = 10;

  const surrogate: GameObject = MockGameObject.simple("tile.system:base/17", {
    owningPlayerSlot: playerSlot,
  });

  const unpack = new UnpackHomeSystem(faction, playerSlot);
  const obj: GameObject | undefined = unpack._findSurrogateSystemTile();
  expect(obj).toBe(surrogate);
});
