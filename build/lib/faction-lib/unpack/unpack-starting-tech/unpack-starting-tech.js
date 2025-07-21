"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnpackStartingTech = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
const abstract_unpack_1 = require("../abstract-unpack/abstract-unpack");
const find_player_tech_deck_1 = require("../../../tech-lib/find-player-tech-deck/find-player-tech-deck");
class UnpackStartingTech extends abstract_unpack_1.AbstractUnpack {
    constructor(faction, playerSlot) {
        super(faction, playerSlot);
        this._cardUtil = new ttpg_darrell_1.CardUtil();
        this._find = new ttpg_darrell_1.Find();
    }
    unpack() {
        const startingTechNsids = new Set(this.getFaction().getStartingTechNsids());
        if (startingTechNsids.size === 0) {
            return;
        }
        const techDeck = this._getTechDeckOrThrow();
        const mine = this._cardUtil.filterCards(techDeck, (nsid) => {
            return startingTechNsids.has(nsid);
        });
        if (!mine) {
            throw new Error(`Missing starting tech cards (${Array.from(startingTechNsids).join(", ")})`);
        }
        const cards = this._cardUtil.separateDeck(mine);
        for (const card of cards) {
            card.setRotation([0, 0, 180]);
            this.dealToPlayerOrThrow(card);
        }
    }
    remove() {
        const startingTechNsids = new Set(this.getFaction().getStartingTechNsids());
        const playerHand = this.getPlayerHandHolderOrThrow();
        const techDeck = this._getTechDeckOrThrow();
        for (const card of playerHand.getCards()) {
            const nsid = ttpg_darrell_1.NSID.get(card);
            if (startingTechNsids.has(nsid)) {
                card.removeFromHolder();
                techDeck.addCards(card);
            }
        }
    }
    _getTechDeckOrThrow() {
        return new find_player_tech_deck_1.FindPlayerTechDeck().getTechDeckOrThrow(this.getPlayerSlot());
    }
}
exports.UnpackStartingTech = UnpackStartingTech;
//# sourceMappingURL=unpack-starting-tech.js.map