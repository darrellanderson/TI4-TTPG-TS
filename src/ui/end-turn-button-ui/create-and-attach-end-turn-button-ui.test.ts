import { CreateAndAttachEndTurnButtonUI } from "./create-and-attach-end-turn-button-ui";

it("init/destroy", () => {
  const createAndAttachEndTurnButtonUI = new CreateAndAttachEndTurnButtonUI();
  createAndAttachEndTurnButtonUI.init();
  createAndAttachEndTurnButtonUI.destroy();
});
