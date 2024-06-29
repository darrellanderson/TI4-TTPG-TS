import { HexType, NSID, ParsedNSID } from "ttpg-darrell";
import { UnitSchema, UnitType } from "../schema/unit-attrs-schema";
import { Planet } from "lib/system-lib/planet/planet";
import { GameObject, world } from "@tabletop-playground/api";

export type UnitPlasticEntry = {
  unit: UnitType;
  count: number;
  obj: GameObject;
  hex: HexType;
  owningPlayerSlot: number;
  planetClosest?: Planet; // set on demand
  planetExact?: Planet; // set on demand
};

export class UnitPlastic {
  public getOne(obj: GameObject): UnitPlasticEntry | undefined {
    let unit: UnitType | undefined;
    let count: number = 1;
    let owningPlayerSlot: number = obj.getOwningPlayerSlot(); // -1 for tokens

    const nsid: string = NSID.get(obj);
    if (nsid.startsWith("unit:")) {
      const parsed: ParsedNSID | undefined = NSID.parse(nsid);
      const maybeUnit: string | undefined = parsed?.nameParts[0];
      if (UnitSchema.safeParse(maybeUnit).success) {
        unit = maybeUnit as UnitType;
      }
    } else if (nsid.startsWith("token:base/")) {
      switch (nsid) {
        case "token:base/infantry-1":
          unit = "infantry";
          count = 1;
          break;
        case "token:base/infantry-3":
          unit = "infantry";
          count = 3;
          break;
        case "token:base/fighter-1":
          unit = "fighter";
          count = 1;
          break;
        case "token:base/fighter-3":
          unit = "fighter";
          count = 3;
          break;
      }
    }

    if (!unit) {
      return undefined;
    }
    return {
      unit,
      count,
      obj,
      hex: TI4.hex.fromPosition(obj.getPosition()),
      owningPlayerSlot,
    };
  }

  getAll(): Array<UnitPlasticEntry> {
    const result: Array<UnitPlasticEntry> = [];
    const skipContained: boolean = true;
    for (const obj of world.getAllObjects(skipContained)) {
      const maybeEntry: UnitPlasticEntry | undefined = this.getOne(obj);
      if (maybeEntry) {
        result.push(maybeEntry);
      }
    }
    return result;
  }
}
