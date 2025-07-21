"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractValidate = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
class AbstractValidate {
    /**
     * Get the set of card NSIDs where the registered decks match the nsid prefix.
     *
     * @param cardNsidPrefix
     * @returns
     */
    getCardNsids(cardNsidPrefix) {
        const deckNsids = ttpg_darrell_1.Spawn.getAllNsids().filter((nsid) => {
            return nsid.startsWith(cardNsidPrefix);
        });
        const deck = ttpg_darrell_1.Spawn.spawnMergeDecks(deckNsids);
        if (deck === undefined) {
            return new Set();
        }
        const cardNsids = ttpg_darrell_1.NSID.getDeck(deck);
        ttpg_darrell_1.DeletedItemsContainer.destroyWithoutCopying(deck);
        return new Set(cardNsids);
    }
    /**
     * Return items in src that are not in dst.
     *
     * @param src
     * @param dst
     * @returns
     */
    getSrcMissingFromDst(src, dst) {
        const missing = new Set();
        for (const nsid of src) {
            if (!dst.has(nsid)) {
                missing.add(nsid);
            }
        }
        return Array.from(missing);
    }
}
exports.AbstractValidate = AbstractValidate;
//# sourceMappingURL=abstract-validate.js.map