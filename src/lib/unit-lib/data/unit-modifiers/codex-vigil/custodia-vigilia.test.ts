import { OPPONENT, placeGameObjects, SELF } from "../abstract.test";
import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitType } from "../../../schema/unit-attrs-schema";

it("registry", () => {
  const nsid = "card.legendary-planet:codex.vigil/custodia-vigilia";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe(
    "Custodia Vigilia"
  );
});

it("default", () => {
  placeGameObjects({});
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCannonOffense",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual([]);
  expect(combatRoll.self.hasUnit("custodia-vigilia" as UnitType)).toBe(false);
});

it("modifier", () => {
  placeGameObjects({
    systemNsid: "tile.system:base/18",
    self: [
      "card.legendary-planet:codex.vigil/custodia-vigilia",
      "card.planet:base/mecatol-rex",
    ],
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCannonOffense",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["Custodia Vigilia"]);
  expect(combatRoll.self.hasUnit("custodia-vigilia" as UnitType)).toBe(true);
});

it("modifier (wrong roll type)", () => {
  placeGameObjects({
    systemNsid: "tile.system:base/18",
    self: [
      "card.legendary-planet:codex.vigil/custodia-vigilia",
      "card.planet:base/mecatol-rex",
    ],
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "groundCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual([]);
});

it("modifier (new mecatol)", () => {
  placeGameObjects({
    systemNsid: "tile.system:thunders-edge/112",
    self: [
      "card.legendary-planet:codex.vigil/custodia-vigilia",
      "card.planet:thunders-edge/mecatol-rex",
    ],
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCannonOffense",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["Custodia Vigilia"]);
  expect(combatRoll.self.hasUnit("custodia-vigilia" as UnitType)).toBe(true);
});
