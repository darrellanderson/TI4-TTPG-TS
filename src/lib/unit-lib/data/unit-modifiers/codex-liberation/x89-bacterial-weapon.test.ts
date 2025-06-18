import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { OPPONENT, placeGameObjects, SELF } from "../abstract.test";

it("registry", () => {
  const nsid = "card.technology.green:codex.liberation/x89-bacterial-weapon";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe(
    "X89 Bacterial Weapon"
  );
});

it("x89 bombardment", () => {
  placeGameObjects({
    self: ["card.technology.green:codex.liberation/x89-bacterial-weapon"],
  });

  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "bombardment",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual(["X89 Bacterial Weapon"]);
  expect(
    combatRoll.self.unitAttrsSet.get("dreadnought")?.getBombardment()?.getCrit()
  ).toBe(5);
});

it("x89 ground", () => {
  placeGameObjects({
    self: ["card.technology.green:codex.liberation/x89-bacterial-weapon"],
  });

  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "groundCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual(["X89 Bacterial Weapon"]);
  expect(
    combatRoll.self.unitAttrsSet.get("infantry")?.getGroundCombat()?.getCrit()
  ).toBe(8);
});
