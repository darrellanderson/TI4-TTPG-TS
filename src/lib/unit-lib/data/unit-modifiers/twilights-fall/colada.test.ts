import {
  CombatRoll,
  CombatRollParams,
} from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitType } from "../../../schema/unit-attrs-schema";
import { OPPONENT, placeGameObjects, SELF } from "../abstract.test";

it("2ram (registry)", () => {
  const nsid = "unit:twilights-fall/colada";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe("Colada");
});

it("Colada", () => {
  const params: CombatRollParams = {
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  };
  let combatRoll: CombatRoll;

  combatRoll = CombatRoll.createCooked(params);
  const dreadCapacity: number | undefined = combatRoll.self.unitAttrsSet
    .getOrThrow("dreadnought")
    .getCapacity();
  expect(dreadCapacity !== undefined && dreadCapacity > 0).toBe(true);

  placeGameObjects({
    self: ["unit:twilights-fall/colada"],
    selfUnits: new Map<UnitType, number>([
      ["mech", 2],
      ["dreadnought", 1],
    ]),
    selfUnitsOffPlanet: new Map<UnitType, number>([["mech", 3]]),
  });
  combatRoll = CombatRoll.createCooked(params);
  expect(combatRoll.getUnitModifierNames()).toEqual(["Colada"]);
  expect(
    combatRoll.self.unitAttrsSet
      .getOrThrow("dreadnought")
      .getSpaceCombat()
      ?.getExtraDice()
  ).toBe(3);
});
