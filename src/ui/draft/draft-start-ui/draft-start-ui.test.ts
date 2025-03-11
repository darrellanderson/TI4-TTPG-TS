import { Milty } from "../../../lib/draft-lib/drafts/milty";
import { DraftStartUI } from "./draft-start-ui";
import { IDraft } from "../../../lib/draft-lib/drafts/idraft";

it("constructor", () => {
  const scale: number = 1;
  const idraft: IDraft = new Milty();
  const draftStartUI = new DraftStartUI(scale, idraft);
  expect(draftStartUI).toBeDefined();
});
