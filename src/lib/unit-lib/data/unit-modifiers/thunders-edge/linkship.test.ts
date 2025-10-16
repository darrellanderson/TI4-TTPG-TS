import { CombatRollParams, CombatRoll } from "../../../../combat-lib";
import { UnitType } from "../../../schema/unit-attrs-schema";
import { OPPONENT, SELF, placeGameObjects } from "../abstract.test";
import {
  _countLinkship,
  _preferSpaceDockSpaceCannon,
  LinkshipCount,
} from "./linkship";

it("registry", () => {
  const nsid: string = "unit:thunders-edge/linkship";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)).toBeDefined();
});

it("modifier (none)", () => {
  const combatParams: CombatRollParams = {
    rollType: "spaceCannonOffense",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  };

  const combatRoll = CombatRoll.createCooked(combatParams);
  expect(combatRoll.getUnitModifierNames()).toEqual([]);
  expect(
    combatRoll.self.unitAttrsSet.get("linkship-pds" as UnitType)
  ).toBeUndefined();
  expect(
    combatRoll.self.unitAttrsSet.get("linkship-space-dock" as UnitType)
  ).toBeUndefined();
  expect(
    combatRoll.self.unitAttrsSet
      .getOrThrow("pds" as UnitType)
      .getSpaceCannonOrThrow()
      .getHit()
  ).toBe(6);
});

it("modifier (pds)", () => {
  const combatParams: CombatRollParams = {
    rollType: "spaceCannonOffense",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  };

  placeGameObjects({
    self: ["unit:thunders-edge/linkship"],
    selfUnits: new Map<UnitType, number>([["destroyer", 3]]),
    selfUnitsOffPlanet: new Map<UnitType, number>([
      ["pds", 2],
      ["space-dock", 2],
    ]),
  });

  const combatRoll: CombatRoll = CombatRoll.createCooked(combatParams);
  expect(combatRoll.getUnitModifierNames()).toEqual(["Linkship"]);

  expect(combatRoll.self.getCount("linkship-pds" as UnitType)).toBe(2);
  expect(combatRoll.self.getCount("linkship-space-dock" as UnitType)).toBe(0);

  expect(
    combatRoll.self.unitAttrsSet
      .getOrThrow("linkship-pds" as UnitType)
      .getSpaceCannonOrThrow()
      .getHit()
  ).toBe(6);

  expect(
    combatRoll.self.unitAttrsSet.get("linkship-space-dock" as UnitType)
  ).toBeUndefined();
});

it("modifier (space-dock)", () => {
  const combatParams: CombatRollParams = {
    rollType: "spaceCannonOffense",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  };

  placeGameObjects({
    self: [
      "unit:thunders-edge/linkship",
      "card.relic:thunders-edge/lightrail-ordnance",
    ],
    selfUnits: new Map<UnitType, number>([["destroyer", 3]]),
    selfUnitsOffPlanet: new Map<UnitType, number>([
      ["pds", 2],
      ["space-dock", 2],
    ]),
  });

  const combatRoll: CombatRoll = CombatRoll.createCooked(combatParams);
  expect(combatRoll.getUnitModifierNames()).toEqual([
    "Lightrail Ordnance",
    "Linkship",
  ]);

  expect(combatRoll.self.getCount("linkship-pds" as UnitType)).toBe(1);
  expect(combatRoll.self.getCount("linkship-space-dock" as UnitType)).toBe(2);

  expect(
    combatRoll.self.unitAttrsSet
      .getOrThrow("linkship-pds" as UnitType)
      .getSpaceCannonOrThrow()
      .getHit()
  ).toBe(6);

  expect(
    combatRoll.self.unitAttrsSet
      .getOrThrow("linkship-space-dock" as UnitType)
      .getSpaceCannonOrThrow()
      .getHit()
  ).toBe(5);
});

it("_preferSpaceDockSpaceCannon (no)", () => {
  const combatParams: CombatRollParams = {
    rollType: "spaceCannonOffense",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  };
  placeGameObjects({
    self: ["unit:thunders-edge/linkship"],
    selfUnits: new Map<UnitType, number>([["destroyer", 3]]),
    selfUnitsOffPlanet: new Map<UnitType, number>([
      ["pds", 2],
      ["space-dock", 2],
    ]),
  });

  const combatRoll: CombatRoll = CombatRoll.createCooked(combatParams);
  expect(combatRoll.getUnitModifierNames()).toEqual(["Linkship"]);
  const preferSpaceDock: boolean = _preferSpaceDockSpaceCannon(combatRoll);
  expect(preferSpaceDock).toBe(false);
});

