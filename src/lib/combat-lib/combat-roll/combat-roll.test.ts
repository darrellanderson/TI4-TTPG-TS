import { Card } from "@tabletop-playground/api";
import { MockCard, MockCardHolder } from "ttpg-mock";
import { CardUtil } from "ttpg-darrell";

import { CombatRoll, CombatRollParams } from "./combat-roll";
import { UnitAttrsSet } from "../../unit-lib/unit-attrs-set/unit-attrs-set";
import { UnitAttrsSchemaType } from "../../unit-lib/schema/unit-attrs-schema";
import { UnitModifier } from "../../unit-lib/unit-modifier/unit-modifier";

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
  // Need a card holder to be closest to assign cards.
  new MockCardHolder({ owningPlayerSlot: 2 });

  const params: CombatRollParams = {
    type: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: 2,
    rollingPlayerSlot: 3,
  };
  const combatRoll: CombatRoll = new CombatRoll(params);
  const unitAttrsSet: UnitAttrsSet =
    TI4.unitAttrsRegistry.defaultUnitAttrsSet();
  expect(unitAttrsSet.get("carrier")?.getName()).toBe("Carrier");

  const nsid: string = "card.technology.unit-upgrade:base/carrier-2";
  expect(TI4.unitAttrsRegistry.rawByNsid(nsid)).toBeDefined();

  const card: Card = MockCard.simple(nsid);
  expect(card.isFaceUp()).toBe(true);
  const allowFaceDown: boolean = false;
  const rejectSnapPointTags: Array<string> = [];
  expect(
    new CardUtil().isLooseCard(card, allowFaceDown, rejectSnapPointTags)
  ).toBe(true);

  const overrides: Array<UnitAttrsSchemaType> =
    combatRoll._getUnitAttrOverrides(2);
  combatRoll._applyUnitAttrs(unitAttrsSet, overrides);
  expect(unitAttrsSet.get("carrier")?.getName()).toBe("Carrier II");
});

it("_getUnitModifiers", () => {
  const params: CombatRollParams = {
    type: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: 2,
    rollingPlayerSlot: 3,
  };
  const combatRoll: CombatRoll = new CombatRoll(params);
  const unitModifiers: Array<UnitModifier> = combatRoll._getUnitModifiers(2, 3);
  expect(unitModifiers.length).toBe(0);
});
