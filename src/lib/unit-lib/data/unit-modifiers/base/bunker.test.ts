import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { OPPONENT, placeGameObjects, SELF } from "../abstract.test";

it("registry", () => {
  const nsid = "card.action:base/bunker";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe("Bunker");
});

it("bunker", () => {
  placeGameObjects({
    opponent: ["card.action:base/bunker"],
  });

  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "bombardment",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual(["Bunker"]);
  expect(
    combatRoll.self.unitAttrsSet.get("dreadnought")?.getBombardment()?.getHit(),
  ).toBe(9);
});
