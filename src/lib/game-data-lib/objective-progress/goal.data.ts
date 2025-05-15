import { GoalProgress, GoalProgressType } from "./goal-progress";

const goalProgress: GoalProgress = new GoalProgress();

export type GoalDataEntry = {
  abbr: string;
  nsid: string;
  get: () => GoalProgressType;
};

export const GOAL_DATA_ENTRIES: Array<GoalDataEntry> = [
  {
    abbr: "3 INF 3 RES 3 TG",
    nsid: "card.objective.public-1:pok/amass-wealth",
    get: (): GoalProgressType => {
      return goalProgress.infResTgs(3);
    },
  },
];
