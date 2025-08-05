import { GameObject, Player, Vector } from "@tabletop-playground/api";
import { MockGameObject, MockPlayer, MockVector } from "ttpg-mock";

import { OnSystemActivated } from "../../../event/on-system-activated/on-system-activated";
import { System } from "../../system-lib/system/system";
import { UnitPlastic } from "./unit-plastic";
import { UnitType } from "../schema/unit-attrs-schema";

it("static getClosestPlastic", () => {
  const plastic1: UnitPlastic | undefined = UnitPlastic.getOne(
    MockGameObject.simple("unit:base/fighter", { position: [1, 0, 0] })
  );
  const plastic2: UnitPlastic | undefined = UnitPlastic.getOne(
    MockGameObject.simple("unit:base/infantry", { position: [2, 0, 0] })
  );
  if (!plastic1 || !plastic2) {
    throw new Error("Plastics not found");
  }

  const plastics: Array<UnitPlastic> = [plastic1, plastic2];
  let closest: UnitPlastic | undefined;

  closest = UnitPlastic.getClosestPlastic(new Vector(1, 0, 0), plastics);
  expect(closest).toBe(plastic1);

  closest = UnitPlastic.getClosestPlastic(new Vector(2, 0, 0), plastics);
  expect(closest).toBe(plastic2);
});

it("constructor", () => {
  const unit: UnitType = "infantry";
  const count: number = 1;
  const obj: GameObject = new MockGameObject();
  new UnitPlastic(unit, count, obj, obj.getPosition());
});

it("getOne (plastic)", () => {
  const obj: GameObject = new MockGameObject({
    templateMetadata: "unit:base/infantry",
    owningPlayerSlot: 2,
  });
  const entry: UnitPlastic | undefined = UnitPlastic.getOne(obj);
  expect(entry?.getCount()).toBe(1);
  expect(entry?.getHex()).toBe("<0,0,0>");
  expect(entry?.getObj()).toBe(obj);
  expect(entry?.getOwningPlayerSlot()).toBe(2);
  expect(entry?.getPlanetClosest()).toBeUndefined();
  expect(entry?.getPlanetExact()).toBeUndefined();
  expect(entry?.getUnit()).toBe("infantry");
});

it("getOne (mech)", () => {
  const obj: GameObject = new MockGameObject({
    templateMetadata: "unit:pok/mech",
  });
  const entry: UnitPlastic | undefined = UnitPlastic.getOne(obj);
  expect(entry?.getUnit()).toBe("mech");
});

it("getOne (unknown)", () => {
  const obj: GameObject = new MockGameObject({
    templateMetadata: "unit:base/__unknown__",
  });
  const entry: UnitPlastic | undefined = UnitPlastic.getOne(obj);
  expect(entry).toBeUndefined();
});

it("getOne (invalid nsid, match enough to check)", () => {
  const obj: GameObject = new MockGameObject({
    templateMetadata: "unit:@@@",
  });
  const entry: UnitPlastic | undefined = UnitPlastic.getOne(obj);
  expect(entry).toBeUndefined();
});

it("getOne (fighter-1 token)", () => {
  const obj: GameObject = new MockGameObject({
    templateMetadata: "token:base/fighter-1",
  });
  const entry: UnitPlastic | undefined = UnitPlastic.getOne(obj);
  expect(entry?.getCount()).toBe(1);
  expect(entry?.getHex()).toBe("<0,0,0>");
  expect(entry?.getObj()).toBe(obj);
  expect(entry?.getOwningPlayerSlot()).toBe(-1);
  expect(entry?.getPlanetClosest()).toBeUndefined();
  expect(entry?.getPlanetExact()).toBeUndefined();
  expect(entry?.getUnit()).toBe("fighter");
});

it("getOne (fighter-3 token)", () => {
  const obj: GameObject = new MockGameObject({
    templateMetadata: "token:base/fighter-3",
  });
  const entry: UnitPlastic | undefined = UnitPlastic.getOne(obj);
  expect(entry?.getCount()).toBe(3);
  expect(entry?.getHex()).toBe("<0,0,0>");
  expect(entry?.getObj()).toBe(obj);
  expect(entry?.getOwningPlayerSlot()).toBe(-1);
  expect(entry?.getPlanetClosest()).toBeUndefined();
  expect(entry?.getPlanetExact()).toBeUndefined();
  expect(entry?.getUnit()).toBe("fighter");
});

