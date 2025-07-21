"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToggleBorders = exports.TOGGLE_BORDERS_ACTION = void 0;
const api_1 = require("@tabletop-playground/api");
exports.TOGGLE_BORDERS_ACTION = "*Toggle Borders";
class ToggleBorders {
    constructor() {
        this._onCustomActionHandler = (player, identifier) => {
            if (identifier === exports.TOGGLE_BORDERS_ACTION) {
                TI4.borders.toggleVisibility(player.getSlot());
            }
        };
    }
    init() {
        api_1.world.addCustomAction(exports.TOGGLE_BORDERS_ACTION, TI4.locale("tooltip.toggle-borders"));
        api_1.globalEvents.onCustomAction.add(this._onCustomActionHandler);
    }
}
exports.ToggleBorders = ToggleBorders;
//# sourceMappingURL=toggle-borders.js.map