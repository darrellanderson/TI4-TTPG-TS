import { OPPONENT, placeGameObjects, SELF } from "../abstract.test";
import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitAttrs } from "../../../unit-attrs/unit-attrs";

it("registry", () => {
  const nsid = "unit:pok/visz-el-vir";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe(
    "Visz El Vir"
  );
});

it("default", () => {
  placeGameObjects({ self: ["card.leader.mech:pok/eidolon"] });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "groundCombat",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual([]);

  const mechAttrs: UnitAttrs = combatRoll.self.unitAttrsSet.getOrThrow("mech");
  expect(mechAttrs.getName()).toBe("Eidolon");
  const mechGroundCombat: CombatAttrs = mechAttrs.getGroundCombatOrThrow();
  expect(mechGroundCombat.getDice()).toBe(2);
});

it("modifier", () => {
  placeGameObjects({
    self: ["unit:pok/visz-el-vir", "card.leader.mech:pok/eidolon"],
    selfUnits: new Map([
      ["flagship", 1],
      ["mech", 1],
    ]),
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "groundCombat",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["Visz El Vir", "Eidolon"]);

  const mechAttrs: UnitAttrs = combatRoll.self.unitAttrsSet.getOrThrow("mech");
  expect(mechAttrs.getName()).toBe("Eidolon");
  const mechGroundCombat: CombatAttrs = mechAttrs.getGroundCombatOrThrow();
  expect(mechGroundCombat.getDice()).toBe(3);
});
