"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatorLaws = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
class UpdatorLaws {
    constructor() {
        this._cardUtil = new ttpg_darrell_1.CardUtil();
    }
    update(gameData) {
        const controlTokens = [];
        const lawCards = [];
        const skipContained = true;
        const allowFaceDown = false;
        const rejectSnapPointTags = [
            "discard-agenda",
            "active-agenda",
        ];
        for (const obj of api_1.world.getAllObjects(skipContained)) {
            const nsid = ttpg_darrell_1.NSID.get(obj);
            if (nsid.startsWith("card.agenda") &&
                obj instanceof api_1.Card &&
                this._cardUtil.isLooseCard(obj, allowFaceDown, rejectSnapPointTags)) {
                lawCards.push(obj);
            }
            if (nsid.startsWith("token.control:")) {
                controlTokens.push(obj);
            }
        }
        gameData.laws = lawCards
            .map((card) => {
            const cardName = card.getCardDetails().name;
            return cardName;
        })
            .filter((value, index, self) => self.indexOf(value) === index // filter to unique values
        );
        // Per-player laws (have control tokens on them).
        gameData.players.forEach((player, seatIndex) => {
            const playerSlot = TI4.playerSeats.getPlayerSlotBySeatIndex(seatIndex);
            const playerLawCards = lawCards.filter((lawCard) => {
                const atop = new ttpg_darrell_1.Atop(lawCard);
                for (const controlToken of controlTokens) {
                    const owningPlayerSlot = controlToken.getOwningPlayerSlot();
                    const pos = controlToken.getPosition();
                    const isAtop = atop.isAtop(pos);
                    if (owningPlayerSlot === playerSlot && isAtop) {
                        return true;
                    }
                }
                return false;
            });
            player.laws = playerLawCards
                .map((card) => {
                const cardName = card.getCardDetails().name;
                return cardName;
            })
                .filter((value, index, self) => self.indexOf(value) === index // filter to unique values
            );
        });
    }
}
exports.UpdatorLaws = UpdatorLaws;
//# sourceMappingURL=updator-laws.js.map