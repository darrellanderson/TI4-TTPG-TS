import { EditableButtonUI } from "./editable-button-ui";

it("constructor/destroy", () => {
  const scale: number = 1;
  new EditableButtonUI(scale).destroy();
});

it("edit click", () => {
  const scale: number = 1;
  const editableButton: EditableButtonUI = new EditableButtonUI(scale);
  editableButton._onEditClicked();
  editableButton._onEditClicked();
  editableButton._onEditTextCommitted();
});

it("getters", () => {
  const scale: number = 1;
  const editableButton: EditableButtonUI = new EditableButtonUI(scale);
  editableButton.getButton();
  editableButton.getTextBox();
  editableButton.getWidgetSwitcher();
});
