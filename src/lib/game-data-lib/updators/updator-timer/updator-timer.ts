import { TimerExportType } from "ttpg-darrell";
import { GameData } from "../../game-data/game-data";
import { IGameDataUpdator } from "../../i-game-data-updator/i-game-data-updator";
import { UpdatorTimerType } from "./updator-timer-type";

export class UpdatorTimer implements IGameDataUpdator {
  update(gameData: GameData): void {
    const timerExport: TimerExportType = TI4.timer.export();
    const nowSeconds: number = Date.now() / 1000;
    const seconds: number =
      nowSeconds - timerExport.anchorTimestamp + timerExport.anchorValue;
    const timerType: UpdatorTimerType = {
      seconds, // not used by buddy
      anchorTimestamp: timerExport.anchorTimestamp,
      anchorSeconds: timerExport.anchorValue,
      direction: timerExport.active ? timerExport.direction : 0,
      countDown: 0,
    };

    if (timerType.direction === 0) {
      // Paused, buddy uses .seconds
      timerType.anchorTimestamp = 0;
      timerType.seconds = timerExport.anchorValue;
    } else if (timerType.direction === -1) {
      // Counting down, buddy uses:
      //  if (this._countDown > 0) {
      //    timerSeconds = Math.max(this._countDown - timerSeconds, 0);
      //  }
      timerType.anchorSeconds = 0;
      timerType.countDown = timerExport.anchorValue;
    }

    gameData.timer = timerType;
  }
}
