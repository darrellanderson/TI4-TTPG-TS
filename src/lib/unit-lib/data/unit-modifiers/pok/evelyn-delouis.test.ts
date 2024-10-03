import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { OPPONENT, placeGameObjects, SELF } from "../abstract.test";
import { CombatAttrs } from "../../../../unit-lib/unit-attrs/combat-attrs";

it("registry", () => {
  const nsid = "card.leader.agent:pok/evelyn-delouis";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe(
    "Evelyn Delouis"
  );
});

it("default", () => {
  placeGameObjects({
    selfUnits: new Map([["infantry", 1]]),
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "groundCombat",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.self.hasUnit("infantry")).toBe(true);
  const mechCombatAttrs: CombatAttrs | undefined = combatRoll.self.unitAttrsSet
    .getOrThrow("infantry")
    .getGroundCombatOrThrow();
  expect(mechCombatAttrs.getExtraDice()).toBe(0);
});

it("evelyn-delouis", () => {
  placeGameObjects({
    selfActive: ["card.leader.agent:pok/evelyn-delouis"],
    selfUnits: new Map([["infantry", 1]]),
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "groundCombat",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.self.hasUnit("infantry")).toBe(true);
  const mechCombatAttrs: CombatAttrs | undefined = combatRoll.self.unitAttrsSet
    .getOrThrow("infantry")
    .getGroundCombatOrThrow();
  expect(mechCombatAttrs.getExtraDice()).toBe(1);
});
