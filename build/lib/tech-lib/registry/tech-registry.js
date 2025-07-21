"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TechRegistry = void 0;
const basic_types_schema_1 = require("../../system-lib/schema/basic-types-schema");
const tech_data_1 = require("../data/tech.data");
const tech_schema_1 = require("../schema/tech-schema");
const tech_1 = require("../tech/tech");
class TechRegistry {
    constructor() {
        this._nsidToTech = new Map();
    }
    getAllNsids() {
        return Array.from(this._nsidToTech.keys());
    }
    getAllTechs() {
        return Array.from(this._nsidToTech.values());
    }
    getByNsid(nsid) {
        return this._nsidToTech.get(nsid);
    }
    getByNsidNameMaybeOmegaToo(nsidName) {
        const result = [];
        for (const tech of this._nsidToTech.values()) {
            if (tech.getNsidName().startsWith(nsidName)) {
                result.push(tech);
            }
        }
        return result;
    }
    load(source, techSchemas) {
        for (const techSchema of techSchemas) {
            // Validate schema (oterhwise not validated until used).
            try {
                basic_types_schema_1.NsidNameSchema.parse(source);
                tech_schema_1.TechSchema.parse(techSchema);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            }
            catch (e) {
                const msg = `error: ${e.message}\nparsing: ${JSON.stringify(techSchema)}`;
                throw new Error(msg);
            }
            const tech = new tech_1.Tech(source, techSchema);
            const nsid = tech.getNsid();
            if (this._nsidToTech.has(nsid)) {
                throw new Error(`duplicate nsid: ${nsid}`);
            }
            if (tech.isFactionTech() &&
                tech.getColor() === "unit-upgrade" &&
                !tech.replacesNsidName()) {
                throw new Error(`unit-upgrade tech must have replacesNsidName: ${nsid}`);
            }
            this._nsidToTech.set(nsid, tech);
        }
        return this;
    }
    loadDefaultData() {
        for (const [source, techSchemas] of Object.entries(tech_data_1.SOURCE_TO_TECH_DATA)) {
            this.load(source, techSchemas);
        }
        return this;
    }
}
exports.TechRegistry = TechRegistry;
//# sourceMappingURL=tech-registry.js.map