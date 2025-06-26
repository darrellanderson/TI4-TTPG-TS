import { GoalDataEntry } from "../../objective-progress/goal.data";
import { GameData } from "../../game-data/game-data";
import { IGameDataUpdator } from "../../i-game-data-updator/i-game-data-updator";
import { GoalProgressType } from "../../objective-progress/goal-progress";
import { UpdatorObjectiveProgressType } from "./updator-objectives-progress-type";
export declare class UpdatorObjectivesProgress implements IGameDataUpdator {
    update(gameData: GameData): void;
    _nsidToStage(nsid: string): number;
    /**
     * Transform to the game data format.  Right now they're the same
     * except for handling undefined values ("can't happen" in practice).
     *
     * @param goalProgress
     * @returns
     */
    _goalProgressToValues(goalProgress: GoalProgressType): Array<{
        value: string | number | boolean;
        success: boolean;
    }>;
    /**
     * Which seat indexes scored the goal?
     *
     * @param goalProgress
     * @returns
     */
    _getProgressToScoredBy(goalProgress: GoalProgressType): Array<number>;
    _getObjectiveProgress(goalDataEntry: GoalDataEntry, goalProgress: GoalProgressType): UpdatorObjectiveProgressType;
}
