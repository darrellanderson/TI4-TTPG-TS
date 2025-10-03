import { MockCard, MockGameObject } from "ttpg-mock";
import { ObjectiveToScored } from "./objective-to-scored";

it("constructor", () => {
  new ObjectiveToScored();
});

it("get", () => {
  const objectiveToScored: ObjectiveToScored = new ObjectiveToScored();
  let nsidToScored: Map<string, number[]>;
  let scoredBy: number[] | undefined;

  nsidToScored = objectiveToScored.nsidToScored();
  expect(nsidToScored.size).toBe(0);

  MockGameObject.simple("mat:base/objective-1");
  MockCard.simple("card.objective.public-1:base/my-objective");

  nsidToScored = objectiveToScored.nsidToScored();
  expect(nsidToScored.size).toBe(1);
  scoredBy = nsidToScored.get("card.objective.public-1:base/my-objective");
  expect(scoredBy).toEqual([]);

  MockGameObject.simple("token.control:base/arborec", { owningPlayerSlot: 1 });

  nsidToScored = objectiveToScored.nsidToScored();
  expect(nsidToScored.size).toBe(1);
  scoredBy = nsidToScored.get("card.objective.public-1:base/my-objective");
  expect(scoredBy).toEqual([1]);
});
