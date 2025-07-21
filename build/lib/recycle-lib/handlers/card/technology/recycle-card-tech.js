"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecycleCardTech = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
class RecycleCardTech extends ttpg_darrell_1.GarbageHandler {
    constructor() {
        super();
        this._find = new ttpg_darrell_1.Find();
    }
    canRecycle(obj) {
        return obj instanceof api_1.Card && ttpg_darrell_1.NSID.get(obj).startsWith("card.technology");
    }
    recycle(card) {
        if (card instanceof api_1.Card) {
            // Per-player tech deck mat.
            const deckTag = "deck-tech";
            const discardTag = undefined;
            const shuffleDiscard = undefined;
            const playerSlot = card.getOwningPlayerSlot();
            const deck = this._find.findDeckOrDiscard(deckTag, discardTag, shuffleDiscard, playerSlot);
            if (deck) {
                return deck.addCards(card);
            }
        }
        return false;
    }
}
exports.RecycleCardTech = RecycleCardTech;
//# sourceMappingURL=recycle-card-tech.js.map