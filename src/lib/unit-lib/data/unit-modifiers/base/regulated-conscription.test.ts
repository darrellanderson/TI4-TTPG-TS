import { OPPONENT, placeGameObjects, SELF } from "../abstract.test";
import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitAttrs } from "../../../unit-attrs/unit-attrs";

it("registry", () => {
  const nsid = "card.agenda:base/regulated-conscription";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe(
    "Regulated Conscription",
  );
});

it("default", () => {
  placeGameObjects({});
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "production",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual([]);

  const fighter: UnitAttrs = combatRoll.self.unitAttrsSet.getOrThrow("fighter");
  expect(fighter.getProducePerCost()).toBe(2);

  const infantry: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("infantry");
  expect(infantry.getProducePerCost()).toBe(2);
});

it("modifier", () => {
  placeGameObjects({ any: ["card.agenda:base/regulated-conscription"] });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "production",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual(["Regulated Conscription"]);

  const fighter: UnitAttrs = combatRoll.self.unitAttrsSet.getOrThrow("fighter");
  expect(fighter.getProducePerCost()).toBe(1);

  const infantry: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("infantry");
  expect(infantry.getProducePerCost()).toBe(1);
});
