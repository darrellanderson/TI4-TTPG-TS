"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatorTimestamp = void 0;
class UpdatorTimestamp {
    update(gameData) {
        gameData.timestamp = Math.ceil(Date.now() / 1000);
    }
}
exports.UpdatorTimestamp = UpdatorTimestamp;
//# sourceMappingURL=updator-timestamp.js.map