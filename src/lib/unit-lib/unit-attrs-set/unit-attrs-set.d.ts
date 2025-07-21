import { UnitAttrsSchemaType, UnitType } from "../schema/unit-attrs-schema";
import { UnitAttrs } from "../unit-attrs/unit-attrs";
export declare class UnitAttrsSet {
    private readonly _unitToAttrs;
    constructor(baseSchemaTypes: Array<UnitAttrsSchemaType>);
    /**
     * Unit modifiers can add a new unit type.
     * The "unit" parameter is a "UnitType" so caller probably needs
     * to violate it via "<string> as UnitType".
     *
     * @param unit
     * @param schema
     */
    addSyntheticUnit(schema: UnitAttrsSchemaType): boolean;
    applyOverride(override: UnitAttrsSchemaType): boolean;
    get(unit: UnitType): UnitAttrs | undefined;
    getOrThrow(unit: UnitType): UnitAttrs;
    getAll(): Array<UnitAttrs>;
}
