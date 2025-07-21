"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatorPlayerPlanetTotals = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
class UpdatorPlayerPlanetTotals {
    constructor() {
        this._cardUtil = new ttpg_darrell_1.CardUtil();
        this._find = new ttpg_darrell_1.Find();
    }
    update(gameData) {
        const planetCards = [];
        // Find planet cards in the world.
        const skipContained = true;
        const allowFaceDown = true;
        for (const obj of api_1.world.getAllObjects(skipContained)) {
            const nsid = ttpg_darrell_1.NSID.get(obj);
            if (obj instanceof api_1.Card &&
                nsid.startsWith("card.planet:") &&
                this._cardUtil.isLooseCard(obj, allowFaceDown)) {
                planetCards.push(obj);
            }
        }
        // Sort planet cards by player slot.
        const playerSlotToCards = new Map();
        planetCards.forEach((card) => {
            const pos = card.getPosition();
            const playerSlot = this._find.closestOwnedCardHolderOwner(pos);
            let cards = playerSlotToCards.get(playerSlot);
            if (!cards) {
                cards = [];
                playerSlotToCards.set(playerSlot, cards);
            }
            cards.push(card);
        });
        gameData.players.forEach((player, seatIndex) => {
            var _a;
            const playerSlot = TI4.playerSeats.getPlayerSlotBySeatIndex(seatIndex);
            const data = {
                influence: { avail: 0, total: 0 },
                resources: { avail: 0, total: 0 },
                techs: { blue: 0, red: 0, green: 0, yellow: 0 },
                traits: { cultural: 0, hazardous: 0, industrial: 0 },
                legendary: 0,
            };
            const cards = (_a = playerSlotToCards.get(playerSlot)) !== null && _a !== void 0 ? _a : [];
            cards.forEach((card) => {
                const nsid = ttpg_darrell_1.NSID.get(card);
                const isFaceUp = card.isFaceUp();
                const planet = TI4.systemRegistry.getPlanetByPlanetCardNsid(nsid);
                if (planet) {
                    data.influence.total += planet.getInfluence();
                    data.resources.total += planet.getResources();
                    if (isFaceUp) {
                        data.influence.avail += planet.getInfluence();
                        data.resources.avail += planet.getResources();
                    }
                    data.techs.blue += planet
                        .getTechs()
                        .filter((tech) => tech === "blue").length;
                    data.techs.red += planet
                        .getTechs()
                        .filter((tech) => tech === "red").length;
                    data.techs.green += planet
                        .getTechs()
                        .filter((tech) => tech === "green").length;
                    data.techs.yellow += planet
                        .getTechs()
                        .filter((tech) => tech === "yellow").length;
                    data.traits.cultural += planet
                        .getTraits()
                        .filter((trait) => trait === "cultural").length;
                    data.traits.hazardous += planet
                        .getTraits()
                        .filter((trait) => trait === "hazardous").length;
                    data.traits.industrial += planet
                        .getTraits()
                        .filter((trait) => trait === "industrial").length;
                    if (planet.isLegendary()) {
                        data.legendary += 1;
                    }
                }
            });
            player.planetTotals = data;
        });
    }
}
exports.UpdatorPlayerPlanetTotals = UpdatorPlayerPlanetTotals;
//# sourceMappingURL=updator-player-planet-totals.js.map