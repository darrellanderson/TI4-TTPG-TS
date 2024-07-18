import { MockGameObject } from "ttpg-mock";
import {
  CombatRoll,
  CombatRollParams,
} from "../../../../combat-lib/combat-roll/combat-roll";
import { OPPONENT, placeGameObjects, SELF, SELF_POS } from "../abstract.test";
import {
  CommandTokenAllocation,
  CommandTokenLib,
} from "../../../../command-token-lib/command-token-lib";

it("registry", () => {
  const nsid = "flagship:pok/arvicon-rex";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe(
    "Arvicon Rex"
  );
});

it("arvicon-rex", () => {
  placeGameObjects({
    self: ["flagship:pok/arvicon-rex"], // normally linked via faction, force it here
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
    templateMetadata: "token:base/command",
    position: SELF_POS.add([1, 1, 0]),
    owningPlayerSlot: OPPONENT,
  });

  const commandTokenAllocation: CommandTokenAllocation | undefined =
    new CommandTokenLib().getPlayerSlotToCommandTokenAllocations().get(SELF);
  expect(commandTokenAllocation).toBeDefined();
  expect(commandTokenAllocation?.fleet.length).toBe(1);

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
