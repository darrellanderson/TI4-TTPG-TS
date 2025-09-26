import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitType } from "../../../schema/unit-attrs-schema";
import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import { OPPONENT, placeGameObjects, SELF } from "../abstract.test";

it("ambush", () => {
  placeGameObjects({
    selfUnits: new Map<UnitType, number>([
      ["cruiser", 3],
      ["destroyer", 6],
    ]),
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "ambush",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["Ambush"]);

  const unitToCombatAttrs: Map<UnitType, CombatAttrs> =
    combatRoll._getUnitToCombatAttrs();
  expect([...unitToCombatAttrs.keys()]).toContain("ambush-cruiser");
  expect([...unitToCombatAttrs.keys()]).toContain("ambush-destroyer");

  expect(combatRoll.self.getCount("ambush-cruiser" as UnitType)).toBe(3);
  expect(combatRoll.self.getCount("ambush-destroyer" as UnitType)).toBe(1);
});
