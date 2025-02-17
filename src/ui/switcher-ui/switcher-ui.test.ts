import { SwitcherUI } from "./switcher-ui";

it("constructor, getSwitcher", () => {
  const switcherUi: SwitcherUI = new SwitcherUI([]);
  switcherUi.switchToIndex(0);
});
