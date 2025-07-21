"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoveCardToPlayerScored = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
class MoveCardToPlayerScored {
    _getPlayerScoringCardHolder(playerSlot) {
        const nsid = `card-holder:base/player-scoring`;
        const skipContained = true;
        const cardHolder = new ttpg_darrell_1.Find().findCardHolder(nsid, playerSlot, skipContained);
        return cardHolder;
    }
    moveCard(card, playerSlot) {
        const cardHolder = this._getPlayerScoringCardHolder(playerSlot);
        if (cardHolder) {
            const length = cardHolder.getCards().length;
            cardHolder.insert(card, length);
            return true;
        }
        return false;
    }
}
exports.MoveCardToPlayerScored = MoveCardToPlayerScored;
//# sourceMappingURL=move-card-to-player-scored.js.map