import { ChangeColorUI } from "./change-color-ui";

it("static getAllColorNames", () => {
  const colorNames: Array<string> = ChangeColorUI._getAllColorNames();
  expect(colorNames).toContain("red");
});

it("constructor", () => {
  const scale: number = 1;
  new ChangeColorUI(scale);
});
