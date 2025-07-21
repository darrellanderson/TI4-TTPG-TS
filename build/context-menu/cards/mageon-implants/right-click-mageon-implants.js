"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RightClickMageonImplants = exports.MAGEON_IMPLANTS_ACTION = exports.MAGEON_IMPLANTS_NSID = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
exports.MAGEON_IMPLANTS_NSID = "card.technology.green:base/mageon-implants";
exports.MAGEON_IMPLANTS_ACTION = "*Tell Owning Player My Action Cards";
/**
 * Mageon Implants "card.technology.green:base/mageon-implants":
 * "ACTION: Exhaust this card to look at another player's hand of action cards.
 * Choose 1 of those cards and add it to your hand."
 */
class RightClickMageonImplants extends ttpg_darrell_1.AbstractRightClickCard {
    constructor() {
        const onCustomAction = (object, player, identifier) => {
            if (identifier === exports.MAGEON_IMPLANTS_ACTION) {
                const ownerPos = object.getPosition();
                const ownerSlot = this._find.closestOwnedCardHolderOwner(ownerPos);
                const clickingPlayerSlot = player.getSlot();
                const actionCardNames = this.getActionCardNames(clickingPlayerSlot);
                this.reportActionCardNames(clickingPlayerSlot, ownerSlot, actionCardNames);
            }
        };
        super(exports.MAGEON_IMPLANTS_NSID, exports.MAGEON_IMPLANTS_ACTION, onCustomAction);
        this._find = new ttpg_darrell_1.Find();
    }
    getActionCardNames(playerSlot) {
        const actionCardNames = [];
        const cardHolder = this._find.findCardHolderBySlot(playerSlot);
        if (cardHolder) {
            cardHolder.getCards().forEach((card) => {
                const nsid = ttpg_darrell_1.NSID.get(card);
                if (nsid.startsWith("card.action:")) {
                    const cardDetails = card.getCardDetails();
                    actionCardNames.push(cardDetails.name);
                }
            });
        }
        return actionCardNames;
    }
    reportActionCardNames(clickingPlayerSlot, reportToPlayerSlot, actionCardNames) {
        const clickingPlayerName = TI4.playerName.getBySlot(clickingPlayerSlot);
        const clickingColor = api_1.world.getSlotColor(clickingPlayerSlot);
        const reportToPlayerName = TI4.playerName.getBySlot(reportToPlayerSlot);
        const globalMsg = `Mageon Implants: ${clickingPlayerName} told ${reportToPlayerName} their action cards`;
        ttpg_darrell_1.Broadcast.broadcastAll(globalMsg, clickingColor);
        const reportToPlayer = api_1.world.getPlayerBySlot(reportToPlayerSlot);
        const msg = `Mageon Implants: ${clickingPlayerName} reports action cards: ${actionCardNames.join(", ")}`;
        if (reportToPlayer) {
            ttpg_darrell_1.Broadcast.chatOne(reportToPlayer, msg, clickingColor);
        }
    }
}
exports.RightClickMageonImplants = RightClickMageonImplants;
//# sourceMappingURL=right-click-mageon-implants.js.map