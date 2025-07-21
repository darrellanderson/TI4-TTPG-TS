"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatorTimer = void 0;
class UpdatorTimer {
    update(gameData) {
        const timerExport = TI4.timer.export();
        const timerType = {
            seconds: TI4.timer.getSeconds(),
            anchorTimestamp: timerExport.anchorTimestamp,
            anchorSeconds: timerExport.anchorValue,
            direction: TI4.timer.getDirection(),
            countDown: 0,
        };
        // When counting down expects seconds to be "total since start".
        if (timerType.direction === -1) {
            timerType.seconds = timerExport.anchorValue - timerType.seconds;
            timerType.countDown = timerExport.anchorValue;
        }
        gameData.timer = timerType;
    }
}
exports.UpdatorTimer = UpdatorTimer;
//# sourceMappingURL=updator-timer.js.map