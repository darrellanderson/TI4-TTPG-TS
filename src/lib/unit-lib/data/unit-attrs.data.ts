import { UnitAttrsSchemaType } from "../schema/unit-attrs-schema";

export const SOURCE_TO_UNIT_ATTRS_DATA: Record<
  string,
  Array<UnitAttrsSchemaType>
> = {
  base: [
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
  ],
};
