import { GoalDataEntry } from "../../objective-progress/goal.data";
import { GameData } from "../../game-data/game-data";
import { IGameDataUpdator } from "../../i-game-data-updator/i-game-data-updator";
import {
  GoalProgressPerPlayerType,
  GoalProgressType,
} from "../../objective-progress/goal-progress";
import { UpdatorObjectiveProgressType } from "./updator-objectives-progress-type";

export class UpdatorObjectivesProgress implements IGameDataUpdator {
  update(_gameData: GameData): void {
    throw new Error("Method not implemented.");
  }

  _getObjectiveProgress(
    goalDataEntry: GoalDataEntry,
    goalProgress: GoalProgressType
  ): UpdatorObjectiveProgressType {
    return {
      name: this._goalDataEntryToName(goalDataEntry),
      abbr: goalDataEntry.abbr,
      stage: this._goalDataEntryToStage(goalDataEntry),
      progress: {
        header: goalProgress.header,
        values: this._goalProgressToValues(goalProgress),
        scoredBy: this._getProgressToScoredBy(goalProgress),
      },
    };
  }

  _goalDataEntryToName(goalDataEntry: GoalDataEntry): string {
    return goalDataEntry.nsid;
  }

  _goalDataEntryToStage(goalDataEntry: GoalDataEntry): number {
    let stage: number = 0;
    if (goalDataEntry.nsid.includes(".public-1:")) {
      stage = 1;
    } else if (goalDataEntry.nsid.includes(".public-2:")) {
      stage = 2;
    }
    return stage;
  }

  _goalProgressToValues(
    goalProgress: GoalProgressType
  ): Array<{ value: string | number | boolean; success: boolean }> {
    const result: Array<{
      value: string | number | boolean;
      success: boolean;
    }> = [];

    goalProgress.values.forEach(
      (value: GoalProgressPerPlayerType | undefined): void => {
        if (value) {
          result.push({
            value: value.value,
            success: value.success,
          });
        } else {
          result.push({
            value: "",
            success: false,
          });
        }
      }
    );

    return result;
  }

  _getProgressToScoredBy(goalProgress: GoalProgressType): Array<number> {
    const result: Array<number> = [];
    goalProgress.values.forEach(
      (
        value: GoalProgressPerPlayerType | undefined,
        seatIndex: number
      ): void => {
        if (value && value.success) {
          result.push(seatIndex);
        }
      }
    );
    return result;
  }
}
