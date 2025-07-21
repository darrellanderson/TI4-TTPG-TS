"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const turn_order_ui_1 = require("./turn-order-ui");
const turnOrder = [10, 11, 12, 13, 14, 15];
const direction = "forward";
const currentTurn = 10;
TI4.turnOrder.setTurnOrder(turnOrder, direction, currentTurn);
new turn_order_ui_1.TurnOrderUI().setPlayerCount(6).attachToScreen();
//# sourceMappingURL=turn-order-ui.testp.js.map