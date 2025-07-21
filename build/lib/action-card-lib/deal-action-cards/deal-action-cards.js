"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DealActionCards = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const player_seats_1 = require("../../player-lib/player-seats/player-seats");
class DealActionCards {
    constructor() {
        this._cardUtil = new ttpg_darrell_1.CardUtil();
        this._find = new ttpg_darrell_1.Find();
        this._playerSeats = new player_seats_1.PlayerSeats();
    }
    getPlayerSlotToActionCardCount() {
        const slotToCount = new Map();
        // Seed with 1.
        for (const seatEntry of this._playerSeats.getAllSeats()) {
            slotToCount.set(seatEntry.playerSlot, 1);
        }
        // "Scheming" faction ability adds a card.
        const slotToFaction = TI4.factionRegistry.getPlayerSlotToFaction();
        for (const [slot, faction] of slotToFaction) {
            if (faction.getAbilityNsids().includes("faction-ability:base/scheming")) {
                let count = slotToCount.get(slot);
                if (count !== undefined) {
                    count += 1;
                    slotToCount.set(slot, count);
                }
            }
        }
        const skipContained = true;
        for (const obj of api_1.world.getAllObjects(skipContained)) {
            if (!this._cardUtil.isLooseCard(obj)) {
                continue;
            }
            const nsid = ttpg_darrell_1.NSID.get(obj);
            // Add one if "Neural Motivator" technology.
            if (nsid === "card.technology.green:base/neural-motivator") {
                const owner = this._find.closestOwnedCardHolderOwner(obj.getPosition());
                let count = slotToCount.get(owner);
                if (count !== undefined) {
                    count += 1;
                    slotToCount.set(owner, count);
                }
            }
        }
        return slotToCount;
    }
    /**
     * Deal action cards to players.
     *
     * @returns Set of player slots that did not receive enough cards.
     */
    dealAllActionCards() {
        const tooFewCards = new Set();
        for (const [slot, count] of this.getPlayerSlotToActionCardCount()) {
            if (!this.dealActionCards(slot, count)) {
                tooFewCards.add(slot);
            }
        }
        return tooFewCards;
    }
    /**
     * Deal action cards to a player.
     *
     * @param playerSlot
     * @param count
     */
    dealActionCards(playerSlot, count) {
        for (let i = 0; i < count; i++) {
            // Find deck.
            const deckSnapPointTag = "deck-action";
            const discardSnapPointTag = "discard-action";
            const shuffleDiscard = true;
            let deck = this._find.findDeckOrDiscard(deckSnapPointTag, discardSnapPointTag, shuffleDiscard);
            if (deck === undefined) {
                return false;
            }
            // Draw a card.
            let card;
            if (deck.getStackSize() > 1) {
                const takeCount = 1;
                const fromFront = true;
                const offset = 0;
                const keep = false;
                card = deck.takeCards(takeCount, fromFront, offset, keep);
            }
            else {
                // Last card, use it and release the deck.
                card = deck;
                deck = undefined;
            }
            if (card !== undefined &&
                !this._cardUtil.dealToHolder(card, playerSlot)) {
                return false;
            }
        }
        return true;
    }
}
exports.DealActionCards = DealActionCards;
//# sourceMappingURL=deal-action-cards.js.map