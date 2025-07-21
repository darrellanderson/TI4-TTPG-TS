"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnpackHomePlanetCards = void 0;
const abstract_unpack_1 = require("../abstract-unpack/abstract-unpack");
const ttpg_darrell_1 = require("ttpg-darrell");
class UnpackHomePlanetCards extends abstract_unpack_1.AbstractUnpack {
    constructor(faction, playerSlot) {
        super(faction, playerSlot);
        this._cardUtil = new ttpg_darrell_1.CardUtil();
        this._find = new ttpg_darrell_1.Find();
    }
    _getHomePlanetCardsNsidsOrThrow() {
        const playerSlot = this.getPlayerSlot();
        const systemTileObj = this.getFaction().getHomeSystemTileObj(playerSlot);
        if (systemTileObj) {
            const system = TI4.systemRegistry.getBySystemTileObjId(systemTileObj.getId());
            if (system) {
                const result = [];
                for (const planet of system.getPlanets()) {
                    result.push(planet.getPlanetCardNsid());
                }
                return result;
            }
        }
        throw new Error("Could not find home system tile or system");
    }
    _getPlanetDeckOrThrow() {
        const deck = this._find.findDeckOrDiscard("deck-planet");
        if (!deck) {
            throw new Error("Could not find planet deck");
        }
        return deck;
    }
    unpack() {
        const homePlanetCardsNsids = this._getHomePlanetCardsNsidsOrThrow();
        const planetDeck = this._getPlanetDeckOrThrow();
        const cardStack = this._cardUtil.filterCards(planetDeck, (nsid) => {
            return homePlanetCardsNsids.includes(nsid);
        });
        if (cardStack) {
            const cards = this._cardUtil.separateDeck(cardStack);
            for (const card of cards) {
                card.setRotation([0, 0, 180]);
                this.dealToPlayerOrThrow(card);
            }
        }
    }
    remove() {
        const planetDeck = this._getPlanetDeckOrThrow();
        const cardHolder = this.getPlayerHandHolderOrThrow();
        for (const card of cardHolder.getCards()) {
            const nsid = ttpg_darrell_1.NSID.get(card);
            if (nsid.startsWith("card.planet:")) {
                card.removeFromHolder();
                planetDeck.addCards(card);
            }
        }
    }
}
exports.UnpackHomePlanetCards = UnpackHomePlanetCards;
//# sourceMappingURL=unpack-home-planet-cards.js.map