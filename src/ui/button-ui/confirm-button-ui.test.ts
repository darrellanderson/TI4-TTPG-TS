import { ButtonUI } from "./button-ui";
import { ConfirmButtonUI } from "./confirm-button-ui";

it("constructor", () => {
  const buttonUi = new ButtonUI(1);
  new ConfirmButtonUI(buttonUi);
});
