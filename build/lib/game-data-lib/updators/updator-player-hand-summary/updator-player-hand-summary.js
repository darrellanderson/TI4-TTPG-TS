"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatorPlayerHandSummary = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
class UpdatorPlayerHandSummary {
    constructor() {
        this._find = new ttpg_darrell_1.Find();
    }
    update(gameData) {
        gameData.players.forEach((player, seatIndex) => {
            const playerSlot = TI4.playerSeats.getPlayerSlotBySeatIndex(seatIndex);
            const cardHolder = this._find.findCardHolderBySlot(playerSlot);
            let actionCount = 0;
            let promissoryCount = 0;
            let secretCount = 0;
            if (cardHolder) {
                cardHolder.getCards().forEach((card) => {
                    const nsid = ttpg_darrell_1.NSID.get(card);
                    if (nsid.startsWith("card.action:")) {
                        actionCount++;
                    }
                    else if (nsid.startsWith("card.promissory")) {
                        promissoryCount++;
                    }
                    else if (nsid.startsWith("card.objective.secret:")) {
                        secretCount++;
                    }
                });
            }
            player.handSummary = {
                "Secret Objectives": secretCount,
                Actions: actionCount,
                Promissory: promissoryCount,
            };
        });
    }
}
exports.UpdatorPlayerHandSummary = UpdatorPlayerHandSummary;
//# sourceMappingURL=updator-player-hand-summary.js.map