import { MockGameObject } from "ttpg-mock";
import { OPPONENT, placeGameObjects, SELF } from "../abstract.test";
import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitAttrs } from "../../../unit-attrs/unit-attrs";
import { UnitType } from "../../../schema/unit-attrs-schema";
import { CombatAttrs } from "../../../unit-attrs/combat-attrs";

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
    combatRoll.self.unitAttrsSet.getOrThrow(
      "experimental-battlestation" as UnitType
    );
  const combatAttrs: CombatAttrs =
    experimentalBattlestation.getSpaceCannonOrThrow();
  expect(combatAttrs.getHit()).toBe(5);
  expect(combatAttrs.getDice()).toBe(3);
  expect(combatAttrs.getRange()).toBe(1);
  expect(combatAttrs.getExtraDice()).toBe(0);
});

it("modifier + galvanized", () => {
  placeGameObjects({
    self: ["card.action:base/experimental-battlestation"],
    selfUnitsAdj: new Map([["space-dock", 1]]),
  });
  MockGameObject.simple("token:thunders-edge:galvanize", {
    position: TI4.hex.toPosition("<0,0,0>"),
  });
  MockGameObject.simple("token:thunders-edge:galvanize", {
    position: TI4.hex.toPosition("<1,0,-1>"),
  });

  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCannonOffense",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.self.getCount("galvanize-token")).toBe(0);
  expect(combatRoll.self.getCountAdj("galvanize-token")).toBe(1);
  expect(combatRoll.self.unitPlasticAdj[1]?.getUnit()).toBe("galvanize-token");
  expect(combatRoll.self.unitPlasticAdj[1]?.getLinkedPlastic()?.getUnit()).toBe(
    "space-dock"
  );

  expect(combatRoll.getUnitModifierNames()).toEqual([
    "Experimental Battlestation",
  ]);

  const experimentalBattlestation: UnitAttrs | undefined =
    combatRoll.self.unitAttrsSet.getOrThrow(
      "experimental-battlestation" as UnitType
    );
  const combatAttrs: CombatAttrs =
    experimentalBattlestation.getSpaceCannonOrThrow();
  expect(combatAttrs.getHit()).toBe(5);
  expect(combatAttrs.getDice()).toBe(3);
  expect(combatAttrs.getRange()).toBe(1);
  expect(combatAttrs.getExtraDice()).toBe(1);
});
