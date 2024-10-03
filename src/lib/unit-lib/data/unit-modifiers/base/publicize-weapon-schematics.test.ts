import { OPPONENT, placeGameObjects, SELF } from "../abstract.test";
import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitAttrs } from "../../../unit-attrs/unit-attrs";

it("registry", () => {
  const nsid = "card.agenda:base/publicize-weapon-schematics";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe(
    "Publicize Weapon Schematics"
  );
});

it("default", () => {
  placeGameObjects({});
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual([]);

  const warSun: UnitAttrs = combatRoll.self.unitAttrsSet.getOrThrow("war-sun");
  expect(warSun.getDisableSustainDamage()).toBe(false);
});

it("modifier", () => {
  placeGameObjects({ any: ["card.agenda:base/publicize-weapon-schematics"] });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual([
    "Publicize Weapon Schematics",
  ]);

  const warSun: UnitAttrs = combatRoll.self.unitAttrsSet.getOrThrow("war-sun");
  expect(warSun.getDisableSustainDamage()).toBe(true);
});
