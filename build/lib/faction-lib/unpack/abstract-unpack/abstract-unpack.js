"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractUnpack = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
class AbstractUnpack {
    constructor(faction, playerSlot) {
        this._faction = faction;
        this._playerSlot = playerSlot;
    }
    getFaction() {
        return this._faction;
    }
    getPlayerSlot() {
        return this._playerSlot;
    }
    spawnDeckAndFilterSourcesOrThrow(cardNsidPrefix) {
        // Get all decks using the card prefix.
        const deckNsids = ttpg_darrell_1.Spawn.getAllNsids().filter((nsid) => {
            return nsid.startsWith(cardNsidPrefix);
        });
        // Spawn decks, merge into one.
        if (deckNsids.length === 0) {
            throw new Error(`Missing deck: "${cardNsidPrefix}"`);
        }
        const deck = ttpg_darrell_1.Spawn.spawnMergeDecksOrThrow(deckNsids);
        // Remove any sources/nsids based on game config.
        TI4.removeRegistry.createRemoveFromRegistryAndConfig().removeOne(deck);
        return deck;
    }
    getPlayerHandHolderOrThrow() {
        const skipContained = true;
        const cardHolder = new ttpg_darrell_1.Find().findCardHolder("card-holder:base/player-hand", this.getPlayerSlot(), skipContained);
        if (!cardHolder) {
            throw new Error("Missing player hand holder");
        }
        return cardHolder;
    }
    dealToPlayerOrThrow(card) {
        const playerHandHolder = this.getPlayerHandHolderOrThrow();
        playerHandHolder.insert(card, playerHandHolder.getNumCards());
    }
}
exports.AbstractUnpack = AbstractUnpack;
//# sourceMappingURL=abstract-unpack.js.map