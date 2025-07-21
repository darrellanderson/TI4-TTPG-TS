"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnPlayerChangedColor = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
const change_color_1 = require("../../lib/player-lib/change-color/change-color");
/**
 * Apply the player changed color event.
 */
class OnPlayerChangedColor {
    constructor() {
        this._onPlayerChangedColorHandler = (playerSlot, colorName, colorHex, clickingPlayer) => {
            const msg = `${clickingPlayer.getName()} changed a player's color`;
            ttpg_darrell_1.Broadcast.chatAll(msg);
            new change_color_1.ChangeColor(playerSlot).changeColor(colorName, colorHex);
            // Update turn order colors.
            const order = TI4.turnOrder.getTurnOrder();
            const direction = TI4.turnOrder.getDirection();
            const current = TI4.turnOrder.getCurrentTurn();
            TI4.turnOrder.setTurnOrder(order, direction, current);
        };
    }
    init() {
        TI4.events.onPlayerChangedColor.add(this._onPlayerChangedColorHandler);
    }
}
exports.OnPlayerChangedColor = OnPlayerChangedColor;
//# sourceMappingURL=on-player-changed-color.js.map