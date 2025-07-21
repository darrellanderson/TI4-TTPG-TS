"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToggleCombatWindow = exports.ACTION_TOGGLE_COMBAT = void 0;
const api_1 = require("@tabletop-playground/api");
const abstract_window_1 = require("../../ui/abstract-window/abstract-window");
const combat_ui_all_simple_1 = require("../../ui/combat-ui/combat-ui-all-simple/combat-ui-all-simple");
const unit_plastic_1 = require("../../lib/unit-lib/unit-plastic/unit-plastic");
const combat_roll_1 = require("../../lib/combat-lib/combat-roll/combat-roll");
exports.ACTION_TOGGLE_COMBAT = "*Toggle Combat";
class ToggleCombatWindow {
    constructor() {
        this._window = undefined;
        this._onSystemActivatedHandler = (system, player) => {
            this._createWindow();
            // Open for players activating or with units in the system.
            const playerSlots = this._getRelevantPlayerSlots(system, player);
            if (this._window && playerSlots.length > 1) {
                for (const playerSlot of playerSlots) {
                    if (!this._window.isAttachedForPlayer(playerSlot)) {
                        this._window.toggleForPlayer(playerSlot);
                    }
                }
            }
            // Open for PDS2 adjacent players.
            const adjPds2PlayerSlots = this._getAdjPds2PlayerSlots(system);
            if (this._window) {
                for (const playerSlot of adjPds2PlayerSlots) {
                    if (!this._window.isAttachedForPlayer(playerSlot)) {
                        this._window.toggleForPlayer(playerSlot);
                    }
                }
            }
        };
        /**
         * This window gets recreated whenever a system is activated.
         * Do not use the default toggle action, because it will move
         * to the end of the list on recreate.
         *
         * @param player
         * @param action
         */
        this.onCustomAction = (player, action) => {
            if (action === exports.ACTION_TOGGLE_COMBAT) {
                if (this._window) {
                    this._window.toggleForPlayer(player.getSlot());
                }
            }
        };
    }
    _isAttached(playerSlot) {
        return (this._window !== undefined && this._window.isAttachedForPlayer(playerSlot));
    }
    _createWindow() {
        if (this._window) {
            this._window.destroy();
            this._window = undefined;
        }
        const createAbstractUi = (params) => {
            return new combat_ui_all_simple_1.CombatUIAllSimple(params.scale, params.playerSlot);
        };
        const namespaceId = undefined;
        const windowTitle = "Combat";
        const abstractWindow = new abstract_window_1.AbstractWindow(createAbstractUi, namespaceId, windowTitle);
        this._window = abstractWindow.createWindow();
    }
    init() {
        this._createWindow(); // empty contents
        TI4.events.onSystemActivated.add(this._onSystemActivatedHandler);
        const tooltip = TI4.locale("tooltip.toggle-combat-window");
        api_1.world.addCustomAction(exports.ACTION_TOGGLE_COMBAT, tooltip);
        api_1.globalEvents.onCustomAction.add(this.onCustomAction);
    }
    /**
     * Activating player, players with units in the system, and players
     * with PDS2 adjacent.
     *
     * @returns
     */
    _getRelevantPlayerSlots(system, player) {
        const playersSlotsSet = new Set();
        // Activating player.
        playersSlotsSet.add(player.getSlot());
        // Units in system.
        const pos = system.getObj().getPosition();
        const hex = TI4.hex.fromPosition(pos);
        unit_plastic_1.UnitPlastic.getAll().forEach((unit) => {
            if (unit.getHex() === hex) {
                playersSlotsSet.add(unit.getOwningPlayerSlot());
            }
        });
        return Array.from(playersSlotsSet);
    }
    _hasAdjPds2(system, playerSlot) {
        const pos = system.getObj().getPosition();
        const hex = TI4.hex.fromPosition(pos);
        const params = {
            rollType: "spaceCannonOffense",
            hex,
            activatingPlayerSlot: playerSlot,
            rollingPlayerSlot: playerSlot,
        };
        const combatRoll = combat_roll_1.CombatRoll.createCooked(params);
        // Check ALL units for ranged space cannon, it is not just PDS!
        const unitAttrsArray = combatRoll.self.unitAttrsSet.getAll();
        for (const unitAttrs of unitAttrsArray) {
            if (combatRoll.self.hasUnitAdj(unitAttrs.getUnit())) {
                const spaceCannon = unitAttrs.getSpaceCannon();
                if (spaceCannon && spaceCannon.getRange() > 0) {
                    return true; // Found a unit with a ranged space cannon.
                }
            }
        }
        return false; // No ranged space cannon found.
    }
    _getAdjPds2PlayerSlots(system) {
        const checkPlayerSlots = TI4.playerSeats
            .getAllSeats()
            .map((playerSeat) => {
            return playerSeat.playerSlot;
        });
        return checkPlayerSlots.filter((playerSlot) => {
            return this._hasAdjPds2(system, playerSlot);
        });
    }
}
exports.ToggleCombatWindow = ToggleCombatWindow;
//# sourceMappingURL=toggle-combat-window.js.map