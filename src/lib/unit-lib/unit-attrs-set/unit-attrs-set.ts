import { UnitAttrsSchemaType, UnitType } from "../schema/unit-attrs-schema";
import { UnitAttrs } from "../unit-attrs/unit-attrs";

export class UnitAttrsSet {
  private readonly _unitToAttrs: Map<UnitType, UnitAttrs> = new Map();

  constructor(baseSchemaTypes: Array<UnitAttrsSchemaType>) {
    for (const schemaType of baseSchemaTypes) {
      this._unitToAttrs.set(schemaType.unit, new UnitAttrs(schemaType));
    }
  }

  applyOverride(override: UnitAttrsSchemaType): boolean {
    const unitAttrs: UnitAttrs | undefined = this._unitToAttrs.get(
      override.unit
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
}
