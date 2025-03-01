import { Card, Vector } from "@tabletop-playground/api";
import { CardUtil, Find, NSID } from "ttpg-darrell";
import { Planet } from "../../system-lib/planet/planet";

export class MapPlacePlanetCards {
  private readonly _cardUtil: CardUtil = new CardUtil();
  private readonly _find: Find = new Find();

  /**
   * Get all non-home planets in the game.
   *
   * @returns
   */
  _getAllPlanets(): Array<Planet> {
    const planets: Array<Planet> = [];
    const skipContained: boolean = true;
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
  _getCardNsidToPlanet(): Map<string, Planet> {
    const nsidToPlanet: Map<string, Planet> = new Map();
    const planets: Array<Planet> = this._getAllPlanets();
    planets.forEach((planet) => {
      const nsid: string = planet.getPlanetCardNsid();
      nsidToPlanet.set(nsid, planet);

      const legenedaryNsids: Array<string> = planet.getLegendaryCardNsids();
      legenedaryNsids.forEach((legendaryNsid: string): void => {
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
  _getActivePlanetsDecks(nsids: Set<string>): Array<Card> {
    const originalDecks: Array<Card> = [];

    // Add legendary planets first, cards dealt first (below normal planets).
    const legednaryDeck: Card | undefined = this._find.findDeckOrDiscard(
      "deck-legendary-planet"
    );
    if (legednaryDeck) {
      originalDecks.push(legednaryDeck);
    }

    const planetsDeck: Card | undefined =
      this._find.findDeckOrDiscard("deck-planet");
    if (planetsDeck) {
      originalDecks.push(planetsDeck);
    }

    // Filter down to the planets that are in the game.
    const activeCardsDecks: Array<Card> = [];
    for (const originalDeck of originalDecks) {
      const filteredDeck: Card | undefined = this._cardUtil.filterCards(
        originalDeck,
        (nsid: string): boolean => {
          return nsids.has(nsid);
        }
      );
      if (filteredDeck && filteredDeck.getStackSize() > 0) {
        activeCardsDecks.push(filteredDeck);
      }
    }
    return activeCardsDecks;
  }

  /**
   * Place planet cards above their respective planets.
   */
  placePlanetCards(): void {
    // Get planets, indexed by nsids (legendary planets can have multiple).
    const nsidToPlanet: Map<string, Planet> = this._getCardNsidToPlanet();

    // Get planet cards.
    const nsids: Set<string> = new Set(nsidToPlanet.keys());
    const decks: Array<Card> = this._getActivePlanetsDecks(nsids);
    for (const deck of decks) {
      const planetCards: Array<Card> = new CardUtil().separateDeck(deck);
      planetCards.forEach((card) => {
        const nsid: string = NSID.get(card);
        const planet: Planet | undefined = nsidToPlanet.get(nsid);
        if (planet) {
          this._placePlanetCard(planet, card);
        }
      });
    }
  }

  _placePlanetCard(planet: Planet, card: Card): void {
    const above: Vector = planet.getPosition().add([0, 0, 10]);
    card.setPosition(above);
    card.snapToGround();
  }
}
