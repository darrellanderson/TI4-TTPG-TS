"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeroMultiverseShift = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const right_click_purge_1 = require("../../right-click-purge/right-click-purge");
const unit_plastic_1 = require("../../../lib/unit-lib/unit-plastic/unit-plastic");
const glowing_token_1 = require("../../../ui/glowing-token/glowing-token");
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
class HeroMultiverseShift extends ttpg_darrell_1.AbstractRightClickCard {
    constructor() {
        const cardNsidPrefix = "card.leader.hero:pok/conservator-procyon";
        const customActionName = "*Multiverse Shift";
        const customActionHandler = (object, player, identifier) => {
            if (identifier === customActionName) {
                this._multiverseShift(object, player.getSlot());
            }
        };
        super(cardNsidPrefix, customActionName, customActionHandler);
    }
    _multiverseShift(object, playerSlot) {
        const playerName = TI4.playerName.getBySlot(playerSlot);
        const color = api_1.world.getSlotColor(playerSlot);
        const msg = `${playerName} executing Multiverse Shift!`;
        ttpg_darrell_1.Broadcast.chatAll(msg, color);
        const zeroPlanetHexes = this._getZeroPlanetHexes();
        const shipHexes = this._getShipHexes(playerSlot);
        const alreadyHaveFrontierTokenHexes = this._getAlreadyHaveFrontierTokenHexes();
        // Prune to only the hexes that contain the player's ships.
        for (const hex of zeroPlanetHexes) {
            if (!shipHexes.has(hex)) {
                zeroPlanetHexes.delete(hex);
            }
        }
        // Add frontier tokens to systems that need them.
        const z = api_1.world.getTableHeight() + 10;
        for (const hex of zeroPlanetHexes) {
            if (!alreadyHaveFrontierTokenHexes.has(hex)) {
                const pos = TI4.hex.toPosition(hex).add([0, -2.5, 0]);
                pos.z = z;
                const obj = ttpg_darrell_1.Spawn.spawnOrThrow("token.attachment.system:pok/frontier", pos);
                obj.snapToGround();
            }
        }
        // Visualize the frontier tokens that need exploring.
        const skipContained = true;
        for (const obj of api_1.world.getAllObjects(skipContained)) {
            const nsid = ttpg_darrell_1.NSID.get(obj);
            if (nsid === "token.attachment.system:pok/frontier") {
                const pos = obj.getPosition();
                const hex = TI4.hex.fromPosition(pos);
                if (zeroPlanetHexes.has(hex)) {
                    // Visualize the frontier token.
                    new glowing_token_1.GlowingToken(obj);
                }
            }
        }
        new right_click_purge_1.RightClickPurge()._purge(object, playerSlot);
    }
    /**
     * Get all system hexes that do not contain any planets.
     */
    _getZeroPlanetHexes() {
        const zeroPlanetHexes = new Set();
        const skipContained = true;
        for (const system of TI4.systemRegistry.getAllSystemsWithObjs(skipContained)) {
            if (system.getPlanets().length === 0) {
                const obj = system.getObj();
                const pos = obj.getPosition();
                const hex = TI4.hex.fromPosition(pos);
                zeroPlanetHexes.add(hex);
            }
        }
        return zeroPlanetHexes;
    }
    /**
     * Get hexes that already contain frontier tokens.
     */
    _getAlreadyHaveFrontierTokenHexes() {
        const alreadyHaveFrontierTokenHexes = new Set();
        const skipContained = true;
        for (const obj of api_1.world.getAllObjects(skipContained)) {
            const nsid = ttpg_darrell_1.NSID.get(obj);
            if (nsid === "token.attachment.system:pok/frontier") {
                const pos = obj.getPosition();
                const hex = TI4.hex.fromPosition(pos);
                alreadyHaveFrontierTokenHexes.add(hex);
            }
        }
        return alreadyHaveFrontierTokenHexes;
    }
    /**
     * Get all system hexes that contain 1 or more of the player's ships.
     *
     * @param playerSlot
     */
    _getShipHexes(playerSlot) {
        const shipHexes = new Set();
        const unitAttrsSet = TI4.unitAttrsRegistry.defaultUnitAttrsSet();
        for (const unitPlastic of unit_plastic_1.UnitPlastic.getAll()) {
            const unitAttrs = unitAttrsSet.get(unitPlastic.getUnit());
            if (unitPlastic.getOwningPlayerSlot() === playerSlot &&
                unitAttrs &&
                unitAttrs.isShip()) {
                const hex = unitPlastic.getHex();
                shipHexes.add(hex);
            }
        }
        return shipHexes;
    }
}
exports.HeroMultiverseShift = HeroMultiverseShift;
//# sourceMappingURL=hero-multiverse-shift.js.map