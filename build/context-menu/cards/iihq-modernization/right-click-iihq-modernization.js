"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RightClickIihqModernization = exports.PLANET_NSID = exports.LEGENDARY_NSID = exports.IIHQ_MODERNIZATION_NSID = exports.ACTION_NAME_IIHQ_MODERNIZATION = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
exports.ACTION_NAME_IIHQ_MODERNIZATION = "Fetch Custodia Vigilia planet card and legendary card";
exports.IIHQ_MODERNIZATION_NSID = "card.technology.yellow:codex.vigil/iihq-modernization";
exports.LEGENDARY_NSID = "card.legendary-planet:codex.vigil/custodia-vigilia";
exports.PLANET_NSID = "card.planet:codex.vigil/custodia-vigilia";
class RightClickIihqModernization extends ttpg_darrell_1.AbstractRightClickCard {
    constructor() {
        const customActionHandler = (object, _player, identifier) => {
            if (identifier === exports.ACTION_NAME_IIHQ_MODERNIZATION) {
                const pos = object.getPosition();
                const playerSlot = this._find.closestOwnedCardHolderOwner(pos);
                const card = this.getPlanetCard();
                if (card) {
                    this.dealCardToPlayer(card, playerSlot);
                }
                const legendaryCard = this.getLegendaryCard();
                if (legendaryCard) {
                    this.dealCardToPlayer(legendaryCard, playerSlot);
                }
            }
        };
        super(exports.IIHQ_MODERNIZATION_NSID, exports.ACTION_NAME_IIHQ_MODERNIZATION, customActionHandler);
        this._cardUtil = new ttpg_darrell_1.CardUtil();
        this._find = new ttpg_darrell_1.Find();
    }
    getPlanetCard() {
        const planetCard = this._cardUtil.fetchCard(exports.PLANET_NSID);
        return planetCard;
    }
    getLegendaryCard() {
        const legendaryCard = this._cardUtil.fetchCard(exports.LEGENDARY_NSID);
        return legendaryCard;
    }
    dealCardToPlayer(card, playerSlot) {
        this._cardUtil.dealToHolder(card, playerSlot);
    }
}
exports.RightClickIihqModernization = RightClickIihqModernization;
//# sourceMappingURL=right-click-iihq-modernization.js.map