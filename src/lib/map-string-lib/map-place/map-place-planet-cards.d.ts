import { Card } from "@tabletop-playground/api";
import { Planet } from "../../system-lib/planet/planet";
export declare class MapPlacePlanetCards {
    private readonly _cardUtil;
    private readonly _find;
    /**
     * Get all non-home planets in the game.
     *
     * @returns
     */
    _getAllPlanets(): Array<Planet>;
    /**
     * Get map from card nsid to planet.  Legendary planets have multiple cards.
     *
     * @returns
     */
    _getCardNsidToPlanet(): Map<string, Planet>;
    /**
     * Get subset decks of planet/legedary decks for the given card nsids.
     * Other (inactive) planet cards stay in their original decks.
     *
     * @param nsids
     * @returns
     */
    _getActivePlanetsDecks(nsids: Set<string>): Array<Card>;
    /**
     * Place planet cards above their respective planets.
     */
    placePlanetCards(): void;
    _placePlanetCard(planet: Planet, card: Card): void;
}
