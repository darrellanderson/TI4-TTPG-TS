import { MockImageButton, MockPlayer } from "ttpg-mock";
import { EditableButtonUI } from "./editable-button-ui";
import { ImageButton, Player } from "@tabletop-playground/api";

it("constructor/destroy", () => {
  const scale: number = 1;
  new EditableButtonUI(scale).destroy();
});

it("edit click", () => {
  const scale: number = 1;
  const editableButton: EditableButtonUI = new EditableButtonUI(scale);
  const button: ImageButton = new MockImageButton();
  const player: Player = new MockPlayer();
  editableButton._onEditClicked(button, player);
  editableButton._onEditClicked(button, player);
  editableButton._onEditTextCommitted();
});

it("getters", () => {
  const scale: number = 1;
  const editableButton: EditableButtonUI = new EditableButtonUI(scale);
  editableButton.getButton();
  editableButton.getTextBox();
  editableButton.getWidgetSwitcher();
});
