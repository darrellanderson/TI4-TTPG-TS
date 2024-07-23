import { OPPONENT, placeGameObjects, SELF } from "../abstract.test";
import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitAttrs } from "../../../unit-attrs/unit-attrs";

it("registry", () => {
  const nsid = "card.action:base/fighter-prototype";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe(
    "Fighter Prototype"
  );
});

it("default", () => {
  placeGameObjects({});
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual([]);

  const fighter: UnitAttrs = combatRoll.self.unitAttrsSet.getOrThrow("fighter");
  const spaceCombat: CombatAttrs = fighter.getSpaceCombatOrThrow();
  expect(spaceCombat.getHit()).toBe(9);
});

it("modifier", () => {
  placeGameObjects({ self: ["card.action:base/fighter-prototype"] });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual(["Fighter Prototype"]);

  const fighter: UnitAttrs = combatRoll.self.unitAttrsSet.getOrThrow("fighter");
  const spaceCombat: CombatAttrs = fighter.getSpaceCombatOrThrow();
  expect(spaceCombat.getHit()).toBe(7);
});

it("modifier (fighter with ground combat)", () => {
  TI4.unitModifierRegistry.load("my-source", [
    {
      name: "fighter-with-ground-combat",
      description: "synthetic fighter with ground combat",
      owner: "self",
      priority: "mutate",
      triggers: [
        { cardClass: "action", nsidName: "fighter-with-ground-combat" },
      ],
      applies: (_combatRoll: CombatRoll): boolean => {
        return true;
      },
      apply: (combatRoll: CombatRoll): void => {
        const fighter: UnitAttrs =
          combatRoll.self.unitAttrsSet.getOrThrow("fighter");
        fighter.setGroundCombat(new CombatAttrs({ hit: 9 }));
      },
    },
  ]);

  placeGameObjects({
    self: [
      "card.action:base/fighter-prototype",
      "card.action:my-source/fighter-with-ground-combat",
    ],
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual([
    "fighter-with-ground-combat",
    "Fighter Prototype",
  ]);

  const fighter: UnitAttrs = combatRoll.self.unitAttrsSet.getOrThrow("fighter");
  const spaceCombat: CombatAttrs = fighter.getSpaceCombatOrThrow();
  expect(spaceCombat.getHit()).toBe(7);
  const groundCombat: CombatAttrs = fighter.getGroundCombatOrThrow();
  expect(groundCombat.getHit()).toBe(7);
});
