import { GameObject } from "@tabletop-playground/api";
import { AbstractRightClickCard, HexType } from "ttpg-darrell";
/**
 * Empyrean hero Conservator Procyon
 *
 * ACTION: Place 1 frontier token in each system that does not contain any
 * planets and does not already have a frontier token.
 *
 * Then, explore each frontier token that is in a system that contains 1
 * or more of your ships.
 *
 * Then, purge this card.
 */
export declare class HeroMultiverseShift extends AbstractRightClickCard {
    constructor();
    _multiverseShift(object: GameObject, playerSlot: number): void;
    /**
     * Get all system hexes that do not contain any planets.
     */
    _getZeroPlanetHexes(): Set<HexType>;
    /**
     * Get hexes that already contain frontier tokens.
     */
    _getAlreadyHaveFrontierTokenHexes(): Set<HexType>;
    /**
     * Get all system hexes that contain 1 or more of the player's ships.
     *
     * @param playerSlot
     */
    _getShipHexes(playerSlot: number): Set<HexType>;
}
