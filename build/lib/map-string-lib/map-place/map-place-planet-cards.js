"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapPlacePlanetCards = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
class MapPlacePlanetCards {
    constructor() {
        this._cardUtil = new ttpg_darrell_1.CardUtil();
        this._find = new ttpg_darrell_1.Find();
    }
    /**
     * Get all non-home planets in the game.
     *
     * @returns
     */
    _getAllPlanets() {
        const planets = [];
        const skipContained = true;
        TI4.systemRegistry
            .getAllSystemsWithObjs(skipContained)
            .forEach((system) => {
            if (!system.isHome()) {
                system.getPlanets().forEach((planet) => {
                    planets.push(planet);
                });
            }
        });
        return planets;
    }
    /**
     * Get map from card nsid to planet.  Legendary planets have multiple cards.
     *
     * @returns
     */
    _getCardNsidToPlanet() {
        const nsidToPlanet = new Map();
        const planets = this._getAllPlanets();
        planets.forEach((planet) => {
            const nsid = planet.getPlanetCardNsid();
            nsidToPlanet.set(nsid, planet);
            const legenedaryNsids = planet.getLegendaryCardNsids();
            legenedaryNsids.forEach((legendaryNsid) => {
                nsidToPlanet.set(legendaryNsid, planet);
            });
        });
        return nsidToPlanet;
    }
    /**
     * Get subset decks of planet/legedary decks for the given card nsids.
     * Other (inactive) planet cards stay in their original decks.
     *
     * @param nsids
     * @returns
     */
    _getActivePlanetsDecks(nsids) {
        const originalDecks = [];
        // Add legendary planets first, cards dealt first (below normal planets).
        const legednaryDeck = this._find.findDeckOrDiscard("deck-legendary-planet");
        if (legednaryDeck) {
            originalDecks.push(legednaryDeck);
        }
        const planetsDeck = this._find.findDeckOrDiscard("deck-planet");
        if (planetsDeck) {
            originalDecks.push(planetsDeck);
        }
        // Filter down to the planets that are in the game.
        const activeCardsDecks = [];
        for (const originalDeck of originalDecks) {
            const filteredDeck = this._cardUtil.filterCards(originalDeck, (nsid) => {
                return nsids.has(nsid);
            });
            if (filteredDeck && filteredDeck.getStackSize() > 0) {
                activeCardsDecks.push(filteredDeck);
            }
        }
        return activeCardsDecks;
    }
    /**
     * Place planet cards above their respective planets.
     */
    placePlanetCards() {
        // Get planets, indexed by nsids (legendary planets can have multiple).
        const nsidToPlanet = this._getCardNsidToPlanet();
        // Get planet cards.
        const nsids = new Set(nsidToPlanet.keys());
        const decks = this._getActivePlanetsDecks(nsids);
        for (const deck of decks) {
            const planetCards = new ttpg_darrell_1.CardUtil().separateDeck(deck);
            planetCards.forEach((card) => {
                const nsid = ttpg_darrell_1.NSID.get(card);
                const planet = nsidToPlanet.get(nsid);
                if (planet) {
                    this._placePlanetCard(planet, card);
                }
            });
        }
    }
    _placePlanetCard(planet, card) {
        const above = planet.getPosition().add([0, 0, 10]);
        card.setPosition(above);
        card.snapToGround();
    }
}
exports.MapPlacePlanetCards = MapPlacePlanetCards;
//# sourceMappingURL=map-place-planet-cards.js.map