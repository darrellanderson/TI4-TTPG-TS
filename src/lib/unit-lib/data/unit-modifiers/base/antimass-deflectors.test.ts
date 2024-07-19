import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { OPPONENT, placeGameObjects, SELF } from "../abstract.test";

it("registry", () => {
  const nsid = "card.technology.blue:base/antimass-deflectors";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)).toBeDefined();
});

it("antimass-deflectors (spaceCannonOffense)", () => {
  let combatRoll: CombatRoll;

  combatRoll = CombatRoll.createCooked({
    rollType: "spaceCannonOffense",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual([]);
  expect(
    combatRoll.self.unitAttrsSet.get("pds")?.getSpaceCannon()?.getHit()
  ).toBe(6);

  placeGameObjects({
    opponent: ["card.technology.blue:base/antimass-deflectors"],
  });
  combatRoll = CombatRoll.createCooked({
    rollType: "spaceCannonOffense",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["Antimass Deflectors"]);
  expect(
    combatRoll.self.unitAttrsSet.get("pds")?.getSpaceCannon()?.getHit()
  ).toBe(7);
});

it("antimass-deflectors (spaceCannonDefense)", () => {
  let combatRoll: CombatRoll;

  combatRoll = CombatRoll.createCooked({
    rollType: "spaceCannonDefense",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual([]);
  expect(
    combatRoll.self.unitAttrsSet.get("pds")?.getSpaceCannon()?.getHit()
  ).toBe(6);

  placeGameObjects({
    opponent: ["card.technology.blue:base/antimass-deflectors"],
  });
  combatRoll = CombatRoll.createCooked({
    rollType: "spaceCannonDefense",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["Antimass Deflectors"]);
  expect(
    combatRoll.self.unitAttrsSet.get("pds")?.getSpaceCannon()?.getHit()
  ).toBe(7);
});
