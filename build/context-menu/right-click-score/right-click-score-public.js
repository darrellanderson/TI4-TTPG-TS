"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RightClickScorePublic = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
const advance_score_1 = require("../../lib/score-lib/advance-score/advance-score");
const place_control_token_on_card_1 = require("../../lib/control-token-lib/place-control-token-on-card");
/**
 * Score context menu for cards that receive control tokens;
 * they do NOT move the player's scored area card-holder.
 */
class RightClickScorePublic {
    constructor() {
        this._actionName = "*Score (public)";
        this._customActionHandler = (card, player, actionName) => {
            if (actionName === this._actionName) {
                this.score(card, player);
            }
        };
    }
    static isScorablePublic(card) {
        const nsid = ttpg_darrell_1.NSID.get(card);
        const nsidExtras = ttpg_darrell_1.NSID.getExtras(card);
        return (nsid.startsWith("card.objective.public-") ||
            nsidExtras.includes("scorable-public"));
    }
    init() {
        ttpg_darrell_1.OnCardBecameSingletonOrDeck.onSingletonCardMadeDeck.add((card) => {
            card.removeCustomAction(this._actionName);
        });
        ttpg_darrell_1.OnCardBecameSingletonOrDeck.onSingletonCardCreated.add((card) => {
            this._maybeAddContextMenuItem(card);
        });
    }
    _maybeAddContextMenuItem(card) {
        if (RightClickScorePublic.isScorablePublic(card)) {
            card.removeCustomAction(this._actionName);
            card.addCustomAction(this._actionName);
            card.onCustomAction.remove(this._customActionHandler);
            card.onCustomAction.add(this._customActionHandler);
        }
    }
    score(card, player) {
        const playerSlot = player.getSlot();
        new place_control_token_on_card_1.PlaceControlTokenOnCard().place(card, playerSlot);
        const nsid = ttpg_darrell_1.NSID.get(card);
        const value = nsid.startsWith("card.objective.public-2") ? 2 : 1;
        new advance_score_1.AdvanceScore().addToScore(playerSlot, value);
    }
}
exports.RightClickScorePublic = RightClickScorePublic;
//# sourceMappingURL=right-click-score-public.js.map