import { DraftState } from "../../../lib/draft-lib/draft-state/draft-state";
import { KeleresUI } from "./keleres-ui";

it("constructor", () => {
  const draftState = new DraftState("@test/test");
  new KeleresUI(draftState, 1);
});
