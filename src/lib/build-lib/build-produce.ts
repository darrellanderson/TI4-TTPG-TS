import { GameObject, Rotator, Vector } from "@tabletop-playground/api";
import { NSID } from "ttpg-darrell";

import { UnitAttrs } from "../unit-lib/unit-attrs/unit-attrs";
import { UnitAttrsSet } from "../unit-lib/unit-attrs-set/unit-attrs-set";
import { UnitPlastic } from "../unit-lib/unit-plastic/unit-plastic";
import { UnitType } from "../unit-lib/schema/unit-attrs-schema";

export type BuildProduceEntry = {
  obj: GameObject;
  unit: UnitType;
  count: number;
};

export class BuildProduce {
  private readonly _entries: Array<BuildProduceEntry> = [];
  private readonly _unitAttrsSet: UnitAttrsSet;

  constructor(objs: Array<GameObject>, unitAttrsSet: UnitAttrsSet) {
    this._unitAttrsSet = unitAttrsSet;

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

  getPlasticCount(): number {
    let count: number = 0;
    this._entries.forEach((entry) => {
      count += entry.count;
    });
    return count;
  }

  moveToSystemTile(systemTileObj: GameObject): void {
    const r: number = 3.5;
    const dPhi: number = (Math.PI * 2) / this._entries.length;
    this._entries.forEach((entry, index) => {
      const obj: GameObject = entry.obj;
      const phi: number = dPhi * index;
      let pos: Vector = new Vector(Math.cos(phi) * r, Math.sin(phi) * r, 0);
      pos = systemTileObj.localPositionToWorld(pos).add([0, 0, 5 + index / 2]);
      const rot: Rotator = new Rotator(0, obj.getRotation().yaw, 0);
      obj.setPosition(pos, 1);
      obj.setRotation(rot, 1);
    });
  }

  report(): string {
    const unitToCount: Map<UnitType, number> = new Map();
    this._entries.forEach((entry) => {
      const unit: UnitType = entry.unit;
      const count: number = entry.count;
      const prevCount: number = unitToCount.get(unit) ?? 0;
      unitToCount.set(unit, prevCount + count);
    });

    const units: Array<UnitType> = Array.from(unitToCount.keys()).sort();
    const result: Array<string> = [];
    let totalCost: number = 0;
    for (const unit of units) {
      const count: number | undefined = unitToCount.get(unit);
      if (count !== undefined) {
        let name: string = unit;
        if (count > 1 && unit !== "infantry") {
          name += "s";
        }
        result.push(`${count} ${name}`);

        const unitAttrs: UnitAttrs | undefined = this._unitAttrsSet.get(unit);
        if (unitAttrs) {
          const produceCount: number = Math.ceil(
            count / unitAttrs.getProducePerCost()
          );
          const produceCost: number | undefined = unitAttrs.getCost();
          if (produceCost !== undefined) {
            totalCost += produceCount * produceCost;
          }
        }
      }
    }
    return `producing $${totalCost}: ${result.join(", ")}`;
  }
}
