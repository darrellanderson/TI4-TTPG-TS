import { Milty } from "./milty";

it("constructor", () => {
  new Milty();
});

it("getGenerateSlicesParams", () => {
  const milty = new Milty();
  const generateSlicesParams = milty.getGenerateSlicesParams();
  expect(generateSlicesParams).toBeDefined();
});

it("createDraftEmptyState", () => {
  const milty = new Milty();
  const draftState = milty.createEmptyDraftState("@test/milty");
  expect(draftState).toBeDefined();

  TI4.config.setPlayerCount(7);
  milty.createEmptyDraftState("@test/milty");

  TI4.config.setPlayerCount(8);
  milty.createEmptyDraftState("@test/milty");
});
