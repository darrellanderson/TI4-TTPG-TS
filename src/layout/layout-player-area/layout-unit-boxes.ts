import { LayoutConfig } from "layout/layout-config";
import { UnitType } from "lib/unit-lib/schema/unit-attrs-schema";
import { LayoutObjects } from "ttpg-darrell";
import { LayoutUnitBox } from "./layout-unit-box";

export class LayoutUnitBoxes extends LayoutObjects {
  constructor(playerSlot: number) {
    super();

    this.setChildDistance(LayoutConfig.spacing).setIsVertical(true);

    const units: Array<UnitType> = [
      "war-sun",
      "flagship",
      "dreadnought",
      "cruiser",
      "destroyer",
      "carrier",
      "pds",
      "space-dock",
      "fighter",
      "infantry",
      "mech",
    ];

    for (const unit of units) {
      const unitBox: LayoutObjects = new LayoutUnitBox(unit, playerSlot);
      this.add(unitBox);
    }
  }
}
