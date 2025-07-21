"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatorTurn = void 0;
class UpdatorTurn {
    update(gameData) {
        const current = TI4.turnOrder.getCurrentTurn();
        const colorName = TI4.playerColor.getSlotColorName(current);
        if (colorName) {
            gameData.turn = colorName;
        }
    }
}
exports.UpdatorTurn = UpdatorTurn;
//# sourceMappingURL=udpator-turn.js.map