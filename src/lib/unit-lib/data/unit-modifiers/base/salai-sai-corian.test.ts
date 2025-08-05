import { OPPONENT, placeGameObjects, SELF } from "../abstract.test";
import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitAttrs } from "../../../unit-attrs/unit-attrs";

it("registry", () => {
  const nsid = "unit:base/salai-sai-corian";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe(
    "Salai Sai Corian"
  );
});

it("default", () => {
  placeGameObjects({});
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "groundCombat",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual([]);

  const flagship: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("flagship");
  const spaceCombat: CombatAttrs = flagship.getSpaceCombatOrThrow();
  expect(spaceCombat.getDice()).toBe(2);
});

it("modifier", () => {
  placeGameObjects({
    self: ["unit:base/salai-sai-corian"],
    selfUnits: new Map([["flagship", 1]]),
    opponentUnits: new Map([
      ["carrier", 2],
      ["destroyer", 3],
      ["fighter", 4],
      ["flagship", 1],
      ["infantry", 5],
      ["mech", 6],
      ["pds", 7],
    ]),
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["Salai Sai Corian"]);

  const flagship: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("flagship");
  const spaceCombat: CombatAttrs = flagship.getSpaceCombatOrThrow();
  expect(spaceCombat.getDice()).toBe(6);
});
