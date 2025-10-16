import { HexType } from "ttpg-darrell";
import { CombatRoll } from "../../../../combat-lib";
import { UnitModifierSchemaType, UnitType } from "../../../schema";
import { UnitAttrs, CombatAttrs } from "../../../unit-attrs";
import { UnitPlastic } from "../../../unit-plastic";

export type LinkshipCount = {
  pdsHex: number;
  spaceDockHex: number;
  linkshipPdsHex: number;
  linkshipSpaceDockHex: number;
  pdsAdj: number;
  spaceDockAdj: number;
  linkshipPdsAdj: number;
  linkshipSpaceDockAdj: number;
};

export function _preferSpaceDockSpaceCannon(combatRoll: CombatRoll): boolean {
  const pds: UnitAttrs = combatRoll.self.unitAttrsSet.getOrThrow("pds");
  const spaceDock: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("space-dock");
  const pdsSpaceCannon: CombatAttrs | undefined = pds.getSpaceCannon();
  const spaceDockSpaceCannon: CombatAttrs | undefined =
    spaceDock.getSpaceCannon();
  return (
    pdsSpaceCannon !== undefined &&
    spaceDockSpaceCannon !== undefined &&
    spaceDockSpaceCannon.getHit() < pdsSpaceCannon.getHit()
  );
}

export function _countLinkship(
  combatRoll: CombatRoll,
  restrictToSpaceCannonCount: boolean
): LinkshipCount {
  const hexToPdsPlanetCount: Map<string, number> = new Map();
  const hexToPdsSpaceCount: Map<string, number> = new Map();
  const hexToSpaceDockPlanetCount: Map<string, number> = new Map();
  const hexToSpaceDockSpaceCount: Map<string, number> = new Map();
  const hexToDestroyerCount: Map<string, number> = new Map();

  const hexes: Set<HexType> = new Set();
  const updateCount = (plastic: UnitPlastic): void => {
    const hex: HexType = plastic.getHex();
    hexes.add(hex);
    if (plastic.getUnit() === "pds") {
      if (plastic.getPlanetExact()) {
        const count: number = hexToPdsPlanetCount.get(hex) || 0;
        hexToPdsPlanetCount.set(hex, count + 1);
      } else {
        const count: number = hexToPdsSpaceCount.get(hex) || 0;
        hexToPdsSpaceCount.set(hex, count + 1);
      }
    } else if (plastic.getUnit() === "space-dock") {
      if (plastic.getPlanetExact()) {
        const count: number = hexToSpaceDockPlanetCount.get(hex) || 0;
        hexToSpaceDockPlanetCount.set(hex, count + 1);
      } else {
        const count: number = hexToSpaceDockSpaceCount.get(hex) || 0;
        hexToSpaceDockSpaceCount.set(hex, count + 1);
      }
    } else if (plastic.getUnit() === "destroyer") {
      const count: number = hexToDestroyerCount.get(hex) || 0;
      hexToDestroyerCount.set(hex, count + 1);
    }
  };
  combatRoll.self.unitPlasticHex.forEach(updateCount);
  combatRoll.self.unitPlasticAdj.forEach(updateCount);

  const result: LinkshipCount = {
    pdsHex: 0,
    spaceDockHex: 0,
    linkshipPdsHex: 0,
    linkshipSpaceDockHex: 0,
    pdsAdj: 0,
    spaceDockAdj: 0,
    linkshipPdsAdj: 0,
    linkshipSpaceDockAdj: 0,
  };

  const preferSpaceDock: boolean = _preferSpaceDockSpaceCannon(combatRoll);

  hexes.forEach((hex: HexType): void => {
    const pdsPlanetCount: number = hexToPdsPlanetCount.get(hex) || 0;
    let pdsSpaceCount: number = hexToPdsSpaceCount.get(hex) || 0;
    const spaceDockPlanetCount: number =
      hexToSpaceDockPlanetCount.get(hex) || 0;
    let spaceDockSpaceCount: number = hexToSpaceDockSpaceCount.get(hex) || 0;
    const destroyerCount: number = hexToDestroyerCount.get(hex) || 0;

    if (!restrictToSpaceCannonCount) {
      if (pdsSpaceCount > 0) {
        pdsSpaceCount = Number.MAX_SAFE_INTEGER;
      }
      if (spaceDockSpaceCount > 0) {
        spaceDockSpaceCount = Number.MAX_SAFE_INTEGER;
      }
    }

    if (hex === combatRoll.getHex()) {
      result.pdsHex += pdsPlanetCount;
      result.spaceDockHex += spaceDockPlanetCount;

      let remaining: number = destroyerCount;

      let count: number;
      let consume: number;
      if (preferSpaceDock) {
        count = spaceDockSpaceCount;
        consume = Math.min(count, remaining);
        count -= consume;
        remaining -= consume;
        result.linkshipSpaceDockHex += consume;

        count = pdsSpaceCount;
        consume = Math.min(count, remaining);
        count -= consume;
        remaining -= consume;
        result.linkshipPdsHex += consume;
      } else {
        count = pdsSpaceCount;
        consume = Math.min(count, remaining);
        count -= consume;
        remaining -= consume;
        result.linkshipPdsHex += consume;

        count = spaceDockSpaceCount;
        consume = Math.min(count, remaining);
        count -= consume;
        remaining -= consume;
        result.linkshipSpaceDockHex += consume;
      }
    } else {
      result.pdsAdj += pdsPlanetCount;
      result.spaceDockAdj += spaceDockPlanetCount;

      let remaining: number = destroyerCount;

      let count: number;
      let consume: number;
      if (preferSpaceDock) {
        count = spaceDockSpaceCount;
        consume = Math.min(count, remaining);
        count -= consume;
        remaining -= consume;
        result.linkshipSpaceDockAdj += consume;

        count = pdsSpaceCount;
        consume = Math.min(count, remaining);
        count -= consume;
        remaining -= consume;
        result.linkshipPdsAdj += consume;
      } else {
        count = pdsSpaceCount;
        consume = Math.min(count, remaining);
        count -= consume;
        remaining -= consume;
        result.linkshipPdsAdj += consume;

        count = spaceDockSpaceCount;
        consume = Math.min(count, remaining);
        count -= consume;
        remaining -= consume;
        result.linkshipSpaceDockAdj += consume;
      }
    }
  });

  return result;
}

