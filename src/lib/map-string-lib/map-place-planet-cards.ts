import { Card } from "@tabletop-playground/api";
import { CardUtil, Find, NSID } from "ttpg-darrell";
import { Planet } from "../system-lib/planet/planet";

export class MapPlacePlanetCards {
  static getAllPlanets(): Array<Planet> {
    const planets: Array<Planet> = [];
    const skipContained: boolean = true;
    TI4.systemRegistry
      .getAllSystemsWithObjs(skipContained)
      .forEach((system) => {
        system.getPlanets().forEach((planet) => {
          planets.push(planet);
        });
      });
    return planets;
  }

  static getPlanetNsidSet(planets: Array<Planet>): Set<string> {
    const nsids: Set<string> = new Set();
    planets.forEach((planet) => {
      const nsid: string = planet.getPlanetCardNsid();
      nsids.add(nsid);
    });
    return nsids;
  }

  static getActivePlanetsDeck(nsids: Set<string>): Card | undefined {
    // Find the total planets deck.
    let planetsDeck: Card | undefined = new Find().findDeckOrDiscard(
      "deck-planet"
    );

    // Filter down to the planets that are in the game.
    if (planetsDeck) {
      planetsDeck = new CardUtil().filterCards(
        planetsDeck,
        (nsid: string): boolean => {
          return nsids.has(nsid);
        }
      );
    }
    return planetsDeck;
  }

  static getPlanetCards(): Map<Planet, Card> {
    const planetToCard: Map<Planet, Card> = new Map();

    const nsids: Set<string> = new Set();
    const planets: Array<Planet> = MapPlacePlanetCards.getAllPlanets();
    planets.forEach((planet) => {
      const nsid: string = planet.getPlanetCardNsid();
      nsids.add(nsid);
    });

    const planetsDeck: Card | undefined =
      MapPlacePlanetCards.getActivePlanetsDeck(nsids);
    if (planetsDeck) {
      // Get separate cards, index by nsid.
      const nsidToCard: Map<string, Card> = new Map();
      const planetCards: Array<Card> = new CardUtil().separateDeck(planetsDeck);
      planetCards.forEach((card) => {
        const nsid: string = NSID.get(card);
        nsidToCard.set(nsid, card);
      });

      // Map planets to cards.
      planets.forEach((planet) => {
        const nsid: string = planet.getPlanetCardNsid();
        const card: Card | undefined = nsidToCard.get(nsid);
        if (card) {
          planetToCard.set(planet, card);
        }
      });
    }

    return planetToCard;
  }
}
