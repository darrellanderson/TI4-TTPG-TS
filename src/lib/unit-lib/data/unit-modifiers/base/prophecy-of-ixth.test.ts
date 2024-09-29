import { OPPONENT, placeGameObjects, SELF } from "../abstract.test";
import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitAttrs } from "../../../unit-attrs/unit-attrs";

it("registry", () => {
  const nsid = "card.agenda:base/prophecy-of-ixth";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe(
    "Prophecy of Ixth",
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
  placeGameObjects({ self: ["card.agenda:base/prophecy-of-ixth"] });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["Prophecy of Ixth"]);

  const fighter: UnitAttrs = combatRoll.self.unitAttrsSet.getOrThrow("fighter");
  const spaceCombat: CombatAttrs = fighter.getSpaceCombatOrThrow();
  expect(spaceCombat.getHit()).toBe(8);
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
      "card.agenda:base/prophecy-of-ixth",
      "card.action:my-source/fighter-with-ground-combat",
    ],
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "groundCombat",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual([
    "fighter-with-ground-combat",
    "Prophecy of Ixth",
  ]);

  const fighter: UnitAttrs = combatRoll.self.unitAttrsSet.getOrThrow("fighter");
  const spaceCombat: CombatAttrs = fighter.getSpaceCombatOrThrow();
  expect(spaceCombat.getHit()).toBe(8);
  const groundCombat: CombatAttrs = fighter.getGroundCombatOrThrow();
  expect(groundCombat.getHit()).toBe(8);
});
