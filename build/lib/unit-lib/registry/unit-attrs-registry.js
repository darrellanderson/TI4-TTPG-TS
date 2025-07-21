"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitAttrsRegistry = void 0;
const basic_types_schema_1 = require("../../system-lib/schema/basic-types-schema");
const unit_attrs_schema_1 = require("../schema/unit-attrs-schema");
const unit_attrs_data_1 = require("../data/unit-attrs.data");
const unit_attrs_1 = require("../unit-attrs/unit-attrs");
const unit_attrs_set_1 = require("../unit-attrs-set/unit-attrs-set");
class UnitAttrsRegistry {
    constructor() {
        this._unitToBaseAttrs = new Map();
        // Some "NSID"s aren't game objects, e.g. "flagship:pok/memoria".
        this._nsidToOverrideAttrs = new Map();
    }
    defaultUnitAttrsSet() {
        return new unit_attrs_set_1.UnitAttrsSet(this.getAllBaseAttrs());
    }
    getAllBaseAttrs() {
        return Array.from(this._unitToBaseAttrs.values());
    }
    getAllNsids() {
        return Array.from(this._nsidToOverrideAttrs.keys());
    }
    rawByUnit(unit) {
        return this._unitToBaseAttrs.get(unit);
    }
    rawByNsid(nsid) {
        return this._nsidToOverrideAttrs.get(nsid);
    }
    load(source, unitAttrsArray) {
        for (const unitAttrs of unitAttrsArray) {
            // Validate schema (oterhwise not validated until used).
            try {
                basic_types_schema_1.NsidNameSchema.parse(source);
                unit_attrs_schema_1.UnitAttrsSchema.parse(unitAttrs);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            }
            catch (e) {
                const msg = `error: ${e.message}\nparsing: ${JSON.stringify(unitAttrs)}`;
                throw new Error(msg);
            }
            if (unitAttrs.nsidName) {
                const nsid = unit_attrs_1.UnitAttrs.schemaToNsid(source, unitAttrs);
                this._nsidToOverrideAttrs.set(nsid, unitAttrs);
            }
            else {
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
    loadDefaultData() {
        for (const [source, unitAttrsArray] of Object.entries(unit_attrs_data_1.SOURCE_TO_UNIT_ATTRS_DATA)) {
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
        const nsids = [...this._nsidToOverrideAttrs.keys()];
        for (const nsid of nsids) {
            // Make sure NSID is valid.
            if (nsid.startsWith("card.technology") &&
                !TI4.techRegistry.getByNsid(nsid)) {
                errors.push(`Tech not found: "${nsid}"`);
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
exports.UnitAttrsRegistry = UnitAttrsRegistry;
//# sourceMappingURL=unit-attrs-registry.js.map