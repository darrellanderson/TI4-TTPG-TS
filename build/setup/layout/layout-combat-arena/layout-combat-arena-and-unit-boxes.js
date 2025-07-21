"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayoutCombatArenaAndUnitBoxes = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
const layout_unit_boxes_1 = require("../layout-player-area/layout-unit-boxes");
const layout_combat_arena_1 = require("./layout-combat-arena");
const layout_config_1 = require("../layout-config");
class LayoutCombatArenaAndUnitBoxes {
    constructor() {
        this._layout = new ttpg_darrell_1.LayoutObjects();
        const playerSlot = 19; // 19 for anonymous units
        const unitBoxes = new layout_unit_boxes_1.LayoutUnitBoxes(playerSlot, 6);
        const combatArena = new layout_combat_arena_1.LayoutCombatArena();
        this._layout
            .setChildDistance(layout_config_1.LayoutConfig.spacingExtraWide)
            .setIsVertical(true)
            .add(combatArena.getLayout())
            .add(unitBoxes.getLayout());
    }
    getLayout() {
        return this._layout;
    }
}
exports.LayoutCombatArenaAndUnitBoxes = LayoutCombatArenaAndUnitBoxes;
//# sourceMappingURL=layout-combat-arena-and-unit-boxes.js.map