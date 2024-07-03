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

it("_findUnitAttrOverrides (standard unit upgrade)", () => {
  // Need a card holder to be closest to assign cards.
  new MockCardHolder({ owningPlayerSlot: 2 });

  const params: CombatRollParams = {
    type: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: 2,
    rollingPlayerSlot: 3,
  };
  const combatRoll: CombatRoll = new CombatRoll(params);

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
    combatRoll._findUnitAttrOverrides(2);
  const names: Array<string> = overrides.map((override) => override.name);
  expect(names).toEqual(["Carrier II"]);
});

it("_findUnitModifiers", () => {
  // Need a card holder to be closest to assign cards.
  new MockCardHolder({ owningPlayerSlot: 2 });

  const params: CombatRollParams = {
    type: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: 2,
    rollingPlayerSlot: 3,
  };
  const combatRoll: CombatRoll = new CombatRoll(params);

  const nsid: string = "card.leader.commander:pok/2ram";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)).toBeDefined();

  const card: Card = MockCard.simple(nsid);
  expect(card.isFaceUp()).toBe(true);
  const allowFaceDown: boolean = false;
  const rejectSnapPointTags: Array<string> = [];
  expect(
    new CardUtil().isLooseCard(card, allowFaceDown, rejectSnapPointTags)
  ).toBe(true);

  const unitModifiers: Array<UnitModifier> = combatRoll._findUnitModifiers(
    2,
    3
  );
  const names: Array<string> = unitModifiers.map((modifier) =>
    modifier.getName()
  );
  expect(names).toEqual(["2Ram"]);
});
