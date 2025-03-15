import { DraftStartWindow } from "./draft-start-window";

it("constructor", () => {
  new DraftStartWindow();
});

it("_onDraftStartedHandler", () => {
  const draftStartWindow = new DraftStartWindow();
  const playerSlot: number = 10;
  draftStartWindow.createAndAttachWindow(playerSlot);
  draftStartWindow._onDraftStartedHandler();
});

it("createAndAttachWindow", () => {
  const draftStartWindow = new DraftStartWindow();
  const playerSlot: number = 10;
  draftStartWindow.createAndAttachWindow(playerSlot);
  draftStartWindow.createAndAttachWindow(playerSlot); // again, close old window
});
