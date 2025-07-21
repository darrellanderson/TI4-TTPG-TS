"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpawnMissingCards = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
/**
 * Homebrew injection may add new cards to existings decks.
 * Given a new deck nsid, add any missing cards to the corresponding deck.
 */
class SpawnMissingCards {
    constructor() {
        this._cardUtil = new ttpg_darrell_1.CardUtil();
        this._find = new ttpg_darrell_1.Find();
    }
    static shouldSpawnMissingCards(deckNsid) {
        // Generic technology requires spawning for each player.
        // Ignore tech for now.
        return (deckNsid.startsWith("card.action") ||
            deckNsid.startsWith("card.agenda") ||
            deckNsid.startsWith("card.exploration.") ||
            deckNsid.startsWith("card.faction-reference") ||
            deckNsid.startsWith("card.legendary-planet") ||
            deckNsid.startsWith("card.objective.") ||
            deckNsid.startsWith("card.planet") ||
            deckNsid.startsWith("card.relic"));
    }
    spawnAndAddMissingCards(deckNsid) {
        const existingDeck = this._getExistingDeck(deckNsid);
        if (existingDeck) {
            const spawnedDeck = this._spawnDeck(deckNsid);
            if (spawnedDeck) {
                this._addMissingCards(spawnedDeck, existingDeck);
            }
        }
    }
    _spawnDeck(deckNsid) {
        const obj = ttpg_darrell_1.Spawn.spawn(deckNsid);
        if (obj instanceof api_1.Card) {
            return obj;
        }
        else if (obj) {
            ttpg_darrell_1.DeletedItemsContainer.destroyWithoutCopying(obj);
        }
    }
    /**
     * Decks are normally stored on snap points of `deck-${type}`
     * where cards have a `card.${type}` nsid prefix.
     *
     * @param deckNsid
     */
    _getExistingDeck(deckNsid) {
        const parsed = ttpg_darrell_1.NSID.parse(deckNsid);
        if (parsed && deckNsid.startsWith("card.")) {
            // Handle card.exploration.cultural, etc.
            let cardType = parsed.typeParts.slice(1).join("-");
            if (cardType) {
                // Public objectives omit the stage from the deck tag.
                cardType = cardType.replace("-stage-", "-");
                const snapPointTag = `deck-${cardType}`;
                const deck = this._find.findDeckOrDiscard(snapPointTag);
                if (deck) {
                    return deck;
                }
            }
        }
    }
    _addMissingCards(srcDeck, dstDeck) {
        const dstDeckNsids = new Set(ttpg_darrell_1.NSID.getDeck(dstDeck));
        const spawnedCards = this._cardUtil.separateDeck(srcDeck);
        spawnedCards.forEach((card) => {
            const nsid = ttpg_darrell_1.NSID.get(card);
            if (!dstDeckNsids.has(nsid)) {
                // Add the card to the existing deck.
                dstDeck.addCards(card);
            }
            else {
                // If the card already exists, destroy it.
                ttpg_darrell_1.DeletedItemsContainer.destroyWithoutCopying(card);
            }
        });
    }
}
exports.SpawnMissingCards = SpawnMissingCards;
//# sourceMappingURL=spawn-missing-cards.js.map