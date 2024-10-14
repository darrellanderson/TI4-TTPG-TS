import { EndTurnButtonUI } from "./end-turn-button-ui";

it("attach/destroy", () => {
  new EndTurnButtonUI().attachToScreen().destroy();
});
