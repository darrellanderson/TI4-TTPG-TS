import { OPPONENT, placeGameObjects, SELF } from "../abstract.test";
import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitAttrs } from "../../../unit-attrs/unit-attrs";

it("registry", () => {
  const nsid = "flagship:pok/quetzecoatl";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe(
    "Quetzecoatl"
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

  const pds: UnitAttrs = combatRoll.opponent.unitAttrsSet.getOrThrow("pds")!;
  expect(pds.getDisableSpaceCannonOffense()).toBe(false);
});

it("modifier", () => {
  placeGameObjects({
    opponent: ["flagship:pok/quetzecoatl"],
    opponentUnits: new Map([["flagship", 1]]),
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCannonOffense",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(
    combatRoll.opponent.unitAttrsSet.getOrThrow("flagship")!.getName()
  ).toBe("Quetzecoatl");
  expect(combatRoll.getUnitModifierNames()).toEqual(["Quetzecoatl"]);

  const pds: UnitAttrs = combatRoll.opponent.unitAttrsSet.getOrThrow("pds")!;
  expect(pds.getDisableSpaceCannonOffense()).toBe(true);
});
