import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { OPPONENT, placeGameObjects, SELF } from "../abstract.test";

it("registry", () => {
  const nsid = "card.technology.yellow:base/sarween-tools";
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
    self: ["card.technology.yellow:base/sarween-tools"],
  });
  combatRoll = CombatRoll.createCooked({
    rollType: "production",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["Sarween Tools"]);
});
