"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractMabanOmega = exports.MABAN_OMEGA_ACTION_NAME = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
exports.MABAN_OMEGA_ACTION_NAME = "*Maban Omega";
/**
 * Naalu commander omega "card.leader.commander:codex.vigil/maban.omega"
 * (and "card.alliance:codex.vigil/naalu.omega"):
 * "At any time: You may look at your neighbors' hands of promissory notes
 * and the top and bottom card of the agenda deck"
 */
class AbstractMabanOmega extends ttpg_darrell_1.AbstractRightClickCard {
    constructor(cardNsid) {
        const customActionHandler = (object, player, identifier) => {
            if (identifier === exports.MABAN_OMEGA_ACTION_NAME) {
                this.doMabanOmegaAction(object, player);
            }
        };
        super(cardNsid, exports.MABAN_OMEGA_ACTION_NAME, customActionHandler);
        this._find = new ttpg_darrell_1.Find();
    }
    isCommanderActive() {
        const nsid = "card.leader.commander:codex.vigil/maban.omega";
        const owningPlayerSlot = undefined;
        const skipContained = false;
        const commander = this._find.findCard(nsid, owningPlayerSlot, skipContained);
        return commander !== undefined && commander.isFaceUp();
    }
    isOwningPlayer(object, player) {
        const pos = object.getPosition();
        const closest = this._find.closestOwnedCardHolderOwner(pos);
        return closest === player.getSlot();
    }
    getNeighboringPlayerSlots(player) {
        const playerSlot = player.getSlot();
        const seatIndex = TI4.playerSeats.getSeatIndexByPlayerSlotOrThrow(playerSlot);
        const leftSeatIndex = (seatIndex + TI4.config.playerCount - 1) % TI4.config.playerCount;
        const rightSeatIndex = (seatIndex + 1) % TI4.config.playerCount;
        const leftPlayerSlot = TI4.playerSeats.getPlayerSlotBySeatIndexOrThrow(leftSeatIndex);
        const rightPlayerSlot = TI4.playerSeats.getPlayerSlotBySeatIndexOrThrow(rightSeatIndex);
        return [leftPlayerSlot, rightPlayerSlot];
    }
    getPromissoryNotes(playerSlot) {
        const promissoryNotes = [];
        const skipContained = true;
        const cardHolder = this._find.findCardHolderBySlot(playerSlot, skipContained);
        if (cardHolder !== undefined) {
            const cards = cardHolder.getCards();
            for (const card of cards) {
                const nsid = ttpg_darrell_1.NSID.get(card);
                if (nsid.startsWith("card.promissory")) {
                    const cardDetails = card.getCardDetails();
                    promissoryNotes.push(cardDetails.name);
                }
            }
        }
        return promissoryNotes;
    }
    getAgendaDeckTopBottom() {
        let result = undefined;
        const deckSnapPointTag = "deck-agenda";
        const agendaDeck = this._find.findDeckOrDiscard(deckSnapPointTag);
        if (agendaDeck) {
            const allCardDetails = agendaDeck.getAllCardDetails();
            const top = allCardDetails[allCardDetails.length - 1];
            const bottom = allCardDetails[0];
            if (top && bottom) {
                result = {
                    top: top.name,
                    bottom: bottom.name,
                };
            }
        }
        return result;
    }
    doMabanOmegaAction(object, player) {
        const playerName = TI4.playerName.getByPlayer(player);
        const color = api_1.world.getSlotColor(player.getSlot());
        if (!this.isOwningPlayer(object, player)) {
            const msg = `Maban: You are not the owner of this card.`;
            ttpg_darrell_1.Broadcast.chatOne(player, msg, color);
            return;
        }
        if (!this.isCommanderActive()) {
            const msg = `Maban: Commander is not active.`;
            ttpg_darrell_1.Broadcast.chatOne(player, msg, color);
            return;
        }
        const msgParts = [];
        const neighboringPlayerSlots = this.getNeighboringPlayerSlots(player);
        for (const neighboringPlayerSlot of neighboringPlayerSlots) {
            const neighborName = TI4.playerName.getBySlot(neighboringPlayerSlot);
            const promisssoryNotes = this.getPromissoryNotes(neighboringPlayerSlot);
            const msg = `Maban: ${neighborName} promissory notes: ${promisssoryNotes.join(", ")}`;
            msgParts.push(msg);
        }
        const agendaDeckTopBottom = this.getAgendaDeckTopBottom();
        if (agendaDeckTopBottom) {
            const msg = `Maban: Agenda deck top: ${agendaDeckTopBottom.top}, bottom: ${agendaDeckTopBottom.bottom}`;
            msgParts.push(msg);
        }
        const globalMsg = `${playerName} used Maban Omega`;
        ttpg_darrell_1.Broadcast.broadcastAll(globalMsg, color);
        const msg = msgParts.join("\n");
        ttpg_darrell_1.Broadcast.chatOne(player, msg, color);
    }
}
exports.AbstractMabanOmega = AbstractMabanOmega;
//# sourceMappingURL=abstract-maban-omega.js.map