"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveByNsidOrSource = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
/**
 * Remove content based on source or NSID.
 */
class RemoveByNsidOrSource {
    constructor() {
        this._cardUtil = new ttpg_darrell_1.CardUtil();
        this._removeSources = new Set();
        this._removeNsids = new Set();
        this._shouldRemove = (nsid) => {
            const parsed = ttpg_darrell_1.NSID.parse(nsid);
            let remove = this._removeNsids.has(nsid);
            if (parsed && !remove) {
                const source = parsed.sourceParts.join(".");
                remove = this._removeSources.has(source);
            }
            if (nsid.endsWith("|scenario")) {
                return true;
            }
            return remove;
        };
    }
    /**
     * Add a source to remove.
     * @param source Source to remove.
     */
    addSource(source) {
        this._removeSources.add(source);
        return this;
    }
    /**
     * Add an NSID to remove.
     * @param nsid NSID to remove.
     */
    addNsid(nsid) {
        this._removeNsids.add(nsid);
        return this;
    }
    hasSource(source) {
        return this._removeSources.has(source);
    }
    hasNsid(nsid) {
        return this._removeNsids.has(nsid);
    }
    removeOne(obj) {
        // Cards.
        if (obj instanceof api_1.Card) {
            // Cards.
            const dele = this._cardUtil.filterCards(obj, this._shouldRemove);
            if (dele) {
                ttpg_darrell_1.DeletedItemsContainer.destroyWithoutCopying(dele);
            }
        }
        else {
            // Basic objects.
            const nsid = ttpg_darrell_1.NSID.get(obj);
            if (this._shouldRemove(nsid)) {
                ttpg_darrell_1.DeletedItemsContainer.destroyWithoutCopying(obj);
            }
        }
        return this;
    }
    removeAll() {
        const skipContained = false;
        for (const obj of api_1.world.getAllObjects(skipContained)) {
            this.removeOne(obj);
        }
        return this;
    }
    shouldRemove(nsid) {
        return this._shouldRemove(nsid);
    }
}
exports.RemoveByNsidOrSource = RemoveByNsidOrSource;
//# sourceMappingURL=remove-by-nsid-or-source.js.map