it("getOne (infantry-1 token)", () => {
  const obj: GameObject = new MockGameObject({
    templateMetadata: "token:base/infantry-1",
  });
  const entry: UnitPlastic | undefined = UnitPlastic.getOne(obj);
  expect(entry?.getCount()).toBe(1);
  expect(entry?.getHex()).toBe("<0,0,0>");
  expect(entry?.getObj()).toBe(obj);
  expect(entry?.getOwningPlayerSlot()).toBe(-1);
  expect(entry?.getPlanetClosest()).toBeUndefined();
  expect(entry?.getPlanetExact()).toBeUndefined();
  expect(entry?.getUnit()).toBe("infantry");
});

it("getOne (infantry-3 token)", () => {
  const obj: GameObject = new MockGameObject({
    templateMetadata: "token:base/infantry-3",
  });
  const entry: UnitPlastic | undefined = UnitPlastic.getOne(obj);
  expect(entry?.getCount()).toBe(3);
  expect(entry?.getHex()).toBe("<0,0,0>");
  expect(entry?.getObj()).toBe(obj);
  expect(entry?.getOwningPlayerSlot()).toBe(-1);
  expect(entry?.getPlanetClosest()).toBeUndefined();
  expect(entry?.getPlanetExact()).toBeUndefined();
  expect(entry?.getUnit()).toBe("infantry");
});

it("getOne (control-token)", () => {
  const obj: GameObject = new MockGameObject({
    templateMetadata: "token.control:base/sol",
    owningPlayerSlot: 2,
  });
  const entry: UnitPlastic | undefined = UnitPlastic.getOne(obj);
  expect(entry?.getCount()).toBe(1);
  expect(entry?.getHex()).toBe("<0,0,0>");
  expect(entry?.getObj()).toBe(obj);
  expect(entry?.getOwningPlayerSlot()).toBe(2);
  expect(entry?.getPlanetClosest()).toBeUndefined();
  expect(entry?.getPlanetExact()).toBeUndefined();
  expect(entry?.getUnit()).toBe("control-token");
});

it("getOne (galvanize-token)", () => {
  const obj: GameObject = new MockGameObject({
    templateMetadata: "token:thunders-edge:galvanize",
  });
  const entry: UnitPlastic | undefined = UnitPlastic.getOne(obj);
  expect(entry?.getCount()).toBe(1);
  expect(entry?.getHex()).toBe("<0,0,0>");
  expect(entry?.getObj()).toBe(obj);
  expect(entry?.getOwningPlayerSlot()).toBe(-1);
  expect(entry?.getPlanetClosest()).toBeUndefined();
  expect(entry?.getPlanetExact()).toBeUndefined();
  expect(entry?.getUnit()).toBe("galvanize-token");
});

it("getAll (empty)", () => {
  const result: Array<UnitPlastic> = UnitPlastic.getAll();
  expect(result).toEqual([]);
});

it("getAll (single)", () => {
  const obj: GameObject = new MockGameObject({
    templateMetadata: "unit:base/infantry",
  });
  const result: Array<UnitPlastic> = UnitPlastic.getAll();
  expect(result).toHaveLength(1);
  expect(result[0]?.getUnit()).toBe("infantry");
  expect(result[0]?.getObj()).toBe(obj);
});

it("getAll (single, mech)", () => {
  const obj: GameObject = new MockGameObject({
    templateMetadata: "unit:pok/mech",
  });
  const result: Array<UnitPlastic> = UnitPlastic.getAll();
  expect(result).toHaveLength(1);
  expect(result[0]?.getUnit()).toBe("mech");
  expect(result[0]?.getObj()).toBe(obj);
});

it("assignOwners", () => {
  const plastic: UnitPlastic = new UnitPlastic(
    "infantry",
    1,
    new MockGameObject({ owningPlayerSlot: 2 }),
    new MockVector(0, 0, 0)
  );
  const token: UnitPlastic = new UnitPlastic(
    "infantry",
    1,
    new MockGameObject(),
    new MockVector(0, 0, 0)
  );
  expect(plastic.getOwningPlayerSlot()).toBe(2);
  expect(token.getOwningPlayerSlot()).toBe(-1);
  expect(token.getLinkedPlastic()).toBeUndefined();

  UnitPlastic.assignOwners([plastic, token]);
  expect(plastic.getOwningPlayerSlot()).toBe(2);
  expect(token.getOwningPlayerSlot()).toBe(2);
  expect(token.getLinkedPlastic()).toBe(plastic);
});

