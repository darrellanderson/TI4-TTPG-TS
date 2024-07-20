import { OPPONENT, placeGameObjects, SELF } from "../abstract.test";
import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitAttrs } from "../../../unit-attrs/unit-attrs";

it("registry (agenda)", () => {
  const nsid = "card.agenda:base.only/the-crown-of-thalnos";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe(
    "The Crown of Thalnos"
  );
});

it("registry (relic)", () => {
  const nsid = "card.relic:pok/the-crown-of-thalnos";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe(
    "The Crown of Thalnos"
  );
});

it("default", () => {
  placeGameObjects({});
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "groundCombat",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
});

it("modifier", () => {
  placeGameObjects({ selfActive: ["card.relic:pok/the-crown-of-thalnos"] });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "groundCombat",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["The Crown of Thalnos"]);

  const fighterAttrs: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("fighter");
  const fighterSpaceCombat: CombatAttrs = fighterAttrs.getSpaceCombatOrThrow();
  expect(fighterSpaceCombat.getHit()).toBe(8);

  const infantryAttrs: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("infantry");
  const infantryGroundCombat: CombatAttrs =
    infantryAttrs.getGroundCombatOrThrow();
  expect(infantryGroundCombat.getHit()).toBe(7);
});
