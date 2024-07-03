/**
 * Utility functions to simplify unit modifier tests.
 * Use the ".test.ts" naming to prevent including in the mod build.
 */
import { Vector } from "@tabletop-playground/api";
import { MockCard, MockCardHolder, MockGameObject } from "ttpg-mock";
import { UnitType } from "../../schema/unit-attrs-schema";

export const SELF: number = 1;
export const OPPONENT: number = 2;

export function placeGameObjects(params: {
  systemNsid?: string; // default is tile 1
  self?: Array<string>;
  selfUnits?: Map<UnitType, number>;
  selfUnitsSpace?: Map<UnitType, number>; // in hex, not over planet
  selfUnitsAdj?: Map<UnitType, number>;
  opponent?: Array<string>;
  opponentUnits?: Map<UnitType, number>;
  opponentUnitsSpace?: Map<UnitType, number>;
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
  for (const [unit, count] of params.selfUnitsSpace ?? []) {
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
  for (const [unit, count] of params.opponentUnitsSpace ?? []) {
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
