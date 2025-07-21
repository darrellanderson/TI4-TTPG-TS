"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitAttrsSet = void 0;
const unit_attrs_1 = require("../unit-attrs/unit-attrs");
class UnitAttrsSet {
    constructor(baseSchemaTypes) {
        this._unitToAttrs = new Map();
        for (const schemaType of baseSchemaTypes) {
            this._unitToAttrs.set(schemaType.unit, new unit_attrs_1.UnitAttrs(schemaType));
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
    addSyntheticUnit(schema) {
        if (this._unitToAttrs.has(schema.unit)) {
            return false;
        }
        this._unitToAttrs.set(schema.unit, new unit_attrs_1.UnitAttrs(schema));
        return true;
    }
    applyOverride(override) {
        const unitAttrs = this._unitToAttrs.get(override.unit);
        if (unitAttrs) {
            unitAttrs.applyOverride(override);
            return true;
        }
        return false;
    }
    get(unit) {
        return this._unitToAttrs.get(unit);
    }
    getOrThrow(unit) {
        const unitAttrs = this._unitToAttrs.get(unit);
        if (unitAttrs) {
            return unitAttrs;
        }
        throw new Error(`unit not found: ${unit}`);
    }
    getAll() {
        return Array.from(this._unitToAttrs.values());
    }
}
exports.UnitAttrsSet = UnitAttrsSet;
//# sourceMappingURL=unit-attrs-set.js.map