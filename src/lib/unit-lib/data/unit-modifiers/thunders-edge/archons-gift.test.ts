import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { OPPONENT, placeGameObjects, SELF } from "../abstract.test";

it("registry", () => {
  const nsid = "card.breakthrough:thunders-edge/archons-gift";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe(
    "Archon's Gift"
  );
});

it("modifier", () => {
  placeGameObjects({
    self: ["card.breakthrough:thunders-edge/archons-gift"],
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "production",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["Archon's Gift"]);
});
