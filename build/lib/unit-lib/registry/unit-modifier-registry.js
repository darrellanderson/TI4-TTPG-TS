"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitModifierRegistry = void 0;
const basic_types_schema_1 = require("../../system-lib/schema/basic-types-schema");
const unit_modifier_schema_1 = require("../schema/unit-modifier-schema");
const unit_modifier_1 = require("../unit-modifier/unit-modifier");
const unit_modifier_data_1 = require("../data/unit-modifier.data");
const ttpg_darrell_1 = require("ttpg-darrell");
class UnitModifierRegistry {
    constructor() {
        this._nsidToSchema = new Map();
        this._always = [];
    }
    getAllNsids() {
        return Array.from(this._nsidToSchema.keys());
    }
    getAllWithNsids() {
        return Array.from(this._nsidToSchema.values());
    }
    getAlways() {
        return [...this._always];
    }
    getByNsid(nsid) {
        if (nsid.endsWith(".1") ||
            nsid.endsWith(".2") ||
            nsid.endsWith(".3") ||
            nsid.endsWith(".4")) {
            nsid = nsid.slice(0, nsid.length - 2);
        }
        return this._nsidToSchema.get(nsid);
    }
    load(source, unitModifierSchemas) {
        for (const unitModifierSchema of unitModifierSchemas) {
            // Validate schema (oterhwise not validated until used).
            try {
                basic_types_schema_1.NsidNameSchema.parse(source);
                unit_modifier_schema_1.UnitModifierSchema.parse(unitModifierSchema);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            }
            catch (e) {
                const msg = `error: ${e.message}\nparsing: ${JSON.stringify(unitModifierSchema)}`;
                throw new Error(msg);
            }
            const unitModifier = new unit_modifier_1.UnitModifier(unitModifierSchema);
            const triggers = unitModifierSchema.triggers;
            for (const trigger of triggers) {
                const nsid = unit_modifier_1.UnitModifier.schemaTriggerToNsid(source, trigger);
                if (nsid) {
                    this._nsidToSchema.set(nsid, unitModifier);
                }
            }
            if (unitModifierSchema.triggerAlways) {
                this._always.push(unitModifier);
            }
        }
        return this;
    }
    /**
     * Load the game data (base plus codices and expansions).
     *
     * @returns
     */
    loadDefaultData() {
        for (const [source, unitAttrsArray] of Object.entries(unit_modifier_data_1.SOURCE_TO_UNIT_MODIFIER_DATA)) {
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
    validate(errors) {
        const nsids = [...this._nsidToSchema.keys()];
        for (const nsid of nsids) {
            // Make sure NSID is valid.
            const parsed = ttpg_darrell_1.NSID.parse(nsid);
            if (parsed) {
                // If tech, make sure tech is registered.
                if (nsid.startsWith("card.technology") &&
                    !TI4.techRegistry.getByNsid(nsid)) {
                    errors.push(`Tech not found: "${nsid}"`);
                }
                // If unit, make sure unit is registered.
                if ((nsid.startsWith("unit:") ||
                    nsid.startsWith("card.technology.unit-upgrade:") ||
                    nsid.startsWith("card.leader.mech:")) &&
                    !TI4.unitAttrsRegistry.rawByNsid(nsid)) {
                    errors.push(`Unit not found: "${nsid}"`);
                }
            }
        }
        return this;
    }
    validateOrThrow() {
        const errors = [];
        this.validate(errors);
        if (errors.length > 0) {
            throw new Error(errors.join("\n"));
        }
        return this;
    }
}
exports.UnitModifierRegistry = UnitModifierRegistry;
//# sourceMappingURL=unit-modifier-registry.js.map