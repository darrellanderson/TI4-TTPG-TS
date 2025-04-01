import { OPPONENT, placeGameObjects, SELF } from "../abstract.test";
import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitAttrs } from "../../../unit-attrs/unit-attrs";
import { UnitType } from "../../../schema/unit-attrs-schema";

it("registry", () => {
  const nsid = "card.action:base/experimental-battlestation";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe(
    "Experimental Battlestation"
  );
});

it("default", () => {
  placeGameObjects({ selfUnitsAdj: new Map([["space-dock", 1]]) });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCannonOffense",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual([]);

  const experimentalBattlestation: UnitAttrs | undefined =
    combatRoll.self.unitAttrsSet.get("experimental-battlestation" as UnitType);
  expect(experimentalBattlestation).toBeUndefined();
});

it("modifier", () => {
  placeGameObjects({
    self: ["card.action:base/experimental-battlestation"],
    selfUnitsAdj: new Map([["space-dock", 1]]),
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCannonOffense",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual([
    "Experimental Battlestation",
  ]);

  const experimentalBattlestation: UnitAttrs | undefined =
    combatRoll.self.unitAttrsSet.get("experimental-battlestation" as UnitType);
  expect(experimentalBattlestation).toBeDefined();
});
