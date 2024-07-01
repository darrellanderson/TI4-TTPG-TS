import { MockCard, MockCardHolder } from "ttpg-mock";
import { CombatRoll, CombatRollParams } from "./combat-roll";
import { UnitAttrsSet } from "lib/unit-lib/unit-attrs-set/unit-attrs-set";
import { Card } from "@tabletop-playground/api";
import { CardUtil } from "ttpg-darrell";

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
  const unitAttrsSet: UnitAttrsSet = combatRoll._createUnitAttrsSet();
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

  combatRoll._applyUnitAttrs(unitAttrsSet, 2);
  expect(unitAttrsSet.get("carrier")?.getName()).toBe("Carrier II");
});
