import { UnitModifierSchemaType } from "../schema/unit-modifier-schema";
import { UnitModifier } from "../unit-modifier/unit-modifier";
export declare class UnitModifierRegistry {
    private readonly _nsidToSchema;
    private readonly _always;
    getAllNsids(): Array<string>;
    getAllWithNsids(): Array<UnitModifier>;
    getAlways(): Array<UnitModifier>;
    getByNsid(nsid: string): UnitModifier | undefined;
    load(source: string, unitModifierSchemas: Array<UnitModifierSchemaType>): this;
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
