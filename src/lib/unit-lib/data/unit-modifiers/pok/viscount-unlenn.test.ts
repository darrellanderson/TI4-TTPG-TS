import { OPPONENT, placeGameObjects, SELF } from "../abstract.test";
import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitAttrs } from "../../../unit-attrs/unit-attrs";

it("registry", () => {
  const nsid = "card.leader.agent:pok/viscount-unlenn";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe(
    "Viscount Unlenn",
  );
});

it("default", () => {
  placeGameObjects({
    selfUnits: new Map([["carrier", 1]]),
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "groundCombat",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual([]);

  const carrier: UnitAttrs = combatRoll.self.unitAttrsSet.getOrThrow("carrier");
  const spaceCombat: CombatAttrs = carrier.getSpaceCombatOrThrow();
  expect(spaceCombat.getExtraDice()).toBe(0);
});

it("modifier", () => {
  placeGameObjects({
    selfActive: ["card.leader.agent:pok/viscount-unlenn"],
    selfUnits: new Map([["carrier", 1]]),
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["Viscount Unlenn"]);

  const carrier: UnitAttrs = combatRoll.self.unitAttrsSet.getOrThrow("carrier");
  const spaceCombat: CombatAttrs = carrier.getSpaceCombatOrThrow();
  expect(spaceCombat.getExtraDice()).toBe(1);
});
