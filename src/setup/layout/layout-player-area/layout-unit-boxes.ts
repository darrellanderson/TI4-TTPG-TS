import { LayoutObjects, Spawn } from "ttpg-darrell";

import { LayoutConfig } from "../layout-config";
import { UnitType } from "../../../lib/unit-lib/schema/unit-attrs-schema";
import { LayoutUnitBox } from "./layout-unit-box";
import { GameObject, ObjectType } from "@tabletop-playground/api";

export class LayoutUnitBoxes {
  private readonly _layout: LayoutObjects = new LayoutObjects();

  constructor(playerSlot: number) {
    this._layout.setChildDistance(LayoutConfig.spacing).setIsVertical(true);

    /*
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
      */

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

    let row: LayoutObjects | undefined;
    units.forEach((unit, index) => {
      if (index % 4 === 0) {
        row = new LayoutObjects()
          .setChildDistance(LayoutConfig.spacing)
          .setIsVertical(false);
        this._layout.add(row);
      }

      if (row) {
        const unitBox: LayoutUnitBox = new LayoutUnitBox(unit, playerSlot);
        row.add(unitBox.getLayout());
      }
    });

    if (row) {
      const garbageContainer: GameObject = Spawn.spawnOrThrow(
        "container:base/garbage"
      );
      row.add(garbageContainer);
      this._layout.addAfterLayout(() => {
        garbageContainer.setObjectType(ObjectType.Ground);
      });
    }
  }

  getLayout(): LayoutObjects {
    return this._layout;
  }
}
