import { GameObject, Vector } from "@tabletop-playground/api";
import { MockContainer, MockGameObject } from "ttpg-mock";

import { Faction } from "../../faction/faction";
import { UnpackStartingUnits } from "./unpack-starting-units";

it("unpack/remove", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const playerSlot: number = 10;

  const carrier: GameObject = new MockGameObject({
    templateMetadata: "unit:base/carrier",
    owningPlayerSlot: playerSlot,
  });
  new MockContainer({
    templateMetadata: "container.unit:base/carrier",
    owningPlayerSlot: playerSlot,
    items: [carrier],
  });

  const cruiser: GameObject = new MockGameObject({
    templateMetadata: "unit:base/cruiser",
    owningPlayerSlot: playerSlot,
  });
  new MockContainer({
    templateMetadata: "container.unit:base/cruiser",
    owningPlayerSlot: playerSlot,
    items: [cruiser],
  });

  const fighter1: GameObject = new MockGameObject({
    templateMetadata: "unit:base/fighter",
    owningPlayerSlot: playerSlot,
  });
  const fighter2: GameObject = new MockGameObject({
    templateMetadata: "unit:base/fighter",
    owningPlayerSlot: playerSlot,
  });
  new MockContainer({
    templateMetadata: "container.unit:base/fighter",
    owningPlayerSlot: playerSlot,
    items: [fighter1, fighter2],
  });

  const infantry1: GameObject = new MockGameObject({
    templateMetadata: "unit:base/infantry",
    owningPlayerSlot: playerSlot,
  });
  const infantry2: GameObject = new MockGameObject({
    templateMetadata: "unit:base/infantry",
    owningPlayerSlot: playerSlot,
  });
  const infantry3: GameObject = new MockGameObject({
    templateMetadata: "unit:base/infantry",
    owningPlayerSlot: playerSlot,
  });
  const infantry4: GameObject = new MockGameObject({
    templateMetadata: "unit:base/infantry",
    owningPlayerSlot: playerSlot,
  });
  new MockContainer({
    templateMetadata: "container.unit:base/infantry",
    owningPlayerSlot: playerSlot,
    items: [infantry1, infantry2, infantry3, infantry4],
  });

  const pds = new MockGameObject({
    templateMetadata: "unit:base/pds",
    owningPlayerSlot: playerSlot,
  });
  new MockContainer({
    templateMetadata: "container.unit:base/pds",
    owningPlayerSlot: playerSlot,
    items: [pds],
  });

  const spaceDock = new MockGameObject({
    templateMetadata: "unit:base/space-dock",
    owningPlayerSlot: playerSlot,
  });
  new MockContainer({
    templateMetadata: "container.unit:base/space-dock",
    owningPlayerSlot: playerSlot,
    items: [spaceDock],
  });

  new MockGameObject({
    templateMetadata: "tile.system:base/5",
    owningPlayerSlot: playerSlot,
  });

  const unpack = new UnpackStartingUnits(faction, playerSlot);
  unpack.unpack();
  unpack.remove();
});

it("_getUnitPlasticOrThrow", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const playerSlot: number = 10;
  const unpack = new UnpackStartingUnits(faction, playerSlot);

  const mech: GameObject = new MockGameObject({
    templateMetadata: "unit:pok/mech",
    owningPlayerSlot: playerSlot,
  });
  new MockContainer({
    templateMetadata: "container.unit:pok/mech",
    owningPlayerSlot: playerSlot,
    items: [mech],
  });

  const dreadnought: GameObject = new MockGameObject({
    templateMetadata: "unit:base/dreadnought",
    owningPlayerSlot: playerSlot,
  });
  new MockContainer({
    templateMetadata: "container.unit:base/dreadnought",
    owningPlayerSlot: playerSlot,
    items: [dreadnought],
  });

  let obj: GameObject;
  obj = unpack._getUnitPlasticOrThrow("mech", new Vector(0, 0, 0));
  expect(obj).toBe(mech);

  obj = unpack._getUnitPlasticOrThrow("dreadnought", new Vector(0, 0, 0));
  expect(obj).toBe(dreadnought);
});

it("_getUnitPlasticOrThrow (empty container)", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const playerSlot: number = 10;
  const unpack = new UnpackStartingUnits(faction, playerSlot);

  new MockContainer({
    templateMetadata: "container.unit:pok/mech",
    owningPlayerSlot: playerSlot,
  });

  expect(() => {
    unpack._getUnitPlasticOrThrow("mech", new Vector(0, 0, 0));
  }).toThrow(/Could not find plastic/);
});

it("_getUnitPlasticOrThrow (missing container)", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const playerSlot: number = 10;
  const unpack = new UnpackStartingUnits(faction, playerSlot);

  expect(() => {
    unpack._getUnitPlasticOrThrow("mech", new Vector(0, 0, 0));
  }).toThrow(/Could not find container/);
});

it("_findHomeSystemTileOrThrow", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const playerSlot: number = 10;
  const unpack = new UnpackStartingUnits(faction, playerSlot);

  const systemTile: GameObject = new MockGameObject({
    templateMetadata: "tile.system:base/5",
    owningPlayerSlot: playerSlot,
  });

  const obj: GameObject = unpack._findHomeSystemTileOrThrow();
  expect(obj).toBe(systemTile);
});

it("_findHomeSystemTileOrThrow (missing tile)", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const playerSlot: number = 10;
  const unpack = new UnpackStartingUnits(faction, playerSlot);

  expect(() => {
    unpack._findHomeSystemTileOrThrow();
  }).toThrow(/Could not find home system tile/);
});
