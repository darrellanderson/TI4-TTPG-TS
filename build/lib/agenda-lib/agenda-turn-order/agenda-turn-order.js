"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgendaTurnOrder = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
// Hack Election: During this agenda, voting begins with the player to the
// right of the speaker and continues counterclockwise.
const REVERSE_ORDER_NSIDS = new Set([
    "card.action:codex.ordinian/hack-election",
]);
class AgendaTurnOrder {
    constructor() {
        this._find = new ttpg_darrell_1.Find();
    }
    _getSpeakerTokenOrThrow() {
        const nsid = "token:base/speaker";
        const playerSlot = undefined;
        const skipContained = true;
        const speakerToken = this._find.findGameObject(nsid, playerSlot, skipContained);
        if (!speakerToken) {
            throw new Error("missing speaker token");
        }
        return speakerToken;
    }
    _getSpeakerTokenSeatIndexOrThrow() {
        const speakerToken = this._getSpeakerTokenOrThrow();
        const pos = speakerToken.getPosition();
        const playerSlot = this._find.closestOwnedCardHolderOwner(pos);
        const seatIndex = TI4.playerSeats
            .getAllSeats()
            .findIndex((seat) => seat.playerSlot === playerSlot);
        if (seatIndex === -1) {
            throw new Error("missing speaker token seat index");
        }
        return seatIndex;
    }
    _getVotingDirection() {
        let dir = 1;
        const skipContained = true;
        for (const obj of api_1.world.getAllObjects(skipContained)) {
            const nsid = ttpg_darrell_1.NSID.get(obj);
            if (REVERSE_ORDER_NSIDS.has(nsid)) {
                dir = -1;
                break;
            }
        }
        return dir;
    }
    _getZealPlayerSlots() {
        const zealPlayerSlots = [];
        const playerSlotToFaction = TI4.factionRegistry.getPlayerSlotToFaction();
        for (const [playerSlot, faction] of playerSlotToFaction) {
            if (faction.getAbilityNsids().includes("faction-ability:pok/zeal")) {
                zealPlayerSlots.push(playerSlot);
            }
        }
        return zealPlayerSlots;
    }
    /**
     * "When" and "after" resolve order.
     *
     * [2.9] Players take turns resolving action cards starting with the
     * speaker and proceeding clockwise.
     *
     * @returns {Array.{PlayerDesk}}
     */
    getWhensOrAftersOrder() {
        const speakerSeatIndex = this._getSpeakerTokenSeatIndexOrThrow();
        const seatPlayerSlots = TI4.playerSeats
            .getAllSeats()
            .map((seat) => seat.playerSlot);
        const order = [
            ...seatPlayerSlots.slice(speakerSeatIndex),
            ...seatPlayerSlots.slice(0, speakerSeatIndex),
        ];
        return order;
    }
    /**
     * [8.2] Each player, starting with the player to the left of the
     * speaker and continuing clockwise, can cast votes for an outcome
     * of the current agenda.
     */
    getVotingOrder() {
        // Check if reversed direction.
        const dir = this._getVotingDirection();
        const seatPlayerSlots = TI4.playerSeats
            .getAllSeats()
            .map((seat) => seat.playerSlot);
        const speakerSeatIndex = this._getSpeakerTokenSeatIndexOrThrow();
        const firstVoterIndex = (speakerSeatIndex + dir) % seatPlayerSlots.length;
        const order = [];
        for (let i = 0; i < seatPlayerSlots.length; i++) {
            const index = (firstVoterIndex + i * dir + seatPlayerSlots.length) %
                seatPlayerSlots.length;
            const playerSlot = seatPlayerSlots[index];
            if (playerSlot !== undefined) {
                order.push(playerSlot);
            }
        }
        // If "Zeal" (Argent) is in game, they always vote first.
        // Allow more than one, preserving order.
        const zealPlayerSlots = this._getZealPlayerSlots();
        for (const zealPlayerSlot of zealPlayerSlots) {
            const index = order.indexOf(zealPlayerSlot);
            if (index !== -1) {
                order.splice(index, 1);
            }
        }
        for (const zealPlayerSlot of zealPlayerSlots) {
            order.unshift(zealPlayerSlot);
        }
        return order;
    }
}
exports.AgendaTurnOrder = AgendaTurnOrder;
//# sourceMappingURL=agenda-turn-order.js.map