import {
  CombatRoll,
  CombatRollParams,
} from "../../../combat-lib/combat-roll/combat-roll";
import { OPPONENT, placeGameObjects, SELF } from "./abstract.test";

it("annihilator (registry)", () => {
  const nsid = "card.leader.mech:pok/annihilator";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)).toBeDefined();
});

it("annihilator (bombardment)", () => {
  // PLANETARY SHIELD does not prevent BOMBARDMENT
  const params: CombatRollParams = {
    rollType: "bombardment",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  };
  let combatRoll: CombatRoll;

  combatRoll = CombatRoll.createCooked(params);
  expect(combatRoll.self.hasUnit("mech")).toBe(false);
  expect(combatRoll.self.getCount("mech")).toBe(0);
  expect(combatRoll.getUnitModifierNames()).toEqual([]);

  placeGameObjects({
    self: ["card.leader.mech:pok/annihilator"],
    selfUnits: new Map([["mech", 2]]),
    selfUnitsOffPlanet: new Map([["mech", 3]]),
  });
  combatRoll = CombatRoll.createCooked(params);
  expect(combatRoll.self.hasUnit("mech")).toBe(true);
  expect(combatRoll.self.getCount("mech")).toBe(3);
  expect(combatRoll.getUnitModifierNames()).toEqual(["Annihilator"]);
});
