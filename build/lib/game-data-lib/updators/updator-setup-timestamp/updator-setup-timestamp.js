"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatorSetupTimestamp = void 0;
class UpdatorSetupTimestamp {
    update(gameData) {
        gameData.setupTimestamp = TI4.config.timestamp;
    }
}
exports.UpdatorSetupTimestamp = UpdatorSetupTimestamp;
//# sourceMappingURL=updator-setup-timestamp.js.map