import { UnitAttrs } from "./unit-attrs";

it("constructor", () => {
  const unitAttrs = new UnitAttrs({
    name: "name",
    unit: "infantry",
    unitCount: 1,
    producePerCost: 2,
    isShip: true,
    isGround: true,
    sustainDamage: true,
    planetaryShild: true,
    disablePlanetaryShield: true,
    antiFighterBarrage: {
      dice: 1,
      hit: 2,
      rerollMisses: true,
    },
    bombardment: {
      dice: 3,
      hit: 4,
      rerollMisses: false,
    },
    spaceCannon: {
      dice: 5,
      hit: 6,
      rerollMisses: true,
    },
    spaceCombat: {
      dice: 7,
      hit: 8,
      rerollMisses: false,
    },
    groundCombat: {
      dice: 9,
      hit: 10,
      rerollMisses: true,
    },
  });
});
