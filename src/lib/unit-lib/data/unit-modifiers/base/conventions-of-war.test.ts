import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { OPPONENT, placeGameObjects, SELF } from "../abstract.test";

it("registry", () => {
  const nsid = "card.agenda:base/conventions-of-war";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe(
    "Conventions of War",
  );
});

it("modifier", () => {
  placeGameObjects({
    systemNsid: "tile.system:base/25",
    any: ["card.agenda:base/conventions-of-war"],
  });

  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "bombardment",
    hex: "<0,0,0>",
    planetName: "Quann",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.planet).toBeDefined();
  expect(combatRoll.planet?.getTraits()).toEqual(["cultural"]);

  expect(combatRoll.getUnitModifierNames()).toEqual(["Conventions of War"]);
  expect(
    combatRoll.self.unitAttrsSet.get("dreadnought")?.getDisableBombardment(),
  ).toBe(true);
});
