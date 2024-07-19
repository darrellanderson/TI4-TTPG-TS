import { OPPONENT, placeGameObjects, SELF } from "../abstract.test";
import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitAttrs } from "../../../unit-attrs/unit-attrs";
import {
  UnitAttrsSchemaType,
  UnitType,
} from "../../../schema/unit-attrs-schema";

it("memoria-1", () => {
  const memoria1: UnitAttrsSchemaType | undefined =
    TI4.unitAttrsRegistry.rawByNsid("flagship:pok/memoria");
  expect(memoria1).toBeDefined();
});

it("memoria-2", () => {
  const memoria2: UnitAttrsSchemaType | undefined =
    TI4.unitAttrsRegistry.rawByNsid(
      "card.technology.unit-upgrade:pok/memoria-2"
    );
  expect(memoria2).toBeDefined();
});

it("registry", () => {
  const nsid = "card.promissory:pok/the-cavalry";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe(
    "The Cavalry"
  );
});

it("default", () => {
  placeGameObjects({});
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "antiFighterBarrage",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual([]);
  expect(combatRoll.self.getCount("The Cavalry" as UnitType)).toBe(0);
});

it("modifier", () => {
  placeGameObjects({ self: ["card.promissory:pok/the-cavalry"] });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "antiFighterBarrage",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["The Cavalry"]);
  expect(combatRoll.self.getCount("the-cavalry" as UnitType)).toBe(1);
  const cavalry: UnitAttrs = combatRoll.self.unitAttrsSet.getOrThrow(
    "the-cavalry" as UnitType
  );
  expect(cavalry.getName()).toBe("The Cavalry");
});

it("modifier (memoria-2)", () => {
  placeGameObjects({
    self: ["card.promissory:pok/the-cavalry"],
    any: ["card.technology.unit-upgrade:pok/memoria-2"],
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["The Cavalry"]);
  expect(combatRoll.self.getCount("the-cavalry" as UnitType)).toBe(1);
  const cavalry: UnitAttrs = combatRoll.self.unitAttrsSet.getOrThrow(
    "the-cavalry" as UnitType
  );
  expect(cavalry.getName()).toBe("The Cavalry II");
});
