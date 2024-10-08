import { GameObject } from "@tabletop-playground/api";
import { NSID } from "ttpg-darrell";

import { UnitType } from "../unit-lib/schema/unit-attrs-schema";
import { UnitPlastic } from "../unit-lib/unit-plastic/unit-plastic";

export type BuildProduceEntry = {
  obj: GameObject;
  unit: UnitType;
  count: number;
};

export class BuildProduce {
  private readonly _entries: Array<BuildProduceEntry> = [];

  constructor(objs: Array<GameObject>) {
    for (const obj of objs) {
      let unit: UnitType | undefined = undefined;
      let count: number = 1;

      const plastic: UnitPlastic | undefined = UnitPlastic.getOne(obj);
      if (plastic) {
        unit = plastic.getUnit();
      }

      const nsid: string = NSID.get(obj);
      if (nsid === "token:base/infantry-1") {
        unit = "infantry";
      } else if (nsid === "token:base/infantry-3") {
        unit = "infantry";
        count = 3;
      } else if (nsid === "token:base/fighter-1") {
        unit = "fighter";
      } else if (nsid === "token:base/fighter-3") {
        unit = "fighter";
        count = 3;
      }

      if (unit) {
        this._entries.push({
          obj,
          unit,
          count,
        });
      }
    }
  }

  getEntries(): Array<BuildProduceEntry> {
    return this._entries;
  }
}
