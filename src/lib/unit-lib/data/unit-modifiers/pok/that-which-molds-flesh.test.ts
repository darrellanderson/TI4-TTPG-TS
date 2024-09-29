import { OPPONENT, placeGameObjects, SELF } from "../abstract.test";
import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitAttrs } from "../../../unit-attrs/unit-attrs";

it("registry (commander)", () => {
  const nsid = "card.leader.commander:pok/that-which-molds-flesh";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe(
    "That Which Molds Flesh",
  );
});

it("registry (alliance)", () => {
  const nsid = "card.alliance:pok/vuilraith";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe(
    "That Which Molds Flesh",
  );
});

it("default", () => {
  placeGameObjects({});
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "production",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual([]);

  const infantry: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("infantry");
  expect(
    infantry.getSharedProduceQuantityDoesNotCountAgainstProductionLimits(),
  ).toBe(0);

  const fighter: UnitAttrs = combatRoll.self.unitAttrsSet.getOrThrow("fighter");
  expect(
    fighter.getSharedProduceQuantityDoesNotCountAgainstProductionLimits(),
  ).toBe(0);
});

it("modifier", () => {
  placeGameObjects({
    self: ["card.leader.commander:pok/that-which-molds-flesh"],
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "production",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual(["That Which Molds Flesh"]);

  const infantry: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("infantry");
  expect(
    infantry.getSharedProduceQuantityDoesNotCountAgainstProductionLimits(),
  ).toBe(2);

  const fighter: UnitAttrs = combatRoll.self.unitAttrsSet.getOrThrow("fighter");
  expect(
    fighter.getSharedProduceQuantityDoesNotCountAgainstProductionLimits(),
  ).toBe(2);
});
