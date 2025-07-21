"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShuffleDecks = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
class ShuffleDecks {
    init() {
        const gameInProgress = TI4.config.timestamp !== 0;
        if (gameInProgress) {
            return;
        }
        const deckSnapPointTags = [
            "deck-action",
            "deck-agenda",
            "deck-exploration-cultural",
            "deck-exploration-frontier",
            "deck-exploration-hazardous",
            "deck-exploration-industrial",
            "deck-objective-1",
            "deck-objective-2",
            "deck-objective-secret",
            "deck-relic",
        ];
        const find = new ttpg_darrell_1.Find();
        for (const deckSnapPointTag of deckSnapPointTags) {
            const deck = find.findDeckOrDiscard(deckSnapPointTag);
            if (deck) {
                deck.shuffle();
            }
        }
    }
}
exports.ShuffleDecks = ShuffleDecks;
//# sourceMappingURL=shuffle-decks.js.map