"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnpackFactionTech = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
const abstract_unpack_1 = require("../abstract-unpack/abstract-unpack");
class UnpackFactionTech extends abstract_unpack_1.AbstractUnpack {
    constructor(faction, playerSlot) {
        super(faction, playerSlot);
        this._cardUtil = new ttpg_darrell_1.CardUtil();
        this._find = new ttpg_darrell_1.Find();
    }
    unpack() {
        const deck = this.spawnDeckAndFilterSourcesOrThrow("card.technology");
        const filtered = this._filterFactionTech(deck);
        ttpg_darrell_1.DeletedItemsContainer.destroyWithoutCopying(deck);
        this._addFilteredToExistingTechDeck(filtered);
    }
    remove() {
        const existingTechDeck = this._getExistingTechDeckOrThrow();
        const filtered = this._filterFactionTech(existingTechDeck);
        if (filtered) {
            ttpg_darrell_1.DeletedItemsContainer.destroyWithoutCopying(filtered);
        }
    }
    _getExistingTechDeckOrThrow() {
        const existingTechDeck = this._find.findDeckOrDiscard("deck-technology", undefined, undefined, this.getPlayerSlot());
        if (!existingTechDeck) {
            throw new Error(`Could not find tech deck for ${this.getPlayerSlot()}`);
        }
        return existingTechDeck;
    }
    _filterFactionTech(deck) {
        const factionTechNsids = new Set(this.getFaction().getFactionTechNsids());
        return this._cardUtil.filterCards(deck, (nsid) => {
            return factionTechNsids.has(nsid);
        });
    }
    _addFilteredToExistingTechDeck(filtered) {
        const existingTechDeck = this._getExistingTechDeckOrThrow();
        if (filtered) {
            existingTechDeck.addCards(filtered);
        }
    }
}
exports.UnpackFactionTech = UnpackFactionTech;
//# sourceMappingURL=unpack-faction-tech.js.map