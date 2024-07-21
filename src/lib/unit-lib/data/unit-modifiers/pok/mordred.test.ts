import { OPPONENT, placeGameObjects, SELF } from "../abstract.test";
import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitAttrs } from "../../../unit-attrs/unit-attrs";

it("registry", () => {
  const nsid = "card.leader.mech:pok/mordred";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe("Mordred");
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

  const mechAttrs: UnitAttrs = combatRoll.self.unitAttrsSet.getOrThrow("mech");
  const groundCombat: CombatAttrs = mechAttrs.getGroundCombatOrThrow();
  expect(groundCombat.getHit()).toBe(13);
});

it("modifier (mech, no x/y token)", () => {
  placeGameObjects({
    self: ["card.leader.mech:pok/mordred"],
    selfUnits: new Map([["mech", 1]]),
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "groundCombat",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual([]);

  const mechAttrs: UnitAttrs = combatRoll.self.unitAttrsSet.getOrThrow("mech");
  const groundCombat: CombatAttrs = mechAttrs.getGroundCombatOrThrow();
  expect(groundCombat.getHit()).toBe(13);
});

it("modifier (mech, x/y token)", () => {
  placeGameObjects({
    self: ["card.leader.mech:pok/mordred"],
    selfUnits: new Map([["mech", 1]]),
    opponent: ["token:base/nekro-x"],
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "groundCombat",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["Mordred"]);

  const mechAttrs: UnitAttrs = combatRoll.self.unitAttrsSet.getOrThrow("mech");
  const groundCombat: CombatAttrs = mechAttrs.getGroundCombatOrThrow();
  expect(groundCombat.getHit()).toBe(11);
});
