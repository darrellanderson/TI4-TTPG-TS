import { EditableUI } from "./editable-ui";

it("constructor/getters", () => {
  const scale: number = 1;
  new EditableUI(scale).getEditText();
});
