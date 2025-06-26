import { UnitAttrsSchemaType, UnitType } from "../schema/unit-attrs-schema";
import { UnitAttrsSet } from "../unit-attrs-set/unit-attrs-set";
export declare class UnitAttrsRegistry {
    private readonly _unitToBaseAttrs;
    private readonly _nsidToOverrideAttrs;
    constructor();
    defaultUnitAttrsSet(): UnitAttrsSet;
    getAllBaseAttrs(): Array<UnitAttrsSchemaType>;
    getAllNsids(): Array<string>;
    rawByUnit(unit: UnitType): UnitAttrsSchemaType | undefined;
    rawByNsid(nsid: string): UnitAttrsSchemaType | undefined;
    load(source: string, unitAttrsArray: Array<UnitAttrsSchemaType>): this;
    /**
     * Load the game data (base plus codices and expansions).
     *
     * @returns
     */
    loadDefaultData(): this;
    /**
     * Verify modifiers with tech or unit based triggers link to a known tech
     * or unit.
     *
     * @param errors
     * @returns
     */
    validate(errors: Array<string>): this;
    validateOrThrow(): this;
}
