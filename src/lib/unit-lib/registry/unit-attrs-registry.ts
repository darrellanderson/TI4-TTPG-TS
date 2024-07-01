import { NsidNameSchema } from "../../system-lib/schema/basic-types-schema";
import {
  UnitAttrsSchema,
  UnitAttrsSchemaType,
  UnitType,
} from "../schema/unit-attrs-schema";
import { SOURCE_TO_UNIT_ATTRS_DATA } from "../data/unit-attrs.data";
import { UnitAttrs } from "../unit-attrs/unit-attrs";

export class UnitAttrsRegistry {
  private readonly _unitToBaseAttrs: Map<UnitType, UnitAttrsSchemaType> =
    new Map();
  private readonly _nsidNameToOverrideAttrs: Map<string, UnitAttrsSchemaType> =
    new Map();

  // Same values as above, but indexed with complete NSID.
  private readonly _nsidToOverrideAttrs: Map<string, UnitAttrsSchemaType> =
    new Map();

  constructor() {}

  getAllBaseAttrs(): Array<UnitAttrsSchemaType> {
    return Array.from(this._unitToBaseAttrs.values());
  }

  rawByUnit(unit: UnitType): UnitAttrsSchemaType | undefined {
    return this._unitToBaseAttrs.get(unit);
  }

  rawByNsidName(nsidName: string): UnitAttrsSchemaType | undefined {
    return this._nsidNameToOverrideAttrs.get(nsidName);
  }

  rawByNsid(nsid: string): UnitAttrsSchemaType | undefined {
    return this._nsidToOverrideAttrs.get(nsid);
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
        const nsid: string = UnitAttrs.schemaToNsid(source, unitAttrs);
        this._nsidToOverrideAttrs.set(nsid, unitAttrs);
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
