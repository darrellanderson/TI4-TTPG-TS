import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { OPPONENT, placeGameObjects, SELF } from "../abstract.test";

it("registry", () => {
  const nsid = "card.action:base/fire-team";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe("Fire Team");
});

it("fire-team", () => {
  placeGameObjects({
    self: ["card.action:base/fire-team"],
  });

  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "groundCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual(["Fire Team"]);
  expect(
    combatRoll.self.unitAttrsSet
      .get("infantry")
      ?.getGroundCombat()
      ?.getRerollMisses()
  ).toBe(true);
});
