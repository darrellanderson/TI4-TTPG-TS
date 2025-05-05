import { ParseBaseMap } from "./parse-base-map";

it("parse", () => {
  const config = "base=1&other=other";
  const errors: Array<string> = [];
  const result = new ParseBaseMap().parseBaseMap(config, errors);
  expect(result).toBe("1");
  expect(errors.length).toBe(0);
});

it("parse (empty)", () => {
  const config = "base=";
  const errors: Array<string> = [];
  const result = new ParseBaseMap().parseBaseMap(config, errors);
  expect(result).toBeUndefined();
});

it("parse (missing)", () => {
  const config = "x";
  const errors: Array<string> = [];
  const result = new ParseBaseMap().parseBaseMap(config, errors);
  expect(result).toBeUndefined();
});
