import { UpdatorObjectivesProgress } from "./updator-objectives-progress";

it("constructor", () => {
  new UpdatorObjectivesProgress();
});

it("_goalDataEntryToStage", () => {
  const updator: UpdatorObjectivesProgress = new UpdatorObjectivesProgress();
  const stage: number = updator._goalDataEntryToStage({
    abbr: "3 INF 3 RES 3 TG",
    name: "Amass Wealth",
    nsid: "card.objective.public-1:pok/amass-wealth",
    get: () => {
      return {
        header: "my header",
        values: [],
      };
    },
  });
  expect(stage).toEqual(1);
});
