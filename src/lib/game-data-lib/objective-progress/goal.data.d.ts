import { GoalProgressType } from "./goal-progress";
export type GoalDataEntry = {
    abbr: string;
    name: string;
    nsid: string;
    get: () => GoalProgressType;
};
export declare const GOAL_DATA_ENTRIES: ReadonlyArray<GoalDataEntry>;
