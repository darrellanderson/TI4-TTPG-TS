import { Milty } from "./milty";

it("constructor", () => {
  new Milty();
});

it("getGenerateSlicesParams", () => {
  const milty = new Milty();
  const generateSlicesParams = milty.getGenerateSlicesParams();
  expect(generateSlicesParams).toBeDefined();
});

it("createDraftState", () => {
  const milty = new Milty();
  const draftState = milty.createDraftState("@test/milty");
  expect(draftState).toBeDefined();

  TI4.config.setPlayerCount(7);
  milty.createDraftState("@test/milty");

  TI4.config.setPlayerCount(8);
  milty.createDraftState("@test/milty");
});
