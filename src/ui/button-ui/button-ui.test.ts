import { ButtonUI } from "./button-ui";

it("getButton", () => {
  new ButtonUI(1).getButton();
});

it("destroy", () => {
  new ButtonUI(1).destroy();
});
