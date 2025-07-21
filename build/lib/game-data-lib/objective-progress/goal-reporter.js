"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalReporter = void 0;
const goal_data_1 = require("./goal.data");
const GOAL_CYCLE_TIME_MSECS = 5000;
/**
 * Slowly cycles through the goal data entries, updates a local collection of
 * goal progress values.  Callers can fetch the current progress values.
 *
 * Is only active when streamer buddy is active.
 */
class GoalReporter {
    constructor() {
        this._goalData = goal_data_1.GOAL_DATA_ENTRIES;
        this._goalNsidToProgress = new Map();
        this._onStreamerBuddyChanged = (isActive) => {
            if (this._intervalHandle) {
                clearInterval(this._intervalHandle);
                this._intervalHandle = undefined;
            }
            this._intervalIndex = 0;
            this._goalNsidToProgress.clear();
            if (isActive) {
                const intervalTime = Math.ceil(GOAL_CYCLE_TIME_MSECS / this._goalData.length);
                this._intervalHandle = setInterval(this._onInterval, intervalTime);
            }
        };
        this._onInterval = () => {
            const goalData = this._goalData[this._intervalIndex];
            if (goalData) {
                const goalNsid = goalData.nsid;
                const progress = goalData.get();
                this._goalNsidToProgress.set(goalNsid, progress);
            }
            // Advance index for next interval.
            this._intervalIndex = (this._intervalIndex + 1) % this._goalData.length;
        };
        this._intervalHandle = undefined;
        this._intervalIndex = 0;
    }
    init() {
        // Listen for streamer buddy changes.
        TI4.useStreamerBuddy.onStreamerBuddyChanged.add(this._onStreamerBuddyChanged);
        // Trigger the listener with the current state.
        this._onStreamerBuddyChanged(TI4.useStreamerBuddy.getUseStreamerBuddy());
    }
    getAllGoalDataEntries() {
        return this._goalData;
    }
    getGoalProgress(nsid) {
        return this._goalNsidToProgress.get(nsid);
    }
}
exports.GoalReporter = GoalReporter;
//# sourceMappingURL=goal-reporter.js.map