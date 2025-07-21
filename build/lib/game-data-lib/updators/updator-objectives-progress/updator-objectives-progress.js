"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatorObjectivesProgress = void 0;
class UpdatorObjectivesProgress {
    update(gameData) {
        const progress = [];
        const goalData = TI4.goalReporter.getAllGoalDataEntries();
        goalData.forEach((goalDataEntry) => {
            const goalNsid = goalDataEntry.nsid;
            const goalProgress = TI4.goalReporter.getGoalProgress(goalNsid);
            if (goalProgress) {
                progress.push(this._getObjectiveProgress(goalDataEntry, goalProgress));
            }
        });
        gameData.objectivesProgress = progress;
    }
    _nsidToStage(nsid) {
        let stage = 0;
        if (nsid.includes(".public-1:")) {
            stage = 1;
        }
        else if (nsid.includes(".public-2:")) {
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
    _goalProgressToValues(goalProgress) {
        const result = [];
        goalProgress.values.forEach((value) => {
            if (value) {
                result.push({
                    value: value.value,
                    success: value.success,
                });
            }
            else {
                result.push({
                    value: "",
                    success: false,
                });
            }
        });
        return result;
    }
    /**
     * Which seat indexes scored the goal?
     *
     * @param goalProgress
     * @returns
     */
    _getProgressToScoredBy(goalProgress) {
        const result = [];
        goalProgress.values.forEach((value, seatIndex) => {
            if (value && value.success) {
                result.push(seatIndex);
            }
        });
        return result;
    }
    _getObjectiveProgress(goalDataEntry, goalProgress) {
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
exports.UpdatorObjectivesProgress = UpdatorObjectivesProgress;
//# sourceMappingURL=updator-objectives-progress.js.map