import { OPPONENT, placeGameObjects, SELF } from "../abstract.test";
import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitAttrs } from "../../../unit-attrs/unit-attrs";

it("registry", () => {
  const nsid = "card.leader.mech:pok/moll-terminus";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe(
    "Moll Terminus"
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

  const mech: UnitAttrs = combatRoll.self.unitAttrsSet.getOrThrow("mech");
  expect(mech.hasSustainDamage()).toBe(true);
  expect(mech.getDisableSustainDamage()).toBe(false);
});

it("modifier", () => {
  placeGameObjects({
    opponent: ["card.leader.mech:pok/moll-terminus"],
    opponentUnits: new Map([["mech", 1]]),
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "groundCombat",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual(["Moll Terminus"]);

  const mech: UnitAttrs = combatRoll.self.unitAttrsSet.getOrThrow("mech");
  expect(mech.hasSustainDamage()).toBe(true); // still true
  expect(mech.getDisableSustainDamage()).toBe(true);
});
