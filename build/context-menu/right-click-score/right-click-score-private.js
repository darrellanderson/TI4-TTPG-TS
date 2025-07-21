"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RightClickScorePrivate = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
const advance_score_1 = require("../../lib/score-lib/advance-score/advance-score");
const move_card_to_player_scored_1 = require("../../lib/score-lib/move-card-to-player-scored/move-card-to-player-scored");
const place_control_token_on_card_1 = require("../../lib/control-token-lib/place-control-token-on-card");
/**
 * Score context menu item for cards that should move to
 * the player's scored area card-holer.
 */
class RightClickScorePrivate {
    constructor() {
        this._actionName = "*Score (private)";
        this._customActionHandler = (card, player, actionName) => {
            if (actionName === this._actionName) {
                this.score(card, player);
            }
        };
    }
    static isScorablePrivate(card) {
        const nsid = ttpg_darrell_1.NSID.get(card);
        const nsidExtras = ttpg_darrell_1.NSID.getExtras(card);
        return (nsid.startsWith("card.objective.secret") ||
            nsidExtras.includes("scorable-private") ||
            (nsid.startsWith("card.promissory") &&
                nsid.endsWith("support-for-the-throne")));
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
        if (RightClickScorePrivate.isScorablePrivate(card)) {
            card.removeCustomAction(this._actionName);
            card.addCustomAction(this._actionName);
            card.onCustomAction.remove(this._customActionHandler);
            card.onCustomAction.add(this._customActionHandler);
        }
    }
    score(card, player) {
        const playerSlot = player.getSlot();
        // Special case for "classified documents leaks" where a secret objective
        // becomes public.  If the secret is on the agenda/laws mat treat is as
        // public (or in the "extra" slot on the stage 1/2 mat).
        let isPublic = false;
        const snappedToPoint = card.getSnappedToPoint();
        if (snappedToPoint) {
            const snappedToObj = snappedToPoint.getParentObject();
            if (snappedToObj) {
                const nsid = ttpg_darrell_1.NSID.get(snappedToObj);
                if ([
                    "mat:base/objective-1",
                    "mat:base/objective-2",
                    "mat:base/agenda-laws",
                ].includes(nsid)) {
                    isPublic = true;
                }
            }
        }
        if (isPublic) {
            new place_control_token_on_card_1.PlaceControlTokenOnCard().place(card, playerSlot);
        }
        else {
            new move_card_to_player_scored_1.MoveCardToPlayerScored().moveCard(card, playerSlot);
        }
        const value = 1;
        new advance_score_1.AdvanceScore().addToScore(playerSlot, value);
    }
}
exports.RightClickScorePrivate = RightClickScorePrivate;
//# sourceMappingURL=right-click-score-private.js.map