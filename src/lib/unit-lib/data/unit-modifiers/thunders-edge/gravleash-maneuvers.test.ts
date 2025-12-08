import { CombatRoll, CombatRollParams } from "../../../../combat-lib";
import { UnitType } from "../../../schema/unit-attrs-schema";
import { placeGameObjects, SELF, OPPONENT } from "../abstract.test";

import {
  _getGravleashUnitType,
  _setGravleashUnitType,
} from "./gravleash-maneuvers";

it("registry", () => {
  const nsid: string = "card.breakthrough:thunders-edge/gravleash-maneuvers";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)).toBeDefined();
});

it("modifier", () => {
  let combatRoll: CombatRoll;
  let success: boolean;

  const combatParams: CombatRollParams = {
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  };

  combatRoll = CombatRoll.createCooked(combatParams);
  expect(combatRoll.getUnitModifierNames()).toEqual([]);
  expect(
    combatRoll.self.unitAttrsSet
      .getOrThrow("fighter")
      .getSpaceCombatOrThrow()
      .getHit()
  ).toBe(9);

  placeGameObjects({
    self: ["card.breakthrough:thunders-edge/gravleash-maneuvers"],
    selfUnits: new Map<UnitType, number>([
      ["fighter", 3],
      ["dreadnought", 3],
    ]),
  });
  combatRoll = CombatRoll.createCooked(combatParams);

  success = _setGravleashUnitType("flagship");
  expect(success).toBe(true);
  expect(_getGravleashUnitType(combatRoll)).toBe("choose-best"); // missing unit, use best

  success = _setGravleashUnitType("fighter");
  expect(success).toBe(true);
  expect(_getGravleashUnitType(combatRoll)).toBe("fighter"); // unit exists, use it

  combatRoll = CombatRoll.createCooked(combatParams);
  expect(combatRoll.getUnitModifierNames()).toEqual(["Gravleash Maneuvers"]);
  expect(
    combatRoll.self.unitAttrsSet
      .getOrThrow("gravleash-maneuvers" as UnitType)
      .getSpaceCombatOrThrow()
      .getHit()
  ).toBe(7);
  expect(combatRoll.self.getCount("fighter")).toBe(2);
});

it("_getUnitType choose", () => {
  placeGameObjects({
    self: ["card.breakthrough:thunders-edge/gravleash-maneuvers"],
    selfUnits: new Map<UnitType, number>([
      ["fighter", 3],
      ["dreadnought", 3],
    ]),
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  let unitType: UnitType;

  _setGravleashUnitType("choose-best");
  unitType = _getGravleashUnitType(combatRoll);
  expect(unitType).toBe("dreadnought");

  _setGravleashUnitType("choose-worst");
  unitType = _getGravleashUnitType(combatRoll);
  expect(unitType).toBe("fighter");
});
