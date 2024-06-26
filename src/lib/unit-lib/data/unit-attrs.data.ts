import { UnitAttrsSchemaType } from "../schema/unit-attrs-schema";

export const SOURCE_TO_UNIT_ATTRS_DATA: Record<
  string,
  Array<UnitAttrsSchemaType>
> = {
  base: [
    // Fighter
    {
      name: "Fighter",
      unit: "fighter",
      unitCount: 10,
      isShip: true,
      producePerCost: 2,
      spaceCombat: {
        hit: 9,
      },
    },
    {
      name: "Fighter II",
      unit: "fighter",
      upgradeLevel: 2,
      nsidName: "fighter-2",
      spaceCombat: {
        hit: 8,
      },
    },
    {
      name: "Hybrid Crystal Fighter",
      unit: "fighter",
      upgradeLevel: 1,
      nsidName: "hybrid-crystal-fighter",
      spaceCombat: {
        hit: 8,
      },
    },
    {
      name: "Hybrid Crystal Fighter II",
      unit: "fighter",
      upgradeLevel: 2,
      nsidName: "hybrid-crystal-fighter-2",
      spaceCombat: {
        hit: 7,
      },
    },
  ],
};
