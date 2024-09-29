import { UnitAttrsSchemaType, UnitType } from "../schema/unit-attrs-schema";
import { UnitAttrs } from "../unit-attrs/unit-attrs";

export class UnitAttrsSet {
  private readonly _unitToAttrs: Map<UnitType, UnitAttrs> = new Map();

  constructor(baseSchemaTypes: Array<UnitAttrsSchemaType>) {
    for (const schemaType of baseSchemaTypes) {
      this._unitToAttrs.set(schemaType.unit, new UnitAttrs(schemaType));
    }
  }

  /**
   * Unit modifiers can add a new unit type.
   * The "unit" parameter is a "UnitType" so caller probably needs
   * to violate it via "<string> as UnitType".
   *
   * @param unit
   * @param schema
   */
  addSyntheticUnit(schema: UnitAttrsSchemaType): boolean {
    if (this._unitToAttrs.has(schema.unit)) {
      return false;
    }
    this._unitToAttrs.set(schema.unit, new UnitAttrs(schema));
    return true;
  }

  applyOverride(override: UnitAttrsSchemaType): boolean {
    const unitAttrs: UnitAttrs | undefined = this._unitToAttrs.get(
      override.unit,
    );
    if (unitAttrs) {
      unitAttrs.applyOverride(override);
      return true;
    }
    return false;
  }

  get(unit: UnitType): UnitAttrs | undefined {
    return this._unitToAttrs.get(unit);
  }

  getOrThrow(unit: UnitType): UnitAttrs {
    const unitAttrs: UnitAttrs | undefined = this._unitToAttrs.get(unit);
    if (unitAttrs) {
      return unitAttrs;
    }
    throw new Error(`unit not found: ${unit}`);
  }

  getAll(): Array<UnitAttrs> {
    return Array.from(this._unitToAttrs.values());
  }
}
