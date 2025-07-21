"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeroDimensionalAnchor = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const right_click_purge_1 = require("../../right-click-purge/right-click-purge");
const system_adjacency_1 = require("../../../lib/system-lib/system-adjacency/system-adjacency");
const unit_plastic_1 = require("../../../lib/unit-lib/unit-plastic/unit-plastic");
const right_click_rift_1 = require("../../right-click-rift/right-click-rift");
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
class HeroDimensionalAnchor extends ttpg_darrell_1.AbstractRightClickCard {
    constructor() {
        const cardNsidPrefix = "card.leader.hero:pok/it-feeds-on-carrion";
        const customActionName = "*Dimensional Anchor";
        const customActionHandler = (object, player, identifier) => {
            if (identifier === customActionName) {
                this._dimensionalAnchor(object, player.getSlot());
            }
        };
        super(cardNsidPrefix, customActionName, customActionHandler);
    }
    _dimensionalAnchor(object, playerSlot) {
        const playerName = TI4.playerName.getBySlot(playerSlot);
        const color = api_1.world.getSlotColor(playerSlot);
        const msg = `${playerName} executing Dimensional Anchor!`;
        ttpg_darrell_1.Broadcast.chatAll(msg, color);
        // Hero applies to all dimensional tears, including nekro's.
        const dimensionalTearHexes = this._getDimensionalTearHexes(true); // include Nekro
        const inAndAdjacentHexes = this._getInAndAdjacentHexes(dimensionalTearHexes, playerSlot);
        // Get players blockading the vuil'raith dimensional tears (not Nekro).
        const blockadableHexes = this._getDimensionalTearHexes(false); // exclude Nekro
        const hexToShipsIncludingFighters = this._getHexToShipsIncludingFighters();
        const blockadingPlayerSlots = new Set([playerSlot]); // exlude self
        for (const hex of blockadableHexes) {
            const ships = hexToShipsIncludingFighters.get(hex);
            if (ships) {
                const owners = this._getShipOwners(ships);
                for (const owner of owners) {
                    blockadingPlayerSlots.add(owner);
                }
            }
        }
        // Get non-fighter ships from non-blockading players.
        const allNonFighterShips = [];
        for (const hex of inAndAdjacentHexes) {
            const ships = hexToShipsIncludingFighters.get(hex);
            if (ships) {
                const nonFighterShips = this._getNonFighterShips(ships);
                const nonBlockadedShips = this._getNonBlockadedShips(nonFighterShips, blockadingPlayerSlots);
                allNonFighterShips.push(...nonBlockadedShips);
            }
        }
        for (const nonFighterShip of allNonFighterShips) {
            const obj = nonFighterShip.getObj();
            const rollResult = Math.floor(Math.random() * 10) + 1;
            right_click_rift_1.RightClickRift.applyRiftResult(obj, rollResult);
        }
        new right_click_purge_1.RightClickPurge()._purge(object, playerSlot);
    }
    /**
     * Get hexes with dimensional tears.
     *
     * @param includeNekro
     * @returns
     */
    _getDimensionalTearHexes(includeNekro) {
        const hexes = new Set();
        const skipContained = true;
        for (const obj of api_1.world.getAllObjects(skipContained)) {
            const nsid = ttpg_darrell_1.NSID.get(obj);
            if (nsid === "token.attachment.system:pok/dimensional-tear.vuilraith" ||
                (includeNekro &&
                    nsid === "token.attachment.system:pok/dimensional-tear.nekro")) {
                const pos = obj.getPosition();
                const hex = TI4.hex.fromPosition(pos);
                hexes.add(hex);
            }
        }
        return hexes;
    }
    /**
     * Get hexes adjacent to the given hexes (including the source hexes).
     *
     * @param hexes
     * @param playerSlot
     * @returns
     */
    _getInAndAdjacentHexes(hexes, playerSlot) {
        const allAdjHexes = new Set(hexes); // include original hexes
        const systemAdjacency = new system_adjacency_1.SystemAdjacency();
        const faction = TI4.factionRegistry.getByPlayerSlot(playerSlot);
        for (const hex of hexes) {
            const adjHexes = systemAdjacency.getAdjHexes(hex, faction);
            for (const adjHex of adjHexes) {
                allAdjHexes.add(adjHex);
            }
        }
        return allAdjHexes;
    }
    /**
     * Get hexes and ships (get plastics).
     * Include fighters here to detect blockages, remove them for the final list.
     *
     * @returns
     */
    _getHexToShipsIncludingFighters() {
        const hexToShips = new Map();
        const unitAttrsSet = TI4.unitAttrsRegistry.defaultUnitAttrsSet();
        const unitPlastics = unit_plastic_1.UnitPlastic.getAll();
        for (const unitPlastic of unitPlastics) {
            const unitAttrs = unitAttrsSet.get(unitPlastic.getUnit());
            if (unitAttrs && unitAttrs.isShip()) {
                const hex = unitPlastic.getHex();
                let ships = hexToShips.get(hex);
                if (!ships) {
                    ships = [];
                    hexToShips.set(hex, ships);
                }
                ships.push(unitPlastic);
            }
        }
        return hexToShips;
    }
    _getShipOwners(ships) {
        const owners = new Set();
        for (const ship of ships) {
            const owner = ship.getOwningPlayerSlot();
            owners.add(owner);
        }
        return owners;
    }
    _getNonFighterShips(ships) {
        return ships.filter((ship) => {
            return ship.getUnit() !== "fighter";
        });
    }
    _getNonBlockadedShips(ships, blockadingPlayerSlots) {
        return ships.filter((ship) => {
            const owner = ship.getOwningPlayerSlot();
            return !blockadingPlayerSlots.has(owner);
        });
    }
}
exports.HeroDimensionalAnchor = HeroDimensionalAnchor;
//# sourceMappingURL=hero-dimensional-anchor.js.map