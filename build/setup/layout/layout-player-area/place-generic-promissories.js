"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaceGenericPromissories = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
class PlaceGenericPromissories {
    constructor(playerSlot) {
        this._cardUtil = new ttpg_darrell_1.CardUtil();
        this._find = new ttpg_darrell_1.Find();
        this._playerSlot = playerSlot;
    }
    place() {
        const cardHolder = this._getCardHolder();
        const colorName = this._getColorName();
        const deck = this._getPromissoryDeck();
        if (cardHolder && colorName) {
            const cards = this._getGenericPromissoryCards(deck, colorName);
            this._placeCards(cardHolder, cards);
        }
        ttpg_darrell_1.DeletedItemsContainer.destroyWithoutCopying(deck);
    }
    _getCardHolder() {
        const skipContained = true;
        const cardHolder = this._find.findCardHolder("card-holder:base/player-hand", this._playerSlot, skipContained);
        return cardHolder;
    }
    _getColorName() {
        const colorName = TI4.playerColor.getSlotColorName(this._playerSlot);
        return colorName;
    }
    _getPromissoryDeck() {
        const deckNsids = ttpg_darrell_1.Spawn.getAllNsids().filter((nsid) => nsid.startsWith("card.promissory"));
        const deck = ttpg_darrell_1.Spawn.spawnMergeDecksOrThrow(deckNsids);
        return deck;
    }
    _getGenericPromissoryCards(deck, colorName) {
        const result = [];
        const cardStack = this._cardUtil.filterCards(deck, (nsid) => {
            return nsid.startsWith(`card.promissory.${colorName}`);
        });
        if (cardStack) {
            const cards = this._cardUtil.separateDeck(cardStack);
            result.push(...cards);
        }
        return result;
    }
    _placeCards(cardHolder, cards) {
        for (const card of cards) {
            card.setRotation([0, 0, 180]);
            cardHolder.insert(card, cardHolder.getNumCards());
        }
    }
}
exports.PlaceGenericPromissories = PlaceGenericPromissories;
//# sourceMappingURL=place-generic-promissories.js.map