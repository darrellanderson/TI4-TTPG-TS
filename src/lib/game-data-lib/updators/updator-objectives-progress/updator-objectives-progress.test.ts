import { GoalProgressType } from "lib/game-data-lib/objective-progress/goal-progress";
import { UpdatorObjectivesProgress } from "./updator-objectives-progress";
import { GoalDataEntry } from "lib/game-data-lib/objective-progress/goal.data";

it("constructor", () => {
  new UpdatorObjectivesProgress();
});

it("_goalDataEntryToStage", () => {
  const updator: UpdatorObjectivesProgress = new UpdatorObjectivesProgress();
  let stage: number;

  stage = updator._nsidToStage("card.objective.public-1:source/name");
  expect(stage).toEqual(1);

  stage = updator._nsidToStage("card.objective.public-2:source/name");
});

it("_goalProgressToValues", () => {
  const updator: UpdatorObjectivesProgress = new UpdatorObjectivesProgress();

  const goalProgress: GoalProgressType = {
    header: "my-header",
    values: [
      undefined,
      { value: 2, success: false },
      { value: 3, success: true },
    ],
  };

  const result: Array<{ value: string | number | boolean; success: boolean }> =
    updator._goalProgressToValues(goalProgress);
  expect(result).toEqual([
    { value: "", success: false },
    { value: 2, success: false },
    { value: 3, success: true },
  ]);
});

it("_getProgressToScoredBy", () => {
  const updator: UpdatorObjectivesProgress = new UpdatorObjectivesProgress();

  const goalProgress: GoalProgressType = {
    header: "my-header",
    values: [
      undefined,
      { value: 2, success: false },
      { value: 3, success: true },
    ],
  };

  const result: Array<number> = updator._getProgressToScoredBy(goalProgress);
  expect(result).toEqual([2]);
});

it("_getObjectiveProgress", () => {
  const updator: UpdatorObjectivesProgress = new UpdatorObjectivesProgress();

  const goalProgress: GoalProgressType = {
    header: "my-header",
    values: [
      undefined,
      { value: 2, success: false },
      { value: 3, success: true },
    ],
  };

  const goalDataEntry: GoalDataEntry = {
    abbr: "my-abbr",
    name: "my-name",
    nsid: "card.objective.public-1:source/name",
    get: (): GoalProgressType => {
      return goalProgress;
    },
  };

  const result = updator._getObjectiveProgress(goalDataEntry, goalProgress);
  expect(result).toEqual({
    abbr: "my-abbr",
    name: "my-name",
    progress: {
      header: "my-header",
      scoredBy: [2],
      values: [
        { success: false, value: "" },
        { success: false, value: 2 },
        { success: true, value: 3 },
      ],
    },
    stage: 1,
  });
});
