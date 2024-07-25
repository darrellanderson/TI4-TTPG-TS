import { NsidNameSchema } from "../../system-lib/schema/basic-types-schema";
import {
  UnitAttrsSchema,
  UnitAttrsSchemaType,
  UnitType,
} from "../schema/unit-attrs-schema";
import { SOURCE_TO_UNIT_ATTRS_DATA } from "../data/unit-attrs.data";
import { UnitAttrs } from "../unit-attrs/unit-attrs";
import { UnitAttrsSet } from "../unit-attrs-set/unit-attrs-set";

export class UnitAttrsRegistry {
  private readonly _unitToBaseAttrs: Map<UnitType, UnitAttrsSchemaType> =
    new Map();

  // Some "NSID"s aren't game objects, e.g. "flagship:pok/memoria".
  private readonly _nsidToOverrideAttrs: Map<string, UnitAttrsSchemaType> =
    new Map();

  constructor() {}

  defaultUnitAttrsSet(): UnitAttrsSet {
    return new UnitAttrsSet(this.getAllBaseAttrs());
  }

  getAllBaseAttrs(): Array<UnitAttrsSchemaType> {
    return Array.from(this._unitToBaseAttrs.values());
  }

  rawByUnit(unit: UnitType): UnitAttrsSchemaType | undefined {
    return this._unitToBaseAttrs.get(unit);
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

  /**
   * Verify modifiers with tech or unit based triggers link to a known tech
   * or unit.
   *
   * @param errors
   * @returns
   */
  validate(errors: Array<string>): this {
    const nsids: Array<string> = [...this._nsidToOverrideAttrs.keys()];
    for (const nsid of nsids) {
      // Make sure NSID is valid.
      if (
        nsid.startsWith("card.technology") &&
        !TI4.techRegistry.getByNsid(nsid)
      ) {
        errors.push(`Tech not found: "${nsid}"`);
      }
    }
    return this;
  }

  validateOrThrow(): this {
    const errors: Array<string> = [];
    this.validate(errors);
    if (errors.length > 0) {
      throw new Error(errors.join("\n"));
    }
    return this;
  }
}