export const Linkship: UnitModifierSchemaType = {
  name: "Linkship",
  description:
    "Linkships get SPACE CANNON of a structure in the space area, linkships cannot share structures",
  triggers: [
    {
      cardClass: "unit",
      nsidName: "linkship",
    },
  ],
  owner: "self",
  priority: "choose",
  applies: (combatRoll: CombatRoll): boolean => {
    if (combatRoll.getRollType() !== "spaceCannonOffense") {
      return false;
    }
    const linkshipCount: LinkshipCount = _countLinkship(combatRoll, true);
    return (
      linkshipCount.linkshipPdsHex > 0 ||
      linkshipCount.linkshipPdsAdj > 0 ||
      linkshipCount.linkshipSpaceDockHex > 0 ||
      linkshipCount.linkshipSpaceDockAdj > 0
    );
  },
  apply: (combatRoll: CombatRoll): void => {
    const pds: CombatAttrs | undefined = combatRoll.getUnitCombatAttrs("pds");
    const spaceDock: CombatAttrs | undefined =
      combatRoll.getUnitCombatAttrs("space-dock");
    const linkshipCount: LinkshipCount = _countLinkship(combatRoll, true);

    combatRoll.self.overrideUnitCountHex.set("pds", linkshipCount.pdsHex);
    combatRoll.self.overrideUnitCountHex.set(
      "space-dock",
      linkshipCount.spaceDockHex
    );
    combatRoll.self.overrideUnitCountAdj.set("pds", linkshipCount.pdsAdj);
    combatRoll.self.overrideUnitCountAdj.set(
      "space-dock",
      linkshipCount.spaceDockAdj
    );

    let linkshipPdsCount: number = linkshipCount.linkshipPdsHex;
    if (pds && pds.getRange() > 0) {
      linkshipPdsCount += linkshipCount.linkshipPdsAdj;
    }
    if (pds && linkshipPdsCount > 0) {
      combatRoll.self.addSyntheticUnit(
        {
          name: "Linkship (pds)",
          unit: "linkship-pds" as UnitType,
          spaceCannon: {
            hit: pds.getHit(),
            dice: pds.getDice(),
            rerollMisses: pds.getRerollMisses(),
          },
        },
        linkshipPdsCount
      );
    }

    let linkshipSpaceDockCount: number = linkshipCount.linkshipSpaceDockHex;
    if (spaceDock && spaceDock.getRange() > 0) {
      linkshipSpaceDockCount += linkshipCount.linkshipSpaceDockAdj;
    }
    if (spaceDock && linkshipPdsCount > 0) {
      combatRoll.self.addSyntheticUnit(
        {
          name: "Linkship (space dock)",
          unit: "linkship-space-dock" as UnitType,
          spaceCannon: {
            hit: spaceDock.getHit(),
            dice: spaceDock.getDice(),
            rerollMisses: spaceDock.getRerollMisses(),
          },
        },
        linkshipSpaceDockCount
      );
    }
  },
};
