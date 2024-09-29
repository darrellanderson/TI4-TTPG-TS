import { OPPONENT, placeGameObjects, SELF } from "../abstract.test";
import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitAttrs } from "../../../unit-attrs/unit-attrs";

it("registry", () => {
  const nsid = "card.technology.red:base/plasma-scoring";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe(
    "Plasma Scoring",
  );
});

it("default", () => {
  placeGameObjects({ selfUnits: new Map([["dreadnought", 1]]) });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "bombardment",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual([]);

  const dreadnought: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("dreadnought");
  const bombardment: CombatAttrs = dreadnought.getBombardmentOrThrow();
  expect(bombardment.getExtraDice()).toBe(0);
});

it("modifier", () => {
  placeGameObjects({
    self: ["card.technology.red:base/plasma-scoring"],
    selfUnits: new Map([["dreadnought", 1]]),
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "bombardment",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual(["Plasma Scoring"]);

  const dreadnought: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("dreadnought");
  const bombardment: CombatAttrs = dreadnought.getBombardmentOrThrow();
  expect(bombardment.getExtraDice()).toBe(1);
});
