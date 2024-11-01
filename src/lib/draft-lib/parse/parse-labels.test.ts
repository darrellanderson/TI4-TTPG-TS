import { ParseLabels } from "./parse-labels";

it("parse", () => {
  const config: string = "labels=foo|bar&";
  const labels: Array<string> = new ParseLabels().parseLabels(config);
  expect(labels).toEqual(["foo", "bar"]);
});

it("parse (no labels)", () => {
  const config: string = "foo=bar&";
  const labels: Array<string> = new ParseLabels().parseLabels(config);
  expect(labels).toEqual([]);
});
