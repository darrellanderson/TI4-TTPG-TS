import { ColorChoiceButton } from "./color-choice-button";

it("constructor, getters", () => {
  const colorHex: string = "#ff0000";
  const scale: number = 1;
  const colorChoiceButton = new ColorChoiceButton(colorHex, scale);
  colorChoiceButton.getContentButton();
});
