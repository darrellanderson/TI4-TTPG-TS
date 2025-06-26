import { GameObject } from "@tabletop-playground/api";
import { AbstractRightClickCard, HexType, PlayerSlot } from "ttpg-darrell";
import { UnitPlastic } from "../../../lib/unit-lib/unit-plastic/unit-plastic";
/**
 * Vuil'Raith hero It Feeds on Carrion
 *
 * ACTION: Each other player rolls a die for each of their non-fighter ships
 * that are in or adjacent to a system that contains a dimensional tear; on a
 * 1-3, capture that unit.
 *
 * If this causes a player's ground forces or fighters to be removed, also
 * capture those units.
 *
 * Then, purge this card.
 *
 * NOTES:
 *
 * If a player is blockading a vuil'raith system, they are immune.
 * Ugh, except if Nekro copies, the nekro versions do not count as blockade.
 */
export declare class HeroDimensionalAnchor extends AbstractRightClickCard {
    constructor();
    _dimensionalAnchor(object: GameObject, playerSlot: number): void;
    /**
     * Get hexes with dimensional tears.
     *
     * @param includeNekro
     * @returns
     */
    _getDimensionalTearHexes(includeNekro: boolean): Set<HexType>;
    /**
     * Get hexes adjacent to the given hexes (including the source hexes).
     *
     * @param hexes
     * @param playerSlot
     * @returns
     */
    _getInAndAdjacentHexes(hexes: Set<HexType>, playerSlot: PlayerSlot): Set<HexType>;
    /**
     * Get hexes and ships (get plastics).
     * Include fighters here to detect blockages, remove them for the final list.
     *
     * @returns
     */
    _getHexToShipsIncludingFighters(): Map<HexType, Array<UnitPlastic>>;
    _getShipOwners(ships: Array<UnitPlastic>): Set<PlayerSlot>;
    _getNonFighterShips(ships: Array<UnitPlastic>): Array<UnitPlastic>;
    _getNonBlockadedShips(ships: Array<UnitPlastic>, blockadingPlayerSlots: Set<PlayerSlot>): Array<UnitPlastic>;
}
