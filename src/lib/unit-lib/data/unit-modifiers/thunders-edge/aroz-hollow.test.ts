import { CombatRoll, CombatRollParams } from "../../../../combat-lib";
import { placeGameObjects, SELF, OPPONENT } from "../abstract.test";

it("registry", () => {
  const nsid: string = "card.leader.commander:thunders-edge/aroz-hollow";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)).toBeDefined();
});

it("modifier", () => {
  let combatRoll: CombatRoll;
  const combatParams: CombatRollParams = {
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  };

  combatRoll = CombatRoll.createCooked(combatParams);
  expect(combatRoll.getUnitModifierNames()).toEqual([]);
  expect(
    combatRoll.self.unitAttrsSet
      .getOrThrow("fighter")
      .getSpaceCombatOrThrow()
      .getHit()
  ).toBe(9);

  placeGameObjects({
    self: ["card.leader.commander:thunders-edge/aroz-hollow"],
    systemNsid: "tile.system:thunders-edge/900", // fracture
  });
  combatRoll = CombatRoll.createCooked(combatParams);

  if (!TI4.systemRegistry.getBySystemTileNumber(900)) {
    throw new Error("system 900 not found");
  }
  if (!combatRoll.system) {
    throw new Error("combatRoll.system not set");
  }
  expect(combatRoll.system.getClass()).toBe("fracture");
  expect(combatRoll.getUnitModifierNames()).toEqual(["Aroz Hollow"]);
  expect(
    combatRoll.self.unitAttrsSet
      .getOrThrow("fighter")
      .getSpaceCombatOrThrow()
      .getHit()
  ).toBe(8);
});
