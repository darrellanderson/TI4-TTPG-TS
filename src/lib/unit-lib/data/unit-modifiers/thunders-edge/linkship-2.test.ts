import { CombatRoll, CombatRollParams } from "../../../../combat-lib";
import { placeGameObjects, SELF, OPPONENT } from "../abstract.test";

it("registry", () => {
  const nsid: string = "card.technology.unit-upgrade:thunders-edge/linkship-2";
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
    self: ["card.technology.unit-upgrade:thunders-edge/linkship-2"],
    selfUnits: new Map<UnitType, number>([["destroyer", 3]]),
    selfUnitsOffPlanet: new Map<UnitType, number>([
      ["pds", 2],
      ["space-dock", 2],
    ]),
  });

  const combatRoll = CombatRoll.createCooked(combatParams);
  expect(combatRoll.getUnitModifierNames()).toEqual(["Linkship II"]);

  expect(combatRoll.self.getCount("linkship-pds" as UnitType)).toBe(3);
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
      "card.technology.unit-upgrade:thunders-edge/linkship-2",
      "card.relic:thunders-edge/lightrail-ordnance",
    ],
    selfUnits: new Map<UnitType, number>([["destroyer", 3]]),
    selfUnitsOffPlanet: new Map<UnitType, number>([
      ["pds", 2],
      ["space-dock", 2],
    ]),
  });

  const combatRoll = CombatRoll.createCooked(combatParams);
  expect(combatRoll.getUnitModifierNames()).toEqual([
    "Lightrail Ordnance",
    "Linkship II",
  ]);

  expect(combatRoll.self.getCount("linkship-pds" as UnitType)).toBe(0);
  expect(combatRoll.self.getCount("linkship-space-dock" as UnitType)).toBe(3);

  expect(
    combatRoll.self.unitAttrsSet.get("linkship-pds" as UnitType)
  ).toBeUndefined();

  expect(
    combatRoll.self.unitAttrsSet
      .getOrThrow("linkship-space-dock" as UnitType)
      .getSpaceCannonOrThrow()
      .getHit()
  ).toBe(5);
});
