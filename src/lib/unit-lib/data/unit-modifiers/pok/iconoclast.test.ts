import { OPPONENT, placeGameObjects, SELF } from "../abstract.test";
import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitAttrs } from "../../../unit-attrs/unit-attrs";

it("registry", () => {
  const nsid = "card.leader.mech:pok/iconoclast";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe(
    "Iconoclast",
  );
});

it("default", () => {
  placeGameObjects({ selfUnits: new Map([["mech", 1]]) });
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

it("modifier (mech, no fragment)", () => {
  placeGameObjects({
    self: ["card.leader.mech:pok/iconoclast"],
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

it("modifier (mech, fragment)", () => {
  placeGameObjects({
    self: ["card.leader.mech:pok/iconoclast"],
    selfUnits: new Map([["mech", 1]]),
    opponent: ["card.exploration.cultural:pok/cultural-fragment"],
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "groundCombat",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["Iconoclast"]);

  const mechAttrs: UnitAttrs = combatRoll.self.unitAttrsSet.getOrThrow("mech");
  const groundCombat: CombatAttrs = mechAttrs.getGroundCombatOrThrow();
  expect(groundCombat.getHit()).toBe(11);
});
