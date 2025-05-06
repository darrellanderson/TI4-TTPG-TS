import { NucleusDraft } from "./nucleus";

it("getDraftName", () => {
  const nucleus = new NucleusDraft();
  expect(nucleus.getDraftName()).toBe("Nucleus Draft");
});

it("getGenerateSlicesParams", () => {
  const nucleus = new NucleusDraft();
  const params = nucleus.getGenerateSlicesParams();
  expect(params).toBeDefined();
});

it("createEmptyDraftState", () => {
  const nucleus = new NucleusDraft();
  const draftState = nucleus.createEmptyDraftState("@test/test");
  expect(draftState).toBeDefined();
});

it("_getAvailableWormholes", () => {
  const nucleus = new NucleusDraft();
  const wormholes = nucleus._getAvailableWormholes();
  expect(wormholes).toBeDefined();
});