it("_preferSpaceDockSpaceCannon (yes)", () => {
  const combatParams: CombatRollParams = {
    rollType: "spaceCannonOffense",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  };
  placeGameObjects({
    self: [
      "unit:thunders-edge/linkship",
      "card.relic:thunders-edge/lightrail-ordnance",
    ],
    selfUnits: new Map<UnitType, number>([["destroyer", 3]]),
    selfUnitsOffPlanet: new Map<UnitType, number>([
      ["pds", 2],
      ["space-dock", 2],
    ]),
  });

  const combatRoll: CombatRoll = CombatRoll.createCooked(combatParams);
  expect(combatRoll.getUnitModifierNames()).toEqual([
    "Lightrail Ordnance",
    "Linkship",
  ]);
  const preferSpaceDock: boolean = _preferSpaceDockSpaceCannon(combatRoll);
  expect(preferSpaceDock).toBe(true);
});

it("_countLinkship (restrict)", () => {
  placeGameObjects({
    self: ["unit:thunders-edge/linkship"],
    selfUnits: new Map<UnitType, number>([["destroyer", 3]]),
    selfUnitsOffPlanet: new Map<UnitType, number>([
      ["pds", 2],
      ["space-dock", 2],
    ]),
  });

  const combatParams: CombatRollParams = {
    rollType: "spaceCannonOffense",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  };
  const combatRoll: CombatRoll = CombatRoll.createCooked(combatParams);
  const linkshipCount: LinkshipCount = _countLinkship(combatRoll, true);
  expect(linkshipCount).toEqual({
    linkshipPdsAdj: 0,
    linkshipPdsHex: 2,
    linkshipSpaceDockAdj: 0,
    linkshipSpaceDockHex: 1,
    pdsAdj: 0,
    pdsHex: 0,
    spaceDockAdj: 0,
    spaceDockHex: 0,
  });
});

it("_countLinkship (no restrict)", () => {
  placeGameObjects({
    self: ["unit:thunders-edge/linkship"],
    selfUnits: new Map<UnitType, number>([["destroyer", 3]]),
    selfUnitsOffPlanet: new Map<UnitType, number>([
      ["pds", 2],
      ["space-dock", 2],
    ]),
  });

  const combatParams: CombatRollParams = {
    rollType: "spaceCannonOffense",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  };
  const combatRoll: CombatRoll = CombatRoll.createCooked(combatParams);
  const linkshipCount: LinkshipCount = _countLinkship(combatRoll, false);
  expect(linkshipCount).toEqual({
    linkshipPdsAdj: 0,
    linkshipPdsHex: 3,
    linkshipSpaceDockAdj: 0,
    linkshipSpaceDockHex: 0,
    pdsAdj: 0,
    pdsHex: 0,
    spaceDockAdj: 0,
    spaceDockHex: 0,
  });
});

it("_countLinkship (restrict, prefer space dock)", () => {
  placeGameObjects({
    self: [
      "unit:thunders-edge/linkship",
      "card.relic:thunders-edge/lightrail-ordnance",
    ],
    selfUnits: new Map<UnitType, number>([["destroyer", 3]]),
    selfUnitsOffPlanet: new Map<UnitType, number>([
      ["pds", 2],
      ["space-dock", 2],
    ]),
  });

  const combatParams: CombatRollParams = {
    rollType: "spaceCannonOffense",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  };
  const combatRoll: CombatRoll = CombatRoll.createCooked(combatParams);
  const linkshipCount: LinkshipCount = _countLinkship(combatRoll, true);
  expect(linkshipCount).toEqual({
    linkshipPdsAdj: 0,
    linkshipPdsHex: 1,
    linkshipSpaceDockAdj: 0,
    linkshipSpaceDockHex: 2,
    pdsAdj: 0,
    pdsHex: 0,
    spaceDockAdj: 0,
    spaceDockHex: 0,
  });
});

it("_countLinkship (no restrict, prefer space dock)", () => {
  placeGameObjects({
    self: [
      "unit:thunders-edge/linkship",
      "card.relic:thunders-edge/lightrail-ordnance",
    ],
    selfUnits: new Map<UnitType, number>([["destroyer", 3]]),
    selfUnitsOffPlanet: new Map<UnitType, number>([
      ["pds", 2],
      ["space-dock", 2],
    ]),
  });

  const combatParams: CombatRollParams = {
    rollType: "spaceCannonOffense",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  };
  const combatRoll: CombatRoll = CombatRoll.createCooked(combatParams);
  const linkshipCount: LinkshipCount = _countLinkship(combatRoll, false);
  expect(linkshipCount).toEqual({
    linkshipPdsAdj: 0,
    linkshipPdsHex: 0,
    linkshipSpaceDockAdj: 0,
    linkshipSpaceDockHex: 3,
    pdsAdj: 0,
    pdsHex: 0,
    spaceDockAdj: 0,
    spaceDockHex: 0,
  });
});
