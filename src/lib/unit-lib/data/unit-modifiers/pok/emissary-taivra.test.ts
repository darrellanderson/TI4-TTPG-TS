import { UnitAttrs } from "../../../../unit-lib/unit-attrs/unit-attrs";
import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { OPPONENT, SELF, placeGameObjects } from "../abstract.test";

it("registry", () => {
  const nsid = "card.leader.agent:pok/emissary-taivra";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)).toBeDefined();
});

it("registry (alliance)", () => {
  const nsid = "card.alliance:pok/yin";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)).toBeDefined();
});

it("emissary-taivra (active)", () => {
  placeGameObjects({
    self: ["card.leader.agent:pok/emissary-taivra"],
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCannonOffense",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["Emissary Taivra"]);
});
