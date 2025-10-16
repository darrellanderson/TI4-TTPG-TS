import { CombatRollParams, CombatRoll } from "../../../../combat-lib";
import { UnitType } from "../../../schema/unit-attrs-schema";
import { OPPONENT, SELF, placeGameObjects } from "../abstract.test";

it("registry", () => {
  const nsid: string = "card.relic:thunders-edge/metali-void-armaments";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)).toBeDefined();
});

it("modifier", () => {
  const combatParams: CombatRollParams = {
    rollType: "antiFighterBarrage",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  };

  placeGameObjects({
    self: ["card.relic:thunders-edge/metali-void-armaments"],
    selfUnits: new Map<UnitType, number>([
      ["cruiser", 2],
      ["fighter", 3],
    ]),
  });
  const combatRoll = CombatRoll.createCooked(combatParams);
  expect(combatRoll.getUnitModifierNames()).toEqual(["Metali Void Armaments"]);
  expect(
    combatRoll.self.unitAttrsSet
      .getOrThrow("metali-void-armaments" as UnitType)
      .getAntiFighterBarrageOrThrow()
      .getHit()
  ).toBe(6);
});
