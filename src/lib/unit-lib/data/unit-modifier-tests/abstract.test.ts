/**
 * Utility functions to simplify unit modifier tests.
 * Use the ".test.ts" naming to prevent including in the mod build.
 */
import { GameObject, Vector } from "@tabletop-playground/api";
import { MockCard, MockCardHolder, MockGameObject } from "ttpg-mock";
import { Find } from "ttpg-darrell";
import { UnitType } from "../../schema/unit-attrs-schema";

export const SELF: number = 1;
export const OPPONENT: number = 2;

export function placeGameObjects(params: {
  systemNsid?: string; // default is tile 1
  self?: Array<string>;
  selfUnits?: Map<UnitType, number>;
  selfUnitsOffPlanet?: Map<UnitType, number>; // in hex, not over planet
  selfUnitsAdj?: Map<UnitType, number>;
  opponent?: Array<string>;
  opponentUnits?: Map<UnitType, number>;
  opponentUnitsOffPlanet?: Map<UnitType, number>;
  opponentUnitsAdj?: Map<UnitType, number>;
}) {
  // Player areas.
  const selfPos: Vector = new Vector(100, 0, 0);
  const opponentPos: Vector = new Vector(-100, 0, 0);

  // Map positions.
  const hexPos: Vector = TI4.hex.toPosition("<0,0,0>");
  const adjHexPos: Vector = TI4.hex.toPosition("<1,0,-1>");
  const hexPosOffPlanet: Vector = Vector.lerp(hexPos, adjHexPos, 0.45);

  // Create tile (at origin) and adjacent tile (2).
  const systemNsid: string = params.systemNsid ?? "tile.system:base/1";
  MockGameObject.simple(systemNsid);
  MockGameObject.simple("tile.system:base/2", { position: adjHexPos });

  // Upgrades and modifiers get assigned to the closest card holder owner.
  new MockCardHolder({
    owningPlayerSlot: SELF,
    position: selfPos,
  });
  new MockCardHolder({
    owningPlayerSlot: OPPONENT,
    position: opponentPos,
  });

  // Create nsid objects.
  for (const nsid of params.self ?? []) {
    if (nsid.startsWith("card.")) {
      MockCard.simple(nsid, { position: selfPos });
    } else {
      MockGameObject.simple(nsid, { position: selfPos });
    }
    for (const nsid of params.opponent ?? []) {
      if (nsid.startsWith("card.")) {
        MockCard.simple(nsid, { position: opponentPos });
      } else {
        MockGameObject.simple(nsid, { position: opponentPos });
      }
    }
  }

  // Create unit objects.
  for (const [unit, count] of params.selfUnits ?? []) {
    const source: string = unit === "mech" ? "pok" : "base";
    for (let i = 0; i < count; i++) {
      MockGameObject.simple(`unit:${source}/${unit}`, {
        owningPlayerSlot: SELF,
        position: hexPos,
      });
    }
  }
  for (const [unit, count] of params.selfUnitsOffPlanet ?? []) {
    const source: string = unit === "mech" ? "pok" : "base";
    for (let i = 0; i < count; i++) {
      MockGameObject.simple(`unit:${source}/${unit}`, {
        owningPlayerSlot: SELF,
        position: hexPosOffPlanet,
      });
    }
  }
  for (const [unit, count] of params.opponentUnits ?? []) {
    const source: string = unit === "mech" ? "pok" : "base";
    for (let i = 0; i < count; i++) {
      MockGameObject.simple(`unit:${source}/${unit}`, {
        owningPlayerSlot: OPPONENT,
        position: hexPos,
      });
    }
  }
  for (const [unit, count] of params.opponentUnitsOffPlanet ?? []) {
    const source: string = unit === "mech" ? "pok" : "base";
    for (let i = 0; i < count; i++) {
      MockGameObject.simple(`unit:${source}/${unit}`, {
        owningPlayerSlot: OPPONENT,
        position: hexPosOffPlanet,
      });
    }
  }
  for (const [unit, count] of params.selfUnitsAdj ?? []) {
    const source: string = unit === "mech" ? "pok" : "base";
    for (let i = 0; i < count; i++) {
      MockGameObject.simple(`unit:${source}/${unit}`, {
        owningPlayerSlot: SELF,
        position: adjHexPos,
      });
    }
  }
  for (const [unit, count] of params.opponentUnitsAdj ?? []) {
    const source: string = unit === "mech" ? "pok" : "base";
    for (let i = 0; i < count; i++) {
      MockGameObject.simple(`unit:${source}/${unit}`, {
        owningPlayerSlot: OPPONENT,
        position: adjHexPos,
      });
    }
  }
}

it("placeGameObjects (empty)", () => {
  placeGameObjects({});
});

it("placeGameObjects (all)", () => {
  placeGameObjects({
    systemNsid: "tile.system:base/3",
    self: ["card.action:base/direct-hit"],
    selfUnits: new Map([
      ["carrier", 1],
      ["fighter", 1],
    ]),
    selfUnitsOffPlanet: new Map([["mech", 1]]),
    selfUnitsAdj: new Map([["destroyer", 1]]),
    opponent: ["card.action:base/sabotage"],
    opponentUnits: new Map([["dreadnought", 1]]),
    opponentUnitsOffPlanet: new Map([["infantry", 1]]),
    opponentUnitsAdj: new Map([["cruiser", 1]]),
  });

  const find = new Find();
  let obj: GameObject | undefined;

  obj = find.findGameObject("tile.system:base/3");
  expect(obj?.getPosition().toString()).toEqual("(X=0,Y=0,Z=0)");

  obj = find.findGameObject("card.action:base/direct-hit");
  expect(obj?.getPosition().toString()).toEqual("(X=100,Y=0,Z=0)");

  obj = find.findGameObject("unit:base/carrier");
  expect(obj?.getPosition().toString()).toEqual("(X=0,Y=0,Z=0)");
  expect(obj?.getOwningPlayerSlot()).toEqual(SELF);

  obj = find.findGameObject("unit:base/fighter");
  expect(obj?.getPosition().toString()).toEqual("(X=0,Y=0,Z=0)");
  expect(obj?.getOwningPlayerSlot()).toEqual(SELF);

  obj = find.findGameObject("unit:pok/mech");
  expect(obj?.getPosition().toString()).toEqual("(X=6.754,Y=0,Z=0)");
  expect(obj?.getOwningPlayerSlot()).toEqual(SELF);

  obj = find.findGameObject("unit:base/destroyer");
  expect(obj?.getPosition().toString()).toEqual("(X=15.01,Y=0,Z=0)");
  expect(obj?.getOwningPlayerSlot()).toEqual(SELF);

  obj = find.findGameObject("card.action:base/sabotage");
  expect(obj?.getPosition().toString()).toEqual("(X=-100,Y=0,Z=0)");

  obj = find.findGameObject("unit:base/dreadnought");
  expect(obj?.getPosition().toString()).toEqual("(X=0,Y=0,Z=0)");
  expect(obj?.getOwningPlayerSlot()).toEqual(OPPONENT);

  obj = find.findGameObject("unit:base/infantry");
  expect(obj?.getPosition().toString()).toEqual("(X=6.754,Y=0,Z=0)");
  expect(obj?.getOwningPlayerSlot()).toEqual(OPPONENT);

  obj = find.findGameObject("unit:base/cruiser");
  expect(obj?.getPosition().toString()).toEqual("(X=15.01,Y=0,Z=0)");
  expect(obj?.getOwningPlayerSlot()).toEqual(OPPONENT);
});
