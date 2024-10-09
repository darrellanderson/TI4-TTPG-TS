import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { OPPONENT, placeGameObjects, SELF } from "../abstract.test";

it("registry", () => {
  const nsid = "card.action:codex.ordinian/war-machine.1";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)).toBeDefined();
});

it("sarween-tools", () => {
  let combatRoll: CombatRoll;

  combatRoll = CombatRoll.createCooked({
    rollType: "production",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual([]);

  placeGameObjects({
    self: ["card.action:codex.ordinian/war-machine"],
  });
  combatRoll = CombatRoll.createCooked({
    rollType: "production",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["War Machine"]);
});
