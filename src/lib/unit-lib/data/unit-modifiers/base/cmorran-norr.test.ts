import { OPPONENT, placeGameObjects, SELF } from "../abstract.test";
import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitAttrs } from "../../../unit-attrs/unit-attrs";
import {
  UnitAttrsSchemaType,
  UnitType,
} from "lib/unit-lib/schema/unit-attrs-schema";

it("registry", () => {
  const nsid = "flagship:base/cmorran-norr";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe(
    "C'morran N'orr"
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

  const dreadnought: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("dreadnought");
  const spaceCombat: CombatAttrs = dreadnought.getSpaceCombatOrThrow();
  expect(spaceCombat.getHit()).toBe(5);
});

it("modifier", () => {
  placeGameObjects({
    self: ["flagship:base/cmorran-norr"],
    selfUnits: new Map([["flagship", 1]]),
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "groundCombat",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual(["C'morran N'orr"]);

  const dreadnought: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("dreadnought");
  const spaceCombat: CombatAttrs = dreadnought.getSpaceCombatOrThrow();
  expect(spaceCombat.getHit()).toBe(4);
});

it("modifier (synthetic ship with ground combat)", () => {
  TI4.unitModifierRegistry.load("my-source", [
    {
      name: "my-modifier-name",
      description: "my-modifier-description",
      owner: "self",
      priority: "mutate",
      triggers: [{ cardClass: "action", nsidName: "my-action" }],
      applies: () => true,
      apply: (combatRoll: CombatRoll) => {
        const schema: UnitAttrsSchemaType = {
          unit: "my-unit-type" as UnitType,
          name: "my-unit-name",
          isShip: true,
          groundCombat: { hit: 8 },
        };
        combatRoll.self.addSyntheticUnit(schema, 1);
      },
    },
  ]);

  placeGameObjects({
    self: ["flagship:base/cmorran-norr", "card.action:my-source/my-action"],
    selfUnits: new Map([["flagship", 1]]),
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "groundCombat",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual([
    "my-modifier-name",
    "C'morran N'orr",
  ]);

  const myUnit: UnitAttrs = combatRoll.self.unitAttrsSet.getOrThrow(
    "my-unit-type" as UnitType
  );
  const groundCombat: CombatAttrs = myUnit.getGroundCombatOrThrow();
  expect(groundCombat.getHit()).toBe(7);
});
