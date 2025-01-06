import { ChangeColorUI } from "./change-color-ui";

it("static getAllColorNames", () => {
  const colorNames: Array<string> = ChangeColorUI.getAllColorNames();
  expect(colorNames).toContain("red");
});
