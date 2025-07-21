"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveRegistry = void 0;
const remove_data_1 = require("../data/remove.data");
const remove_by_nsid_or_source_1 = require("../remove-by-nsid-or-source/remove-by-nsid-or-source");
class RemoveRegistry {
    constructor() {
        this._sourceToRemoveNsids = new Map();
    }
    createRemoveFromRegistryAndConfig() {
        const remove = new remove_by_nsid_or_source_1.RemoveByNsidOrSource();
        const useSources = TI4.config.sources;
        const removeSources = this.getAllSources().filter((source) => {
            return !useSources.includes(source);
        });
        for (const source of removeSources) {
            remove.addSource(source);
        }
        for (const source of useSources) {
            const nsids = this.getRemoveBySource(source);
            for (const nsid of nsids) {
                remove.addNsid(nsid);
            }
        }
        return remove;
    }
    getAllNsids() {
        const result = [];
        for (const nsids of this._sourceToRemoveNsids.values()) {
            result.push(...nsids);
        }
        return result;
    }
    getAllSources() {
        return [...this._sourceToRemoveNsids.keys()];
    }
    getRemoveBySource(source) {
        const result = this._sourceToRemoveNsids.get(source);
        return [...(result !== null && result !== void 0 ? result : [])];
    }
    load(source, nsids) {
        if (this._sourceToRemoveNsids.has(source)) {
            throw new Error(`Source already exists: ${source}`);
        }
        this._sourceToRemoveNsids.set(source, nsids);
        return this;
    }
    loadDefaultData() {
        for (const [source, nsids] of Object.entries(remove_data_1.SOURCE_TO_REMOVE_NSIDS)) {
            this.load(source, nsids);
        }
        return this;
    }
}
exports.RemoveRegistry = RemoveRegistry;
//# sourceMappingURL=remove-registry.js.map