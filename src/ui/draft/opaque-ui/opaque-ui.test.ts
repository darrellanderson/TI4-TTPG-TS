import { DraftState } from "../../../lib/draft-lib/draft-state/draft-state";
import { OpaqueUI } from "./opaque-ui";

it("constructor (minorFactions)", () => {
  const draftState: DraftState = new DraftState("@test/draft-state");
  draftState.setOpaqueType("minorFactions");

  new OpaqueUI("1", -1, draftState, 1);
});

it("constructor (unknown opaque type)", () => {
  const draftState: DraftState = new DraftState("@test/draft-state");
  draftState.setOpaqueType("__unknown__");

  expect(() => {
    new OpaqueUI("1", -1, draftState, 1);
  }).toThrow("Failed to create OpaqueUI for __unknown__ / 1");
});