it("assignPlanets", () => {
  new MockGameObject({ templateMetadata: "tile.system:base/1" });
  const plastic: UnitPlastic = new UnitPlastic(
    "infantry",
    1,
    new MockGameObject(),
    new MockVector(0, 0, 0)
  );
  expect(plastic.getPos().toString()).toBe("(X=0,Y=0,Z=0)");

  // Compute a position still inside the hex, but off the planet.
  const pos: Vector = TI4.hex.toPosition("<1,0,-1>").multiply(0.45);
  const plasticOffPlanet: UnitPlastic = new UnitPlastic(
    "infantry",
    1,
    new MockGameObject({ position: pos }),
    pos
  );
  expect(plasticOffPlanet.getHex()).toBe("<0,0,0>");
  expect(plasticOffPlanet.getPos().toString()).toBe("(X=6.754,Y=0,Z=0)");

  expect(plastic.getSystem()).toBeUndefined();
  expect(plastic.getPlanetClosest()).toBeUndefined();
  expect(plastic.getPlanetExact()).toBeUndefined();
  expect(plasticOffPlanet.getPlanetClosest()).toBeUndefined();
  expect(plasticOffPlanet.getPlanetExact()).toBeUndefined();

  UnitPlastic.assignPlanets([plastic, plasticOffPlanet]);
  expect(plastic.getSystem()?.getSystemTileNumber()).toBe(1);
  expect(plastic.getPlanetClosest()).toBeDefined();
  expect(plastic.getPlanetExact()).toBeDefined();
  expect(plasticOffPlanet.getPlanetClosest()).toBeDefined();
  expect(plasticOffPlanet.getPlanetExact()).toBeUndefined();
});

it("combat arena", () => {
  const arena: GameObject = new MockGameObject({
    templateMetadata: "mat:base/combat-arena",
    position: [10, 0, 0],
    _modelSize: [4, 4, 4],
  });
  expect(arena.getExtent(false, false).toString()).toBe("(X=2,Y=2,Z=2)");

  const systemTileObj: GameObject = new MockGameObject({
    templateMetadata: "tile.system:base/1",
    position: [-10, 0, 0],
    _modelSize: [2, 2, 2],
  });
  expect(systemTileObj.getExtent(false, false).toString()).toBe(
    "(X=1,Y=1,Z=1)"
  );
  const system: System | undefined = TI4.systemRegistry.getBySystemTileObjId(
    systemTileObj.getId()
  );
  expect(system).toBeDefined();
  if (!system) {
    throw new Error("system not found");
  }
  let triggerCount = 0;
  TI4.events.onSystemActivated.add((_system: System, _player: Player) => {
    triggerCount++;
  });
  const player: Player = new MockPlayer();
  TI4.events.onSystemActivated.trigger(system, player);
  expect(triggerCount).toBe(1);
  expect(OnSystemActivated.getLastActivatedSystem()).toBeDefined();

  const unitObj: GameObject = new MockGameObject({
    templateMetadata: "unit:base/infantry",
    position: [11, 1, 0],
    _modelSize: [1, 1, 1],
  });
  const plastic: UnitPlastic = UnitPlastic.getOne(unitObj)!;
  expect(plastic.getPos().toString()).toBe("(X=-9.5,Y=0.5,Z=0)");
  expect(plastic.getHex()).toBe(
    TI4.hex.fromPosition(systemTileObj.getPosition())
  );

  const outsideAreaUnitObj: GameObject = new MockGameObject({
    templateMetadata: "unit:base/infantry",
    position: [100, 0, 0],
    _modelSize: [1, 1, 1],
  });
  const outsidePlastic: UnitPlastic = UnitPlastic.getOne(outsideAreaUnitObj)!;
  expect(outsidePlastic.getPos().toString()).toBe("(X=100,Y=0,Z=0)");
});
