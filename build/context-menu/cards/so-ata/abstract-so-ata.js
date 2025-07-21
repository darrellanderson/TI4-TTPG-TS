"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractSoAta = exports.ACTION_REPORT_SECRET_OBJECTIVES = exports.ACTION_REPORT_PROMISSORY_NOTES = exports.ACTION_REPORT_ACTION_CARDS = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
exports.ACTION_REPORT_ACTION_CARDS = "*Tell Owning Player My Action Cards";
exports.ACTION_REPORT_PROMISSORY_NOTES = "*Tell Owning Player My Promissory Notes";
exports.ACTION_REPORT_SECRET_OBJECTIVES = "*Tell Owning Player My Secret Objectives";
/**
 * Yssaril commander "card.leader.commander:pok/so-ata"
 * or alliance: "card.alliance:pok/yssaril"
 * "After another player activates a system that contains your units: You may
 * look at that player's action cards, promissory notes, or secret objectives."
 */
class AbstractSoAta {
    constructor(cardNsid) {
        this._find = new ttpg_darrell_1.Find();
        this._onCustomAction = (object, player, identifier) => {
            const reportCardType = this._getReportCardType(identifier);
            if (reportCardType) {
                const ownerPos = object.getPosition();
                const ownerSlot = this._find.closestOwnedCardHolderOwner(ownerPos);
                const clickingPlayerSlot = player.getSlot();
                const cardNames = this._getCards(reportCardType, clickingPlayerSlot);
                this._doReport(reportCardType, clickingPlayerSlot, ownerSlot, cardNames);
            }
        };
        this._cardNsid = cardNsid;
    }
    init() {
        ttpg_darrell_1.OnCardBecameSingletonOrDeck.onSingletonCardCreated.add((card, _player) => {
            const nsid = ttpg_darrell_1.NSID.get(card);
            if (nsid === this._cardNsid) {
                card.onCustomAction.remove(this._onCustomAction);
                card.onCustomAction.add(this._onCustomAction);
                card.removeCustomAction(exports.ACTION_REPORT_ACTION_CARDS);
                card.removeCustomAction(exports.ACTION_REPORT_PROMISSORY_NOTES);
                card.removeCustomAction(exports.ACTION_REPORT_SECRET_OBJECTIVES);
            }
        });
        ttpg_darrell_1.OnCardBecameSingletonOrDeck.onSingletonCardMadeDeck.add((card, oldNsid, _player) => {
            if (oldNsid === this._cardNsid) {
                card.onCustomAction.remove(this._onCustomAction);
                card.removeCustomAction(exports.ACTION_REPORT_ACTION_CARDS);
                card.removeCustomAction(exports.ACTION_REPORT_PROMISSORY_NOTES);
                card.removeCustomAction(exports.ACTION_REPORT_SECRET_OBJECTIVES);
            }
        });
    }
    _getReportCardType(customActionName) {
        if (customActionName === exports.ACTION_REPORT_ACTION_CARDS) {
            return "action";
        }
        else if (customActionName === exports.ACTION_REPORT_PROMISSORY_NOTES) {
            return "promissory";
        }
        else if (customActionName === exports.ACTION_REPORT_SECRET_OBJECTIVES) {
            return "secret";
        }
        return undefined;
    }
    _getCards(reportCardType, playerSlot) {
        const cardNames = [];
        const cardHolder = this._find.findCardHolderBySlot(playerSlot);
        if (cardHolder) {
            cardHolder.getCards().forEach((card) => {
                const cardName = card.getCardDetails().name;
                const nsid = ttpg_darrell_1.NSID.get(card);
                if ((reportCardType === "action" && nsid.startsWith("card.action:")) ||
                    (reportCardType === "promissory" &&
                        nsid.startsWith("card.promissory:")) ||
                    (reportCardType === "secret" &&
                        nsid.startsWith("card.objective.secret:"))) {
                    cardNames.push(cardName);
                }
            });
        }
        return cardNames;
    }
    _doReport(reportCardType, clickingPlayerSlot, reportToPlayerSlot, cardNames) {
        const clickingPlayerName = TI4.playerName.getBySlot(clickingPlayerSlot);
        const clickingColor = api_1.world.getSlotColor(clickingPlayerSlot);
        const reportToPlayerName = TI4.playerName.getBySlot(reportToPlayerSlot);
        const globalMsg = `So Ata: ${clickingPlayerName} told ${reportToPlayerName} their ${reportCardType} cards`;
        ttpg_darrell_1.Broadcast.broadcastAll(globalMsg, clickingColor);
        const reportToPlayer = api_1.world.getPlayerBySlot(reportToPlayerSlot);
        const msg = `So Ata: ${clickingPlayerName} reports ${reportCardType} cards: ${cardNames.join(", ")}`;
        if (reportToPlayer) {
            ttpg_darrell_1.Broadcast.chatOne(reportToPlayer, msg, clickingColor);
        }
    }
}
exports.AbstractSoAta = AbstractSoAta;
//# sourceMappingURL=abstract-so-ata.js.map