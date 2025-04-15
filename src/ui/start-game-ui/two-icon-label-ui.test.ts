import { TwoIconLabel } from "./two-icon-label-ui";

it("constructor/getters", () => {
  const scale: number = 1;
  const twoIconLabel: TwoIconLabel = new TwoIconLabel(scale);
  twoIconLabel.setIcon1("a", "my-package-id");
  twoIconLabel.setIcon2("b", "my-package-id");
  twoIconLabel.setLabel("my-label");
});
