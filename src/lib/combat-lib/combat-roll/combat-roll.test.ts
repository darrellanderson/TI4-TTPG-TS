import { MockCard, MockCardHolder } from "ttpg-mock";
import { CombatRoll, CombatRollParams } from "./combat-roll";
import { UnitAttrsSet } from "lib/unit-lib/unit-attrs-set/unit-attrs-set";

it("constructor", () => {
  const params: CombatRollParams = {
    type: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: 2,
    rollingPlayerSlot: 3,
  };
  const combatRoll: CombatRoll = new CombatRoll(params);
  expect(combatRoll.getType()).toBe("spaceCombat");
});

it("_createUnitAttrsSet (standard unit upgrade)", () => {
  let unitAttrsSet: UnitAttrsSet;
  new MockCardHolder({ owningPlayerSlot: 2 });
  const params: CombatRollParams = {
    type: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: 2,
    rollingPlayerSlot: 3,
  };
  const combatRoll: CombatRoll = new CombatRoll(params);
  unitAttrsSet = combatRoll._createUnitAttrsSet(2);
  expect(unitAttrsSet.get("carrier")?.getName()).toBe("Carrier");

  MockCard.simple("card.technology.unit-upgrade:base/carrier-2");
  unitAttrsSet = combatRoll._createUnitAttrsSet(2);
  expect(unitAttrsSet.get("carrier")?.getName()).toBe("Carrier II");
});
