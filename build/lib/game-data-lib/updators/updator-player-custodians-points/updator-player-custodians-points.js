"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatorPlayerCustodiansPoints = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
const api_1 = require("@tabletop-playground/api");
class UpdatorPlayerCustodiansPoints {
    constructor() {
        this._find = new ttpg_darrell_1.Find();
    }
    update(gameData) {
        var _a;
        const findNsid = "token:base/custodians";
        const findPlayerSlot = undefined;
        const skipContained = true;
        const custodiansToken = this._find.findGameObject(findNsid, findPlayerSlot, skipContained);
        const playerSlotToControlTokenCount = new Map();
        if (custodiansToken) {
            const atop = new ttpg_darrell_1.Atop(custodiansToken);
            for (const obj of api_1.world.getAllObjects(skipContained)) {
                const nsid = ttpg_darrell_1.NSID.get(obj);
                const pos = obj.getPosition();
                if (nsid.startsWith("token.control:") && atop.isAtop(pos)) {
                    const playerSlot = obj.getOwningPlayerSlot();
                    const count = (_a = playerSlotToControlTokenCount.get(playerSlot)) !== null && _a !== void 0 ? _a : 0;
                    playerSlotToControlTokenCount.set(playerSlot, count + 1);
                }
            }
        }
        gameData.players.forEach((player, seatIndex) => {
            const playerSlot = TI4.playerSeats.getPlayerSlotBySeatIndex(seatIndex);
            const count = playerSlotToControlTokenCount.get(playerSlot);
            player.custodiansPoints = count !== null && count !== void 0 ? count : 0;
        });
    }
}
exports.UpdatorPlayerCustodiansPoints = UpdatorPlayerCustodiansPoints;
//# sourceMappingURL=updator-player-custodians-points.js.map