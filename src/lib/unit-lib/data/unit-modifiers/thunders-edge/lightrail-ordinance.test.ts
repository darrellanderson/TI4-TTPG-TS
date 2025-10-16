import { CombatRoll, CombatRollParams } from "../../../../combat-lib";
import { placeGameObjects, SELF, OPPONENT } from "../abstract.test";

it("registry", () => {
  const nsid: string = "card.relic:thunders-edge/lightrail-ordnance";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)).toBeDefined();
});

it("modifier", () => {
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
    combatRoll.self.unitAttrsSet.getOrThrow("space-dock").getSpaceCannon()
  ).toBeUndefined();

  placeGameObjects({
    self: ["card.relic:thunders-edge/lightrail-ordnance"],
    selfUnits: new Map<UnitType, number>([["space-dock", 1]]),
  });
  combatRoll = CombatRoll.createCooked(combatParams);
  expect(combatRoll.getUnitModifierNames()).toEqual(["Lightrail Ordnance"]);
  expect(
    combatRoll.self.unitAttrsSet
      .getOrThrow("space-dock")
      .getSpaceCannonOrThrow()
      .getHit()
  ).toBe(5);
});
