import { GameObject } from "@tabletop-playground/api";
import { MockContainer, MockGameObject } from "ttpg-mock";

import { Faction } from "../../faction/faction";
import { UnpackStartingUnits } from "./unpack-starting-units";

it("unpack/remove", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const playerSlot: number = 10;
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
  obj = unpack._getUnitPlasticOrThrow("mech");
  expect(obj).toBe(mech);

  obj = unpack._getUnitPlasticOrThrow("dreadnought");
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
    unpack._getUnitPlasticOrThrow("mech");
  }).toThrow(/Could not find plastic/);
});

it("_getUnitPlasticOrThrow (missing container)", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const playerSlot: number = 10;
  const unpack = new UnpackStartingUnits(faction, playerSlot);

  expect(() => {
    unpack._getUnitPlasticOrThrow("mech");
  }).toThrow(/Could not find container/);
});
