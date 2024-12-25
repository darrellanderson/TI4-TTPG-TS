import { DraftState } from "../../../lib/draft-lib/draft-state/draft-state";
import { KeleresUI } from "./keleres-ui";

it("constructor/destroy", () => {
  const draftState = new DraftState("@test/test");
  new KeleresUI(draftState, 1).destroy();
});

it("getContentButton/getBorder", () => {
  const draftState = new DraftState("@test/test");
  const keleresUI = new KeleresUI(draftState, 1);
  expect(keleresUI.getContentButton()).toBeDefined();
  expect(keleresUI.getBorder()).toBeDefined();
  keleresUI.destroy();
});
