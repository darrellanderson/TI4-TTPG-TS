import {
  CombatRoll,
  CombatRollParams,
} from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitAttrs } from "../../../unit-attrs";
import { OPPONENT, placeGameObjects, SELF } from "../abstract.test";

it("registry", () => {
  const nsid = "unit:twilights-fall/the-faces-of-janovet";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe(
    "The Faces of Janovet",
  );
});

it("The Faces of Janovet", () => {
  const params: CombatRollParams = {
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  };
  let combatRoll: CombatRoll;
  let flagshipUnitAttrs: UnitAttrs;

  combatRoll = CombatRoll.createCooked(params);
  flagshipUnitAttrs = combatRoll.self.unitAttrsSet.getOrThrow("flagship");
  expect(combatRoll.getUnitModifierNames()).toEqual([]);
  expect(flagshipUnitAttrs.getAntiFighterBarrage()).toBeUndefined();
  expect(flagshipUnitAttrs.getBombardment()).toBeUndefined();
  expect(flagshipUnitAttrs.getSpaceCannon()).toBeUndefined();

  placeGameObjects({
    self: [
      "unit:twilights-fall/the-faces-of-janovet",
      "card.technology.unit-upgrade:base/destroyer-2",
      "card.technology.unit-upgrade:base/dreadnought-2",
    ],
    selfUnits: new Map([["flagship", 1]]),
  });

  combatRoll = CombatRoll.createCooked(params);
  flagshipUnitAttrs = combatRoll.self.unitAttrsSet.getOrThrow("flagship");
  expect(combatRoll.getUnitModifierNames()).toEqual(["The Faces of Janovet"]);

  expect(flagshipUnitAttrs.getAntiFighterBarrage()).toBeDefined();
  expect(flagshipUnitAttrs.getBombardment()).toBeDefined();
  expect(flagshipUnitAttrs.getSpaceCannon()).toBeUndefined(); // nothing to copy
});
