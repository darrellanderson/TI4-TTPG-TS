import { GoalDataEntry } from "../../objective-progress/goal.data";
import { GameData } from "../../game-data/game-data";
import { IGameDataUpdator } from "../../i-game-data-updator/i-game-data-updator";
import {
  GoalProgressPerPlayerType,
  GoalProgressType,
} from "../../objective-progress/goal-progress";
import { UpdatorObjectiveProgressType } from "./updator-objectives-progress-type";

export class UpdatorObjectivesProgress implements IGameDataUpdator {
  update(gameData: GameData): void {
    const progress: Array<UpdatorObjectiveProgressType> = [];

    const goalData: ReadonlyArray<GoalDataEntry> =
      TI4.goalReporter.getActiveGoalDataEntries();
    goalData.forEach((goalDataEntry: GoalDataEntry): void => {
      const goalNsid: string = goalDataEntry.nsid;
      const goalProgress: GoalProgressType | undefined =
        TI4.goalReporter.getGoalProgress(goalNsid);
      if (goalProgress) {
        progress.push(this._getObjectiveProgress(goalDataEntry, goalProgress));
      }
    });

    gameData.objectivesProgress = progress;
  }

  _nsidToStage(nsid: string): number {
    let stage: number = 0;
    if (nsid.includes(".public-1:")) {
      stage = 1;
    } else if (nsid.includes(".public-2:")) {
      stage = 2;
    }
    return stage;
  }

  /**
   * Transform to the game data format.  Right now they're the same
   * except for handling undefined values ("can't happen" in practice).
   *
   * @param goalProgress
   * @returns
   */
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

  /**
   * Which seat indexes scored the goal?
   *
   * @param goalProgress
   * @returns
   */
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

  _getObjectiveProgress(
    goalDataEntry: GoalDataEntry,
    goalProgress: GoalProgressType
  ): UpdatorObjectiveProgressType {
    return {
      name: goalDataEntry.name,
      abbr: goalDataEntry.abbr,
      stage: this._nsidToStage(goalDataEntry.nsid),
      progress: {
        header: goalProgress.header,
        values: this._goalProgressToValues(goalProgress),
      },
      scoredBy: this._getProgressToScoredBy(goalProgress),
    };
  }
}
