import { OPPONENT, placeGameObjects, SELF } from "../abstract.test";
import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitType } from "../../../schema/unit-attrs-schema";

it("registry", () => {
  const nsid = "card.leader.hero:pok/ul-the-progenitor";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe(
    "Ul the Progenitor"
  );
});

it("default", () => {
  placeGameObjects({});
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "groundCombat",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual([]);
  expect(combatRoll.self.getCount("Ul the Progenitor" as UnitType)).toBe(0);
});

it("modifier (wrong system)", () => {
  placeGameObjects({
    self: ["card.leader.hero:pok/ul-the-progenitor"],
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCannonOffense",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual([]);
});

it("modifier", () => {
  placeGameObjects({
    systemNsid: "tile.system:pok/55",
    self: ["card.leader.hero:pok/ul-the-progenitor"],
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCannonOffense",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["Ul the Progenitor"]);
  expect(combatRoll.self.getCount("ul-the-progenitor" as UnitType)).toBe(1);
});
