import { UpdatorObjectivesProgress } from "./updator-objectives-progress";

it("constructor", () => {
  new UpdatorObjectivesProgress();
});

it("_goalDataEntryToName", () => {
  const updator: UpdatorObjectivesProgress = new UpdatorObjectivesProgress();
  const name: string = updator._nsidToName(
    "card.objective.public-1:source/aa-of-bb"
  );
  expect(name).toEqual("Aa of Bb");
});

it("_goalDataEntryToStage", () => {
  const updator: UpdatorObjectivesProgress = new UpdatorObjectivesProgress();
  const stage: number = updator._goalDataEntryToStage({
    abbr: "3 INF 3 RES 3 TG",
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
