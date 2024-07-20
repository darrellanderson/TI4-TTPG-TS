import { OPPONENT, placeGameObjects, SELF } from "../abstract.test";
import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitAttrs } from "../../../unit-attrs/unit-attrs";

it("registry", () => {
  const nsid = "card.technology.red:pok/supercharge";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe(
    "Supercharge"
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
  expect(combatRoll.getUnitModifierNames()).toEqual([]);

  const fighterAttrs: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("fighter");
  const fighterSpaceCombat: CombatAttrs = fighterAttrs.getSpaceCombatOrThrow();
  expect(fighterSpaceCombat.getHit()).toBe(9);

  const infantryAttrs: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("infantry");
  const infantryGroundCombat: CombatAttrs =
    infantryAttrs.getGroundCombatOrThrow();
  expect(infantryGroundCombat.getHit()).toBe(8);
});

it("modifier", () => {
  placeGameObjects({
    selfActive: ["card.technology.red:pok/supercharge"],
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "groundCombat",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual(["Supercharge"]);

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
