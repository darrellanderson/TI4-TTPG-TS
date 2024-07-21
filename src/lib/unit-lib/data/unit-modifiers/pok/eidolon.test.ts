import { OPPONENT, placeGameObjects, SELF } from "../abstract.test";
import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";

it("registry", () => {
  const nsid = "card.leader.mech:pok/eidolon";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe("Eidolon");
});

it("default", () => {
  placeGameObjects({
    selfUnits: new Map([["mech", 2]]),
    selfUnitsOffPlanet: new Map([["mech", 3]]),
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual([]);
  expect(combatRoll.self.getCount("mech")).toBe(5);
});

it("modifier (spaceCombat)", () => {
  placeGameObjects({
    self: ["card.leader.mech:pok/eidolon"],
    selfUnits: new Map([["mech", 2]]),
    selfUnitsOffPlanet: new Map([["mech", 3]]),
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["Eidolon"]);
  expect(combatRoll.self.getCount("mech")).toBe(3);
});

it("modifier (groundCombat)", () => {
  placeGameObjects({
    self: ["card.leader.mech:pok/eidolon"],
    selfUnits: new Map([["mech", 2]]),
    selfUnitsOffPlanet: new Map([["mech", 3]]),
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "groundCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["Eidolon"]);
  expect(combatRoll.self.getCount("mech")).toBe(3);
});
