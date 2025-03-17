import { CheckBoxUI } from "./checkbox-ui";

it("getCheckBox", () => {
  const checkBoxUi: CheckBoxUI = new CheckBoxUI(1);
  checkBoxUi.getCheckBox();
  checkBoxUi.destroy();
});
