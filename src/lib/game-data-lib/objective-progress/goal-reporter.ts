import { IGlobal } from "ttpg-darrell";
import { GOAL_DATA_ENTRIES, GoalDataEntry } from "./goal.data";
import { GoalProgressType } from "./goal-progress";

const GOAL_CYCLE_TIME_MSECS = 5000;

/**
 * Slowly cycles through the goal data entries, updates a local collection of
 * goal progress values.  Callers can fetch the current progress values.
 *
 * Is only active when streamer buddy is active.
 */
export class GoalReporter implements IGlobal {
  private readonly _goalData: ReadonlyArray<GoalDataEntry> = GOAL_DATA_ENTRIES;
  private readonly _goalNsidToProgress: Map<string, GoalProgressType> =
    new Map();

  private readonly _onStreamerBuddyChanged = (isActive: boolean): void => {
    if (this._intervalHandle) {
      clearInterval(this._intervalHandle);
      this._intervalHandle = undefined;
    }
    this._intervalIndex = 0;
    this._goalNsidToProgress.clear();

    if (isActive) {
      const intervalTime: number = Math.ceil(
        GOAL_CYCLE_TIME_MSECS / this._goalData.length
      );
      this._intervalHandle = setInterval(this._onInterval, intervalTime);
    }
  };

  private readonly _onInterval = (): void => {
    const goalData: GoalDataEntry | undefined =
      this._goalData[this._intervalIndex];

    if (goalData) {
      const goalNsid: string = goalData.nsid;
      const progress: GoalProgressType = goalData.get();
      this._goalNsidToProgress.set(goalNsid, progress);
    }

    // Advance index for next interval.
    this._intervalIndex = (this._intervalIndex + 1) % this._goalData.length;
  };

  private _intervalHandle: NodeJS.Timeout | undefined = undefined;
  private _intervalIndex: number = 0;

  constructor() {}

  init(): void {
    // Listen for streamer buddy changes.
    TI4.useStreamerBuddy.onStreamerBuddyChanged.add(
      this._onStreamerBuddyChanged
    );

    // Trigger the listener with the current state.
    this._onStreamerBuddyChanged(TI4.useStreamerBuddy.getUseStreamerBuddy());
  }

  getAllGoalDataEntries(): ReadonlyArray<GoalDataEntry> {
    return this._goalData;
  }

  getGoalProgress(nsid: string): GoalProgressType | undefined {
    return this._goalNsidToProgress.get(nsid);
  }
}
