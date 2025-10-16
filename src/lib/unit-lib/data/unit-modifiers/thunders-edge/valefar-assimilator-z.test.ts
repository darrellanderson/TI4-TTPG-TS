import { CombatRollParams, CombatRoll } from "../../../../combat-lib";
import { UnitType } from "../../../schema/unit-attrs-schema";
import { OPPONENT, SELF, placeGameObjects } from "../abstract.test";

it("registry", () => {
  const nsid: string = "card.breakthrough:thunders-edge/valefar-assimilator-z";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)).toBeDefined();
});

it("modifier", () => {
  const combatParams: CombatRollParams = {
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  };

  placeGameObjects({
    self: ["card.breakthrough:thunders-edge/valefar-assimilator-z"],
    selfUnits: new Map<UnitType, number>([["flagship", 1]]),
  });
  const combatRoll = CombatRoll.createCooked(combatParams);
  expect(combatRoll.getUnitModifierNames()).toEqual(["Valefar Assimilator Z"]);
});
