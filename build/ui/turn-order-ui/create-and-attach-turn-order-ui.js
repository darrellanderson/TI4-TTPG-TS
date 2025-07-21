"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAndAttachTurnOrderUI = void 0;
const turn_order_ui_1 = require("./turn-order-ui");
class CreateAndAttachTurnOrderUI {
    constructor() {
        this._onConfigChangedHandler = (_config) => {
            this.init();
        };
    }
    init() {
        let order = TI4.turnOrder.getTurnOrder();
        if (order.length === 0) {
            order = TI4.playerSeats.getAllSeats().map((seat) => seat.playerSlot);
            const first = order[0];
            if (first !== undefined) {
                TI4.turnOrder.setTurnOrder(order, "forward", first);
            }
        }
        if (this._turnOrderUI) {
            this.destroy();
            this._turnOrderUI = undefined;
        }
        const playerCount = TI4.config.playerCount;
        this._turnOrderUI = new turn_order_ui_1.TurnOrderUI()
            .setPlayerCount(playerCount)
            .attachToScreen();
        TI4.config.onConfigChanged.add(this._onConfigChangedHandler);
    }
    destroy() {
        if (this._turnOrderUI) {
            this._turnOrderUI.destroy();
            this._turnOrderUI = undefined;
        }
        TI4.config.onConfigChanged.remove(this._onConfigChangedHandler);
    }
}
exports.CreateAndAttachTurnOrderUI = CreateAndAttachTurnOrderUI;
//# sourceMappingURL=create-and-attach-turn-order-ui.js.map