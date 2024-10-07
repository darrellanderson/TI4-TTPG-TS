import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { OPPONENT, placeGameObjects, SELF } from "../abstract.test";

it("registry", () => {
  const nsid = "card.leader.hero:codex.vigil/xxekir-grom";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe(
    "Xxekir Grom"
  );
});

it("modifier", () => {
  placeGameObjects({
    self: ["card.leader.hero:codex.vigil/xxekir-grom"],
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "production",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["Xxekir Grom"]);
});
