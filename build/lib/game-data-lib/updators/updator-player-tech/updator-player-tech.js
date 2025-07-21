"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatorPlayerTech = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
class UpdatorPlayerTech {
    static getTimestamp(card) {
        const data = card.getSavedData("timestamp");
        if (data && data.length > 0) {
            return parseInt(data, 10);
        }
        return 0;
    }
    static setTimestamp(card) {
        const oldData = card.getSavedData("timestamp");
        if (!oldData || oldData.length === 0) {
            const data = Date.now().toString();
            card.setSavedData(data, "timestamp");
        }
    }
    constructor() {
        this._cardUtil = new ttpg_darrell_1.CardUtil();
        this._find = new ttpg_darrell_1.Find();
        // world.getAllObjects does not return cards in creation order.
        // Add a creation timestamp to tech cards so we can sort them by creation order.
        ttpg_darrell_1.OnCardBecameSingletonOrDeck.onSingletonCardCreated.add((card, _player) => {
            const nsid = ttpg_darrell_1.NSID.get(card);
            if (card instanceof api_1.Card && nsid.startsWith("card.technology.")) {
                UpdatorPlayerTech.setTimestamp(card);
            }
        });
    }
    update(gameData) {
        const techCards = [];
        const skipContained = false;
        const allowFaceDown = true;
        for (const obj of api_1.world.getAllObjects(skipContained)) {
            const nsid = ttpg_darrell_1.NSID.get(obj);
            if (obj instanceof api_1.Card &&
                nsid.startsWith("card.technology.") &&
                this._cardUtil.isLooseCard(obj, allowFaceDown)) {
                techCards.push(obj);
            }
        }
        // Sort tech cards by creation order.
        techCards.sort((a, b) => {
            const aTimestamp = UpdatorPlayerTech.getTimestamp(a);
            const bTimestamp = UpdatorPlayerTech.getTimestamp(b);
            if (aTimestamp !== bTimestamp) {
                return aTimestamp - bTimestamp;
            }
            // Break ties by alpha order of name.
            return a.getName().localeCompare(b.getName());
        });
        // Sort planet cards by player slot.
        const playerSlotToCards = new Map();
        techCards.forEach((card) => {
            const pos = card.getPosition();
            const playerSlot = this._find.closestOwnedCardHolderOwner(pos);
            let cards = playerSlotToCards.get(playerSlot);
            if (!cards) {
                cards = [];
                playerSlotToCards.set(playerSlot, cards);
            }
            cards.push(card);
        });
        gameData.players.forEach((player, seatIndex) => {
            var _a;
            const playerSlot = TI4.playerSeats.getPlayerSlotBySeatIndex(seatIndex);
            const cards = (_a = playerSlotToCards.get(playerSlot)) !== null && _a !== void 0 ? _a : [];
            player.technologies = cards
                .map((card) => {
                const nsid = ttpg_darrell_1.NSID.get(card);
                const tech = TI4.techRegistry.getByNsid(nsid);
                return tech ? tech.getName() : "";
            })
                .filter((name) => name.length > 0);
        });
    }
}
exports.UpdatorPlayerTech = UpdatorPlayerTech;
//# sourceMappingURL=updator-player-tech.js.map