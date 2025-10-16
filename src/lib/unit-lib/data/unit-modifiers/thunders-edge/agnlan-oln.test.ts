import { CombatRoll, CombatRollParams } from "../../../../combat-lib";
import { UnitModifier } from "../../../unit-modifier/unit-modifier";
import { placeGameObjects, SELF, OPPONENT } from "../abstract.test";

it("registry", () => {
  const nsid: string = "card.leader.commander:thunders-edge/agnlan-oln";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)).toBeDefined();
});

it("modifier", () => {
  const unitModifier: UnitModifier | undefined =
    TI4.unitModifierRegistry.getByNsid(
      "card.leader.commander:thunders-edge/agnlan-oln"
    );
  expect(unitModifier).toBeDefined();
  if (!unitModifier) {
    throw new Error("unitModifier not found");
  }

  let combatRoll: CombatRoll;
  const combatParams: CombatRollParams = {
    rollType: "spaceCannonOffense",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  };

  combatRoll = CombatRoll.createCooked(combatParams);
  expect(combatRoll.getUnitModifierNames()).toEqual([]);
  expect(
    combatRoll.self.unitAttrsSet
      .getOrThrow("pds")
      .getSpaceCannonOrThrow()
      .getRerollMisses()
  ).toBe(false);

  placeGameObjects({
    selfActive: ["card.leader.commander:thunders-edge/agnlan-oln"],
  });
  combatRoll = CombatRoll.createCooked(combatParams);

  expect(
    combatRoll.isCommanderUnlocked(
      "card.leader.commander:thunders-edge/agnlan-oln"
    )
  ).toBe(true);
  expect(unitModifier.applies(combatRoll)).toBe(true);

  expect(combatRoll.getUnitModifierNames()).toEqual(["Agnlan Oln"]);
  expect(
    combatRoll.self.unitAttrsSet
      .getOrThrow("pds")
      .getSpaceCannonOrThrow()
      .getRerollMisses()
  ).toBe(true);
});
