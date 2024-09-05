import { LayoutObjects } from "ttpg-darrell";

import { LayoutConfig } from "../layout-config";
import { UnitType } from "../../../lib/unit-lib/schema/unit-attrs-schema";
import { LayoutUnitBox } from "./layout-unit-box";

export class LayoutUnitBoxes {
  private readonly _layout: LayoutObjects = new LayoutObjects();

  constructor(playerSlot: number) {
    this._layout.setChildDistance(LayoutConfig.spacing).setIsVertical(true);

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
      const unitBox: LayoutUnitBox = new LayoutUnitBox(unit, playerSlot);
      this._layout.add(unitBox.getLayout());
    }
  }

  getLayout(): LayoutObjects {
    return this._layout;
  }
}
