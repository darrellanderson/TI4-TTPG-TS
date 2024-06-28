import { NsidNameSchema } from "../../system-lib/schema/basic-types-schema";
import {
  UnitAttrsSchema,
  UnitAttrsSchemaType,
  UnitType,
} from "../schema/unit-attrs-schema";
import { SOURCE_TO_UNIT_ATTRS_DATA } from "../data/unit-attrs.data";
import { UnitAttrsSet } from "../unit-attrs-set/unit-attrs-set";
import { UnitAttrs } from "../unit-attrs/unit-attrs";

export class UnitAttrsRegistry {
  private readonly _unitToBaseAttrs: Map<UnitType, UnitAttrsSchemaType> =
    new Map();
  private readonly _nsidNameToOverrideAttrs: Map<string, UnitAttrsSchemaType> =
    new Map();

  constructor() {}

  createUnitAttrsSet(nsidNames: Array<string>): UnitAttrsSet {
    const baseAttrs: Array<UnitAttrsSchemaType> = this.getAllBaseAttrs();
    const unitAttrsSet = new UnitAttrsSet(baseAttrs);

    // Apply in order, level 2 nsids sort after level 1.
    nsidNames = [...nsidNames].sort();

    for (const nsidName of nsidNames) {
      const overrideAttrs = this.getOverrideAttrs(nsidName);
      if (overrideAttrs) {
        const unitAttrs: UnitAttrs | undefined = unitAttrsSet.get(
          overrideAttrs.unit
        );
        if (unitAttrs) {
          unitAttrsSet.applyOverride(overrideAttrs);
        }
      }
    }
    return unitAttrsSet;
  }

  getAllBaseAttrs(): Array<UnitAttrsSchemaType> {
    return Array.from(this._unitToBaseAttrs.values());
  }

  getBaseAttrs(unit: UnitType): UnitAttrsSchemaType | undefined {
    return this._unitToBaseAttrs.get(unit);
  }

  getOverrideAttrs(nsidName: string): UnitAttrsSchemaType | undefined {
    return this._nsidNameToOverrideAttrs.get(nsidName);
  }

  load(source: string, unitAttrsArray: Array<UnitAttrsSchemaType>): this {
    for (const unitAttrs of unitAttrsArray) {
      // Validate schema (oterhwise not validated until used).
      try {
        NsidNameSchema.parse(source);
        UnitAttrsSchema.parse(unitAttrs);
      } catch (e) {
        const msg = `error: ${e.message}\nparsing: ${JSON.stringify(
          unitAttrs
        )}`;
        throw new Error(msg);
      }

      if (unitAttrs.nsidName) {
        this._nsidNameToOverrideAttrs.set(unitAttrs.nsidName, unitAttrs);
      } else {
        this._unitToBaseAttrs.set(unitAttrs.unit, unitAttrs);
      }
    }
    return this;
  }

  /**
   * Load the game data (base plus codices and expansions).
   *
   * @returns
   */
  public loadDefaultData(): this {
    for (const [source, unitAttrsArray] of Object.entries(
      SOURCE_TO_UNIT_ATTRS_DATA
    )) {
      this.load(source, unitAttrsArray);
    }
    return this;
  }
}
