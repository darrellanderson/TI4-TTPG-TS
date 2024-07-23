import { OPPONENT, placeGameObjects, SELF } from "../abstract.test";
import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitAttrs } from "../../../unit-attrs/unit-attrs";

it("registry", () => {
  const nsid = "card.action:base/disable";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe("Disable");
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

  const pds: UnitAttrs = combatRoll.self.unitAttrsSet.getOrThrow("pds");
  expect(pds.getDisablePlanetaryShield()).toBe(false);
  expect(pds.getDisableSpaceCannonDefense()).toBe(false);
});

it("modifier", () => {
  placeGameObjects({ opponent: ["card.action:base/disable"] });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCannonDefense",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["Disable"]);

  const pds: UnitAttrs = combatRoll.self.unitAttrsSet.getOrThrow("pds");
  expect(pds.getDisablePlanetaryShield()).toBe(true);
  expect(pds.getDisableSpaceCannonDefense()).toBe(true);
});
