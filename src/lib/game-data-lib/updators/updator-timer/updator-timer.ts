import { TimerExportType } from "ttpg-darrell";
import { GameData } from "../../game-data/game-data";
import { IGameDataUpdator } from "../../i-game-data-updator/i-game-data-updator";
import { UpdatorTimerType } from "./updator-timer-type";

export class UpdatorTimer implements IGameDataUpdator {
  update(gameData: GameData): void {
    const timerExport: TimerExportType = TI4.timer.export();
    const timerType: UpdatorTimerType = {
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
