import { UnitAttrsSchemaType } from "../schema/unit-attrs-schema";

export const SOURCE_TO_UNIT_ATTRS_DATA: Record<
  string,
  Array<UnitAttrsSchemaType>
> = {
  base: [
    // Carrier
    {
      name: "Carrier",
      unit: "carrier",
      unitCount: 4,
      isShip: true,
      cost: 3,
      spaceCombat: { hit: 9 },
    },
    {
      name: "Carrier II",
      unit: "carrier",
      nsidName: "carrier-2",
    },
    {
      name: "Advanced Carrier",
      unit: "carrier",
      nsidName: "advanced-carrier",
    },
    {
      name: "Advanced Carrier II",
      unit: "carrier",
      nsidName: "advanced-carrier-2",
      sustainDamage: true,
    },

    // Cruiser
    {
      name: "Cruiser",
      unit: "cruiser",
      unitCount: 8,
      isShip: true,
      cost: 2,
      spaceCombat: { hit: 7 },
    },
    {
      name: "Cruiser II",
      unit: "cruiser",
      nsidName: "cruiser-2",
      spaceCombat: { hit: 6 },
    },
    {
      name: "Saturn Engine",
      unit: "cruiser",
      nsidName: "saturn-engine",
    },
    {
      name: "Saturn Engine II",
      unit: "cruiser",
      nsidName: "saturn-engine-2",
      spaceCombat: {
        hit: 6,
      },
    },

    // Destroyer
    {
      name: "Destroyer",
      unit: "destroyer",
      unitCount: 8,
      isShip: true,
      cost: 1,
      antiFighterBarrage: { dice: 2, hit: 9 },
      spaceCombat: { hit: 9 },
    },
    {
      name: "Destroyer II",
      unit: "destroyer",
      nsidName: "destroyer-2",
      antiFighterBarrage: { dice: 3, hit: 6 },
      spaceCombat: { hit: 8 },
    },
    {
      name: "String Wing Alpha",
      unit: "destroyer",
      nsidName: "strike-wing-alpha",
      spaceCombat: { hit: 8 },
    },
    {
      name: "Strike Wing Alpha II",
      unit: "destroyer",
      nsidName: "strike-wing-alpha-2",
      spaceCombat: { hit: 7 },
      afbDestroyInfantryInSpace: 9,
    },

    // Dreadnought
    {
      name: "Dreadnought",
      unit: "dreadnought",
      unitCount: 5,
      isShip: true,
      cost: 4,
      sustainDamage: true,
      bombardment: { hit: 5 },
      spaceCombat: { hit: 5 },
    },
    {
      name: "Dreadnought II",
      unit: "dreadnought",
      nsidName: "dreadnought-2",
      spaceCombat: { hit: 4 },
    },
    {
      name: "Exotrireme",
      unit: "dreadnought",
      nsidName: "exotrireme",
      bombardment: { dice: 2, hit: 4 },
    },
    {
      name: "Exotrireme II",
      unit: "dreadnought",
      nsidName: "exotrireme-2",
      bombardment: { dice: 2, hit: 4 },
    },
    {
      name: "Super Dreadnought",
      unit: "dreadnought",
      nsidName: "super-dreadnought",
    },
    {
      name: "Super Dreadnought II",
      unit: "dreadnought",
      nsidName: "super-dreadnought-2",
      bombardment: { hit: 4 },
      spaceCombat: { hit: 4 },
    },

    // Fighter
    {
      name: "Fighter",
      unit: "fighter",
      unitCount: 10,
      isShip: true,
      cost: 1,
      producePerCost: 2,
      spaceCombat: { hit: 9 },
    },
    {
      name: "Fighter II",
      unit: "fighter",
      nsidName: "fighter-2",
      spaceCombat: { hit: 8 },
    },
    {
      name: "Hybrid Crystal Fighter",
      unit: "fighter",
      nsidName: "hybrid-crystal-fighter",
      spaceCombat: { hit: 8 },
    },
    {
      name: "Hybrid Crystal Fighter II",
      unit: "fighter",
      nsidName: "hybrid-crystal-fighter-2",
      spaceCombat: { hit: 7 },
    },
  ],

  "codex.ordinian": [
    {
      name: "[Redacted]",
      unit: "destroyer",
      nsidName: "redacted",
      spaceCombat: { dice: 3, hit: 6 },
      afbDestroyInfantryInSpace: 9,
    },
  ],
};
