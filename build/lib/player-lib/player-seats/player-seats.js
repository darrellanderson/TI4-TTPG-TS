"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerSeats = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
class PlayerSeats {
    constructor() {
        this._find = new ttpg_darrell_1.Find();
        this._onStartGameComplete = () => {
            this._find = new ttpg_darrell_1.Find(); // reset the find cache
        };
    }
    init() {
        TI4.events.onStartGameComplete.add(this._onStartGameComplete);
    }
    /**
     * A readonable place to drop something in a player area.
     *
     * @param seatIndex
     * @returns
     */
    getDealPosition(playerSlot) {
        const seatIndex = this.getSeatIndexByPlayerSlot(playerSlot);
        const seats = this.getAllSeats();
        const seat = seats[seatIndex];
        let pos = new api_1.Vector(0, 0, 0);
        if (seat) {
            pos = seat.cardHolder.getPosition();
            pos.x *= 0.6;
        }
        pos.z = api_1.world.getTableHeight() + 3;
        return pos;
    }
    getAllSeats() {
        const seats = [];
        // Find all seats.
        const cardHolders = this._find.getOwnedCardHolders();
        for (const cardHolder of cardHolders) {
            const owner = cardHolder.getOwningPlayerSlot();
            const nsid = ttpg_darrell_1.NSID.get(cardHolder);
            if (nsid === "card-holder:base/player-hand") {
                seats.push({
                    cardHolder,
                    playerSlot: owner,
                });
            }
        }
        // Sort by clockwise order.
        seats.sort((a, b) => {
            const aPos = a.cardHolder.getPosition();
            const bPos = b.cardHolder.getPosition();
            const aAngle = (Math.atan2(aPos.x, aPos.y) * (180 / Math.PI) + 360) % 360;
            const bAngle = (Math.atan2(bPos.x, bPos.y) * (180 / Math.PI) + 360) % 360;
            return bAngle - aAngle;
        });
        return seats;
    }
    getPlayerSlotBySeatIndex(seatIndex) {
        var _a, _b;
        const seats = this.getAllSeats();
        return (_b = (_a = seats[seatIndex]) === null || _a === void 0 ? void 0 : _a.playerSlot) !== null && _b !== void 0 ? _b : -1;
    }
    getPlayerSlotBySeatIndexOrThrow(seatIndex) {
        const playerSlot = this.getPlayerSlotBySeatIndex(seatIndex);
        if (playerSlot === -1) {
            throw new Error(`Seat index ${seatIndex} not found.`);
        }
        return playerSlot;
    }
    getSeatIndexByPlayerSlot(playerSlot) {
        const seats = this.getAllSeats();
        return seats.findIndex((seat) => {
            return seat.playerSlot === playerSlot;
        });
    }
    getSeatIndexByPlayerSlotOrThrow(playerSlot) {
        const seatIndex = this.getSeatIndexByPlayerSlot(playerSlot);
        if (seatIndex === -1) {
            throw new Error(`Player slot ${playerSlot} not found.`);
        }
        return seatIndex;
    }
    getCardHolderByPlayerSlot(playerSlot) {
        const seats = this.getAllSeats();
        const seat = seats.find((candidate) => {
            return candidate.playerSlot === playerSlot;
        });
        return seat === null || seat === void 0 ? void 0 : seat.cardHolder;
    }
    getCardHolderByPlayerSlotOrThrow(playerSlot) {
        const cardHolder = this.getCardHolderByPlayerSlot(playerSlot);
        if (!cardHolder) {
            throw new Error(`Card holder for player slot ${playerSlot} not found.`);
        }
        return cardHolder;
    }
}
exports.PlayerSeats = PlayerSeats;
//# sourceMappingURL=player-seats.js.map