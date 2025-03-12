import { IDraft } from "../../../lib/draft-lib/drafts/idraft";
import { Milty } from "../../../lib/draft-lib/drafts/milty";
import { DraftStartWindow } from "./draft-start-window";

it("constructor", () => {
  const idraft: IDraft = new Milty();
  new DraftStartWindow(idraft);
});

it("createAndAttachWindow", () => {
  const idraft: IDraft = new Milty();
  const draftStartWindow = new DraftStartWindow(idraft);
  const playerSlot: number = 10;
  draftStartWindow.createAndAttachWindow(playerSlot);
});
