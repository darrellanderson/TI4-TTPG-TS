import { UpdatorObjectivesProgress } from "./updator-objectives-progress";

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
