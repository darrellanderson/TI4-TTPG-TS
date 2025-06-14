import { MockGameObject } from "ttpg-mock";
import {
  CombatRoll,
  CombatRollParams,
} from "../../../../combat-lib/combat-roll/combat-roll";
import { OPPONENT, placeGameObjects, SELF, SELF_POS } from "../abstract.test";

it("registry", () => {
  const nsid = "unit:pok/arvicon-rex";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe(
    "Arvicon Rex"
  );
});

it("arvicon-rex", () => {
  placeGameObjects({
    self: ["unit:pok/arvicon-rex"], // normally linked via faction, force it here
    selfUnits: new Map([["flagship", 1]]),
  });
  const params: CombatRollParams = {
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  };

  let combatRoll: CombatRoll;
  combatRoll = CombatRoll.createCooked(params);
  expect(combatRoll.self.hasUnit("flagship")).toBe(true);
  expect(combatRoll.self.unitAttrsSet.get("flagship")?.getName()).toBe(
    "Arvicon Rex"
  );
  expect(combatRoll.getUnitModifierNames()).toEqual(["Arvicon Rex"]);
  expect(
    combatRoll.self.unitAttrsSet.get("flagship")?.getSpaceCombat()?.getHit()
  ).toBe(5);

  // Add opponent's token to fleet pool.
  new MockGameObject({
    templateMetadata: "sheet:base/command",
    position: SELF_POS.add([0, -0.96, 0]),
  });
  new MockGameObject({
    id: "fleet",
    templateMetadata: "token.command:base/sol",
    position: SELF_POS.add([1, 1, 0]),
    owningPlayerSlot: OPPONENT,
  });

  combatRoll = CombatRoll.createCooked(params);
  expect(combatRoll.self.hasUnit("flagship")).toBe(true);
  expect(combatRoll.self.unitAttrsSet.get("flagship")?.getName()).toBe(
    "Arvicon Rex"
  );
  expect(combatRoll.getUnitModifierNames()).toEqual(["Arvicon Rex"]);
  expect(
    combatRoll.self.unitAttrsSet.get("flagship")?.getSpaceCombat()?.getHit()
  ).toBe(3);
});
