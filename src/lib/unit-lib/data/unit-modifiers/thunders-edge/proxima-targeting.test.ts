import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { OPPONENT, placeGameObjects, SELF } from "../abstract.test";

it("registry", () => {
  const nsid: string = "card.technology.red:thunders-edge/proxima-targeting-vi";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)).toBeDefined();
});

it("proxima targeting", () => {
  placeGameObjects({
    self: ["card.technology.red:thunders-edge/proxima-targeting-vi"],
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "proximaTargeting",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["Proxima Targeting"]);
});
