"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnpackFactionAlliance = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const abstract_unpack_1 = require("../abstract-unpack/abstract-unpack");
class UnpackFactionAlliance extends abstract_unpack_1.AbstractUnpack {
    constructor(faction, playerSlot) {
        super(faction, playerSlot);
        this._find = new ttpg_darrell_1.Find();
    }
    unpack() {
        const deck = this.spawnDeckAndFilterSourcesOrThrow("card.alliance:");
        this._dealAllianceCardsAndDeleteDeck(deck);
    }
    _dealAllianceCardsAndDeleteDeck(unfilteredAlliancesDeck) {
        const nsids = new Set(this.getFaction().getAllianceNsids());
        const alliances = new ttpg_darrell_1.CardUtil().filterCards(unfilteredAlliancesDeck, (nsid) => {
            return nsids.has(nsid);
        });
        if (!alliances) {
            throw new Error("Missing alliance cards: " + Array.from(nsids).join(", "));
        }
        const cards = new ttpg_darrell_1.CardUtil().separateDeck(alliances);
        for (const card of cards) {
            card.setRotation([0, 0, 180]);
            this.dealToPlayerOrThrow(card);
        }
        ttpg_darrell_1.DeletedItemsContainer.destroyWithoutCopying(unfilteredAlliancesDeck);
    }
    remove() {
        const nsids = new Set(this.getFaction().getAllianceNsids());
        const skipContained = true;
        for (const obj of api_1.world.getAllObjects(skipContained)) {
            const nsid = ttpg_darrell_1.NSID.get(obj);
            if (nsids.has(nsid)) {
                const pos = obj.getPosition();
                const owner = this._find.closestOwnedCardHolderOwner(pos);
                if (owner === this.getPlayerSlot()) {
                    if (obj instanceof api_1.Card) {
                        obj.removeFromHolder();
                    }
                    ttpg_darrell_1.DeletedItemsContainer.destroyWithoutCopying(obj);
                }
            }
        }
    }
}
exports.UnpackFactionAlliance = UnpackFactionAlliance;
//# sourceMappingURL=unpack-faction-alliance.js.map