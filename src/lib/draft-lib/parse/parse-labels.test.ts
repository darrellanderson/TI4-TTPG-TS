import { ParseLabels } from "./parse-labels";

it("parse", () => {
  const config: string = "labels=foo|bar&";
  const labels: Array<string> | undefined = new ParseLabels().parseLabels(
    config
  );
  expect(labels).toEqual(["foo", "bar"]);
});

it("parse (no labels)", () => {
  const config: string = "foo=bar&";
  const labels: Array<string> | undefined = new ParseLabels().parseLabels(
    config
  );
  expect(labels).toBeUndefined();
});

it("parse (param exists, but empty)", () => {
  const config: string = "&labels=";
  const labels: Array<string> | undefined = new ParseLabels().parseLabels(
    config
  );
  expect(labels).toBeUndefined();
});
