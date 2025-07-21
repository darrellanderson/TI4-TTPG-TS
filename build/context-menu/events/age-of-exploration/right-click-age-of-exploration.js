"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RightClickAgeOfExploration = exports.AGE_OF_EXPLORATION_ACTION_NAME = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
const system_tier_1 = require("../../../lib/system-lib/system/system-tier");
exports.AGE_OF_EXPLORATION_ACTION_NAME = "*Draw system tile";
/**
 * ACTION: ... roll 1 die, on a result of 1-4 draw a random unused red tile,
 * on a result of 5-10 draw a random unused blue tile; place that tile
 * adjacent to any border system that contains your ships.  Place a frontier
 * token in the newly placed system if it does not contain any planets.
 */
class RightClickAgeOfExploration extends ttpg_darrell_1.AbstractRightClickCard {
    constructor() {
        const cardNsidPrefix = "card.event:codex.liberation/age-of-exploration";
        const customActionHandler = (_object, _player, _identifier) => {
            // Custom action logic goes here
        };
        super(cardNsidPrefix, exports.AGE_OF_EXPLORATION_ACTION_NAME, customActionHandler);
    }
    _getAvailableLegalSystems() {
        const skipContained = false;
        return TI4.systemRegistry
            .getAllSystemsWithObjs(skipContained)
            .filter((system) => {
            return (system.getObj().getContainer() !== undefined &&
                !system.isExcludeFromDraft());
        });
    }
    _getAvailableRedSystems() {
        const systemTier = new system_tier_1.SystemTier();
        return this._getAvailableLegalSystems().filter((system) => {
            return systemTier.getTier(system) === "red";
        });
    }
    _getAvailableBlueSystems() {
        const systemTier = new system_tier_1.SystemTier();
        return this._getAvailableLegalSystems().filter((system) => {
            const tier = systemTier.getTier(system);
            return tier === "high" || tier === "med" || tier === "low";
        });
    }
    _getAvailableSystem(tileColor) {
        const systems = tileColor === "red"
            ? this._getAvailableRedSystems()
            : this._getAvailableBlueSystems();
        const index = Math.floor(Math.random() * systems.length);
        return systems[index];
    }
    _dealSystemTile(playerSlot, tileColor) {
        const system = this._getAvailableSystem(tileColor);
        if (system) {
            const obj = system.getObj();
            const pos = TI4.playerSeats.getDealPosition(playerSlot);
            const container = obj.getContainer();
            if (container) {
                container.take(obj, pos);
                obj.snapToGround();
            }
        }
    }
    _chooseTileColor() {
        const roll = Math.floor(Math.random() * 10) + 1;
        return this._colorFromRoll(roll);
    }
    _colorFromRoll(roll) {
        return roll <= 4 ? "red" : "blue";
    }
}
exports.RightClickAgeOfExploration = RightClickAgeOfExploration;
//# sourceMappingURL=right-click-age-of-exploration.js.map