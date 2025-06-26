import { IGlobal } from "ttpg-darrell";
import { GoalDataEntry } from "./goal.data";
import { GoalProgressType } from "./goal-progress";
/**
 * Slowly cycles through the goal data entries, updates a local collection of
 * goal progress values.  Callers can fetch the current progress values.
 *
 * Is only active when streamer buddy is active.
 */
export declare class GoalReporter implements IGlobal {
    private readonly _goalData;
    private readonly _goalNsidToProgress;
    private readonly _onStreamerBuddyChanged;
    private readonly _onInterval;
    private _intervalHandle;
    private _intervalIndex;
    constructor();
    init(): void;
    getAllGoalDataEntries(): ReadonlyArray<GoalDataEntry>;
    getGoalProgress(nsid: string): GoalProgressType | undefined;
}
