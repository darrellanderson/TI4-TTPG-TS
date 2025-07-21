"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgendaAvailableVotes = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
class AgendaAvailableVotes {
    constructor() {
        this._cardUtil = new ttpg_darrell_1.CardUtil();
        this._find = new ttpg_darrell_1.Find();
    }
    _getPlayerSlotToPerPlanetBonus() {
        const playerSlotToPerPlanetBonus = new Map();
        let nsid;
        let card;
        // Xxcha commander.
        let xxchaCommanderUnlocked = false;
        nsid = "card.leader.commander:pok/elder-qanoj";
        card = this._find.findCard(nsid);
        const allowFaceDown = false;
        if (card && this._cardUtil.isLooseCard(card, allowFaceDown)) {
            const pos = card.getPosition();
            const playerSlot = this._find.closestOwnedCardHolderOwner(pos);
            playerSlotToPerPlanetBonus.set(playerSlot, 1);
            xxchaCommanderUnlocked = true;
        }
        nsid = "card.alliance:pok/xxcha";
        card = this._find.findCard(nsid);
        if (card &&
            this._cardUtil.isLooseCard(card, allowFaceDown) &&
            xxchaCommanderUnlocked) {
            const pos = card.getPosition();
            const playerSlot = this._find.closestOwnedCardHolderOwner(pos);
            playerSlotToPerPlanetBonus.set(playerSlot, 1);
        }
        return playerSlotToPerPlanetBonus;
    }
    _isRepresentativeGovernment() {
        const nsids = [
            "card.agenda:pok/representative-government",
            "card.agenda:base/representative-government",
        ];
        const skipContained = true;
        for (const obj of api_1.world.getAllObjects(skipContained)) {
            const nsid = ttpg_darrell_1.NSID.get(obj);
            if (nsids.includes(nsid) && obj instanceof api_1.Card) {
                const allowFaceDown = false;
                const rejectSnapPointTags = [
                    "discard-agenda",
                    "active-agenda",
                ];
                if (this._cardUtil.isLooseCard(obj, allowFaceDown, rejectSnapPointTags)) {
                    return true;
                }
            }
        }
        return false;
    }
    _getXxekirGromOmegaPlayerSlots() {
        const playerSlots = new Set();
        const skipContained = true;
        const xxcekirNsid = "card.leader.hero:codex.vigil/xxekir-grom.omega";
        const allowFaceDown = false;
        for (const obj of api_1.world.getAllObjects(skipContained)) {
            const nsid = ttpg_darrell_1.NSID.get(obj);
            if (nsid === xxcekirNsid &&
                obj instanceof api_1.Card &&
                this._cardUtil.isLooseCard(obj, allowFaceDown)) {
                const pos = obj.getPosition();
                const playerSlot = this._find.closestOwnedCardHolderOwner(pos);
                playerSlots.add(playerSlot);
            }
        }
        return playerSlots;
    }
    _getFaceUpPlanetCards() {
        const cards = [];
        const skipContained = true;
        const allowFaceDown = false;
        const rejectSnapPointTags = ["deck-planet"];
        for (const obj of api_1.world.getAllObjects(skipContained)) {
            const nsid = ttpg_darrell_1.NSID.get(obj);
            if (nsid.startsWith("card.planet:") &&
                obj instanceof api_1.Card &&
                this._cardUtil.isLooseCard(obj, allowFaceDown, rejectSnapPointTags)) {
                const planet = TI4.systemRegistry.getPlanetByPlanetCardNsid(nsid);
                if (planet) {
                    cards.push(obj);
                }
            }
        }
        return cards;
    }
    getPlayerSlotToAvailableVotes() {
        var _a;
        const playerSlotToAvailableVotes = new Map();
        const playerSlots = TI4.playerSeats
            .getAllSeats()
            .map((seat) => seat.playerSlot);
        // Representative government: 1 vote per player.
        if (this._isRepresentativeGovernment()) {
            for (const playerSlot of playerSlots) {
                playerSlotToAvailableVotes.set(playerSlot, 1);
            }
            return playerSlotToAvailableVotes;
        }
        const playerSlotToPerPlanetBonus = this._getPlayerSlotToPerPlanetBonus();
        // Xxekir Grom Omega: add planet resources to influence.
        const xxekirGromOmegaPlayerSlots = this._getXxekirGromOmegaPlayerSlots();
        const skipContained = true;
        const allowFaceDown = false;
        const rejectSnapPointTags = ["deck-planet"];
        for (const obj of api_1.world.getAllObjects(skipContained)) {
            const nsid = ttpg_darrell_1.NSID.get(obj);
            if (nsid.startsWith("card.planet:") &&
                obj instanceof api_1.Card &&
                this._cardUtil.isLooseCard(obj, allowFaceDown, rejectSnapPointTags)) {
                const planet = TI4.systemRegistry.getPlanetByPlanetCardNsid(nsid);
                if (planet) {
                    const pos = obj.getPosition();
                    const playerSlot = this._find.closestOwnedCardHolderOwner(pos);
                    let votes = (_a = playerSlotToAvailableVotes.get(playerSlot)) !== null && _a !== void 0 ? _a : 0;
                    votes += planet.getInfluence();
                    const bonus = playerSlotToPerPlanetBonus.get(playerSlot);
                    if (bonus !== undefined) {
                        votes += bonus;
                    }
                    if (xxekirGromOmegaPlayerSlots.has(playerSlot)) {
                        votes += planet.getResources();
                    }
                    playerSlotToAvailableVotes.set(playerSlot, votes);
                }
            }
        }
        // Add zero votes for any player slots not already in the map.
        for (const playerSlot of playerSlots) {
            if (!playerSlotToAvailableVotes.has(playerSlot)) {
                playerSlotToAvailableVotes.set(playerSlot, 0);
            }
        }
        return playerSlotToAvailableVotes;
    }
}
exports.AgendaAvailableVotes = AgendaAvailableVotes;
//# sourceMappingURL=agenda-available-votes.js.map