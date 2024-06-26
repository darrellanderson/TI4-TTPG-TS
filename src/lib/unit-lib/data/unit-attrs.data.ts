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
      spaceCombat: {
        hit: 9,
      },
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

    // Fighter
    {
      name: "Fighter",
      unit: "fighter",
      unitCount: 10,
      isShip: true,
      cost: 1,
      producePerCost: 2,
      spaceCombat: {
        hit: 9,
      },
    },
    {
      name: "Fighter II",
      unit: "fighter",
      nsidName: "fighter-2",
      spaceCombat: {
        hit: 8,
      },
    },
    {
      name: "Hybrid Crystal Fighter",
      unit: "fighter",
      nsidName: "hybrid-crystal-fighter",
      spaceCombat: {
        hit: 8,
      },
    },
    {
      name: "Hybrid Crystal Fighter II",
      unit: "fighter",
      nsidName: "hybrid-crystal-fighter-2",
      spaceCombat: {
        hit: 7,
      },
    },
  ],
};
