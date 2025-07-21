"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnpackFactionPromissory = void 0;
const api_1 = require("@tabletop-playground/api");
const abstract_unpack_1 = require("../abstract-unpack/abstract-unpack");
const ttpg_darrell_1 = require("ttpg-darrell");
class UnpackFactionPromissory extends abstract_unpack_1.AbstractUnpack {
    constructor(faction, playerSlot) {
        super(faction, playerSlot);
        this._find = new ttpg_darrell_1.Find();
    }
    unpack() {
        const deck = this.spawnDeckAndFilterSourcesOrThrow("card.promissory:");
        this._dealPromissoryCardsAndDeleteDeck(deck);
    }
    _dealPromissoryCardsAndDeleteDeck(unfilteredPromissoryDeck) {
        const nsids = new Set(this.getFaction().getPromissoryNsids());
        const promissories = new ttpg_darrell_1.CardUtil().filterCards(unfilteredPromissoryDeck, (nsid) => {
            return nsids.has(nsid);
        });
        if (!promissories) {
            throw new Error("Missing promissory cards: " + Array.from(nsids).join(", "));
        }
        const cards = new ttpg_darrell_1.CardUtil().separateDeck(promissories);
        for (const card of cards) {
            card.setRotation([0, 0, 180]);
            this.dealToPlayerOrThrow(card);
        }
        ttpg_darrell_1.DeletedItemsContainer.destroyWithoutCopying(unfilteredPromissoryDeck);
    }
    remove() {
        const nsids = new Set(this.getFaction().getPromissoryNsids());
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
exports.UnpackFactionPromissory = UnpackFactionPromissory;
//# sourceMappingURL=unpack-faction-promissory.js.map